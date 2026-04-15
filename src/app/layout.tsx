import type { Metadata } from 'next'
import { Inter, Lora } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const lora  = Lora({ subsets: ['latin'], variable: '--font-lora-var' })

export const metadata: Metadata = {
  title: 'CIFM4 — Communauté Internationale des Fils de Malachie 4',
  description: 'Organisation chrétienne à but non lucratif. Promouvoir la Parole de Dieu, le message de Malachie 4:5-6, le style de vie communautaire d\'Actes 2, et accueillir les personnes en difficulté.',
  manifest: '/manifest.json',
  metadataBase: new URL('https://communautedesfilsdemalachie4.com'),
  openGraph: {
    title: 'CIFM4 — Communauté Internationale des Fils de Malachie 4',
    description: 'Organisation chrétienne à but non lucratif. Promouvoir la Parole de Dieu et servir notre communauté.',
    url: 'https://communautedesfilsdemalachie4.com',
    siteName: 'CIFM4',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1E4D9B" />
      </head>
      <body className={`${inter.variable} ${lora.variable} bg-slate-50 text-gray-900`}>
        {children}
      </body>
    </html>
  )
}
