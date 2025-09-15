# 개발 노트 (AI 읽기용)

AI 온보딩 작업 지침 문서입니다. AI는 모든 작업에서 이 지침을 준수해야 합니다.

---

## 규칙

* 모든 삭제 작업 과감히

- 사용하지 않는 코드/주석/파일 등은 흔적을 남기지 않고 즉시 제거.
- 레거시 파일은 과감하게 삭제(필수): 레거시 파일 삭제는 반드시 로컬 터미널에서 `rm -f <절대경로>`를 실행하여 삭제.

* 금지 명령:

1. PR 금지
2. 요청 없을 떄 임의 커밋·푸시 금지
3. 개발서버 실행 금지

* 허용 명령:

1. npm run check — 개발 검증
2. npm run deploy — 배포 트리거
3. gh — 배포 검증용
4. git — 커밋/푸시: 항상 전체 스테이징(`git add -A`) 후
5. rm/ls/cat/grep 등 기본 터미널 명령(삭제 패치는 직접 터미널에서 실행 허용)

* 검증 및 자동화

- 배포·커밋 전 `npm run check` 필수. 성공 기준: 종료코드 0, `found 0 vulnerabilities`, ESLint/Prettier 경고 없음.
- 임시방편(예: lockfile·overrides 조작) 금지. 문제는 업스트림 업데이트나 코드 수정으로 해결.
- `eslint --fix`, `prettier --write` 허용; 남은 경고는 수동 해결.

* 배포

- 배포는 `npm run deploy` (로컬/CI)로 수행. 배포 검증은 `gh`로 확인.
- 워크플로에서 Node 버전을 자동 LTS(`lts/*`)로 전환됨
- 배포 전 `npm run check` 실행 → 원격 워크플로 트리거(예: `npm run deploy` 또는 `gh workflow run ...`) → 배포 로그 검토 및 필요시 롤백.

* 빌드 산출물·브랜치

- `dist/` 등 빌드 산출물은 main에 커밋하지 않음. 메인 브랜치는 소스 전용.

* 워크플로·액션 관리

- GitHub Actions는 Major 안정 태그로 고정하고 주기적으로 검토·업데이트.

---

### `npm run check` 상세 동작

- 목적: 로컬에서 린트/포맷/취약점/빌드를 한 번에 검사해 배포 전 문제를 사전 차단합니다.
  기본 단계(구성 상의 이유로 내부 순서는 환경에 따라 달라질 수 있음):
  1. eslint 자동수정: `eslint --fix`
  2. prettier 적용: `prettier --write`
  3. npm audit: `npm audit --omit dev --audit-level=moderate`
  4. 빌드: `vite build` (생성된 결과를 통해 런타임 타당성 검사)

- 로컬에서 `npm run check` 통과는 커밋/배포의 전제조건입니다.

---


