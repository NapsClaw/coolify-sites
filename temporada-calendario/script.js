/* ═══════════════════════════════════════════════════
   TEMPORADA 2026 · JavaScript
   ═══════════════════════════════════════════════════ */

'use strict';

// ── Season Data (easily editable) ──────────────────
const SEASON_START = new Date(2026, 5, 15);  // June 15, 2026

const MONTHS = [
  {
    name: 'Junho',
    year: 2026,
    monthIndex: 5,   // 0-based JS month
    events: [
      {
        day: 15,
        title: 'Cerimônia de Abertura',
        desc: 'Evento oficial de abertura da temporada 2026. Uma noite especial para celebrar o início da jornada.',
        time: '19h00',
        type: 'featured',
        tag: '🌟 Destaque'
      },
      {
        day: 20,
        title: 'Encontro de Boas-vindas',
        desc: 'Momento de integração e boas-vindas para todos os novos participantes da temporada.',
        time: '10h00',
        type: 'normal',
        tag: '🤝 Social'
      },
      {
        day: 28,
        title: 'Workshop Introdutório',
        desc: 'Oficina prática introdutória para que todos os participantes se familiarizem com as atividades.',
        time: '14h00',
        type: 'normal',
        tag: '🎓 Workshop'
      }
    ]
  },
  {
    name: 'Julho',
    year: 2026,
    monthIndex: 6,
    events: [
      {
        day: 5,
        title: 'Rodada Especial',
        desc: 'Primeira grande rodada da temporada com atividades especiais programadas para todos os níveis.',
        time: '09h00',
        type: 'normal',
        tag: '🏆 Competição'
      },
      {
        day: 12,
        title: 'Campeonato Principal',
        desc: 'A grande competição da temporada. Os melhores participantes se enfrentam em uma disputa emocionante.',
        time: '10h00',
        type: 'featured',
        tag: '🏆 Destaque'
      },
      {
        day: 19,
        title: 'Tarde de Oficinas',
        desc: 'Uma tarde dedicada a oficinas práticas e workshops para desenvolvimento de habilidades.',
        time: '14h00',
        type: 'normal',
        tag: '🎓 Workshop'
      },
      {
        day: 26,
        title: 'Festival de Atividades',
        desc: 'Dia inteiro de atividades, diversão e experiências para toda a família curtir junto.',
        time: '09h00',
        type: 'featured',
        tag: '🎭 Festival'
      }
    ]
  },
  {
    name: 'Agosto',
    year: 2026,
    monthIndex: 7,
    events: [
      {
        day: 2,
        title: 'Rodada Final (Fase 1)',
        desc: 'Começo das rodadas finais. Momento decisivo para definir os finalistas da temporada.',
        time: '10h00',
        type: 'normal',
        tag: '🏆 Final'
      },
      {
        day: 9,
        title: 'Noite Especial',
        desc: 'Uma noite exclusiva com apresentações ao vivo, confraternização e muita emoção.',
        time: '20h00',
        type: 'featured',
        tag: '🎵 Show'
      },
      {
        day: 16,
        title: 'Workshop Exclusivo',
        desc: 'Aprenda com os melhores profissionais em um workshop prático com certificação ao final.',
        time: '09h00',
        type: 'normal',
        tag: '🎓 Workshop'
      },
      {
        day: 23,
        title: 'Semifinal',
        desc: 'As semifinais da temporada definem quem vai disputar o grande prêmio no encerramento.',
        time: '14h00',
        type: 'normal',
        tag: '⚡ Semifinal'
      },
      {
        day: 30,
        title: 'Grande Final & Encerramento',
        desc: 'A cerimônia de encerramento premiará os destaques e celebrará tudo o que foi conquistado.',
        time: '18h00',
        type: 'featured',
        tag: '🏅 Grande Final'
      }
    ]
  }
];

// ── State ──────────────────────────────────────────
let activeMonth = 0;
const today = new Date();

// ── Init ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar(0);
  renderEvents(0);
  initMonthNav();
  initFAQ();
  initNavScroll();
  initNavBurger();
  initCountdown();
  animateStats();
});

