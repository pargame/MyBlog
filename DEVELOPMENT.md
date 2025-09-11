# 개발 노트 (AI 읽기용)

1인 개발 원칙: 이 저장소는 1인 개발 기준으로 운영됩니다. PR/머지 규칙 문서는 적용되지 않습니다.

## 규칙 (최상단에 위치)

사용 가능한 명령 리스트(상단에 고정):

1. npm run check(개발중)
2. npm run deploy(배포-워크플로 트리거)
3. gh 명령(배포 검증용에만 사용)
4. git 명령(커밋푸시)
5. rm -f, ls, cat, grep 등 터미널 명령(명시적 승인 불필요)


1) 커밋은 항상 전체 스테이징
 	- 커밋하기 전에 변경된 모든 파일을 전체 스테이징(`git add -A` 또는 동등한 명령)해야 합니다.
 	- 목적: 로컬 체크(`npm run check`)와 커밋 간 일관성을 보장하고, 누락된 파일로 인한 경고/오류를 방지합니다.

2) 검증·자동화 제한 및 임시방편 금지
 	- `npm run check` 성공 기준: 종료 코드 0, `found 0 vulnerabilities`, ESLint/Prettier 경고 및 deprecated 메시지 없음.
 	- AI는 명령을 제안·검토할 수 있으나 자동 실행 권한은 오직 `npm run check`만 허용됩니다. AI가 `check`를 자동 실행하면 실행 로그와 변경사항을 제출해야 하며, 사용자의 검토·승인 없이는 추가 조치를 취하면 안 됩니다.
 	- 임시방편(예: `package.json`의 `overrides`, lockfile 조작 등) 사용 금지. 문제는 upstream 업그레이드, 코드 수정, upstream PR 또는 포크·패치로 근본 해결합니다.
 	- 자동수정(`eslint --fix`, `prettier --write`)은 허용되나, 자동수정 후에도 경고가 남으면 수동으로 완전히 해결해야 합니다.

3) 주석 및 레거시 관리
  	- 모든 주석은 한글로 간결하게 작성한다.
  	- 사용하지 않는 코드, 주석, 설정 등 레거시 흔적은 저장소에 남기지 않고 제거한다.
   	- 레거시 파일 삭제는 터미널 도구를 열어서 `rm -f <절대경로>` 형식으로 AI가 직접 실행한다.

4) 요청 분류
	- 사용자의 요청은 명확히 '수행' 또는 '질문'으로 구분해서 전달한다.
	- '수행': 실행이 필요하거나 파일/코드를 수정하는 작업.
	- '질문': 정보, 확인, 제안, 토론을 위한 문의.
	- 분류가 누락되면 변경 전 확인 절차를 요구한다.

5) 배포 규칙
	- 배포는 로컬 또는 CI에서 `npm run deploy` 스크립트를 실행하여 수행한다.
	- 배포 검증은 GitHub CLI(`gh`)로 무결성을 확인한다.

	6) 시크릿 · 토큰 관리 (필수)
		- GitHub 관련 토큰(PAT)은 저장소에 평문으로 절대 저장하지 않는다.
		- 토큰은 리포지토리 시크릿(Repository secrets)에 등록하고 워크플로/스크립트에서는 `secrets.GITHUB_TOKEN` 또는 등록된 시크릿명을 사용한다.
		- 로컬 테스트 시 일시적으로만 환경변수로 설정한다(예: `export GH_TOKEN="ghp_xxx"`). 영구 저장 금지.
		- 토큰 권한은 최소 권한 원칙을 따른다(예: dispatch만 필요하면 workflow 권한만 부여).
		- 토큰 유출 의심 시 즉시 해당 시크릿을 삭제·무효화하고 재발급한다.

	7) 배포 실행 · 검증 절차 (필수)
		- 배포 전: 항상 `npm run check`를 실행해 종료코드 0과 `found 0 vulnerabilities`를 확인한다.
		- 로컬에서 원격 워크플로 트리거는 `npm run deploy` 또는 `gh workflow run deploy.yml --ref main`을 사용한다.
		- 배포 후 검증 명령(예):
			```bash
			gh run list --workflow="deploy.yml"
			gh run view <run-id> --log
			gh api repos/:owner/:repo/pages
			```
		- 배포 실패 시 로그(`gh run view <id> --log`)를 우선 확인하고, 원인에 따라 롤백(이전 태그 또는 이전 안정 배포) 절차를 수행한다.

	8) 빌드 산출물(dist) · 브랜치 정책 (필수)
		- `dist/`와 같은 빌드 산출물은 main 브랜치에 커밋하지 않는다.
		- 배포는 공식 Pages 워크플로(artifact → deploy-pages)를 권장하며, 필요 시 `gh-pages` 전용 브랜치를 사용할 수 있다.
		- `gh-pages` 브랜치를 사용하지 않으면 원격에서 삭제한다(`git push origin --delete gh-pages`).
		- 메인 브랜치는 소스 코드만 유지하며 빌드 결과로 덮어쓰지 않는다.

	9) 워크플로 · 액션 버전 관리 (권장)
		- GitHub Actions 액션은 Major 안정 태그(ex: `actions/checkout@v5`)로 고정한다. 마이너/패치 업데이트는 주기적으로(예: 분기별) 검토한다.
		- 워크플로 업그레이드 절차: 태그 업데이트 → `npm run check` 실행 → 워크플로 수동 실행(테스트) → 결과 검증.
		- deprecated 알림 또는 의존성 오류가 나오면 즉시 관련 액션을 최신 안정 버전으로 교체하고 재실행한다.


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

