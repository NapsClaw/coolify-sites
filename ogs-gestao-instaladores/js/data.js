/* ==========================================================================
   OGS DECOR — camada de dados (PREVIEW / localStorage)
   Nenhum dado aqui é real. Tudo é fictício para fins de demonstração.
   ========================================================================== */

const OGS_NS = 'ogsDecorDemo_v1';
const K_INSTALADORES = OGS_NS + '_instaladores';
const K_OBRAS = OGS_NS + '_obras';
const K_CONFIG = OGS_NS + '_config';
const K_SESSAO = OGS_NS + '_sessaoInstalador';

const ESPECIALIDADES = [
  { id: 'grama', label: 'Grama sintética' },
  { id: 'vinilico', label: 'Piso vinílico' },
  { id: 'laminado', label: 'Piso laminado' },
  { id: 'emborrachado', label: 'Piso emborrachado' },
  { id: 'carpete', label: 'Carpete' },
];

const CHECKLISTS = {
  grama: [
    'Preparo e nivelamento da base',
    'Alinhamento do fio da grama',
    'Execução correta das emendas',
    'Fixação das bordas e perímetro',
    'Corte de acabamento nos contornos',
    'Limpeza final do local',
  ],
  vinilico: [
    'Nivelamento e limpeza do contrapiso',
    'Aplicação de manta niveladora (se aplicável)',
    'Assentamento das réguas/placas sem espaçamento',
    'Alinhamento dos rejuntes/emendas',
    'Acabamento com rodapé/perfil',
    'Limpeza final do local',
  ],
  laminado: [
    'Nivelamento da base e manta acústica',
    'Direção do assentamento conforme luz do ambiente',
    'Encaixe das réguas sem folgas',
    'Juntas de dilatação nas bordas',
    'Rodapés e acabamentos finais',
    'Limpeza final do local',
  ],
  emborrachado: [
    'Preparo e limpeza da base',
    'Aplicação de cola/fita conforme especificação',
    'Alinhamento das placas/mantas',
    'Emendas niveladas e sem sobra',
    'Acabamento nas bordas',
    'Limpeza final do local',
  ],
  carpete: [
    'Preparo da base e remoção de resíduos',
    'Esticamento correto do carpete',
    'Emendas invisíveis',
    'Fixação nas bordas e soleiras',
    'Acabamento nos acessos/portas',
    'Limpeza final do local',
  ],
};

const CONFIG_PADRAO = {
  janelaOuroMin: 45,
  janelaPrataMin: 30,
  pesoNota: 50,
  pesoChecklist: 20,
  pesoPontualidade: 15,
  pesoAceite: 10,
  pesoRetrabalho: 5,
  limiteBronzePrata: 60,
  limitePrataOuro: 85,
  limiteSuspensao: 40,
  prazoAvaliacaoHoras: 72,
};

function ogsUid(prefixo) {
  return prefixo + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();
}

/* ---------------------------------------------------------------------- */
/* SEED                                                                     */
/* ---------------------------------------------------------------------- */

