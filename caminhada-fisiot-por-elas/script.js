/* ============================================================
   CAMINHADA FISIOT POR ELAS — Script Principal
   ============================================================ */

/* --- Modal Controls --------------------------------------- */
function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  // focus first interactive element
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

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) closeModal(this.id);
  });
});

// Close on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(o => closeModal(o.id));
  }
});

/* --- Kit form: selecionar opção --------------------------- */
function selectOpcao(el, group) {
  document.querySelectorAll(`[onclick*="${group}"]`).forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

/* --- Kit: finalizar --------------------------------------- */
function finalizarKit() {
  const nome     = document.getElementById('kit-nome')?.value.trim();
  const tamanho  = document.getElementById('kit-tamanho')?.value;
  const acessorio = document.querySelector('input[name="acessorio"]:checked')?.value;

  if (!nome) {
    alert('Por favor, informe seu nome para continuar.');
    document.getElementById('kit-nome').focus();
    return;
  }
  if (!tamanho) {
    alert('Por favor, selecione o tamanho da camiseta.');
    document.getElementById('kit-tamanho').focus();
    return;
  }
  if (!acessorio) {
    alert('Por favor, escolha: Boné ou Viseira.');
    return;
  }

  alert(
    `✅ Pedido registrado!\n\n` +
    `👤 Nome: ${nome}\n` +
    `👕 Camiseta: ${tamanho}\n` +
    `🧢 Acessório: ${acessorio === 'bone' ? 'Boné' : 'Viseira'}\n\n` +
    `💳 Integração de pagamento em configuração.\n` +
    `A organização entrará em contato para finalizar seu kit.\n\n` +
    `(Prévia demonstrativa — nenhuma cobrança foi gerada)`
  );
}

/* --- Raspadinha: desbloquear ------------------------------ */
function unlockScratch() {
  const input = document.getElementById('scratch-code');
  const code  = input?.value.trim().toUpperCase();
  const error = document.getElementById('scratch-error');

  if (code === 'DEMO2024') {
    document.getElementById('scratch-locked').style.display    = 'none';
    document.getElementById('scratch-unlocked').style.display  = 'block';
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

  // Fill with silver gradient
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0,   '#C0C0C0');
  grad.addColorStop(0.5, '#E8E8E8');
  grad.addColorStop(1,   '#A0A0A0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add texture dots
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

  // Text on scratch layer
  ctx.fillStyle = 'rgba(150,0,80,0.7)';
  ctx.font = 'bold 14px Montserrat, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎗️ RASPE AQUI 🎗️', canvas.width / 2, canvas.height / 2);

  // Scrape logic
  ctx.globalCompositeOperation = 'destination-out';
  let isDrawing = false;

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top)  * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top)  * scaleY,
    };
  }

  function scratch(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(...Object.values(getPos(e, canvas))); });
  canvas.addEventListener('mousemove', (e) => { if (isDrawing) scratch(...Object.values(getPos(e, canvas))); });
  canvas.addEventListener('mouseup',   () => { isDrawing = false; });
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; scratch(...Object.values(getPos(e, canvas))); }, { passive: false });
  canvas.addEventListener('touchmove',  (e) => { e.preventDefault(); if (isDrawing) scratch(...Object.values(getPos(e, canvas))); }, { passive: false });
  canvas.addEventListener('touchend',   () => { isDrawing = false; });
}

/* --- Smooth scroll for anchor buttons --------------------- */
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

/* --- WhatsApp pending notice in alert --------------------- */
document.querySelectorAll('a[href="#whatsapp-pendente"]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    openModal('modal-wa');
  });
});

/* --- Init: ensure no modals visible on load --------------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(o => o.classList.remove('active'));
  renderPublicVideos();
});

/* ============================================================
   GESTÃO DE VÍDEOS — Equipe IREFIS
   Armazenamento: localStorage (demonstração local)
   Versão final: login protegido + persistência compartilhada
   ============================================================ */

