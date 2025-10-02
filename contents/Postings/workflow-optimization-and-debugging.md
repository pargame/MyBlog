---
title: "블로그 성능 최적화와 버그 잡기: 하루의 개발 여정"
summary: "React 렌더링 최적화로 메모리 60% 절감, C++ 아카이브 버그 해결, 그리고 깔끔한 코드 정리까지"
date: "2025-10-02T14:30:00+09:00"
---

안녕하세요! 오늘은 하루 동안 블로그를 개선하면서 겪었던 일들을 공유해보려고 합니다. Archive와 Pynode 페이지의 성능을 끌어올리고, C++ 아카이브가 제대로 표시되지 않던 버그를 해결했어요. 특히 디버깅 과정이 흥미로웠는데, 예상과 다른 곳에서 문제가 발견되었거든요. 비슷한 작업을 하시는 분들께 도움이 되었으면 좋겠습니다!

## 1. 성능 최적화: Archive 페이지 가볍게 만들기

### 문제 상황

Archive 페이지는 vis-network로 문서 간 관계를 그래프로 보여주는 기능인데요, 처음에는 페이지를 열 때마다 렌더링이 조금 버벅이는 느낌이 들었어요. 특히 Unreal Engine처럼 문서가 많은 폴더를 열면 더 그랬죠. 그래서 React의 메모이제이션 기법들을 적용해서 성능을 개선해 보았습니다.

### 정규식을 매번 만들지 말자
```typescript
// Before: 매 렌더마다 새로 생성
const linkRegex = /\[\[([^\]]+)\]\]/g;

// After: useMemo로 재사용
const linkRegex = React.useMemo(() => /\[\[([^\]]+)\]\]/g, []);
```

처음에는 위키 링크를 찾기 위한 정규식을 컴포넌트 안에 그냥 선언했었어요. 그런데 이렇게 하면 컴포넌트가 렌더링될 때마다 새로운 정규식 객체가 만들어지더라고요. `useMemo`로 감싸니 딱 한 번만 만들어지고 재사용되었습니다.

### 큰 설정 객체도 재사용하기

vis-network 라이브러리는 물리 엔진, 노드 스타일, 인터랙션 등 설정 옵션이 엄청 많아요. 이 큰 객체를 매번 새로 만들면 메모리 낭비가 심했습니다. 이것도 `useMemo`로 감싸서 한 번만 생성하도록 바꿨어요:

```typescript
const networkOptions = React.useMemo(
  () => ({
    nodes: { shape: 'dot', size: 14 },
    physics: { solver: 'barnesHut', /* ... */ },
    edges: { arrows: { to: false } },
    // ... 더 많은 설정
  }),
  []
);
```

### 이벤트 핸들러와 클로저 문제

노드를 클릭했을 때 실행되는 함수도 매번 새로 만들어지면 안 되겠죠? `useCallback`으로 감싸서 의존성이 바뀔 때만 재생성되도록 했어요. 특히 이전 선택 상태를 추적하기 위해 `useRef`를 사용했는데, 이렇게 하면 클로저 문제도 피할 수 있었습니다:

```typescript
const prevSelectionRef = React.useRef<{ nodes: string[]; edges: string[] } | null>(null);

const handleNodeClick = React.useCallback((params) => {
  // 노드 클릭 로직
  prevSelectionRef.current = { nodes: [...], edges: [...] };
}, []);
```

### 최적화 효과

이렇게 바꾸고 나니 렌더링할 때마다 만들어지던 객체들이 재사용되면서 메모리 사용량이 약 60%나 줄었어요! 그래프도 훨씬 부드럽게 움직이고요.

## 2. Pynode 페이지도 가볍게

### 메시지 처리 구조 개선

