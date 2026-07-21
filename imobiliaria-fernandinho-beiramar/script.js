/* ═══════════════════════════════════════════════
   Imobiliária Fernandinho Beiramar — script.js
═══════════════════════════════════════════════ */

/* ── Data: Imóveis ── */
const IMOVEIS = [
  // ── VENDA ──
  {
    id: 1, modal: 'venda', tipo: 'apartamento', aluguelTipo: null,
    titulo: 'Apartamento Vista Mar',
    preco: 'R$ 850.000', precoNum: 850000,
    area: '120 m²', quartos: 3, banheiros: 2,
    tag: 'Destaque',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Edifício residencial moderno com apartamentos beira-mar'
  },
  {
    id: 2, modal: 'venda', tipo: 'casa', aluguelTipo: null,
    titulo: 'Casa em Condomínio Fechado',
    preco: 'R$ 1.850.000', precoNum: 1850000,
    area: '250 m²', quartos: 4, banheiros: 3,
    tag: null,
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Casa de alto padrão com fachada moderna e jardim'
  },
  {
    id: 3, modal: 'venda', tipo: 'studio', aluguelTipo: null,
    titulo: 'Studio Moderno Praia',
    preco: 'R$ 420.000', precoNum: 420000,
    area: '45 m²', quartos: 1, banheiros: 1,
    tag: 'Novo',
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Studio moderno bem decorado próximo à praia'
  },
  {
    id: 4, modal: 'venda', tipo: 'cobertura', aluguelTipo: null,
    titulo: 'Cobertura Duplex Beiramar',
    preco: 'R$ 2.900.000', precoNum: 2900000,
    area: '350 m²', quartos: 4, banheiros: 4,
    tag: 'Exclusivo',
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Cobertura de luxo com acabamento premium e entrada elegante'
  },
  {
    id: 5, modal: 'venda', tipo: 'apartamento', aluguelTipo: null,
    titulo: 'Apartamento 2 Quartos',
    preco: 'R$ 580.000', precoNum: 580000,
    area: '80 m²', quartos: 2, banheiros: 1,
    tag: null,
    img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Apartamento de 2 quartos com sala integrada e acabamento moderno'
  },
  {
    id: 6, modal: 'venda', tipo: 'casa', aluguelTipo: null,
    titulo: 'Casa de Condomínio — 3 Suítes',
    preco: 'R$ 1.250.000', precoNum: 1250000,
    area: '200 m²', quartos: 3, banheiros: 3,
    tag: null,
    img: 'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Casa de condomínio com área gourmet e piscina'
  },
  // ── ALUGUEL — PERMANENTE ──
  {
    id: 7, modal: 'aluguel', tipo: 'apartamento', aluguelTipo: 'permanente',
    titulo: 'Apartamento Vista Mar',
    preco: 'R$ 4.500', precoNum: 4500, sufixo: '/mês',
    area: '75 m²', quartos: 2, banheiros: 1,
    tag: 'Disponível',
    img: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Sala de estar ampla com janelão e iluminação natural'
  },
  {
    id: 8, modal: 'aluguel', tipo: 'studio', aluguelTipo: 'permanente',
    titulo: 'Studio Completo Mobiliado',
    preco: 'R$ 2.200', precoNum: 2200, sufixo: '/mês',
    area: '42 m²', quartos: 1, banheiros: 1,
    tag: null,
    img: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Studio compacto e bem organizado para locação'
  },
  {
    id: 9, modal: 'aluguel', tipo: 'apartamento', aluguelTipo: 'permanente',
    titulo: 'Apartamento 3 Quartos',
    preco: 'R$ 6.200', precoNum: 6200, sufixo: '/mês',
    area: '110 m²', quartos: 3, banheiros: 2,
    tag: null,
    img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Quarto elegante em apartamento espaçoso para locação'
  },
  {
    id: 10, modal: 'aluguel', tipo: 'studio', aluguelTipo: 'permanente',
    titulo: 'Kitnet Mobiliada',
    preco: 'R$ 1.600', precoNum: 1600, sufixo: '/mês',
    area: '35 m²', quartos: 1, banheiros: 1,
    tag: 'Ótimo custo',
    img: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Kitnet moderna e bem localizada para aluguel'
  },
  // ── ALUGUEL — TEMPORADA ──
  {
    id: 11, modal: 'aluguel', tipo: 'casa', aluguelTipo: 'temporada',
    titulo: 'Casa de Praia — Temporada',
    preco: 'R$ 7.800', precoNum: 7800, sufixo: '/semana',
    area: '160 m²', quartos: 3, banheiros: 2,
    tag: 'Temporada',
    img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Casa de praia para temporada com área externa e varanda'
  },
  {
    id: 12, modal: 'aluguel', tipo: 'casa', aluguelTipo: 'temporada',
    titulo: 'Casa Temporada — 4 Quartos',
    preco: 'R$ 12.000', precoNum: 12000, sufixo: '/semana',
    area: '220 m²', quartos: 4, banheiros: 3,
    tag: 'Premium',
    img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Casa ampla de alto padrão para temporada na praia'
  }
];

