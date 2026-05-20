/* ═══════════════════════════════════════════════════
   SÍTIOS TEMPORADA 2026 · JavaScript
   ═══════════════════════════════════════════════════ */

'use strict';

/* ── Constants ── */
const LS_KEY = 'sitios_temporada_2026';
const SEASON_START = new Date(2026, 5, 1);   // Jun 1
const SEASON_END   = new Date(2026, 7, 31);  // Aug 31

const MONTH_DATA = [
  { name: 'Junho',  year: 2026, monthIndex: 5 },
  { name: 'Julho',  year: 2026, monthIndex: 6 },
  { name: 'Agosto', year: 2026, monthIndex: 7 }
];

const PHOTO_PLACEHOLDERS = ['ph-0','ph-1','ph-2','ph-3','ph-4'];
const PHOTO_EMOJIS = ['🌳','🏡','🌊','⛰️','🌿'];

/* ── Demo sítios (carregados na primeira visita) ── */
const DEMO_SITIOS = [
  {
    id: 'demo-1', demo: true,
    nome: 'Sítio Vale Verde',
    cidade: 'Piracaia — SP',
    descricao: 'Propriedade ampla com piscina, churrasqueira, lago particular e área de lazer completa. Ideal para família e grupos de amigos.',
    capacidade: 20,
    diaria: 'R$ 850 / diária',
    dataInicio: '2026-06-01', dataFim: '2026-08-31',
    foto: '', whatsapp: ''
  },
  {
    id: 'demo-2', demo: true,
    nome: 'Recanto das Águas',
    cidade: 'Ibiúna — SP',
    descricao: 'Chácara com riacho, área de pesca, trilha na mata e espaço para grandes eventos. Natureza preservada com toda estrutura.',
    capacidade: 35,
    diaria: 'R$ 1.200 / diária',
    dataInicio: '2026-06-15', dataFim: '2026-08-30',
    foto: '', whatsapp: ''
  },
  {
    id: 'demo-3', demo: true,
    nome: 'Chácara Boa Vista',
    cidade: 'Atibaia — SP',
    descricao: 'Vista panorâmica da serra, campo de futebol gramado, piscina aquecida e espaço gourmet com forno a lenha.',
    capacidade: 15,
    diaria: 'R$ 650 / diária',
    dataInicio: '2026-07-01', dataFim: '2026-08-31',
    foto: '', whatsapp: ''
  }
];

/* ── State ── */
let sitios = [];
let activeMonth = 0;
let editingId = null;
const today = new Date();

/* ── Season date range ── */
const SEASON_BEGIN = new Date(2026, 5, 1);   // Jun 1, 2026
const SEASON_CLOSE = new Date(2026, 7, 31, 23, 59, 59); // Aug 31, 2026

/* ══════════════════════════════
   INIT
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // ① Reset filter controls BEFORE first render
  //    (prevents browser form-restoration from causing an initial empty grid)
  const _fSearch = document.getElementById('filterSearch');
  const _fCap    = document.getElementById('filterCap');
  if (_fSearch) _fSearch.value = '';
  if (_fCap)    _fCap.selectedIndex = 0;

  loadSitios();
  renderPublicGrid();
  renderCalendar(0);
  updateHeroStats();
  initMonthNav();
  initFAQ();
  initNavScroll();
  initNavBurger();
  initCountdown();
  initFilters();
  initPanelButtons();
  initFormEvents();
});

/* ══════════════════════════════
   STORAGE
══════════════════════════════ */
function loadSitios() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw !== null) {
      // Key exists – use stored data (even if empty array, user may have deleted all)
      const parsed = JSON.parse(raw);
      sitios = Array.isArray(parsed) ? parsed : [];
    } else {
      // First ever visit → seed with demo data
      sitios = DEMO_SITIOS.map(s => ({ ...s }));
      saveSitios();
    }
  } catch (e) {
    // Corrupted localStorage → seed fresh
    sitios = DEMO_SITIOS.map(s => ({ ...s }));
    try { saveSitios(); } catch (_) {}
  }
}

