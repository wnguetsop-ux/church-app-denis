'use client'

import Image from 'next/image'
import { useLocale } from 'next-intl'

const socialLinks = [
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@communauteinternationalede1948',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@communaut.fils.de',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.79a4.85 4.85 0 01-1-.1z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  const locale = useLocale()

  const quickLinks = [
    { label: locale === 'fr' ? 'Messages' : 'Sermons', href: `/${locale}/messages` },
    { label: locale === 'fr' ? 'Enseignements' : 'Teachings', href: `/${locale}/enseignements` },
    { label: locale === 'fr' ? 'Vidéos' : 'Videos', href: `/${locale}/videos` },
    { label: locale === 'fr' ? 'Galerie' : 'Gallery', href: `/${locale}/galerie` },
    { label: locale === 'fr' ? 'Prière' : 'Prayer', href: `/${locale}/priere` },
    { label: locale === 'fr' ? 'Dons' : 'Give', href: `/${locale}/dons` },
  ]

  return (
    <footer className="bg-cifm-blue-700 text-white mt-16">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne 1 — Identité */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo/logo-cifm4.png"
                alt="CIFM4"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <p className="font-lora text-sm font-semibold leading-snug">CIFM4</p>
                <p className="text-blue-300/70 text-[10px] tracking-wide">C. I. F. M. 4</p>
              </div>
            </div>
            <p className="text-blue-200/80 text-xs leading-relaxed">
              {locale === 'fr'
                ? 'Communauté Internationale des Fils de Malachie 4 — Organisation chrétienne à but non lucratif.'
                : 'International Community of the Sons of Malachi 4 — Non-profit Christian organization.'}
            </p>
            <p className="text-blue-300/50 text-[10px] italic">
              {locale === 'fr' ? 'Malachie 4:5-6' : 'Malachi 4:5-6'}
            </p>
          </div>

          {/* Colonne 2 — Liens rapides (desktop) */}
          <div className="hidden md:block space-y-3">
            <p className="text-xs font-semibold tracking-wide uppercase text-blue-200/60">Navigation</p>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-blue-200/80 text-sm hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 — Contact + Réseaux */}
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-wide uppercase text-blue-200/60">Contact</p>
            <div className="space-y-2">
              <a href="mailto:tadumdenis@gmail.com" className="block text-blue-200/80 text-sm hover:text-white transition-colors">
                tadumdenis@gmail.com
              </a>
              <p className="text-blue-300/50 text-xs">communautedesfilsdemalachie4.com</p>
            </div>
            <div className="flex gap-2 pt-1">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-blue-300/50 text-xs">
            &copy; {new Date().getFullYear()} Communauté Internationale des Fils de Malachie 4
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-[1px] bg-cifm-gold-400/40" />
            <span className="text-[9px] tracking-widest uppercase text-cifm-gold-400/50 font-medium">CIFM4</span>
            <div className="w-4 h-[1px] bg-cifm-gold-400/40" />
          </div>
        </div>
      </div>
    </footer>
  )
}
