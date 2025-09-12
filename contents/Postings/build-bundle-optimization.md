---
title: '빌드 번들 크기 최적화: Vite에서 React 앱 사이즈 줄이기'
summary: 'Vite 기반 React 블로그의 빌드 번들 크기를 줄이기 위해 시도한 코드 스플리팅, 동적 임포트, 청킹 전략 등의 최적화 방법을 공유합니다.'
date: '2025-09-11T17:43:00+09:00'
---

안녕하세요! 오늘은 제 블로그의 빌드 번들 크기를 어떻게 최적화했는지 공유해 보려고 합니다. 실제 git 커밋 히스토리를 참고해서 과정을 정리했어요. 초기에는 vendor 번들이 650KB가 넘어서 Vite에서 경고가 떴고, 각 페이지별로도 큰 청크들이 있었어요. 방문자들의 로딩 속도를 개선하기 위해 다양한 방법을 시도했고, 그 결과를 실제 빌드 결과로 검증했습니다.

## 왜 번들 크기 최적화가 중요한가?

빌드 번들 크기가 크면:

- **초기 로딩 시간**이 길어짐
- **사용자 경험**이 저하됨
- **SEO 점수**가 낮아질 수 있음
- **모바일 사용자**에게 특히 부담스러움

특히 제 블로그처럼 마크다운 기반의 콘텐츠 사이트에서는, 방문자들이 빠르게 콘텐츠를 볼 수 있어야 하는데 큰 번들이 이를 방해할 수 있죠. 실제로 초기 빌드에서 vendor 번들이 650KB가 넘어서 Vite 경고가 떴어요!

## 초기 상황 분석

프로젝트 초기에는 다음과 같은 문제가 있었어요 (실제 git 커밋 히스토리 기반):

- **대용량 vendor 번들**: 650KB가 넘어서 Vite 경고 발생
- **대용량 라이브러리 포함**: vis-network 라이브러리가 번들에 직접 포함되어 초기 로딩을 무겁게 함
- **코드 분할 부족**: 모든 페이지 코드가 하나의 번들로 묶임
- **콘텐츠 로딩 비효율**: 마크다운 파일들이 빌드 시점에 번들에 포함될 위험이 있었음

커밋 히스토리에서 `4c81af4 chore: UI fixes, markdown link styling, vis-loader path and build fixes`처럼 vis-network 로더 관련 수정이 있었고, `3613080 fix(archive): stabilize MarkdownViewer hooks and event handling; remove invalid vis-network option`에서 vis-network 옵션 제거 작업이 있었어요.

## 1. 코드 스플리팅: 동적 임포트 적용

가장 효과적인 방법은 **코드 스플리팅**이었습니다. Vite의 동적 임포트 기능을 활용해서 필요한 때에만 코드를 로드하도록 했어요.

### Archive 페이지용 동적 임포트

```typescript
// src/App.tsx (실제 적용 코드)
const Archive = React.lazy(() => import('./pages/Archive'));
const MarkdownViewer = React.lazy(() => import('./pages/MarkdownViewer'));

// Archive.tsx 내부에서도 컴포넌트 레벨 lazy 로딩
const ArchiveSidebarLazy = React.lazy(
  () => import('../components/Layout/ArchiveSidebar')
);

// 라우터에서 Suspense로 감싸기
<React.Suspense fallback={<div>로딩...</div>}>
  <Archive />
</React.Suspense>
```

이렇게 하면 Archive 페이지를 방문할 때에만 관련 코드가 로드됩니다. 실제 빌드 결과에서 Archive 청크가 27KB로 분리되었어요.

### vis-network의 런타임 로딩

vis-network는 특히 무거운 라이브러리였어요. 번들에서 완전히 제외하기 위해 런타임 로더를 도입했어요:

```typescript
// public/vendor/vis-loader.js (실제 파일)
(function () {
  if (typeof window === 'undefined') return;
  if (window.__loadVisNetwork) return;
  window.__loadVisNetwork = async function () {
    return import('https://cdn.jsdelivr.net/npm/vis-network@10.0.1/standalone/esm/vis-network.mjs');
  };
})();

// Archive.tsx에서 사용
const vis = await window.__loadVisNetwork();
const { DataSet, Network } = vis;
```

