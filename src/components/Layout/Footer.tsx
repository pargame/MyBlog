import React from 'react';

export default function Footer() {
  // build email at runtime to reduce simple crawler harvesting
  const emailLocal = '001201parg';
  const emailHost = ['gmail', 'com'].join('.');
  // create a char code array so exact email doesn't appear in source
  const emailChars = Array.from(`${emailLocal}@${emailHost}`).map((c) => c.charCodeAt(0));
  const emailRef = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => {
    const el = emailRef.current;
    if (!el) return;
    const emailStr = String.fromCharCode(...emailChars);
    el.textContent = emailStr;
    el.onclick = () => (window.location.href = `mailto:${emailStr}`);
  }, [emailChars]);

  return (
    <footer
      style={{
        marginTop: 28,
        padding: '18px 20px',
        borderTop: '1px solid var(--muted-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        color: 'var(--muted-text)',
        fontSize: '0.95rem',
        background: 'transparent',
      }}
    >
      {/* Standard footer left: © YEAR Pargame */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontWeight: 600 }}>© {new Date().getFullYear()} Pargame</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <a
          href="https://github.com/pargame"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pargame on GitHub"
          style={{ color: 'var(--muted-text)', display: 'inline-flex', alignItems: 'center' }}
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38C13.71 14.53 16 11.54 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>

        <button
          ref={emailRef}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--muted-text)',
            cursor: 'pointer',
            fontSize: '0.95rem',
            textDecoration: 'underline dotted',
          }}
          aria-label="Send email"
          title="Send email"
        />
      </div>
    </footer>
  );
}