function saveSitios() {
  localStorage.setItem(LS_KEY, JSON.stringify(sitios));
}

function generateId() {
  return 'sitio-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
}

/* ══════════════════════════════
   PUBLIC GRID
══════════════════════════════ */
function renderPublicGrid(filter = '') {
  const grid = document.getElementById('sitiosGrid');
  const empty = document.getElementById('sitiosEmpty');
  const capFilter = document.getElementById('filterCap')?.value || '';

  let list = sitios.filter(s => {
    const matchText = !filter ||
      s.nome.toLowerCase().includes(filter.toLowerCase()) ||
      s.cidade.toLowerCase().includes(filter.toLowerCase());
    let matchCap = true;
    if (capFilter) {
      const cap = parseInt(s.capacidade) || 0;
      if (capFilter.includes('+')) {
        // "30+" means capacity > 30
        matchCap = cap > parseInt(capFilter);
      } else {
        matchCap = cap <= parseInt(capFilter);
      }
    }
    return matchText && matchCap;
  });

  if (list.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = list.map((s, i) => renderSitioCard(s, i)).join('');
}

function renderSitioCard(s, idx) {
  const phIdx = idx % PHOTO_PLACEHOLDERS.length;
  const emoji = PHOTO_EMOJIS[phIdx];
  const isAvail = checkAvailability(s, today);

  const photoHTML = s.foto
    ? `<img src="${escHtml(s.foto)}" alt="${escHtml(s.nome)}" loading="lazy" onerror="this.parentElement.classList.add('ph-${phIdx}');this.parentElement.innerHTML='<div class=\\'sitio-card__photo-inner\\'><span class=\\'sitio-card__photo-emoji\\'>${emoji}</span></div>'">`
    : `<div class="sitio-card__photo-inner"><span class="sitio-card__photo-emoji">${emoji}</span></div>`;

  const periodText = formatPeriod(s.dataInicio, s.dataFim);

  const waLink = buildWALink(s.whatsapp, s.nome);
  const ctaBtn = s.whatsapp
    ? `<a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn--whatsapp btn--sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.524 3.66 1.438 5.168L2 22l4.978-1.413A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
        WhatsApp
       </a>`
    : `<button type="button" class="btn btn--outline btn--sm" onclick="showDemoContactModal(event)">
        📋 Ver detalhes da reserva
       </button>`;

  return `
    <div class="sitio-card">
      <div class="sitio-card__photo ${s.foto ? '' : PHOTO_PLACEHOLDERS[phIdx]}">
        ${photoHTML}
        <div class="sitio-card__badges">
          <span class="sitio-card__cap-badge">👥 ${s.capacidade} pessoas</span>
          ${getAvailBadge(s, today)}
        </div>
      </div>
      <div class="sitio-card__body">
        <div class="sitio-card__location">📍 ${escHtml(s.cidade)}</div>
        <h3 class="sitio-card__name">${escHtml(s.nome)}</h3>
        ${s.descricao ? `<p class="sitio-card__desc">${escHtml(s.descricao)}</p>` : ''}
        <div class="sitio-card__meta">
          ${s.diaria ? `<span class="sitio-card__price">${escHtml(s.diaria)}</span>` : ''}
          ${periodText ? `<span class="sitio-card__period">📅 ${periodText}</span>` : ''}
        </div>
        <div class="sitio-card__footer">
          ${ctaBtn}
        </div>
      </div>
    </div>
  `;
}

/* ══════════════════════════════
   AVAILABILITY CALENDAR
══════════════════════════════ */
function renderCalendar(monthIdx) {
  const m = MONTH_DATA[monthIdx];
  const grid = document.getElementById('calendarGrid');
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const firstDay = new Date(m.year, m.monthIndex, 1).getDay();
  const daysInMonth = new Date(m.year, m.monthIndex + 1, 0).getDate();

  let html = `
    <div class="cal-header">
      <h3>${m.name} <span class="cal-year">${m.year}</span></h3>
    </div>
    <div class="cal-weekdays">
      ${weekdays.map(d => `<div class="cal-weekday">${d}</div>`).join('')}
    </div>
    <div class="cal-days">
  `;

  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-day empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(m.year, m.monthIndex, d);
    const isToday = dateObj.toDateString() === today.toDateString();

    // Count available sítios for this date
    const availCount = sitios.filter(s => checkAvailability(s, dateObj)).length;

    let cls = 'cal-day';
    if (isToday) cls += ' today';

    let countHtml = '';
    if (availCount >= 2) {
      cls += ' avail-high';
      countHtml = `<span class="avail-count">${availCount} sítios</span>`;
    } else if (availCount === 1) {
      cls += ' avail-low';
      countHtml = `<span class="avail-count">1 sítio</span>`;
    }

    const clickAttr = availCount > 0
      ? `onclick="showDayDetail(${d}, ${monthIdx})" role="button" tabindex="0" title="Ver sítios disponíveis em ${d} de ${m.name}"`
      : '';

    html += `<div class="${cls}" ${clickAttr}>${d}${countHtml}</div>`;
  }

  html += `</div>`;
  grid.innerHTML = html;
}

