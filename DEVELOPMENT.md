# 개발 노트 (AI 읽기용)

1인 개발 원칙: 이 저장소는 1인 개발 기준으로 운영됩니다. PR/머지 규칙 문서는 적용되지 않습니다.
이 문서는 최신 변경 기록이 아니라 이 프로젝트 상태에 대한 최신 상태 정보를 제공하는 것이 목적입니다.

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

- 주석은 간결하게 작성.
- 사용하지 않는 코드/설정은 제거.
- 레거시 파일은 과감하게 삭제(필수): 레거시 파일 삭제는 반드시 로컬 터미널에서 절대경로로 `rm -f <절대경로>`를 실행하여 삭제. 운영자가 요청에 따라 AI는 apply_patch 등으로 직접 과감하게 삭제.

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
│     └─ Archive.tsx
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

아카이브용 마크다운 문서 템플릿과 작성 가이드입니다. 이 프로젝트의 관례는 다음과 같습니다:

```markdown
---
title: '파일명과 동일해야 합니다'
date: '2025-09-12T10:30:00+09:00'
---

본문 내용을 여기에 작성합니다.
```

---
