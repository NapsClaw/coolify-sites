/* ═══════════════════════════════════════════════
   Imobiliária Fernandinho Beiramar — script.js v5
   Migração storage v1→v2 + garantia WA_NUM atual
═══════════════════════════════════════════════ */

/* ── Constantes globais ── */
const WA_NUM             = '5511988782345';   // número ATUAL — sempre usar esta constante
const OLD_WA_NUM         = '5511976202155';   // número ANTIGO — só para migração/sanitização
const STORAGE_KEY        = 'fbm_imoveis_v2';  // chave v2 (pós-migração)
const STORAGE_KEY_LEGACY = 'fbm_imoveis_v1';  // chave antiga — apenas leitura para migrar
const IMG_FALLBACK = 'assets/imoveis/fallback.svg';

/* ── Dados de demonstração ── */
const IMOVEIS_DEMO = [
  // ── VENDA ──
  {
    id: 1, modal: 'venda', tipo: 'apartamento', aluguelTipo: null,
    titulo: 'Apartamento Vista Mar',
    preco: 'R$ 850.000', precoNum: 850000,
    area: '120 m²', quartos: 3, banheiros: 2, vagas: 1,
    tag: 'Destaque', status: 'disponivel',
    localizacao: 'Praia Grande — SP',
    img: 'assets/imoveis/apt-vista-mar-venda.jpg',
    imgAlt: 'Edifício residencial moderno com apartamentos beira-mar'
  },
  {
    id: 2, modal: 'venda', tipo: 'casa', aluguelTipo: null,
    titulo: 'Casa em Condomínio Fechado',
    preco: 'R$ 1.850.000', precoNum: 1850000,
    area: '250 m²', quartos: 4, banheiros: 3, vagas: 2,
    tag: null, status: 'disponivel',
    localizacao: 'Riviera de São Lourenço — SP',
    img: 'assets/imoveis/casa-condominio-fechado.jpg',
    imgAlt: 'Casa de alto padrão com fachada moderna e jardim'
  },
  {
    id: 3, modal: 'venda', tipo: 'studio', aluguelTipo: null,
    titulo: 'Studio Moderno Praia',
    preco: 'R$ 420.000', precoNum: 420000,
    area: '45 m²', quartos: 1, banheiros: 1, vagas: 1,
    tag: 'Novo', status: 'disponivel',
    localizacao: 'Santos — SP',
    img: 'assets/imoveis/studio-moderno-praia.jpg',
    imgAlt: 'Studio moderno bem decorado próximo à praia'
  },
  {
    id: 4, modal: 'venda', tipo: 'cobertura', aluguelTipo: null,
    titulo: 'Cobertura Duplex Beiramar',
    preco: 'R$ 2.900.000', precoNum: 2900000,
    area: '350 m²', quartos: 4, banheiros: 4, vagas: 3,
    tag: 'Exclusivo', status: 'disponivel',
    localizacao: 'Guarujá — SP',
    img: 'assets/imoveis/cobertura-duplex.jpg',
    imgAlt: 'Cobertura de luxo com acabamento premium e entrada elegante'
  },
  {
    id: 5, modal: 'venda', tipo: 'apartamento', aluguelTipo: null,
    titulo: 'Apartamento 2 Quartos',
    preco: 'R$ 580.000', precoNum: 580000,
    area: '80 m²', quartos: 2, banheiros: 1, vagas: 1,
    tag: null, status: 'disponivel',
    localizacao: 'Praia Grande — SP',
    img: 'assets/imoveis/apt-2-quartos.jpg',
    imgAlt: 'Apartamento de 2 quartos com sala integrada e acabamento moderno'
  },
  {
    id: 6, modal: 'venda', tipo: 'casa', aluguelTipo: null,
    titulo: 'Casa de Condomínio — 3 Suítes',
    preco: 'R$ 1.250.000', precoNum: 1250000,
    area: '200 m²', quartos: 3, banheiros: 3, vagas: 2,
    tag: null, status: 'disponivel',
    localizacao: 'Bertioga — SP',
    img: 'assets/imoveis/casa-3-suites.jpg',
    imgAlt: 'Casa de condomínio com área gourmet e piscina'
  },
  // ── ALUGUEL — PERMANENTE ──
  {
    id: 7, modal: 'aluguel', tipo: 'apartamento', aluguelTipo: 'permanente',
    titulo: 'Apartamento Vista Mar',
    preco: 'R$ 4.500', precoNum: 4500, sufixo: '/mês',
    area: '75 m²', quartos: 2, banheiros: 1, vagas: 1,
    tag: 'Disponível', status: 'disponivel',
    localizacao: 'Praia Grande — SP',
    img: 'assets/imoveis/apt-vista-mar-aluguel.jpg',
    imgAlt: 'Sala de estar ampla com janelão e iluminação natural'
  },
  {
    id: 8, modal: 'aluguel', tipo: 'studio', aluguelTipo: 'permanente',
    titulo: 'Studio Completo Mobiliado',
    preco: 'R$ 2.200', precoNum: 2200, sufixo: '/mês',
    area: '42 m²', quartos: 1, banheiros: 1, vagas: 1,
    tag: null, status: 'disponivel',
    localizacao: 'Santos — SP',
    img: 'assets/imoveis/studio-mobiliado.jpg',
    imgAlt: 'Studio compacto e bem organizado para locação'
  },
  {
    id: 9, modal: 'aluguel', tipo: 'apartamento', aluguelTipo: 'permanente',
    titulo: 'Apartamento 3 Quartos',
    preco: 'R$ 6.200', precoNum: 6200, sufixo: '/mês',
    area: '110 m²', quartos: 3, banheiros: 2, vagas: 1,
    tag: null, status: 'disponivel',
    localizacao: 'Guarujá — SP',
    img: 'assets/imoveis/apt-3-quartos-aluguel.jpg',
    imgAlt: 'Quarto elegante em apartamento espaçoso para locação'
  },
  {
    id: 10, modal: 'aluguel', tipo: 'studio', aluguelTipo: 'permanente',
    titulo: 'Kitnet Mobiliada',
    preco: 'R$ 1.600', precoNum: 1600, sufixo: '/mês',
    area: '35 m²', quartos: 1, banheiros: 1, vagas: 0,
    tag: 'Ótimo custo', status: 'disponivel',
    localizacao: 'Mongaguá — SP',
    img: 'assets/imoveis/kitnet-mobiliada.jpg',
    imgAlt: 'Kitnet moderna e bem localizada para aluguel'
  },
  // ── ALUGUEL — TEMPORADA ──
  {
    id: 11, modal: 'aluguel', tipo: 'casa', aluguelTipo: 'temporada',
    titulo: 'Casa de Praia — Temporada',
    preco: 'R$ 7.800', precoNum: 7800, sufixo: '/semana',
    area: '160 m²', quartos: 3, banheiros: 2, vagas: 2,
    tag: 'Temporada', status: 'disponivel',
    localizacao: 'Bertioga — SP',
    img: 'assets/imoveis/casa-praia-temporada.jpg',
    imgAlt: 'Casa de praia para temporada com área externa e varanda'
  },
  {
    id: 12, modal: 'aluguel', tipo: 'casa', aluguelTipo: 'temporada',
    titulo: 'Casa Temporada — 4 Quartos',
    preco: 'R$ 12.000', precoNum: 12000, sufixo: '/semana',
    area: '220 m²', quartos: 4, banheiros: 3, vagas: 3,
    tag: 'Premium', status: 'disponivel',
    localizacao: 'Riviera de São Lourenço — SP',
    img: 'assets/imoveis/casa-temporada-4q.jpg',
    imgAlt: 'Casa ampla de alto padrão para temporada na praia'
  }
];

