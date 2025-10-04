---
title: 'GitHub Pages에서 SPA 라우팅 404 문제 해결하기'
summary: 'React Router를 사용하는 SPA를 GitHub Pages에 배포했을 때 직접 URL 접근 시 404가 발생하는 문제를 해결한 과정을 공유합니다.'
date: '2025-10-04T19:23:00+09:00'
---

안녕하세요! 오늘은 제 포트폴리오 페이지를 만들고 자소서에 링크를 넣었다가 당한 뼈아픈 경험을 공유하려고 합니다. 분명 잘 작동하던 사이트였는데, 막상 링크를 타고 들어가니 404 에러가 떴어요... 😱

## 문제 발견: "어? 왜 홈으로 가지?"

포트폴리오 페이지를 열심히 만들고, 자소서에 `https://pargame.github.io/MyBlog/portfolio` 링크를 넣었어요. 그런데 막상 이 링크를 주소창에 붙여넣고 엔터를 치니... 포트폴리오가 아니라 홈으로 가는 거예요! 😭

처음에는 "내가 뭘 잘못했나?" 싶어서 브라우저 콘솔을 열어봤더니:

```
portfolio:1  Failed to load resource: the server responded with a status of 404 ()
```

아... 404 에러였습니다. 근데 신기한 건, 사이트 내에서 포트폴리오 메뉴를 클릭하면 잘 작동한다는 거예요. 뭐가 문제일까요?

## SPA의 숨겨진 함정

### SPA는 어떻게 작동하나요?

제 블로그는 React와 React Router를 사용하는 **SPA(Single Page Application)** 입니다. SPA는 실제로는 `index.html` 파일 하나만 있고, 페이지 전환은 JavaScript로 처리해요.

예를 들어:
- 사용자가 "Portfolio" 메뉴를 클릭
- React Router가 `/portfolio` 경로로 URL 변경
- JavaScript가 Portfolio 컴포넌트를 렌더링

이 모든 과정이 브라우저 안에서 일어나기 때문에, 서버에 새로운 요청을 보내지 않아요. 그래서 엄청 빠르고 부드럽죠!

### 그럼 직접 URL을 입력하면?

문제는 사용자가 주소창에 `https://pargame.github.io/MyBlog/portfolio`를 직접 입력하거나 북마크로 접근할 때 발생해요:

1. 브라우저가 서버에 `/MyBlog/portfolio` 파일을 요청
2. GitHub Pages는 "portfolio라는 파일이 없는데요?" 🤔
3. 404 에러 발생!

왜냐하면 실제로는 `portfolio.html` 같은 파일이 없거든요. 모든 라우팅은 `index.html`에 있는 JavaScript가 처리하는 건데, 서버는 그걸 모르는 거죠.

## 첫 번째 시도: sessionStorage 사용

처음에는 GitHub Pages의 404 페이지를 이용한 꼼수를 써봤어요.

**작동 원리:**

1. `404.html`을 만들어서 404 에러가 발생하면 이 페이지가 뜸
2. 404.html에서 현재 경로를 sessionStorage에 저장
3. `index.html`로 리다이렉트
4. index.html이 로드되면서 저장된 경로를 복원

코드는 이렇게 만들었어요:

**public/404.html:**
```html
<script>
  // 현재 경로를 저장하고 홈으로 리다이렉트
  sessionStorage.setItem('redirect', 
    location.pathname + location.search + location.hash);
  location.replace(location.origin + '/MyBlog/');
</script>
```

**index.html:**
```html
<script>
  // 저장된 경로를 복원
  (function() {
    var redirect = sessionStorage.getItem('redirect');
    if (redirect) {
      sessionStorage.removeItem('redirect');
      history.replaceState(null, '', redirect);
    }
  })();
</script>
```

### 왜 실패했나요?

이론적으로는 완벽해 보였지만... 실제로는 작동하지 않았어요. 왜일까요?

문제는 **타이밍**이었습니다:

1. index.html이 로드됨 → 스크립트가 URL을 `/portfolio`로 변경
2. React가 로드되기 시작
3. React Router가 초기화되면서 현재 브라우저 URL을 확인
4. **그런데 이미 React Router 초기화가 시작될 때는 URL이 `/MyBlog/`였음!**
5. 결국 홈으로 이동...

`history.replaceState`로 URL을 바꿔도, React Router가 초기화되는 시점에는 이미 늦은 거죠. React Router는 자기가 초기화될 때의 URL을 기준으로 라우팅을 결정하거든요.

## 해결책: URL 파라미터 사용

