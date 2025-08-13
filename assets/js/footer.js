(() => {
  async function loadJSON(url) {
    try {
      const r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) return null;
      return await r.json();
    } catch {
      return null;
    }
  }

  async function populateFooter(opts) {
    const repo = (opts && opts.repo) || '';
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const meta = await loadJSON('./public/meta.json');
    if (meta) {
      const verEl = document.getElementById('footer-version');
      const comEl = document.getElementById('footer-commit');
      if (verEl && meta.version) verEl.textContent = `v${meta.version}`;
      if (comEl && meta.commit) {
        const shortSha = String(meta.commit).slice(0, 7);
        comEl.textContent = `#${shortSha}`;
        if (repo) {
          const a = document.createElement('a');
          a.href = `https://github.com/${repo}/commit/${meta.commit}`;
          a.textContent = `#${shortSha}`;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          comEl.replaceWith(a);
          a.id = 'footer-commit';
        }
      }
    }

    const site = await loadJSON('./public/site.json');
    const emailEl = document.getElementById('footer-email');
    if (emailEl && site && site.emailUser && site.emailDomain) {
      // Obfuscation: show as user at domain, construct mailto on click
      const user = site.emailUser;
      const domain = site.emailDomain;
      emailEl.textContent = `${user} at ${domain.replace(/\./g, ' dot ')}`;
      emailEl.style.cursor = 'pointer';
      emailEl.title = '메일 보내기';
      emailEl.addEventListener('click', () => {
        const mail = `${user}@${domain}`;
        location.href = `mailto:${mail}`;
      });
    }
  }

  window.populateFooter = populateFooter;
})();
