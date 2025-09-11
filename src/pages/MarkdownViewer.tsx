import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';

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

  // replace wiki links [[slug]] with anchor tags that carry data-wiki
  const processed = (raw || '').replace(/\[\[([^\]]+)\]\]/g, (_m, s) => {
    const slug = String(s).trim();
    return `<a href="#" data-wiki="${slug}">${slug}</a>`;
  });

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
      <div
        ref={containerRef}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: marked.parse(processed) }}
      />
    </article>
  );
}
