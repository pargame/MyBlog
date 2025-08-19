# Build & Versioning


# Build & Versioning

This repo is a static site with a small Node build step to derive data used by the UI.

## Prerequisites
- Node.js 20+
- public/site.json: { emailUser, emailDomain, postsCollection? } (created if missing)

This repository is a static site with a small Node.js build step that generates data for the UI.

## Prerequisites
- Node.js 20+
CI runs `npm ci`. Locally you can install with:

## Install (optional)
```bash
npm install
```

## Build
- Build everything:
```bash
npm run build
```
- Or run the steps individually:
```bash
npm run build:graph   # writes public/graph.json
npm run build:meta    # writes public/meta.json (version/commit) and public/site.json (email)
```

## Outputs
- `public/graph.json`: Graph data (nodes, edges, archives, topicsByArchive)
- `public/meta.json`: { version (from package.json), commit (from git) }
- `public/site.json`: { emailUser, emailDomain, postsCollection? } (created if missing)
  - `postsCollection` may be a string or array of strings naming the Posts collection(s). Defaults to "Posts" when omitted.

## Versioning
- Version is read from `package.json` (`version`)
- Commit SHA is resolved at build time (via `git rev-parse HEAD`)
- Footer shows `v{version}` and a short SHA linked to GitHub

## Local preview
- Open `index.html` directly in a browser. No dev server is required.

## CI / Deploy
- GitHub Actions workflow: `.github/workflows/pages.yml`
  - Steps: checkout → configure-pages → Node.js 20 + `npm ci` → build-graph → build-meta → upload artifact → deploy
## 목적
빌드 및 버전 정보, 로컬 빌드/검증 절차와 CI 관련 문제 해결 방법을 문서화합니다.

## 전제
- Node.js 20+

## 설치
로컬에서 의존성 설치(선택):

```bash
npm install
```

CI 환경은 `npm ci`를 사용하도록 설정되어 있습니다.

## 빌드 명령
- 전체 빌드: `npm run build` (내부적으로 `build:graph` + `build:meta` 실행)
- 그래프만: `npm run build:graph` → `public/graph.json` 생성
- 메타만: `npm run build:meta` → `public/meta.json`, `public/site.json` 생성

## 생성물
- `public/graph.json` — 노드/링크/아카이브/토픽 맵
- `public/meta.json` — { version, commit }
- `public/site.json` — { emailUser, emailDomain, postsCollection? }

`postsCollection`은 문자열 또는 문자열 배열이며, 기본값은 "Posts"입니다.

## 버전 정책
- 버전: `package.json`의 `version` 값
- 커밋 SHA: 빌드 시 `git rev-parse HEAD`로 얻음
- 푸터는 `v{version}` 및 짧은 SHA를 표시합니다.

## 로컬 검증
- `index.html`을 브라우저로 직접 열어 확인 가능합니다 (간단한 정적 미리보기).

## CI / 배포
- GitHub Actions: `.github/workflows/pages.yml`
  - 트리거: push to `main`, 또는 수동 `workflow_dispatch`
  - 주요 단계: checkout → configure-pages → setup Node 20 → `npm ci`(또는 `npm install`) → `node scripts/build-graph.js` → `node scripts/build-meta.js` → 업로드 → deploy

## 문제 해결
- `npm ci`가 실패하면 로컬에서 `npm install`을 실행해 lockfile을 갱신하고 커밋하거나, CI 구성을 `npm install`로 일시 변경하세요.
- 그래프가 비어있으면 `npm run build:graph` 실행 로그를 확인하고 frontmatter/파일 경로 규칙을 점검하세요.
- 메타/이메일 누락 시 `npm run build:meta`를 실행하고 생성된 `public/site.json`/`public/meta.json`을 검토하세요.

## 빠른 팁
- 즉시 Pages 재배포가 필요하면 GitHub Actions에서 워크플로를 재실행하거나 빈 커밋으로 강제 트리거하세요:

```bash
git commit --allow-empty -m "ci: trigger GitHub Pages redeploy" && git push origin main
```
