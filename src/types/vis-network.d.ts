declare module 'vis-network/standalone' {
  // Minimal types used in this project
  export class DataSet<T = any> {
    constructor(items?: T[]);
    add(items: T[] | T): void;
    get(id?: any): any;
    update(item: any): void;
    remove(id: any): void;
    map<U>(fn: (item: any) => U): U[];
  }

  export class Network {
    constructor(container: HTMLElement, data: any, options?: any);
    on(event: string, handler: (params?: any) => void): void;
    off(event: string, handler?: (params?: any) => void): void;
    destroy(): void;
    getSelection(): { nodes?: any[]; edges?: any[] };
    setSelection(sel: { nodes?: string[]; edges?: string[] } | null): void;
    getConnectedEdges(nodeId: any): string[];
    getConnectedNodes(nodeId: any): string[];
    getScale?(): number;
    moveTo?(opts: {
      scale?: number;
      position?: { x: number; y: number };
      animation?: { duration: number };
    }): void;
    unselectAll?(): void;
  }

  export = { DataSet: DataSet, Network: Network } as any;
}

declare global {
  interface Window {
    __loadVisNetwork?: () => Promise<any>;
  }
}
export {};
