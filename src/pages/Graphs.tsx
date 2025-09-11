import React from 'react';
import { GraphGrid, GraphCard } from '../components/UI/CardGrid';
import Footer from '../components/Layout/Footer';

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
    // Vite glob: load archive markdown files as raw strings
    const modules = import.meta.glob('../../contents/Archives/*/*.md', {
      query: '?raw',
      import: 'default',
    }) as Record<string, () => Promise<string>>;
    const keys = Object.keys(modules);
    const counts: Record<string, number> = {};
    keys.forEach((k) => {
      const folder = folderFromPath(k);
      counts[folder] = (counts[folder] || 0) + 1;
    });
    const arr: GraphCard[] = Object.keys(counts).map((name) => ({
      id: name.toLowerCase(),
      name,
      to: `/archives/${name.toLowerCase()}`,
      count: counts[name],
    }));
    setFolders(arr);
  }, []);

  return (
    <main>
      <h2>Graphs</h2>
      <p>그래프 아카이브를 선택하세요.</p>
      <GraphGrid folders={folders} />
      <Footer />
    </main>
  );
}
