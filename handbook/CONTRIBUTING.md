# 기여 및 워크플로우
---

이 문서는 이 저장소에 기여하고 작업하는 최소한의 단계를 안내합니다.

## 빠른 시작
- Node.js 20+
- (선택) 의존성 설치:

```bash
npm install
```
- 빌드: `npm run build` → `public/graph.json` 및 `public/meta.json` 생성
- 미리보기: 브라우저에서 `index.html` 열기(정적 사이트)

## 워크플로우
1. `posts/**/*.md`(권장) 또는 `docs/**/*.md`(레거시)에서 문서를 추가하거나 수정하세요.
2. 그래프/메타 재생성: `npm run build` 실행.
3. `main`에 커밋 및 푸시 → GitHub Pages가 자동 배포합니다.

## 코드 가이드
- 스타일: `assets/css/styles.css`에서 CSS 변수를 먼저 업데이트하세요.
- 그래프 뷰 로직: `graph.html`(컨트롤, 포스, 스타일)
- 뷰어: `viewer.html`은 Marked + DOMPurify + highlight.js 사용
- 빌더: `scripts/build-graph.js`, `scripts/build-meta.js`

## 아키텍처 / 파이프라인
- 개요, 데이터 흐름, 빌드 및 배포 관련 내용은 handbook 파일을 참고하세요.

## 배포 파이프라인
- GitHub Actions 워크플로우: `.github/workflows/pages.yml`(Node 설정 → 빌드 → 업로드 → 배포)

## 이슈 / 개선사항
- 아이디어: 라벨 충돌 처리 개선, 설정 유지, 홈 요약 카드 추가 등 — 자세한 내용은 `handbook/ARCHITECTURE.md`의 "Future work" 참고

## 유지보수 정책
- UI 언어: 영어
- 유지보수/핸드북 문서: 영어
- 홈페이지 범위: `public/site.json`의 `postsCollection`을 통해 Posts 컬렉션 지정(생략 시 기본값은 "Posts")

## 커밋 및 푸시 규칙
- 권장 플로우: 모든 변경 사항을 스테이징하고, 하나의 커밋을 만든 후 `main`에 푸시하세요.
- 예시: `git add -A` → `git commit -m "<간결한 메시지>"` → `git push origin HEAD`
- 생성되거나 개인적인 파일은 반드시 `.gitignore`에 추가해야 하며, 임시 로컬 제외 규칙은 사용하지 마세요.

이렇게 하면 워크플로우가 단순해지고, 무시 패턴이 중앙에서 관리됩니다.
