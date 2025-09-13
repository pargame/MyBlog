import React from 'react';
import { useParams } from 'react-router-dom';
// vis-network is loaded at runtime via a lightweight loader to avoid bundling

type Node = { id: string; label: string };
type Edge = { from: string; to: string };

// Minimal runtime-facing types for the dynamically-loaded vis-network bundle.
// These keep typing strict without depending on the library's ambient types.
// The project includes a declaration for 'vis-network/standalone' in
// src/types/vis-network.d.ts; we rely on that ambient module at runtime.

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
  const [layouting, setLayouting] = React.useState<boolean>(false);

  // stable lazy component - avoid creating a new lazy wrapper on every render
  const ArchiveSidebarLazy = React.lazy(
    () => import('../components/Layout/ArchiveSidebar')
  ) as React.LazyExoticComponent<
    React.ComponentType<{ folder: string; slug: string; onClose: () => void }>
  >;

  React.useEffect(() => {
    if (!containerRef.current) return;
    let destroyed = false;
    let cleanupWheel: (() => void) | null = null;

    (async () => {
      // Use a lightweight runtime CDN loader instead of bundling vis-network.
      // This keeps the bundle size small and lets the library be cached
      // independently by the browser.
      let vis = undefined as typeof import('vis-network/standalone') | undefined;
      try {
        const loader = await import('../utils/loadVisNetwork');
        vis = await loader.loadVisNetwork();
      } catch (e) {
        // As a fallback, try any global loader that might be provided on window.
        const win = window as Window & { __loadVisNetwork?: () => Promise<typeof import('vis-network/standalone')> };
        if (typeof win.__loadVisNetwork === 'function') {
          vis = await win.__loadVisNetwork();
        } else {
          throw e;
        }
      }
      if (destroyed) return;
      const DataSet = vis!.DataSet;
      const Network = vis!.Network;

      const data = {
        nodes: new DataSet(nodes.map((n) => ({ id: n.id, label: n.label }))),
        edges: new DataSet(edges.map((edge) => ({ from: edge.from, to: edge.to }))),
      };

      // Always enable physics and hover to preserve original UX
      const options = {
        nodes: { shape: 'dot', size: 14 },
        // Disable improvedLayout (too heavy for very large graphs) but keep physics
        layout: { improvedLayout: false },
        physics: {
          enabled: true,
          solver: 'barnesHut',
          barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
          },
          stabilization: {
            enabled: true,
            iterations: 200,
            updateInterval: 25,
            onlyDynamicEdges: false,
          },
        },
        edges: { arrows: { to: false }, hoverWidth: 1, selectionWidth: 2 },
        interaction: {
          zoomView: true,
          zoomSpeed: 0.25,
          dragView: true,
          hover: true,
          hoverConnectedEdges: false,
          selectConnectedEdges: false,
        },
      };

      const network = new Network(containerRef.current!, data, options);

      // force canvas background in case vis-network injects its own canvas styling
      const canv = containerRef.current!.querySelector('canvas');
      if (canv) (canv as HTMLCanvasElement).style.background = '#c8cacf';

      network.on('click', (params?: { nodes?: Array<string | number>; event?: unknown }) => {
        const nodesParam = params?.nodes;
        if (nodesParam && nodesParam.length > 0) {
          setActiveSlug(String(nodesParam[0]));
          // Mark that a vis-network node was clicked. This helps other
          // document-level listeners (like ArchiveSidebar's click handler)
          // distinguish node clicks from background/canvas clicks even if
          // event propagation ordering varies between vis-network and the
          // DOM. The flag is cleared on the next tick.
          try {
            (window as Window & { __archiveNodeClick?: boolean }).__archiveNodeClick = true;
            setTimeout(() => {
              try {
                (window as Window & { __archiveNodeClick?: boolean }).__archiveNodeClick = false;
              } catch {
                // ignore
              }
            }, 0);
          } catch {
            // ignore
          }
          // Prevent the click from bubbling to the document-level listener
          // (ArchiveSidebar listens on document clicks to close itself). The
          // vis-network provides the original DOM event at params.event.srcEvent
          // (or params.event depending on runtime). Stop its propagation so
          // clicking a node only switches the sidebar content instead of
          // closing the sidebar.
          try {
            let srcEvent:
              | (Event & { stopPropagation?: () => void; preventDefault?: () => void })
              | undefined;
            const evt = params?.event as unknown;
            if (evt && typeof evt === 'object' && 'srcEvent' in (evt as Record<string, unknown>)) {
              const maybe = evt as { srcEvent?: Event };
              srcEvent = maybe.srcEvent as
                | (Event & { stopPropagation?: () => void; preventDefault?: () => void })
                | undefined;
            } else if (evt instanceof Event) {
              srcEvent = evt as Event & {
                stopPropagation?: () => void;
                preventDefault?: () => void;
              };
            }
            if (srcEvent && typeof srcEvent.stopPropagation === 'function') {
              srcEvent.stopPropagation();
            }
            if (srcEvent && typeof srcEvent.preventDefault === 'function') {
              srcEvent.preventDefault();
            }
          } catch {
            // ignore if shape of params.event differs
          }
        }
      });

      let _prevSelection: { nodes: string[]; edges: string[] } | null = null;
      network.on('hoverNode', (params?: { node?: string | number }) => {
        const id = params?.node;
        if (!id) return;
        try {
          const sel = network.getSelection();
          _prevSelection = {
            nodes: (sel.nodes || []).map(String),
            edges: (sel.edges || []).map(String),
          };
        } catch {
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
            network.unselectAll?.();
          } catch {
            // ignore
          }
        }
      });
      try {
        // indicate layout phase to the UI
        setLayouting(true);
        // once stabilization finishes, stop physics to restore snappy interactions
        if (typeof network.once === 'function') {
          network.once('stabilizationIterationsDone', () => setLayouting(false));
        } else {
          const handler = () => setLayouting(false);
          network.on('stabilizationIterationsDone', handler);
          // remove it after first call
          setTimeout(() => {
            try {
              network.off('stabilizationIterationsDone', handler);
            } catch {
              // ignore
            }
          }, 0);
        }
      } catch {
        // ignore
      }

      // wheel handler to prevent page scroll and perform zoom via network.moveTo
      const containerEl = containerRef.current!;
      const containerWheelHandler = (ev: WheelEvent) => {
        try {
          if (!containerEl) return;
          ev.preventDefault();
          ev.stopPropagation();
          const getScale = network.getScale?.() ?? 1;
          const delta = ev.deltaY;
          // options has a runtime shape; safely read interaction.zoomSpeed if present
          const baseSpeed =
            (options as { interaction?: { zoomSpeed?: number } }).interaction?.zoomSpeed ?? 0.25;
          const factor = 1 - (delta / 1000) * baseSpeed;
          const newScale = Math.max(0.05, Math.min(10, getScale * factor));
          try {
            network.moveTo?.({ scale: newScale, animation: { duration: 120 } });
          } catch {
            // ignore
          }
        } catch {
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
        } catch {
          // ignore
        }
        try {
          network.destroy();
        } catch {
          // ignore
        }
      };
    })();

    return () => {
      destroyed = true;
      try {
        // cleanupWheel will be invoked from the async closure's returned cleanup
      } catch {
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
      {layouting && (
        <div
          style={{
            position: 'fixed',
            right: 16,
            top: 88,
            padding: '6px 10px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            borderRadius: 6,
            zIndex: 200,
            fontSize: 12,
          }}
        >
          그래프 레이아웃 진행 중...
        </div>
      )}
      {activeSlug && (
        <React.Suspense
          fallback={<div style={{ position: 'fixed', right: 0, top: 0 }}>로딩...</div>}
        >
          <ArchiveSidebarLazy
            folder={folder ?? ''}
            slug={activeSlug}
            onClose={() => {
              setActiveSlug(null);
            }}
          />
        </React.Suspense>
      )}
    </main>
  );
}
