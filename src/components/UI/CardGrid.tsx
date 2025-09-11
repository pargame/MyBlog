import React from 'react';
import Card from './Card';

export type PostCard = { id: string; title: string; summary?: string; date?: string; to?: string };

type Props = { posts: PostCard[] };

// GraphCard: for folder-based graph listings (e.g. contents/Archives/Algorithm)
export type GraphCard = { id: string; name: string; to?: string };

type GraphProps = { folders: GraphCard[] };

function formatDateCard(iso?: string) {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

export default function CardGrid({ posts }: Props) {
  const gridStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    alignItems: 'stretch',
  };
  return (
    <section style={gridStyle} aria-live="polite">
      {posts.map((p) => (
        <Card key={p.id} to={p.to}>
          <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{p.title}</h3>
          {p.summary && <p style={{ margin: 0, color: 'var(--muted)' }}>{p.summary}</p>}
          {p.date && (
            <div style={{ marginTop: 'auto', color: 'var(--muted-text)', fontSize: '0.85rem' }}>
              {formatDateCard(p.date)}
            </div>
          )}
        </Card>
      ))}
    </section>
  );
}

// Simple grid to render folder cards (Graph sections)
export function GraphGrid({ folders }: GraphProps) {
  const gridStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    alignItems: 'stretch',
  };

  return (
    <section style={gridStyle} aria-live="polite">
      {folders.map((f) => (
        <Card key={f.id} to={f.to}>
          <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{f.name}</h3>
        </Card>
      ))}
    </section>
  );
}