/* ── Render: card de imóvel ── */
function renderCard(imovel) {
  const isAluguel = imovel.modal === 'aluguel';
  const waMsg = encodeURIComponent(`Olá! Tenho interesse no imóvel "${imovel.titulo}" (${imovel.preco}${imovel.sufixo || ''}). Podemos conversar?`);
  return `
    <article class="property-card" role="listitem"
      data-modal="${imovel.modal}"
      data-tipo="${imovel.tipo}"
      data-quartos="${imovel.quartos}"
      data-preco="${imovel.precoNum}"
      data-aluguel-tipo="${imovel.aluguelTipo || ''}"
    >
      <div class="prop-img-wrap">
        <img src="${imovel.img}" alt="${imovel.imgAlt}" loading="lazy" width="600" height="375" />
        <span class="badge ${isAluguel ? 'badge-rent' : 'badge-sale'}">${isAluguel ? 'Para Alugar' : 'À Venda'}</span>
        ${imovel.tag ? `<span class="badge-top">${imovel.tag}</span>` : ''}
      </div>
      <div class="prop-body">
        <p class="prop-type">${ucFirst(imovel.tipo)}</p>
        <h3 class="prop-title">${imovel.titulo}</h3>
        <p class="prop-price">${imovel.preco}<small>${imovel.sufixo || ''}</small></p>
        <div class="prop-details">
          <span class="prop-detail">🛏 ${imovel.quartos} quarto${imovel.quartos > 1 ? 's' : ''}</span>
          <span class="prop-detail">🚿 ${imovel.banheiros} banheiro${imovel.banheiros > 1 ? 's' : ''}</span>
          <span class="prop-detail">📐 ${imovel.area}</span>
        </div>
        <div class="prop-footer">
          <a href="https://wa.me/5511976202155?text=${waMsg}" target="_blank" rel="noopener" class="prop-btn prop-btn-wa">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.544 5.868L0 24l6.29-1.518A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.056-1.407l-.36-.215-3.733.9.943-3.634-.235-.374A9.818 9.818 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/></svg>
            WhatsApp
          </a>
          <a href="#contato" class="prop-btn prop-btn-info">Saiba mais</a>
        </div>
      </div>
    </article>`;
}

