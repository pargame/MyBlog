import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  title: string;
  summary?: string;
  date?: string;
  to?: string;
};

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

export default function Card({ title, summary, date, to = '/' }: Props) {
  const [hover, setHover] = React.useState(false);
  const [glowBlend, setGlowBlend] = React.useState<string | undefined>(undefined);
  const [glowOpacity, setGlowOpacity] = React.useState<number | undefined>(undefined);

  const cardStyle: React.CSSProperties = {
    background: 'var(--card, #151826)',
    color: 'var(--text)',
    padding: '1rem',
    borderRadius: 12,
    boxShadow: 'var(--card-shadow, 0 6px 18px rgba(2,6,23,0.45))',
    transition: 'transform 180ms ease, box-shadow 180ms ease',
    willChange: 'transform, box-shadow',
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

  const displayDate = date ? formatDateCard(date) : undefined;

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const s = getComputedStyle(document.documentElement);
    const blend = s.getPropertyValue('--card-glow-blend').trim() || undefined;
    const op = parseFloat(s.getPropertyValue('--card-glow-opacity')) || undefined;
    setGlowBlend(blend);
    setGlowOpacity(op);
  }, []);

  return (
    <Link to={to} style={{ textDecoration: 'none' }} aria-label={title}>
      <div
        style={{ position: 'relative', display: 'block' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* glow layer */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: -8,
            top: -8,
            right: -8,
            bottom: -8,
            borderRadius: 14,
            pointerEvents: 'none',
            zIndex: 0,
            filter: 'blur(26px)',
            transition: 'opacity 220ms ease, transform 220ms ease, filter 220ms ease',
            opacity: hover
              ? Number(
                  getComputedStyle(document.documentElement).getPropertyValue(
                    '--card-glow-opacity-hover'
                  ) || 0.95
                )
              : (glowOpacity ?? 0.35),
            transform: hover ? 'scale(1.03)' : 'none',
            mixBlendMode: (glowBlend as any) || 'screen',
            background: 'var(--card-glow)',
          }}
        />

        <article
          style={{
            ...cardStyle,
            position: 'relative',
            zIndex: 1,
            transform: hover ? 'translateY(-6px) scale(1.01)' : 'none',
            boxShadow: hover
              ? 'var(--card-shadow-hover, 0 14px 36px rgba(2,6,23,0.55))'
              : cardStyle.boxShadow,
          }}
          className="card"
        >
          <h3 style={titleStyle}>{title}</h3>
          {summary && <p style={summaryStyle}>{summary}</p>}
          {displayDate && <div style={dateStyle}>{displayDate}</div>}
        </article>
      </div>
    </Link>
  );
}
