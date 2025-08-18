#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
// no external deps: use native recursive walk

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'docs', 'Computer Architecture');

function read(file){ return fs.readFileSync(file,'utf8'); }
function write(file, s){ fs.writeFileSync(file, s, 'utf8'); }

function walk(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile() && p.toLowerCase().endsWith('.md')) out.push(p);
  }
  return out;
}

const files = walk(DIR);
if (!files.length) {
  console.error('no files'); process.exit(0);
}

const changed = [];
for (const f of files) {
  let src = read(f);
  const orig = src;

  // 1) collapse immediate duplicate H1 lines: "# X\n# X" -> "# X"
  src = src.replace(/^#\s+(.+)\r?\n#\s+\1(\r?\n)/m, '# $1$2');
  // also handle repeated twice separated by optional blank line
  src = src.replace(/^#\s+(.+)\r?\n\r?\n#\s+\1(\r?\n)/m, '# $1$2');

  // 2) parse frontmatter
  let fmStart = -1, fmEnd = -1;
  if (src.startsWith('---')) {
    fmStart = 0;
    fmEnd = src.indexOf('\n---', 3);
  }

  // find first H1
  const h1m = src.match(/^#\s+(.+)$/m);
  const firstH1 = h1m ? h1m[1].trim() : null;
  if (firstH1) {
    // if frontmatter exists, ensure title field equals firstH1 (in Korean)
    if (fmStart === 0 && fmEnd !== -1) {
      const fmBlock = src.slice(fmStart+3, fmEnd).split('\n');
      let hasTitle = false;
      for (let i=0;i<fmBlock.length;i++){
        if (/^title\s*:/i.test(fmBlock[i])){
          hasTitle = true;
          // replace value preserving quotes style
          const q = fmBlock[i].includes('"') ? '"' : (fmBlock[i].includes("'") ? "'" : '"');
          fmBlock[i] = `title: ${q}${firstH1}${q}`;
          break;
        }
      }
      if (!hasTitle) {
        // inject title as first line in frontmatter
        fmBlock.unshift(`title: "${firstH1}"`);
      }
      const newFm = '---\n' + fmBlock.join('\n') + '\n---';
      src = newFm + src.slice(fmEnd+4);
    } else {
      // no frontmatter: insert one with title
      const newFm = `---\ntitle: "${firstH1}"\n---\n\n`;
      src = newFm + src;
    }
  }

  if (src !== orig) {
    write(f, src);
    changed.push(path.relative(ROOT, f));
  }
}

console.log('changed files:', changed.length);
changed.forEach(x=>console.log(' -', x));

process.exit(0);
