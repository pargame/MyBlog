# MyBlog Architecture

이 문서는 저장소 구조, 데이터 플로우, 빌드/배포 파이프라인, 개발 팁을 요약합니다. 새 작업 시 여기부터 읽으면 전체를 빠르게 파악할 수 있습니다.

## 개요
- 정적 사이트 + D3 지식 그래프 + 안전한 Markdown 뷰어
- 데이터 소스: `posts/**/*.md` (legacy: `docs/**`)
- 산출물: `public/graph.json`, `public/meta.json`, `public/site.json`

## 폴더 구조(요지)
- `index.html`: 홈(최근 글)
- `graph.html`: 그래프 뷰(아카이브/주제 필터, 컨트롤, 문서목록/뷰어)
- `viewer.html`: Markdown 뷰어(위키링크/역링크, 안전 렌더)
- `assets/css/styles.css`: 전역 스타일
- `assets/js/footer.js`: 푸터(이메일 난독화, 버전/커밋 표시)
- `scripts/build-graph.js`: 문서 파싱 → 그래프/메타 구축
- `scripts/build-meta.js`: 버전/커밋/이메일 기본 생성
- `public/*.json`: UI가 읽는 데이터들

## 데이터 플로우
1) 작성자: `posts/{archive}/.../*.md` 작성 (또는 `docs/**` 레거시)
2) 빌드: `node scripts/build-graph.js`
   - frontmatter(Tag/Date) + 폴더경로→ 토픽/아카이브
   - 문서간 [[위키링크]] → 그래프 edges
   - 결과 `public/graph.json`
3) 메타: `node scripts/build-meta.js` → `public/meta.json`, `public/site.json`
4) 런타임:
   - `graph.html`이 `graph.json`을 로드 → 필터/시뮬레이션/목록
   - `viewer.html`이 개별 문서 렌더 + 역링크

## 그래프(그래프 페이지)
- D3 force simulation
  - forces: link(distance), charge(strength), center, collide(radius)
  - 컨트롤: 링크 거리/반발력/링크 굵기/노드 크기(실시간 반영)
  - 호버: 이웃 강조, 나머지 페이드
  - 선택: 선택 노드 테두리 강조
- 필터
  - 아카이브 선택 → 해당 아카이브 노드/링크만 필터
  - 단일 주제 선택 → 해당 토픽 포함 노드만
- 문서 패널
  - 필터 결과 목록 클릭 → 오른쪽 iframe(viewer)로 문서 열기

## 뷰어(viewer.html)
- marked + DOMPurify로 안전 렌더
- highlight.js로 코드 하이라이트
- [[위키링크]] 선치환 → 같은 아카이브/토픽 우선 해석
- 역링크 표시(해당 문서를 타겟으로 하는 노드 목록)
- 그래프 페이지 내 임베드 시 헤더 축약 스타일 적용

## 홈(index.html)
- `public/graph.json`의 노드 mtime 기준으로 최근 20개 나열
- Posts 컬렉션 범위 내에서만 표시 (기본: `Posts`) — site.json의 postsCollection로 조정 가능

## 빌드/배포
- 로컬 빌드: `npm run build` (graph + meta)
- GitHub Actions: `.github/workflows/pages.yml`
  - checkout → configure-pages → Node 20 + npm ci → build → upload → deploy
- `.nojekyll`: Jekyll 비활성화
