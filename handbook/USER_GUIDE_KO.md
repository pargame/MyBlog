# 사용자 안내서 (간단)

이 문서는 일반 사용자(독자)와 작성자/기여자가 빠르게 참고할 핵심 절차를 설명합니다.

## 주요 페이지
- 홈: `index.html` — 최근 포스트 목록
- 그래프: `graph.html` — 지식 그래프(검색, 필터, 하이라이트)
- 뷰어: `viewer.html` — 안전한 Markdown 렌더링

## 검색·필터 사용법
- 검색: 상단 검색 입력 → 결과 클릭 시 뷰어 열림 및 그래프에서 노드 강조
- 아카이브: 연/월 필터
- 토픽/태그: 폴더 계층과 `#tags` 기반 다중 선택

## 문서 작성(요약)
- 권장 위치: `posts/` (레거시: `docs/` 지원)
- 아카이브 규칙 준수: `handbook/MAINTENANCE.md` 참조 (예: `docs/Unreal`의 빈 frontmatter)
- 로컬 검증: `npm run build` 실행 후 `public/graph.json` 확인

## 배포·Git 워크플로(간단)
- 권장: 변경 → `npm run build`(선택) → `git add -A` → `git commit -m "<메시지>"` → `git push origin HEAD`
- 자동 배포: `main`에 푸시하면 `.github/workflows/pages.yml`가 빌드/배포
- VS Code Task: "Commit & Push (deploy)" 사용 가능
- pre-commit 훅 건너뛰기: `SKIP_PRECOMMIT=1 git commit --no-verify`

## 문제 발생 시
- 우선 로컬에서 `npm run build` 후 `public/graph.json`을 확인
- 그래프/메타가 제대로 생성되지 않으면 frontmatter/파일 경로를 점검
- 계속 문제가 있으면 Actions 로그를 확인하거나 이슈를 남기세요

더 짧은 체크리스트나 추가 섹션(예: 작성 템플릿)을 원하면 알려주세요.

---

추가 가이드

- `npm run build` 설명: 로컬에서 `npm run build`를 실행하면 `public/graph.json`(graph 데이터)과 `public/meta.json`(버전/커밋)이 생성됩니다. 빌드에는 Node.js 20+가 필요할 수 있습니다.

- 로컬 미리보기(권장): 정적 파일을 간단히 확인하려면 `public/` 폴더를 임시 HTTP 서버로 띄워 브라우저에서 확인하세요.

```bash
# Node 기반 간단 서버 (프로젝트 루트에서)
npx http-server public -p 8080

# 또는 Python 3 사용 시
python3 -m http.server 8000 --directory public
```

- 작성 템플릿(간단): 새 포스트를 만들 때 아래 형식을 사용하세요. (템플릿은 `handbook/templates/POST_TEMPLATE.md`에 따로 보관되어 있습니다.)

```markdown
---
title: 게시물 제목
date: 2025-08-19
author: YourName
---

# 게시물 제목

본문 내용을 작성하세요.
```

- PR/커밋 권장: 변경 전에 `npm run build`로 결과를 확인하고, 커밋 메시지에는 `docs(arch): <요약>` 형태로 범위를 표기하세요. 자세한 체크리스트는 `handbook/MAINTENANCE.md`를 참조하세요.

원하시면 제가 위 템플릿 파일(`handbook/templates/POST_TEMPLATE.md`)을 생성해 드리겠습니다.
