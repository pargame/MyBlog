import React from 'react';
import Footer from '../components/Layout/Footer';

export default function Pynode() {
  return (
    <main>
      <div className="hero">
        <p className="hero-subtitle">Pynode — 파이썬 기반 노드 학습 실습 페이지 (개발중)</p>
        <p>
          이 페이지는 노드 기반 다이어그램과 파이썬을 연계한 학습/실험 공간으로 사용될 예정입니다.
        </p>
      </div>

      <div className="content-section">
        <h2>소개</h2>
        <p>
          Pynode는 파이썬 코드로 그래프 노드의 동작을 정의하고 시각화하는 실습을 목표로 합니다.
          현재는 기본 개념과 예제 코드를 정리하는 문서 역할만 합니다.
        </p>
      </div>

      <div className="content-section">
        <h2>계획</h2>
        <ul>
          <li>노드/엣지 데이터 모델 정의</li>
          <li>파이썬 코드와 프론트엔드 시각화 연동 (WebSocket / REST)</li>
          <li>인터랙티브 예제 및 튜토리얼</li>
        </ul>
      </div>

      <Footer />
    </main>
  );
}
