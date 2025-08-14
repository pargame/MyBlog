#!/usr/bin/env node
/**
 * Fix markdown bullets where bold markers were split across lines, e.g.
 *   * **Title (Desc):
 *   ** Body...
 * becomes
 *   * **Title (Desc):** Body...
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const unrealDir = path.join(root, 'docs', 'Unreal');

/** Walk a directory recursively and return .md file paths */
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.isFile() && p.endsWith('.md')) out.push(p);
  }
  return out;
}

function fixContent(text) {
  // Pattern: bullet starting with * ** ... : then newline and ** starting next line
  // Use global, multiline; conservative to bullets only
  const pattern = /(\n|^)\s*\*\s+\*\*([^\n]*?):\s*\n\*\*\s*/g;
  return text.replace(pattern, (m, leading, title) => {
    return `${leading}* **${title}:** `;
  });
}

function main() {
  const files = walk(unrealDir);
  let changed = 0;
  for (const file of files) {
    const before = fs.readFileSync(file, 'utf8');
    const after = fixContent(before);
    if (after !== before) {
      fs.writeFileSync(file, after, 'utf8');
      changed++;
      process.stdout.write(`fixed: ${path.relative(root, file)}\n`);
    }
  }
  process.stdout.write(`done. files changed: ${changed}\n`);
}

main();
