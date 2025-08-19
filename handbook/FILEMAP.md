# File Role Map

Top-level
- index.html — Home (recent posts)
- graph.html — Knowledge graph UI (D3), filters, doc list
- viewer.html — Markdown viewer (secure). Shows title · date · author header
- .nojekyll — Disable Jekyll on Pages
- README.md — Project overview and quickstart
- MAINTENANCE.md — Operations/policies summary (canonical: handbook/MAINTENANCE.md)
- handbook/** — Single Source of Truth; all project docs. Root duplicates removed.

Public data
- public/graph.json — Built graph data
- public/meta.json — Version + commit (for footer)
- public/site.json — Email parts for footer

Scripts
- scripts/build-graph.js — Parse posts/docs, compute graph, archives/topics
- scripts/build-meta.js — Produce meta/site JSON

Assets
- assets/css/styles.css — Global styles
- assets/js/footer.js — Footer wiring

Automation
- .github/workflows/pages.yml — GitHub Pages deploy pipeline
- .vscode/settings.json — Terminal auto-approve for git/npm/node prompts
	(Duplicate workflows removed; only pages.yml is used)

Content
- posts/** — Primary blog posts. Folders contribute topics; #tags/front matter become topics
- docs/** — Legacy archives/notes (still supported)

## 목적
저장소의 파일 역할을 한눈에 파악할 수 있는 참조 문서입니다.

## 최상위 파일
- `index.html` — 홈(최근 포스트)
- `graph.html` — 지식 그래프 UI (D3)
- `viewer.html` — 안전한 Markdown 뷰어
- `.nojekyll` — GitHub Pages에서 Jekyll 무시
- `README.md` — 프로젝트 개요/퀵스타트

## public (생성물)
- `public/graph.json` — 그래프 데이터
- `public/meta.json` — 버전 + 커밋
- `public/site.json` — 사이트 설정(이메일 분리 등)

## 스크립트
- `scripts/build-graph.js` — Markdown → graph.json
- `scripts/build-meta.js` — version/commit 및 site.json 생성

## 자원
- `assets/css/styles.css` — 전역 스타일
- `assets/js/footer.js` — 푸터 동적 연결

## 자동화
- `.github/workflows/pages.yml` — GitHub Pages 배포 파이프라인

## 콘텐츠
- `posts/**` — 메인 포스트 컬렉션 (폴더 구조로 토픽 파생)
- `docs/**` — 레거시 아카이브
