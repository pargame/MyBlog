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
        vals.forEach((content: string, idx: number) => {
          const src = fileNodes[idx].id;
          let m: RegExpExecArray | null;
          while ((m = linkRegex.exec(content))) {
            const target = m[1];
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
      edges: { arrows: { to: false } },
    } as any;
    const network = new Network(containerRef.current, data as any, options);

    network.on('click', (params: any) => {
      if (params.nodes && params.nodes.length > 0) {
        const id = params.nodes[0];
        setActiveSlug(String(id));
      }
    });

    return () => {
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
          background: '#e6e8eb',
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
            { folder: folder ?? '', slug: activeSlug, onClose: () => setActiveSlug(null) }
          )}
        </React.Suspense>
      )}
    </main>
  );
}
