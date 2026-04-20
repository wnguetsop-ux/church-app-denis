'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useState, type ComponentType } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Home,
  Video,
  Bell,
  ImageIcon,
  MoreHorizontal,
  BookOpen,
  Calendar,
  HandHeart,
  Heart,
  Phone,
  Info,
  Music,
  FileText,
  X,
  Sparkles,
} from 'lucide-react'
import { useNotificationBadges } from '@/lib/hooks/use-notification-badges'
import type { NotificationCategory } from '@/types'

const mainTabs: Array<{ href: string; icon: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>; labelFr: string; labelEn: string; notificationKey?: NotificationCategory }> = [
  { href: '', icon: Home, labelFr: 'Accueil', labelEn: 'Home' },
  { href: '/messages', icon: Video, labelFr: 'Messages', labelEn: 'Sermons', notificationKey: 'messages' },
  { href: '/annonces', icon: Bell, labelFr: 'Annonces', labelEn: 'News', notificationKey: 'annonces' },
  { href: '/galerie', icon: ImageIcon, labelFr: 'Galerie', labelEn: 'Gallery' },
]

const morePages: Array<{ key: string; icon: ComponentType<{ size?: number; className?: string }>; labelFr: string; labelEn: string; path: string; color: string; bgColor: string; activeGrad: string; notificationKey?: NotificationCategory }> = [
  { key: 'enseignements', icon: BookOpen, labelFr: 'Enseignements', labelEn: 'Teachings', path: '/enseignements', color: 'text-indigo-600', bgColor: 'bg-indigo-100', activeGrad: 'bg-indigo-600', notificationKey: 'enseignements' },
  { key: 'videos', icon: Video, labelFr: 'Videos', labelEn: 'Videos', path: '/videos', color: 'text-rose-500', bgColor: 'bg-rose-100', activeGrad: 'bg-rose-500' },
  { key: 'textes', icon: FileText, labelFr: 'Textes', labelEn: 'Texts', path: '/textes', color: 'text-emerald-600', bgColor: 'bg-emerald-100', activeGrad: 'bg-emerald-600', notificationKey: 'enseignements' },
  { key: 'audios', icon: Music, labelFr: 'Podcasts', labelEn: 'Podcasts', path: '/audios', color: 'text-purple-600', bgColor: 'bg-purple-100', activeGrad: 'bg-purple-600', notificationKey: 'audios' },
  { key: 'evenements', icon: Calendar, labelFr: 'Evenements', labelEn: 'Events', path: '/evenements', color: 'text-teal-600', bgColor: 'bg-teal-100', activeGrad: 'bg-teal-600' },
  { key: 'priere', icon: HandHeart, labelFr: 'Priere', labelEn: 'Prayer', path: '/priere', color: 'text-sky-600', bgColor: 'bg-sky-100', activeGrad: 'bg-sky-600', notificationKey: 'priere' },
  { key: 'dons', icon: Heart, labelFr: 'Dons', labelEn: 'Give', path: '/dons', color: 'text-rose-600', bgColor: 'bg-rose-100', activeGrad: 'bg-rose-600', notificationKey: 'dons' },
  { key: 'a-propos', icon: Info, labelFr: 'A propos', labelEn: 'About', path: '/a-propos', color: 'text-slate-600', bgColor: 'bg-slate-100', activeGrad: 'bg-slate-600' },
  { key: 'contact', icon: Phone, labelFr: 'Contact', labelEn: 'Contact', path: '/contact', color: 'text-cyan-600', bgColor: 'bg-cyan-100', activeGrad: 'bg-cyan-600' },
]

function NotificationBadge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="absolute -right-2 -top-1 z-20 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm">
      {count > 9 ? '9+' : count}
    </span>
  )
}