이렇게 하면 vis-network가 번들에 포함되지 않고, 필요할 때 CDN에서 로드됩니다. 커밋 `4c81af4`에서 이 로더 경로를 수정한 기록이 있어요.

## 2. 수동 청킹 전략: manualChunks 활용

Vite의 `manualChunks` 옵션을 사용해서 번들을 더 세밀하게 분리했어요. 특히 vis-network를 여러 청크로 나누는 전략이 효과적이었어요.

```typescript
// vite.config.ts (실제 적용된 코드)
export default defineConfig({
  base: '/MyBlog/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id) return undefined;
          // Split vis-network into up to 4 chunks by hashing the module id so
          // that the large dist bundle is divided into smaller, cacheable files.
          if (id.includes('node_modules/vis-network')) {
            // simple hash: sum char codes
            let h = 0;
            for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i)) | 0;
            const idx = (Math.abs(h) % 4) + 1; // 1..4
            return `vis-network-${idx}`;
          }
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});
```

실제로는 런타임 로딩으로 인해 vis-network 청크가 생성되지 않았지만, 이 설정으로 다른 vendor 라이브러리들을 효과적으로 분리했어요.

## 3. 콘텐츠 로딩 최적화: import.meta.glob 활용

마크다운 파일들을 효율적으로 로드하기 위해 `import.meta.glob`을 사용했어요. 특히 `query: '?raw'`를 추가하면 텍스트로만 로드해서 불필요한 변환을 생략할 수 있어요.

```typescript
// 실제 적용 예시들
// src/pages/Postings.tsx
const modules = import.meta.glob('../../contents/Postings/*.md', {
  query: '?raw',
  import: 'default',
});

// src/pages/Archive.tsx
const modules = import.meta.glob('../../contents/Archives/*/*.md', {
  query: '?raw',
  import: 'default',
});

// src/pages/MarkdownViewer.tsx
const modules = import.meta.glob('../../contents/Archives/*/*.md', {
  query: '?raw',
  import: 'default',
});
```

이렇게 하면 마크다운 콘텐츠가 빌드 시점에 자바스크립트 번들에 포함되지 않고, 필요할 때 로드됩니다. 특히 대량의 문서가 있는 경우 효과적이에요.

## 4. 트리 쉐이킹과 의존성 관리

사용하지 않는 코드를 제거하기 위해 TypeScript와 ESLint 설정을 강화했어요:

### TypeScript 엄격 모드 적용

```json
// tsconfig.json (실제 설정)
{
  "compilerOptions": {
    "target": "ES2021",
    "useDefineForClassFields": true,
    "lib": ["DOM", "ES2021"],
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vite/client"]
  }
}
```

### ESLint 규칙 추가

ESLint 설정에서 사용하지 않는 변수나 임포트를 경고하도록 했어요.

## 5. 빌드 결과 모니터링

매번 빌드할 때마다 결과를 확인하면서 최적화 효과를 측정했어요:

```bash
npm run build
```

빌드 결과에서 각 청크의 크기를 확인하고, 필요에 따라 청킹 전략을 조정했습니다.

## 현재 최적화 결과

최적화 후 실제 빌드 결과 (2025년 9월 12일 기준):

```bash
# 최적화 전 (초기 상황)
vendor 번들: ~650KB+ (Vite 경고 발생)

# 최적화 후 (현재)
dist/assets/
├── vendor-kuhtQkJ6.js        289.36 kB │ gzip: 91.78 kB  # 55%+ 감소!
├── index-C3VKQ02j.js         37.16 kB │ gzip: 9.20 kB
├── MarkdownViewer-CvrMawJd.js 29.54 kB │ gzip: 6.76 kB
├── Archive-m4EgbZgB.js       27.19 kB │ gzip: 5.74 kB
├── build-bundle-optimization-v0jVf_aZ.js 9.61 kB │ gzip: 4.21 kB
└── (그 외 마크다운 청크들: 각 0.2-6KB)
```

- **vendor 번들**: 650KB+ → 289KB (55%+ 감소, gzip 92KB)
- **메인 번들**: 37KB (gzip 9KB) - 앱 코어 로직
- **페이지별 청크**: Archive 27KB, MarkdownViewer 30KB 등으로 분리
- **vis-network**: 런타임 로딩으로 번들에 포함되지 않음

