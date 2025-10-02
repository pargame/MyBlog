import React from 'react';
import CardGrid, { PostCard } from '../components/UI/CardGrid';
import Footer from '../components/Layout/Footer';
import { parseFrontmatter } from '../utils/frontmatter';

export default function Postings() {
  const [posts, setPosts] = React.useState<PostCard[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Vite glob: load markdown files as raw strings (query='?raw').
    const modules = import.meta.glob('../../contents/Postings/*.md', {
      query: '?raw',
      import: 'default',
    }) as Record<string, () => Promise<string | { default: string }>>;

    const parseTime = (s?: string) => {
      if (!s) return 0;
      const t = Date.parse(s);
      return Number.isNaN(t) ? 0 : t;
    };

    const load = async () => {
      const entries = Object.entries(modules);
      const loaded = await Promise.all(
        entries.map(async ([path, resolver]) => {
          // resolver may return the raw string directly or a module with default
          const res = await resolver();
          const raw = String(res);
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

      loaded.sort((a, b) => {
        const ta = parseTime(a.date);
        const tb = parseTime(b.date);
        if (tb !== ta) return tb - ta; // newest first
        return (a.title || '').localeCompare(b.title || '');
      });
      setPosts(loaded);
      setLoading(false);
    };

    load().catch((_err) => {
      console.error('failed to load posts', _err);
      setLoading(false);
    });
  }, []);

  return (
    <main>
      <h2>Postings</h2>
      {loading ? <p>로딩 중...</p> : <CardGrid posts={posts} />}
      <Footer />
    </main>
  );
}
