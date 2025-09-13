// Simple script to download Pyodide release assets into public/pyodide
// Usage: node scripts/fetch-pyodide.js <version>
// Example: node scripts/fetch-pyodide.js 0.24.1

const https = require('https');
const fs = require('fs');
const path = require('path');

const version = process.argv[2] || '0.28.2';
const base = `https://cdn.jsdelivr.net/pyodide/v${version}/full/`;
const files = [
  'pyodide.js',
  'pyodide.mjs',
  'pyodide.asm.wasm',
  'pyodide.asm.js',
  'python_stdlib.zip',
];
// Note: filenames may vary by pyodide version; this is a simple approach.

const outDir = path.resolve(__dirname, '..', 'public', 'pyodide', `v${version}`);
fs.mkdirSync(outDir, { recursive: true });

function download(name) {
  return new Promise((resolve, reject) => {
    const url = base + name;
    const dest = path.join(outDir, name);
    console.log('Downloading', url);
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) return reject(new Error(`Failed ${res.statusCode}`));
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(dest));
        });
      })
      .on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
  });
}

(async () => {
  try {
    for (const f of files) {
      try {
        await download(f);
      } catch (e) {
        console.warn('Failed to download', f, e.message);
      }
    }
    console.log('Done. Files saved to', outDir);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
