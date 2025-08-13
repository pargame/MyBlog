# MyBlog Architecture

이 문서는 저장소 구조, 데이터 플로우, 빌드/배포 파이프라인, 개발 팁을 요약합니다. 새 작업 시 여기부터 읽으면 전체를 빠르게 파악할 수 있습니다.

## 개요
- 정적 사이트 + D3 지식 그래프 + 안전한 Markdown 뷰어
- 데이터 소스: `docs/**/*.md`
- 산출물: `public/graph.json`, `public/meta.json`, `public/site.json`

## 폴더 구조(요지)
- `index.html`: 홈(최근 글)
- `graph.html`: 그래프 뷰(아카이브/주제 필터, 컨트롤, 문서목록/뷰어)
- `viewer.html`: Markdown 뷰어(위키링크/역링크, 안전 렌더)
- `assets/css/styles.css`: 전역 스타일
- `assets/js/footer.js`: 푸터(이메일 난독화, 버전/커밋 표시)
- `scripts/build-graph.js`: 문서 파싱 → 그래프/메타 구축
- `scripts/build-meta.js`: 버전/커밋/이메일 기본 생성
- `public/*.json`: UI가 읽는 데이터들

## 데이터 플로우
1) 작성자: `docs/{archive}/.../*.md` 작성
2) 빌드: `node scripts/build-graph.js`
   - frontmatter(Tag/Date) + 폴더경로→ 토픽/아카이브
Moved to handbook: See `handbook/ARCHITECTURE.md`.
   - 결과 `public/graph.json`
