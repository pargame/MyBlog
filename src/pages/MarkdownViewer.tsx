import React from 'react';
import { useParams } from 'react-router-dom';
import { marked } from 'marked';

// frontmatter parser (same logic as in Postings)
function parseFrontmatter(raw: string) {
  const fmMatch = raw.match(/^---\s*([\s\S]*?)\s*---/);
  const data: Record<string, string> = {};
  if (!fmMatch) return { data, content: raw };
  const fm = fmMatch[1];
  fm.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(?:"([^"]*)"|'([^']*)'|(.+))?$/);
    if (m) {
      const key = m[1];
      const val = m[2] ?? m[3] ?? m[4] ?? '';
      data[key] = val.trim();
    }
  });
  const content = raw.slice(fmMatch[0].length).trim();
  return { data, content };
}

export default function MarkdownViewer() {
  const { slug } = useParams<{ slug: string }>();
  const [raw, setRaw] = React.useState<string | null>(null);
  const [meta, setMeta] = React.useState<Record<string, string> | null>(null);

  React.useEffect(() => {
    if (!slug) return;
    // @ts-ignore
    const modules = import.meta.glob('../../contents/Postings/*.md', { as: 'raw' });
    const matchPath = Object.keys(modules).find((p) => p.includes(`/${slug}.md`));
    if (!matchPath) {
      setRaw('');
      return;
    }
    (modules as Record<string, () => Promise<string>>)[matchPath]().then((r) => {
      const { data, content } = parseFrontmatter(r);
      setMeta(data);
      setRaw(content);
    });
  }, [slug]);

  if (raw === null) return <p>로딩 중...</p>;
  if (raw === '') return <p>포스트를 찾을 수 없습니다.</p>;

  return (
    <article>
      {meta?.title && <h1>{meta.title}</h1>}
      {meta?.date && <div style={{ color: 'var(--muted-text)' }}>{meta.date}</div>}
      <div dangerouslySetInnerHTML={{ __html: marked.parse(raw) }} />
    </article>
  );
}
