// Runtime loader for vis-network via CDN.
// This avoids bundling vis-network into the app while keeping a typed
// surface compatible with `src/types/vis-network.d.ts`.
import type { DataSet as VisDataSet, Network as VisNetwork } from 'vis-network/standalone';

type VisModule = { DataSet: typeof VisDataSet; Network: typeof VisNetwork };

export async function loadVisNetwork(): Promise<typeof import('vis-network/standalone')> {
  if (typeof window === 'undefined') {
    throw new Error('loadVisNetwork can only be used in the browser');
  }
  const w = window as Window & {
    vis?: VisModule;
    __visModule?: VisModule;
    __loadVisNetwork?: () => Promise<typeof import('vis-network/standalone')>;
  };
  if (w.__visModule) return w.__visModule as typeof import('vis-network/standalone');

  // If a global `vis` is already present (maybe loaded by other script), use it
  if (w.vis && w.vis.DataSet && w.vis.Network) {
    const mod: VisModule = { DataSet: w.vis.DataSet, Network: w.vis.Network };
    w.__visModule = mod;
    return mod as unknown as typeof import('vis-network/standalone');
  }

  // Create script tag to load the UMD standalone bundle from jsDelivr.
  // Pin to the version used by the project to keep reproducible behavior.
  const CDN = 'https://cdn.jsdelivr.net/npm/vis-network@10.0.1/standalone/umd/vis-network.min.js';

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CDN}"]`) as HTMLScriptElement | null;
    if (existing) {
      // If the script already exists but module not yet available, wait for it.
      existing.addEventListener('load', () => {
        if (w.vis && w.vis.DataSet && w.vis.Network) {
          const mod: VisModule = { DataSet: w.vis.DataSet, Network: w.vis.Network };
          w.__visModule = mod;
          resolve(mod as unknown as typeof import('vis-network/standalone'));
        } else {
          reject(new Error('vis-network loaded but global not found'));
        }
      });
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load vis-network (existing script)'))
      );
      return;
    }

    const script = document.createElement('script');
    script.src = CDN;
    script.async = true;
    script.onload = () => {
      if (w.vis && w.vis.DataSet && w.vis.Network) {
        const mod: VisModule = { DataSet: w.vis.DataSet, Network: w.vis.Network };
        w.__visModule = mod;
        resolve(mod as unknown as typeof import('vis-network/standalone'));
      } else {
        reject(new Error('vis-network loaded but global not found'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load vis-network from CDN'));
    document.head.appendChild(script);
  });
}

// provide a convenient global loader hook used elsewhere in the codebase
if (typeof window !== 'undefined') {
  const win = window as Window & {
    __loadVisNetwork?: () => Promise<typeof import('vis-network/standalone')>;
  };
  if (!win.__loadVisNetwork) win.__loadVisNetwork = loadVisNetwork;
}
