# 사용자 안내서 (핵심 요약)

아래 내용은 사용자(작성자/기여자) 관점에서 꼭 알아야 할 최소 정보만 담았습니다: 아카이브 규칙 위치, AI와의 작업 흐름, 깃 푸시/배포 워크플로우입니다. 세세한 작성 규칙은 handbook(영문)을 참고하세요.

1) 아카이브 규칙 위치
- 핵심 규칙: `handbook/MAINTENANCE.md`의 "Unreal Engine Archive Rules" 섹션과 "Computer Architecture archive rules" 항목에 정리되어 있습니다.
- 기여 가이드: `handbook/CONTRIBUTING.md`에는 작업 흐름(커밋/푸시 규칙)과 빠른 시작이 있습니다.

2) AI(assistant)의 작업 워크플로우(간단)
- 파일 변경: AI는 요청받은 파일을 읽고, 편집을 적용한 뒤 변경사항을 보고합니다.
- 승인 전에는 커밋/푸시를 하지 않습니다. 사용자가 '커밋 & 푸시'를 지시하면 수행합니다.
- 진행 방식: 읽기 → 편집 → 요약 보고 → 사용자의 승인 대기(커밋/푸시/추가수정)
- 자동 스크립트 실행이나 민감 작업(배포, 개인 파일 포함) 전에는 반드시 사용자 동의를 구합니다.

3) 깃 푸시 및 배포 워크플로우(권장)
- 권장 기본 흐름: 변경 → (선택) `npm run build` → `git add -A` → `git commit -m "<간단한 메시지>"` → `git push origin HEAD`
- 커밋 메시지 예: `docs(arch): add overview` 또는 `fix(graph): suppress hover during click`
- 자동 배포: `main`에 푸시하면 GitHub Actions(워크플로우 `.github/workflows/pages.yml`)가 빌드/배포를 수행합니다.
- VS Code 편의 작업: workspace에 정의된 Task "Commit & Push (deploy)"를 사용하면 같은 흐름을 자동화할 수 있습니다.
- pre-commit 훅: 로컬에 pre-commit 훅이 있으면 빌드나 검사 스크립트를 실행할 수 있습니다. 훅을 건너뛰려면 `SKIP_PRECOMMIT=1 git commit --no-verify` 사용(주의).

추가 안내
- 세부 작성 규칙(언어, 섹션 템플릿, 코드 예시 규정 등)은 handbook 영문 파일(`handbook/MAINTENANCE.md`, `handbook/ARCHITECTURE.md`, `handbook/CONTRIBUTING.md`)을 참고하세요.
- 이 파일은 간단 참조용입니다. 더 축약된 체크리스트 버전이 필요하면 알려주세요.
