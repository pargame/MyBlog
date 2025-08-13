# MyBlog

개인 블로그 저장소입니다. GitHub Pages로 자동 배포됩니다.

## 문서
- [BUILD.md](BUILD.md) — 빌드 단계, 산출물, 버전 관리
- [SYSTEM.md](SYSTEM.md) — 아키텍처, 데이터 계약, 동작
- [FILEMAP.md](FILEMAP.md) — 파일 역할 개요
- [REQUIREMENTS.md](REQUIREMENTS.md) — 사용자 요구 사항 스냅샷
- [ARCHITECTURE.md](ARCHITECTURE.md) — 배경 및 결정 사항
- [CONTRIBUTING.md](CONTRIBUTING.md) — 기여 워크플로우

## 로컬 미리보기
정적 HTML이므로 브라우저로 `index.html`을 열어보면 됩니다.
빌드 산출물(`public/graph.json`, `public/meta.json`)이 필요하면:

```
npm install  # 필요 시
npm run build
```

## 배포
`main` 브랜치에 푸시되면 GitHub Actions가 자동으로 Pages에 배포합니다.
