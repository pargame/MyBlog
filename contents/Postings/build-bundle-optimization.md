---
title: '빌드 번들 크기 최적화: Vite에서 React 앱 사이즈 줄이기'
summary: 'Vite 기반 React 블로그의 빌드 번들 크기를 줄이기 위해 시도한 코드 스플리팅, 동적 임포트, 청킹 전략 등의 최적화 방법을 공유합니다.'
date: '2025-09-11T17:43:00+09:00'
---

안녕하세요! 오늘은 제 블로그의 빌드 번들 크기를 어떻게 최적화했는지 공유해 보려고 합니다. 초기에는 vendor 번들이 400KB가 넘었고, 각 페이지별로도 큰 청크들이 있었어요. 방문자들의 로딩 속도를 개선하기 위해 다양한 방법을 시도했고, 그 과정을 git 커밋 히스토리를 참고해서 정리해 보았습니다.

## 왜 번들 크기 최적화가 중요한가?

빌드 번들 크기가 크면:
- **초기 로딩 시간**이 길어짐
- **사용자 경험**이 저하됨
- **SEO 점수**가 낮아질 수 있음
- **모바일 사용자**에게 특히 부담스러움

특히 제 블로그처럼 마크다운 기반의 콘텐츠 사이트에서는, 방문자들이 빠르게 콘텐츠를 볼 수 있어야 하는데 큰 번들이 이를 방해할 수 있죠.

## 초기 상황 분석

프로젝트 초기에는 다음과 같은 문제가 있었어요:

```bash
# 초기 빌드 결과 (예상)
dist/
├── assets/
│   ├── index-[hash].js     # 500KB+ (모든 코드 포함)
│   └── vendor-[hash].js    # 400KB+ (모든 의존성)
```

특히 `vis-network` 라이브러리가 큰 부분을 차지했어요. 이 라이브러리는 그래프 시각화를 위해 필요하지만, 모든 페이지에서 로드될 필요는 없었죠.

## 1. 코드 스플리팅: 동적 임포트 적용

가장 효과적인 방법은 **코드 스플리팅**이었습니다. Vite의 동적 임포트 기능을 활용해서 필요한 때에만 코드를 로드하도록 했어요.

### Archive 페이지용 동적 임포트

```typescript
// src/pages/Archive.tsx
import { lazy, Suspense } from 'react';

const Archive = lazy(() => import('./pages/Archive'));

// App.tsx 또는 라우터에서
<Suspense fallback={<div>Loading...</div>}>
  <Archive />
</Suspense>
```

이렇게 하면 Archive 페이지를 방문할 때에만 관련 코드가 로드됩니다.

### vis-network의 지연 로딩

vis-network는 특히 무거운 라이브러리였어요. 처음에는 직접 임포트했지만:

```typescript
// ❌ 초기 방식
import { Network } from 'vis-network';

// ✅ 최적화된 방식
const loadVisNetwork = async () => {
  const { Network } = await import('vis-network');
  return Network;
};
```

## 2. 수동 청킹 전략: manualChunks 활용

Vite의 `manualChunks` 옵션을 사용해서 번들을 더 세밀하게 분리했어요. 특히 vis-network를 여러 청크로 나누는 전략이 효과적이었어요.

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id) return undefined;

          // vis-network를 최대 4개의 청크로 분할
          if (id.includes('node_modules/vis-network')) {
            let h = 0;
            for (let i = 0; i < id.length; i++) {
              h = (h + id.charCodeAt(i)) | 0;
            }
            const idx = Math.abs(h) % 4 + 1; // 1..4
            return `vis-network-${idx}`;
          }

          // 기타 node_modules는 vendor로
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});
```

이렇게 하면:
- 각 vis-network 청크가 ~50-70KB 정도로 작아짐
- 캐시 효율성이 향상됨
- 초기 로딩 시 필요한 청크만 로드됨

## 3. 콘텐츠 로딩 최적화: import.meta.glob 활용

마크다운 파일들을 효율적으로 로드하기 위해 `import.meta.glob`을 사용했어요.

```typescript
// ✅ 최적화된 방식
const modules = import.meta.glob('../../contents/Archives/*/*.md', {
  query: '?raw',
  import: 'default',
});

// ❌ 비효율적인 방식 (이전)
// const modules = import.meta.glob('../../contents/Archives/*/*.md');
```

`query: '?raw'`를 추가하면 마크다운 파일을 텍스트로만 로드해서 불필요한 변환 과정을 생략할 수 있어요.

## 4. 트리 쉐이킹과 의존성 관리

사용하지 않는 코드를 제거하기 위해:

### TypeScript 엄격 모드 적용
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    // ...
  }
}
```

### ESLint 규칙 추가
```javascript
// eslint.config.js
{
  rules: {
    'no-unused-vars': 'error',
    // ...
  }
}
```

## 5. 빌드 결과 모니터링

매번 빌드할 때마다 결과를 확인하면서 최적화 효과를 측정했어요:

```bash
npm run build
```

빌드 결과에서 각 청크의 크기를 확인하고, 필요에 따라 청킹 전략을 조정했습니다.

## 현재 최적화 결과

최적화 후 빌드 결과:

```bash
dist/assets/
├── vendor-kuhtQkJ6.js        289.36 kB │ gzip: 91.78 kB
├── index-IlMTL-49.js         34.91 kB │ gzip: 8.33 kB
├── Archive-Q9hMJXI1.js       26.91 kB │ gzip: 5.66 kB
├── MarkdownViewer-xC30Uf66.js 25.13 kB │ gzip: 4.76 kB
├── vis-network-1-[hash].js    ~50 kB │ gzip: ~15 kB (x4)
└── obsidian-like-archive-implementation-ss_kfWZt.js 9.03 kB │ gzip: 3.99 kB
```

## 추가 최적화 고려사항

더 개선할 수 있는 부분들:

### 1. 이미지 최적화
```typescript
// vite.config.ts
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [imagetools()],
});
```

### 2. 폰트 최적화
```css
/* CSS에서 */
@font-face {
  font-display: swap; /* 로딩 중 텍스트 표시 */
}
```

### 3. Service Worker 캐싱
```typescript
// PWA를 위한 캐시 전략
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## 결론

빌드 번들 크기 최적화는 지속적인 과정입니다:

1. **측정**: 현재 번들 크기 파악
2. **분석**: 어떤 부분이 큰지 식별
3. **최적화**: 코드 스플리팅, 청킹, 트리 쉐이킹 적용
4. **모니터링**: 결과 확인 및 반복

특히 Vite의 강력한 빌드 시스템을 활용하면 비교적 쉽게 좋은 결과를 얻을 수 있어요. 방문자들의 로딩 경험을 개선하기 위해 앞으로도 계속 최적화할 계획입니다!

## 참고 자료

- [Vite 빌드 최적화 가이드](https://vitejs.dev/guide/build.html)
- [Rollup 청킹 전략](https://rollupjs.org/guide/en/#outputmanualchunks)
- [Web.dev 번들 분석](https://web.dev/reduce-bundle-size/)

이 글이 다른 분들의 번들 최적화에 도움이 되었으면 좋겠어요! 🚀

감사합니다! 😊
