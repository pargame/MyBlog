import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';

type WorkerMessage =
  | { type: 'ready' }
  | { type: 'stdout'; runId: string; text: string }
  | { type: 'stderr'; runId: string; text: string }
  | { type: 'exit'; runId: string; code?: number }
  | { type: 'error'; runId: string; message?: string };

// Worker -> main may also send request-input; main -> worker will send input-value
type WorkerMessageExtended =
  | WorkerMessage
  | { type: 'request-input'; runId: string; inputId: string; prompt?: string };

const DEFAULT_CODE = `# 파이썬 코드를 입력하세요\nname=input()\nprint("Hello from Pyodide",name)\n# 여러 줄 입력 예시 사용\n# a = int(input())\n# print(a * 2)\n`;

const workerScript = String.raw`
// worker script parsed
// JS forwarder used by Python to deliver final captured output
globalThis.__forward = (runId, text) => {
  try {
    self.postMessage({ type: 'stdout', runId: runId ?? null, text: String(text) });
  } catch {
    // ignore
  }
};

self.addEventListener('message', async (ev) => {
  const data = ev.data;
  // on init, proactively load pyodide so main can show ready state
  if (data && data.type === 'init') {
    try {
      await ensurePyodide();
    } catch (e) {
      try {
        self.postMessage({ type: 'error', runId: null, message: String(e) });
      } catch {}
    }
    return;
  }
});

// Worker-level variables
let pyodideReady = false;
let pyodide = null;

async function ensurePyodide() {
  if (pyodideReady) return;
  // Load pyodide
  try {
    importScripts('https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js');
    // @ts-ignore
    pyodide = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/' });
  } catch (err) {
    try {
      self.postMessage({ type: 'stderr', runId: currentRunId, text: '[worker] pyodide load error: ' + String(err) + '\n' });
    } catch {}
    throw err;
  }

  // pipe stdout/stderr through pyodide's setStdout/setStderr if available
  try {
    if (pyodide.setStdout) {
      pyodide.setStdout({
        batched: (s) => {
          self.postMessage({ type: 'stdout', runId: currentRunId, text: String(s) });
        },
      });
    }
    if (pyodide.setStderr) {
      pyodide.setStderr({
        batched: (s) => {
          self.postMessage({ type: 'stderr', runId: currentRunId, text: String(s) });
        },
      });
    }
      // no extra test prints in production
  } catch (e) {
    // ignore if API not present
  }

  pyodideReady = true;
  self.postMessage({ type: 'ready' });
}

let currentRunId = null;
// interactive input support
let inputResolvers = {};
let inputCounter = 0;

// expose a JS function to Python via from js import getInput
globalThis.getInput = (prompt) => {
  return new Promise((resolve) => {
    try {
      const id = String(++inputCounter);
      inputResolvers[id] = resolve;
      self.postMessage({ type: 'request-input', runId: currentRunId, inputId: id, prompt: String(prompt) });
    } catch (e) {
      resolve('');
    }
  });
};

self.addEventListener('message', async (ev) => {
  const msg = ev.data;
  if (msg.type === 'run') {
    const { runId, code, stdinText } = msg;
    currentRunId = runId;
      try {
        await ensurePyodide();

      // prepare stdin and a RUN_ID visible inside Python
      const escaped = JSON.stringify(String(stdinText ?? ''));
      const rid = JSON.stringify(String(runId ?? ''));
      const setup = 'import sys, io\nRUN_ID = ' + rid + '\n' + 'sys.stdin = io.StringIO(' + escaped + ')\n';

    // run code in an isolated globals dict so per-run variables don't persist
    // between runs. Use JSON.stringify of the source so newlines and quotes
    // are safely escaped when injected into the runner wrapper.
    const sourceLiteral = JSON.stringify(String(code ?? ''));
    const wrapped =
      setup +
      '\n' +
      'import sys, io\n' +
      'buf = io.StringIO()\n' +
      'oldout = sys.stdout\n' +
      'olderr = sys.stderr\n' +
      'sys.stdout = buf\n' +
      'sys.stderr = buf\n' +
      'try:\n' +
      "    _globals = {'__name__': '__main__', 'RUN_ID': RUN_ID}\n" +
      "    code_str = " + sourceLiteral + "\n" +
      "    exec(compile(code_str, '<run>', 'exec'), _globals)\n" +
      'finally:\n' +
      '    sys.stdout = oldout\n' +
      '    sys.stderr = olderr\n' +
      "out = buf.getvalue()\n" +
      'try:\n' +
      '    from js import __forward as __post\n' +
      '    __post(RUN_ID, out)\n' +
      'except Exception:\n' +
      '    pass\n';

  // production: run without extra debug postings

      // run and stream
      try {
  // bind per-run stdout/stderr to include the explicit runId (helps if currentRunId changes)
        try {
          if (pyodide.setStdout) {
            pyodide.setStdout({ batched: (s) => { self.postMessage({ type: 'stdout', runId, text: String(s) }); } });
          }
          if (pyodide.setStderr) {
            pyodide.setStderr({ batched: (s) => { self.postMessage({ type: 'stderr', runId, text: String(s) }); } });
          }
        } catch (e) {
          // ignore per-run binding errors
        }
        // pyodide.runPythonAsync will run and return or throw
  await pyodide.runPythonAsync(wrapped);
        // run finished
        self.postMessage({ type: 'exit', runId, code: 0 });
  } catch (e) {
        // send traceback as stderr
        try {
          const txt = e.toString();
          self.postMessage({ type: 'stderr', runId, text: txt + '\n' });
        } catch (er) {
          self.postMessage({ type: 'error', runId, message: String(e) });
        }
      }
    } catch (err) {
      self.postMessage({ type: 'error', runId, message: String(err) });
    }
  } else if (msg.type === 'input-value') {
    // response from main for interactive input
    try {
      const { inputId, value } = msg;
      const r = inputResolvers && inputResolvers[inputId];
      if (r) {
        r(String(value ?? ''));
        delete inputResolvers[inputId];
      }
    } catch (e) {
      // ignore
    }
  } else if (msg.type === 'stop') {
    // best-effort: can't interrupt pyodide from worker easily; just notify and let main terminate worker
    self.postMessage({ type: 'exit', runId: msg.runId, code: 1 });
  }
});

// # sourceURL=pyodide-worker.js
`;

