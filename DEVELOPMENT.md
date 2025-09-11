# 개발 노트 (AI 읽기용)

1인 개발 원칙: 이 저장소는 1인 개발 기준으로 운영됩니다. PR/머지 규칙 문서는 적용되지 않습니다.

## 규칙 (최상단에 위치)

1) 커밋은 항상 전체 스테이징
 	- 커밋하기 전에 변경된 모든 파일을 전체 스테이징(`git add -A` 또는 동등한 명령)해야 합니다.
 	- 목적: 로컬 체크(`npm run check`)와 커밋 간 일관성을 보장하고, 누락된 파일로 인한 경고/오류를 방지합니다.

2) 체크·AI 제한·임시방편 금지 (간소화)
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

---

## 폴더 구조

```
/
├─ .github/workflows/deploy-gh-pages.yml
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ index.html
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
	│  └─ styles.css
├─ contents/
├─ sources/
└─ DEVELOPMENT.md
```

---

