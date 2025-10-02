// Shared utility for parsing YAML frontmatter from markdown files
export function parseFrontmatter(raw: string) {
  const fmMatch = raw.match(/^[\uFEFF\s]*---\s*([\s\S]*?)\s*---\s*/);
  const data: Record<string, string> = {};
  if (!fmMatch) return { data, content: raw };
  const fm = fmMatch[1];
  fm.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(?:(?:"([^"]*)")|(?:'([^']*)')|(.+))?$/);
    if (!m) return;
    const key = m[1];
    const val = m[2] ?? m[3] ?? m[4] ?? '';
    data[key] = val.trim();
  });
  const content = raw.slice(fmMatch[0].length).trim();
  return { data, content };
}

export function formatDate(iso?: string) {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${hh}:${mm}`;
}