function showDayDetail(day, monthIdx) {
  const m = MONTH_DATA[monthIdx];
  const dateObj = new Date(m.year, m.monthIndex, day);
  const avail = sitios.filter(s => checkAvailability(s, dateObj));
  const panel = document.getElementById('calDayPanel');
  const title = document.getElementById('calDayTitle');
  const list = document.getElementById('calDayList');

  title.textContent = `Sítios disponíveis em ${day} de ${m.name}`;

  if (avail.length === 0) {
    list.innerHTML = '<p style="color:var(--muted);padding:8px 0">Nenhum sítio disponível nesta data.</p>';
  } else {
    list.innerHTML = avail.map((s, i) => {
      const phIdx = sitios.indexOf(s) % PHOTO_PLACEHOLDERS.length;
      const phClass = PHOTO_PLACEHOLDERS[phIdx];
      const emoji = PHOTO_EMOJIS[phIdx];
      const waLink = buildWALink(s.whatsapp, s.nome);
      return `
        <div class="cal-sitio-mini">
          <div class="cal-sitio-mini__photo ${phClass}">${emoji}</div>
          <div class="cal-sitio-mini__info">
            <div class="cal-sitio-mini__name">${escHtml(s.nome)}</div>
            <div class="cal-sitio-mini__city">📍 ${escHtml(s.cidade)} · 👥 ${s.capacidade} pessoas</div>
          </div>
          ${s.whatsapp
            ? `<a href="${waLink}" target="_blank" rel="noopener" class="btn btn--whatsapp btn--sm" style="flex-shrink:0">WA</a>`
            : ''}
        </div>
      `;
    }).join('');
  }

  panel.classList.add('visible');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calDayClose')?.addEventListener('click', () => {
    document.getElementById('calDayPanel').classList.remove('visible');
  });
});

/* ══════════════════════════════
   HELPERS
══════════════════════════════ */

/** Verifica se o sítio tem alguma sobreposição com a temporada Jun–Ago/2026 */
function checkSeasonOverlap(s) {
  if (!s.dataInicio && !s.dataFim) return true; // sem datas = sempre disponível
  const sStart = s.dataInicio ? new Date(s.dataInicio + 'T00:00:00') : new Date(1970, 0, 1);
  const sEnd   = s.dataFim   ? new Date(s.dataFim   + 'T23:59:59') : new Date(2099, 11, 31);
  return sStart <= SEASON_CLOSE && sEnd >= SEASON_BEGIN;
}

