import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white">
      {/* Header */}
      <header className="w-full py-4 px-6 flex items-center justify-between bg-blue-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-blue-900 font-bold text-lg">
            IE
          </div>
          <span className="font-bold text-lg hidden sm:block">Idealeleitor</span>
        </div>
        <Link
          href="/auth/login"
          className="bg-yellow-400 text-blue-900 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-yellow-300 transition-colors"
        >
          Área do Coordenador
        </Link>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-16 md:py-24">
        {/* Candidatos */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-yellow-400 shadow-2xl overflow-hidden bg-blue-800 flex-shrink-0">
            <Image
              src="/candidato1.jpg"
              alt="Joselyo Mais Saúde"
              width={160}
              height={160}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-blue-900 font-bold text-lg shrink-0">
            &amp;
          </div>
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-green-400 shadow-2xl overflow-hidden bg-blue-800 flex-shrink-0">
            <Image
              src="/candidato2.jpg"
              alt="Felipe Show"
              width={160}
              height={160}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-2">
          Joselyo Mais Saúde
          <span className="text-yellow-300"> & </span>
          Felipe Show
        </h1>
        <p className="text-yellow-300 text-xl font-semibold mb-1">Candidatos do Povo</p>
        <p className="text-white text-lg font-medium mb-6">O Amapá merece o melhor!</p>

        <p className="text-blue-100 text-lg max-w-xl mb-10">
          Juntos, construiremos uma cidade mais justa, igualitária e com oportunidades para todos.
          Faça parte dessa mudança!
        </p>

        <Link
          href="/auth/login"
          className="bg-yellow-400 text-blue-900 font-bold px-10 py-4 rounded-xl text-lg hover:bg-yellow-300 transition-colors shadow-lg"
        >
          Sou Coordenador — Entrar
        </Link>
      </section>

      {/* Propósito */}
      <section className="bg-white text-gray-900 px-6 py-14 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">Nosso Compromisso</h2>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mb-8 rounded-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🏫', title: 'Educação', desc: 'Mais escolas, melhores professores e ensino de qualidade para nossas crianças.' },
              { icon: '🏥', title: 'Saúde', desc: 'Postos de saúde funcionando, médicos suficientes e atendimento digno.' },
              { icon: '🛣️', title: 'Infraestrutura', desc: 'Ruas asfaltadas, saneamento básico e mobilidade para todos.' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center p-6 rounded-xl bg-blue-50">
                <span className="text-4xl mb-3">{item.icon}</span>
                <h3 className="font-bold text-lg text-blue-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Coordenadores */}
      <section className="bg-yellow-400 px-6 py-14 text-center text-blue-900">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">É Coordenador?</h2>
        <p className="mb-6 text-blue-800 max-w-md mx-auto">
          Acesse a plataforma para cadastrar eleitores e acompanhar sua equipe.
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-blue-800 text-white font-bold px-10 py-4 rounded-xl text-lg hover:bg-blue-900 transition-colors shadow"
        >
          Acessar Plataforma
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-300 text-center py-6 px-4 text-sm">
        <p>© 2025 Joselyo Mais Saúde & Felipe Show — Todos os direitos reservados</p>
      </footer>
    </main>
  )
}
