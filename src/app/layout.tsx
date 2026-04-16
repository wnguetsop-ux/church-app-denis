import type { Metadata } from 'next'
import { Inter, Lora } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const lora  = Lora({ subsets: ['latin'], variable: '--font-lora-var' })

export const metadata: Metadata = {
  title: {
    default: 'CIFM4 — Communauté Internationale des Fils de Malachie 4',
    template: '%s | CIFM4',
  },
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
    images: [{ url: '/images/logo/insigne-cifm4.jpg', width: 1200, height: 630, alt: 'CIFM4' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CIFM4 — Communauté Internationale des Fils de Malachie 4',
    description: 'Promouvoir la Parole de Dieu, servir notre communauté, accueillir chacun.',
    images: ['/images/logo/insigne-cifm4.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://communautedesfilsdemalachie4.com',
    languages: {
      'fr': 'https://communautedesfilsdemalachie4.com/fr',
      'en': 'https://communautedesfilsdemalachie4.com/en',
    },
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
