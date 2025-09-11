import React from 'react';
import CardGrid, { PostCard } from '../components/UI/CardGrid';

const samplePosts: PostCard[] = [
  {
    id: '1',
    title: 'How this blog deploys',
    summary: 'Vite + GitHub Actions로 Pages에 배포하는 방법',
    date: '2025-09-11',
    to: '/posts/how-this-blog-deploys',
  },
  {
    id: '2',
    title: 'Developer theming tips',
    summary: '테마와 CSS 변수로 일관된 UI 만들기',
    date: '2025-08-20',
    to: '/posts/theming-tips',
  },
  {
    id: '3',
    title: 'Algorithms notes',
    summary: '알고리즘과 자료구조 요약',
    date: '2025-07-05',
    to: '/posts/algorithms-notes',
  },
];

export default function Postings() {
  return (
    <main>
      <h2>Postings</h2>
      <p>최근 포스팅</p>
      <CardGrid posts={samplePosts} />
    </main>
  );
}
