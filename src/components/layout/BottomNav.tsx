'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Video, Bell, ImageIcon, MoreHorizontal,
  BookOpen, Calendar, HandHeart, Heart, Phone, Info,
  Music, FileText, Globe, X, Sparkles, ChevronRight
} from 'lucide-react'

const mainTabs = [
  { href: '', icon: Home, labelFr: 'Accueil', labelEn: 'Home' },
  { href: '/messages', icon: Video, labelFr: 'Messages', labelEn: 'Sermons' },
  { href: '/annonces', icon: Bell, labelFr: 'Annonces', labelEn: 'News' },
  { href: '/galerie', icon: ImageIcon, labelFr: 'Galerie', labelEn: 'Gallery' },
]

const morePages = [
  { key: 'enseignements', icon: BookOpen, labelFr: 'Enseignements', labelEn: 'Teachings', path: '/enseignements' },
  { key: 'videos', icon: Video, labelFr: 'Vidéos', labelEn: 'Videos', path: '/videos' },
  { key: 'textes', icon: FileText, labelFr: 'Textes', labelEn: 'Texts', path: '/textes' },
  { key: 'audios', icon: Music, labelFr: 'Audios', labelEn: 'Audios', path: '/audios' },
  { key: 'evenements', icon: Calendar, labelFr: 'Événements', labelEn: 'Events', path: '/evenements' },
  { key: 'priere', icon: HandHeart, labelFr: 'Prière', labelEn: 'Prayer', path: '/priere' },
  { key: 'dons', icon: Heart, labelFr: 'Dons', labelEn: 'Give', path: '/dons' },
  { key: 'a-propos', icon: Info, labelFr: 'À propos', labelEn: 'About', path: '/a-propos' },
  { key: 'contact', icon: Phone, labelFr: 'Contact', labelEn: 'Contact', path: '/contact' },
]

export default function BottomNav({ locale }: { locale: string }) {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setShowMore(false) }, [pathname])

  const isActive = (href: string) => {
    const full = `/${locale}${href}`
    return pathname === full || (href && pathname.startsWith(full))
  }

  // Check if any "more" page is active
  const moreActive = morePages.some(p => isActive(p.path))

  return (
    <>
      {/* Bottom navigation bar — mobile only */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {mainTabs.map(tab => {
            const active = isActive(tab.href)
            const Icon = tab.icon
            const label = locale === 'fr' ? tab.labelFr : tab.labelEn
            return (
              <Link key={tab.href} href={`/${locale}${tab.href}`}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1 group">
                <div className={`relative transition-all duration-300 ${active ? 'text-cifm-blue-600' : 'text-gray-400 group-active:scale-90'}`}>
                  {/* Glow ring on active */}
                  {active && (
                    <motion.div
                      layoutId="bottomNavGlow"
                      className="absolute -inset-2 rounded-full bg-cifm-blue-100/60"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <Icon size={22} className="relative z-10" strokeWidth={active ? 2.3 : 1.8} />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${active ? 'text-cifm-blue-600' : 'text-gray-400'}`}>
                  {label}
                </span>
              </Link>
            )
          })}

          {/* "Plus" button that opens bottom sheet */}
          <button
            onClick={() => setShowMore(true)}
            className="relative flex flex-col items-center gap-0.5 px-3 py-1 group"
          >
            <div className={`relative transition-all duration-300 ${moreActive ? 'text-cifm-blue-600' : 'text-gray-400 group-active:scale-90'}`}>
              {moreActive && (
                <div className="absolute -inset-2 rounded-full bg-cifm-blue-100/60" />
              )}
              <MoreHorizontal size={22} className="relative z-10" strokeWidth={moreActive ? 2.3 : 1.8} />
            </div>
            <span className={`text-[10px] font-medium ${moreActive ? 'text-cifm-blue-600' : 'text-gray-400'}`}>
              {locale === 'fr' ? 'Plus' : 'More'}
            </span>
          </button>
        </div>
      </nav>

      {/* Bottom sheet — all pages */}
      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[80]"
              onClick={() => setShowMore(false)}
            />

            <motion.div
              ref={sheetRef}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[90] max-h-[80vh] overflow-y-auto shadow-2xl"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-300" />
              </div>

              {/* Sheet header */}
              <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <Image src="/images/logo/logo-cifm4.png" alt="" width={28} height={28} className="rounded-lg" />
                  <span className="font-lora font-semibold text-cifm-blue-700 text-sm">
                    {locale === 'fr' ? 'Toutes les pages' : 'All pages'}
                  </span>
                </div>
                <button onClick={() => setShowMore(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50">
                  <X size={18} />
                </button>
              </div>

              {/* Pages grid — innovative 3-column icon grid */}
              <div className="px-4 py-5 grid grid-cols-3 gap-3">
                {morePages.map((page, i) => {
                  const Icon = page.icon
                  const active = isActive(page.path)
                  const label = locale === 'fr' ? page.labelFr : page.labelEn
                  return (
                    <motion.div
                      key={page.key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                    >
                      <Link
                        href={`/${locale}${page.path}`}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 group active:scale-95 ${
                          active ? 'bg-cifm-blue-50 shadow-sm' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-active:scale-110 ${
                          active
                            ? 'bg-cifm-blue-600 text-white shadow-lg shadow-cifm-blue-600/30'
                            : 'bg-gray-100 text-gray-500 group-hover:bg-cifm-blue-100 group-hover:text-cifm-blue-600 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.15)]'
                        }`}>
                          <Icon size={22} />
                        </div>
                        <span className={`text-[11px] font-medium text-center leading-tight ${
                          active ? 'text-cifm-blue-700' : 'text-gray-600'
                        }`}>
                          {label}
                        </span>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Footer decoration */}
              <div className="px-5 py-4 border-t border-gray-50 flex items-center justify-center gap-2 text-gray-300">
                <Sparkles size={10} />
                <span className="text-[9px] tracking-widest uppercase">CIFM4</span>
                <Sparkles size={10} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
