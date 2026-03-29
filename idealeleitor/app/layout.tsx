import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Idealeleitor — Joselyo Felipe',
  description: 'Plataforma de cadastro de eleitores',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