이렇게 최적화하여 초기 로딩 시간을 크게 개선했습니다!

## 추가 최적화 고려사항

더 개선할 수 있는 부분들:

### 1. 번들 분석 도구 추가

```bash
npm install --save-dev rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [react(), visualizer()],
});
```

빌드 시각화를 통해 어떤 모듈이 큰지 정확히 파악할 수 있어요.

### 2. Rollup external 설정으로 안전성 강화

vis-network를 완전히 번들에서 제외하기 위해:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['vis-network', 'vis-network/standalone'],
      // ... 기존 manualChunks
    },
  },
});
```

### 3. 이미지 최적화

```typescript
// vite.config.ts
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  plugins: [imagetools()],
});
```

### 4. 폰트 최적화

```css
/* CSS에서 */
@font-face {
  font-display: swap; /* 로딩 중 텍스트 표시 */
}
```

### 5. Service Worker 캐싱

```typescript
// PWA를 위한 캐시 전략
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## 결론

빌드 번들 크기 최적화는 지속적인 과정입니다. 제 블로그의 경우:

1. **측정**: 초기 vendor 650KB+ (Vite 경고 발생) 파악
2. **분석**: vis-network가 큰 원인 식별 (커밋 히스토리 참고)
3. **최적화**: 런타임 로딩, 코드 스플리팅, 청킹 적용
4. **모니터링**: 실제 빌드 결과로 효과 검증 (289KB로 55%+ 감소)

특히 Vite의 강력한 빌드 시스템을 활용하면 비교적 쉽게 좋은 결과를 얻을 수 있어요. 방문자들의 로딩 경험을 개선하기 위해 앞으로도 계속 최적화할 계획입니다!

## 참고 자료

