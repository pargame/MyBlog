declare module 'vis-network/standalone' {
  // Minimal strongly-typed surface used in this project
  export class DataSet<T = unknown> {
    constructor(items?: T[]);
    add(items: T[] | T): void;
    get(id?: string | number): T | undefined;
    update(item: Partial<T> & { id?: string | number }): void;
    remove(id: string | number): void;
    map<U>(fn: (item: T) => U): U[];
  }

  export interface SelectionResult {
    nodes?: Array<string | number>;
    edges?: Array<string | number>;
  }

  export class Network {
    constructor(
      container: HTMLElement,
      data: { nodes: DataSet<any>; edges: DataSet<any> },
      options?: Record<string, unknown>
    );
    on(event: string, handler: (params?: Record<string, unknown>) => void): void;
    once?(event: string, handler: (params?: Record<string, unknown>) => void): void;
    off(event: string, handler?: (params?: Record<string, unknown>) => void): void;
    destroy(): void;
    getSelection(): SelectionResult;
    setSelection(sel: { nodes?: string[]; edges?: string[] } | null): void;
    getConnectedEdges(nodeId: string | number): string[];
    getConnectedNodes(nodeId: string | number): string[];
    getScale?(): number;
    moveTo?(opts: {
      scale?: number;
      position?: { x: number; y: number };
      animation?: { duration: number };
    }): void;
    unselectAll?(): void;
  }

  export { DataSet, Network };
}

declare global {
  interface Window {
    __loadVisNetwork?: () => Promise<typeof import('vis-network/standalone')>;
    // set briefly by the Archive page when a vis-network node is clicked so
    // document-level listeners (like ArchiveSidebar) can ignore that click.
    __archiveNodeClick?: boolean;
  }
}

export {};
