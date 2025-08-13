# MyBlog

개인 블로그 저장소입니다. GitHub Pages로 자동 배포됩니다.

전체 구조/데이터 플로우/배포 파이프라인은 `ARCHITECTURE.md`를 먼저 참고하세요.
작업 흐름/로컬 빌드 팁은 `CONTRIBUTING.md`를 보세요.

## 로컬 미리보기
정적 HTML이므로 브라우저로 `index.html`을 열어보면 됩니다.
빌드 산출물(`public/graph.json`, `public/meta.json`)이 필요하면:

```
npm install  # 필요 시
npm run build
```

## 배포
`main` 브랜치에 푸시되면 GitHub Actions가 자동으로 Pages에 배포합니다.
