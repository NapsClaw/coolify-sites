import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0a1929] text-blue-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-[#1e3a5f] font-black text-lg italic">E</span>
            </div>
            <span className="font-black text-white text-lg italic uppercase">EsporteAção</span>
          </div>
          <p className="text-sm leading-relaxed">
            Portal de notícias esportivas de Curitiba e região. Cobertura completa do esporte local.
          </p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3 uppercase text-sm tracking-wide">Categorias</h3>
          <ul className="space-y-1 text-sm">
            {['Futebol', 'Atletismo', 'Basquete', 'Vôlei', 'Outros'].map(c => (
              <li key={c}>
                <Link href={`/categoria/${c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`} className="hover:text-white transition-colors">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3 uppercase text-sm tracking-wide">Contato</h3>
          <p className="text-sm">Curitiba, PR</p>
          <p className="text-sm mt-1">Portal independente de notícias esportivas</p>
        </div>
      </div>
      <div className="border-t border-navy-700 text-center py-4 text-xs text-blue-400">
        © {new Date().getFullYear()} EsporteAção. Todos os direitos reservados.
      </div>
    </footer>
  )
}