/* ── Migração de storage v1 → v2 ── */
function migrateStorageV1toV2() {
  // Se v2 já existe, nada a fazer
  if (localStorage.getItem(STORAGE_KEY)) return;

  const rawV1 = localStorage.getItem(STORAGE_KEY_LEGACY);
  if (!rawV1) return;

  try {
    // Substitui todas as ocorrências do número antigo no JSON serializado
    // Isso cobre campos que possam ter sido salvos com o número embutido
    const migrated = rawV1
      .replace(new RegExp(OLD_WA_NUM, 'g'), WA_NUM)
      .replace(/97620-2155/g, '98878-2345')
      .replace(/97620\.2155/g, '98878.2345');

    const arr = JSON.parse(migrated);
    if (Array.isArray(arr) && arr.length > 0) {
      localStorage.setItem(STORAGE_KEY, migrated);
    }
  } catch(e) {
    // Se falhar, loadImoveis vai usar os dados demo — melhor do que corromper
  }
}

/* ── Sanitizar imóvel (garante ausência do número antigo em campos de texto) ── */
function sanitizeImovel(im) {
  const clone = Object.assign({}, im);
  // Campos de texto onde o número poderia ter sido embutido manualmente
  ['titulo', 'descricao', 'localizacao', 'tag', 'imgAlt'].forEach(f => {
    if (typeof clone[f] === 'string') {
      clone[f] = clone[f]
        .replace(new RegExp(OLD_WA_NUM, 'g'), WA_NUM)
        .replace(/97620-2155/g, '98878-2345');
    }
  });
  // Remove qualquer campo de href/link/telefone que possa ter sido salvo indevidamente
  delete clone.waHref;
  delete clone.waLink;
  delete clone.telefone;
  delete clone.phone;
  return clone;
}

