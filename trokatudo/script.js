document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const burger = document.getElementById('burger');
  const navMobile = document.getElementById('navMobile');
  if (burger && navMobile) {
    burger.addEventListener('click', () => {
      navMobile.classList.toggle('is-open');
    });
    navMobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navMobile.classList.remove('is-open'));
    });
  }

  // Tabs PF / PJ
  const tabBtns = document.querySelectorAll('.tabs__btn');
  const panels = document.querySelectorAll('.tabs__panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === target));
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq__item').forEach(item => {
    const q = item.querySelector('.faq__q');
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  // Demo form (no backend — preview only)
  const form = document.getElementById('demoForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      note.textContent = 'Obrigado! Este é um preview de apresentação — em breve o envio será conectado ao atendimento da Trokatudo.';
      form.reset();
    });
  }
});
