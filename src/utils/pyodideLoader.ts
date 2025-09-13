// Lightweight pyodide loader util for local (public/) hosted pyodide assets.
// This does not instantiate a Worker; it provides helpers to produce the
// indexURL for loadPyodide and to generate the script path for importScripts.

export function getPyodideBase(version = '0.24.1') {
  // public/pyodide/v{version}/ is where scripts/fetch-pyodide.js places assets.
  const base = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '/')}public/pyodide/v${version}/`;
  return base;
}

export function getPyodideScriptUrl(version = '0.24.1') {
  // Return the full URL to pyodide.js in the public folder.
  return `${getPyodideBase(version)}pyodide.js`;
}

// Helper for Workers: build the importScripts call string (consumer will call importScripts(url))
export function getWorkerImportScript(version = '0.24.1') {
  return getPyodideScriptUrl(version);
}