/** Retorna label positivo de disponibilidade futura, ex: "Disponível Jun–Ago/2026" */
function getSeasonAvailLabel(s) {
  const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const sStart = s.dataInicio ? new Date(s.dataInicio + 'T00:00:00') : SEASON_BEGIN;
  const sEnd   = s.dataFim   ? new Date(s.dataFim   + 'T23:59:59') : SEASON_CLOSE;
  // Restringir ao intervalo da temporada
  const effStart = sStart > SEASON_BEGIN ? sStart : SEASON_BEGIN;
  const effEnd   = sEnd   < SEASON_CLOSE ? sEnd   : SEASON_CLOSE;
  if (effStart.getMonth() === effEnd.getMonth() && effStart.getFullYear() === effEnd.getFullYear()) {
    return `Disponível ${monthNames[effStart.getMonth()]}/${effStart.getFullYear()}`;
  }
  return `Disponível ${monthNames[effStart.getMonth()]}–${monthNames[effEnd.getMonth()]}/${effEnd.getFullYear()}`;
}

/** Retorna HTML do badge de disponibilidade para o card público */
function getAvailBadge(s, date) {
  if (checkAvailability(s, date)) {
    return '<span class="sitio-card__avail-badge avail">✓ Disponível</span>';
  }
  if (checkSeasonOverlap(s)) {
    return `<span class="sitio-card__avail-badge future">📅 ${getSeasonAvailLabel(s)}</span>`;
  }
  return '<span class="sitio-card__avail-badge unavail">Fora de temporada</span>';
}

function checkAvailability(s, date) {
  if (!s.dataInicio || !s.dataFim) return true; // No dates = always available
  const start = new Date(s.dataInicio + 'T00:00:00');
  const end   = new Date(s.dataFim   + 'T23:59:59');
  return date >= start && date <= end;
}

function formatPeriod(start, end) {
  if (!start && !end) return '';
  const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const s = start ? new Date(start + 'T00:00:00') : null;
  const e = end   ? new Date(end   + 'T00:00:00') : null;
  if (s && e) return `${monthNames[s.getMonth()]}–${monthNames[e.getMonth()]}/${e.getFullYear()}`;
  if (s) return `A partir de ${monthNames[s.getMonth()]}/${s.getFullYear()}`;
  if (e) return `Até ${monthNames[e.getMonth()]}/${e.getFullYear()}`;
  return '';
}

function buildWALink(phone, nome) {
  if (!phone) return '#';
  const digits = phone.replace(/\D/g, '');
  const num = digits.startsWith('55') ? digits : '55' + digits;
  const msg = encodeURIComponent(`Olá! Vi o anúncio do ${nome} na plataforma Sítios Temporada 2026 e tenho interesse. Pode me dar mais informações?`);
  return `https://wa.me/${num}?text=${msg}`;
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ══════════════════════════════
   HERO STATS
══════════════════════════════ */
function updateHeroStats() {
  const total = sitios.length;
  const cidades = new Set(sitios.map(s => s.cidade.split('—')[0].trim())).size;

  // Count sítios with any overlap with the 2026 season (Jun 1 – Aug 31)
  const dispTemporada = sitios.filter(s => {
    if (!s.dataInicio && !s.dataFim) return true; // no dates = always available
    const sStart = s.dataInicio ? new Date(s.dataInicio + 'T00:00:00') : new Date(2026, 0, 1);
    const sEnd   = s.dataFim   ? new Date(s.dataFim   + 'T23:59:59') : new Date(2026, 11, 31);
    return sStart <= SEASON_CLOSE && sEnd >= SEASON_BEGIN;
  }).length;

  animateNum('statTotal', total);
  animateNum('statCidades', cidades);
  animateNum('statDisp', dispTemporada);
}

function animateNum(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = target;
}

/* ══════════════════════════════
   MONTH NAV
══════════════════════════════ */
function initMonthNav() {
  document.querySelectorAll('.month-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.month-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMonth = parseInt(btn.dataset.month);
      renderCalendar(activeMonth);
      document.getElementById('calDayPanel').classList.remove('visible');
    });
  });
}

