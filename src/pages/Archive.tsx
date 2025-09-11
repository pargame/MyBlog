import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataSet, Network } from 'vis-network/standalone';

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
    // @ts-ignore
    const modules = import.meta.glob('../../contents/Archives/*/*.md', {
      query: '?raw',
      import: 'default',
    });
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
    const data = {
      nodes: new DataSet<{ id: string; label: string }>(
        nodes.map((n) => ({ id: n.id, label: n.label }))
      ),
      edges: new DataSet<{ id?: string; from: string; to: string }>(
        edges.map((e) => ({ from: e.from, to: e.to }))
      ),
    } as any;
    const options = {
      nodes: { shape: 'dot', size: 14 },
      physics: { stabilization: true },
      // make edges visually non-reactive to hover/selection by default
      edges: { arrows: { to: false }, hoverWidth: 0 },
      interaction: {
        // reduce zoom sensitivity to 1/4 of default
        // enable built-in wheel zoom; we force passive listeners during init
        zoomView: true,
        zoomSpeed: 0.25,
        dragView: true,
        // ensure hover events are enabled
        hover: true,
        // disable automatic highlighting/selecting of connected edges
        hoverConnectedEdges: false,
        selectConnectedEdges: false,
        // note: zoomView is disabled above to avoid non-passive wheel listeners
      },
    } as any;
    const network = new Network(containerRef.current, data as any, options);

    // force canvas background in case vis-network injects its own canvas styling
    const canv = containerRef.current.querySelector('canvas');
    if (canv) {
      (canv as HTMLCanvasElement).style.background = '#c8cacf';
    }

    network.on('click', (params: any) => {
      console.debug('network click', params);
      if (params.nodes && params.nodes.length > 0) {
        const id = params.nodes[0];
        console.debug('node clicked', id);
        setActiveSlug(String(id));
      }
    });

    // hover: highlight node + connected edges, restore previous selection on blur
    let _prevSelection: { nodes: string[]; edges: string[] } | null = null;
    network.on('hoverNode', (params: any) => {
      console.debug('hoverNode', params);
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
      // connected edges
      const connectedEdges = network.getConnectedEdges(id) || [];
      // 1-hop neighbor nodes (nodes connected to the hovered node)
      const neighborNodes = (network.getConnectedNodes(id) || []).map(String);
      // build selection: hovered node + its neighbors; edges are the connected edges
      const nodeSelection = Array.from(new Set<string>([String(id), ...neighborNodes]));
      network.setSelection({ nodes: nodeSelection, edges: connectedEdges });
    });

    network.on('blurNode', () => {
      console.debug('blurNode');
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

    // log stabilization lifecycle for diagnosis
    try {
      network.on('stabilizationIterationsDone', () => console.debug('stabilization done'));
    } catch (e) {
      // some vis versions may not support all events; ignore
    }

    // Prevent page scrolling when wheel occurs over the graph container.
    // Use a non-passive listener so we can call preventDefault(). This ensures
    // the page doesn't scroll while the user is zooming the graph.
    const containerEl = containerRef.current;
    const containerWheelHandler = (ev: WheelEvent) => {
      // only handle when pointer is over the container
      try {
        if (!containerEl) return;
        // Prevent page scroll
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
    if (containerEl) {
      containerEl.addEventListener('wheel', containerWheelHandler as EventListener, {
        passive: false,
      });
    }

    return () => {
      try {
        if (containerEl) {
          containerEl.removeEventListener('wheel', containerWheelHandler as EventListener);
        }
      } catch (e) {
        // ignore
      }
      network.destroy();
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
          {/* @ts-ignore dynamic import for sidebar */}
          {React.createElement(
            React.lazy(() => import('../components/Layout/ArchiveSidebar')),
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