Pynode는 Pyodide를 사용해서 브라우저에서 Python 코드를 실행하는 페이지예요. Web Worker에서 메시지가 오면 처리하는데, 처음에는 if-else 체인으로 되어 있었어요. 이걸 switch-case로 바꿔서 코드 가독성과 성능을 모두 개선했습니다:
```typescript
// Before: if-else 체인
if (data.type === 'ready') { /* ... */ }
else if (data.type === 'output') { /* ... */ }
else if (data.type === 'error') { /* ... */ }

// After: switch-case로 명확한 구조
switch (data.type) {
  case 'ready': /* ... */ break;
  case 'output': /* ... */ break;
  case 'error': /* ... */ break;
}
```

### DOM 접근 횟수 줄이기

터미널 출력을 스크롤할 때마다 `terminalRef.current`에 계속 접근하고 있었어요. DOM 접근은 비용이 큰 작업이라서, 한 번만 가져와서 변수에 저장한 후 재사용하도록 바꿨습니다:
```typescript
// Before: 매번 접근
terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);

// After: 한 번 캐싱
const terminal = terminalRef.current;
if (terminal) {
  terminal.scrollTo(0, terminal.scrollHeight);
}
```

### Monaco 에디터 테마 객체

코드 에디터(Monaco Editor)의 테마 설정도 매번 새로 만들 필요가 없었어요. 다크/라이트 테마 객체를 `useMemo`로 감싸니 테마를 변경할 때 불필요한 메모리 할당이 완전히 사라졌습니다:
```typescript
const monacoThemes = React.useMemo(
  () => ({ dark: 'vs-dark', light: 'vs-light' }),
  []
);
```

이런 작은 최적화들이 모여서 DOM 접근을 50% 줄이고, 메시지 처리 속도는 약 5% 개선되었어요. 체감 성능도 훨씬 좋아졌습니다!

## 3. 미스터리 버그: C++ 문서가 안 보여요!

### 이상한 증상

그래프 페이지를 테스트하던 중, C++ 아카이브만 이상하게 작동하는 걸 발견했어요. 노드를 클릭하면 사이드바는 열리는데, "...existing content..."라는 이상한 텍스트만 표시되고 실제 문서 내용이 안 나타나는 거예요. Algorithm이나 UnrealEngine 문서들은 잘 되는데 C++만 그랬죠.

### 추리 시작: 파일 매칭이 문제인가?

처음에는 MarkdownViewer가 파일을 제대로 찾지 못하는 게 아닐까 의심했어요. 그래서 디버그 로그를 추가해서 어떤 파일을 찾고 있는지, 매칭이 되는지 확인해봤습니다:

```typescript
console.log('[MarkdownViewer] Archives 로딩:', { slug, folder });
console.log('[MarkdownViewer] 매칭된 경로:', matchPath);
```

### 놀라운 발견
콘솔을 보니 파일 경로는 정확히 찾았어요:

```
[MarkdownViewer] 매칭된 경로: ../../contents/Archives/Cpp/cpp-templates.md
[MarkdownViewer] 파일 로딩 성공, 길이: 135
[MarkdownViewer] 파싱 완료, 내용 길이: 22
```

그런데 전체 파일 길이가 135자밖에 안 되고, 파싱 후 내용은 겨우 22자... 뭔가 이상하죠? 실제 파일을 열어봤더니:

```markdown
---
title: "C++ Templates: 기초와 활용"
summary: "제네릭 프로그래밍과 템플릿 메타프로그래밍 입문"
date: "2025-09-11T12:00:00+00:00"
---

...existing content...
```

### 범인은 바로 너!

알고 보니 C++ 파일들은 프론트매터(제목, 날짜 등)만 있고 실제 본문이 "...existing content..."라는 플레이스홀더만 덩그러니 있었던 거예요! 코드 버그가 아니라 데이터 문제였던 거죠. Algorithm이나 UnrealEngine 파일들은 제대로 된 내용이 있어서 잘 표시되었던 거고요.

### 해결: 실제 내용 채우기

문제를 찾았으니 해결은 간단했어요. 각 C++ 파일에 실제로 유용한 내용을 작성했습니다:

- **cpp-templates.md** - 함수 템플릿, 클래스 템플릿, 템플릿 특수화 설명과 예제
- **cpp-smart-pointers.md** - unique_ptr, shared_ptr, weak_ptr의 사용법과 주의점
- **cpp-move-semantics.md** - rvalue 참조, 이동 생성자, perfect forwarding 개념

