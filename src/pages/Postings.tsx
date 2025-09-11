import React from 'react';
import CardGrid, { PostCard } from '../components/UI/CardGrid';

// Simple frontmatter parser for markdown files
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

export default function Postings() {
  const [posts, setPosts] = React.useState<PostCard[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Vite glob to load markdown as raw text
    // @ts-ignore
    const modules = import.meta.glob('../../contents/Postings/*.md', { as: 'raw' });

    const load = async () => {
      const entries = Object.entries(modules) as [string, () => Promise<string>][];
      const loaded = await Promise.all(
        entries.map(async ([path, resolver]) => {
          const raw = await resolver();
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

      loaded.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
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
