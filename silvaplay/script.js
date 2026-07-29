document.getElementById('year').textContent = new Date().getFullYear();

/* sticky nav shrink */
const navWrap = document.getElementById('navWrap');
const onScroll = () => {
  if (window.scrollY > 12) navWrap.classList.add('scrolled');
  else navWrap.classList.remove('scrolled');
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* mobile nav toggle */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* FAQ accordion */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  const answer = item.querySelector('.faq-a');
  btn.addEventListener('click', () => {
    const isOpen = item.getAttribute('data-open') === 'true';
    document.querySelectorAll('.faq-item').forEach(other => {
      other.setAttribute('data-open', 'false');
      other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      other.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!isOpen) {
      item.setAttribute('data-open', 'true');
      btn.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});
