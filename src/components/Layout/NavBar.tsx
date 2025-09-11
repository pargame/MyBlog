import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../ThemeProvider';

export default function NavBar() {
  const { theme, toggle } = useTheme();

  // Main navigation bar styles
  const navStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '0.5rem 1rem',
    marginBottom: '1.25rem',
    borderRadius: 10,
    background: 'var(--panel)',
    boxShadow: '0 6px 20px rgba(2,6,23,0.45)',
  };

  // Brand link styles
  const brandStyle: React.CSSProperties = {
    fontWeight: 700,
    color: 'var(--text)',
    textDecoration: 'none',
    padding: '0.6rem 0.9rem',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.02)',
  };

  // Nav link styles
  const linkStyle: React.CSSProperties = {
    color: 'var(--muted-text)',
    textDecoration: 'none',
    marginLeft: '0.75rem',
    padding: '0.4rem 0.7rem',
    borderRadius: 8,
  };

  // Theme toggle button style
  const buttonStyle: React.CSSProperties = {
    marginLeft: '0.75rem',
    padding: '0.4rem 0.7rem',
    borderRadius: 8,
    border: 'none',
    background: 'transparent',
    color: 'var(--muted-text)',
    cursor: 'pointer',
  };

  return (
    <nav style={navStyle} aria-label="Main navigation">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" style={brandStyle} className="brand">
          Home
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link to="/graphs" style={linkStyle}>
          Graphs
        </Link>
        <button onClick={toggle} aria-label="Toggle theme" style={buttonStyle}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}