/* ══════════════════════════════
   FILTERS
══════════════════════════════ */
function initFilters() {
  let filterTimeout;
  document.getElementById('filterSearch')?.addEventListener('input', e => {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => renderPublicGrid(e.target.value), 300);
  });
  document.getElementById('filterCap')?.addEventListener('change', () => {
    renderPublicGrid(document.getElementById('filterSearch')?.value || '');
  });
}

/* ══════════════════════════════
   FAQ
══════════════════════════════ */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });
}

/* ══════════════════════════════
   NAV SCROLL & BURGER
══════════════════════════════ */
function initNavScroll() {
  const nav = document.getElementById('nav');
  const handler = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

function initNavBurger() {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  burger?.addEventListener('click', () => menu.classList.toggle('open'));
  menu?.querySelectorAll('a').forEach(l => l.addEventListener('click', () => menu.classList.remove('open')));
}

/* ══════════════════════════════
   COUNTDOWN (Jun 1, 2026)
══════════════════════════════ */
function initCountdown() {
  function update() {
    const now = new Date();
    const diff = SEASON_START - now;
    if (diff <= 0) {
      const el = document.getElementById('countdown');
      if (el) el.innerHTML = '<span style="color:white;font-weight:700;font-size:1rem">🌳 Temporada em andamento!</span>';
      return;
    }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = String(val).padStart(2, '0'); };
    set('cd-days', days); set('cd-hours', hours); set('cd-min', mins); set('cd-sec', secs);
  }
  update();
  setInterval(update, 1000);
}

/* ══════════════════════════════
   PANEL — OPEN/CLOSE
══════════════════════════════ */
function openPanel() {
  document.getElementById('panelOverlay').classList.add('open');
  document.getElementById('panelOverlay').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePanel() {
  document.getElementById('panelOverlay').classList.remove('open');
  document.getElementById('panelOverlay').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function showDash() {
  document.getElementById('screenLogin').style.display = 'none';
  document.getElementById('screenDash').style.display = 'flex';
  renderPanelList();
}

function showLogin() {
  document.getElementById('screenDash').style.display = 'none';
  document.getElementById('screenLogin').style.display = 'flex';
}

function initPanelButtons() {
  // Open panel buttons
  const panelTriggers = [
    'navPainel','navAnunciar','mobilePainel','heroAnunciar',
    'ctaAnunciar','emptyAnunciar','sitiosCadastrar','fabPanel','footerPainel'
  ];
  panelTriggers.forEach(id => {
    document.getElementById(id)?.addEventListener('click', (e) => {
      e.preventDefault();
      openPanel();
      document.getElementById('mobileMenu')?.classList.remove('open');
    });
  });

  // Login / enter
  document.getElementById('btnEntrar')?.addEventListener('click', showDash);

  // Back buttons
  document.getElementById('panelBackLogin')?.addEventListener('click', closePanel);
  document.getElementById('btnSair')?.addEventListener('click', () => { showLogin(); closePanel(); });

  // Panel empty add button
  document.getElementById('panelEmptyAdd')?.addEventListener('click', showFormForNew);

  // Close on overlay backdrop click
  document.getElementById('panelOverlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('panelOverlay')) closePanel();
  });

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('panelOverlay').classList.contains('open')) {
      closePanel();
    }
  });

  // New sítio button
  document.getElementById('btnNovoSitio')?.addEventListener('click', showFormForNew);
}

/* ══════════════════════════════
   PANEL — FORM
══════════════════════════════ */
function initFormEvents() {
  document.getElementById('sitioForm')?.addEventListener('submit', handleFormSubmit);
  document.getElementById('btnFecharForm')?.addEventListener('click', hideForm);
  document.getElementById('btnCancelar')?.addEventListener('click', hideForm);
}