/* ── Storage ── */
function loadImoveis() {
  // Migra dados antigos se necessário (apenas na primeira execução após atualização)
  migrateStorageV1toV2();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length > 0) {
        // Sanitiza cada registro ao carregar — garante número correto mesmo em dados legados
        return arr.map(sanitizeImovel);
      }
    }
  } catch(e) {}
  return IMOVEIS_DEMO.map(i => ({...i}));
}

function saveImoveis(arr) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    return true;
  } catch(e) {
    return false;
  }
}

/* ── Estado global ── */
let IMOVEIS = loadImoveis();
let currentFilter = 'all';
let currentAluguelType = 'permanente';

/* ── Render: card de imóvel ── */
function renderCard(imovel) {
  if (imovel.status === 'indisponivel') return ''; // não exibe na vitrine
  const isAluguel = imovel.modal === 'aluguel';
  const waMsg = encodeURIComponent(
    `Olá! Tenho interesse no imóvel "${imovel.titulo}" (${imovel.preco}${imovel.sufixo || ''}). Podemos conversar?`
  );
  const imgSrc = imovel.img || IMG_FALLBACK;
  const locLine = imovel.localizacao
    ? `<p class="prop-location">📍 ${imovel.localizacao}</p>` : '';
  return `
    <article class="property-card" role="listitem"
      data-modal="${imovel.modal}"
      data-tipo="${imovel.tipo}"
      data-quartos="${imovel.quartos}"
      data-preco="${imovel.precoNum}"
      data-aluguel-tipo="${imovel.aluguelTipo || ''}"
    >
      <div class="prop-img-wrap">
        <img src="${imgSrc}" alt="${imovel.imgAlt || imovel.titulo}" loading="lazy" width="600" height="375"
             onerror="this.onerror=null;this.src='${IMG_FALLBACK}';" />
        <span class="badge ${isAluguel ? 'badge-rent' : 'badge-sale'}">${isAluguel ? 'Para Alugar' : 'À Venda'}</span>
        ${imovel.tag ? `<span class="badge-top">${imovel.tag}</span>` : ''}
      </div>
      <div class="prop-body">
        <p class="prop-type">${ucFirst(imovel.tipo || '')}</p>
        <h3 class="prop-title">${imovel.titulo}</h3>
        ${locLine}
        <p class="prop-price">${imovel.preco}<small>${imovel.sufixo || ''}</small></p>
        <div class="prop-details">
          <span class="prop-detail">🛏 ${imovel.quartos} quarto${imovel.quartos !== 1 ? 's' : ''}</span>
          <span class="prop-detail">🚿 ${imovel.banheiros || 1} banheiro${(imovel.banheiros || 1) !== 1 ? 's' : ''}</span>
          <span class="prop-detail">📐 ${imovel.area || '—'}</span>
        </div>
        <div class="prop-footer">
          <a href="https://wa.me/${WA_NUM}?text=${waMsg}" target="_blank" rel="noopener" class="prop-btn prop-btn-wa">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.544 5.868L0 24l6.29-1.518A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.056-1.407l-.36-.215-3.733.9.943-3.634-.235-.374A9.818 9.818 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/></svg>
            WhatsApp
          </a>
          <a href="#contato" class="prop-btn prop-btn-info">Saiba mais</a>
        </div>
      </div>
    </article>`;
}

function ucFirst(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }

