/* eslint-disable @typescript-eslint/no-explicit-any */
// pyodideWorker.ts - TypeScript-friendly worker implementation

declare function importScripts(...urls: string[]): void;
declare const loadPyodide: any;

let pyodide: any = null;
const pendingInputs = new Map<string, (v: string) => void>();

function generatePromptId(): string {
  return `p-${Math.random().toString(36).slice(2, 9)}`;
}

async function init(indexURL: string) {
  try {
    importScripts(`${indexURL}pyodide.js`);
    pyodide = await loadPyodide({ indexURL });
    postMessage({ type: 'ready' });
  } catch (err) {
    postMessage({ type: 'error', error: String(err) });
  }
}

async function runCode(id: string, code: string) {
  if (!pyodide) {
    postMessage({ type: 'stderr', text: 'Pyodide not loaded. Call init first.', id });
    return;
  }

  try {
    const pyConsole = (s: any) => postMessage({ type: 'stdout', text: String(s), id });
    const pyErr = (s: any) => postMessage({ type: 'stderr', text: String(s), id });

    (globalThis as any).console = { log: pyConsole, error: pyErr };

    const requestInput = (promptText?: string) => {
      const promptId = generatePromptId();
      return new Promise<string>((resolve) => {
        pendingInputs.set(promptId, resolve);
        postMessage({ type: 'request-input', runId: id, promptId, promptText: promptText ?? '' });
      });
    };

    (globalThis as any).__request_input = requestInput;

    const usesInput = /\binput\s*\(/.test(code);
    if (usesInput) {
      const indented = code
        .split('\n')
        .map((l: string) => `    ${l}`)
        .join('\n');
      const transformed = indented.replace(/\binput\s*\(/g, 'await __input(');
      // wrapper now detects special tokens sent from main for Ctrl+C and canceled
      const wrapper = `from js import __request_input\nasync def __input(prompt=''):\n    val = await __request_input(prompt)\n    if val == \"__PY_INPUT_CTRL_C__\":\n        raise KeyboardInterrupt()\n    if val == \"__PY_INPUT_CANCELED__\":\n        return ''\n    return val\nasync def __run_wrapper():\n${transformed}\nawait __run_wrapper()`;
      await pyodide.runPythonAsync(wrapper);
    } else {
      await pyodide.runPythonAsync(code);
    }

    postMessage({ type: 'done', id });
  } catch (err: any) {
    postMessage({ type: 'stderr', text: String(err), id });
  } finally {
    for (const [, resolver] of pendingInputs) {
      try {
        resolver('');
      } catch {}
    }
    pendingInputs.clear();
  }
}

onmessage = (ev: MessageEvent) => {
  const msg = ev.data as any;
  if (!msg || !msg.type) return;
  try {
    switch (msg.type) {
      case 'init':
        init(msg.indexURL);
        break;
      case 'run':
        runCode(msg.id, msg.code);
        break;
      case 'input-value': {
        const { promptId, value, ctrlC, canceled } = msg;
        const resolver = pendingInputs.get(promptId);
        if (resolver) {
          if (ctrlC) {
            resolver('__PY_INPUT_CTRL_C__');
          } else if (canceled) {
            resolver('__PY_INPUT_CANCELED__');
          } else {
            resolver(typeof value === 'string' ? value : String(value ?? ''));
          }
          pendingInputs.delete(promptId);
        }
        break;
      }
      case 'stop':
        postMessage({ type: 'stopped' });
        break;
      default:
        postMessage({ type: 'error', error: `Unknown message type: ${String(msg.type)}` });
    }
  } catch (err) {
    postMessage({ type: 'error', error: String(err) });
  }
};