function showFormForNew() {
  editingId = null;
  const form = document.getElementById('sitioForm');
  form.reset();
  document.getElementById('fId').value = '';
  document.getElementById('formTitle').innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
    Cadastrar Novo Sítio`;
  document.getElementById('btnSalvar').textContent = '💾 Salvar Sítio';
  showForm();
}

function showFormForEdit(id) {
  const s = sitios.find(x => x.id === id);
  if (!s) return;
  editingId = id;
  document.getElementById('fId').value = s.id;
  document.getElementById('fNome').value = s.nome || '';
  document.getElementById('fCidade').value = s.cidade || '';
  document.getElementById('fDesc').value = s.descricao || '';
  document.getElementById('fCap').value = s.capacidade || '';
  document.getElementById('fDiaria').value = s.diaria || '';
  document.getElementById('fDataInicio').value = s.dataInicio || '';
  document.getElementById('fDataFim').value = s.dataFim || '';
  document.getElementById('fFoto').value = s.foto || '';
  document.getElementById('fWhats').value = s.whatsapp || '';
  document.getElementById('formTitle').innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    Editar Sítio`;
  document.getElementById('btnSalvar').textContent = '💾 Atualizar Sítio';
  showForm();
}

function showForm() {
  const wrapper = document.getElementById('formWrapper');
  wrapper.classList.add('visible');
  wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideForm() {
  document.getElementById('formWrapper').classList.remove('visible');
  document.getElementById('sitioForm').reset();
  editingId = null;
}

function handleFormSubmit(e) {
  e.preventDefault();

  const nome = document.getElementById('fNome').value.trim();
  const cidade = document.getElementById('fCidade').value.trim();
  const cap = document.getElementById('fCap').value.trim();
  const whats = document.getElementById('fWhats').value.trim();

  // Validação
  let valid = true;
  [['fNome', nome], ['fCidade', cidade], ['fCap', cap], ['fWhats', whats]].forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (!val) { el.classList.add('error'); valid = false; }
    else el.classList.remove('error');
  });
  if (!valid) { showToast('Preencha os campos obrigatórios.', 'error'); return; }

  const sitio = {
    id: editingId || generateId(),
    demo: false,
    nome,
    cidade,
    descricao: document.getElementById('fDesc').value.trim(),
    capacidade: parseInt(cap) || 0,
    diaria: document.getElementById('fDiaria').value.trim(),
    dataInicio: document.getElementById('fDataInicio').value,
    dataFim: document.getElementById('fDataFim').value,
    foto: document.getElementById('fFoto').value.trim(),
    whatsapp: whats
  };

  if (editingId) {
    const idx = sitios.findIndex(s => s.id === editingId);
    if (idx !== -1) sitios[idx] = sitio;
    showToast('✅ Sítio atualizado com sucesso!', 'success');
  } else {
    sitios.push(sitio);
    showToast('✅ Sítio cadastrado com sucesso!', 'success');
  }

  saveSitios();
  hideForm();
  renderPanelList();
  renderPublicGrid();
  renderCalendar(activeMonth);
  updateHeroStats();
}

function deleteSitio(id) {
  if (!confirm('Remover este sítio da listagem?')) return;
  sitios = sitios.filter(s => s.id !== id);
  saveSitios();
  renderPanelList();
  renderPublicGrid();
  renderCalendar(activeMonth);
  updateHeroStats();
  showToast('🗑️ Sítio removido.', 'success');
}

/* ══════════════════════════════
   PANEL LIST
══════════════════════════════ */
function renderPanelList() {
  const grid = document.getElementById('panelSitiosGrid');
  const empty = document.getElementById('panelEmpty');
  const count = document.getElementById('panelListCount');

  count.textContent = `${sitios.length} sítio${sitios.length !== 1 ? 's' : ''}`;

  if (sitios.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = sitios.map((s, i) => renderPanelCard(s, i)).join('');

  // Attach events
  grid.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => showFormForEdit(btn.dataset.edit));
  });
  grid.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteSitio(btn.dataset.delete));
  });
}

