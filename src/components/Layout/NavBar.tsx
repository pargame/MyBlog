import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../ThemeProvider';

export default function NavBar() {
  const { theme, toggle } = useTheme();

  // Router-relative links are used (e.g. '/graphs'). The router's basename
  // is set from Vite's BASE_URL in App.tsx so the base prefix is applied
  // exactly once at runtime. Avoid manually prefixing BASE_URL here.

  // Main navigation bar styles
  const navStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    // top right bottom left - reduce left padding so Home sits nearer the edge
    padding: '0.5rem 1rem 0.5rem 0.25rem',
    marginBottom: '1.25rem',
    borderRadius: 10,
    background: 'var(--panel)',
    boxShadow: '0 6px 20px rgba(2,6,23,0.45)',
  };

  // Shared nav item style for Home and Graphs (identical appearance)
  const navItemStyle: React.CSSProperties = {
    fontWeight: 700,
    color: 'var(--text)',
    textDecoration: 'none',
    padding: '0.6rem 0.9rem',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.02)',
    fontSize: '1rem',
  };

  // Theme toggle button style
  const buttonStyle: React.CSSProperties = {
    marginRight: '0.2rem',
    padding: '0.4rem 0.7rem',
    borderRadius: 8,
    border: 'none',
    background: 'transparent',
    color: 'var(--muted-text)',
    cursor: 'pointer',
  };

  return (
    <nav style={navStyle} aria-label="Main navigation">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          style={buttonStyle}
          data-ignore-sidebar-close="true"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
        <Link to={'/'} style={navItemStyle} className="brand">
          Home
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link to={'/about'} style={navItemStyle}>
          About
        </Link>
        <Link to={'/graphs'} style={navItemStyle}>
          Graphs
        </Link>
        <Link to={'/pynode'} style={navItemStyle}>
          Pynode
        </Link>
      </div>
    </nav>
  );
}
