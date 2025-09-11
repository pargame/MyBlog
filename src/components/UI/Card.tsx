import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  title: string;
  summary?: string;
  date?: string;
  to?: string;
};

export default function Card({ title, summary, date, to = '/' }: Props) {
  const cardStyle: React.CSSProperties = {
    background: 'var(--card, #151826)',
    color: 'var(--text)',
    padding: '1rem',
    borderRadius: 12,
    boxShadow: '0 6px 18px rgba(2,6,23,0.45)',
    minWidth: 260,
    flex: '1 1 300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    textDecoration: 'none',
  };

  const titleStyle: React.CSSProperties = { margin: 0, fontSize: '1.05rem' };
  const summaryStyle: React.CSSProperties = { margin: 0, color: 'var(--muted)' };
  const dateStyle: React.CSSProperties = {
    marginTop: 'auto',
    color: 'var(--muted-text)',
    fontSize: '0.85rem',
  };

  return (
    <Link to={to} style={{ textDecoration: 'none' }} aria-label={title}>
      <article style={cardStyle} className="card">
        <h3 style={titleStyle}>{title}</h3>
        {summary && <p style={summaryStyle}>{summary}</p>}
        {date && <div style={dateStyle}>{date}</div>}
      </article>
    </Link>
  );
}
