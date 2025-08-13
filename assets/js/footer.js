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

    const metaBox = document.getElementById('footer-meta');
    if (!metaBox) return;
    const parts = [];

    // email
    const site = await loadJSON('./public/site.json');
    if (site && site.emailUser && site.emailDomain) {
      const user = site.emailUser;
      const domain = site.emailDomain;
  const span = document.createElement('span');
  span.textContent = 'Email';
      span.style.cursor = 'pointer';
  span.title = 'Send email';
      span.addEventListener('click', () => {
        const mail = `${user}@${domain}`;
        location.href = `mailto:${mail}`;
      });
      parts.push(span);
    }

    // version / commit
    const meta = await loadJSON('./public/meta.json');
    if (meta && meta.version) {
      const v = document.createElement('span');
      v.textContent = `v${meta.version}`;
      parts.push(v);
    }
    if (meta && meta.commit) {
      const shortSha = String(meta.commit).slice(0, 7);
      let c;
      if (repo) {
        c = document.createElement('a');
        c.href = `https://github.com/${repo}/commit/${meta.commit}`;
        c.target = '_blank';
        c.rel = 'noopener noreferrer';
      } else {
        c = document.createElement('span');
      }
      c.textContent = `#${shortSha}`;
      parts.push(c);
    }

    // join with separators only between existing parts
    metaBox.innerHTML = '';
    parts.forEach((el, i) => {
      if (i > 0) metaBox.appendChild(document.createTextNode(' · '));
      metaBox.appendChild(el);
    });
  }

  window.populateFooter = populateFooter;
})();
