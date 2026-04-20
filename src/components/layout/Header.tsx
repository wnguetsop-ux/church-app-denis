'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState, type ComponentType } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Home,
  Video,
  BookOpen,
  Bell,
  Calendar,
  ImageIcon,
  HandHeart,
  Heart,
  Phone,
  Info,
  Music,
  FileText,
  Menu,
  X,
  Globe,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useNotificationBadges } from '@/lib/hooks/use-notification-badges'
import type { NotificationCategory } from '@/types'

const allPages: Array<{
  key: string
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  labelFr: string
  labelEn: string
  path: string
  color: string
  bgHover: string
  bgActive: string
  activeDot: string
  notificationKey?: NotificationCategory
}> = [
  { key: 'home', icon: Home, labelFr: 'Accueil', labelEn: 'Home', path: '', color: 'text-blue-600', bgHover: 'group-hover:bg-blue-50', bgActive: 'bg-blue-50', activeDot: 'bg-blue-600' },
  { key: 'messages', icon: Video, labelFr: 'Messages', labelEn: 'Sermons', path: '/messages', color: 'text-red-500', bgHover: 'group-hover:bg-red-50', bgActive: 'bg-red-50', activeDot: 'bg-red-500', notificationKey: 'messages' },
  { key: 'enseignements', icon: BookOpen, labelFr: 'Enseignements', labelEn: 'Teachings', path: '/enseignements', color: 'text-indigo-600', bgHover: 'group-hover:bg-indigo-50', bgActive: 'bg-indigo-50', activeDot: 'bg-indigo-600', notificationKey: 'enseignements' },
  { key: 'videos', icon: Video, labelFr: 'Videos', labelEn: 'Videos', path: '/videos', color: 'text-rose-500', bgHover: 'group-hover:bg-rose-50', bgActive: 'bg-rose-50', activeDot: 'bg-rose-500' },
  { key: 'textes', icon: FileText, labelFr: 'Textes', labelEn: 'Texts', path: '/textes', color: 'text-emerald-600', bgHover: 'group-hover:bg-emerald-50', bgActive: 'bg-emerald-50', activeDot: 'bg-emerald-600', notificationKey: 'enseignements' },
  { key: 'audios', icon: Music, labelFr: 'Podcasts', labelEn: 'Podcasts', path: '/audios', color: 'text-purple-600', bgHover: 'group-hover:bg-purple-50', bgActive: 'bg-purple-50', activeDot: 'bg-purple-600', notificationKey: 'audios' },
  { key: 'annonces', icon: Bell, labelFr: 'Annonces', labelEn: 'Announcements', path: '/annonces', color: 'text-amber-500', bgHover: 'group-hover:bg-amber-50', bgActive: 'bg-amber-50', activeDot: 'bg-amber-500', notificationKey: 'annonces' },
  { key: 'evenements', icon: Calendar, labelFr: 'Evenements', labelEn: 'Events', path: '/evenements', color: 'text-teal-600', bgHover: 'group-hover:bg-teal-50', bgActive: 'bg-teal-50', activeDot: 'bg-teal-600' },
  { key: 'galerie', icon: ImageIcon, labelFr: 'Galerie', labelEn: 'Gallery', path: '/galerie', color: 'text-pink-500', bgHover: 'group-hover:bg-pink-50', bgActive: 'bg-pink-50', activeDot: 'bg-pink-500' },
  { key: 'priere', icon: HandHeart, labelFr: 'Priere', labelEn: 'Prayer', path: '/priere', color: 'text-sky-600', bgHover: 'group-hover:bg-sky-50', bgActive: 'bg-sky-50', activeDot: 'bg-sky-600', notificationKey: 'priere' },
  { key: 'dons', icon: Heart, labelFr: 'Dons', labelEn: 'Give', path: '/dons', color: 'text-rose-600', bgHover: 'group-hover:bg-rose-50', bgActive: 'bg-rose-50', activeDot: 'bg-rose-600', notificationKey: 'dons' },
  { key: 'a-propos', icon: Info, labelFr: 'A propos', labelEn: 'About', path: '/a-propos', color: 'text-slate-600', bgHover: 'group-hover:bg-slate-50', bgActive: 'bg-slate-50', activeDot: 'bg-slate-600' },
  { key: 'contact', icon: Phone, labelFr: 'Contact', labelEn: 'Contact', path: '/contact', color: 'text-cyan-600', bgHover: 'group-hover:bg-cyan-50', bgActive: 'bg-cyan-50', activeDot: 'bg-cyan-600' },
]

function NotificationBadge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="absolute -right-1 -top-1 z-20 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm">
      {count > 9 ? '9+' : count}
    </span>
  )
}