/* ── Render Grids ── */
function renderAllGrids() {
  // Grid principal (todos disponíveis)
  const mainGrid = document.getElementById('properties-grid');
  if (mainGrid) {
    mainGrid.innerHTML = IMOVEIS.map(renderCard).filter(Boolean).join('');
  }

  // Grid venda (extra, ignora os 2 primeiros de destaque)
  const vendaGrid = document.getElementById('venda-grid');
  if (vendaGrid) {
    const extras = IMOVEIS.filter(i => i.modal === 'venda' && i.status !== 'indisponivel').slice(2);
    vendaGrid.innerHTML = extras.map(renderCard).filter(Boolean).join('');
  }

  // Grid aluguel (permanente por padrão)
  const aluguelGrid = document.getElementById('aluguel-grid');
  if (aluguelGrid) {
    const perm = IMOVEIS.filter(i => i.modal === 'aluguel' && i.aluguelTipo === currentAluguelType && i.status !== 'indisponivel');
    aluguelGrid.innerHTML = perm.map(renderCard).filter(Boolean).join('');
  }

  // Atualiza contador
  const count = document.getElementById('results-count');
  const total = document.querySelectorAll('#properties-grid .property-card:not([hidden])').length ||
                document.querySelectorAll('#properties-grid .property-card').length;
  if (count) count.innerHTML = `Exibindo <strong>${total}</strong> imóve${total !== 1 ? 'is' : 'l'}`;
}

/* ── Filter ── */
function applyFilter(filterVal) {
  currentFilter = filterVal;
  const cards = document.querySelectorAll('#properties-grid .property-card');
  let visible = 0;
  cards.forEach(card => {
    const modal = card.dataset.modal;
    const tipo  = card.dataset.tipo;
    const match = filterVal === 'all' || filterVal === modal || filterVal === tipo;
    card.hidden = !match;
    if (match) visible++;
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
      const aa = parseInt(a.querySelector('.prop-detail:nth-child(3)')?.textContent || '0');
      const ab = parseInt(b.querySelector('.prop-detail:nth-child(3)')?.textContent || '0');
      return ab - aa;
    }
    return 0;
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
      const tipo  = document.getElementById('tipo-imovel')?.value || '';
      const target = document.getElementById('imoveis');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
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
  if (sortSel) sortSel.addEventListener('change', () => applySort(sortSel.value));
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
      currentAluguelType = tipo;
      const imoveis = IMOVEIS.filter(i => i.modal === 'aluguel' && i.aluguelTipo === tipo && i.status !== 'indisponivel');
      grid.innerHTML = imoveis.map(renderCard).filter(Boolean).join('');
    });
  });
}

/* ── Header scroll ── */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 60); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav    = document.getElementById('mobile-nav');
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
  nav.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', closeMenu));
}

/* ── Smooth anchor ── */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ── Remove progress bars ── */
function removeProgressBars() {
  ['#nprogress','.nprogress-bar','.progress-bar','.page-progress','.scroll-progress','.reading-progress','.loading-bar']
    .forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));
}

/* ═══════════════════════════════════════════════
   PAINEL ADMINISTRATIVO
═══════════════════════════════════════════════ */

let adminEditingId = null;
let pendingPhotoData = null;

/* ── Abrir/Fechar painel ── */
function openAdmin() {
  const overlay = document.getElementById('admin-overlay');
  if (!overlay) return;
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  showAdminListView();
  renderAdminList();
}
window.openAdmin = openAdmin;

function closeAdmin() {
  const overlay = document.getElementById('admin-overlay');
  if (!overlay) return;
  overlay.hidden = true;
  document.body.style.overflow = '';
}
window.closeAdmin = closeAdmin;

function showAdminListView() {
  const lv = document.getElementById('admin-list-view');
  const fv = document.getElementById('admin-form-view');
  if (lv) lv.hidden = false;
  if (fv) fv.hidden = true;
}

