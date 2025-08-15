#!/usr/bin/env node
/**
 * Normalize bullet items in docs/Unreal to the policy style:
 * "* **Label:**\n\tDescription starts ..."
 *
 * Rules:
 * - Only process markdown files under docs/Unreal
 * - Skip fenced code blocks (```)
 * - Transform inline bullets "* **Label:** description" -> new line with a leading tab
 * - Ensure that when a bullet already has the description on the next line,
 *   that next line starts with a tab (after the bullet's base indent)
 * - Keep original leading indent for the bullet; the continuation line gets baseIndent + "\t"
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, 'docs', 'Unreal');

/** Collect all .md files recursively under TARGET_DIR */
function listMarkdown(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) out.push(...listMarkdown(p));
    else if (name.toLowerCase().endsWith('.md')) out.push(p);
  }
  return out;
}

function normalizeFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const lines = src.split(/\r?\n/);
  let changed = false;
  let inFence = false; // fenced code block state

  // Utility: toggle fence when a line starts with ```
  const isFence = (line) => /^\s*```/.test(line);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isFence(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    // Match bullets like:  [indent]* **Label:** description... (colon outside bold)
    // Capture groups:
    // 1) leading spaces
    // 2) full label w/o colon
    // 3) inline description (if present)
    let m = line.match(/^(\s*)\*\s+\*\*([^*]+?)\*\*:\s+(.+\S.*)$/);
    if (m) {
      const leading = m[1] || '';
      const label = m[2].trim();
      const desc = m[3].trim();
      // Replace with multi-line: bullet label on one line, description on next line with a tab
      const newLine = `${leading}* **${label}:**`;
      const cont = `${leading}\t${desc}`;
      if (lines[i] !== newLine || lines[i + 1] !== cont) {
        lines[i] = newLine;
        // insert continuation line below i
        lines.splice(i + 1, 0, cont);
        changed = true;
      }
      continue;
    }

    // Match bullets like:  [indent]* **Label:** description... (colon inside bold)
    m = line.match(/^(\s*)\*\s+\*\*([^*]+?):\*\*\s+(.+\S.*)$/);
    if (m) {
      const leading = m[1] || '';
      const label = m[2].trim();
      const desc = m[3].trim();
      const newLine = `${leading}* **${label}:**`;
      const cont = `${leading}\t${desc}`;
      if (lines[i] !== newLine || lines[i + 1] !== cont) {
        lines[i] = newLine;
        lines.splice(i + 1, 0, cont);
        changed = true;
      }
      continue;
    }

  // Match bullets like:  [indent]* **Label:**  (no inline desc, colon outside bold)
    // Ensure the next line begins with base indent + tab (unless it's another bullet/heading/blockquote/fence/blank)
    m = line.match(/^(\s*)\*\s+\*\*([^*]+?)\*\*:\s*$/);
    if (m) {
      const leading = m[1] || '';
      const nextIdx = i + 1;
      // Find the first non-blank line after the label, allowing for stray blank lines
      let j = nextIdx;
      while (j < lines.length && /^\s*$/.test(lines[j])) j++;
      const peek = lines[j] ?? '';
      // If the next meaningful line starts a new block (bullet/heading/blockquote/fence) or file end, skip.
      if (/^(\s*([*\-+]|\d+\.)\s)|^\s*#{1,6}\s|^\s*>\s|^\s*```|^\s*$/.test(peek)) {
        continue;
      }
      // If the next meaningful line already has proper indent at base + tab, and there were no blanks, skip.
      if (j === nextIdx && peek.startsWith(leading + '\t')) continue;
      const trimmed = peek.replace(/^\s+/, '');
      // Remove any blank lines between label and content
      if (j > nextIdx) {
        lines.splice(nextIdx, j - nextIdx);
      }
      // Now j === nextIdx; replace with normalized continuation
      lines[nextIdx] = leading + '\t' + trimmed;
      changed = true;
      continue;
    }

    // Match bullets like:  [indent]* **Label:**  (no inline desc, colon inside bold)
    m = line.match(/^(\s*)\*\s+\*\*([^*]+?):\*\*\s*$/);
    if (m) {
      const leading = m[1] || '';
      const nextIdx = i + 1;
      let j = nextIdx;
      while (j < lines.length && /^\s*$/.test(lines[j])) j++;
      const peek = lines[j] ?? '';
      if (/^(\s*([*\-+]|\d+\.)\s)|^\s*#{1,6}\s|^\s*>\s|^\s*```|^\s*$/.test(peek)) {
        continue;
      }
      if (j === nextIdx && peek.startsWith(leading + '\t')) continue;
      const trimmed = peek.replace(/^\s+/, '');
      if (j > nextIdx) {
        lines.splice(nextIdx, j - nextIdx);
      }
      lines[nextIdx] = leading + '\t' + trimmed;
      changed = true;
      continue;
    }

    // Optional: fix cases where someone wrote "* **Label**:" (colon outside bold) followed by inline text
    m = line.match(/^(\s*)\*\s+\*\*([^*]+?)\*\*:\s*(.+\S.*)$/);
    if (m) {
      const leading = m[1] || '';
      const label = m[2].trim();
      const desc = m[3].trim();
      const newLine = `${leading}* **${label}:**`;
      const cont = `${leading}\t${desc}`;
      if (lines[i] !== newLine || lines[i + 1] !== cont) {
        lines[i] = newLine;
        lines.splice(i + 1, 0, cont);
        changed = true;
      }
      continue;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  }
  return changed;
}

function main() {
  const files = listMarkdown(TARGET_DIR);
  let edited = 0;
  for (const f of files) {
    try {
      if (normalizeFile(f)) edited++;
    } catch (e) {
      console.error(`Failed to normalize: ${path.relative(ROOT, f)}\n`, e);
    }
  }
  console.log(`fix-markdown-bullets-break: processed ${files.length} files, edited ${edited}.`);
}

main();