## 폴더 구조 (실제 로컬 트리 기준)

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
├─ dist/                    # 빌드 산출물(커밋 금지 권장)
├─ contents/
│  ├─ Postings/*.md          # 포스팅 마크다운
│  └─ Archives/             # 아카이브 문서(폴더별 마크다운 컬렉션)
│     └─ UnrealEngine/*.md  # (예) 대량 문서가 추가된 서브폴더
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ ThemeProvider.tsx
│  ├─ components/
│  ├─ theme.css  # 전역 테마/스타일
│  │  ├─ Layout/
│  │  │  ├─ NavBar.tsx
│  │  │  ├─ ArchiveSidebar.tsx
│  │  │  └─ Footer.tsx
│  │  └─ UI/
│  │     ├─ Card.tsx
│  │     └─ CardGrid.tsx
│  └─ pages/
│     ├─ Postings.tsx
│     ├─ MarkdownViewer.tsx
│     ├─ Graphs.tsx
│     ├─ Archive.tsx
│     └─ Pynode.tsx    # Pyodide 기반 간이 WebIDE (터미널 + input 지원)
└─ eslint.config.cjs

```

---

## 컴포넌트 (간단 책임 및 기능)

- `src/components/Layout/NavBar.tsx`
  - 책임: 앱 최상단 네비게이션 및 라우팅 진입점 제공
  - 주요 기능: 로고/브랜드 링크(Home), 페이지 링크(예: Graphs, Archive), 테마 토글, 접근성 속성

- `src/components/Layout/ArchiveSidebar.tsx`
  - 책임: 사이드바 형식의 문서 미리보기/네비게이션
  - 주요 기능: 마크다운 미리보기 렌더링, 위키링크 클릭 전파(onWikiLinkClick), 닫기 애니메이션 및 외부 클릭 닫기 처리
  - 최근 변경: 모바일에서 사이드바 패닝 시 바디 배경 스크롤 방지 로직 추가

- `src/components/Layout/Footer.tsx`
  - 책임: 사이트 하단 푸터(재사용)
  - 주요 기능: 왼쪽에 표준 표기(© YEAR Pargame), 오른쪽에 GitHub 아이콘(아이콘만) + 'Contact' 라벨 + 이메일 버튼
  - 이메일 노출 방식: 런타임에 로컬/호스트를 분리해 문자코드 배열로 조립(간단한 크롤러 난독화). JS 실행 크롤러는 복원 가능하므로 민감한 정보는 서버측 처리 권장.

- `src/components/UI/Card.tsx`
  - 책임: 포스팅 요약을 일관된 카드 UI로 표현
  - 주요 기능: title/summary/date 렌더링, 상세 링크 연결, 호버 시 시각적 강조

- `src/components/UI/CardGrid.tsx`
  - 책임: `Card` 컴포넌트 그리드 배치
  - 주요 기능: 플렉스 기반 레이아웃, 접근성 보조 속성(예: `aria-live`)

- `src/ThemeProvider.tsx`
  - 책임: 전역 테마 상태 및 CSS 변수 관리
  - 주요 기능: 라이트/다크 토글, CSS 변수 주입, 부드러운 트랜지션

- `src/pages/Postings.tsx`
  - 책임: 포스팅 목록(홈) 페이지 렌더링
  - 주요 기능: `contents/Postings`에서 마크다운 메타 추출 및 정렬, `CardGrid`로 출력
  - 최근 변경: 포스팅 상세 하단에 '돌아가기' 버튼 추가

- `src/pages/MarkdownViewer.tsx`
  - 책임: 개별 마크다운 문서 렌더링
  - 주요 기능/최근 변경 사항:
    - YAML 프론트매터 파싱, `marked`로 HTML 변환
    - 코드블록 가독성 개선: 들여쓰기 정규화(자동 dedent), 탭 크기 조정(tab-size), 논리적 줄바꿈(wrap points)에 `<wbr>` 삽입
    - 라이트/다크 모드별 코드블록 배경 및 링크 색상 조정(다크에서 밝은 하늘색 링크)
    - 모바일에서 사이드바 터치 팬 이벤트 처리 개선(배경 스크롤 잠금 포함)

- `src/pages/Archive.tsx`
  - 책임: 아카이브 그래프 뷰 제공
  - 주요 기능: `contents/Archives/*`에서 문서 로드, vis-network로 그래프 렌더, 노드 클릭으로 `ArchiveSidebar` 열기
  - 최근 변경: vis-network 로더를 정적 script 태그 대신 런타임(dynamic)으로 주입하여 Vite 빌드 오류 해결

- `src/pages/Graphs.tsx`
  - 책임: 시각화 데모/테스트 페이지
  - 주요 기능: 그래프/차트 컴포넌트 포함(플레이스홀더)

- `src/pages/Pynode.tsx`
  - 책임: Pyodide 기반 간이 WebIDE (브라우저 워커에서 Pyodide 실행)
  - 주요 기능: Monaco 편집기, 워커 기반 Pyodide 실행, 터미널(stdout/stderr) 출력, `input()` 상호작용 처리
  - 주의사항: 워커 스크립트 인코딩(String.raw + TextEncoder), 메시지 핸들러 중앙화, StringIO 기반 stdout 캡처 권장

- `src/main.tsx`
  - 책임: 앱 엔트리포인트
  - 주요 기능: `ThemeProvider` 및 라우터로 `App` 래핑 후 마운트

> 파일/컴포넌트가 새로 추가되면 이 문서의 "컴포넌트" 섹션에 한 줄 요약을 추가하세요.

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

새 포스팅은 `contents/Postings/` 폴더에 Markdown 파일로 추가합니다. 파일명은 포스팅 주제에 맞게 소문자와 하이픈으로 구성하세요(예: `how-this-blog-deploys.md`):

```markdown
---
title: '블로그 제작 및 배포 요약'
summary: 'Vite + GitHub Actions로 Pages에 배포하는 방법 요약'
date: '2025-09-11T04:45:00+09:00'
---

본문 내용을 여기에 작성합니다.
```

---

## 아카이브 문서 작성 템플릿

새 포스팅은 `contents/Archives/Archive/` 폴더에 Markdown 파일로 추가합니다. 파일명은 프런트매터의 `title`과 동일하게 구성하세요:

```markdown
---
title: '파일명과 동일해야 합니다'
date: '2025-09-12T10:30:00+09:00'
---

본문 내용을 여기에 작성합니다.
```

---

## Pynode (간이 WebIDE) 관련 개발 노트

최근 `src/pages/Pynode.tsx`에 Pyodide 기반의 간이 웹 IDE가 추가/개선되었습니다. 이 컴포넌트는 브라우저 워커에서 Pyodide를 구동해 Python 코드를 실행하고, 터미널(화면)으로 stdout/stderr를 전달하며 `input()` 상호작용을 지원합니다. 아래 내용은 해당 컴포넌트 작업 시 반드시 숙지해야 할 주요 사항입니다.

- 주요 파일: `src/pages/Pynode.tsx`
- 동작 요약:
  - 워커(Worker)를 Blob으로 생성해 내부에서 `pyodide.js`를 importScripts로 로드합니다.
  - Python 실행은 워커 내부에서 StringIO로 stdout/stderr를 캡처해 한 번에 메인으로 전달하는 방식을 사용해 호환성/안정성을 높였습니다.
  - `request-input` / `input-value` 메시지 프로토콜로 `input()` 상호작용을 처리합니다. 메인 쪽은 인-터미널 입력 박스를 표시해 사용자가 값을 제출하면 워커에 전달합니다.
  - 디버그 로그/임시 출력은 제거되어 터미널에는 원래 프로그램의 stdout/stderr만 표시됩니다. (예: 이전에 보이던 `[process ...] exited` 같은 보조 로그는 제거됨)

- 개발/디버깅 팁:
  - 워커 스크립트는 템플릿 리터럴/인코딩 문제로 SyntaxError가 발생할 수 있으니 `workerScript` 정의부를 수정할 때는 `String.raw`와 `TextEncoder` 사용 규칙을 지켜주세요.
  - 메시지 중복 출력은 메시지 핸들러 중복 등록이나 stdout 스트리밍/버퍼링 동시 사용으로 발생할 수 있으니, 핸들러는 중앙화하고 중복 리스너가 등록되지 않도록 주의하세요.
  - `npm run check`(lint/format/audit/build) 통과를 항상 확인한 후 커밋하세요.

- 문서화:
  - 주요 에러 사례와 원인/해결 방법은 `ERRORCASES.md`에 정리해 두었습니다. Pynode 관련 문제는 우선 그 문서를 확인하세요.

---