function showAdminFormView() {
  const lv = document.getElementById('admin-list-view');
  const fv = document.getElementById('admin-form-view');
  if (lv) lv.hidden = true;
  if (fv) fv.hidden = false;
  fv?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Renderizar lista do painel ── */
function renderAdminList() {
  const tbody = document.getElementById('admin-table-body');
  const countEl = document.getElementById('admin-count');
  if (!tbody) return;
  if (countEl) countEl.textContent = IMOVEIS.length;

  if (!IMOVEIS.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="admin-empty">Nenhum imóvel cadastrado. <button class="admin-link-btn" onclick="openForm(null)">Cadastrar o primeiro →</button></td></tr>`;
    return;
  }

  tbody.innerHTML = IMOVEIS.map(im => {
    const finalidade = im.modal === 'venda' ? 'Venda' :
                       im.aluguelTipo === 'temporada' ? 'Temporada' : 'Aluguel';
    const badgeClass = im.modal === 'venda' ? 'abadge-venda' :
                       im.aluguelTipo === 'temporada' ? 'abadge-temp' : 'abadge-aluguel';
    const imgSrc = im.img || IMG_FALLBACK;
    const status = im.status || 'disponivel';
    const statusLabel = status === 'disponivel' ? 'Disponível' : 'Indisponível';
    const statusClass = status === 'disponivel' ? 'astatus-ok' : 'astatus-off';

    return `<tr>
      <td class="atd-foto">
        <div class="admin-thumb-wrap">
          <img class="admin-thumb" src="${imgSrc}" alt="${im.titulo}"
               onerror="this.onerror=null;this.src='${IMG_FALLBACK}';" loading="lazy" />
        </div>
      </td>
      <td class="atd-titulo">
        <strong>${im.titulo}</strong>
        ${im.localizacao ? `<small>${im.localizacao}</small>` : ''}
      </td>
      <td><span class="abadge ${badgeClass}">${finalidade}</span></td>
      <td>${ucFirst(im.tipo || '')}</td>
      <td class="atd-preco">${im.preco || '—'}${im.sufixo || ''}</td>
      <td style="text-align:center">${im.quartos ?? '—'}</td>
      <td><span class="astatus ${statusClass}">${statusLabel}</span></td>
      <td class="atd-acoes">
        <button class="abtn-edit" onclick="openForm(${im.id})">✏️ Editar</button>
        <button class="abtn-delete" onclick="deleteImovel(${im.id})">🗑️ Excluir</button>
      </td>
    </tr>`;
  }).join('');
}

/* ── Abrir formulário ── */
function openForm(id) {
  adminEditingId = id ?? null;
  pendingPhotoData = null;

  const formTitle = document.getElementById('admin-form-title');
  const form = document.getElementById('admin-imovel-form');
  if (!form) return;

  form.reset();
  document.getElementById('form-id').value = id ?? '';
  clearPhotoPreview();

  if (id !== null && id !== undefined) {
    const im = IMOVEIS.find(i => i.id === id);
    if (!im) return;

    if (formTitle) formTitle.textContent = 'Editar Imóvel';

    document.getElementById('form-titulo').value      = im.titulo || '';
    document.getElementById('form-tipo').value        = im.tipo || '';
    document.getElementById('form-status').value      = im.status || 'disponivel';
    document.getElementById('form-preco').value       = im.preco || '';
    document.getElementById('form-sufixo').value      = im.sufixo || '';
    document.getElementById('form-area').value        = im.area || '';
    document.getElementById('form-quartos').value     = im.quartos ?? '';
    document.getElementById('form-banheiros').value   = im.banheiros ?? '';
    document.getElementById('form-vagas').value       = im.vagas ?? '';
    document.getElementById('form-localizacao').value = im.localizacao || '';
    document.getElementById('form-descricao').value   = im.descricao || '';
    document.getElementById('form-destaque').value    = im.tag || '';

    // Finalidade
    let finalidade = 'venda';
    if (im.modal === 'aluguel') {
      finalidade = im.aluguelTipo === 'temporada' ? 'temporada' : 'aluguel';
    }
    document.getElementById('form-finalidade').value = finalidade;

    // Foto
    if (im.img) {
      pendingPhotoData = im.img;
      updatePhotoPreview(im.img);
    }
  } else {
    if (formTitle) formTitle.textContent = 'Novo Imóvel';
  }

  showAdminFormView();
}
window.openForm = openForm;

/* ── Preview de foto ── */
function updatePhotoPreview(src) {
  const preview = document.getElementById('photo-preview');
  if (!preview) return;
  preview.innerHTML = `
    <img src="${src}" alt="Pré-visualização" onerror="this.onerror=null;this.parentElement.innerHTML='<span class=\\'photo-placeholder\\'>❌ Imagem não carregou</span>'" />
    <button type="button" class="photo-remove-btn" onclick="clearPhotoPreview()" title="Remover foto">✕</button>`;
}

function clearPhotoPreview() {
  const preview = document.getElementById('photo-preview');
  if (preview) preview.innerHTML = `<span class="photo-placeholder">📷 Pré-visualização da foto</span>`;
  pendingPhotoData = null;
  const fileInput = document.getElementById('form-foto-file');
  if (fileInput) fileInput.value = '';
}
window.clearPhotoPreview = clearPhotoPreview;

/* ── Redimensionar imagem ── */
function resizeImageFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('O arquivo não é uma imagem válida.')); return;
    }
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error('A imagem é muito grande (máx. 8 MB). Escolha uma menor ou use URL.')); return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_W = 900, MAX_H = 600;
        let w = img.width, h = img.height;
        if (w > MAX_W || h > MAX_H) {
          const ratio = Math.min(MAX_W / w, MAX_H / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.onerror = () => reject(new Error('Erro ao processar a imagem.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
    reader.readAsDataURL(file);
  });
}

/* ── Salvar imóvel ── */
async function handleFormSubmit(e) {
  e.preventDefault();
  clearFormError();

  const titulo      = document.getElementById('form-titulo').value.trim();
  const finalidade  = document.getElementById('form-finalidade').value;
  const tipo        = document.getElementById('form-tipo').value;
  const status      = document.getElementById('form-status').value;
  const preco       = document.getElementById('form-preco').value.trim();
  const sufixo      = document.getElementById('form-sufixo').value.trim();
  const area        = document.getElementById('form-area').value.trim();
  const quartos     = parseInt(document.getElementById('form-quartos').value) || 0;
  const banheiros   = parseInt(document.getElementById('form-banheiros').value) || 0;
  const vagas       = parseInt(document.getElementById('form-vagas').value) || 0;
  const localizacao = document.getElementById('form-localizacao').value.trim();
  const descricao   = document.getElementById('form-descricao').value.trim();
  const tag         = document.getElementById('form-destaque').value.trim();
  const urlField    = document.getElementById('form-foto-url').value.trim();

  if (!titulo)     { showFormError('Informe o título do imóvel.'); return; }
  if (!finalidade) { showFormError('Selecione a finalidade (venda/aluguel/temporada).'); return; }
  if (!tipo)       { showFormError('Selecione o tipo de imóvel.'); return; }
  if (!preco)      { showFormError('Informe o preço.'); return; }

  // Foto
  let imgSrc = pendingPhotoData || urlField || IMG_FALLBACK;
  if (urlField && !pendingPhotoData) imgSrc = urlField;

  // Mapeamento finalidade → modal/aluguelTipo
  let modal, aluguelTipo;
  if (finalidade === 'venda')      { modal = 'venda';   aluguelTipo = null; }
  else if (finalidade === 'temporada') { modal = 'aluguel'; aluguelTipo = 'temporada'; }
  else                             { modal = 'aluguel'; aluguelTipo = 'permanente'; }

  const precoNum = parseInt(preco.replace(/[^0-9]/g, '')) || 0;

  const imovelData = {
    id:          adminEditingId || Date.now(),
    modal, aluguelTipo, tipo, titulo, preco, precoNum,
    sufixo:      sufixo || (modal === 'aluguel' ? '/mês' : ''),
    area:        area || '—',
    quartos, banheiros, vagas,
    localizacao, descricao,
    tag:         tag || null,
    img:         imgSrc,
    imgAlt:      titulo,
    status
  };

  let arr = [...IMOVEIS];
  if (adminEditingId) {
    const idx = arr.findIndex(i => i.id === adminEditingId);
    if (idx >= 0) arr[idx] = imovelData;
    else arr.push(imovelData);
  } else {
    arr.push(imovelData);
  }

  // Tenta salvar; se falhar por quota, tenta sem a imagem
  let saved = saveImoveis(arr);
  if (!saved) {
    const fallback = {...imovelData, img: IMG_FALLBACK};
    const arr2 = adminEditingId
      ? arr.map(i => i.id === adminEditingId ? fallback : i)
      : [...IMOVEIS, fallback];
    saved = saveImoveis(arr2);
    if (!saved) {
      showFormError('Não foi possível salvar. Armazenamento do navegador cheio. Tente limpar dados antigos.');
      return;
    }
    arr = arr2;
    alert('⚠️ A imagem não pôde ser salva (armazenamento cheio). O imóvel foi salvo sem foto.');
  }

  IMOVEIS = arr;
  renderAllGrids();
  applyFilter(currentFilter || 'all');
  showAdminListView();
  renderAdminList();
  showAdminToast(adminEditingId ? '✅ Imóvel atualizado!' : '✅ Imóvel cadastrado!');
}

/* ── Excluir imóvel ── */
function deleteImovel(id) {
  const im = IMOVEIS.find(i => i.id === id);
  if (!im) return;
  if (!confirm(`Excluir "${im.titulo}"?\n\nO imóvel será removido da vitrine pública.`)) return;

  const arr = IMOVEIS.filter(i => i.id !== id);
  saveImoveis(arr);
  IMOVEIS = arr;
  renderAllGrids();
  applyFilter(currentFilter || 'all');
  renderAdminList();
  showAdminToast('🗑️ Imóvel excluído.');
}
window.deleteImovel = deleteImovel;

/* ── Restaurar demo ── */
function restoreDemo() {
  if (!confirm('Restaurar imóveis de demonstração?\n\nIsso substituirá todos os imóveis cadastrados pelos dados de exemplo originais.')) return;
  const arr = IMOVEIS_DEMO.map(i => ({...i}));
  saveImoveis(arr);
  IMOVEIS = arr;
  renderAllGrids();
  applyFilter('all');
  document.querySelectorAll('.filter-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.filterModal === 'all');
  });
  renderAdminList();
  showAdminToast('🔄 Dados de demonstração restaurados!');
}
window.restoreDemo = restoreDemo;

/* ── Mensagens ── */
function showFormError(msg) {
  const el = document.getElementById('form-error');
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function clearFormError() {
  const el = document.getElementById('form-error');
  if (el) { el.textContent = ''; el.hidden = true; }
}
function showAdminToast(msg) {
  const toast = document.getElementById('admin-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ── Init Admin ── */
function initAdmin() {
  // Botões de abertura (header + mobile)
  document.querySelectorAll('[data-open-admin]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openAdmin();
      // Fecha menu mobile se aberto
      const mobileNav = document.getElementById('mobile-nav');
      if (mobileNav && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.getElementById('menu-toggle')?.classList.remove('open');
        document.getElementById('menu-toggle')?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Fechar overlay
  document.getElementById('admin-close-btn')?.addEventListener('click', closeAdmin);
  document.getElementById('admin-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'admin-overlay') closeAdmin();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const overlay = document.getElementById('admin-overlay');
      if (overlay && !overlay.hidden) closeAdmin();
    }
  });

  // Botões do painel
  document.getElementById('btn-novo-imovel')?.addEventListener('click', () => openForm(null));
  document.getElementById('btn-restore-demo')?.addEventListener('click', restoreDemo);
  document.getElementById('btn-back-to-list')?.addEventListener('click', showAdminListView);
  document.getElementById('btn-cancel-form')?.addEventListener('click', showAdminListView);

  // Submit do formulário
  document.getElementById('admin-imovel-form')?.addEventListener('submit', handleFormSubmit);

  // Upload de foto
  document.getElementById('form-foto-file')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const loadEl = document.getElementById('photo-loading');
    const previewEl = document.getElementById('photo-preview');
    if (loadEl) loadEl.hidden = false;
    if (previewEl) previewEl.innerHTML = `<span class="photo-placeholder">⏳ Processando imagem…</span>`;
    try {
      const dataUrl = await resizeImageFromFile(file);
      pendingPhotoData = dataUrl;
      updatePhotoPreview(dataUrl);
      document.getElementById('form-foto-url').value = '';
    } catch (err) {
      alert('Erro: ' + err.message);
      clearPhotoPreview();
    } finally {
      if (loadEl) loadEl.hidden = true;
      e.target.value = '';
    }
  });

  // URL de foto
  document.getElementById('form-foto-url')?.addEventListener('blur', (e) => {
    const url = e.target.value.trim();
    if (url) {
      pendingPhotoData = url;
      updatePhotoPreview(url);
    }
  });
}

/* ── Init geral ── */
document.addEventListener('DOMContentLoaded', () => {
  removeProgressBars();
  renderAllGrids();
  applyFilter('all');
  initHeroSearch();
  initFilterTabs();
  initAluguelTabs();
  initHeader();
  initMobileMenu();
  initSmoothAnchors();
  initAdmin();
});

window.addEventListener('load', removeProgressBars);
