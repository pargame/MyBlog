# Contributing / Workflow

이 저장소에 기여(자신의 작업 포함)할 때 필요한 최소한의 정보를 요약합니다.

## 빠른 시작
- Node 20+ (로컬 빌드용)
- 의존성(필요 시): `npm install`
- 빌드: `npm run build` → `public/graph.json`, `public/meta.json` 생성
- 미리보기: 정적 사이트라 브라우저로 `index.html` 열기

## 작업 흐름
1. 문서 추가/수정: `docs/**/*.md`
2. 그래프/메타 갱신: `npm run build` (pre-commit 훅이 있으면 자동 실행)
3. 커밋/푸시: `main` → GitHub Pages 자동 배포

## 코드 가이드
- 스타일: `assets/css/styles.css`의 CSS 변수부터 수정하여 일관성 유지
- 그래프 뷰 로직: `graph.html` 내 스크립트
  - `updateForces`/`updateStyles`로 슬라이더 반영
  - 하이라이트/선택/충돌 설정 확인
- 뷰어: `viewer.html` (marked + DOMPurify + highlight.js)
- 빌더: `scripts/build-graph.js`, `scripts/build-meta.js`

## 구조/파이프라인 설명
- `ARCHITECTURE.md` 문서 참고(개요, 데이터 플로우, 배포, 팁)

## 배포 파이프라인
- `.github/workflows/pages.yml` (Node 세팅 후 빌드→업로드→배포)

## 이슈/개선 제안
- 그래프 라벨 충돌 완화, 설정 LocalStorage 저장, 홈 요약 카드 등은 `ARCHITECTURE.md`의 개선 여지 참고
