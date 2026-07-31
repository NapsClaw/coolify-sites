document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const header = document.querySelector('.site-header');

  if (toggle && header) {
    toggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // close menu after clicking a link
    header.querySelectorAll('.main-nav a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Contact form (frontend-only demo — no backend configured yet)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = form.nome.value.trim();
      const empresa = form.empresa.value.trim();
      const email = form.email.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!nome || !empresa || !emailOk) {
        status.textContent = 'Confira nome, empresa e e-mail antes de enviar.';
        status.classList.add('error');
        return;
      }

      status.classList.remove('error');
      status.textContent = 'Recebemos sua solicitação. Em breve entraremos em contato pelo canal indicado.';
      form.reset();
    });
  }
});