function renderPanelCard(s, idx) {
  const phIdx = idx % PHOTO_PLACEHOLDERS.length;
  const phClass = PHOTO_PLACEHOLDERS[phIdx];
  const emoji = PHOTO_EMOJIS[phIdx];
  const isAvail = checkAvailability(s, today);
  const period = formatPeriod(s.dataInicio, s.dataFim);

  return `
    <div class="panel-sitio-card ${s.demo ? 'demo-card' : ''}" style="position:relative">
      <div class="panel-sitio-card__photo ${s.foto ? '' : phClass}" style="${s.foto ? `background-image:url(${escHtml(s.foto)});background-size:cover;background-position:center` : ''}">
        ${!s.foto ? emoji : ''}
      </div>
      <div class="panel-sitio-card__body">
        <div class="panel-sitio-card__name">${escHtml(s.nome)}</div>
        <div class="panel-sitio-card__city">📍 ${escHtml(s.cidade)}</div>
        <div class="panel-sitio-card__meta">
          <span class="panel-sitio-card__tag">👥 ${s.capacidade} pessoas</span>
          ${s.diaria ? `<span class="panel-sitio-card__tag">${escHtml(s.diaria)}</span>` : ''}
          <span class="panel-sitio-card__tag" style="${isAvail ? 'background:#d1fae5;color:#064e3b;border-color:#6ee7b7' : ''}">
            ${isAvail ? '✓ Disponível' : 'Fora de temporada'}
          </span>
          ${period ? `<span class="panel-sitio-card__tag">📅 ${period}</span>` : ''}
          ${s.whatsapp ? `<span class="panel-sitio-card__tag">📱 ${escHtml(s.whatsapp)}</span>` : '<span class="panel-sitio-card__tag" style="color:var(--red)">⚠️ Sem WhatsApp</span>'}
        </div>
        <div class="panel-sitio-card__actions">
          <button class="btn btn--edit btn--sm" data-edit="${s.id}">
            ✏️ Editar
          </button>
          <button class="btn btn--delete btn--sm" data-delete="${s.id}">
            🗑️ Remover
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ══════════════════════════════
   TOAST
══════════════════════════════ */
function showToast(msg, type = '') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ══════════════════════════════
   DEMO CONTACT MODAL
══════════════════════════════ */
function showDemoContactModal(e) {
  if (e) e.preventDefault();
  const existingModal = document.getElementById('demoContactModal');
  if (existingModal) { existingModal.remove(); return; }
  const modal = document.createElement('div');
  modal.id = 'demoContactModal';
  modal.className = 'demo-modal-overlay';
  modal.innerHTML = `
    <div class="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demoModalTitle">
      <button class="demo-modal__close" onclick="document.getElementById('demoContactModal').remove()" aria-label="Fechar">✕</button>
      <div class="demo-modal__icon">🌳</div>
      <h3 id="demoModalTitle">Sítio Demonstrativo</h3>
      <p>Este é um card de exemplo da plataforma. O contato de reserva ainda não foi cadastrado pelo proprietário.</p>
      <p style="font-size:.84rem;color:var(--muted);margin-bottom:20px">Ao anunciar no painel, o dono informa o WhatsApp real e os visitantes podem reservar diretamente por aqui.</p>
      <button class="btn btn--primary btn--sm" onclick="document.getElementById('demoContactModal').remove()">Entendido</button>
    </div>
  `;
  modal.addEventListener('click', ev => { if (ev.target === modal) modal.remove(); });
  document.body.appendChild(modal);
  modal.querySelector('.demo-modal').focus && modal.querySelector('.demo-modal__close').focus();
}

/* ══════════════════════════════
   SMOOTH ANCHOR SCROLL
══════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
