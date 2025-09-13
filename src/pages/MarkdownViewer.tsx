import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import { useTheme } from '../ThemeProvider';

// Parse YAML frontmatter and return { data, content }
function parseFrontmatter(raw: string) {
  const fmMatch = raw.match(/^[\uFEFF\s]*---\s*([\s\S]*?)\s*---\s*/);
  const data: Record<string, string> = {};
  if (!fmMatch) return { data, content: raw };
  const fm = fmMatch[1];
  fm.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(?:(?:"([^"]*)")|(?:'([^']*)')|(.+))?$/);
    if (!m) return;
    const key = m[1];
    const val = m[2] ?? m[3] ?? m[4] ?? '';
    data[key] = val.trim();
  });
  const content = raw.slice(fmMatch[0].length).trim();
  return { data, content };
}

function formatDate(iso?: string) {
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

type Props = {
  slugProp?: string;
  base?: 'postings' | 'archives';
  folder?: string;
  onWikiLinkClick?: (slug: string) => void;
};

export default function MarkdownViewer({
  slugProp,
  base = 'postings',
  folder,
  onWikiLinkClick,
}: Props) {
  const params = useParams<{ slug: string }>();
  const slug = slugProp ?? params.slug;
  const [raw, setRaw] = React.useState<string | null>(null);
  const [meta, setMeta] = React.useState<Record<string, string> | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!slug) return;
    if (base === 'archives' && folder) {
      const modules = import.meta.glob('../../contents/Archives/*/*.md', {
        query: '?raw',
        import: 'default',
      }) as Record<string, () => Promise<string>>;
      const keys = Object.keys(modules);
      const matchPath = keys.find((p) =>
        p.toLowerCase().includes(`/${folder.toLowerCase()}/${slug.toLowerCase()}.md`)
      );
      if (!matchPath) {
        setRaw('');
        return;
      }
      modules[matchPath]().then((r) => {
        const rawStr = String(r);
        const { data, content } = parseFrontmatter(rawStr);
        setMeta(data);
        setRaw(content);
      });
      return;
    }

    // default: postings
    const modules = import.meta.glob('../../contents/Postings/*.md', {
      query: '?raw',
      import: 'default',
    }) as Record<string, () => Promise<string>>;
    const matchPath = Object.keys(modules).find((p) => p.includes(`/${slug}.md`));
    if (!matchPath) {
      setRaw('');
      return;
    }
    modules[matchPath]().then((r) => {
      const rawStr = String(r);
      const { data, content } = parseFrontmatter(rawStr);
      setMeta(data);
      setRaw(content);
    });
  }, [slug, base, folder]);

  // keep ref and its listener hooks stable (must be declared before conditional returns)
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  // replace wiki links [[slug]] with anchor tags that carry data-wiki
  const processed = (raw || '').replace(/\[\[([^\]]+)\]\]/g, (_m, s) => {
    const slug = String(s).trim();
    return `<a href="#" data-wiki="${slug}">${slug}</a>`;
  });

  // custom marked renderer to produce cleaner code blocks (language label + escaped content)
  const escapeHtml = (str: string) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const renderer = new marked.Renderer();
  // marked v5 uses a single Code object parameter for renderer.code
  renderer.code = (codeObj: { lang?: string; text: string; escaped?: boolean }) => {
    const {
      lang = '',
      text = '',
      escaped = false,
    } = codeObj as { lang?: string; text: string; escaped?: boolean };
    let langTrim = String(lang || '').trim();
    let body = String(text || '');

    // If no language provided, check if the first line is a bare language token
    // e.g. code block where author wrote:
    // ```
    // cpp
    // #include ...
    // ```
    // We treat the first line as language and remove it from content.
    if (!langTrim) {
      const lines = body.replace(/\r\r?/g, '\n').split('\n');
      const first = (lines[0] || '').trim();
      // allow letters, numbers, plus, hash, dash (e.g., c, cpp, c++, c#, ts, js)
      if (/^[A-Za-z0-9+#\-]+$/.test(first) && lines.length > 1) {
        langTrim = first;
        body = lines.slice(1).join('\n');
      }
    }

    // Normalize indentation: convert tabs to 2 spaces, strip leading/trailing
    // empty lines, and remove the minimal common indent so pasted blocks that
    // include surrounding indentation won't display overly indented in the
    // sidebar. This keeps visual indentation compact while preserving relative
    // indentation inside the snippet.
    const normalizeIndent = (s: string) => {
      if (!s) return s;
      const withTabs = s.replace(/\t/g, '  ');
      const lines = withTabs.replace(/\r\r?/g, '\n').split('\n');
      // trim leading/trailing blank lines
      while (lines.length && lines[0].trim() === '') lines.shift();
      while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
      const nonEmpty = lines.filter((l) => l.trim() !== '');
      if (nonEmpty.length === 0) return lines.join('\n');
      const indents = nonEmpty.map((l) => (l.match(/^ */) || [''])[0].length);
      const minIndent = Math.min(...indents);
      if (minIndent <= 0) return lines.join('\n');
      return lines.map((l) => l.slice(minIndent)).join('\n');
    };

    body = normalizeIndent(body);

    const langClass = langTrim ? `language-${langTrim}` : 'language-plaintext';
    const langLabel = langTrim ? `<div class="code-lang">${langTrim}</div>` : '';
    // Insert soft-wrap opportunities at sensible code boundaries so long
    // lines break at logical units (operators, punctuation) instead of
    // mid-token. Use a single regex pass to append a temporary token and
    // then replace that token with <wbr> after HTML-escaping.
    const TOKEN = '___WBR___';
    const insertWraps = (s: string) => {
      if (!s) return s;
      // match multi-char operators first, then common punctuation/operators
      const re = /(->|::|[.,;(){}\[\]\/=+\-\*%<>!&|?:])/g;
      return s.replace(re, (m) => m + TOKEN);
    };

    let content: string;
    if (escaped) {
      // already escaped by caller/renderer
      content = body;
    } else {
      const withWraps = insertWraps(body);
      content = escapeHtml(withWraps).split(TOKEN).join('<wbr>');
    }
    return `<div class="code-wrap" data-language="${langTrim}">${langLabel}<pre class="code-block"><code class="${langClass}">${content}</code></pre></div>`;
  };

  const markedOptions = { renderer, gfm: true, breaks: false, headerIds: false, mangle: false };

  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest('[data-wiki]') as HTMLElement | null;
      if (a) {
        e.preventDefault();
        // Prevent the click from bubbling to document-level listeners (such as
        // the sidebar's outside-click handler). This ensures clicking a wiki
        // link inside the sidebar only navigates the sidebar content instead
        // of closing it.
        e.stopPropagation();
        const slug = a.getAttribute('data-wiki') || '';
        if (!slug) return;
        if (typeof onWikiLinkClick === 'function') {
          onWikiLinkClick(slug);
        } else {
          navigate(`/posts/${slug}`);
        }
      }
    },
    [onWikiLinkClick, navigate]
  );

  if (raw === null) return <p>로딩 중...</p>;
  if (raw === '') return <p>포스트를 찾을 수 없습니다.</p>;

  return (
    <article>
      {meta?.title && <h1>{meta.title}</h1>}
      {meta?.date && <div style={{ color: 'var(--muted-text)' }}>{formatDate(meta.date)}</div>}
      {/* scoped styles for markdown: links and code block backgrounds for dark/light themes */}
      <style>{`
.markdown-content a { color: ${theme === 'dark' ? '#7ecbff' : 'var(--accent)'}; text-decoration: none; }
.markdown-content .code-wrap {
  margin: 0.5em 0; /* reduce vertical spacing to use sidebar space */
  border-radius: 8px;
  overflow: visible; /* allow floating label to be visible (not clipped) */
  box-sizing: border-box;
  /* make wrapper clearly distinct from page background */
  background: ${theme === 'dark' ? '#071826' : '#edf6fb'};
  color: ${theme === 'dark' ? '#dbeeff' : '#0b1220'};
  /* fill the available content width inside the sidebar (respect aside padding)
     avoid negative margins which caused left-side clipping */
  width: 100%;
  margin-left: 0;
  margin-right: 0;
  padding: 0.15rem 0; /* minimal vertical padding; horizontal padding handled in pre */
  border: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(11,18,32,0.04)'};
  position: relative; /* for label overlap positioning */
  box-shadow: ${theme === 'dark' ? '0 6px 18px rgba(0,0,0,0.6)' : '0 6px 18px rgba(2,6,23,0.06)'};
}
.markdown-content .code-lang {
  padding: 6px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${theme === 'dark' ? '#cdeeff' : '#08306b'};
  background: ${theme === 'dark' ? '#02242f' : '#e8f3ff'};
  border-radius: 6px;
  display: inline-block;
  position: absolute;
  top: 0; /* align near top of wrapper */
  /* place label slightly inset from the sidebar inner edge; reduced to match tighter padding */
  left: 0.6rem;
  transform: translateY(-55%); /* slightly lift the pill for better visual */
  z-index: 3;
}
.markdown-content pre.code-block {
  margin: 0;
  /* tighter horizontal padding to reduce perceived indentation */
  padding: 0.6rem 0.8rem 0.6rem 0.8rem;
  background: transparent; /* outer wrapper provides background */
  color: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Helvetica Neue", monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  /* reduce tab rendering width so tab characters don't create huge indents */
  tab-size: 2;
  -moz-tab-size: 2;
  /* wrap long lines so content is always visible inside the sidebar */
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
  border-radius: 6px;
}
.markdown-content code { background: transparent; color: inherit; }
.markdown-content blockquote {
  margin: 0.6em 0;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  background: ${theme === 'dark' ? 'rgba(255,255,255,0.02)' : '#f3f8ff'};
  border-left: 4px solid ${theme === 'dark' ? 'rgba(126,203,255,0.18)' : 'rgba(96,165,250,0.7)'};
  color: ${theme === 'dark' ? '#cfeeff' : '#08306b'};
  padding-left: 0.9rem;
}
.markdown-content blockquote p { margin: 0; }
`}</style>
      <div
        ref={containerRef}
        className="markdown-content"
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: marked.parse(processed, markedOptions) }}
      />
      {base === 'postings' && (
        <div
          style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end' }}
          className="post-back"
        >
          <button
            onClick={() => navigate('/posts')}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--muted-text)',
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: 8,
              transition: 'background 120ms ease, color 120ms ease',
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background =
                theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)';
              btn.style.color = theme === 'dark' ? '#dbeeff' : 'var(--muted-text)';
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = 'transparent';
              btn.style.color = 'var(--muted-text)';
            }}
          >
            ← 돌아가기
          </button>
        </div>
      )}
    </article>
  );
}