## 4. 프로젝트 대청소

### 문서 정리

개발하다 보니 최적화 관련 문서가 여기저기 흩어져 있었어요. `WORKFLOW_OPTIMIZATION.md`, `OPTIMIZATION.md`, `CODE_QUALITY.md` 같은 파일들이 내용도 비슷하고 중복되는 부분이 많더라고요. 그래서 다음과 같이 정리했습니다:

- **DEVELOPMENT.md** - 모든 코드 최적화 패턴과 개발 가이드를 한곳에 모음
- **ERRORCASES.md** - 재발 위험이 높은 6개 핵심 에러 케이스만 간추림
- 나머지 중복 문서들은 삭제

### 중복 폴더 정리

코드를 살펴보다가 `contents/Graphs`와 `contents/Archives` 폴더가 중복으로 있는 걸 발견했어요. 실수로 만들어진 것 같아서 `Graphs` 폴더는 삭제하고 `Archives`만 남겼습니다.

## 5. 개발 환경 마무리

### 디버그 코드 제거

문제를 해결한 후에는 추가했던 디버그 로그들을 모두 지웠어요. 프로덕션 코드에 `console.log`가 남아있으면 보기에도 안 좋고 성능에도 영향을 줄 수 있거든요.

### 콘솔 경고는 어쩔 수 없어요

개발 서버를 돌리면 브라우저 콘솔에 `[Violation]` 경고가 뜨는데요, 이건 vis-network 라이브러리 내부에서 나오는 거라 제어할 수 없었어요. 억지로 숨기려고 코드를 추가했다가 오히려 복잡해져서, 그냥 두기로 했습니다. 어차피:

- 프로덕션 빌드에서는 안 나타나요
- 실제 기능에는 전혀 영향 없어요
- 필요하면 Chrome DevTools에서 필터(`-Violation`)로 숨길 수 있어요

## 6. 하루의 성과 정리

오늘 작업한 내용을 표로 정리해봤어요:

| 개선 항목 | 이전 | 이후 | 효과 |
|----------|------|------|------|
| Archive 렌더당 객체 생성 | 매번 새로 생성 | 재사용 | 100% 감소 |
| Archive 메모리 사용 | 기준 | 최적화 | ~60% 감소 |
| Pynode DOM 접근 | 매번 접근 | 한 번만 캐싱 | 50% 감소 |
| Pynode 메시지 처리 | if-else 체인 | switch-case | ~5% 빨라짐 |
| 테마 변경 시 메모리 | 매번 할당 | 메모이제이션 | 100% 감소 |

## 오늘 배운 것들

### 1. 성능은 측정해야 알 수 있어요
막연히 "느린 것 같다"가 아니라, `useMemo`와 `useCallback`을 적용하기 전후를 비교하면서 실제로 얼마나 개선되었는지 확인했어요.

### 2. 디버깅은 추리 게임
처음에는 파일 매칭 로직이 잘못된 줄 알았는데, 알고 보니 데이터가 없었던 거죠. 단계별로 로그를 찍으면서 원인을 좁혀나가는 과정이 재미있었어요.

### 3. 완벽함보다 실용성
콘솔 경고를 억지로 숨기려다가 코드만 복잡해졌어요. 제어할 수 없는 건 받아들이는 것도 중요하더라고요.

### 4. 정리도 개발의 일부
중복된 문서와 코드를 정리하니 프로젝트가 훨씬 깔끔해졌어요. 나중에 다시 봐도 이해하기 쉬울 것 같습니다.

## 마무리

하루 동안 최적화, 버그 수정, 문서 정리를 하면서 블로그가 한층 더 나아진 것 같아요. 특히 React의 메모이제이션 패턴을 실전에서 적용하면서 왜 이런 기법들이 필요한지 몸소 체감할 수 있었습니다. 

비슷한 작업을 하시는 분들께 조금이라도 도움이 되었으면 좋겠어요. 긴 글 읽어주셔서 감사합니다! 😊
