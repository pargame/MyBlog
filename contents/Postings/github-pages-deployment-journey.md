---
title: 'GitHub Pages 배포를 위한 시행착오와 해결 과정'
summary: 'Vite 기반 블로그를 GitHub Pages에 배포하면서 겪은 Node.js 버전 호환성, 워크플로 설정, 액션 업그레이드 등의 문제를 해결한 과정을 공유합니다.'
date: '2025-09-11T13:27:00+09:00'
---

안녕하세요! 오늘은 제 블로그를 GitHub Pages에 배포하면서 겪은 다양한 시행착오와 해결 과정을 공유해 보려고 합니다. 로컬에서는 잘 돌아가던 코드가 CI 환경에서는 빌드 실패를 일으키고, 액션들이 deprecated되는 등 예상치 못한 문제들이 많았어요. 이 포스트는 git 커밋 히스토리와 워크플로 주석을 참고해서 정리한 내용입니다.

## 왜 GitHub Pages를 선택했나요?

블로그를 만들고 나서 가장 먼저 고민한 것은 배포 방식이었습니다. 여러 옵션이 있었지만 GitHub Pages를 선택한 이유는:

- **무료**이고 설정이 간단함
- **GitHub 리포지토리와 통합**되어 있어 코드와 배포가 한 곳에서 관리됨
- **HTTPS 지원**과 CDN을 통한 빠른 로딩
- **커스텀 도메인**도 지원됨

특히 Vite의 SPA(Single Page Application) 특성을 고려할 때, GitHub Pages의 라우팅 처리도 큰 문제가 되지 않았어요.

## 초기 시도: peaceiris/actions-gh-pages

처음에는 가장 널리 사용되는 `peaceiris/actions-gh-pages` 액션을 사용해 보았어요. 이 액션은 빌드된 파일들을 `gh-pages` 브랜치에 푸시해서 GitHub Pages로 배포하는 방식입니다.

```yaml
# 초안 워크플로 예시
- name: Deploy
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

하지만 로컬에서 `npm run deploy`를 실행했을 때 `GH_TOKEN`이 설정되지 않아서 원격 dispatch가 실패하는 문제가 있었어요. 결국 `gh` CLI로 워크플로를 수동 실행해야 했죠.

## 첫 번째 장벽: Node.js 버전 호환성

CI에서 빌드가 실패하기 시작했어요. 원인은 두 가지였습니다:

1. **Node 버전 불일치**: GitHub Actions 러너의 기본 Node 버전이 18인데, 제 프로젝트의 Vite가 Node 20.19 이상을 요구했어요.
2. **ESM 관련 오류**: `vite.config.ts`에서 ESM 모듈 import/export가 제대로 처리되지 않았어요.

해결책은 간단했어요:
```yaml
- name: Use Node.js (LTS)
  uses: actions/setup-node@v5
  with:
    node-version: 'lts/*'  # LTS 버전 사용
    cache: 'npm'
```

처음에는 `'20.19.0'`처럼 명시적인 버전을 사용했는데, 나중에 LTS(장기 지원 버전)로 바꿨어요. 이렇게 하면 Node.js가 업데이트되어도 자동으로 안정적인 최신 버전을 사용할 수 있거든요.

## 공식 Pages 워크플로로 전환

`peaceiris/actions-gh-pages`로 첫 배포는 성공했지만, GitHub Pages UI에서 배포 세부정보를 제대로 인식하지 못하는 문제가 있었어요. 그래서 공식 Pages 워크플로로 전환하기로 했습니다:

```yaml
name: Deploy to GitHub Pages (official)

on:
  workflow_dispatch: {}  # 수동으로만 실행

permissions:
  contents: read    # 코드 읽기 권한
  pages: write      # GitHub Pages에 쓰기 권한
  id-token: write   # 배포 인증을 위한 토큰

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5

      - name: Use Node.js (LTS)
        uses: actions/setup-node@v5
        with:
          node-version: 'lts/*'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build (run checks + build)
        run: npm run check  # ESLint, Prettier, 빌드를 한번에

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: ./dist

  deploy:
    needs: build  # build 작업이 끝나야 시작됨
    runs-on: ubuntu-latest
    steps:
      - name: Configure Pages
        uses: actions/configure-pages@v5

      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4.0.5
```

이 방식의 장점은:
- **GitHub Pages UI와 완벽하게 통합**됨 - 배포 상태를 실시간으로 확인 가능
- **보안 토큰 관리가 더 안전**함 - `id-token: write` 권한으로 안전하게 배포
- **빌드와 배포 분리** - build와 deploy 작업을 명확히 나눠서 문제 추적이 쉬움
- **`npm run check` 활용** - 코드 품질 검사(ESLint, Prettier)와 빌드를 한번에 실행

## 액션 버전 업그레이드와 최적화

시간이 지나면서 사용하던 액션들이 deprecated되는 문제가 생겼어요. 특히 `upload-pages-artifact`의 v3가 deprecated되면서 v4로 업그레이드해야 했죠.

```yaml
- name: Upload Pages artifact
  uses: actions/upload-pages-artifact@v4  # v2에서 v4로 업그레이드
  with:
    path: ./dist

- name: Configure Pages
  uses: actions/configure-pages@v5  # Pages 설정

- name: Deploy to GitHub Pages
  uses: actions/deploy-pages@v4.0.5  # 실제 배포
```

`configure-pages` 액션도 추가해서 GitHub Pages 설정을 명시적으로 했고, `deploy-pages`도 최신 안정 버전으로 유지했어요.

## 최종 결과

이러한 시행착오 끝에 안정적인 배포 워크플로를 구축할 수 있었어요. 이제는:

1. **로컬에서 `npm run deploy` 실행** - `gh` CLI나 API로 워크플로 트리거
2. **GitHub Actions가 자동으로**:
   - 코드 품질 검사 (ESLint, Prettier)
   - 프로젝트 빌드 (Vite)
   - 보안 감사 (npm audit)
   - GitHub Pages에 배포
3. **배포 완료** - 몇 분 후면 사이트에 반영됨

실제 성공한 run ID는 `17634011939`였고, 이후로도 안정적으로 배포가 되고 있습니다.

## 배운 점과 팁

GitHub Pages 배포를 위해서는:

1. **Node 버전 호환성**을 반드시 확인하세요
2. **공식 액션 사용**을 우선 고려하세요
3. **액션 버전**을 주기적으로 업데이트하세요
4. **커밋 히스토리**를 남겨서 문제 해결 과정을 추적하세요
5. **워크플로 주석**을 상세히 작성해서 미래의 자신을 도와주세요

특히 Vite 기반 프로젝트의 경우:
- `base: '/MyBlog/'` 설정을 vite.config.ts에 추가하세요
- SPA 라우팅을 위해 404.html을 설정하는 것도 고려해보세요

이 과정이 다른 분들의 GitHub Pages 배포에 도움이 되었으면 좋겠어요! 🚀

감사합니다! 😊
