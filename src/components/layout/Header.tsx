'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Video, BookOpen, Bell, Calendar, ImageIcon, HandHeart,
  Heart, Phone, Info, Music, FileText, Menu, X, Globe,
  ChevronRight, Sparkles
} from 'lucide-react'

const allPages = [
  { key: 'home', icon: Home, labelFr: 'Accueil', labelEn: 'Home', path: '' },
  { key: 'messages', icon: Video, labelFr: 'Messages', labelEn: 'Sermons', path: '/messages' },
  { key: 'enseignements', icon: BookOpen, labelFr: 'Enseignements', labelEn: 'Teachings', path: '/enseignements' },
  { key: 'videos', icon: Video, labelFr: 'Vidéos', labelEn: 'Videos', path: '/videos' },
  { key: 'textes', icon: FileText, labelFr: 'Textes', labelEn: 'Texts', path: '/textes' },
  { key: 'audios', icon: Music, labelFr: 'Audios', labelEn: 'Audios', path: '/audios' },
  { key: 'annonces', icon: Bell, labelFr: 'Annonces', labelEn: 'Announcements', path: '/annonces' },
  { key: 'evenements', icon: Calendar, labelFr: 'Événements', labelEn: 'Events', path: '/evenements' },
  { key: 'galerie', icon: ImageIcon, labelFr: 'Galerie', labelEn: 'Gallery', path: '/galerie' },
  { key: 'priere', icon: HandHeart, labelFr: 'Prière', labelEn: 'Prayer', path: '/priere' },
  { key: 'dons', icon: Heart, labelFr: 'Dons', labelEn: 'Give', path: '/dons' },
  { key: 'a-propos', icon: Info, labelFr: 'À propos', labelEn: 'About', path: '/a-propos' },
  { key: 'contact', icon: Phone, labelFr: 'Contact', labelEn: 'Contact', path: '/contact' },
]

export default function Header({ locale }: { locale: string }) {
  const other = locale === 'fr' ? 'en' : 'fr'
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Close menu on outside click
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mobileOpen])

  const isActive = (path: string) => {
    const full = `/${locale}${path}`
    return pathname === full || (path && pathname.startsWith(full))
  }

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-cifm-blue-900/5 border-b border-gray-100'
          : 'bg-white/90 backdrop-blur-sm border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Main header row */}
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
              <div className="relative">
                <Image
                  src="/images/logo/logo-cifm4.png"
                  alt="CIFM4"
                  width={38}
                  height={38}
                  className="rounded-lg transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-lg bg-cifm-blue-400/0 group-hover:bg-cifm-blue-400/20 transition-colors duration-300" />
              </div>
              <div className="hidden sm:block">
                <p className="font-lora font-semibold text-cifm-blue-700 text-base leading-tight">CIFM4</p>
                <p className="text-[9px] text-gray-400 tracking-wider">COMMUNAUT&Eacute;</p>
              </div>
            </Link>

            {/* Desktop navigation — icons with glow hover */}
            <nav className="hidden lg:flex items-center gap-1">
              {allPages.map((page) => {
                const Icon = page.icon
                const active = isActive(page.path)
                const label = locale === 'fr' ? page.labelFr : page.labelEn
                return (
                  <Link
                    key={page.key}
                    href={`/${locale}${page.path}`}
                    className="relative group"
                  >
                    <div className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl transition-all duration-300
                      ${active
                        ? 'text-cifm-blue-600 bg-cifm-blue-50'
                        : 'text-gray-500 hover:text-cifm-blue-600'
                      }`}
                    >
                      {/* Glow effect behind icon on hover */}
                      <div className="absolute inset-0 rounded-xl bg-cifm-blue-400/0 group-hover:bg-cifm-blue-50 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.15)]" />
                      <div className="relative z-10 transition-transform duration-300 group-hover:scale-125">
                        <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                      </div>
                      <span className="relative z-10 text-[9px] font-medium leading-tight whitespace-nowrap">
                        {label}
                      </span>
                    </div>
                    {/* Active indicator dot */}
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cifm-blue-600"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Language switcher */}
              <Link
                href={`/${other}${pathname.replace(`/${locale}`, '')}`}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-cifm-blue-600 transition-all duration-300 border border-gray-200 hover:border-cifm-blue-300 hover:shadow-[0_0_12px_rgba(37,99,235,0.12)] rounded-full px-3 py-1.5 group"
              >
                <Globe size={14} className="transition-transform duration-300 group-hover:rotate-45" />
                {other.toUpperCase()}
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden relative p-2 rounded-xl text-gray-600 hover:text-cifm-blue-600 hover:bg-cifm-blue-50 transition-all duration-300"
                aria-label="Menu"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X size={24} />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] overflow-y-auto shadow-2xl"
            >
              {/* Drawer header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Image src="/images/logo/logo-cifm4.png" alt="CIFM4" width={32} height={32} className="rounded-lg" />
                  <div>
                    <p className="font-lora font-semibold text-cifm-blue-700 text-sm">CIFM4</p>
                    <p className="text-[8px] text-gray-400 tracking-wider uppercase">Navigation</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Pages list with stagger animation */}
              <div className="px-3 py-4 space-y-1">
                {allPages.map((page, i) => {
                  const Icon = page.icon
                  const active = isActive(page.path)
                  const label = locale === 'fr' ? page.labelFr : page.labelEn
                  return (
                    <motion.div
                      key={page.key}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                    >
                      <Link
                        href={`/${locale}${page.path}`}
                        className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group ${
                          active
                            ? 'bg-cifm-blue-50 text-cifm-blue-700 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-cifm-blue-600'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(37,99,235,0.2)] ${
                          active ? 'bg-cifm-blue-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-cifm-blue-100 group-hover:text-cifm-blue-600'
                        }`}>
                          <Icon size={20} />
                        </div>
                        <span className="flex-1 font-medium text-sm">{label}</span>
                        <ChevronRight size={16} className={`transition-all duration-300 ${active ? 'text-cifm-blue-400' : 'text-gray-300 group-hover:text-cifm-blue-400 group-hover:translate-x-1'}`} />
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Language switch in drawer */}
              <div className="px-5 py-4 border-t border-gray-100">
                <Link
                  href={`/${other}${pathname.replace(`/${locale}`, '')}`}
                  className="flex items-center gap-3 text-gray-500 hover:text-cifm-blue-600 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-cifm-blue-100 transition-colors">
                    <Globe size={20} className="group-hover:text-cifm-blue-600 transition-colors" />
                  </div>
                  <span className="text-sm font-medium">
                    {locale === 'fr' ? 'Switch to English' : 'Passer en Français'}
                  </span>
                </Link>
              </div>

              {/* Decorative bottom */}
              <div className="px-5 py-6 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <Sparkles size={12} />
                  <span className="text-[10px] tracking-widest uppercase">CIFM4 App</span>
                  <Sparkles size={12} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