function ucFirst(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

/* ── Render Grids ── */
function renderAllGrids() {
  // Main grid (todos)
  const mainGrid = document.getElementById('properties-grid');
  if (mainGrid) {
    mainGrid.innerHTML = IMOVEIS.map(renderCard).join('');
  }

  // Venda grid (sidebar cards - exclude first 2 already shown as highlights)
  const vendaGrid = document.getElementById('venda-grid');
  if (vendaGrid) {
    const extras = IMOVEIS.filter(i => i.modal === 'venda').slice(2);
    vendaGrid.innerHTML = extras.map(renderCard).join('');
  }

  // Aluguel grid
  const aluguelGrid = document.getElementById('aluguel-grid');
  if (aluguelGrid) {
    const perm = IMOVEIS.filter(i => i.modal === 'aluguel' && i.aluguelTipo === 'permanente');
    aluguelGrid.innerHTML = perm.map(renderCard).join('');
  }
}

/* ── Filter ── */
let currentFilter = 'all';
let currentAluguelType = 'permanente';

function applyFilter(filterVal) {
  currentFilter = filterVal;
  const cards = document.querySelectorAll('#properties-grid .property-card');
  let visible = 0;
  cards.forEach(card => {
    const modal    = card.dataset.modal;
    const tipo     = card.dataset.tipo;
    const match =
      filterVal === 'all' ||
      filterVal === modal ||
      filterVal === tipo;
    if (match) { card.hidden = false; visible++; }
    else        { card.hidden = true; }
  });
  const count = document.getElementById('results-count');
  if (count) count.innerHTML = `Exibindo <strong>${visible}</strong> imóve${visible !== 1 ? 'is' : 'l'}`;
  const noResults = document.getElementById('no-results');
  if (noResults) noResults.hidden = visible > 0;
}

function resetFilters() {
  currentFilter = 'all';
  document.querySelectorAll('.filter-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.filterModal === 'all');
  });
  applyFilter('all');
}
window.resetFilters = resetFilters;

/* ── Sort ── */
function applySort(val) {
  const grid = document.getElementById('properties-grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.property-card'));
  cards.sort((a, b) => {
    const pa = +a.dataset.preco, pb = +b.dataset.preco;
    if (val === 'price-asc')  return pa - pb;
    if (val === 'price-desc') return pb - pa;
    if (val === 'area-desc') {
      const aa = parseInt(a.querySelector('.prop-detail:last-child')?.textContent || '0');
      const ab = parseInt(b.querySelector('.prop-detail:last-child')?.textContent || '0');
      return ab - aa;
    }
    return +a.dataset.preco > 0 ? 0 : 1; // default
  });
  cards.forEach(c => grid.appendChild(c));
}

/* ── Hero Search ── */
function initHeroSearch() {
  const tabs = document.querySelectorAll('.search-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
    });
  });

  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const activeTab = document.querySelector('.search-tab.active');
      const modal = activeTab?.dataset.tab === 'alugar' ? 'aluguel' : 'venda';
      const tipo = document.getElementById('tipo-imovel')?.value || '';

      // scroll to section
      const target = document.getElementById('imoveis');
      if (target) target.scrollIntoView({ behavior: 'smooth' });

      // apply filter after scroll
      setTimeout(() => {
        const filterVal = tipo || modal;
        document.querySelectorAll('.filter-tab').forEach(t => {
          t.classList.toggle('active', t.dataset.filterModal === filterVal);
        });
        applyFilter(filterVal);
      }, 600);
    });
  }
}

/* ── Filter Tabs ── */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      applyFilter(tab.dataset.filterModal);
    });
  });

  const sortSel = document.getElementById('sort-select');
  if (sortSel) {
    sortSel.addEventListener('change', () => applySort(sortSel.value));
  }
}

/* ── Aluguel Tabs ── */
function initAluguelTabs() {
  const tabs = document.querySelectorAll('.aluguel-tab');
  const grid = document.getElementById('aluguel-grid');
  if (!tabs.length || !grid) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const tipo = tab.dataset.aluguel;
      const imoveis = IMOVEIS.filter(i => i.modal === 'aluguel' && i.aluguelTipo === tipo);
      grid.innerHTML = imoveis.map(renderCard).join('');
    });
  });
}

/* ── Header scroll ── */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  function closeMenu() {
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    nav.setAttribute('aria-hidden', 'true');
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open');
    if (isOpen) { closeMenu(); }
    else {
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('open');
      nav.setAttribute('aria-hidden', 'false');
    }
  });

  // close on link click
  nav.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ── Smooth anchor ── */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  renderAllGrids();
  initHeroSearch();
  initFilterTabs();
  initAluguelTabs();
  initHeader();
  initMobileMenu();
  initSmoothAnchors();
});