// ── Calendar Rendering ────────────────────────────
function renderCalendar(monthIdx) {
  const m = MONTHS[monthIdx];
  const grid = document.getElementById('calendarGrid');
  const eventDays = new Set(m.events.map(e => e.day));
  const featuredDays = new Set(m.events.filter(e => e.type === 'featured').map(e => e.day));

  const firstDay = new Date(m.year, m.monthIndex, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(m.year, m.monthIndex + 1, 0).getDate();
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  let html = `
    <div class="cal-header">
      <h3>${m.name} <span class="cal-year">${m.year}</span></h3>
    </div>
    <div class="cal-weekdays">
      ${weekdays.map(d => `<div class="cal-weekday">${d}</div>`).join('')}
    </div>
    <div class="cal-days">
  `;

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-day empty"></div>`;
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(m.year, m.monthIndex, d);
    const isToday = dateObj.toDateString() === today.toDateString();
    const isPast  = dateObj < today && !isToday;
    const hasEv   = eventDays.has(d);
    const isFeat  = featuredDays.has(d);

    let cls = 'cal-day';
    if (isToday) cls += ' today';
    if (isPast && !hasEv) cls += ' past';
    if (hasEv) cls += ' has-event';
    if (isFeat) cls += ' featured-event';

    const dot = hasEv ? '<span class="event-dot"></span>' : '';
    const click = hasEv ? `onclick="scrollToEvent(${d}, ${monthIdx})"` : '';

    html += `<div class="${cls}" ${click}>${d}${dot}</div>`;
  }

  html += `</div>`;
  grid.innerHTML = html;
}

function scrollToEvent(day, monthIdx) {
  const cardId = `event-${monthIdx}-${day}`;
  const card = document.getElementById(cardId);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.style.outline = '2px solid var(--primary)';
    setTimeout(() => { card.style.outline = ''; }, 2000);
  }
}

// ── Events Rendering ──────────────────────────────
function renderEvents(monthIdx) {
  const m = MONTHS[monthIdx];
  const grid = document.getElementById('eventsGrid');
  const title = document.getElementById('eventsTitle');
  const today = new Date();

  title.textContent = `Eventos de ${m.name}`;

  if (!m.events.length) {
    grid.innerHTML = '<p style="color:var(--muted)">Nenhum evento cadastrado para este mês.</p>';
    return;
  }

  grid.innerHTML = m.events.map(ev => {
    const evDate = new Date(m.year, m.monthIndex, ev.day);
    const isPast = evDate < today;
    const isFeat = ev.type === 'featured';

    return `
      <div class="event-card ${isFeat ? 'featured' : ''} ${isPast ? 'past-event' : ''}"
           id="event-${monthIdx}-${ev.day}"
           style="${isPast ? 'opacity:.6' : ''}">
        <span class="event-card__tag">${ev.tag}</span>
        <div class="event-card__date">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${ev.day} de ${m.name}, ${m.year}
        </div>
        <h4 class="event-card__title">${ev.title}</h4>
        <p class="event-card__desc">${ev.desc}</p>
        <div class="event-card__footer">
          <span class="event-card__time">
            🕐 ${ev.time}
          </span>
          <a href="#contato" class="btn btn--primary btn--sm">${isPast ? 'Ver Resumo' : 'Garantir Vaga'}</a>
        </div>
      </div>
    `;
  }).join('');
}

// ── Month Nav ─────────────────────────────────────
function initMonthNav() {
  const btns = document.querySelectorAll('.month-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.month);
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMonth = idx;
      renderCalendar(idx);
      renderEvents(idx);
    });
  });
}

// ── FAQ Accordion ─────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.faq-q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      // Toggle clicked
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });

  // Open first by default
  const firstQ = document.querySelector('.faq-q');
  if (firstQ) {
    firstQ.setAttribute('aria-expanded', 'true');
    firstQ.nextElementSibling.classList.add('open');
  }
}

// ── Nav Scroll ────────────────────────────────────
function initNavScroll() {
  const nav = document.getElementById('nav');
  const handler = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

// ── Nav Burger ────────────────────────────────────
function initNavBurger() {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}

// ── Countdown ─────────────────────────────────────
function initCountdown() {
  function update() {
    const now = new Date();
    const diff = SEASON_START - now;

    if (diff <= 0) {
      document.getElementById('countdown').innerHTML =
        '<span style="color:white;font-weight:700;font-size:1rem">🎉 Temporada em andamento!</span>';
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-min').textContent   = String(mins).padStart(2, '0');
    document.getElementById('cd-sec').textContent   = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// ── Animated Stats ────────────────────────────────
function animateStats() {
  const stats = document.querySelectorAll('.stat__num');

  // Always render final values first (prevents "0" on screenshots/slow load)
  stats.forEach(el => { el.textContent = el.dataset.target; });

  // Animate from 0 on scroll-into-view (progressive enhancement)
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
          current = Math.min(current + increment, target);
          el.textContent = Math.round(current);
          if (current >= target) clearInterval(timer);
        }, 40);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -20px 0px' });

  stats.forEach(s => observer.observe(s));
}

// ── Smooth anchor scroll (compensate fixed nav) ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
