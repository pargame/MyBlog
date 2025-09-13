declare module 'worker:./pyodide.worker' {
  const value: any;
  export default value;
}

declare const importScripts: (...urls: string[]) => void;
