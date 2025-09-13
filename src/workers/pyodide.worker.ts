// Worker that loads Pyodide from local public assets and executes code.
// This worker uses importScripts to load pyodide.js placed under
// `${BASE_URL}pyodide/v<version>/pyodide.js` (use scripts/fetch-pyodide.js to populate).

type Msg =
  | { type: 'init'; version?: string; base?: string }
  | { type: 'run'; id: string; code: string };

let pyodide: any = null;

async function initPyodide(version = '0.24.1', providedBase?: string) {
  if (pyodide) return pyodide;

  // compute base URL where public assets are served. If the main thread
  // provided an absolute base URL, prefer that. This handles cases where
  // the app is served from a subpath or different base.
  const computedBase = `${self.location.origin}${(import.meta as any).env?.BASE_URL || '/'}pyodide/v${version}/`;
  const base = providedBase || computedBase;

  // First attempt: classic import via importScripts after verifying the JS
  try {
    if (typeof importScripts === 'function') {
      const r = await fetch(base + 'pyodide.js', { method: 'GET', credentials: 'same-origin' });
      const status = r.status;
      const ct = r.headers.get('content-type') || '';
      const text = await r.text();
      const snippet = text.slice(0, 512);
      if (!r.ok) {
        throw { phase: 'fetch_pyodide_js', base, status, contentType: ct, snippet };
      }
      if (ct.includes('text/html') || snippet.trim().startsWith('<')) {
        throw { phase: 'pyodide_js_is_html', base, status, contentType: ct, snippet };
      }
      // Looks like a JS asset; attempt importScripts
      try {
        importScripts(base + 'pyodide.js');
        // @ts-ignore
        pyodide = await (self as any).loadPyodide({ indexURL: base });
        return pyodide;
      } catch (impErr) {
        throw { phase: 'importScripts', base, error: String(impErr) };
      }
    } else {
      throw new Error('importScripts not available');
    }
  } catch (firstErr) {
    // Fallback: try the ESM module (pyodide.mjs)
    try {
      const r2 = await fetch(base + 'pyodide.mjs', { method: 'GET', credentials: 'same-origin' });
      const status2 = r2.status;
      const ct2 = r2.headers.get('content-type') || '';
      const text2 = await r2.text();
      const snippet2 = text2.slice(0, 512);
      if (!r2.ok) {
        throw {
          phase: 'fetch_pyodide_mjs',
          base,
          status: status2,
          contentType: ct2,
          snippet: snippet2,
        };
      }
      if (ct2.includes('text/html') || snippet2.trim().startsWith('<')) {
        throw {
          phase: 'pyodide_mjs_is_html',
          base,
          status: status2,
          contentType: ct2,
          snippet: snippet2,
        };
      }
      // dynamic import
      try {
        const m = await import(/* @vite-ignore */ base + 'pyodide.mjs');
        pyodide = await m.loadPyodide({ indexURL: base });
        return pyodide;
      } catch (impErr2) {
        throw { phase: 'import_mjs', base, error: String(impErr2) };
      }
    } catch (secondErr) {
      const info: any = { phase: 'init_failed', base };
      if (secondErr && typeof secondErr === 'object') {
        info.details = {};
        for (const k of Object.keys(secondErr)) {
          try {
            info.details[k] = String((secondErr as any)[k]);
          } catch (_xx) {
            info.details[k] = '<<unserializable>>';
          }
        }
      } else {
        info.error = String(secondErr);
      }
      throw info;
    }
  }
}

self.onmessage = async (ev: MessageEvent) => {
  const msg = ev.data as Msg;
  try {
    if (msg.type === 'init') {
      await initPyodide(msg.version, msg.base);
      self.postMessage({ type: 'ready', base: msg.base || null });
      return;
    }

    if (msg.type === 'run') {
      if (!pyodide) {
        await initPyodide();
      }
      const code = msg.code || '';
      // Support stdin passed from the main thread by overriding builtins.input
      const stdinText = (msg as any).stdin || '';
      const wrapper = `import sys, io, traceback, builtins\n__stdin_lines = ${JSON.stringify(
        (stdinText || '').split('\n')
      )}\n__stdin_index = 0\ndef input(prompt=None):\n    global __stdin_index\n    if __stdin_index >= len(__stdin_lines):\n        raise EOFError('No more input')\n    line = __stdin_lines[__stdin_index]\n    __stdin_index += 1\n    return line\nold_input = builtins.input\nbuiltins.input = input\nbuf = io.StringIO()\nold_out, old_err = sys.stdout, sys.stderr\nsys.stdout = buf\nsys.stderr = buf\ntry:\n    exec(${JSON.stringify(code)}, {})\nexcept Exception:\n    traceback.print_exc()\nfinally:\n    builtins.input = old_input\n    sys.stdout = old_out\n    sys.stderr = old_err\nbuf.getvalue()`;

      try {
        const res = await pyodide.runPythonAsync(wrapper);
        self.postMessage({ type: 'result', id: msg.id, output: String(res ?? '') });
      } catch (e: any) {
        self.postMessage({ type: 'error', id: msg.id, message: String(e) });
      }
    }
  } catch (err: any) {
    try {
      // If err is an object produced by initPyodide, send it as-is so the
      // main thread can display structured diagnostic info. Otherwise send
      // a simple message string.
      const payload = err && typeof err === 'object' ? err : { message: String(err) };
      self.postMessage({ type: 'error', message: payload });
    } catch (e) {
      // ignore
    }
  }
};
