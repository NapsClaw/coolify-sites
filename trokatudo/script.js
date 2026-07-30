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

  // FAQ accordion — accessible: aria-expanded is the single source of truth
  document.querySelectorAll('.faq__item').forEach(item => {
    const q = item.querySelector('.faq__q');
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq__item').forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Demo form (no backend — this is a presentation preview only)
  const form = document.getElementById('demoForm');
  const note = document.getElementById('formNote');
  const submitBtn = document.getElementById('formSubmitBtn');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      note.textContent = '✓ Recebemos sua solicitação de demonstração (preview). Este formulário ainda não envia dados para uma central de atendimento real.';
      note.classList.add('is-visible');

      if (submitBtn) {
        const originalLabel = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Solicitação registrada ✓';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }, 2600);
      }

      form.reset();

      setTimeout(() => note.classList.remove('is-visible'), 6000);
    });
  }
});
