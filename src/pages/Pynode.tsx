import React from 'react';
import { Link } from 'react-router-dom';

const Pynode: React.FC = () => {
  return (
    <div className="page-container">
      <h1>Pynode</h1>
      <p>
        이 페이지는 Pynode 관련 데모/설정 페이지의 플레이스홀더입니다. 필요하면 여기에
        Pyodide/웹워커 연동 예제나 노드 시각화 도구를 추가하세요.
      </p>
      <p>
        돌아가려면 <Link to="/">홈으로</Link> 이동하세요.
      </p>
    </div>
  );
};

export default Pynode;
