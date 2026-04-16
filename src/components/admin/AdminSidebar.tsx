'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard, Video, BookOpen, Megaphone, Calendar,
  ImageIcon, HandHeart, Heart, Phone, Church, Menu, X,
  BellRing, LogOut, ExternalLink
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'

const navItems = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, color: 'from-slate-500 to-slate-600', bg: 'bg-slate-50', text: 'text-slate-600' },
  { href: '/admin/messages', label: 'Messages / Sermons', icon: Video, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
  { href: '/admin/enseignements', label: 'Enseignements', icon: BookOpen, color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { href: '/admin/annonces', label: 'Annonces', icon: Megaphone, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' },
  { href: '/admin/evenements', label: '\u00C9v\u00E9nements', icon: Calendar, color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50', text: 'text-teal-600' },
  { href: '/admin/galerie', label: 'Galerie', icon: ImageIcon, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50', text: 'text-pink-600' },
  { href: '/admin/prieres', label: 'Pri\u00E8res re\u00E7ues', icon: HandHeart, color: 'from-sky-500 to-sky-600', bg: 'bg-sky-50', text: 'text-sky-600' },
  { href: '/admin/dons', label: 'Dons', icon: Heart, color: 'from-rose-500 to-rose-600', bg: 'bg-rose-50', text: 'text-rose-600' },
  { href: '/admin/contact', label: 'Contact', icon: Phone, color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50', text: 'text-cyan-600' },
  { href: '/admin/a-propos', label: '\u00C0 propos / \u00C9glise', icon: Church, color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', text: 'text-violet-600' },
  { href: '/admin/notifications', label: 'Notifications', icon: BellRing, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', text: 'text-orange-600' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user, signOut } = useAuth()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const nav = (
    <nav className="space-y-1 px-3 py-4">
      {navItems.map(({ href, label, icon: Icon, color, bg, text }) => {
        const active = isActive(href)
        return (
          <a
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`
              flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group
              ${active
                ? 'bg-gradient-to-r ' + color + ' text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200
              ${active
                ? 'bg-white/20'
                : bg + ' ' + text + ' group-hover:scale-110'
              }
            `}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="truncate">{label}</span>
          </a>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-3 right-14 z-50 w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-cifm-blue-600 transition-colors"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-72 bg-white border-r border-gray-100
        overflow-y-auto transition-transform duration-300 flex flex-col shadow-xl md:shadow-none
        md:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-cifm-blue-700 to-cifm-blue-800 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/15">
              <Image src="/images/logo/logo-cifm4.png" alt="CIFM4" width={28} height={28} className="rounded-md" />
            </div>
            <div>
              <p className="font-lora font-semibold text-white text-base">CIFM4</p>
              <p className="text-[10px] text-blue-200/70 tracking-wider uppercase">Administration</p>
            </div>
          </div>

          {/* Visit site link */}
          <a
            href="/fr"
            target="_blank"
            className="mt-3 flex items-center gap-2 text-[11px] text-blue-200/70 hover:text-white transition-colors"
          >
            <ExternalLink size={11} />
            Voir le site
          </a>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          {nav}
        </div>

        {/* User info + sign out */}
        {user && (
          <div className="border-t border-gray-100 px-4 py-4 bg-gray-50/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cifm-blue-500 to-cifm-blue-600 flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-white">
                  {user.email?.charAt(0).toUpperCase() ?? 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{user.displayName ?? 'Administrateur'}</p>
                <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={14} />
              Se d\u00E9connecter
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
