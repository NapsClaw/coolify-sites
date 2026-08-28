/* ============================================================
   CAMINHADA FISIOT POR ELAS — Script Principal
   Versão: 20260826r19 (oferta camiseta R$50 + Bellamama R$30,
   PIX oficial do IREFIS com botão copiar chave, WhatsApp
   de atendimento confirmado — Wilson Barbosa)
   ============================================================ */

/* --- WhatsApp helper (Wilson Barbosa — (31) 99259-4953) ---- */
const WA_NUM  = '553192594953';
const WA_BASE = 'https://wa.me/' + WA_NUM + '?text=';
function waLink(msg) { return WA_BASE + encodeURIComponent(msg); }

/* --- Modal Controls --------------------------------------- */
function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const first = overlay.querySelector('button, input, select, textarea, a[href]');
    if (first) first.focus();
  }, 100);
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Fecha modal ao clicar no overlay
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) closeModal(this.id);
  });
});

// Fecha modal com Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(o => closeModal(o.id));
  }
});

/* --- Seleção de opção (radio estilizado) ------------------- */
function selectOpcao(el, group) {
  document.querySelectorAll(`[onclick*="${group}"]`).forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

/* ============================================================
   OFERTA — Camiseta (R$50) e Produtos Bellamama (R$30 cada)
   Pagamento pelo PIX do IREFIS · comprovante via WhatsApp Wilson
   ============================================================ */

const BELLAMAMA_LABELS = {
  pes:          'Hidratante para os Pés (Manteiga de Cacau)',
  maos:         'Hidratante para as Mãos',
  facial:       'Hidratante Facial',
  corporal:     'Hidratante Corporal',
  antioxidante: 'Antioxidante',
};

/* --- Abre o modal de produtos já com um tipo pré-selecionado - */
function openProdutoModal(tipo) {
  openModal('modal-produtos');
  toggleProdutoTipo(tipo);
}

/* --- Alterna entre os campos de Camiseta e Bellamama --------- */
function toggleProdutoTipo(tipo) {
  const radio = document.querySelector(`input[name="produto-tipo"][value="${tipo}"]`);
  if (radio) radio.checked = true;

  document.querySelectorAll('#tipo-card-camiseta, #tipo-card-bellamama').forEach(card => {
    card.classList.toggle('selected', card.id === `tipo-card-${tipo}`);
  });

  const campoCamiseta  = document.getElementById('campo-camiseta');
  const campoBellamama = document.getElementById('campo-bellamama');
  if (campoCamiseta)  campoCamiseta.style.display  = tipo === 'camiseta'  ? 'block' : 'none';
  if (campoBellamama) campoBellamama.style.display = tipo === 'bellamama' ? 'block' : 'none';

  atualizarTotalProduto();
}

/* --- Recalcula e exibe o total a pagar pelo PIX --------------- */
function atualizarTotalProduto() {
  const tipo = document.querySelector('input[name="produto-tipo"]:checked')?.value;
  const box  = document.getElementById('produto-total-box');
  const val  = document.getElementById('produto-total-valor');
  if (!box || !val) return;

  if (!tipo) { box.style.display = 'none'; return; }

  let total = 0;
  if (tipo === 'camiseta') {
    total = 50;
  } else if (tipo === 'bellamama') {
    const qtd = parseInt(document.getElementById('prod-qtd')?.value || '1', 10);
    total = 30 * qtd;
  }

  val.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
  box.style.display = 'flex';
}

/* --- Finalizar compra: valida, monta mensagem e abre WhatsApp - */
function finalizarProduto() {
  const tipo = document.querySelector('input[name="produto-tipo"]:checked')?.value;
  const nome = document.getElementById('prod-nome')?.value.trim();

  if (!tipo) {
    alert('Por favor, escolha o que você quer comprar: Camiseta ou Bellamama.');
    return;
  }
  if (!nome) {
    alert('Por favor, informe seu nome para continuar.');
    document.getElementById('prod-nome')?.focus();
    return;
  }

  let resumo = '';
  let waMsg  = '';
  let total  = 0;

  if (tipo === 'camiseta') {
    const tamanho = document.getElementById('prod-tamanho')?.value;
    if (!tamanho) {
      alert('Por favor, selecione o tamanho da camiseta.');
      document.getElementById('prod-tamanho')?.focus();
      return;
    }
    total  = 50;
    resumo = `👕 Camiseta · Tamanho ${tamanho}`;
    waMsg =
      `Olá, Wilson! Já paguei pelo PIX do IREFIS a minha camiseta oficial da 1ª Caminhada FISIOT por Elas (R$50,00) e estou enviando o comprovante.\n` +
      `👤 Nome: ${nome}\n` +
      `👕 Tamanho: ${tamanho}\n` +
      `📍 Ciente da retirada presencial e mediante agendamento na Clínica FISIOT — Rua Dr. Benjamin Vieira, 27, bairro Joana D'Arc, Lagoa Santa/MG.\n` +
      `Segue o comprovante em anexo. Pode confirmar e agendar a retirada?`;
  } else {
    const opcao = document.querySelector('input[name="prod-bellamama"]:checked')?.value;
    const qtd   = parseInt(document.getElementById('prod-qtd')?.value || '1', 10);
    if (!opcao) {
      alert('Por favor, escolha o produto Bellamama (pés, mãos, facial, corporal ou antioxidante).');
      return;
    }
    total  = 30 * qtd;
    resumo = `🌿 Bellamama · ${BELLAMAMA_LABELS[opcao] || opcao} · Qtd: ${qtd}`;
    waMsg =
      `Olá, Wilson! Já paguei pelo PIX do IREFIS meu(s) produto(s) Bellamama (R$30,00 cada) e estou enviando o comprovante.\n` +
      `👤 Nome: ${nome}\n` +
      `🌿 Produto: ${BELLAMAMA_LABELS[opcao] || opcao}\n` +
      `🔢 Quantidade: ${qtd}\n` +
      `💰 Total pago: R$ ${total.toFixed(2).replace('.', ',')}\n` +
      `📍 Ciente da retirada presencial e mediante agendamento na Clínica FISIOT — Rua Dr. Benjamin Vieira, 27, bairro Joana D'Arc, Lagoa Santa/MG. Sujeito à disponibilidade de estoque.\n` +
      `Segue o comprovante em anexo. Pode confirmar e agendar a retirada?`;
  }

  if (confirm(
    `✅ Dados registrados!\n\n` +
    `👤 ${nome}\n${resumo}\n` +
    `💰 Total pelo PIX do IREFIS: R$ ${total.toFixed(2).replace('.', ',')}\n\n` +
    `📍 RETIRADA PRESENCIAL na Clínica FISIOT\n` +
    `Rua Dr. Benjamin Vieira, 27, bairro Joana D'Arc, Lagoa Santa/MG.\n` +
    `(Não há entrega em domicílio.)\n\n` +
    `Clique OK para enviar o comprovante pelo WhatsApp de Wilson Barbosa (31) 99259-4953.`
  )) {
    window.open(waLink(waMsg), '_blank', 'noopener,noreferrer');
  }
}

/* --- Copiar chave PIX do IREFIS ------------------------------- */
function copyPixKey(btn) {
  const key = btn?.getAttribute('data-pix-key') || '(31) 98055-0930';
  const done = () => {
    const original = btn.textContent;
    btn.textContent = '✅ Chave copiada!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 2200);
  };
  const fallbackCopy = () => {
    try {
      const ta = document.createElement('textarea');
      ta.value = key;
      ta.style.position = 'fixed';
      ta.style.opacity  = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch (e) {
      alert('Não foi possível copiar automaticamente. Chave PIX do IREFIS: ' + key);
    }
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(key).then(done).catch(fallbackCopy);
  } else {
    fallbackCopy();
  }
}

/* --- Raspadinha: desbloquear ------------------------------ */
function unlockScratch() {
  const input = document.getElementById('scratch-code');
  const code  = input?.value.trim().toUpperCase();
  const error = document.getElementById('scratch-error');

  if (code === 'DEMO2024') {
    document.getElementById('scratch-locked').style.display   = 'none';
    document.getElementById('scratch-unlocked').style.display = 'block';
    initScratchCard();
    error.style.display = 'none';
  } else {
    error.style.display = 'block';
    input.classList.add('error');
    input.focus();
  }
}

/* --- Raspadinha: canvas ----------------------------------- */
let scratchInitialized = false;

function initScratchCard() {
  if (scratchInitialized) return;
  scratchInitialized = true;

  const canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0,   '#C0C0C0');
  grad.addColorStop(0.5, '#E8E8E8');
  grad.addColorStop(1,   '#A0A0A0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  for (let i = 0; i < 200; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 2 + 0.5,
      0, Math.PI * 2
    );
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(150,0,80,0.7)';
  ctx.font = 'bold 14px Montserrat, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎗️ RASPE AQUI 🎗️', canvas.width / 2, canvas.height / 2);

  ctx.globalCompositeOperation = 'destination-out';
  let isDrawing = false;

  function getPos(e, c) {
    const rect = c.getBoundingClientRect();
    const sx = c.width  / rect.width;
    const sy = c.height / rect.height;
    if (e.touches) {
      return { x: (e.touches[0].clientX - rect.left) * sx, y: (e.touches[0].clientY - rect.top) * sy };
    }
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  }

  function scratch(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.addEventListener('mousedown',  e => { isDrawing = true; const p = getPos(e, canvas); scratch(p.x, p.y); });
  canvas.addEventListener('mousemove',  e => { if (isDrawing) { const p = getPos(e, canvas); scratch(p.x, p.y); } });
  canvas.addEventListener('mouseup',    () => { isDrawing = false; });
  canvas.addEventListener('touchstart', e => { e.preventDefault(); isDrawing = true; const p = getPos(e, canvas); scratch(p.x, p.y); }, { passive: false });
  canvas.addEventListener('touchmove',  e => { e.preventDefault(); if (isDrawing) { const p = getPos(e, canvas); scratch(p.x, p.y); } }, { passive: false });
  canvas.addEventListener('touchend',   () => { isDrawing = false; });
}

/* --- Doação: finalizar e abrir WhatsApp ------------------- */
function finalizarDoacao() {
  const nome  = document.getElementById('doacao-nome')?.value.trim();
  const tel   = document.getElementById('doacao-tel')?.value.trim();
  const bella = document.querySelector('input[name="doacao-bella"]:checked')?.value;

  const bellaMapa = {
    pes:          'Hidratante para os Pés',
    maos:         'Hidratante para as Mãos',
    facial:       'Hidratante Facial',
    corporal:     'Hidratante Corporal',
    antioxidante: 'Antioxidante',
  };

  let msg = 'Olá, Wilson! Quero fazer uma doação voluntária de R$25,00 da 1ª Caminhada FISIOT por Elas e receber 1 produto Bellamama.';
  if (nome)  msg += `\n👤 Nome: ${nome}`;
  if (tel)   msg += `\n📞 WhatsApp: ${tel}`;
  if (bella) msg += `\n🌿 Produto preferido: ${bellaMapa[bella] || bella}`;
  msg += '\n📍 Ciente que a retirada do produto é presencial na Clínica FISIOT — Rua Dr. Benjamin Vieira, 27, bairro Joana D\'Arc, Lagoa Santa/MG.';
  msg += '\nPode me orientar sobre o pagamento e agendar a retirada?';

  window.open(waLink(msg), '_blank', 'noopener,noreferrer');
}

/* --- Parceiro: abrir WhatsApp com mensagem pré-preenchida - */
function enviarParceiro() {
  const empresa = document.querySelector('#modal-parceiro input[type="text"]')?.value.trim();
  const tel     = document.querySelector('#modal-parceiro input[type="tel"]')?.value.trim();
  const como    = document.querySelector('#modal-parceiro textarea')?.value.trim();

  let msg = 'Olá, Wilson! Tenho interesse em ser parceiro(a) da 1ª Caminhada FISIOT por Elas.';
  if (empresa) msg += `\n🏢 Empresa: ${empresa}`;
  if (tel)     msg += `\n📞 Contato: ${tel}`;
  if (como)    msg += `\n💬 Como posso ajudar: ${como}`;

  window.open(waLink(msg), '_blank', 'noopener,noreferrer');
}

/* --- Participação: preview de foto ----------------------- */
function previewFoto(input) {
  const preview = document.getElementById('foto-preview');
  const label   = document.getElementById('foto-upload-label');
  if (!input.files || !input.files[0]) return;

  const file   = input.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    if (preview) {
      preview.src          = e.target.result;
      preview.style.display = 'block';
    }
    if (label) label.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

/* --- Participação: storage helpers ----------------------- */
const PART_KEY   = 'fisiot_participacoes_demo_v1';
const MODERADOR  = 'Dra. Keila Marques';  // única moderadora autorizada

function getParticipacoes() {
  try {
    const arr = JSON.parse(localStorage.getItem(PART_KEY) || '[]');
    /* garante ID em todos os itens (retrocompatibilidade) */
    let changed = false;
    arr.forEach(p => {
      if (!p.id) {
        p.id = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        changed = true;
      }
    });
    if (changed) localStorage.setItem(PART_KEY, JSON.stringify(arr));
    return arr;
  } catch(e) { return []; }
}

function saveParticipacoes(arr) {
  try { localStorage.setItem(PART_KEY, JSON.stringify(arr)); } catch(e) { /* ignore */ }
}

function gerarId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 6);
}

