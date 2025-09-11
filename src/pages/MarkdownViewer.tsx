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
      // @ts-ignore
      const modules = import.meta.glob('../../contents/Archives/*/*.md', {
        query: '?raw',
        import: 'default',
      });
      const keys = Object.keys(modules);
      const matchPath = keys.find((p) =>
        p.toLowerCase().includes(`/${folder.toLowerCase()}/${slug.toLowerCase()}.md`)
      );
      if (!matchPath) {
        setRaw('');
        return;
      }
      (modules as Record<string, () => Promise<any>>)[matchPath]().then((r) => {
        const rawStr = typeof r === 'string' ? r : (r?.default ?? '');
        const { data, content } = parseFrontmatter(rawStr);
        setMeta(data);
        setRaw(content);
      });
      return;
    }

    // default: postings
    // @ts-ignore
    const modules = import.meta.glob('../../contents/Postings/*.md', {
      query: '?raw',
      import: 'default',
    });
    const matchPath = Object.keys(modules).find((p) => p.includes(`/${slug}.md`));
    if (!matchPath) {
      setRaw('');
      return;
    }
    (modules as Record<string, () => Promise<any>>)[matchPath]().then((r) => {
      const rawStr = typeof r === 'string' ? r : (r?.default ?? '');
      const { data, content } = parseFrontmatter(rawStr);
      setMeta(data);
      setRaw(content);
    });
  }, [slug]);

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
    const { lang = '', text = '', escaped = false } = codeObj as any;
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

    const langClass = langTrim ? `language-${langTrim}` : 'language-plaintext';
    const langLabel = langTrim ? `<div class="code-lang">${langTrim}</div>` : '';
    // Insert soft-wrap opportunities at sensible code boundaries so long
    // lines break at logical units (operators, punctuation) instead of
    // mid-token. We insert a temporary marker, escape the content, then
    // replace the marker with an actual <wbr> tag which the browser
    // treats as a valid break opportunity inside <code>.
    const insertWraps = (s: string) => {
      if (!s) return s;
      // Use a token unlikely to appear in source and without angle brackets
      const TOKEN = '___WBR___';
      // Order matters: handle multi-char operators first
      const transforms: Array<[RegExp, string]> = [
        [/->/g, '->' + TOKEN],
        [/::/g, '::' + TOKEN],
        [/(\.|,|;|\(|\)|\{|\}|\[|\])/g, '$1' + TOKEN],
        [/([=+\-*/%<>!&|?:])/g, '$1' + TOKEN],
      ];
      let out = s;
      transforms.forEach(([re, rep]) => {
        out = out.replace(re as RegExp, rep as string);
      });
      return out;
    };
    const withWraps = escaped ? body : insertWraps(body);
    let content = escaped ? body : escapeHtml(withWraps);
    // replace token with actual break opportunity tag (use split/join to avoid regex escaping)
    content = content.split('___WBR___').join('<wbr>');
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
.markdown-content .code-wrap { margin: 1em 0; border-radius: 8px; overflow: visible; box-sizing: border-box; padding: 0.25rem 0.25rem; }
.markdown-content .code-lang { padding: 6px 10px; font-size: 0.75rem; font-weight: 600; color: ${theme === 'dark' ? '#cdeeff' : '#08306b'}; background: ${theme === 'dark' ? '#042331' : '#e8f3ff'}; border-top-left-radius: 6px; border-top-right-radius: 6px; }
.markdown-content .code-block {
          margin: 0;
          padding: 12px;
          background: ${theme === 'dark' ? '#07111a' : '#f6f8fa'};
          color: ${theme === 'dark' ? '#dbeeff' : '#0b1220'};
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Helvetica Neue", monospace;
          font-size: 0.85rem;
          line-height: 1.5;
          /* wrap long lines so content is always visible inside the sidebar */
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          word-break: break-word;
          overflow: visible;
        }
.markdown-content pre.code-block { margin: 0; }
.markdown-content code { background: transparent; color: inherit; }
`}</style>
      <div
        ref={containerRef}
        className="markdown-content"
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: marked.parse(processed, markedOptions) }}
      />
    </article>
  );
}
