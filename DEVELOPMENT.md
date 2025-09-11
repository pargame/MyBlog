# 개발 노트 (AI 읽기용)

1인 개발 원칙: 이 저장소는 1인 개발 기준으로 운영됩니다. PR/머지 규칙 문서는 적용되지 않습니다.

---

## 규칙 (최상단에 위치)

사용 가능한 명령(상단 고정):

1. npm run check — 개발 검증
2. npm run deploy — 배포 트리거
3. gh — 배포 검증용
4. git — 커밋/푸시
5. rm/ls/cat/grep 등 기본 터미널 명령

1) 커밋

- 변경사항은 항상 전체 스테이징(`git add -A`) 후 커밋.
- 목적: `npm run check` 결과와 커밋 상태의 일관성 유지.

2. 검증 및 자동화

- 배포·커밋 전 `npm run check` 필수. 성공 기준: 종료코드 0, `found 0 vulnerabilities`, ESLint/Prettier 경고 없음.
- 임시방편(예: lockfile·overrides 조작) 금지. 문제는 업스트림 업데이트나 코드 수정으로 해결.
- `eslint --fix`, `prettier --write` 허용; 남은 경고는 수동 해결.
- AI는 명령 제안 가능하나 자동 실행은 `npm run check`만 허용. 자동 실행 시 로그·변경사항 제출 및 승인 필요.

3. 주석·레거시

- 주석은 한글로 간결하게 작성.
- 사용하지 않는 코드/설정은 제거.
- 레거시 파일 삭제 규칙(필수):
  - 기본 원칙: 레거시 파일 삭제는 반드시 로컬 터미널에서 절대경로로 `rm -f <절대경로>`를 실행하여 삭제 기록을 남깁니다. 이 기록은 커밋 메시지와 함께 유지되어야 합니다.
  - 자동화/원자적 편집 도구(apply_patch 등)의 사용: 원칙적으로 금지되어 있지 않으나, 해당 도구로 삭제를 수행한 경우에도 동일한 파일에 대해 로컬에서 `rm -f <절대경로>`를 실행하고 그 결과(명령 로그 또는 커밋 메시지)를 커밋해야 합니다.
  - 예외: 운영자가 사전 승인한 경우에 한해 apply_patch 등으로 직접 삭제할 수 있으며, 그 경우에도 커밋 메시지에 "삭제는 운영자 승인으로 수행됨"을 명시해야 합니다.

4. 요청 분류

- 요청은 '수행'(수정/실행) 또는 '질문'(정보/확인)으로 명확히 구분. 분류 미비 시 확인 후 진행.

5. 배포

- 배포는 `npm run deploy` (로컬/CI)로 수행. 배포 검증은 `gh`로 확인.

6. 시크릿·토큰

- 토큰은 평문 저장 금지. 리포지토리 시크릿 사용.
- 로컬 테스트 시 일시적 환경변수만 사용하고, 최소 권한 원칙 준수.

7. 배포 절차 요약

- 배포 전 `npm run check` 실행 → 원격 워크플로 트리거(예: `npm run deploy` 또는 `gh workflow run ...`) → 배포 로그 검토 및 필요시 롤백.

8. 빌드 산출물·브랜치

- `dist/` 등 빌드 산출물은 main에 커밋하지 않음. 메인 브랜치는 소스 전용.

9. 워크플로·액션 관리

- GitHub Actions는 Major 안정 태그로 고정하고 주기적으로 검토·업데이트.

---

## 폴더 구조

```
/
├─ .github/
│  └─ workflows/
│     └─ deploy-gh-pages.yml
├─ .gitattributes
├─ .gitignore
├─ .eslintrc.json
├─ .prettierrc
├─ README.md
├─ DEVELOPMENT.md
├─ package.json
├─ package-lock.json
├─ tsconfig.json
├─ vite.config.ts
├─ index.html
├─ node_modules/
├─ dist/
├─ contents/
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  └─ styles/
│     └─ styles.css
└─ eslint.config.cjs

```

---

## 사용 기술스택

- 프론트엔드: React + TypeScript (Vite로 번들링)
- 번들러 / 개발서버: Vite
- 러닝타임: Node.js (워크플로에서 Node 20.x 권장)
- 린트/포맷: ESLint, Prettier, @typescript-eslint
- 배포: GitHub Pages (공식 Pages Actions: upload-pages-artifact / deploy-pages)
- CI: GitHub Actions (workflow_dispatch 사용)
- 패키지 매니저: npm (package-lock.json 관리)
- 기타: gh CLI로 배포 검증

---

## 포스팅 작성 템플릿

새 포스팅은 `contents/Postings/` 폴더에 Markdown 파일로 추가합니다. 파일명은 포스팅 주제에 맞게 소문자와 하이픈으로 구성하세요(예: `how-this-blog-deploys.md`).

모든 포스팅은 다음 프론트매터를 포함해야 합니다:

```markdown
---
title: '블로그 제작 및 배포 요약'
summary: 'Vite + GitHub Actions로 Pages에 배포하는 방법 요약'
date: '2025-09-11T04:45:00+00:00'
---

본문 내용을 여기에 작성합니다.
```

프론트매터 규칙:

- `title` (필수) — 문자열
- `summary` (필수) — 한 줄 요약
- `date` (필수) — ISO 8601 형식(시간 포함)

작성 후에는 `git add -A`, `git commit` 그리고 `git push`로 저장소에 반영하세요.