// WeakMap keyed by terminal element so dedupe metadata survives component remounts
const terminalWriteMeta = new WeakMap<Element, { lastMessage?: string; lastTime?: number }>();

function makeWorker() {
  // ensure charset is explicit to avoid any platform parsing quirks
  // using TextEncoder to produce explicit UTF-8 bytes for the blob
  const encoder = new TextEncoder();
  const blob = new Blob([encoder.encode(workerScript)], { type: 'text/javascript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const w = new Worker(url);
  return w;
}

const Pynode: React.FC = () => {
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [stdinText, setStdinText] = useState<string>('');
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isReadyRef = useRef<boolean>(false);
  const [running, setRunning] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const initTimeoutRef = useRef<number | null>(null);
  const clearIntervalTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    timerRef.current = window.setInterval(() => {
      if (startTimeRef.current) setElapsedMs(Date.now() - startTimeRef.current);
    }, 200);
  }, []);
  const clearTerminal = useCallback(() => {
    if (terminalRef.current) terminalRef.current.textContent = '';
  }, []);

  // writeToTerminal: append text to the terminal element, but filter out
  // internal startup/debug logs that begin with [main] or [worker].
  const writeToTerminal = useCallback((text?: string) => {
    if (!terminalRef.current || !text) return;
    const el = terminalRef.current as Element;
    let meta = terminalWriteMeta.get(el);
    if (!meta) {
      meta = {};
      terminalWriteMeta.set(el, meta);
    }
    // normalize escaped newline sequences
    const normalized = String(text).replace(/\\n/g, '\n');
    // filter internal debug prefixes
    if (/^\s*\[(?:main|worker)\]/.test(normalized)) return;
    // dedupe identical messages within 200ms
    const now = Date.now();
    if (meta.lastMessage === normalized && meta.lastTime && now - meta.lastTime < 200) return;
    meta.lastMessage = normalized;
    meta.lastTime = now;
    (terminalRef.current as HTMLDivElement).textContent += normalized;
    (terminalRef.current as HTMLDivElement).scrollTop = (
      terminalRef.current as HTMLDivElement
    ).scrollHeight;
  }, []);

  // attach handler utility so listeners are in place immediately after worker creation
  const attachWorkerListeners = useCallback(
    (w: Worker) => {
      const handler = (ev: MessageEvent<WorkerMessageExtended>) => {
        const msg = ev.data as WorkerMessageExtended;
        // use safe accessors for union fields
        // handle request-input: prefer buffered stdin, otherwise show in-terminal prompt
        if (msg.type === 'request-input') {
          const req = msg as { inputId: string; prompt?: string };
          const inputId = req.inputId;
          const prompt = req.prompt;
          if (stdinLinesRef.current && stdinLinesRef.current.length > 0) {
            const val = stdinLinesRef.current.shift() ?? '';
            try {
              w.postMessage({ type: 'input-value', inputId, value: String(val ?? '') });
            } catch {}
          } else {
            setInputRequest({ inputId, prompt });
            setInputValue('');
            // focus input field in next tick
            setTimeout(() => inputFieldRef.current?.focus(), 50);
          }
          return;
        }

        if (msg.type === 'ready') {
          setIsReady(true);
          isReadyRef.current = true;
          if (initTimeoutRef.current) {
            window.clearTimeout(initTimeoutRef.current);
            initTimeoutRef.current = null;
          }
        } else if (msg.type === 'stdout') {
          writeToTerminal(String((msg as { text?: string }).text ?? ''));
        } else if (msg.type === 'stderr') {
          writeToTerminal(String((msg as { text?: string }).text ?? ''));
        } else if (msg.type === 'exit') {
          setRunning(false);
          clearIntervalTimer();
          setElapsedMs((prev) => {
            if (startTimeRef.current) return Date.now() - startTimeRef.current;
            return prev ?? 0;
          });
          // NOTE: removed the '[process ...] exited' helper log so terminal shows only program output
        } else if (msg.type === 'error') {
          setRunning(false);
          writeToTerminal(`${(msg as { message?: string }).message ?? '[error]'}\n`);
        }
        if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      };
      const onError = (ev: ErrorEvent) => {
        // provide richer diagnostic info from worker errors
        console.error('[Pynode] worker error', ev);
        try {
          if (false && terminalRef.current) writeToTerminal();
        } catch {
          if (false && terminalRef.current) writeToTerminal();
        }
        // clear init timeout
        if (initTimeoutRef.current) {
          window.clearTimeout(initTimeoutRef.current);
          initTimeoutRef.current = null;
        }
      };
      const onMessageError = (ev: MessageEvent) => {
        console.error('[Pynode] worker messageerror', ev);
        if (false && terminalRef.current) writeToTerminal();
      };
      w.addEventListener('message', handler);
      w.addEventListener('error', onError);
      w.addEventListener('messageerror', onMessageError);
      return () => {
        try {
          w.removeEventListener('message', handler);
          w.removeEventListener('error', onError);
          w.removeEventListener('messageerror', onMessageError);
        } catch {}
      };
    },
    [clearIntervalTimer, writeToTerminal]
  );

  // keep cleanup for the currently active worker so we can replace it safely
  const workerCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // if there is an existing worker, clean it up first
    if (workerCleanupRef.current) {
      try {
        workerCleanupRef.current();
      } catch {}
      workerCleanupRef.current = null;
    }

    const w = makeWorker();
    // attach before posting init so we don't miss early messages
    const cleanup = attachWorkerListeners(w);
    workerCleanupRef.current = cleanup;
    setWorker(w);
    try {
      w.postMessage({ type: 'init' });
      if (false && terminalRef.current) writeToTerminal();
    } catch {
      if (false && terminalRef.current) writeToTerminal();
    }
    // start a safety timeout for init (12s) using isReadyRef to avoid stale closure
    initTimeoutRef.current = window.setTimeout(() => {
      if (!isReadyRef.current) {
        if (false && terminalRef.current) {
          writeToTerminal();
        }
      }
    }, 12000);

    return () => {
      try {
        if (workerCleanupRef.current) {
          workerCleanupRef.current();
          workerCleanupRef.current = null;
        } else {
          cleanup();
        }
      } catch {}
      try {
        w.terminate();
      } catch {}
    };
  }, [attachWorkerListeners, writeToTerminal]);

  // stdin lines buffer for interactive input() handling
  const stdinLinesRef = useRef<string[] | null>(null);
  // interactive input state when worker requests input
  const [inputRequest, setInputRequest] = useState<{ inputId: string; prompt?: string } | null>(
    null
  );
  const [inputValue, setInputValue] = useState<string>('');
  const inputFieldRef = useRef<HTMLInputElement | null>(null);

  const handleRun = useCallback(() => {
    if (!worker) return;
    if (running) return;
    clearTerminal();
    const id = String(Date.now());
    setRunId(id);
    setRunning(true);
    setElapsedMs(0);
    startTimer();
    // prepare stdin lines buffer: prefer textarea lines for interactive input
    stdinLinesRef.current = stdinText ? stdinText.split(/\r?\n/) : [];
    worker.postMessage({ type: 'run', runId: id, code, stdinText });
    if (false) writeToTerminal();
  }, [worker, running, code, stdinText, clearTerminal, startTimer, writeToTerminal]);

  const handleStop = useCallback(() => {
    if (!worker) return;
    if (!running) return;
    // best-effort stop: notify worker and then terminate+recreate
    const id = runId;
    try {
      worker.postMessage({ type: 'stop', runId: id });
    } catch {
      // ignore
    }
    // terminate and recreate
    try {
      worker.terminate();
    } catch {
      // ignore
    }
    // cleanup previous listeners if any
    if (workerCleanupRef.current) {
      try {
        workerCleanupRef.current();
      } catch {}
      workerCleanupRef.current = null;
    }
    const nw = makeWorker();
    // attach listeners to the new worker
    workerCleanupRef.current = attachWorkerListeners(nw);
    setWorker(nw);
    setRunning(false);
    clearIntervalTimer();
    setElapsedMs((prev) => {
      if (startTimeRef.current) return Date.now() - startTimeRef.current;
      return prev ?? 0;
    });
    if (false) writeToTerminal();
  }, [worker, runId, clearIntervalTimer, writeToTerminal, running, attachWorkerListeners]);

  // message handling is centralized in attachWorkerListeners; no extra effect needed

  const editorHeight = useMemo(() => '60vh', []);

  return (
    <div className="page-container">
      <h1>Pynode (간이 WebIDE)</h1>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Editor
            height={editorHeight}
            defaultLanguage="python"
            defaultValue={DEFAULT_CODE}
            value={code}
            onChange={(v) => setCode(v ?? '')}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>

        <div style={{ width: 420, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Sample Input</strong>
              <div>
                <button
                  onClick={handleRun}
                  disabled={!worker || running}
                  style={{ marginRight: 8 }}
                >
                  Run
                </button>
                <button onClick={handleStop} disabled={!running}>
                  Stop
                </button>
              </div>
            </div>
            <textarea
              placeholder="여기에 입력 값(배치 stdin)을 붙여넣으세요"
              value={stdinText}
              onChange={(e) => setStdinText(e.target.value)}
              style={{ width: '100%', height: 160, marginTop: 8, fontFamily: 'monospace' }}
            />
            <div style={{ marginTop: 6, fontSize: 12 }}>
              {running ? (
                <span>실행중... {elapsedMs != null ? `${Math.round(elapsedMs)} ms` : ''}</span>
              ) : (
                <span>상태: {isReady ? 'ready' : '초기화중...'}</span>
              )}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <strong>Terminal Output</strong>
            <div
              ref={terminalRef}
              style={{
                flex: 1,
                background: '#0b0b0b',
                color: '#e6e6e6',
                padding: 10,
                marginTop: 8,
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                fontSize: 13,
                borderRadius: 4,
                minHeight: 200,
              }}
            />
            {/* interactive input area shown when worker requests input */}
            {inputRequest ? (
              <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  ref={inputFieldRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={inputRequest.prompt ?? 'input:'}
                  style={{ flex: 1, fontFamily: 'monospace', padding: 6 }}
                />
                <button
                  onClick={() => {
                    try {
                      worker?.postMessage({
                        type: 'input-value',
                        inputId: inputRequest.inputId,
                        value: String(inputValue ?? ''),
                      });
                    } catch {}
                    setInputRequest(null);
                  }}
                >
                  Submit
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <p style={{ marginTop: 12 }}>
        돌아가려면 <Link to="/">홈으로</Link> 이동하세요.
      </p>
    </div>
  );
};

export default Pynode;