export default function BottomNav({ locale }: { locale: string }) {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const { badges } = useNotificationBadges()

  const isActive = (href: string) => {
    const full = `/${locale}${href}`
    return pathname === full || (href && pathname.startsWith(full))
  }

  const moreActive = morePages.some(page => isActive(page.path))

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur-md md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
          {mainTabs.map(tab => {
            const active = isActive(tab.href)
            const Icon = tab.icon
            const label = locale === 'fr' ? tab.labelFr : tab.labelEn
            const count = tab.notificationKey ? badges[tab.notificationKey] : 0

            return (
              <Link key={tab.href} href={`/${locale}${tab.href}`} className="group relative flex flex-col items-center gap-0.5 px-3 py-1">
                <div className={`relative transition-all duration-300 ${active ? 'text-cifm-blue-600' : 'text-gray-400 group-active:scale-90'}`}>
                  {active && (
                    <motion.div layoutId="bottomNavGlow" className="absolute -inset-2 rounded-full bg-cifm-blue-100/60" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                  )}
                  <Icon size={22} className="relative z-10" strokeWidth={active ? 2.3 : 1.8} />
                  <NotificationBadge count={count} />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${active ? 'text-cifm-blue-600' : 'text-gray-400'}`}>{label}</span>
              </Link>
            )
          })}

          <button onClick={() => setShowMore(true)} className="group relative flex flex-col items-center gap-0.5 px-3 py-1">
            <div className={`relative transition-all duration-300 ${moreActive ? 'text-cifm-blue-600' : 'text-gray-400 group-active:scale-90'}`}>
              {moreActive && <div className="absolute -inset-2 rounded-full bg-cifm-blue-100/60" />}
              <MoreHorizontal size={22} className="relative z-10" strokeWidth={moreActive ? 2.3 : 1.8} />
            </div>
            <span className={`text-[10px] font-medium ${moreActive ? 'text-cifm-blue-600' : 'text-gray-400'}`}>{locale === 'fr' ? 'Plus' : 'More'}</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {showMore && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm" onClick={() => setShowMore(false)} />
            <motion.div
              ref={sheetRef}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[90] max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="flex justify-center pb-1 pt-3">
                <div className="h-1 w-10 rounded-full bg-gray-300" />
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <Image src="/images/logo/logo-cifm4.png" alt="" width={28} height={28} className="rounded-lg" />
                  <span className="font-lora text-sm font-semibold text-cifm-blue-700">{locale === 'fr' ? 'Toutes les pages' : 'All pages'}</span>
                </div>
                <button onClick={() => setShowMore(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 px-4 py-5">
                {morePages.map((page, index) => {
                  const Icon = page.icon
                  const active = isActive(page.path)
                  const label = locale === 'fr' ? page.labelFr : page.labelEn
                  const count = page.notificationKey ? badges[page.notificationKey] : 0

                  return (
                    <motion.div key={page.key} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.04, duration: 0.25 }}>
                      <Link
                        href={`/${locale}${page.path}`}
                        onClick={() => setShowMore(false)}
                        className={`group flex flex-col items-center gap-2 rounded-2xl p-3 transition-all duration-300 active:scale-95 ${active ? 'bg-cifm-blue-50 shadow-sm' : 'hover:bg-gray-50'}`}
                      >
                        <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-active:scale-110 ${active ? `${page.activeGrad} text-white shadow-lg` : `${page.bgColor} ${page.color} group-hover:shadow-[0_0_20px_rgba(99,102,241,0.12)]`}`}>
                          <Icon size={22} />
                          <NotificationBadge count={count} />
                        </div>
                        <span className={`text-center text-[11px] font-medium leading-tight ${active ? 'text-cifm-blue-700' : 'text-gray-600'}`}>{label}</span>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              <div className="flex items-center justify-center gap-2 border-t border-gray-50 px-5 py-4 text-gray-300">
                <Sparkles size={10} />
                <span className="text-[9px] uppercase tracking-widest">CIFM4</span>
                <Sparkles size={10} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