function seedInstaladores() {
  return [
    { id: 'INS-001', nome: 'Carlos Andrade', telefone: '(31) 99811-2233', pix: 'carlos.andrade@pixdemo.com', documento: 'CPF demonstrativo', especialidades: ['grama', 'vinilico'], faixa: 'ouro', score: 96, status: 'aprovado', obrasConcluidas: 41, avaliacaoMedia: 4.9, penalidades: 0, retrabalhos: 0, dataCadastro: '2024-03-12', historico: 'Instalador fundador da equipe — reconhecido como Ouro no lançamento.' },
    { id: 'INS-002', nome: 'Fernanda Lopes', telefone: '(31) 99722-4410', pix: 'fernanda.lopes@pixdemo.com', documento: 'CPF demonstrativo', especialidades: ['grama', 'carpete'], faixa: 'ouro', score: 93, status: 'aprovado', obrasConcluidas: 37, avaliacaoMedia: 4.8, penalidades: 0, retrabalhos: 0, dataCadastro: '2024-04-02', historico: 'Instaladora fundadora — reconhecida como Ouro no lançamento.' },
    { id: 'INS-003', nome: 'Juliano Prado', telefone: '(31) 98877-1290', pix: '31988771290', documento: 'CPF demonstrativo', especialidades: ['laminado', 'vinilico'], faixa: 'prata', score: 81, status: 'aprovado', obrasConcluidas: 22, avaliacaoMedia: 4.6, penalidades: 0, retrabalhos: 1, dataCadastro: '2025-01-18', historico: 'Progrediu de Bronze para Prata após 6 meses de boas avaliações.' },
    { id: 'INS-004', nome: 'Marcos Vinícius', telefone: '(31) 99345-7781', pix: 'marcos.vini@pixdemo.com', documento: 'CPF demonstrativo', especialidades: ['grama', 'emborrachado'], faixa: 'prata', score: 78, status: 'aprovado', obrasConcluidas: 19, avaliacaoMedia: 4.5, penalidades: 1, retrabalhos: 0, dataCadastro: '2025-02-27', historico: 'Uma recusa tardia registrada; sem impacto grave no score.' },
    { id: 'INS-005', nome: 'Patrícia Nunes', telefone: '(31) 99120-8843', pix: '11122233344', documento: 'CPF demonstrativo', especialidades: ['carpete', 'laminado'], faixa: 'bronze', score: 62, status: 'aprovado', obrasConcluidas: 8, avaliacaoMedia: 4.3, penalidades: 0, retrabalhos: 0, dataCadastro: '2025-11-05', historico: 'Em progressão consistente rumo à faixa Prata.' },
    { id: 'INS-006', nome: 'Diego Ramos', telefone: '(31) 98654-3321', pix: 'diego.ramos@pixdemo.com', documento: 'CPF demonstrativo', especialidades: ['grama'], faixa: 'bronze', score: 47, status: 'aprovado', obrasConcluidas: 6, avaliacaoMedia: 3.4, penalidades: 2, retrabalhos: 2, dataCadastro: '2025-12-01', historico: 'Score em queda — 2 retrabalhos recentes. Próximo de suspensão automática.' },
    { id: 'INS-007', nome: 'Wellington Diniz', telefone: '(31) 99988-7765', pix: 'wellington.diniz@pixdemo.com', documento: 'CPF demonstrativo', especialidades: ['vinilico', 'emborrachado'], faixa: 'bronze', score: 0, status: 'pendente', obrasConcluidas: 0, avaliacaoMedia: 0, penalidades: 0, retrabalhos: 0, dataCadastro: '2026-07-28', historico: 'Cadastro recebido pelo formulário de onboarding — aguardando aprovação manual do admin.' },
  ];
}

