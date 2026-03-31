// ============================================================
// HOSPEDA TEMPORADA — DADOS DOS SÍTIOS
// Edite este arquivo para atualizar os sítios no site
// e no painel de administração.
// ============================================================

const SITIOS = [
  {
    id: "sitio-iluminado",
    slug: "sitio-iluminado",
    nome: "Sítio Iluminado",
    localizacao: "Mogi das Cruzes / Biritiba Mirim, SP",
    descricao: "Espaço privilegiado em meio à natureza da Serra do Mar, a poucos minutos de Mogi das Cruzes. Ideal para festas, formaturas, eventos corporativos e temporadas em família. Ambiente tranquilo com toda a estrutura que você precisa.",
    tipo: "🌿 Natureza · Eventos · Temporada",
    preco: "Consulte valores",
    precoDetalhe: "Preço varia conforme data e número de pessoas",
    capacidade: "Consultar",
    fotos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80"
    ],
    fotoCapa: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    features: ["🛏️ Acomodações", "🏊 Piscina", "🎉 Área de festa", "🌿 Área verde", "🔥 Churrasqueira", "🚗 Estacionamento", "🎓 Formaturas"],
    diasIndisponiveis: [5, 6, 7, 12, 13, 18, 19, 20, 25, 26],
    ativo: true
  },
  {
    id: "sitio-das-pedras",
    slug: "sitio-das-pedras",
    nome: "Sítio das Pedras",
    localizacao: "Guararema, SP",
    descricao: "Lindo sítio com paisagem de pedras naturais e área verde exuberante. Perfeito para casamentos ao ar livre, retiros e eventos especiais em contato com a natureza.",
    tipo: "🪨 Campo · Casamentos · Retiros",
    preco: "R$1.800",
    precoDetalhe: "por dia (até 30 pessoas)",
    capacidade: "até 30 pessoas",
    fotos: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
      "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600&q=80"
    ],
    fotoCapa: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    features: ["🛏️ 4 quartos", "🔥 Churrasqueira", "🌿 Área verde", "🪨 Vista para pedras", "🚗 Estacionamento", "💒 Ideal para casamentos"],
    diasIndisponiveis: [3, 4, 10, 11, 17, 18, 24, 25],
    ativo: true
  },
  {
    id: "sitio-beira-rio",
    slug: "sitio-beira-rio",
    nome: "Sítio Beira Rio",
    localizacao: "Salesópolis, SP",
    descricao: "Sítio às margens do Rio Tietê nascente, com deck para pescaria, área de camping e linda varanda com vista para o rio. Tranquilidade total para sua família ou grupo.",
    tipo: "🌊 Rio · Pesca · Família",
    preco: "R$1.200",
    precoDetalhe: "por dia (até 20 pessoas)",
    capacidade: "até 20 pessoas",
    fotos: [
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
      "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&q=80",
      "https://images.unsplash.com/photo-1439066290691-debb18599def?w=600&q=80",
      "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=600&q=80",
      "https://images.unsplash.com/photo-1445307806294-bff7f67ff225?w=600&q=80"
    ],
    fotoCapa: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    features: ["🛏️ 3 quartos", "🎣 Deck para pesca", "🏕️ Área de camping", "🌊 Beira do rio", "🔥 Fogueira", "🌲 Trilhas"],
    diasIndisponiveis: [6, 7, 13, 14, 20, 21, 27, 28],
    ativo: true
  },
  {
    id: "sitio-alto-da-serra",
    slug: "sitio-alto-da-serra",
    nome: "Sítio Alto da Serra",
    localizacao: "Paraibuna, SP",
    descricao: "No alto da Serra do Mar, com vista panorâmica de 360°. O lugar perfeito para retiros espirituais, festas intimistas e finais de semana inesquecíveis com muito frescor e paz.",
    tipo: "⛰️ Serra · Vista panorâmica · Retiros",
    preco: "R$2.200",
    precoDetalhe: "por dia (até 40 pessoas)",
    capacidade: "até 40 pessoas",
    fotos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
      "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=600&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80"
    ],
    fotoCapa: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    features: ["🛏️ 6 quartos", "⛰️ Vista panorâmica", "🔥 Lareira", "🌫️ Clima ameno", "🚗 Estacionamento amplo", "🧘 Espaço para retiro"],
    diasIndisponiveis: [1, 2, 8, 9, 15, 16, 22, 23],
    ativo: true
  }
];
