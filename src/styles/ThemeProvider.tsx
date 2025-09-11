import React from 'react';

type Props = { children: React.ReactNode };

type Theme = 'dark' | 'light';

const stylesDark = `:root { --bg: #0b1220; --panel: #0b1220; --card: #151826; --text: #f8f8f2; --muted: #bfbfce; --muted-text: #9aa6b2; --accent: #6272a4; --accent-2: #ff79c6; --green: #50fa7b; --yellow: #f1fa8c; --radius: 12px; --max-width: 1100px; }`;
const stylesLight = `:root { --bg: #ffffff; --panel: #f6f7fb; --card: #ffffff; --text: #0b1220; --muted: #4b5563; --muted-text: #6b7280; --accent: #3b82f6; --accent-2: #e11d48; --green: #16a34a; --yellow: #f59e0b; --radius: 12px; --max-width: 1100px; }`;

const baseStyles = `
/* Global reset / base */
html, body, #root { height: 100%; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; margin: 0; padding: 0; }
.dev-theme { background: radial-gradient(circle at 10% 10%, rgba(16, 24, 40, 0.9) 0%, rgba(3, 6, 12, 1) 60%); min-height: 100vh; color: var(--text); padding: 3rem 1.25rem; }
.dev-theme .app { max-width: var(--max-width); margin: 0 auto; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); padding: 2rem; border-radius: var(--radius); box-shadow: 0 8px 30px rgba(2,6,23,0.6); }
/* ...rest omitted for brevity; original global styles are injected elsewhere in full */
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
  const [theme, setTheme] = React.useState<Theme>('dark');

  React.useEffect(() => {
    injectTheme(theme);
  }, [theme]);

  const toggle = React.useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div className="dev-theme">{children}</div>
    </ThemeContext.Provider>
  );
}