/* --- Participação: enviar para moderação (demo) ----------- */
function enviarParticipacao() {
  const nome = document.getElementById('part-nome')?.value.trim();
  const msg  = document.getElementById('part-msg')?.value.trim();
  const auth = document.getElementById('part-auth')?.checked;

  if (!nome) {
    alert('Por favor, informe seu nome para continuar.');
    document.getElementById('part-nome')?.focus();
    return;
  }
  if (!msg) {
    alert('Por favor, escreva uma mensagem de apoio.');
    document.getElementById('part-msg')?.focus();
    return;
  }
  if (!auth) {
    alert('Para enviar, é necessário marcar a autorização de uso da foto e mensagem.');
    document.getElementById('part-auth')?.focus();
    return;
  }

  /* Salvar no localStorage (demonstração) */
  const participacoes = getParticipacoes();
  const preview = document.getElementById('foto-preview');
  participacoes.push({
    id:      gerarId(),
    nome,
    msg,
    foto:    preview && preview.src && preview.style.display !== 'none' ? preview.src : null,
    enviado: new Date().toISOString(),
    status:  'aguardando_aprovacao',
    noMural: false,
  });
  saveParticipacoes(participacoes);

  /* Mostra estado de sucesso */
  const formState = document.getElementById('participacao-form-state');
  const sucesso   = document.getElementById('participacao-sucesso');
  if (formState) formState.style.display = 'none';
  if (sucesso)   sucesso.style.display   = 'block';
}

