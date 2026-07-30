/* ==========================================================================
   OGS DECOR — utilidades de UI compartilhadas (PREVIEW)
   ========================================================================== */

const ESP_LABEL = Object.fromEntries(ESPECIALIDADES.map(e => [e.id, e.label]));

const STATUS_LABEL = {
  aberta: 'Aberta — sem oferta publicada',
  ofertada_ouro: 'Oferta em aberto — faixa Ouro',
  ofertada_prata: 'Oferta em aberto — faixa Prata',
  ofertada_bronze: 'Oferta em aberto — faixa Bronze',
  aceita: 'Aceita — aguardando check-in',
  em_execucao: 'Em execução',
  concluida: 'Concluída — aguardando avaliação',
  avaliada: 'Avaliada — aguardando pagamento',
  pendente_liberacao: 'Aguardando liberação',
  bloqueado_retrabalho: 'Retrabalho pendente',
  retrabalho: 'Retrabalho solicitado',
  paga: 'Paga',
  atrasada: 'Atrasada / alerta',
};

const STATUS_BADGE_CLASS = {
  aberta: 'badge-neutro',
  ofertada_ouro: 'badge-ouro',
  ofertada_prata: 'badge-prata',
  ofertada_bronze: 'badge-bronze',
  aceita: 'badge-info',
  em_execucao: 'badge-info',
  concluida: 'badge-aviso',
  avaliada: 'badge-aviso',
  retrabalho: 'badge-alerta',
  paga: 'badge-sucesso',
  atrasada: 'badge-alerta',
};

function badgeFaixa(faixa) {
  const map = { ouro: ['badge-ouro', '🏆 Ouro'], prata: ['badge-prata', '🥈 Prata'], bronze: ['badge-bronze', '🥉 Bronze'] };
  const [cls, txt] = map[faixa] || map.bronze;
  return `<span class="badge ${cls}">${txt}</span>`;
}

function badgeStatusObra(status) {
  const cls = STATUS_BADGE_CLASS[status] || 'badge-neutro';
  return `<span class="badge ${cls}">${STATUS_LABEL[status] || status}</span>`;
}

function iniciais(nome) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

function fmtMoeda(v) {
  return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function fmtData(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR');
}

function fmtDataHora(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function tempoRelativo(iso) {
  if (!iso) return '—';
  const diffMs = new Date(iso) - agoraDemo();
  const min = Math.round(diffMs / 60000);
  if (Math.abs(min) < 60) return (min <= 0 ? 'há ' + Math.abs(min) + ' min' : 'em ' + min + ' min');
  const horas = Math.round(min / 60);
  return (horas <= 0 ? 'há ' + Math.abs(horas) + 'h' : 'em ' + horas + 'h');
}

function toast(msg, tipo) {
  let wrap = document.getElementById('toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const el = document.createElement('div');
  el.className = 'toast' + (tipo === 'erro' ? ' erro' : '');
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3800);
}

/* Distância aproximada (Haversine) em km ---------------------------------- */
function distanciaKm(lat1, lng1, lat2, lng2) {
  if ([lat1, lng1, lat2, lng2].some(v => v === null || v === undefined || isNaN(v))) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function linkGoogleMaps(lat, lng, enderecoTexto) {
  if (lat && lng) return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoTexto)}`;
}
function linkWaze(lat, lng, enderecoTexto) {
  if (lat && lng) return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  return `https://waze.com/ul?q=${encodeURIComponent(enderecoTexto)}&navigate=yes`;
}

/* Cálculo de score/faixa (transparente, ver admin/regras.html) ----------- */
function calcularScore(inst) {
  const cfg = getConfig();
  const notaBase = (inst.avaliacaoMedia || 0) / 5 * 100;
  const checklistBase = Math.max(0, 100 - inst.retrabalhos * 18);
  const pontualidadeBase = Math.max(0, 100 - inst.penalidades * 12);
  const aceiteBase = Math.max(0, 100 - inst.penalidades * 15);
  const retrabalhoPenal = inst.retrabalhos * 10;
  let score = (notaBase * cfg.pesoNota + checklistBase * cfg.pesoChecklist + pontualidadeBase * cfg.pesoPontualidade + aceiteBase * cfg.pesoAceite) / 100 - retrabalhoPenal;
  return Math.max(0, Math.min(100, Math.round(score)));
}
function faixaPorScore(score) {
  const cfg = getConfig();
  if (score >= cfg.limitePrataOuro) return 'ouro';
  if (score >= cfg.limiteBronzePrata) return 'prata';
  return 'bronze';
}

/* Janela de oferta escalonada ---------------------------------------------- */
function minutosDesde(iso) {
  return (agoraDemo() - new Date(iso)) / 60000;
}
function faixaElegivelParaObra(obra) {
  // retorna a(s) faixa(s) que podem ver a oferta agora, conforme janela escalonada
  const cfg = getConfig();
  if (!obra.status.startsWith('ofertada')) return [];
  const decorridos = minutosDesde(obra.ofertaInicioISO);
  if (obra.ofertaFaixaAtual === 'ouro') {
    if (decorridos < cfg.janelaOuroMin) return ['ouro'];
    return ['ouro', 'prata', 'bronze'];
  }
  if (obra.ofertaFaixaAtual === 'prata') {
    if (decorridos < cfg.janelaPrataMin) return ['prata'];
    return ['prata', 'bronze'];
  }
  return ['bronze'];
}

/* Toggle menu mobile -------------------------------------------------------- */
function initMenuMobile() {
  const btn = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-links');
  if (btn && nav) {
    btn.addEventListener('click', () => nav.classList.toggle('aberto'));
  }
}
document.addEventListener('DOMContentLoaded', initMenuMobile);

/* Estrelas interativas ------------------------------------------------------ */
function renderStars(container, valorInicial, onChange, readonly) {
  container.innerHTML = '';
  container.classList.toggle('readonly', !!readonly);
  let valor = valorInicial || 0;
  for (let i = 1; i <= 5; i++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = '★';
    if (i <= valor) b.classList.add('on');
    if (!readonly) {
      b.addEventListener('click', () => {
        valor = i;
        [...container.children].forEach((el, idx) => el.classList.toggle('on', idx < valor));
        if (onChange) onChange(valor);
      });
    }
    container.appendChild(b);
  }
  return () => valor;
}

/* Data/hora "agora" do preview: começa fixa em 30/07/2026 14:00 e avança em
   tempo real a partir do carregamento da página — permite contadores/janelas
   de oferta funcionarem "ao vivo" durante a demonstração. */
const _OGS_BASE_DEMO = new Date('2026-07-30T14:00:00').getTime();
const _OGS_BASE_REAL = Date.now();
function agoraDemo() { return new Date(_OGS_BASE_DEMO + (Date.now() - _OGS_BASE_REAL)); }
function agoraISO() { return agoraDemo().toISOString(); }
