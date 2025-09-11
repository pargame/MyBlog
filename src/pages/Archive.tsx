import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// vis-network is loaded at runtime via a lightweight loader to avoid bundling

type Node = { id: string; label: string };
type Edge = { from: string; to: string };

export default function Archive() {
  const { folder } = useParams<{ folder: string }>();
  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);

  React.useEffect(() => {
    if (!folder) return;
    // load all markdown files under contents/Archives/<folder>
    // Vite requires a static glob string; load all Archives files then filter by folder
    const modules = import.meta.glob('../../contents/Archives/*/*.md', {
      query: '?raw',
      import: 'default',
    }) as Record<string, () => Promise<string>>;
    const allKeys = Object.keys(modules);
    const keys = allKeys.filter((k) =>
      k.toLowerCase().includes(`/${String(folder).toLowerCase()}/`)
    );

    // Create nodes for each file and edges by simple content-link heuristic: [[slug]] occurrences
    const fileNodes: Node[] = keys.map((k) => {
      const parts = k.split('/');
      const name = parts[parts.length - 1].replace(/\.md$/i, '');
      return { id: name, label: name };
    });

    const loaders = keys.map((k) => (modules as Record<string, () => Promise<string>>)[k]);
    Promise.all(loaders.map((fn) => fn()))
      .then((vals) => {
        const linkRegex = /\[\[([^\]]+)\]\]/g;
        const newEdges: Edge[] = [];
        // use a Set of sorted pair keys to ensure at most one edge between two nodes
        const pairSeen = new Set<string>();
        vals.forEach((content: string, idx: number) => {
          const src = fileNodes[idx].id;
          let m: RegExpExecArray | null;
          while ((m = linkRegex.exec(content))) {
            const target = m[1];
            if (!target) continue;
            if (target === src) continue; // skip self-links
            // normalized key for undirected dedupe
            const key = [String(src), String(target)].sort().join('::');
            if (pairSeen.has(key)) continue;
            pairSeen.add(key);
            // preserve the first-seen direction
            newEdges.push({ from: src, to: target });
          }
        });
        setNodes(fileNodes);
        setEdges(newEdges);
      })
      .catch(() => {
        setNodes(fileNodes);
        setEdges([]);
      });
  }, [folder]);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [activeSlug, setActiveSlug] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    let destroyed = false;
    let cleanupWheel: (() => void) | null = null;

    (async () => {
      // Use the runtime loader script placed in `public/vendor/vis-loader.js`.
      // The script exposes `window.__loadVisNetwork()` which imports the
      // CDN module at runtime. This avoids bundling vis-network while keeping
      // a simple, lint/TS-friendly call site.
      let vis: any;
      if (typeof window !== 'undefined' && typeof window.__loadVisNetwork === 'function') {
        vis = await window.__loadVisNetwork();
      } else if (typeof window !== 'undefined') {
        // If the loader script wasn't included (e.g. unusual build), inject
        // the public loader module at runtime. We avoid any static import
        // strings referencing 'vis-network' so bundlers won't include it.
        await new Promise<void>((resolve, reject) => {
          try {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = '/vendor/vis-loader.js';
            script.onload = () => resolve();
            script.onerror = (e) => reject(e);
            document.head.appendChild(script);
          } catch (e) {
            reject(e);
          }
        });
        if (typeof window.__loadVisNetwork === 'function') {
          vis = await window.__loadVisNetwork();
        } else {
          throw new Error('vis-network loader not available');
        }
      } else {
        throw new Error('No runtime available to load vis-network');
      }
      if (destroyed) return;
      const DataSet = (vis as any).DataSet;
      const Network = (vis as any).Network;

      const data = {
        nodes: new DataSet(nodes.map((n) => ({ id: n.id, label: n.label }))),
        edges: new DataSet(edges.map((e) => ({ from: e.from, to: e.to }))),
      } as any;

      const options = {
        nodes: { shape: 'dot', size: 14 },
        physics: { stabilization: true },
        edges: { arrows: { to: false }, hoverWidth: 0 },
        interaction: {
          zoomView: true,
          zoomSpeed: 0.25,
          dragView: true,
          hover: true,
          hoverConnectedEdges: false,
          selectConnectedEdges: false,
        },
      } as any;

      const network = new Network(containerRef.current, data as any, options);

      // force canvas background in case vis-network injects its own canvas styling
      const canv = containerRef.current!.querySelector('canvas');
      if (canv) (canv as HTMLCanvasElement).style.background = '#c8cacf';

      network.on('click', (params: any) => {
        if (params.nodes && params.nodes.length > 0) {
          setActiveSlug(String(params.nodes[0]));
        }
      });

      let _prevSelection: { nodes: string[]; edges: string[] } | null = null;
      network.on('hoverNode', (params: any) => {
        const id = params.node;
        if (!id) return;
        try {
          const sel = network.getSelection();
          _prevSelection = {
            nodes: (sel.nodes || []).map(String),
            edges: (sel.edges || []).map(String),
          };
        } catch (e) {
          _prevSelection = null;
        }
        const connectedEdges = network.getConnectedEdges(id) || [];
        const neighborNodes = (network.getConnectedNodes(id) || []).map(String);
        const nodeSelection = Array.from(new Set<string>([String(id), ...neighborNodes]));
        network.setSelection({ nodes: nodeSelection, edges: connectedEdges });
      });

      network.on('blurNode', () => {
        if (_prevSelection) {
          network.setSelection(_prevSelection);
          _prevSelection = null;
        } else {
          try {
            network.unselectAll();
          } catch (e) {
            // ignore
          }
        }
      });

      try {
        network.on('stabilizationIterationsDone', () => console.debug('stabilization done'));
      } catch (e) {
        // ignore
      }

      // wheel handler to prevent page scroll and perform zoom via network.moveTo
      const containerEl = containerRef.current!;
      const containerWheelHandler = (ev: WheelEvent) => {
        try {
          if (!containerEl) return;
          ev.preventDefault();
          ev.stopPropagation();
          const getScale = (network as any).getScale?.() ?? 1;
          const delta = ev.deltaY;
          const baseSpeed = (options.interaction && options.interaction.zoomSpeed) || 0.25;
          const factor = 1 - (delta / 1000) * baseSpeed;
          const newScale = Math.max(0.05, Math.min(10, getScale * factor));
          try {
            (network as any).moveTo({ scale: newScale, animation: { duration: 120 } });
          } catch (e) {
            // ignore
          }
        } catch (e) {
          // ignore
        }
      };
      containerEl.addEventListener('wheel', containerWheelHandler as EventListener, {
        passive: false,
      });
      cleanupWheel = () =>
        containerEl.removeEventListener('wheel', containerWheelHandler as EventListener);

      return () => {
        try {
          cleanupWheel?.();
        } catch (e) {
          // ignore
        }
        try {
          network.destroy();
        } catch (e) {
          // ignore
        }
      };
    })();

    return () => {
      destroyed = true;
      try {
        // cleanupWheel will be invoked from the async closure's returned cleanup
      } catch (e) {
        // ignore
      }
    };
  }, [nodes, edges]);

  return (
    <main>
      <h2>Archive: {folder}</h2>
      <p>
        그래프 뷰: 노드 수 {nodes.length}, 엣지 수 {edges.length}
      </p>
      <div
        className="archive-graph-container"
        style={{
          height: 600,
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: 8,
          background: '#d0d2d5',
        }}
        ref={containerRef}
      />
      {activeSlug && (
        <React.Suspense
          fallback={<div style={{ position: 'fixed', right: 0, top: 0 }}>로딩...</div>}
        >
          {React.createElement(
            // cast to any to avoid TypeScript complaining about lazy generic types
            React.lazy(() => import('../components/Layout/ArchiveSidebar')) as any,
            {
              folder: folder ?? '',
              slug: activeSlug,
              onClose: () => {
                setActiveSlug(null);
              },
            }
          )}
        </React.Suspense>
      )}
    </main>
  );
}
