(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('motion-ready');

  const start = new Date('2020-03-04T00:00:00-08:00');
  const days = Math.floor((Date.now() - start.getTime()) / 86400000);
  document.querySelectorAll('[data-days]').forEach((el) => {
    el.dataset.target = String(days);
    el.textContent = `${days.toLocaleString()} days in business since March 4, 2020.`;
  });

  const menu = document.getElementById('agency-menu');
  const openButton = document.querySelector('.agency-menu-trigger');
  const closeButton = document.querySelector('.agency-menu__close');
  let returnFocus = null;
  const setMenu = (value) => {
    if (!menu || !openButton || !closeButton) return;
    returnFocus = value ? document.activeElement : returnFocus;
    menu.classList.toggle('is-open', value);
    menu.setAttribute('aria-hidden', String(!value));
    openButton.setAttribute('aria-expanded', String(value));
    document.body.classList.toggle('menu-open', value);
    if (value) closeButton.focus();
    else if (returnFocus instanceof HTMLElement) returnFocus.focus();
  };
  openButton?.addEventListener('click', () => setMenu(true));
  closeButton?.addEventListener('click', () => setMenu(false));
  menu?.addEventListener('click', (event) => { if (event.target === menu) setMenu(false); });
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menu?.classList.contains('is-open')) setMenu(false); });

  const revealTargets = document.querySelectorAll('main section > div, .service-row, .project-frame, .insight-link, .process-gallery__item, footer > div');
  revealTargets.forEach((el, index) => {
    el.setAttribute('data-reveal', '');
    if (index % 3) el.setAttribute('data-reveal-delay', String(index % 3));
  });
  document.querySelectorAll('.section-title').forEach((heading) => {
    const text = heading.textContent?.trim();
    if (!text || heading.querySelector('.word')) return;
    heading.textContent = '';
    text.split(/\s+/).forEach((word, index, words) => {
      const outer = document.createElement('span');
      const inner = document.createElement('i');
      outer.className = 'word'; inner.textContent = word; outer.append(inner); heading.append(outer);
      if (index < words.length - 1) heading.append(' ');
    });
  });

  const animateCounter = (el) => {
    const target = Number(el.dataset.target || days);
    const duration = 1200; const begun = performance.now();
    const frame = (now) => {
      const progress = Math.min((now - begun) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = `${Math.round(target * eased).toLocaleString()} days in business since March 4, 2020.`;
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      if (entry.target.matches('[data-days]')) animateCounter(entry.target);
      obs.unobserve(entry.target);
    }), { threshold: .14, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('[data-reveal], .section-title, [data-days]').forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll('[data-reveal], .section-title').forEach((el) => el.classList.add('is-visible'));
  }

  const progress = document.querySelector('.scroll-progress i');
  const header = document.querySelector('header');
  let lastY = window.scrollY; let ticking = false;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (header) header.classList.toggle('is-hidden', scrollY > lastY && scrollY > 180 && !document.body.classList.contains('menu-open'));
    lastY = Math.max(scrollY, 0); ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; } }, { passive: true });
  updateScroll();

  document.querySelectorAll('a.rounded-full').forEach((el) => el.setAttribute('data-magnetic', ''));
  if (!reduced && matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (event) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(event.clientX-r.left-r.width/2)*.1}px, ${(event.clientY-r.top-r.height/2)*.14}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }
})();
