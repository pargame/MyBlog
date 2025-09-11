import React from 'react';
import { GraphGrid, GraphCard } from '../components/UI/CardGrid';

// helper to extract folder name from a path like '/.../contents/Archives/Algorithm/file.md'
function folderFromPath(p: string) {
  const parts = p.split('/');
  const graphsIndex = parts.lastIndexOf('Archives');
  if (graphsIndex >= 0 && parts.length > graphsIndex + 1) return parts[graphsIndex + 1];
  return 'Unknown';
}

export default function Graphs() {
  const [folders, setFolders] = React.useState<GraphCard[]>([]);

  React.useEffect(() => {
    // @ts-ignore
    const modules = import.meta.glob('../../contents/Archives/*/*.md', {
      query: '?raw',
      import: 'default',
    });
    const keys = Object.keys(modules);
    const set = new Set<string>();
    keys.forEach((k) => set.add(folderFromPath(k)));
    const arr: GraphCard[] = Array.from(set).map((name) => ({
      id: name.toLowerCase(),
      name,
      to: `/graphs/${name.toLowerCase()}`,
    }));
    setFolders(arr);
  }, []);

  return (
    <main>
      <h2>Graphs</h2>
      <p>여기에 그래프 관련 콘텐츠가 표시됩니다.</p>
      <GraphGrid folders={folders} />
    </main>
  );
}
