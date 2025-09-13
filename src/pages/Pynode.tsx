import React from 'react';
import Footer from '../components/Layout/Footer';
// CodeMirror (light integration)
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

export default function Pynode() {
  const [code, setCode] = React.useState<string>(`print('Hello from Pyodide')`);
  const [output, setOutput] = React.useState<string>('');
  const [running, setRunning] = React.useState<boolean>(false);
  const [stdin, setStdin] = React.useState<string>('');
  const workerRef = React.useRef<Worker | null>(null);
  const [workerReady, setWorkerReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Determine worker mode: default to classic worker for broader compatibility.
    // To force a module worker for testing, use ?worker=module
    const params = new URLSearchParams(window.location.search);
    const useModule = params.get('worker') === 'module';
    let w: Worker;
    if (useModule) {
      // Module worker (advanced) - only if explicitly requested
      const workerUrl = new URL('../workers/pyodide.worker.ts', import.meta.url);
      w = new Worker(workerUrl, { type: 'module' });
      // minimal internal diag removed
    } else {
      // Use the prebuilt classic worker hosted in public/ by default for
      // reliable importScripts-based loading of pyodide.js
      const classicUrl = `${import.meta.env.BASE_URL}pyodide-worker-classic.js`;
      w = new Worker(classicUrl, { type: 'classic' as any });
      // minimal internal diag removed
    }
    workerRef.current = w;

    w.onmessage = (ev: MessageEvent) => {
      const msg = ev.data as any;
      // Only expose essential messages to the user console: ready, result, error.
      if (msg.type === 'ready') {
        // worker ready - do not print a message to the console
        setWorkerReady(true);
        return;
      }
      if (msg.type === 'result') {
        setOutput((o) => o + String(msg.output || msg.result || '') + '\n');
        setRunning(false);
        return;
      }
      if (msg.type === 'error') {
        const m = msg.message;
        if (m === null || m === undefined) {
          setOutput((o) => o + '[ERROR] (no message)\n');
        } else if (typeof m === 'string') {
          if (m.trim().startsWith('<')) {
            setOutput(
              (o) =>
                o +
                `[ERROR] Received HTML instead of expected asset (starts with '<'):\n${m.slice(0, 200)}...\n`
            );
          } else {
            setOutput((o) => o + '[ERROR] ' + m + '\n');
          }
        } else if (typeof m === 'object') {
          try {
            setOutput((o) => o + '[ERROR] ' + JSON.stringify(m, null, 2) + '\n');
          } catch (e) {
            setOutput((o) => o + '[ERROR] (unserializable object)\n');
          }
        } else {
          setOutput((o) => o + '[ERROR] ' + String(m) + '\n');
        }
        setRunning(false);
        return;
      }
      if (msg.type === 'stopped') {
        setOutput((o) => o + '> stopped\n');
        setRunning(false);
        return;
      }
      // ignore other noisy diagnostic messages (fetch-log, base diagnostics, etc.)
    };

    // initialize worker (loads pyodide) - provide absolute base URL so worker
    // loads assets from the correct site subpath (handles /MyBlog base).
    const basePath = (import.meta.env.BASE_URL as string) || '/';
    const base = new URL(
      `${basePath.replace(/\/$/, '')}/pyodide/v0.24.1/`,
      window.location.href
    ).toString();
    // Keep UI minimal: do not append verbose DIAG messages here. Worker will post ready/result/error.

    // Before asking the worker to init, try multiple candidate bases and pick
    // the first one that returns a JS-like pyodide.js (not HTML).
    (async () => {
      const candidates = [] as string[];
      // 1) configured BASE_URL path (may be '/MyBlog/')
      candidates.push(base);
      // 2) absolute path from origin (helpful in dev: /pyodide/...)
      candidates.push(new URL(`/pyodide/v0.24.1/`, window.location.href).toString());
      // 3) origin + BASE_URL (in case base lacked origin)
      try {
        const originPrefixed = new URL(
          `${(import.meta.env.BASE_URL as string) || '/'}pyodide/v0.24.1/`,
          window.location.origin
        ).toString();
        candidates.push(originPrefixed);
      } catch (e) {
        // ignore
      }

      let chosen: string | null = null;
      const diagnostics: any[] = [];
      for (const cand of candidates) {
        try {
          const resp = await fetch(cand + 'pyodide.js', { cache: 'no-store' });
          const text = await resp.text();
          const snippet = (text || '').slice(0, 512);
          const ct = resp.headers.get('content-type') || '';
          diagnostics.push({
            base: cand,
            status: resp.status,
            contentType: ct,
            snippetHead: snippet.slice(0, 120),
          });
          if (resp.ok && !ct.includes('text/html') && !snippet.trim().startsWith('<')) {
            chosen = cand;
            break;
          }
        } catch (err) {
          diagnostics.push({ base: cand, error: String(err) });
        }
      }

      if (!chosen) {
        // let worker attempt primary base; worker will report errors if any
        w.postMessage({ type: 'init', version: '0.24.1', base });
        return;
      }

      w.postMessage({ type: 'init', version: '0.24.1', base: chosen });
    })();

    return () => {
      try {
        w.terminate();
      } catch (e) {
        /* ignore */
      }
      workerRef.current = null;
    };
  }, []);

  // Placeholder handlers — will be wired to Worker/pyodide later
  const handleRun = () => {
    const id = String(Date.now());
    setRunning(true);
    const w = workerRef.current;
    if (!w) {
      setOutput((o) => o + '[ERROR] Worker not initialized\n');
      setRunning(false);
      return;
    }
    w.postMessage({ type: 'run', id, code, stdin });
  };

  const handleStop = () => {
    const w = workerRef.current;
    if (!w) {
      setOutput((o) => o + '[ERROR] Worker not initialized\n');
      setRunning(false);
      return;
    }
    // Soft-stop: instruct worker to cancel current run; worker will ack with 'stopped'.
    try {
      w.postMessage({ type: 'stop' });
    } catch (e) {
      // If posting fails, fall back to terminate/ recreate
      try {
        w.terminate();
      } catch (err) {}
      workerRef.current = null;
      setWorkerReady(false);
    }
    setOutput((o) => o + '> 실행 중지\n');
    setRunning(false);
  };

  const handleLoadExample = () => {
    setCode(['# 예제: 간단한 계산', 'for i in range(3):', "    print('n =', i)", ''][0]);
  };

  const handleClearOutput = () => setOutput('');

  return (
    <main>
      <div className="hero">
        <p className="hero-subtitle">Pynode — 파이썬 기반 노드 학습 실습 페이지 (개발중)</p>
        <p>
          이 페이지는 노드 기반 다이어그램과 파이썬을 연계한 학습/실험 공간으로 사용될 예정입니다.
        </p>
      </div>

      <div className="content-section">
        <h2>실습</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 12 }}>
          <div>
            <div style={{ marginBottom: 8 }}>
              <button
                onClick={handleRun}
                disabled={!workerReady || running}
                style={{ marginRight: 8 }}
              >
                Run
              </button>
              <button onClick={handleStop} disabled={!running} style={{ marginRight: 8 }}>
                Stop
              </button>
              <button onClick={handleLoadExample} style={{ marginRight: 8 }}>
                Load Example
              </button>
              <button onClick={handleClearOutput}>Clear Output</button>
            </div>

            <div style={{ border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' }}>
              <CodeMirror
                value={code}
                height="360px"
                extensions={[python()]}
                onChange={(value: string) => setCode(value)}
                basicSetup={{
                  foldGutter: false,
                }}
                style={{ fontFamily: 'monospace', fontSize: 13 }}
              />
            </div>
          </div>

          <div>
            <h3>Console</h3>
            <div
              style={{
                width: '100%',
                height: 420,
                background: '#0b1020',
                color: '#d6e6ff',
                padding: 10,
                overflow: 'auto',
                borderRadius: 6,
                fontFamily: 'monospace',
                fontSize: 13,
              }}
            >
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{output}</pre>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>소개</h2>
        <p>
          Pynode는 파이썬 코드로 그래프 노드의 동작을 정의하고 시각화하는 실습을 목표로 합니다.
          현재는 기본 개념과 예제 코드를 정리하는 문서 역할만 합니다.
        </p>
      </div>

      <div className="content-section">
        <h2>계획</h2>
        <ul>
          <li>노드/엣지 데이터 모델 정의</li>
          <li>파이썬 코드와 프론트엔드 시각화 연동 (WebSocket / REST)</li>
          <li>인터랙티브 예제 및 튜토리얼</li>
        </ul>
      </div>

      <Footer />
    </main>
  );
}
