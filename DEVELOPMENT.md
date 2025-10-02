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

* 코드 최적화 (2025-10-02 적용)

**주요 최적화 패턴:**
- **중복 제거**: frontmatter.ts 유틸리티로 parseFrontmatter/formatDate 통합
- **React 메모이제이션**: useMemo/useCallback로 불필요한 재생성 방지
  - Archive: 정규식, vis-network 옵션, 이벤트 핸들러 메모이제이션
  - Pynode: Monaco 테마, Worker 핸들러, DOM 접근 최적화
  - MarkdownViewer: renderer, markedOptions 메모이제이션
  - NavBar: 스타일 객체 메모이제이션
- **알고리즘 개선**: Graphs/Archive/Postings에서 불필요한 순회 제거
- **번들 전략**: vendor 청크를 react/router/marked/monaco/misc로 세분화
  - React 코어(react + react-dom)는 반드시 단일 청크 유지 (필수)
  - 각 청크별 독립적 캐싱으로 효율 극대화
- **네트워크 최적화**: loadVisNetwork.ts에 Promise 캐싱
- **메모리 관리**: Pynode Worker에서 Blob URL 자동 revoke

**성능 개선:**
- Archive: 렌더당 객체 생성 100% ↓, 메모리 할당 ~60% ↓
- Pynode: DOM 접근 50% ↓, 메시지 처리 ~5% ↑
- 번들 최적화로 브라우저 캐싱 효율 극대화

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
├─ .editorconfig
├─ .gitattributes
├─ .gitignore
├─ .nvmrc
├─ .prettierrc
├─ README.md
├─ DEVELOPMENT.md
├─ ERRORCASES.md
├─ OPTIMIZATION.md         # 코드 최적화 내역 문서
├─ package.json
├─ package-lock.json
├─ tsconfig.json
├─ vite.config.ts
├─ index.html
├─ node_modules/
├─ dist/                    # 빌드 산출물(커밋 금지 권장)
├─ public/
│  ├─ favicon.svg
│  ├─ assets/               # 정적 vendor 파일
│  └─ vendor/
│     └─ vis-loader.js
├─ contents/
│  ├─ Postings/*.md          # 포스팅 마크다운
│  ├─ Graphs/                # 그래프 관련 문서
│  │  ├─ Algorithm/*.md
│  │  └─ Cpp/*.md
│  └─ Archives/             # 아카이브 문서(폴더별 마크다운 컬렉션)
│     ├─ Algorithm/*.md
│     ├─ Cpp/*.md
│     └─ UnrealEngine/*.md  # 대량 문서가 추가된 서브폴더
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ ThemeProvider.tsx
│  ├─ theme.css             # 전역 테마/스타일
│  ├─ components/
│  │  ├─ Layout/
│  │  │  ├─ NavBar.tsx
│  │  │  ├─ ArchiveSidebar.tsx
│  │  │  └─ Footer.tsx
│  │  └─ UI/
│  │     ├─ Card.tsx
│  │     └─ CardGrid.tsx
│  ├─ pages/
│  │  ├─ About.tsx
│  │  ├─ Postings.tsx
│  │  ├─ MarkdownViewer.tsx
│  │  ├─ Graphs.tsx
│  │  ├─ Archive.tsx
│  │  └─ Pynode.tsx       # Pyodide 기반 간이 WebIDE
│  ├─ types/
│  │  └─ vis-network.d.ts  # vis-network 타입 정의
│  └─ utils/
│     ├─ frontmatter.ts    # 공통 유틸리티 (parseFrontmatter, formatDate)
│     └─ loadVisNetwork.ts # vis-network 동적 로더
└─ eslint.config.cjs

```

---

## 컴포넌트 (간단 책임 및 기능)

- `src/components/Layout/NavBar.tsx`
  - 책임: 앱 최상단 네비게이션 및 라우팅 진입점 제공
  - 주요 기능: 로고/브랜드 링크(Home), 페이지 링크(About, Graphs, Pynode), 테마 토글, 접근성 속성
  - 최적화: 스타일 객체 useMemo로 메모이제이션하여 불필요한 재생성 방지

- `src/components/Layout/ArchiveSidebar.tsx`
  - 책임: 사이드바 형식의 문서 미리보기/네비게이션
  - 주요 기능: 마크다운 미리보기 렌더링, 위키링크 클릭 전파(onWikiLinkClick), 닫기 애니메이션 및 외부 클릭 닫기 처리
  - 기능: 모바일에서 사이드바 패닝 시 바디 배경 스크롤 방지 로직

- `src/components/Layout/Footer.tsx`
  - 책임: 사이트 하단 푸터(재사용)
  - 주요 기능: 왼쪽에 표준 표기(© YEAR Pargame), 오른쪽에 GitHub 아이콘 + 'Contact' 라벨 + 이메일 버튼
  - 이메일 노출 방식: 런타임에 로컬/호스트를 분리해 문자코드 배열로 조립(크롤러 난독화)

- `src/components/UI/Card.tsx`
  - 책임: 포스팅/그래프 요약을 일관된 카드 UI로 표현
  - 주요 기능: title/summary/date 렌더링, 상세 링크 연결, 호버 시 시각적 강조

- `src/components/UI/CardGrid.tsx`
  - 책임: `Card` 컴포넌트 그리드 배치
  - 주요 기능: PostCard/GraphCard 타입 지원, 플렉스 기반 레이아웃, 접근성 보조 속성

- `src/ThemeProvider.tsx`
  - 책임: 전역 테마 상태 및 CSS 변수 관리
  - 주요 기능: 라이트/다크 토글, CSS 변수 동적 주입, 부드러운 트랜지션
  - 기본 테마: 라이트 모드

- `src/pages/About.tsx`
  - 책임: 소개 페이지
  - 주요 기능: 블로그/개발자 소개 콘텐츠

- `src/pages/Postings.tsx`
  - 책임: 포스팅 목록(홈) 페이지 렌더링
  - 주요 기능: `contents/Postings`에서 마크다운 프론트매터 추출 및 날짜순 정렬, `CardGrid`로 출력
  - 최적화: 공통 유틸리티(parseFrontmatter) 사용, parseTime 함수를 useEffect 내부로 이동

- `src/pages/MarkdownViewer.tsx`
  - 책임: 개별 마크다운 문서 렌더링 (포스팅/아카이브 공통)
  - 주요 기능:
    - YAML 프론트매터 파싱 (공통 유틸리티 사용), `marked`로 HTML 변환
    - 코드블록 가독성 개선: 들여쓰기 정규화(자동 dedent), 탭 크기 조정(tab-size: 2), 논리적 줄바꿈에 `<wbr>` 삽입
    - 라이트/다크 모드별 코드블록 배경 및 링크 색상 동적 조정
    - 위키링크([[slug]]) 처리 및 네비게이션
  - 최적화: renderer, markedOptions, escapeHtml 함수를 useMemo/useCallback으로 메모이제이션

- `src/pages/Archive.tsx`
  - 책임: 아카이브 그래프 뷰 제공
  - 주요 기능: `contents/Archives/<folder>`에서 문서 로드, vis-network로 그래프 렌더, 노드 클릭으로 `ArchiveSidebar` 열기
  - 기능: Physics 기반 레이아웃, 노드/엣지 hover 효과, 휠 줌, 안정화 진행 표시
  - 최적화: vis-network 동적 로딩(CDN), 정규식/옵션/핸들러 메모이제이션, useRef로 상태 관리, 휠 핸들러 최적화

- `src/pages/Graphs.tsx`
  - 책임: 그래프 아카이브 폴더 목록 표시
  - 주요 기능: `contents/Archives/*`에서 폴더별 파일 개수 집계, 그래프 뷰 진입점 제공
  - 최적화: 단일 루프로 카운팅, Object.entries 사용

- `src/pages/Pynode.tsx`
  - 책임: Pyodide 기반 간이 WebIDE (브라우저 워커에서 Pyodide 실행)
  - 주요 기능: Monaco 편집기, 워커 기반 Pyodide 실행, 터미널(stdout/stderr) 출력, `input()` 상호작용 처리
  - 기능: 라이트/다크 테마 동기화, 실행 중 상태 표시, 에러 핸들링
  - 최적화: Monaco 테마 메모이제이션, switch-case 메시지 핸들러, DOM 접근 최소화, 콜백 의존성 최적화
  - 주의사항: 워커 스크립트 인코딩(String.raw + TextEncoder), 메시지 핸들러 중앙화, StringIO 기반 stdout 캡처, Blob URL 자동 정리

- `src/utils/frontmatter.ts`
  - 책임: 마크다운 프론트매터 파싱 공통 유틸리티
  - 주요 기능: parseFrontmatter (YAML 파싱), formatDate (ISO 날짜 포맷팅)
  - 사용처: Postings.tsx, MarkdownViewer.tsx

- `src/utils/loadVisNetwork.ts`
  - 책임: vis-network 라이브러리 동적 로딩
  - 주요 기능: CDN에서 vis-network UMD 번들 로드, 캐싱, Promise 재사용으로 중복 요청 방지
  - 최적화: loadPromise 캐싱으로 동시 호출 시 단일 네트워크 요청만 발생

- `src/main.tsx`
  - 책임: 앱 엔트리포인트
  - 주요 기능: React.StrictMode로 App 컴포넌트 마운트

- `src/App.tsx`
  - 책임: 라우터 설정 및 전역 레이아웃
  - 주요 기능: React Router 설정, basename 처리(Vite BASE_URL), lazy loading (Archive, MarkdownViewer, Pynode), ThemeProvider 래핑

> 파일/컴포넌트가 새로 추가되면 이 문서의 "컴포넌트" 섹션에 한 줄 요약을 추가하세요.

---

## 사용 기술스택

- 프론트엔드: React 19 + TypeScript (Vite로 번들링)
- 번들러 / 개발서버: Vite 7
- 라우팅: React Router 7
- 러닝타임: Node.js (워크플로에서 자동 LTS 사용)
- 린트/포맷: ESLint 9, Prettier, @typescript-eslint
- 마크다운: marked
- 에디터: Monaco Editor (@monaco-editor/react)
- Python 실행: Pyodide (WebAssembly)
- 그래프 시각화: vis-network (CDN 동적 로딩)
- 배포: GitHub Pages (공식 Pages Actions: upload-pages-artifact / deploy-pages)
- CI: GitHub Actions (workflow_dispatch 사용)
- 패키지 매니저: npm (package-lock.json 관리)
- 기타: gh CLI로 배포 검증

### 번들 최적화 전략
- vendor 청크 분리: react, router, marked, monaco, misc
- 라우트 기반 코드 스플리팅 (lazy loading)
- vis-network은 CDN에서 동적 로드 (번들에 포함하지 않음)
- React 컴포넌트 메모이제이션 (useMemo, useCallback)

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

새 아카이브 문서는 `contents/Archives/<폴더명>/` 경로에 Markdown 파일로 추가합니다. 
폴더명 예시: `Algorithm`, `Cpp`, `UnrealEngine` 등

파일명은 프런트매터의 `title`과 동일하게 구성하세요:

```markdown
---
title: '파일명과 동일해야 합니다'
date: '2025-09-12T10:30:00+09:00'
---

본문 내용을 여기에 작성합니다.

위키링크로 다른 문서 참조: [[다른문서제목]]
```

### 위키링크 기능
- `[[문서제목]]` 형식으로 같은 폴더 내 다른 문서 참조 가능
- Archive 그래프 뷰에서 링크가 엣지(간선)로 시각화됨
- ArchiveSidebar에서 클릭 시 해당 문서로 네비게이션

---

## Pynode (간이 WebIDE) 관련 개발 노트

`src/pages/Pynode.tsx`는 Pyodide 기반의 간이 웹 IDE입니다. 브라우저 워커에서 Pyodide를 구동해 Python 코드를 실행하고, 터미널로 stdout/stderr를 전달하며 `input()` 상호작용을 지원합니다.

### 주요 특징
- Monaco Editor 통합 (라이트/다크 테마 동기화)
- Web Worker 기반 Python 실행 (메인 스레드 블로킹 없음)
- StringIO를 통한 stdout/stderr 캡처
- `input()` 함수 지원 (request-input / input-value 메시지 프로토콜)
- 실행 상태 표시 및 에러 핸들링

### 동작 원리
1. 워커(Worker)를 Blob으로 생성해 내부에서 CDN의 `pyodide.js`를 importScripts로 로드
2. Python 코드 실행 전 StringIO로 sys.stdout/stderr 리다이렉트
3. `input()` 호출 시 워커가 메인에 `request-input` 메시지 전송
4. 메인은 터미널에 입력 박스 표시, 사용자 입력 받아 `input-value`로 워커에 전달
5. 실행 완료 후 캡처된 출력을 한 번에 메인으로 전송

### 개발 시 주의사항
- 워커 스크립트 수정 시 `String.raw`와 `TextEncoder` 사용 규칙 준수
- 메시지 핸들러 중복 등록 방지 (중앙화된 핸들러 사용)
- 디버그 로그는 제거하여 터미널에는 순수 프로그램 출력만 표시
- Monaco Editor 타입 이슈: `unknown` 타입으로 받아 처리, 필요시 eslint-disable 주석

### 워크플로 최적화 세부사항

**Archive 렌더링 파이프라인:**
1. folder 변경 감지
2. markdown 파일 병렬 로드 (import.meta.glob)
3. 메모이제이션된 linkRegex로 파싱
4. nodes/edges 상태 업데이트
5. vis-network 초기화 (메모이제이션된 옵션 사용)
6. 메모이제이션된 이벤트 핸들러 등록
7. 물리 시뮬레이션 완료 후 안정화

**Pynode 렌더링 파이프라인:**
1. 컴포넌트 마운트
2. Worker 생성 (Blob URL 추적)
3. 메모이제이션된 리스너 등록
4. Monaco 에디터 초기화 (메모이제이션된 테마 사용)
5. 실행 시: stdin 파싱 → Worker 메시지 전송 → 최적화된 핸들러로 응답 → DOM 최소 접근으로 터미널 업데이트

**메모리 관리:**
- Blob URL 정리: Worker 종료 시 자동 revoke
- 이벤트 리스너 정리: useEffect cleanup 철저히 수행
- Timer 정리: clearInterval/clearTimeout 완료
- WeakMap 사용: 터미널 메타데이터 자동 가비지 컬렉션

### 관련 문서
- 에러 사례: `ERRORCASES.md` 참고

---