/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, Suspense } from 'react';
import Footer from '../components/Layout/Footer';
// lazy-load Monaco to reduce initial bundle
const Editor = React.lazy(() => import('@monaco-editor/react'));
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

export default function Pynode() {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [ready, setReady] = useState(false);
  // Mode is fixed to python; no state needed
  // terminal handles output directly
  const editorRef = useRef<import('monaco-editor').editor.IStandaloneCodeEditor | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const termContainerRef = useRef<HTMLDivElement | null>(null);
  const runIdRef = useRef(0);

  // new UI states
  const [inputPending, setInputPending] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [pyLoading, setPyLoading] = useState(false);
  const [pyError, setPyError] = useState<string | null>(null);

  // helper to append to terminal
  function appendOutput(line: string) {
    if (termRef.current) termRef.current.writeln(line);
  }

  // Create pyodide worker using Vite-friendly worker import
  function createPyodideWorker() {
    try {
      const w = new Worker(new URL('../workers/pyodideWorker.ts', import.meta.url), {
        type: 'module',
      });
      setPyLoading(true);
      setPyError(null);
      w.onmessage = (ev) => {
        const msg = ev.data;
        if (!msg) return;
        switch (msg.type) {
          case 'ready':
            setReady(true);
            setPyLoading(false);
            appendOutput('[worker] ready');
            break;
          case 'request-input': {
            const promptId = msg.promptId;
            const promptText = msg.promptText || '';
            appendOutput(`[input requested] ${promptText}`);
            setInputPending(true);
            setInputPrompt(promptText);
            // focus terminal so user can type
            setTimeout(() => termRef.current?.focus(), 50);

            if (termRef.current) {
              termRef.current.write('\r\n');
              termRef.current.write(promptText);
              let buffer = '';
              const disposable = { dispose: () => {} } as { dispose: () => void };
              const onKey = (ev: { key: string; domEvent: KeyboardEvent }) => {
                const k = ev.key;
                if (k === '\r') {
                  termRef.current?.write('\r\n');
                  w.postMessage({ type: 'input-value', promptId, value: buffer });
                  buffer = '';
                  setInputPending(false);
                  setInputPrompt('');
                  try {
                    disposable.dispose();
                  } catch {}
                  return;
                } else if (k === '\u0003') {
                  // Ctrl+C -> signal interrupt
                  termRef.current?.write('^C\r\n');
                  w.postMessage({ type: 'input-value', promptId, ctrlC: true });
                  buffer = '';
                  setInputPending(false);
                  setInputPrompt('');
                  try {
                    disposable.dispose();
                  } catch {}
                  return;
                } else if (k === '\x1b') {
                  // Esc -> cancel input
                  termRef.current?.write('\\n');
                  w.postMessage({ type: 'input-value', promptId, value: '', canceled: true });
                  buffer = '';
                  setInputPending(false);
                  setInputPrompt('');
                  try {
                    disposable.dispose();
                  } catch {}
                  return;
                } else if (k === '\b' || k === '\x7f') {
                  if (buffer.length > 0) {
                    buffer = buffer.slice(0, -1);
                    termRef.current?.write('\b \b');
                  }
                } else {
                  buffer += k;
                  termRef.current?.write(k);
                }
              };
              try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const d = termRef.current.onKey(onKey as any);
                if (d && typeof d.dispose === 'function') disposable.dispose = d.dispose.bind(d);
              } catch {}
            } else {
              const value = window.prompt(promptText) || '';
              w.postMessage({ type: 'input-value', promptId, value });
              setInputPending(false);
              setInputPrompt('');
            }
            break;
          }
          case 'stdout':
            appendOutput(String(msg.text));
            break;
          case 'stderr':
            appendOutput(`[stderr] ${String(msg.text)}`);
            break;
          case 'done':
            appendOutput('[done]');
            break;
          case 'error':
            setPyLoading(false);
            setPyError(String(msg.error || msg));
            appendOutput(`[error] ${String(msg.error)}`);
            break;
          case 'stopped':
            appendOutput('[stopped]');
            break;
          default:
            appendOutput(`[unknown message] ${JSON.stringify(msg)}`);
        }
      };
      // initialize
      w.postMessage({ type: 'init', indexURL: '/pyodide/v0.28.2/' });
      return w;
    } catch (err) {
      appendOutput(`[create worker error] ${String(err)}`);
      setPyLoading(false);
      setPyError(String(err));
      return null;
    }
  }

  // C++ worker removed

  useEffect(() => {
    // create python worker on mount
    const w = createPyodideWorker();
    setWorker(w);

    return () => {
      if (w) w.terminate();
    };
    // intentionally empty deps - mount once
  }, []);

  useEffect(() => {
    // init terminal
    const term = new Terminal({ cursorBlink: true, convertEol: true });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(termContainerRef.current as HTMLElement);
    fit.fit();
    term.writeln('Pynode console ready');
    termRef.current = term;

    const onResize = () => fit.fit();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      try {
        term.dispose();
      } catch {}
    };
  }, []);

  function run() {
    if (!worker) return appendOutput('Worker not ready');
    const code = editorRef.current?.getValue() || '';
    const id = `run-${++runIdRef.current}`;
    appendOutput(`[run ${id}]`);
    worker.postMessage({ type: 'run', id, code });
  }

  function clear() {
    if (termRef.current) {
      termRef.current.clear();
    }
  }

  function stop() {
    if (!worker) return;
    try {
      worker.postMessage({ type: 'stop' });
    } catch {}
    worker.terminate();
    setWorker(null);
    setReady(false);
    appendOutput('[worker terminated]');
    // recreate worker without reloading
    setTimeout(() => {
      const w = createPyodideWorker();
      setWorker(w);
    }, 200);
  }

  return (
    <main>
      <div className="hero">
        <p className="hero-subtitle">Pynode 6 파이썬 기반 노드 학습 페이저 (개발중)</p>
        <p>
          브라우저에서 Pyodide를 로드해 간단한 Python 코드를 실행할 수 있습니다. 초기 로드에 시간이
          걸릴 수 있습니다.
        </p>
      </div>

      <div className="content-section">
        <h2>편집기</h2>
        <div style={{ marginBottom: 8 }}>
          <strong>언어: Python (C++ 지원 제거됨)</strong>
        </div>
        <div style={{ position: 'relative' }}>
          {pyLoading && (
            <div style={{ position: 'absolute', right: 12, top: 12, zIndex: 20 }}>
              <div
                style={{
                  padding: '6px 10px',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  borderRadius: 6,
                }}
              >
                Loading Pyodide...
              </div>
            </div>
          )}
          {pyError && (
            <div style={{ position: 'absolute', left: 12, top: 12, zIndex: 20 }}>
              <div
                style={{
                  padding: '6px 10px',
                  background: '#ffdddd',
                  color: '#600',
                  borderRadius: 6,
                }}
              >
                Pyodide load error
              </div>
            </div>
          )}
          <div style={{ height: 320, border: '1px solid rgba(0,0,0,0.08)', marginBottom: 8 }}>
            <Suspense fallback={<div style={{ padding: 12 }}>Loading editor...</div>}>
              <Editor
                defaultLanguage={'python'}
                defaultValue={`print('hello from pyodide')\nfor i in range(3):\n    print(i)`}
                theme="vs-dark"
                onMount={(editor) => {
                  editorRef.current = editor;
                }}
                options={{ automaticLayout: true, fontSize: 13 }}
              />
            </Suspense>
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <>
            <button onClick={run} disabled={!ready} style={{ marginRight: 8 }}>
              Run
            </button>
            <button onClick={clear} style={{ marginRight: 8 }}>
              Clear
            </button>
            <button onClick={stop}>Stop</button>
          </>
        </div>
      </div>

      <div className="content-section">
        <h2>콘솔</h2>
        {inputPending && (
          <div style={{ marginBottom: 6 }}>
            <span
              style={{ background: '#0b5fff', color: '#fff', padding: '4px 8px', borderRadius: 6 }}
            >
              입력 대기 중: {inputPrompt}
            </span>
          </div>
        )}
        <div
          ref={termContainerRef}
          style={{ height: 200, border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}
        />
      </div>

      <Footer />
    </main>
  );
}
