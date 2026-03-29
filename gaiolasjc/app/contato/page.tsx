import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContatoPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-black text-gray-800 mb-6">Contato</h1>

        <div className="card p-6 mb-6 text-center">
          <p className="text-5xl mb-4">💬</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Fale pelo WhatsApp</h2>
          <p className="text-gray-500 mb-6">Resposta rápida! Tire dúvidas sobre produtos, preços e entregas.</p>
          <a
            href="https://wa.me/5581993539150"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white font-bold px-8 py-4 rounded-xl text-lg inline-block hover:bg-green-600 transition-colors"
          >
            (81) 99353-9150
          </a>
        </div>

        <div className="card p-5 text-center text-gray-500">
          <p className="font-semibold text-gray-700 mb-1">📍 Localização</p>
          <p>Belo Jardim - PE</p>
          <p className="text-sm mt-2">Fabricação e vendas para todo o Brasil</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
