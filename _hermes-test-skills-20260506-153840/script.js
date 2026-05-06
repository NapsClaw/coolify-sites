// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── MOBILE MENU ──
const burger = document.getElementById('navBurger');
const drawer = document.getElementById('navDrawer');
let drawerOpen = false;

burger?.addEventListener('click', () => {
  drawerOpen = !drawerOpen;
  drawer.classList.toggle('open', drawerOpen);
});
drawer?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    drawerOpen = false;
    drawer.classList.remove('open');
  });
});
document.addEventListener('click', (e) => {
  if (drawerOpen && !drawer.contains(e.target) && !burger.contains(e.target)) {
    drawerOpen = false;
    drawer.classList.remove('open');
  }
});

// ── SMOOTH NAV HIGHLIGHT ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .nav-drawer a[href^="#"]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--gold)'
          : '';
      });
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => observer.observe(s));

// ── HERO CARD STACK HOVER ──
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
    const stack = heroVisual.querySelector('.hero-card-stack');
    if (stack) {
      stack.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg)`;
    }
  });
  heroVisual.addEventListener('mouseleave', () => {
    const stack = heroVisual.querySelector('.hero-card-stack');
    if (stack) {
      stack.style.transform = '';
      stack.style.transition = 'transform .5s ease';
      setTimeout(() => stack.style.transition = '', 500);
    }
  });
}
