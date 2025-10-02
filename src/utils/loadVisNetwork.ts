// Lightweight runtime loader for vis-network. The Archive page imports this
// module dynamically to avoid bundling vis-network into the main chunk.
//
// Behavior:
// - If a cached module exists on window.__visModule, return it.
// - If the global `vis` is already present (e.g. loaded via public/vendor/vis-loader.js),
//   adapt it into the shape expected by the app.
// - Otherwise, inject a script tag that loads the UMD standalone build from a CDN.

// Cache promise to prevent multiple simultaneous loads
let loadPromise: Promise<{ DataSet: unknown; Network: unknown }> | null = null;

export async function loadVisNetwork() {
  if (typeof window === 'undefined') {
    throw new Error('loadVisNetwork can only be used in the browser');
  }
  type VisModuleShape = { DataSet: unknown; Network: unknown };
  interface WinWithVis {
    __visModule?: VisModuleShape;
    vis?: { DataSet?: unknown; Network?: unknown };
  }
  const win = window as unknown as WinWithVis;

  // Return cached module if available
  if (win.__visModule) return win.__visModule;

  // Return in-flight promise if already loading
  if (loadPromise) return loadPromise;

  // If a global `vis` (UMD) is already available, adapt and cache it
  if (win.vis && win.vis.DataSet && win.vis.Network) {
    const m = { DataSet: win.vis.DataSet, Network: win.vis.Network };
    win.__visModule = m;
    return m;
  }

  // Fallback: load the standalone UMD bundle from CDN
  const cdn = 'https://cdn.jsdelivr.net/npm/vis-network@10.0.1/standalone/umd/vis-network.min.js';
  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${cdn}"]`);
    if (existing) {
      existing.addEventListener('load', () => {
        if (win.vis && win.vis.DataSet && win.vis.Network) {
          const m = { DataSet: win.vis.DataSet, Network: win.vis.Network };
          win.__visModule = m;
          resolve(m);
        } else {
          reject(new Error('vis-network loaded but global `vis` not found'));
        }
      });
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load vis-network (existing script)'))
      );
      return;
    }

    const script = document.createElement('script');
    script.src = cdn;
    script.async = true;
    script.onload = () => {
      if (win.vis && win.vis.DataSet && win.vis.Network) {
        const m = { DataSet: win.vis.DataSet, Network: win.vis.Network };
        win.__visModule = m;
        resolve(m);
      } else {
        reject(new Error('vis-network loaded but global `vis` not found'));
      }
    };
    script.onerror = () => {
      loadPromise = null; // Reset on error to allow retry
      reject(new Error('Failed to load vis-network from CDN'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
