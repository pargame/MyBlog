#!/usr/bin/env python3
"""
Walk docs/Computer Architecture and docs/Unreal and ensure YAML frontmatter exists with title.
- For files under docs/Computer Architecture: add frontmatter with title derived from filename if missing or empty.
- For files under docs/Unreal: also add title (change of policy) derived from filename.
This script edits files in-place. Run from repo root.
"""
import os
import re

ROOTS = ["docs/Computer Architecture", "docs/Unreal"]

def title_from_filename(path):
    name = os.path.basename(path)
    name = re.sub(r"^\d+_?", "", name)  # remove numeric prefix e.g. 01_
    name = os.path.splitext(name)[0]
    name = name.replace('_', ' ')
    # decode percent-like sequences if any (simple)
    try:
        from urllib.parse import unquote
        name = unquote(name)
    except Exception:
        pass
    # Capitalize first char
    if name:
        return name[0].upper() + name[1:]
    return name


def ensure_frontmatter_with_title(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    # detect YAML frontmatter at file start
    if content.startswith('---\n'):
        # find closing '---' after the first
        parts = content.split('\n')
        # find second line index where '---' occurs again
        # if first two lines are '---' and '---', it's empty frontmatter
        lines = content.split('\n')
        # find the index of second '---' starting from line 1
        second = None
        for i in range(1, len(lines)):
            if lines[i].strip() == '---':
                second = i
                break
        if second == 1:
            # empty frontmatter, insert title after first '---'
            title = title_from_filename(path)
            new_fm = f"---\ntitle: \"{title}\"\n---\n"
            new_content = new_fm + '\n'.join(lines[second+1:])
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        else:
            # frontmatter exists and non-empty: ensure title key present
            fm_text = '\n'.join(lines[1:second])
            if re.search(r"^title:\s*", fm_text, re.MULTILINE):
                return False
            else:
                title = title_from_filename(path)
                # insert title as first key
                new_fm = '---\n' + f'title: "{title}"\n' + fm_text + '\n' + '---\n'
                new_content = new_fm + '\n'.join(lines[second+1:])
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                return True
    else:
        # no frontmatter: add one with title
        title = title_from_filename(path)
        new_fm = f"---\ntitle: \"{title}\"\n---\n\n"
        new_content = new_fm + content
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True


if __name__ == '__main__':
    modified = []
    for root in ROOTS:
        for dirpath, dirnames, filenames in os.walk(root):
            for fn in filenames:
                if not fn.lower().endswith('.md'):
                    continue
                path = os.path.join(dirpath, fn)
                changed = ensure_frontmatter_with_title(path)
                if changed:
                    modified.append(path)
    if modified:
        print('Modified files:')
        for m in modified:
            print(m)
    else:
        print('No changes')
