// Cléo Coelho — Corretora de Imóveis — interações leves

document.addEventListener('DOMContentLoaded', () => {

  // Menu mobile
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // CTAs de WhatsApp em modo demonstração
  const toast = document.getElementById('demoToast');
  let toastTimer = null;

  document.querySelectorAll('[data-demo-cta]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!toast) return;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
    });
  });

  // Header com leve sombra ao rolar
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 12
      ? '0 8px 24px -18px rgba(43,38,32,0.5)'
      : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

});
