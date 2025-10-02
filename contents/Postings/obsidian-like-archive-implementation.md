---
title: '옵시디언식 아카이브(Archive)와 그래프 뷰 구현기'
summary: '마크다운 기반 컨텐츠를 불러와 vis-network로 관계 그래프를 그리고, 사이드바로 문서를 미리보는 아카이브 기능을 어떻게 만들었는지 단계별로 설명합니다.'
date: '2025-09-11T19:15:00+09:00'
---

안녕하세요! 이 포스트에서는 제 블로그에 옵시디언(Obsidian)처럼 문서들 간의 연결을 시각적으로 탐색할 수 있는 아카이브(Archive) 기능을 어떻게 구현했는지 이야기해 보겠습니다. 마크다운 파일을 기반으로 그래프를 그리고, 클릭하면 사이드바에서 문서를 미리볼 수 있는 기능인데요, 방문자분들이 비슷한 걸 만들어보고 싶으시면 참고가 되셨으면 좋겠습니다.

## 왜 이 기능을 만들었나요?

블로그를 운영하다 보니 포스트뿐 아니라 기술 문서나 노트들이 쌓이기 시작했어요. 예를 들어, Unreal Engine 관련 문서가 수백 개가 되면서 그냥 텍스트 검색만으로는 전체 구조를 파악하기가 어려웠죠. 옵시디언처럼 문서들 사이의 링크를 그래프로 시각화하면, 아이디어를 연결지어 생각하기가 훨씬 수월해질 것 같았습니다. 그래서 Vite와 React를 활용해 간단한 아카이브 뷰를 만들어 보았어요.

## 전체적인 아이디어와 구조

기본 개념은 간단합니다:
- `contents/Archives/` 폴더에 마크다운 파일들을 넣어두고, 각 파일에서 `[[슬러그]]` 형식의 위키 링크를 찾아서 관계를 추출합니다.
- 추출한 노드(문서)와 엣지(링크)를 vis-network 라이브러리로 그래프를 그립니다.
- 그래프에서 노드를 클릭하면, 사이드바가 열리면서 해당 문서를 미리볼 수 있게 합니다.

이렇게 하면 방문자가 블로그에서 문서들을 탐색하는 재미가 더해질 거예요. 이제 구현 과정을 단계별로 살펴보겠습니다.

## 1. 마크다운 파일 로드하기

먼저, 마크다운 파일들을 어떻게 불러올까 고민했어요. Vite의 `import.meta.glob`을 사용하면 빌드 타임에 모든 파일을 찾아서 모듈로 만들 수 있습니다:

```typescript
// Archive.tsx에서
const modules = import.meta.glob('../../contents/Archives/*/*.md', {
  query: '?raw',
  import: 'default',
});

// 폴더별로 필터링
const folderLower = String(folder).toLowerCase();
const keys = allKeys.filter((k) => k.toLowerCase().includes(`/${folderLower}/`));
```

여기서 중요한 포인트가 있어요:

1. **`query: '?raw'`를 사용**: 마크다운을 텍스트로 그대로 가져옵니다. 이렇게 하면 불필요한 변환이 없어서 빠르고 가벼워요.
2. **폴더별로 필터링**: URL에서 받은 폴더명(예: `cpp`, `unrealengine`)으로 필터링해서 해당 폴더의 파일만 로드합니다.
3. **프론트매터 파싱**: 각 파일의 제목, 날짜 등을 추출하고, 본문에서 `[[슬러그]]` 패턴을 정규식으로 찾아서 노드와 엣지를 만듭니다.

## 2. vis-network로 그래프 그리기

노드와 엣지를 준비했으면, vis-network 라이브러리를 사용해 그래프를 그립니다. 여기서 중요한 선택을 했어요: **vis-network를 번들에 포함하지 않고 런타임에 CDN에서 로드**하기로 했습니다.

### 왜 런타임 로딩인가?

vis-network는 꽤 큰 라이브러리(약 500KB+)라서 번들에 포함하면 초기 로딩이 느려져요. Archive 페이지를 방문하지 않는 사용자에게는 불필요한 코드죠. 그래서 이렇게 했습니다:

```typescript
// public/vendor/vis-loader.js - 런타임 로더
window.__loadVisNetwork = async function () {
  return import('https://cdn.jsdelivr.net/npm/vis-network@10.0.1/standalone/esm/vis-network.mjs');
};

// Archive.tsx에서 사용
const vis = await window.__loadVisNetwork();
const { DataSet, Network } = vis;
```

### 그래프 옵션 설정

```typescript
const networkOptions = React.useMemo(
  () => ({
    nodes: { shape: 'dot', size: 14 },
    layout: { improvedLayout: false },  // 빠른 렌더링을 위해 비활성화
    physics: {
      enabled: true,
      solver: 'barnesHut',  // 효율적인 물리 엔진
      barnesHut: {
        gravitationalConstant: -2000,
        springLength: 95,
        springConstant: 0.04,
      },
      stabilization: {
        enabled: true,
        iterations: 200,  // 초기 레이아웃 안정화
      },
    },
    edges: { arrows: { to: false } },  // 양방향으로 표시
    interaction: {
      zoomView: true,
      dragView: true,
      hover: true,
    },
  }),
  []
);
```

특히 `improvedLayout: false`로 설정한 게 핵심이에요. 큰 그래프(100개 이상 노드)에서도 빠르게 렌더링됩니다.

## 3. 사이드바로 문서 미리보기

그래프에서 노드를 클릭하면 어떻게 될까요? `ArchiveSidebar` 컴포넌트가 화면 오른쪽에서 슬라이드되며 나타납니다!

