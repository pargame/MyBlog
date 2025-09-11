import React from 'react';
import CardGrid, { PostCard } from '../components/UI/CardGrid';

// Simple frontmatter parser for markdown files
function parseFrontmatter(raw: string) {
  // allow optional BOM and leading whitespace/newlines before the frontmatter
  const fmMatch = raw.match(/^[\uFEFF\s]*---\s*([\s\S]*?)\s*---\s*/);
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

export default function Postings() {
  const [posts, setPosts] = React.useState<PostCard[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Vite glob to load markdown as raw text (use query/import per Vite deprecation notice)
    // @ts-ignore
    const modules = import.meta.glob('../../contents/Postings/*.md', {
      query: '?raw',
      import: 'default',
    });

    const load = async () => {
      const entries = Object.entries(modules) as [string, () => Promise<string>][];
      const loaded = await Promise.all(
        entries.map(async ([path, resolver]) => {
          // resolver may return the raw string directly or a module with default
          const res = await (resolver as any)();
          const raw = typeof res === 'string' ? res : (res?.default ?? '');
          const { data } = parseFrontmatter(raw);
          const filename = path.split('/').pop() || path;
          const slug = filename.replace(/\.mdx?$|\.md$/i, '');
          const post: PostCard = {
            id: slug,
            title: data.title ?? slug,
            summary: data.summary ?? undefined,
            date: data.date ?? undefined,
            to: `/posts/${slug}`,
          };
          return post;
        })
      );

      const parseTime = (s?: string) => {
        if (!s) return 0;
        const t = Date.parse(s);
        return Number.isNaN(t) ? 0 : t;
      };

      loaded.sort((a, b) => {
        const ta = parseTime(a.date);
        const tb = parseTime(b.date);
        if (tb !== ta) return tb - ta; // newest first
        return (a.title || '').localeCompare(b.title || '');
      });
      setPosts(loaded);
      setLoading(false);
    };

    load().catch((e) => {
      console.error('failed to load posts', e);
      setLoading(false);
    });
  }, []);

  return (
    <main>
      <h2>Postings</h2>
      <p>최근 포스팅</p>
      {loading ? <p>로딩 중...</p> : <CardGrid posts={posts} />}
    </main>
  );
}
