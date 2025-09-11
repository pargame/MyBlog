import React from 'react';
import Card from './Card';

export type PostCard = { id: string; title: string; summary?: string; date?: string; to?: string };

type Props = { posts: PostCard[] };

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
        <Card key={p.id} title={p.title} summary={p.summary} date={p.date} to={p.to} />
      ))}
    </section>
  );
}