타이밍 문제를 해결하려면, React Router가 로드되기 **전에** URL을 올바르게 설정해야 했어요. 그래서 생각해낸 방법이 바로 **URL 파라미터**를 사용하는 거였습니다!

**새로운 작동 원리:**

1. 사용자가 `/portfolio` 접근 → 404 발생
2. `404.html`이 `/?redirect=/portfolio`로 리다이렉트
3. `index.html` 로드되면서 스크립트가 `redirect` 파라미터 확인
4. 파라미터 값으로 URL을 `/MyBlog/portfolio`로 변경
5. **이제 React Router가 로드될 때 이미 URL은 `/portfolio`!**
6. 올바른 페이지 렌더링 성공! 🎉

### 구현 코드

**public/404.html (수정):**
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8" />
    <title>Redirecting...</title>
    <script>
        // 경로를 URL 파라미터로 인코딩
        var path = location.pathname.replace(/^\/MyBlog/, '') 
                   + location.search + location.hash;
        var redirect = '/?redirect=' + encodeURIComponent(path);
        location.replace(location.origin + '/MyBlog/' + redirect);
    </script>
</head>
<body></body>
</html>
```

핵심은 경로를 `encodeURIComponent`로 안전하게 인코딩해서 URL 파라미터에 넣는 거예요.

**index.html (수정):**
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MyBlog</title>
  <link rel="icon" type="image/svg+xml" href="/MyBlog/favicon.svg">
  <script>
    // URL 파라미터에서 redirect 값 읽기
    (function () {
      var search = window.location.search;
      if (search) {
        var match = search.match(/[?&]redirect=([^&]+)/);
        if (match) {
          var redirect = decodeURIComponent(match[1]);
          // URL을 정리하고 페이지 새로고침 없이 변경
          history.replaceState(null, '', '/MyBlog' + redirect);
        }
      }
    })();
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### 왜 이 방법이 작동하나요?

중요한 포인트는:

1. **동기적 실행**: 스크립트가 `<head>` 안에서 **즉시** 실행됨
2. **React 로드 전**: `<script type="module">` 태그는 스크립트 다음에 실행됨
3. **URL 변경 완료**: React Router가 초기화될 때는 이미 올바른 URL로 설정되어 있음

이렇게 하면 React Router가 로드될 때 이미 브라우저 URL이 `/MyBlog/portfolio`로 설정되어 있어서, 자연스럽게 포트폴리오 페이지가 렌더링됩니다!

## 테스트와 배포

수정 후 빌드하고 배포했어요:

```bash
npm run check  # ESLint, Prettier, 빌드
npm run deploy # GitHub Actions 워크플로 실행
```

2-3분 기다린 후, 다시 `https://pargame.github.io/MyBlog/portfolio` 링크를 쳐봤습니다...

**짜잔! 포트폴리오 페이지가 제대로 떴어요!** 🎉

## 배운 점

### 1. SPA와 정적 호스팅의 차이 이해하기

SPA는 클라이언트 사이드 라우팅을 사용하지만, 정적 호스팅 서버는 그걸 몰라요. 이 간극을 메우는 방법을 배웠습니다.

### 2. 타이밍이 중요하다

첫 번째 시도가 실패한 이유는 단순히 "타이밍"이었어요. 좋은 코드를 작성하는 것도 중요하지만, 그 코드가 **언제** 실행되는지도 똑같이 중요하다는 걸 깨달았습니다.

### 3. 디버깅의 중요성

콘솔에 `Failed to load resource: the server responded with a status of 404`라는 메시지가 없었다면 문제를 찾기 훨씬 어려웠을 거예요. 브라우저 개발자 도구는 정말 강력한 도구입니다!

### 4. 문서를 찾아보자

사실 이 문제는 SPA를 정적 호스팅에 배포할 때 흔히 겪는 문제예요. [Create React App 문서](https://create-react-app.dev/docs/deployment/#github-pages)나 다른 블로그 포스트들을 찾아보면 비슷한 해결책들이 많이 나와요. 하지만 직접 부딪혀보고 해결하니까 훨씬 더 확실하게 이해가 되더라고요!

## 마치며

자소서에 넣을 포트폴리오 링크 하나 때문에 시작된 디버깅이었지만, SPA 라우팅과 브라우저 동작 원리에 대해 많이 배울 수 있었습니다. 

혹시 여러분도 GitHub Pages나 다른 정적 호스팅에 React Router를 사용하는 SPA를 배포하고 계신가요? 직접 URL 접근 시 404가 뜬다면, 이 포스트가 도움이 되었으면 좋겠습니다!

읽어주셔서 감사합니다! 😊
