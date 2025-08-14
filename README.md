# MyBlog

개인 블로그 + 지식 그래프(Obsidian 스타일). main 브랜치에 push 하면 GitHub Pages로 자동 배포됩니다.

## 주요 기능
- 홈(index.html): posts/의 최신 포스트 20개 노출 (README/Index 류 자동 제외)
- 그래프(graph.html): 아카이브/노트 전용(Posts 제외), 아카이브/토픽 필터, 역링크 표시
- 뷰어(viewer.html): 안전한 Markdown 렌더링(DOMPurify), 코드 하이라이트, 상단에 제목 · 날짜 · 작성자 메타 표시
- 자동 산출물: public/graph.json(그래프), public/meta.json(버전/커밋)

## 콘텐츠 모델
- posts/: 홈에 보이는 블로그 포스트
- docs/: 그래프 전용 아카이브/노트(레거시 호환)
- 토픽: 폴더명 + front matter의 tags 또는 상단의 `tags: [a, b]`

## 글 작성 가이드
1) `posts/YYYY/slug.md` 파일을 만들고 front matter를 작성합니다.

```markdown
---
title: 글 제목
date: 2025-08-13
author: GPT-5
---

# 글 제목
서론-본론-결론 구조로 작성하면 좋습니다. [[관련노트]] 같은 위키 링크도 사용할 수 있습니다.
```

2) 커밋 후 main으로 push 하면 홈에 노출되고, 뷰어 상단에 제목 · 날짜 · 작성자가 표시됩니다.

## 로컬 빌드/미리보기
정적 사이트이므로 `index.html`을 브라우저로 바로 열어도 됩니다. 그래프/메타를 갱신하려면:

```bash
npm install
npm run build
```

- 산출물: `public/graph.json`, `public/meta.json`

## 배포(자동)
main에 push → GitHub Actions Pages 배포.
- 워크플로: `.github/workflows/pages.yml`

## 프로젝트 문서(Handbook)
상세 문서는 `handbook/`에 있습니다:
 - `handbook/ARCHITECTURE.md`
 - `handbook/BUILD.md`
 - `handbook/CONTRIBUTING.md`
 - `handbook/FILEMAP.md`
 - `handbook/MAINTENANCE.md`
 - `handbook/REQUIREMENTS.md`
 - `handbook/SYSTEM.md`

## 파일 개요
빠른 개요는 `FILEMAP.md`를 참고하세요.