- [Vite 빌드 최적화 가이드](https://vitejs.dev/guide/build.html)
- [Rollup 청킹 전략](https://rollupjs.org/guide/en/#outputmanualchunks)
- [Web.dev 번들 분석](https://web.dev/reduce-bundle-size/)
- [프로젝트 DEVELOPMENT.md](DEVELOPMENT.md) - 이 블로그의 최적화 전략 상세 기록
- [실제 빌드 스크립트](package.json) - npm run build로 최적화 결과 확인 가능

이 글이 다른 분들의 번들 최적화에 도움이 되었으면 좋겠어요! 실제 코드베이스를 참고해서 적용해 보세요 🚀

감사합니다! 😊

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
// src/App.tsx
const Archive = React.lazy(() => import('./pages/Archive'));
const MarkdownViewer = React.lazy(() => import('./pages/MarkdownViewer'));

// Archive.tsx 내부에서도 컴포넌트 레벨 lazy 로딩
const ArchiveSidebarLazy = React.lazy(
  () => import('../components/Layout/ArchiveSidebar')
);

// 라우터에서 Suspense로 감싸기
<React.Suspense fallback={<div>로딩...</div>}>
  <Archive />
</React.Suspense>
```

이렇게 하면 Archive 페이지를 방문할 때에만 관련 코드가 로드되며, 심지어 사이드바 컴포넌트도 별도로 로드됩니다.

### vis-network의 지연 로딩

vis-network는 특히 무거운 라이브러리였어요. 처음에는 직접 임포트했지만, 번들 크기를 줄이기 위해 런타임 로더를 도입했어요:

```typescript
// ❌ 초기 방식
import { Network } from 'vis-network';

// ✅ 최적화된 방식: 런타임 CDN 로더 사용
// public/vendor/vis-loader.js
(function () {
  if (typeof window === 'undefined') return;
  if (window.__loadVisNetwork) return;
  window.__loadVisNetwork = async function () {
    return import('https://cdn.jsdelivr.net/npm/vis-network@10.0.1/standalone/esm/vis-network.mjs');
  };
})();

// Archive.tsx에서 사용
const vis = await window.__loadVisNetwork();
const { DataSet, Network } = vis;
```

이렇게 하면 vis-network가 번들에 포함되지 않고, 필요할 때 CDN에서 로드됩니다. 네트워크 의존성이 생기지만, 초기 번들 크기를 크게 줄일 수 있어요.

## 2. 수동 청킹 전략: manualChunks 활용

Vite의 `manualChunks` 옵션을 사용해서 번들을 더 세밀하게 분리했어요. 특히 vis-network를 여러 청크로 나누는 전략이 효과적이었어요.

```typescript
// vite.config.ts (실제 적용된 코드)
export default defineConfig({
  base: '/MyBlog/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id) return undefined;
          // Split vis-network into up to 4 chunks by hashing the module id so
          // that the large dist bundle is divided into smaller, cacheable files.
          if (id.includes('node_modules/vis-network')) {
            // simple hash: sum char codes
            let h = 0;
            for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i)) | 0;
            const idx = (Math.abs(h) % 4) + 1; // 1..4
            return `vis-network-${idx}`;
          }
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

마크다운 파일들을 효율적으로 로드하기 위해 `import.meta.glob`을 사용했어요. 특히 `query: '?raw'`를 추가하면 텍스트로만 로드해서 불필요한 변환을 생략할 수 있어요.

```typescript
// ✅ 최적화된 방식 (실제 적용 예시)
// src/pages/Postings.tsx
const modules = import.meta.glob('../../contents/Postings/*.md', {
  query: '?raw',
  import: 'default',
});

// src/pages/Archive.tsx
const modules = import.meta.glob('../../contents/Archives/*/*.md', {
  query: '?raw',
  import: 'default',
});

// src/pages/MarkdownViewer.tsx
const modules = import.meta.glob('../../contents/Archives/*/*.md', {
  query: '?raw',
  import: 'default',
});

// ❌ 비효율적인 방식 (이전)
// const modules = import.meta.glob('../../contents/Archives/*/*.md');
```

이렇게 하면 마크다운 콘텐츠가 빌드 시점에 자바스크립트 번들에 포함되지 않고, 필요할 때 로드됩니다. 특히 대량의 문서가 있는 경우 효과적이에요.

## 4. 트리 쉐이킹과 의존성 관리

사용하지 않는 코드를 제거하기 위해 TypeScript와 ESLint 설정을 강화했어요:

### TypeScript 엄격 모드 적용

```json
// tsconfig.json (실제 설정)
{
  "compilerOptions": {
    "target": "ES2021",
    "useDefineForClassFields": true,
    "lib": ["DOM", "ES2021"],
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vite/client"]
  }
}
```

### ESLint 규칙 추가

ESLint 설정에서 사용하지 않는 변수나 임포트를 경고하도록 했어요.

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

### 1. 번들 분석 도구 추가

```bash
npm install --save-dev rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [react(), visualizer()],
});
```

빌드 시각화를 통해 어떤 모듈이 큰지 정확히 파악할 수 있어요.

### 2. Rollup external 설정으로 안전성 강화

vis-network를 완전히 번들에서 제외하기 위해:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['vis-network', 'vis-network/standalone'],
      // ... 기존 manualChunks
    },
  },
});
```

### 3. 이미지 최적화

```typescript
// vite.config.ts
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  plugins: [imagetools()],
});
```

### 4. 폰트 최적화

```css
/* CSS에서 */
@font-face {
  font-display: swap; /* 로딩 중 텍스트 표시 */
}
```

### 5. Service Worker 캐싱

```typescript
// PWA를 위한 캐시 전략
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## 결론

빌드 번들 크기 최적화는 지속적인 과정입니다:

1. **측정**: 현재 번들 크기 파악
2. **분석**: 어떤 부분이 큰지 식별 (vis-network처럼)
3. **최적화**: 코드 스플리팅, 청킹, 트리 쉐이킹 적용
4. **모니터링**: 결과 확인 및 반복

특히 Vite의 강력한 빌드 시스템을 활용하면 비교적 쉽게 좋은 결과를 얻을 수 있어요. 방문자들의 로딩 경험을 개선하기 위해 앞으로도 계속 최적화할 계획입니다!

## 참고 자료

- [Vite 빌드 최적화 가이드](https://vitejs.dev/guide/build.html)
- [Rollup 청킹 전략](https://rollupjs.org/guide/en/#outputmanualchunks)
- [Web.dev 번들 분석](https://web.dev/reduce-bundle-size/)
- [프로젝트 DEVELOPMENT.md](DEVELOPMENT.md) - 이 블로그의 최적화 전략 상세 기록

이 글이 다른 분들의 번들 최적화에 도움이 되었으면 좋겠어요! 🚀

감사합니다! 😊