// Lagoa Santa/MG (aprox.) — endereços e coordenadas demonstrativas
function seedObras() {
  const agora = new Date('2026-07-30T14:00:00');
  const h = (horas) => new Date(agora.getTime() + horas * 3600 * 1000).toISOString();

  return [
    {
      id: 'OGS-1044', tipo: 'grama', titulo: 'Instalação de grama sintética — quintal residencial',
      endereco: 'Rua das Acácias, 210 — Bairro Vista Verde (endereço demonstrativo) — Lagoa Santa/MG',
      lat: -19.6531, lng: -43.8890, metragem: 65, valor: 1450,
      prazo: '2026-08-04', observacoes: 'Cliente pediu atenção especial ao acabamento junto ao muro.',
      status: 'ofertada_prata', ofertaFaixaAtual: 'prata', ofertaInicioISO: h(-0.25), instaladorId: null,
      criadaEm: h(-2), checklist: {}, fotos: { antes: [], durante: [], depois: [] },
      checkin: null, checkout: null, avaliacao: null, pagamento: { status: 'nao_aplicavel' },
    },
    {
      id: 'OGS-1042', tipo: 'grama', titulo: 'Instalação de grama sintética — Cond. Reserva do Lago',
      endereco: 'Alameda dos Ipês, Quadra 4, Lote 12 — Cond. Reserva do Lago (endereço demonstrativo) — Lagoa Santa/MG',
      lat: -19.6602, lng: -43.9021, metragem: 180, valor: 3200,
      prazo: '2026-08-06', observacoes: 'Área de lazer com piscina ao lado — cuidado redobrado com respingos de cola.',
      status: 'ofertada_ouro', ofertaFaixaAtual: 'ouro', ofertaInicioISO: h(-0.1), instaladorId: null,
      criadaEm: h(-0.5), checklist: {}, fotos: { antes: [], durante: [], depois: [] },
      checkin: null, checkout: null, avaliacao: null, pagamento: { status: 'nao_aplicavel' },
    },
    {
      id: 'OGS-1041', tipo: 'vinilico', titulo: 'Piso vinílico — sala e corredor',
      endereco: 'Rua Bela Vista, 88 — Bairro Bela Vista (endereço demonstrativo) — Lagoa Santa/MG',
      lat: -19.6488, lng: -43.8955, metragem: 42, valor: 1680,
      prazo: '2026-07-31', observacoes: 'Cliente preferiu início após 13h.',
      status: 'em_execucao', ofertaFaixaAtual: null, ofertaInicioISO: null, instaladorId: 'INS-001',
      criadaEm: h(-30), checklist: { '0': true, '1': true, '2': false, '3': false, '4': false, '5': false },
      fotos: {
        antes: [{ url: 'data:image/svg+xml;utf8,' + encodeURIComponent(svgFoto('#8a7a5c', 'ANTES')), dataHora: h(-3) }],
        durante: [{ url: 'data:image/svg+xml;utf8,' + encodeURIComponent(svgFoto('#3d8a2b', 'DURANTE')), dataHora: h(-1) }],
        depois: [],
      },
      checkin: { lat: -19.6490, lng: -43.8951, dataHora: h(-3.2), enderecoManual: null },
      checkout: null, avaliacao: null, pagamento: { status: 'nao_aplicavel' },
    },
    {
      id: 'OGS-1039', tipo: 'grama', titulo: 'Instalação de grama sintética — área gourmet',
      endereco: 'Rua dos Pinheiros, 305 — Bairro Bela Vista (endereço demonstrativo) — Lagoa Santa/MG',
      lat: -19.6470, lng: -43.8930, metragem: 38, valor: 980,
      prazo: '2026-07-29', observacoes: '',
      status: 'concluida', ofertaFaixaAtual: null, ofertaInicioISO: null, instaladorId: 'INS-002',
      criadaEm: h(-72), checklist: { '0': true, '1': true, '2': true, '3': true, '4': true, '5': true },
      fotos: {
        antes: [{ url: 'data:image/svg+xml;utf8,' + encodeURIComponent(svgFoto('#8a7a5c', 'ANTES')), dataHora: h(-30) }],
        durante: [{ url: 'data:image/svg+xml;utf8,' + encodeURIComponent(svgFoto('#3d8a2b', 'DURANTE')), dataHora: h(-27) }],
        depois: [{ url: 'data:image/svg+xml;utf8,' + encodeURIComponent(svgFoto('#1c4429', 'DEPOIS')), dataHora: h(-25) }],
      },
      checkin: { lat: -19.6472, lng: -43.8928, dataHora: h(-30), enderecoManual: null },
      checkout: { dataHora: h(-25) },
      avaliacao: null, pagamento: { status: 'aguardando_avaliacao' },
    },
    {
      id: 'OGS-1037', tipo: 'carpete', titulo: 'Carpete — sala comercial (escritório)',
      endereco: 'Av. Central, 512, sala 4 — Centro (endereço demonstrativo) — Lagoa Santa/MG',
      lat: -19.6552, lng: -43.8887, metragem: 54, valor: 1520,
      prazo: '2026-07-27', observacoes: '',
      status: 'avaliada', ofertaFaixaAtual: null, ofertaInicioISO: null, instaladorId: 'INS-002',
      criadaEm: h(-120), checklist: { '0': true, '1': true, '2': true, '3': true, '4': true, '5': true },
      fotos: {
        antes: [{ url: 'data:image/svg+xml;utf8,' + encodeURIComponent(svgFoto('#8a7a5c', 'ANTES')), dataHora: h(-100) }],
        durante: [{ url: 'data:image/svg+xml;utf8,' + encodeURIComponent(svgFoto('#3d8a2b', 'DURANTE')), dataHora: h(-97) }],
        depois: [{ url: 'data:image/svg+xml;utf8,' + encodeURIComponent(svgFoto('#1c4429', 'DEPOIS')), dataHora: h(-95) }],
      },
      checkin: { lat: -19.6553, lng: -43.8885, dataHora: h(-100), enderecoManual: null },
      checkout: { dataHora: h(-95) },
      avaliacao: { qualidade: 5, pontualidade: 5, limpeza: 4, atendimento: 5, comentario: 'Ficou excelente, super pontual e educada. Recomendo!', dataHora: h(-70), contestada: false, automatica: false },
      pagamento: { status: 'pendente_liberacao' },
    },
    {
      id: 'OGS-1035', tipo: 'laminado', titulo: 'Piso laminado — apartamento 2 quartos',
      endereco: 'Rua Tiradentes, 140, apto 302 — Centro (endereço demonstrativo) — Lagoa Santa/MG',
      lat: -19.6541, lng: -43.8901, metragem: 60, valor: 2100,
      prazo: '2026-07-22', observacoes: '',
      status: 'paga', ofertaFaixaAtual: null, ofertaInicioISO: null, instaladorId: 'INS-003',
      criadaEm: h(-260), checklist: { '0': true, '1': true, '2': true, '3': true, '4': true, '5': true },
      fotos: {
        antes: [{ url: 'data:image/svg+xml;utf8,' + encodeURIComponent(svgFoto('#8a7a5c', 'ANTES')), dataHora: h(-240) }],
        durante: [{ url: 'data:image/svg+xml;utf8,' + encodeURIComponent(svgFoto('#3d8a2b', 'DURANTE')), dataHora: h(-235) }],
        depois: [{ url: 'data:image/svg+xml;utf8,' + encodeURIComponent(svgFoto('#1c4429', 'DEPOIS')), dataHora: h(-230) }],
      },
      checkin: { lat: -19.6540, lng: -43.8899, dataHora: h(-240), enderecoManual: null },
      checkout: { dataHora: h(-230) },
      avaliacao: { qualidade: 5, pontualidade: 4, limpeza: 5, atendimento: 5, comentario: 'Muito caprichoso no acabamento das juntas.', dataHora: h(-200), contestada: false, automatica: false },
      pagamento: { status: 'liberado', dataLiberacaoISO: h(-190) },
    },
    {
      id: 'OGS-1033', tipo: 'emborrachado', titulo: 'Piso emborrachado — academia (sala de peso livre)',
      endereco: 'Av. Getúlio Vargas, 900 — Centro (endereço demonstrativo) — Lagoa Santa/MG',
      lat: -19.6519, lng: -43.8873, metragem: 90, valor: 2700,
      prazo: '2026-07-29', observacoes: 'Prazo estourado — sem check-in registrado até o momento.',
      status: 'atrasada', ofertaFaixaAtual: null, ofertaInicioISO: null, instaladorId: 'INS-006',
      criadaEm: h(-96), checklist: {}, fotos: { antes: [], durante: [], depois: [] },
      checkin: null, checkout: null, avaliacao: null, pagamento: { status: 'nao_aplicavel' },
    },
    {
      id: 'OGS-1030', tipo: 'vinilico', titulo: 'Piso vinílico — recepção de escritório',
      endereco: 'Rua Barão do Rio Branco, 77 — Centro (endereço demonstrativo) — Lagoa Santa/MG',
      lat: -19.6560, lng: -43.8910, metragem: 30, valor: 1050,
      prazo: '2026-07-20', observacoes: 'Cliente reclamou de emenda aparente — retrabalho solicitado pelo admin.',
      status: 'retrabalho', ofertaFaixaAtual: null, ofertaInicioISO: null, instaladorId: 'INS-006',
      criadaEm: h(-300), checklist: { '0': true, '1': true, '2': false, '3': true, '4': true, '5': true },
      fotos: {
        antes: [{ url: 'data:image/svg+xml;utf8,' + encodeURIComponent(svgFoto('#8a7a5c', 'ANTES')), dataHora: h(-290) }],
        durante: [{ url: 'data:image/svg+xml;utf8,' + encodeURIComponent(svgFoto('#3d8a2b', 'DURANTE')), dataHora: h(-286) }],
        depois: [{ url: 'data:image/svg+xml;utf8,' + encodeURIComponent(svgFoto('#1c4429', 'DEPOIS')), dataHora: h(-284) }],
      },
      checkin: { lat: -19.6561, lng: -43.8908, dataHora: h(-290), enderecoManual: null },
      checkout: { dataHora: h(-284) },
      avaliacao: { qualidade: 2, pontualidade: 4, limpeza: 3, atendimento: 3, comentario: 'Ficou uma emenda visível perto da porta, pedi correção.', dataHora: h(-260), contestada: false, automatica: false },
      pagamento: { status: 'bloqueado_retrabalho' },
    },
    {
      id: 'OGS-1028', tipo: 'grama', titulo: 'Grama sintética — praça de eventos (área externa)',
      endereco: 'Rua das Palmeiras, s/n — Bairro Industrial (endereço demonstrativo) — Lagoa Santa/MG',
      lat: -19.6440, lng: -43.8960, metragem: 220, valor: 4100,
      prazo: '2026-08-12', observacoes: 'Aguardando definição de data para publicar oferta.',
      status: 'aberta', ofertaFaixaAtual: null, ofertaInicioISO: null, instaladorId: null,
      criadaEm: h(-1), checklist: {}, fotos: { antes: [], durante: [], depois: [] },
      checkin: null, checkout: null, avaliacao: null, pagamento: { status: 'nao_aplicavel' },
    },
  ];
}

