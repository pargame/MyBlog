#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '../docs/Unreal');

function walk(dir){
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d=>{
    const p = path.join(dir, d.name);
    if(d.isDirectory()) return walk(p);
    if(d.isFile() && p.endsWith('.md')) return [p];
    return [];
  });
}

const files = walk(DIR);
let edited = 0;
for(const file of files){
  let text = fs.readFileSync(file,'utf8');
  // Handle two common variants:
  // 1) * **Label:** description   (colon inside bold)
  // 2) * **Label**: description   (colon after bold)
  // Also support '-' bullets. Skip if description already tabbed or empty.

  // Capture inner bold text to handle cases like '**Label:**' where the colon is
  // inside the bold markers. Groups:
  // 1: bullet prefix, 2: inner bold text, 3: optional colon immediately after bold, 4: description
  const reBoth = /(^\s*(?:[-\*]|\d+\.)\s+)\*\*([\s\S]*?)\*\*(:?)(?:\s+)([^\n\r]+)/gm;

  let newText = text.replace(reBoth, (m, bullet, innerBold, maybeColon, desc)=>{
    // If description already starts with a tab or is empty, leave unchanged
    if(!desc || /^\t/.test(desc) || desc.trim()==='') return m;

    // Remove any trailing colons that may be inside the bold text, then ensure
    // exactly one colon after the bold markers.
    const innerClean = innerBold.replace(/:+$/,'');
    const boldWithColon = `**${innerClean}**:`;

    return `${bullet}${boldWithColon}\n\t${desc}`;
  });

  // Generic same-line label:description cases where the label isn't bold or
  // uses other inline formatting (code, links, parentheses, etc.). This
  // matches a bullet prefix, then any short label (non-newline) followed by
  // a colon and a space and an inline description. We avoid matching if the
  // description already starts with a tab or is empty.
  const reGeneric = /(^\s*(?:[-\*]|\d+\.)\s+)([^\n\r]+?):\s+([^\n\r]+)/gm;

  newText = newText.replace(reGeneric, (m, bullet, label, desc)=>{
    // skip if description already tabbed or label looks like a heading (avoid false positives)
    if(!desc || /^\t/.test(desc) || desc.trim() === '') return m;
    // if label already contains bold closing (we handled bold above) or already ends with ':' keep it cleaned
    const labelClean = label.replace(/[ \t]+$/,'').replace(/:+$/,'');
    return `${bullet}${labelClean}:\n\t${desc}`;
  });

  // Normalize two-line bullets where the label is on one line and the description
  // is on the next line but starts with spaces instead of a tab. Convert leading
  // run of spaces to a single tab. Also normalize duplicate trailing colons on the label line.
  const reTwoLine = /(^\s*(?:[-\*]|\d+\.)\s+)\*\*([\s\S]*?)\*\*:?[ \t]*\r?\n(\p{Zs}+)([^\n\r]+)/gmu;

  newText = newText.replace(reTwoLine, (m, bullet, innerBold, sp, desc)=>{
    // collapse multiple trailing colons inside the bold inner text and ensure single colon
    const labelClean = `**${innerBold.replace(/:+$/,'')}**:`;
    // if desc already starts with a tab, leave
    if(/^\t/.test(desc)) return m;
    return `${bullet}${labelClean}\n\t${desc}`;
  });

  // Catch lines where the description line starts with other whitespace such as
  // non-breaking space (U+00A0) or multiple ordinary spaces not matched above.
  const reSpacesNextLine = /(^\s*(?:[-\*]|\d+\.)\s+)\*\*([\s\S]*?)\*\*:?[ \t]*\r?\n(\p{Zs}+)([^\n\r]+)/gmu;
  newText = newText.replace(reSpacesNextLine, (m, bullet, innerBold, sp, desc)=>{
    const labelClean = `**${innerBold.replace(/:+$/,'')}**:`;
    // ensure desc doesn't already start with a tab
    if(/^\t/.test(desc)) return m;
    return `${bullet}${labelClean}\n\t${desc}`;
  });

  let fileEdited = false;
  if(newText !== text){
    fs.writeFileSync(file, newText, 'utf8');
    fileEdited = true;
    console.log('Edited:', path.relative(process.cwd(), file));
  }

  // Final line-by-line pass: when a bullet label line is followed by a line that
  // is indented with spaces (not a tab), convert that leading whitespace to a tab
  // and normalize trailing colons on the label line.
  const lines = newText.split(/\r?\n/);
  let changed = false;
  for(let i=0;i<lines.length-1;i++){
  const labelMatch = lines[i].match(/^\s*(?:[-\*]|\d+\.)\s+\*\*([\s\S]+?)\*\*:?[ \t]*$/);
    if(labelMatch){
      const next = lines[i+1];
      // if next starts with spaces (one or more) but not a tab, fix it
      if(/^[\p{Zs}]+/u.test(next) && !/^\t/.test(next)){
        const labelClean = labelMatch[1].replace(/:+$/,'');
        lines[i] = lines[i].replace(labelMatch[1], labelClean);
        // ensure there's exactly one colon after the closing bold
        if(!/\*\*:\s*$/.test(lines[i])) lines[i] = lines[i].replace(/\*\*\s*$/, '**:');
        lines[i+1] = '\t' + next.replace(/^[\p{Zs}]+/u,'');
        changed = true;
      }
    }
  }
  if(changed){
    const finalText = lines.join('\n');
    fs.writeFileSync(file, finalText, 'utf8');
    if(!fileEdited) fileEdited = true;
    console.log('Line-fixed:', path.relative(process.cwd(), file));
  }
  if(fileEdited) edited++;
}
console.log(`Processed ${files.length} files, edited ${edited} files.`);
process.exit(0);

