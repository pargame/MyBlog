#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET = path.join(ROOT, 'docs', 'Unreal');

function listMd(dir) {
  const res = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const s = fs.statSync(p);
    if (s.isDirectory()) res.push(...listMd(p));
    else if (name.toLowerCase().endsWith('.md')) res.push(p);
  }
  return res;
}

function nextNonEmpty(lines, idx) {
  let j = idx + 1;
  while (j < lines.length && /^\s*$/.test(lines[j])) j++;
  return { idx: j, line: lines[j] ?? null };
}

function fixFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const lines = src.split(/\r?\n/);
  let changed = false;
  const out = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Convert inline label+desc: * **Label:** description  ->
    // * **Label:**\n\tdescription
    const inlineMatch = line.match(/^(\s*)\*\s+\*\*([^*]+?)\*\*:\s+(\S.*)$/);
    const inlineMatchAlt = line.match(/^(\s*)\*\s+\*\*([^*]+?:)\*\*\s+(\S.*)$/);
    if (inlineMatch || inlineMatchAlt) {
      const m = inlineMatch || inlineMatchAlt;
      const leading = m[1] || '';
      const label = m[2].replace(/:\s*$/, '');
      const desc = m[3];
      out.push(`${leading}* **${label}:**`);
      out.push(`${leading}\t${desc}`);
      changed = true;
      continue;
    }

      // Label-only line: ensure following paragraph lines are tab-indented
      const labelOnly = line.match(/^(\s*)\*\s+\*\*([^*]+?)\*\*:\s*$/) || line.match(/^(\s*)\*\s+\*\*([^*]+?:)\*\*\s*$/);
      if (labelOnly) {
        const leading = labelOnly[1] || '';
        out.push(line);
        const { idx: nxtIdx, line: nxt } = nextNonEmpty(lines, i);
        if (nxt === null) { i = lines.length; continue; }

        // If next meaningful line is already a nested bullet, blockquote, code fence, or tab-indented, accept it.
        const nxtTrim = nxt.replace(/^\s+/, '');
        if (nxt.startsWith(leading + '\t') || nxtTrim.startsWith('*') || nxtTrim.startsWith('>') || /^\s*```/.test(nxt)) {
          continue;
        }

        // Otherwise, prefix the next non-empty line and any following paragraph lines until a blank line or a line
        // that starts with a list item, blockquote, code fence, or heading, with the leading+tab.
        let k = nxtIdx;
        while (k < lines.length) {
          const cur = lines[k];
          if (/^\s*$/.test(cur)) { out.push(cur); k++; continue; }
          const curTrim = cur.replace(/^\s+/, '');
          if (curTrim.startsWith('*') || curTrim.startsWith('>') || /^\s*```/.test(cur) || /^\s*#+\s*/.test(cur)) break;
          out.push(leading + '\t' + cur.replace(/^\s+/, ''));
          k++;
          changed = true;
        }
        // set i to the last processed line
        i = k - 1;
        continue;
    }

    out.push(line);
  }

  if (changed) {
    fs.writeFileSync(filePath, out.join('\n'), 'utf8');
  }
  return changed;
}

function main() {
  if (!fs.existsSync(TARGET)) {
    console.error('Target dir not found:', TARGET);
    process.exit(1);
  }
  const files = listMd(TARGET).sort();
  let edited = 0;
  for (const f of files) {
    try {
      const ok = fixFile(f);
      if (ok) edited++;
    } catch (e) {
      console.error('Failed', f, e);
    }
  }

  console.log('fix-unreal-descriptions-indent: processed', files.length, 'files, edited', edited + '.');
}

main();
