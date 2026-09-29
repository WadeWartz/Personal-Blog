// W@rtz.io — main.js
// Client-side filtering for the /posts page

document.addEventListener('DOMContentLoaded', () => {
  // ── Post filter buttons ──────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const postSections = document.querySelectorAll('.post-list-section');

  if (filterBtns.length && postSections.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.filter;

        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show/hide sections
        postSections.forEach(section => {
          if (cat === 'all') {
            section.style.display = '';
          } else {
            section.style.display = section.dataset.category === cat ? '' : 'none';
          }
        });
      });
    });
  }

  // ── Copy-to-clipboard for code blocks ───────────────────────────────
  document.querySelectorAll('.post-content pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.textContent = 'copy';
    btn.className = 'copy-btn';
    btn.style.cssText = `
      position: absolute; top: 0.4rem; right: 0.5rem;
      font-family: inherit; font-size: 0.65rem;
      background: transparent; border: 1px solid rgba(168,153,132,0.2);
      color: rgba(168,153,132,0.5); cursor: pointer; padding: 0.1rem 0.4rem;
      border-radius: 2px; text-transform: uppercase; letter-spacing: 0.05em;
      transition: all 0.15s;
    `;
    btn.addEventListener('mouseenter', () => {
      btn.style.color = '#fe8019';
      btn.style.borderColor = 'rgba(254,128,25,0.4)';
    });
    btn.addEventListener('mouseleave', () => {
      if (btn.textContent !== 'copied!') {
        btn.style.color = 'rgba(168,153,132,0.5)';
        btn.style.borderColor = 'rgba(168,153,132,0.2)';
      }
    });
    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      navigator.clipboard.writeText(code ? code.innerText : pre.innerText).then(() => {
        btn.textContent = 'copied!';
        btn.style.color = '#b8bb26';
        setTimeout(() => {
          btn.textContent = 'copy';
          btn.style.color = 'rgba(168,153,132,0.5)';
          btn.style.borderColor = 'rgba(168,153,132,0.2)';
        }, 1800);
      });
    });
    pre.style.position = 'relative';
    pre.appendChild(btn);
  });

  // ── Reading progress bar ─────────────────────────────────────────────
  if (document.querySelector('.post-content')) {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position: fixed; top: 0; left: 0; height: 2px;
      background: #fe8019; width: 0%; z-index: 999;
      transition: width 0.1s linear;
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : '0%';
    });
  }
});