export default function Header({ locale }: { locale: string }) {
  const other = locale === 'fr' ? 'en' : 'fr'
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { badges } = useNotificationBadges()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-gray-100 bg-white/95 shadow-lg shadow-cifm-blue-900/5 backdrop-blur-md' : 'border-b border-gray-100 bg-white/90 backdrop-blur-sm'}`}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href={`/${locale}`} className="group flex items-center gap-2.5">
              <div className="relative">
                <Image src="/images/logo/logo-cifm4.png" alt="CIFM4" width={38} height={38} className="rounded-lg transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 rounded-lg bg-cifm-blue-400/0 transition-colors duration-300 group-hover:bg-cifm-blue-400/20" />
              </div>
              <div className="hidden sm:block">
                <p className="font-lora text-base font-semibold leading-tight text-cifm-blue-700">CIFM4</p>
                <p className="text-[9px] tracking-wider text-gray-400">COMMUNAUTE</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {allPages.map(page => {
                const Icon = page.icon
                const active = isActive(page.path)
                const label = locale === 'fr' ? page.labelFr : page.labelEn
                const count = page.notificationKey ? badges[page.notificationKey] : 0

                return (
                  <Link key={page.key} href={`/${locale}${page.path}`} className="group relative">
                    <div className={`flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 transition-all duration-300 ${active ? `${page.color} ${page.bgActive}` : `text-gray-400 hover:${page.color}`}`}>
                      <div className={`absolute inset-0 rounded-xl bg-transparent ${page.bgHover} transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.12)]`} />
                      <div className={`relative z-10 transition-all duration-300 group-hover:scale-125 ${!active ? page.color : ''}`}>
                        <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                        <NotificationBadge count={count} />
                      </div>
                      <span className="relative z-10 whitespace-nowrap text-[9px] font-medium leading-tight">{label}</span>
                    </div>
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${page.activeDot}`}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href={`/${other}${pathname.replace(`/${locale}`, '')}`}
                className="group flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 transition-all duration-300 hover:border-cifm-blue-300 hover:text-cifm-blue-600 hover:shadow-[0_0_12px_rgba(37,99,235,0.12)]"
              >
                <Globe size={14} className="transition-transform duration-300 group-hover:rotate-45" />
                {other.toUpperCase()}
              </Link>

              <button onClick={() => setMobileOpen(!mobileOpen)} className="relative rounded-xl p-2 text-gray-600 transition-all duration-300 hover:bg-cifm-blue-50 hover:text-cifm-blue-600 lg:hidden" aria-label="Menu">
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

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 right-0 top-0 z-[70] w-[85%] max-w-sm overflow-y-auto bg-white shadow-2xl"
            >
              <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white/95 px-5 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                  <Image src="/images/logo/logo-cifm4.png" alt="CIFM4" width={32} height={32} className="rounded-lg" />
                  <div>
                    <p className="font-lora text-sm font-semibold text-cifm-blue-700">CIFM4</p>
                    <p className="text-[8px] uppercase tracking-wider text-gray-400">Navigation</p>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-1 px-3 py-4">
                {allPages.map((page, index) => {
                  const Icon = page.icon
                  const active = isActive(page.path)
                  const label = locale === 'fr' ? page.labelFr : page.labelEn
                  const count = page.notificationKey ? badges[page.notificationKey] : 0

                  return (
                    <motion.div key={page.key} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04, duration: 0.3 }}>
                      <Link
                        href={`/${locale}${page.path}`}
                        onClick={() => setMobileOpen(false)}
                        className={`group flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all duration-300 ${active ? 'bg-cifm-blue-50 text-cifm-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-cifm-blue-600'}`}
                      >
                        <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(99,102,241,0.15)] ${active ? 'bg-gray-900 text-white' : `bg-gray-50 ${page.color} group-hover:bg-gray-100`}`}>
                          <Icon size={20} />
                          <NotificationBadge count={count} />
                        </div>
                        <span className="flex-1 text-sm font-medium">{label}</span>
                        <ChevronRight size={16} className={`transition-all duration-300 ${active ? 'text-cifm-blue-400' : 'text-gray-300 group-hover:translate-x-1 group-hover:text-cifm-blue-400'}`} />
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              <div className="border-t border-gray-100 px-5 py-4">
                <Link href={`/${other}${pathname.replace(`/${locale}`, '')}`} onClick={() => setMobileOpen(false)} className="group flex items-center gap-3 text-gray-500 transition-colors hover:text-cifm-blue-600">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 transition-colors group-hover:bg-cifm-blue-100">
                    <Globe size={20} className="transition-colors group-hover:text-cifm-blue-600" />
                  </div>
                  <span className="text-sm font-medium">{locale === 'fr' ? 'Switch to English' : 'Passer en Francais'}</span>
                </Link>
              </div>

              <div className="px-5 py-6 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <Sparkles size={12} />
                  <span className="text-[10px] uppercase tracking-widest">CIFM4 App</span>
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
