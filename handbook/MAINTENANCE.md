# Maintenance Policy

일관성과 자동화를 위해 지켜야 할 운영 규칙을 정리합니다.

## UI/문서 언어
- 사용자 노출 텍스트는 한국어 위주로 작성해도 됩니다.
- 코드/데이터/파일명은 안정성을 위해 임의 변환(자동 번역/리네이밍)을 피합니다.

### 에이전트 응답 언어 토글(바로 쓰는 명령)
- 한글로 대답하기: 대화에 "한글로 대답해" 또는 "한국어로 답변해"라고 입력하면 이후 답변을 한국어로 유지합니다.
- 영어로 대답하기: "Answer in English"라고 입력하면 영어로 전환합니다.
- 필요 시 언제든 동일 명령으로 다시 전환 가능합니다.

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
