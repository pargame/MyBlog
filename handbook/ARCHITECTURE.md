# MyBlog 아키텍처

이 문서는 저장소 구조, 데이터 흐름, 빌드/배포 파이프라인을 요약합니다. 시스템의 전체적인 구조를 빠르게 파악할 수 있습니다.

## 목차
- [개요](#개요)
- [주요 파일 및 폴더](#주요-파일-및-폴더)
- [데이터 흐름](#데이터-흐름)
- [UI별 책임](#u아이별-책임)
- [빌드/배포 요약](#빌드배포-요약)
- [데이터 계약(요약)](#데이터-계약요약)
- [보안·성능 포인트](#보안성능-포인트)
- [참고](#참고)

## 개요
- 정적 사이트 + D3 지식 그래프 + 안전한 Markdown 뷰어
- 결과물: `public/graph.json`, `public/meta.json`, `public/site.json`
- 콘텐츠 원천:
  - 최신: `posts/**/*.md`
  - 레거시(아카이브): `docs/**` (각 아카이브는 `docs/<ArchiveName>/` 폴더)
- 그래프 빌드는 기본적으로 `docs/`의 아카이브 문서를 사용하며, 설정에 따라 `posts/`의 항목도 포함 가능합니다.

## 주요 파일 및 폴더
- `docs/`: 그래프용 아카이브 문서(Markdown)
- `posts/`: 연도별 블로그 포스트 (홈 페이지 콘텐츠)
- `public/`: 생성된 정적 파일(HTML, JSON, 에셋)
- `scripts/`: Node.js 빌드 스크립트 (`build-graph.js`, `build-meta.js` 등)
- `assets/`: 정적 자원(CSS, JS, 이미지)

## 데이터 흐름
1. 작성자가 `posts/{archive}/.../*.md` 또는 레거시 `docs/**`를 작성/수정합니다.
2. 그래프 빌드: `node scripts/build-graph.js`
   - YAML 프론트매터(제목, 날짜, 태그) 파싱
   - 위키링크 `[[...]]` 해석 → 엣지 생성
   - 토픽/아카이브 도출 후 `public/graph.json` 출력
3. 메타 빌드: `node scripts/build-meta.js` → `public/meta.json`, `public/site.json` 생성
4. 런타임
   - `graph.html`이 `public/graph.json`을 로드하여 필터/시뮬레이션 실행
   - `viewer.html`이 문서와 백링크를 렌더링

## UI별 책임
- `graph.html`: D3 force 시뮬레이션(링크, 충돌, 전하 등), 호버/선택 강조, 줌/팬
- `viewer.html`: Marked → DOMPurify로 sanitize → highlight.js로 코드 하이라이팅, 백링크 노출
- `index.html`: `public/graph.json`의 최근 노드(기본 20개)를 노출(설정: `public/site.json`)

## 빌드/배포 요약
- 로컬 전체 빌드: `npm run build` (graph + meta) — package.json의 스크립트를 확인
- CI: `.github/workflows/pages.yml`
  - Node.js 20 권장
  - `npm ci` 또는 `npm install` 후 빌드 스크립트 실행, artifact 생성 → GitHub Pages로 배포
- 권장: 빌드 실패 시 아티팩트 확인 및 logs 검토

## 데이터 계약(요약)
- nodes: [{ id, title, path, url, topics: string[], tags: string[], date?, mtime }]
- links: [{ source, target, type: 'wiki'|'mention' }]
- meta: { version, commit }
- site: { emailUser, emailDomain, postsCollection? }

(구현상 변경이 있으면 scripts/*에서 실제 출력 스키마를 확인하고 문서를 동기화하세요.)

## 보안·성능 포인트
- Markdown → DOMPurify로 sanitize하여 XSS 방지
- 런타임 성능: 노드 수 제한/필터 적용으로 시뮬레이션 과부하 방지
- 빌드 성능: 큰 문서세트에서는 병렬 처리나 캐시(mtime 기반) 고려
- CI 비밀/토큰은 GitHub Secrets로 관리

## 참고
상세한 기여/빌드 규칙은 `handbook/CONTRIBUTING.md`, `handbook/BUILD.md`, `handbook/MAINTENANCE.md`를 확인하세요.
- `scripts/build-graph.js` — 문서 파싱 및 그래프 생성
- nodes: [{ id, title, path, url, topics: string[], tags: string[], date?, mtime }]
- links: [{ source, target, type: 'wiki'|'mention' }]
- meta: { version, commit }
- site: { emailUser, emailDomain, postsCollection? }

## 보안·성능 포인트
- Markdown → DOMPurify로 필터링하여 XSS 방지
- 그래프는 필터로 노드수를 제한해 런타임 과부하를 방지

## 참고
상세한 기여/빌드 규칙은 `handbook/CONTRIBUTING.md`, `handbook/BUILD.md`, `handbook/MAINTENANCE.md`를 확인하세요.
- `scripts/build-graph.js` — 문서 파싱 및 그래프 생성

