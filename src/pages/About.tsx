import React from 'react';
import Footer from '../components/Layout/Footer';

export default function About() {
  return (
    <main>
      <div className="hero">
        <p className="hero-subtitle">AI를 활용해 만든 개인 블로그를 소개합니다.</p>
        <p>이 블로그에서는 상상을 현실로 만드는 여정을 공유합니다.</p>
      </div>

      <div className="content-section">
        <h2>Github Page Blog</h2>
        <div className="post-preview">
          <h3>주요 페이지</h3>
          <ul>
            <li>마크다운 기반 포스팅</li>
            <li>그래프 아카이브를 통한 지식 시각화</li>
            <li>노드 기반 다이어그램으로 파이썬 학습 (개발중)</li>
          </ul>
        </div>
      </div>

      <div className="content-section">
        <h2>Pargame's Stacks</h2>
        <div className="post-preview">
          <div className="about-content">
            <ul>
              <li>언어: C, C++, Python</li>
              <li>자격: 정보처리기사</li>
              <li>알고리즘/문제해결: 자료구조, 알고리즘 설계 및 최적화</li>
              <li>게임 엔진: Unreal Engine (C++ / 블루프린트)</li>
              <li>
                AI / 머신러닝: PyTorch, TensorFlow, NumPy, Pandas, Prompt Engineering, Vibe Coding
              </li>
              <li>데이터 분석·시각화: Scikit-learn, Matplotlib, Seaborn</li>
              <li>협업 / CI: Git, GitHub, GitHub Actions (브랜치·PR 워크플로우)</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
