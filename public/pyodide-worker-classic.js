// Classic worker loader for Pyodide. This file assumes pyodide assets are
// hosted under ./pyodide/v0.24.1/ relative to the site root.
self.addEventListener('message', async (ev) => {
  const msg = ev.data;
  // Track the currently active run to allow soft cancellation: when a
  // run starts, we stamp it with an id. If a 'stop' message arrives we
  // clear the active id so the run's completion is ignored.
  if (!self.__pyodideRunState) {
    self.__pyodideRunState = { currentRunId: null, currentRunPromise: null };
  }
  try {
    if (msg && msg.type === 'init') {
      // Prefer base provided by main thread for robust asset resolution.
      const base =
        msg && msg.base ? msg.base : new URL('./pyodide/v0.24.1/', self.location).toString();

      // Production: avoid noisy fetch instrumentation. Rely on worker error
      // messages for reporting failures. During development, re-enable
      // instrumentation if needed.
      try {
        importScripts(base + 'pyodide.js');
      } catch (impErr) {
        // send detailed info back to main thread
        const info = {
          phase: 'importScripts',
          base,
          error: String(impErr),
          stack: impErr && impErr.stack ? impErr.stack : null,
        };
        self.postMessage({ type: 'error', message: info });
        return;
      }
      try {
        // Before calling loadPyodide, verify the critical wasm is fetchable so
        // we can return a clearer error (404/CORS) to the main thread.
        try {
          const wasmUrl = base + 'pyodide.asm.wasm';
          const r = await fetch(wasmUrl, { method: 'HEAD', credentials: 'same-origin' });
          if (!r.ok) {
            self.postMessage({
              type: 'error',
              message: {
                phase: 'fetch_wasm',
                base,
                url: wasmUrl,
                status: r.status,
                statusText: r.statusText,
              },
            });
            return;
          }
        } catch (fetchErr) {
          self.postMessage({
            type: 'error',
            message: { phase: 'fetch_wasm', base, error: String(fetchErr) },
          });
          return;
        }
        try {
          // Verify other critical assets that loadPyodide will likely need.
          // Checking these first helps detect when the server returns index.html
          // for asset paths (which leads to JSON parse errors inside pyodide).
          const checks = [{ path: 'pyodide.asm.data' }, { path: 'python_stdlib.zip' }];
          for (const c of checks) {
            try {
              const url = base + c.path;
              const r = await fetch(url, { method: 'HEAD', credentials: 'same-origin' });
              if (!r.ok) {
                self.postMessage({
                  type: 'error',
                  message: {
                    phase: 'fetch_check_failed',
                    base,
                    path: c.path,
                    status: r.status,
                    statusText: r.statusText,
                  },
                });
                return;
              }
              const ct = r.headers.get('content-type') || '';
              // If HEAD returns text/html, likely index.html served
              if (ct.includes('text/html')) {
                self.postMessage({
                  type: 'error',
                  message: { phase: 'fetch_check_html', base, path: c.path, contentType: ct },
                });
                return;
              }
            } catch (e) {
              self.postMessage({
                type: 'error',
                message: { phase: 'fetch_check_exception', base, path: c.path, error: String(e) },
              });
              return;
            }
          }

          // @ts-ignore
          const pyodide = await self.loadPyodide({ indexURL: base });
          self.__pyodide = pyodide;
          self.postMessage({ type: 'ready', base });
        } catch (initErr) {
          // Serialize error to simple object to avoid circular / HTML-injection
          const info = {
            phase: 'loadPyodide',
            base: String(base),
            error: initErr && initErr.message ? String(initErr.message) : String(initErr),
            stack: initErr && initErr.stack ? String(initErr.stack) : null,
            hint: 'Check Network tab for which URL returned HTML (Content-Type: text/html) instead of the expected asset. Common culprits: pyodide.mjs, pyodide.asm.data, python_stdlib.zip, or any package index JSON.',
          };
          self.postMessage({ type: 'error', message: info });
        }
      } catch (outerErr) {
        self.postMessage({ type: 'error', message: { phase: 'outer', error: String(outerErr) } });
      }
      return;
    }
    if (msg && msg.type === 'run') {
      const py = self.__pyodide;
      if (!py) {
        self.postMessage({ type: 'error', message: 'Pyodide not initialized' });
        return;
      }
      const code = msg.code || '';
      const runId = msg.id || String(Date.now());
      self.__pyodideRunState.currentRunId = runId;
      // Ensure the wrapper's last expression evaluates to the captured output
      // so that runPythonAsync returns the output string (not None).
      // If main thread provided stdin, expose it to the Python runtime by
      // injecting a custom input() that consumes lines from the provided text.
      const stdinText = msg.stdin || '';
      const wrapper = `import sys, io, traceback, builtins\n__stdin_lines = ${JSON.stringify(
        (stdinText || '').split('\n')
      )}\n__stdin_index = 0\ndef input(prompt=None):\n    global __stdin_index\n    if __stdin_index >= len(__stdin_lines):\n        raise EOFError('No more input')\n    line = __stdin_lines[__stdin_index]\n    __stdin_index += 1\n    return line\nold_input = builtins.input\nbuiltins.input = input\nbuf = io.StringIO()\nold_out, old_err = sys.stdout, sys.stderr\nsys.stdout = buf\nsys.stderr = buf\ntry:\n    exec(${JSON.stringify(code)}, {})\nexcept Exception:\n    traceback.print_exc()\nfinally:\n    builtins.input = old_input\n    sys.stdout = old_out\n    sys.stderr = old_err\nbuf.getvalue()`;
      try {
        const p = py.runPythonAsync(wrapper);
        self.__pyodideRunState.currentRunPromise = p;
        const res = await p;
        // If the run id was cleared by a stop, ignore the result
        if (self.__pyodideRunState.currentRunId !== runId) {
          // silently ignore
          return;
        }
        self.postMessage({ type: 'result', id: runId, output: String(res ?? '') });
      } catch (e) {
        const info = { phase: 'run', error: String(e), stack: e && e.stack ? e.stack : null };
        // If the run was cancelled, currentRunId will be null; still report error
        if (self.__pyodideRunState.currentRunId === runId) {
          self.postMessage({ type: 'error', id: runId, message: info });
        }
      } finally {
        // clear current run state only if it matches
        if (self.__pyodideRunState.currentRunId === runId) {
          self.__pyodideRunState.currentRunId = null;
          self.__pyodideRunState.currentRunPromise = null;
        }
      }
    }
    if (msg && msg.type === 'stop') {
      // Soft stop: clear currentRunId so any running promise's completion is ignored.
      if (self.__pyodideRunState) {
        self.__pyodideRunState.currentRunId = null;
        self.__pyodideRunState.currentRunPromise = null;
      }
      self.postMessage({ type: 'stopped' });
      return;
    }
  } catch (e) {
    const info = { phase: 'unknown', error: String(e), stack: e && e.stack ? e.stack : null };
    self.postMessage({ type: 'error', message: info });
  }
});
