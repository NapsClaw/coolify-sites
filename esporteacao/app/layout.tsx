import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EsporteAção — Portal de Notícias Esportivas de Curitiba',
  description: 'Notícias, fotos e atualizações do esporte em Curitiba e região.',
  openGraph: {
    title: 'EsporteAção',
    description: 'Notícias, fotos e atualizações do esporte em Curitiba e região.',
    type: 'website',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
