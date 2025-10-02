import React from 'react';

type Props = { children: React.ReactNode };

type Theme = 'dark' | 'light';

const stylesDark = `:root { --bg: #0b1220; --panel: #0b1220; --card: #151826; --text: #f8f8f2; --muted: #bfbfce; --muted-text: #9aa6b2; --accent: #6272a4; --accent-2: #ff79c6; --green: #50fa7b; --yellow: #f1fa8c; --radius: 12px; --max-width: 1100px;
  /* shadow / glow for dark theme (light/white-ish shadows) */
  --card-shadow: 0 6px 18px rgba(255,255,255,0.04);
  --card-shadow-hover: 0 14px 36px rgba(255,255,255,0.06);
  --card-glow: radial-gradient(40% 40% at 20% 20%, rgba(255,255,255,0.06), transparent 28%), radial-gradient(40% 40% at 80% 80%, rgba(255,255,255,0.04), transparent 28%);
  --card-glow-blend: screen;
  --card-glow-opacity: 0.35;
  --card-glow-opacity-hover: 0.95;
}`;

const stylesLight = `:root { --bg: #ffffff; --panel: #f6f7fb; --card: #ffffff; --text: #0b1220; --muted: #4b5563; --muted-text: #6b7280; --accent: #3b82f6; --accent-2: #e11d48; --green: #16a34a; --yellow: #f59e0b; --radius: 12px; --max-width: 1100px;
  /* shadow / glow for light theme (darker shadows) */
  --card-shadow: 0 6px 18px rgba(2,6,23,0.12);
  --card-shadow-hover: 0 14px 36px rgba(2,6,23,0.18);
  --card-glow: radial-gradient(40% 40% at 20% 20%, rgba(99,102,241,0.12), transparent 28%), radial-gradient(40% 40% at 80% 80%, rgba(236,72,153,0.09), transparent 28%);
  --card-glow-blend: normal;
  --card-glow-opacity: 0.35;
  --card-glow-opacity-hover: 0.95;
}`;

const baseStyles = `
/* Global reset */
html, body, #root { height: 100%; }
/* Use a monospace stack for consistent layout */
body { font-family: 'SFMono-Regular', Menlo, Monaco, 'Roboto Mono', 'Segoe UI Mono', 'Courier New', monospace; margin: 0; padding: 0; }
.dev-theme { background: var(--bg); min-height: 100vh; color: var(--text); padding: 3rem 1.25rem;
  transition: background-color 360ms ease, color 360ms ease;
}
.dev-theme .app { width: 100%; box-sizing: border-box; background: var(--panel); padding: 2rem; border-radius: var(--radius); box-shadow: 0 8px 30px rgba(2,6,23,0.6);
  transition: background-color 360ms ease, box-shadow 360ms ease, color 360ms ease;
}

/* Animate cards and navigation */
.card, article.card {
  transition: background-color 280ms ease, color 280ms ease, box-shadow 280ms ease, transform 180ms ease;
}
nav, .dev-theme nav {
  transition: background-color 360ms ease, box-shadow 360ms ease, color 360ms ease;
}

/* Navbar link hover */
.dev-theme .links a, .dev-theme .brand, .dev-theme nav a {
  transition: background-color 180ms ease, color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
  will-change: background-color, transform, color;
}
.dev-theme .links a:hover, .dev-theme nav a:hover {
  background: rgba(255,255,255,0.03);
  color: var(--text);
  transform: translateY(-2px) scale(1.01);
  box-shadow: var(--card-shadow-hover);
}
.dev-theme .brand:hover {
  background: rgba(255,255,255,0.04);
  transform: translateY(-1px) scale(1.01);
}
`;

const STYLE_ID = 'theme-provider-styles';

const ThemeContext = React.createContext({
  theme: 'dark' as Theme,
  toggle: () => {},
});

function injectTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.innerHTML = (theme === 'dark' ? stylesDark : stylesLight) + baseStyles;
}

export function useTheme() {
  return React.useContext(ThemeContext);
}

export default function ThemeProvider({ children }: Props) {
  // Start the app in light mode by default
  const [theme, setTheme] = React.useState<Theme>('light');

  React.useEffect(() => {
    injectTheme(theme);
  }, [theme]);

  const toggle = React.useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {/* expose current theme via data-theme so page-specific styles can target dark/light */}
      <div className="dev-theme" data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
