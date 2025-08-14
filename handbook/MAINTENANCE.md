# Maintenance Policy

일관성과 자동화를 위해 지켜야 할 운영 규칙을 정리합니다.

## 언어 정책(일관 규칙)
- 설명/채팅: 한국어로 답변하고 서술합니다.
- 개발 관련(코드, 식별자, 브랜치/커밋 메시지, API/CLI, 주석): 영어로 통일합니다.
- 문서 작성(블로그 글, 핸드북/가이드 등 사용자용 문서): 기본 한국어로 작성합니다. 코드블록/스니펫 내부는 영어 유지.
- 파일/폴더명, 데이터 스키마는 안정성을 위해 임의 변환(자동 번역/리네이밍)을 하지 않습니다.

예시
- Commit: `feat(graph): improve search overlay animation` (영어)
- PR 설명/코멘트: 변경 이유와 사용법은 한국어로 서술
- 블로그 글/핸드북: 본문은 한국어, 코드/명령어는 영어

## 콘텐츠/파일 규칙
- 주 폴더: `posts/**` (권장). 레거시 `docs/**`도 빌더가 읽지만 신규는 `posts/`에 작성.
- 위키 링크 `[[...]]`는 basename으로 해석되니 파일명은 안정적으로 유지.

## 리뷰 체크리스트
- [ ] README/handbook/FILEMAP가 최신 상태인지
- [ ] footer(버전/커밋/이메일) 정상 표기되는지
- [ ] 그래프/뷰어 동작(검색, 포커스, 오버레이) 이상 없는지
- [ ] 빌드 산출물(`public/graph.json`, `public/meta.json`) 최신인지

## 자동 배포(GitHub Pages)
- main 브랜치에 push 되면 `.github/workflows/pages.yml`이 실행되어 자동 배포됩니다.
- 워크플로 개요: checkout → configure-pages → Node 20 + npm ci → build-graph → build-meta → upload → deploy

권장 운영 흐름
1) 변경 작업 → 2) `npm run build`로 로컬 확인(선택) → 3) 커밋/푸시 → 4) Actions 로그 확인(필요 시)

문제 해결(Troubleshooting)
- 배포 실패: Actions 로그에서 npm install/build 단계 오류 확인
- 홈에 글 미노출: `public/graph.json` 노드에 file이 `posts/`로 시작하는지, front matter(date/author) 형식 확인
- 그래프가 비어있음: `scripts/build-graph.js` 실행 여부, `public/graph.json` 파일 존재 여부 확인
- 중복 워크플로: `.github/workflows/pages.yml`만 남겨 유지(중복은 제거됨)