/* --- Smooth scroll para âncoras -------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href === '#') return;
  link.addEventListener('click', function(e) {
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* --- Init ----------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(o => o.classList.remove('active'));
  renderPublicVideos();
  renderPublicMural();
});

/* ============================================================
   GESTÃO DE VÍDEOS — Equipe IREFIS
   Armazenamento: localStorage (demonstração)
   Versão final: login protegido + persistência em servidor
   ============================================================ */

const VIDEOS_STORAGE_KEY = 'fisiot_videos_demo_v1';

function getVideos() {
  try { return JSON.parse(localStorage.getItem(VIDEOS_STORAGE_KEY) || '[]'); }
  catch(e) { return []; }
}

function saveVideos(videos) {
  localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videos));
}

function parseVideoURL(url) {
  const str = (url || '').trim();

  // YouTube
  let m = str.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (m) {
    const id = m[1];
    return { type: 'youtube', id, embed: `https://www.youtube.com/embed/${id}?rel=0`, thumb: `https://img.youtube.com/vi/${id}/mqdefault.jpg` };
  }

  // Vimeo
  m = str.match(/vimeo\.com\/(?:[a-zA-Z0-9_-]+\/)*(\d+)/);
  if (m) {
    const id = m[1];
    return { type: 'vimeo', id, embed: `https://player.vimeo.com/video/${id}`, thumb: null };
  }

  return null;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Renderiza vídeos na área pública.
 *  Sem vídeos: exibe estado vazio compacto (com botão admin dentro).
 *  Com vídeos:  exibe grid + botão admin abaixo. */
function renderPublicVideos() {
  const section    = document.getElementById('videos');
  const navBtn     = document.getElementById('nav-videos-btn');
  const grid       = document.getElementById('videos-grid');
  const adminArea  = document.getElementById('videos-admin-area');
  if (!section || !grid) return;

  const videos = getVideos();

  if (videos.length === 0) {
    /* Sem vídeos publicados: a seção inteira e o atalho de navegação
       ficam ocultos (em vez de mostrar "vídeos em breve"). */
    section.style.display = 'none';
    if (navBtn) navBtn.style.display = 'none';
    grid.style.display = 'none';
    grid.innerHTML      = '';
    if (adminArea) adminArea.style.display = 'none';
    return;
  }

  section.style.display = '';
  if (navBtn) navBtn.style.display = '';
  grid.style.display = 'grid';
  if (adminArea) adminArea.style.display = 'block';

  grid.innerHTML = videos.map(v => `
    <div class="video-card">
      <div class="video-embed-wrapper">
        <iframe
          src="${v.embed}"
          title="${escapeHtml(v.title)}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
      <div class="video-card-info">
        <h4>${escapeHtml(v.title)}</h4>
        ${v.description ? `<p>${escapeHtml(v.description)}</p>` : ''}
      </div>
    </div>
  `).join('');
}

function renderAdminVideos() {
  const list = document.getElementById('admin-video-list');
  if (!list) return;

  const videos = getVideos();

  if (videos.length === 0) {
    list.innerHTML = '<p class="admin-no-videos">Nenhum vídeo cadastrado ainda. Use o formulário acima para adicionar o primeiro.</p>';
    return;
  }

  list.innerHTML = `
    <h4 style="margin-bottom:.7rem;">Vídeos cadastrados (${videos.length})</h4>
    ${videos.map((v, i) => `
      <div class="admin-video-item">
        <div class="admin-video-thumb">
          ${v.type === 'youtube' && v.thumb
            ? `<img src="${v.thumb}" alt="${escapeHtml(v.title)}" />`
            : `<div class="vimeo-thumb-ph">▶ Vimeo</div>`
          }
        </div>
        <div class="admin-video-meta">
          <strong>${escapeHtml(v.title)}</strong>
          ${v.description ? `<span>${escapeHtml(v.description)}</span>` : ''}
          <a href="${escapeHtml(v.url)}" target="_blank" rel="noopener noreferrer">
            🔗 Ver no ${v.type === 'youtube' ? 'YouTube' : 'Vimeo'}
          </a>
        </div>
        <button class="admin-remove-btn" onclick="adminRemoveVideo(${i})" aria-label="Remover ${escapeHtml(v.title)}">🗑️</button>
      </div>
    `).join('')}
  `;
}

function openAdminVideos() {
  openModal('modal-admin-videos');
  renderAdminVideos();
}

function adminAddVideo() {
  const titleEl = document.getElementById('adm-title');
  const descEl  = document.getElementById('adm-desc');
  const urlEl   = document.getElementById('adm-url');

  const title = titleEl?.value.trim();
  const desc  = descEl?.value.trim();
  const url   = urlEl?.value.trim();

  if (!title) { alert('Por favor, preencha o título do vídeo.'); titleEl?.focus(); return; }
  if (!url)   { alert('Por favor, insira o link do vídeo (YouTube ou Vimeo).'); urlEl?.focus(); return; }

  const parsed = parseVideoURL(url);
  if (!parsed) {
    alert(
      '❌ Link não reconhecido.\n\nUse um dos formatos:\n' +
      '• https://www.youtube.com/watch?v=CÓDIGO\n' +
      '• https://youtu.be/CÓDIGO\n' +
      '• https://vimeo.com/NÚMERO'
    );
    urlEl?.focus();
    return;
  }

  const videos = getVideos();
  videos.unshift({ title, description: desc, url, type: parsed.type, id: parsed.id, embed: parsed.embed, thumb: parsed.thumb, addedAt: new Date().toISOString() });
  saveVideos(videos);

  if (titleEl) titleEl.value = '';
  if (descEl)  descEl.value  = '';
  if (urlEl)   urlEl.value   = '';

  renderAdminVideos();
  renderPublicVideos();

  alert(`✅ Vídeo "${title}" adicionado! Ele já aparece na área pública.`);
}

function adminRemoveVideo(index) {
  const videos = getVideos();
  const v = videos[index];
  if (!v) return;
  if (!confirm(`Remover o vídeo "${v.title}"?\n\nEsta ação não pode ser desfeita.`)) return;
  videos.splice(index, 1);
  saveVideos(videos);
  renderAdminVideos();
  renderPublicVideos();
}

/* ============================================================
   MURAL PÚBLICO — "Quem já mostrou seu apoio"
   Exibe apenas os itens aprovados com noMural !== false.
   ============================================================ */

function renderPublicMural() {
  const grid  = document.getElementById('mural-grid');
  const empty = document.getElementById('mural-empty-state');
  if (!grid) return;

  const aprovados = getParticipacoes().filter(p =>
    p.status === 'aprovado' && p.noMural !== false
  );

  if (aprovados.length === 0) {
    if (empty) empty.style.display = 'block';
    grid.style.display = 'none';
    grid.innerHTML     = '';
    return;
  }

  if (empty) empty.style.display = 'none';
  grid.style.display = 'grid';

  grid.innerHTML = aprovados.map(p => `
    <div class="mural-card">
      <div class="mural-card-foto-wrap">
        ${p.foto
          ? `<img src="${p.foto}" alt="Foto de ${escapeHtml(p.nome)}" loading="lazy" />`
          : `<div class="mural-card-foto-placeholder" aria-hidden="true">🎗️</div>`
        }
      </div>
      <div class="mural-card-body">
        <div class="mural-card-nome">${escapeHtml(p.nome)}</div>
        ${p.msg ? `<div class="mural-card-msg">"${escapeHtml(p.msg)}"</div>` : ''}
        ${p.moderadoPor
          ? `<div class="mural-card-moderado">✅ Moderado por ${escapeHtml(p.moderadoPor)}</div>`
          : ''
        }
      </div>
    </div>
  `).join('');
}

/* ============================================================
   PAINEL DE MODERAÇÃO DE APOIOS — Equipe IREFIS
   Moderadora identificada: Dra. Keila Marques
   Persistência: localStorage (demonstração)
   ============================================================ */

let _currentApoiosTab = 'pendentes';

function openAdminApoios() {
  openModal('modal-admin-apoios');
  _currentApoiosTab = 'pendentes';
  _renderApoiosTab('pendentes');
}

function switchApoiosTab(tab) {
  _currentApoiosTab = tab;
  /* Atualiza visual dos botões de aba */
  document.querySelectorAll('.apoios-tab-btn').forEach(btn => {
    const active = btn.dataset.tab === tab;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  /* Exibe/oculta painéis */
  document.querySelectorAll('.apoios-tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === 'apoios-panel-' + tab);
  });
  /* Renderiza conteúdo da aba ativa */
  _renderApoiosTab(tab);
}

function _renderApoiosTab(tab) {
  const arr = getParticipacoes();

  const pendentes = arr.filter(p => p.status === 'aguardando_aprovacao');
  const aprovados = arr.filter(p => p.status === 'aprovado');
  const recusados = arr.filter(p => p.status === 'recusado');

  /* Atualiza badges */
  _setBadge('badge-pend',  pendentes.length);
  _setBadge('badge-aprov', aprovados.length);
  _setBadge('badge-recus', recusados.length);

  const panelEl = document.getElementById('apoios-panel-' + tab);
  if (!panelEl) return;

  const items = tab === 'pendentes' ? pendentes
              : tab === 'aprovados' ? aprovados
              : recusados;

  if (items.length === 0) {
    const msg = tab === 'pendentes'
      ? '✅ Nenhuma solicitação pendente de aprovação.'
      : tab === 'aprovados'
      ? '📋 Nenhum apoio aprovado ainda.<br><small>Quando aprovar um envio, ele aparecerá aqui e no mural público.</small>'
      : '📋 Nenhuma solicitação recusada.';
    panelEl.innerHTML = `<div class="apoios-empty-panel">${msg}</div>`;
    return;
  }

  panelEl.innerHTML = items.map(p => _apoioCardHtml(p, tab)).join('');
}

function _setBadge(id, count) {
  const el = document.getElementById(id);
  if (el) el.textContent = count;
}

function _fmtDate(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR') + ' às ' +
           d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch(e) { return iso; }
}

function _apoioCardHtml(p, tab) {
  const fotoHtml = p.foto
    ? `<img src="${p.foto}" alt="Foto de ${escapeHtml(p.nome)}" />`
    : `<div class="apoio-foto-placeholder" aria-hidden="true">🎗️</div>`;

  const moderadoHtml = p.moderadoPor
    ? `<div class="apoio-moderado-by">✅ Moderado por ${escapeHtml(p.moderadoPor)} · ${_fmtDate(p.moderadoEm)}</div>`
    : '';

  const retiradoHtml = (p.status === 'aprovado' && p.noMural === false)
    ? `<div class="apoio-retirado-badge">🚫 Retirado do mural</div>`
    : '';

  let actionsHtml = '';
  if (tab === 'pendentes') {
    actionsHtml = `
      <button class="btn-mod btn-aprovar" onclick="apoioAprovar('${p.id}')">✅ Aprovar</button>
      <button class="btn-mod btn-recusar" onclick="apoioRecusar('${p.id}')">❌ Recusar</button>
      <button class="btn-mod btn-excluir" onclick="apoioExcluir('${p.id}')">🗑️ Excluir</button>
    `;
  } else if (tab === 'aprovados') {
    const muralBtn = p.noMural !== false
      ? `<button class="btn-mod btn-retirar"  onclick="apoioRetirarMural('${p.id}')">⬇️ Retirar do mural</button>`
      : `<button class="btn-mod btn-ao-mural" onclick="apoioVoltarMural('${p.id}')">↩️ Colocar no mural</button>`;
    actionsHtml = `
      ${muralBtn}
      <button class="btn-mod btn-excluir" onclick="apoioExcluir('${p.id}')">🗑️ Excluir</button>
    `;
  } else { /* recusados */
    actionsHtml = `
      <button class="btn-mod btn-aprovar" onclick="apoioAprovar('${p.id}')">✅ Aprovar</button>
      <button class="btn-mod btn-excluir" onclick="apoioExcluir('${p.id}')">🗑️ Excluir</button>
    `;
  }

  return `
    <div class="apoio-card">
      <div class="apoio-foto-wrap">${fotoHtml}</div>
      <div class="apoio-card-body">
        <div class="apoio-nome">${escapeHtml(p.nome)}</div>
        ${p.msg ? `<div class="apoio-msg">"${escapeHtml(p.msg)}"</div>` : ''}
        <div class="apoio-meta">
          <span>📅 ${_fmtDate(p.enviado)}</span>
          <span class="apoio-auth-ok">✅ Autorização de uso: Sim</span>
        </div>
        ${moderadoHtml}
        ${retiradoHtml}
      </div>
      <div class="apoio-actions">${actionsHtml}</div>
    </div>
  `;
}

/* ─── Ações de moderação ───────────────────────────────── */

function apoioAprovar(id) {
  const arr = getParticipacoes();
  const idx = arr.findIndex(p => p.id === id);
  if (idx < 0) return;
  const nome = arr[idx].nome;
  arr[idx].status      = 'aprovado';
  arr[idx].noMural     = true;
  arr[idx].moderadoPor = MODERADOR;
  arr[idx].moderadoEm  = new Date().toISOString();
  saveParticipacoes(arr);
  _renderApoiosTab(_currentApoiosTab);
  renderPublicMural();
  alert(`✅ Apoio de ${nome} aprovado e publicado no mural!\n\nModerado por ${MODERADOR}.`);
}

function apoioRecusar(id) {
  const arr = getParticipacoes();
  const idx = arr.findIndex(p => p.id === id);
  if (idx < 0) return;
  const nome = arr[idx].nome;
  arr[idx].status      = 'recusado';
  arr[idx].noMural     = false;
  arr[idx].moderadoPor = MODERADOR;
  arr[idx].moderadoEm  = new Date().toISOString();
  saveParticipacoes(arr);
  _renderApoiosTab(_currentApoiosTab);
  alert(`❌ Apoio de ${nome} recusado. Não será publicado no mural.\n\nModerado por ${MODERADOR}.`);
}

function apoioExcluir(id) {
  const arr = getParticipacoes();
  const idx = arr.findIndex(p => p.id === id);
  if (idx < 0) return;
  const nome = arr[idx].nome;
  if (!confirm(`Excluir definitivamente o registro de ${nome}?\n\nEsta ação não pode ser desfeita.`)) return;
  arr.splice(idx, 1);
  saveParticipacoes(arr);
  _renderApoiosTab(_currentApoiosTab);
  renderPublicMural();
}

function apoioRetirarMural(id) {
  const arr = getParticipacoes();
  const idx = arr.findIndex(p => p.id === id);
  if (idx < 0) return;
  const nome = arr[idx].nome;
  arr[idx].noMural     = false;
  arr[idx].moderadoPor = MODERADOR;
  arr[idx].moderadoEm  = new Date().toISOString();
  saveParticipacoes(arr);
  _renderApoiosTab('aprovados');
  renderPublicMural();
  alert(`⬇️ Apoio de ${nome} retirado do mural.\nO registro permanece como "Aprovado" e pode ser recolocado.`);
}

function apoioVoltarMural(id) {
  const arr = getParticipacoes();
  const idx = arr.findIndex(p => p.id === id);
  if (idx < 0) return;
  const nome = arr[idx].nome;
  arr[idx].noMural     = true;
  arr[idx].moderadoPor = MODERADOR;
  arr[idx].moderadoEm  = new Date().toISOString();
  saveParticipacoes(arr);
  _renderApoiosTab('aprovados');
  renderPublicMural();
  alert(`↩️ Apoio de ${nome} restaurado no mural!`);
}

/* ─── Utilitário: inserir envio de teste (demo) ──────────── */
function inserirEnvioTeste() {
  const nomes = ['Ana Paula', 'Juliana', 'Cláudia', 'Fernanda', 'Mariana'];
  const msgs  = [
    'Eu apoio esta causa com todo o meu coração! Saúde é vida. 🎗️',
    'A prevenção salva vidas. Estarei na caminhada!',
    'Parabéns ao IREFIS por esta iniciativa tão importante!',
    'Juntas somos mais fortes. Outubro Rosa é para todas nós! 💗',
    'Eu vou participar e convidar todas as minhas amigas!',
  ];
  const arr  = getParticipacoes();
  const nome = nomes[arr.length % nomes.length];
  const msg  = msgs[arr.length % msgs.length];

  arr.push({
    id:      gerarId(),
    nome,
    msg,
    foto:    null,
    enviado: new Date().toISOString(),
    status:  'aguardando_aprovacao',
    noMural: false,
    _demo:   true,
  });
  saveParticipacoes(arr);
  _renderApoiosTab(_currentApoiosTab);
  alert(`✅ Envio de teste adicionado!\n\nNome: ${nome}\n\nAgora apareece na aba "Pendentes" para você testar Aprovar, Recusar ou Excluir.`);
}
