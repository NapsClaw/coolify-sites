// ===== NAVIGATION =====
const navItems = document.querySelectorAll('.nav-item[data-page]');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');

const pageTitles = {
  overview: 'Visão Geral',
  reservas: 'Reservas',
  imoveis: 'Imóveis',
  calendario: 'Calendário',
  mensagens: 'Mensagens',
  faturamento: 'Faturamento'
};

function switchPage(pageId) {
  pages.forEach(p => p.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));
  
  const target = document.getElementById('page-' + pageId);
  const navEl = document.querySelector('.nav-item[data-page="' + pageId + '"]');
  
  if (target) target.classList.add('active');
  if (navEl) navEl.classList.add('active');
  if (pageTitle) pageTitle.textContent = pageTitles[pageId] || pageId;

  // Init charts when switching to those pages
  if (pageId === 'overview') setTimeout(drawRevenueChart, 50);
  if (pageId === 'faturamento') setTimeout(drawBillingChart, 50);
  if (pageId === 'calendario') buildCalendar();
}

navItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const page = item.dataset.page;
    if (page) switchPage(page);
    if (sidebar.classList.contains('open')) closeSidebar();
  });
});

// Card links
document.querySelectorAll('.card-link[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    switchPage(link.dataset.page);
  });
});

// ===== SIDEBAR TOGGLE (mobile) =====
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
}

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
  });
}
if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', closeSidebar);
}

// ===== FILTER TABS =====
document.querySelectorAll('.filter-tabs').forEach(group => {
  group.querySelectorAll('.ftab').forEach(tab => {
    tab.addEventListener('click', () => {
      group.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
});

// ===== CALENDAR =====
function buildCalendar() {
  const grid = document.getElementById('calGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const occupied = [18, 19, 20, 21, 22, 25, 26, 27, 28, 29, 30];
  const pending = [20, 21, 22, 23];
  const blocked = [10, 11, 12];

  // Header
  const header = document.createElement('div');
  header.className = 'cal-week-header';
  ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].forEach(d => {
    const s = document.createElement('span');
    s.textContent = d;
    header.appendChild(s);
  });
  grid.appendChild(header);

  const daysDiv = document.createElement('div');
  daysDiv.className = 'cal-days';

  // May 2025 starts on Thursday (day index 4)
  const startDay = 4; // Thursday
  const daysInMonth = 31;
  const prevDays = [27, 28, 29, 30];

  prevDays.forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = d;
    daysDiv.appendChild(el);
  });

  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;
    if (d === 15) el.classList.add('today');
    else if (pending.includes(d) && !occupied.includes(d)) el.classList.add('pending');
    else if (occupied.includes(d)) el.classList.add('occupied');
    else if (blocked.includes(d)) el.classList.add('blocked');
    daysDiv.appendChild(el);
  }

  // Fill remaining
  const total = startDay + daysInMonth;
  const remainder = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= remainder; d++) {
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = d;
    daysDiv.appendChild(el);
  }

  grid.appendChild(daysDiv);
}

// ===== CHARTS =====
function drawChart(canvasId, data, labels, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 600;
  const H = canvas.offsetHeight || 200;
  canvas.width = W;
  canvas.height = H;

  const pad = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const max = Math.max(...data) * 1.15;
  const barW = chartW / data.length * 0.55;
  const gap = chartW / data.length;

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();
    const val = Math.round(max - (max / 4) * i);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('R$' + (val >= 1000 ? (val/1000).toFixed(1) + 'k' : val), pad.left - 6, y + 4);
  }

  // Bars
  data.forEach((val, i) => {
    const x = pad.left + gap * i + gap / 2 - barW / 2;
    const barH = (val / max) * chartH;
    const y = pad.top + chartH - barH;

    // Gradient
    const grad = ctx.createLinearGradient(0, y, 0, y + barH);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);

    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
    ctx.fillStyle = grad;
    ctx.fill();

    // Label
    ctx.fillStyle = '#64748B';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barW / 2, H - 8);

    // Value on top
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText('R$' + (val >= 1000 ? (val/1000).toFixed(1) + 'k' : val), x + barW / 2, y - 5);
  });
}

function drawRevenueChart() {
  drawChart(
    'revenueChart',
    [4200, 5100, 6800, 7200, 9100, 8240],
    ['Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    ['#0EA5E9', '#7DD3FC']
  );
}

function drawBillingChart() {
  drawChart(
    'billingChart',
    [5100, 6200, 5800, 7900, 7500, 8890],
    ['Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    ['#10B981', '#6EE7B7']
  );
}

// ===== CHAT SEND =====
const chatInput = document.querySelector('.chat-input');
const sendBtn = document.querySelector('.send-btn');
const chatMessages = document.querySelector('.chat-messages');

function sendMessage() {
  if (!chatInput || !chatInput.value.trim()) return;
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble sent';
  bubble.innerHTML = '<p>' + chatInput.value + '</p><span class="msg-ts">Agora</span>';
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  chatInput.value = '';
}

if (sendBtn) sendBtn.addEventListener('click', sendMessage);
if (chatInput) {
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
  });
}

// ===== INIT =====
window.addEventListener('load', () => {
  drawRevenueChart();
  buildCalendar();
});

window.addEventListener('resize', () => {
  drawRevenueChart();
  drawBillingChart();
});
