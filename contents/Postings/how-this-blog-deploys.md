---
title: "블로그 제작 및 GitHub Pages 배포: 워크플로 요약"
summary: "Vite(React + TypeScript)로 빌드하고 GitHub Actions의 공식 Pages 워크플로(actions/configure-pages, upload-pages-artifact, deploy-pages)로 배포한 과정 정리"
date: "2025-09-11T04:45:00+00:00"
---

## 개요

이 블로그는 React + TypeScript를 Vite로 빌드하고, GitHub Actions의 공식 Pages 워크플로를 통해 GitHub Pages에 배포합니다. 핵심은 빌드 산출물을 `upload-pages-artifact`로 업로드하고, `actions/deploy-pages`로 Pages에 배포하는 흐름입니다.

## 사용 기술 스택

- 프론트엔드: React + TypeScript
- 번들러: Vite
- CI: GitHub Actions
- 배포: GitHub Pages (actions/configure-pages + upload-pages-artifact + deploy-pages)

## 워크플로 핵심 (deploy.yml)

1. Checkout 레포지토리 (`actions/checkout@v5`)
2. Node.js 설정 (`actions/setup-node@v5`) — 이 저장소는 Node `20.19.0`을 사용하도록 고정했습니다(빌드 호환성 문제 해소).
3. 의존성 설치 (`npm ci`) 및 Vite로 빌드 (`npm run build`).
4. 빌드 결과물(`dist/`)을 `actions/upload-pages-artifact@v4`로 업로드.
5. `actions/configure-pages@v5`로 Pages 설정을 준비하고, `actions/deploy-pages@v4.0.5`로 업로드된 artifact를 실제 GitHub Pages로 배포.

워크플로 상단 주석에 따르면 초기에는 `peaceiris/actions-gh-pages`를 사용하다가 공식 Pages 워크플로로 전환했고, 업로드 액션을 v2에서 v4로 업그레이드하며 관련 의존성 문제를 해결했습니다.

## 로컬에서 배포 트리거 방법

- 권장: `npm run check`로 lint/build 통과를 확인한 뒤 배포 트리거.
- 이 저장소의 `package.json`에는 `deploy` 스크립트가 있습니다. 동작 방식은 다음과 같습니다:
  - 우선 `gh` CLI가 설치되어 있고 인증되어 있으면 `gh workflow run deploy.yml --repo pargame/MyBlog --ref main`로 워크플로를 트리거합니다.
  - `gh`가 없으면 환경변수 `GH_TOKEN`(PAT)을 사용해 GitHub API로 workflow_dispatch를 POST합니다.
  - 둘 다 없으면 에러를 반환하도록 구성되어 있습니다.

이 방식으로 로컬에서 편리하게 워크플로를 트리거하거나, CI 환경에서는 `GH_TOKEN`을 사용해 원격에서 dispatch할 수 있습니다.

## 주요 이슈와 해결

- Node 버전 불일치: GitHub Actions 러너의 기본 Node 버전(예: 18)과 Vite가 요구하는 Node(>=20.19) 불일치로 빌드 실패가 발생했습니다. 해결책: `actions/setup-node@v5`에서 `node-version: '20.19.0'`로 고정.
- ESM/require 충돌: Vite/설정 파일에서 ESM 관련 오류가 있을 경우 빌드에서 실패할 수 있으니 설정을 ESM에 맞게 조정합니다.
- upload-pages-artifact 업그레이드: 이전 버전의 deprecated 의존성 때문에 v4로 업그레이드했습니다.
- `gh-pages` 브랜치 관련: 공식 Pages 워크플로로 전환하면서 불필요해진 `gh-pages` 브랜치는 원격에서 삭제했습니다.

## 배포 검증 및 디버깅

- 워크플로 실행 목록 확인:

  ```bash
  gh run list --workflow="deploy.yml"
  ```

- 특정 실행 로그 보기:

  ```bash
  gh run view <run-id> --log
  ```

- Pages 상태 조회(예시):

  ```bash
  gh api repos/:owner/:repo/pages
  ```

배포 실패 시에는 `gh run view <id> --log`로 먼저 로그를 확인하고, Node 버전, 빌드 스텝, 액션 버전, artifact 업로드 여부를 차례로 점검하세요.

## 주의사항

- `dist/` 등의 빌드 산출물은 `main` 브랜치에 커밋하지 않습니다.
- PAT(토큰)은 저장소에 평문으로 저장하지 말고 리포지토리 시크릿에 등록하세요.

---

이 포스팅은 `deploy.yml`의 상단 주석과 워크플로 내용을 바탕으로 요약한 것입니다. 필요한 부분을 더 상세히 적어드릴 수 있습니다.