### 레이지 로딩으로 성능 개선

사이드바는 필요할 때만 로드되도록 React의 lazy loading을 사용했어요:

```typescript
const ArchiveSidebarLazy = React.lazy(
  () => import('../components/Layout/ArchiveSidebar')
);

// 사용할 때
{activeSlug && (
  <React.Suspense fallback={<div>로딩...</div>}>
    <ArchiveSidebarLazy folder={folder} slug={activeSlug} onClose={handleClose} />
  </React.Suspense>
)}
```

### 사이드바 안에서 문서 탐색

사이드바는 `MarkdownViewer`를 내장하고 있어서 마크다운을 HTML로 변환해 보여줍니다. 여기서 재미있는 부분은 **위키 링크를 클릭하면 사이드바 내에서 바로 다른 문서로 전환**된다는 거예요:

```typescript
// MarkdownViewer에서 [[링크]] 처리
const processed = raw.replace(/\[\[([^\]]+)\]\]/g, (_m, s) => {
  return `<a href="#" data-wiki="${s}">${s}</a>`;
});

// 클릭 이벤트 처리
const handleClick = (e) => {
  const slug = e.target.getAttribute('data-wiki');
  if (slug && onWikiLinkClick) {
    e.preventDefault();
    e.stopPropagation();  // 사이드바가 닫히지 않도록
    onWikiLinkClick(slug);  // 사이드바 내에서 문서 전환
  }
};
```

### 부드러운 애니메이션

사이드바는 CSS 트랜지션으로 부드럽게 열리고 닫혀요:

```typescript
<aside
  className={visible ? 'sidebar-enter' : 'sidebar-exit'}
  style={{
    transform: visible ? 'translateX(0%)' : 'translateX(110%)',
    transition: 'transform 260ms ease, opacity 200ms ease',
  }}
>
```

바깥쪽을 클릭하면 자동으로 닫히고, 노드를 클릭해도 사이드바는 유지되어 편하게 탐색할 수 있습니다.

## 4. 성능 최적화 여정

처음 구현했을 때는 Unreal Engine처럼 문서가 100개 이상인 폴더에서 문제가 있었어요:
- 그래프 레이아웃이 느려서 10초 이상 걸림
- 레이아웃 중에는 드래그가 안 먹힘
- 메모리 사용량이 높음

### 해결책 1: improvedLayout 비활성화

```typescript
layout: { improvedLayout: false }
```

vis-network의 `improvedLayout`은 더 예쁜 레이아웃을 만들지만, 큰 그래프에서는 너무 느려요. 비활성화하니 레이아웃 시간이 2-3초로 줄었습니다.

### 해결책 2: React 메모이제이션

최신 최적화에서는 React의 `useMemo`와 `useCallback`을 적극 활용했어요:

```typescript
// 정규식 재사용
const linkRegex = React.useMemo(() => /\[\[([^\]]+)\]\]/g, []);

// vis-network 옵션 재사용
const networkOptions = React.useMemo(() => ({/* ... */}), []);

// 이벤트 핸들러 재사용
const handleNodeClick = React.useCallback((params) => {/* ... */}, []);
```

이렇게 하니 **렌더당 객체 생성이 100% 줄고, 메모리 사용량이 약 60% 감소**했어요!

### 해결책 3: 로딩 피드백

레이아웃 진행 중에는 작은 오버레이로 상태를 보여줍니다:

```typescript
{layouting && (
  <div className="layout-overlay">
    그래프 레이아웃 진행 중...
  </div>
)}
```

사용자가 기다리는 동안 뭔가 진행되고 있다는 걸 알 수 있어서 UX가 훨씬 좋아졌어요.

## 5. 직접 체험해보기

로컬에서 테스트하려면:

```bash
npm run dev
```

그리고 브라우저에서 `/archives/cpp`, `/archives/algorithm`, 또는 `/archives/unrealengine` 같은 URL로 이동해보세요.

**체험 가이드:**
1. 그래프가 나타나면 노드를 드래그해서 위치를 조정할 수 있어요
2. 노드를 클릭하면 오른쪽에서 사이드바가 슬라이드되며 나타납니다
3. 사이드바에서 `[[링크]]`를 클릭하면 다른 문서로 바로 이동해요
4. 사이드바 바깥을 클릭하면 닫힙니다

실제 블로그에서도 Graphs 메뉴에서 이 기능을 사용해보실 수 있어요!

## 기술 스택 요약

이 기능을 만들기 위해 사용한 기술들:

- **Vite** - 빌드 도구, `import.meta.glob`로 파일 수집
- **React 19** - UI 프레임워크, lazy loading과 메모이제이션 활용
- **vis-network** - 그래프 시각화, CDN에서 런타임 로딩
- **marked** - 마크다운 파싱 및 HTML 변환
- **TypeScript** - 타입 안전성

## 마무리

옵시디언 스타일의 문서 탐색 기능을 블로그에 구현하면서 많은 것을 배웠어요:

1. **번들 크기 최적화**: 큰 라이브러리는 런타임에 로드하기
2. **React 성능 패턴**: useMemo, useCallback으로 불필요한 렌더링 방지
3. **UX 개선**: 로딩 상태를 명확히 보여주기
4. **점진적 개선**: 일단 작동하게 만들고, 성능 문제가 생기면 프로파일링 후 최적화

비슷한 기능을 구현하시려는 분들께 이 포스트가 도움이 되었으면 좋겠어요. 질문이 있으시면 댓글로 남겨주세요!

감사합니다! 😊