const VIDEOS_STORAGE_KEY = 'fisiot_videos_demo_v1';

/** Lê vídeos salvos no localStorage */
function getVideos() {
  try {
    return JSON.parse(localStorage.getItem(VIDEOS_STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

/** Salva vídeos no localStorage */
function saveVideos(videos) {
  localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videos));
}

/**
 * Extrai embed URL de links YouTube / Vimeo.
 * Retorna { type, id, embed } ou null se inválido.
 */
function parseVideoURL(url) {
  const str = (url || '').trim();

  // YouTube: youtube.com/watch?v=ID  ou  youtu.be/ID
  let m = str.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (m) {
    const id = m[1];
    return {
      type: 'youtube',
      id,
      embed: `https://www.youtube.com/embed/${id}?rel=0`,
      thumb: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
    };
  }

  // Vimeo: vimeo.com/ID  ou  vimeo.com/channels/…/ID  ou  vimeo.com/groups/…/videos/ID
  m = str.match(/vimeo\.com\/(?:[a-zA-Z0-9_-]+\/)*(\d+)/);
  if (m) {
    const id = m[1];
    return {
      type: 'vimeo',
      id,
      embed: `https://player.vimeo.com/video/${id}`,
      thumb: null,
    };
  }

  return null;
}

/** Escapa HTML para evitar XSS em innerHTML dinâmico */
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Renderiza vídeos na área pública */
function renderPublicVideos() {
  const emptyState = document.getElementById('videos-empty-state');
  const grid       = document.getElementById('videos-grid');
  if (!emptyState || !grid) return;

  const videos = getVideos();

  if (videos.length === 0) {
    emptyState.style.display = 'block';
    grid.style.display = 'none';
    grid.innerHTML = '';
    return;
  }

  emptyState.style.display = 'none';
  grid.style.display = 'grid';
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

/** Renderiza lista no painel admin */
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
        <button class="admin-remove-btn" onclick="adminRemoveVideo(${i})" aria-label="Remover vídeo ${escapeHtml(v.title)}">🗑️</button>
      </div>
    `).join('')}
  `;
}

/** Abre painel admin e carrega lista */
function openAdminVideos() {
  openModal('modal-admin-videos');
  renderAdminVideos();
}

/** Adiciona vídeo via formulário admin */
function adminAddVideo() {
  const titleEl = document.getElementById('adm-title');
  const descEl  = document.getElementById('adm-desc');
  const urlEl   = document.getElementById('adm-url');

  const title = titleEl?.value.trim();
  const desc  = descEl?.value.trim();
  const url   = urlEl?.value.trim();

  if (!title) {
    alert('Por favor, preencha o título do vídeo.');
    titleEl?.focus();
    return;
  }
  if (!url) {
    alert('Por favor, insira o link do vídeo (YouTube ou Vimeo).');
    urlEl?.focus();
    return;
  }

  const parsed = parseVideoURL(url);
  if (!parsed) {
    alert(
      '❌ Link não reconhecido.\n\n' +
      'Use um dos formatos abaixo:\n' +
      '• https://www.youtube.com/watch?v=CÓDIGO\n' +
      '• https://youtu.be/CÓDIGO\n' +
      '• https://vimeo.com/NÚMERO'
    );
    urlEl?.focus();
    return;
  }

  const videos = getVideos();
  videos.unshift({
    title,
    description: desc,
    url,
    type:    parsed.type,
    id:      parsed.id,
    embed:   parsed.embed,
    thumb:   parsed.thumb,
    addedAt: new Date().toISOString(),
  });
  saveVideos(videos);

  // Limpa formulário
  if (titleEl) titleEl.value = '';
  if (descEl)  descEl.value  = '';
  if (urlEl)   urlEl.value   = '';

  renderAdminVideos();
  renderPublicVideos();

  alert(`✅ Vídeo "${title}" adicionado!\nEle já aparece na área pública de vídeos.`);
}

/** Remove vídeo por índice */
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
