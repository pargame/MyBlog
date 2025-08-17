#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(REPO_ROOT, 'public');
const META_FILE = path.join(OUT_DIR, 'meta.json');
const SITE_FILE = path.join(OUT_DIR, 'site.json');

function run(cmd){
  try { return String(execSync(cmd, { cwd: REPO_ROOT })).trim(); }
  catch { return ''; }
}

function main(){
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  // version from package.json
  const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));
  const version = pkg.version || '0.0.0';
  // current commit
  const commit = run('git rev-parse HEAD');
  fs.writeFileSync(META_FILE, JSON.stringify({ version, commit }, null, 2));
  // site.json example — user can edit later; create if missing
  if (!fs.existsSync(SITE_FILE)) {
    // default site.json — set to repo owner's email to avoid placeholder showing up on new builds
    fs.writeFileSync(SITE_FILE, JSON.stringify({ emailUser: "001201parg", emailDomain: "gmail.com" }, null, 2));
  }
  // meta written
}

if (require.main === module) main();
