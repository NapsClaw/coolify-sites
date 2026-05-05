/* ═══════════════════════════════════════════
   TAPETES ALLADIN — INTERACTIONS
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Header scroll effect ── */
  const header = document.getElementById('site-header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('nav-mobile');
  hamburger.addEventListener('click', function () {
    const open = navMobile.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  /* Close mobile nav when a link is clicked */
  navMobile.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navMobile.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      /* Close all */
      document.querySelectorAll('.faq-question').forEach(function (q) {
        q.setAttribute('aria-expanded', 'false');
        q.nextElementSibling.classList.remove('open');
      });
      /* Open current if it was closed */
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });

  /* ── Scroll-reveal with IntersectionObserver ── */
  const targets = document.querySelectorAll(
    '.cat-card, .dif-item, .produto-card, .dep-card, .faq-item, .contato-info, .cta-box-inner'
  );

  /* Add init class – hides them only when JS+IO is available */
  if ('IntersectionObserver' in window) {
    targets.forEach(function (el) {
      el.classList.add('fade-up-init');
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Smooth active nav highlight ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop a[href^="#"]');

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.style.color = link.getAttribute('href') === '#' + id
            ? 'var(--gold)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ── Stagger animation on grids ── */
  if ('IntersectionObserver' in window) {
    document.querySelectorAll('.categorias-grid, .galeria-grid, .diferenciais-grid, .depoimentos-grid').forEach(function (grid) {
      const children = Array.from(grid.children);
      const gridObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            children.forEach(function (child, i) {
              setTimeout(function () {
                child.classList.add('fade-up');
              }, i * 90);
            });
            gridObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      gridObs.observe(grid);
    });
  }

})();