function svgFoto(cor, rotulo) {
  return `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect width='300' height='300' fill='${cor}'/><rect width='300' height='300' fill='%23000' opacity='0.08'/><text x='50%' y='50%' font-family='monospace' font-size='20' fill='white' text-anchor='middle' dominant-baseline='middle'>${rotulo}</text></svg>`;
}

/* ---------------------------------------------------------------------- */
/* INIT + CRUD                                                              */
/* ---------------------------------------------------------------------- */

function ogsInit() {
  if (!localStorage.getItem(K_INSTALADORES)) {
    localStorage.setItem(K_INSTALADORES, JSON.stringify(seedInstaladores()));
  }
  if (!localStorage.getItem(K_OBRAS)) {
    localStorage.setItem(K_OBRAS, JSON.stringify(seedObras()));
  }
  if (!localStorage.getItem(K_CONFIG)) {
    localStorage.setItem(K_CONFIG, JSON.stringify(CONFIG_PADRAO));
  }
}

function getInstaladores() { return JSON.parse(localStorage.getItem(K_INSTALADORES) || '[]'); }
function setInstaladores(arr) { localStorage.setItem(K_INSTALADORES, JSON.stringify(arr)); }
function getInstalador(id) { return getInstaladores().find(i => i.id === id); }
function salvarInstalador(inst) {
  const arr = getInstaladores();
  const idx = arr.findIndex(i => i.id === inst.id);
  if (idx >= 0) arr[idx] = inst; else arr.push(inst);
  setInstaladores(arr);
}

function getObras() { return JSON.parse(localStorage.getItem(K_OBRAS) || '[]'); }
function setObras(arr) { localStorage.setItem(K_OBRAS, JSON.stringify(arr)); }
function getObra(id) { return getObras().find(o => o.id === id); }
function salvarObra(obra) {
  const arr = getObras();
  const idx = arr.findIndex(o => o.id === obra.id);
  if (idx >= 0) arr[idx] = obra; else arr.unshift(obra);
  setObras(arr);
}

function getConfig() { return JSON.parse(localStorage.getItem(K_CONFIG) || JSON.stringify(CONFIG_PADRAO)); }

function getSessaoInstaladorId() { return localStorage.getItem(K_SESSAO); }
function setSessaoInstaladorId(id) { localStorage.setItem(K_SESSAO, id); }

function ogsResetDemo() {
  localStorage.removeItem(K_INSTALADORES);
  localStorage.removeItem(K_OBRAS);
  localStorage.removeItem(K_CONFIG);
  ogsInit();
}

ogsInit();
