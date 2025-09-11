// Lightweight loader that imports vis-network from CDN at runtime.
// Kept as a plain JS file in `public/` so Vite does not bundle it.
// Exposes `window.__loadVisNetwork` which returns the module namespace.
(function () {
  // avoid re-defining
  if (typeof window === 'undefined') return;
  if ((window).__loadVisNetwork) return;
  (window).__loadVisNetwork = async function () {
    // Import from CDN as an ES module. This will be fetched at runtime.
    return import('https://cdn.jsdelivr.net/npm/vis-network@10.0.1/standalone/esm/vis-network.mjs');
  };
})();
