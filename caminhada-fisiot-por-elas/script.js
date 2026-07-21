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
});
