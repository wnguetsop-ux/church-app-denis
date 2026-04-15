'use client'

import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Video, BookOpen, Megaphone, Calendar,
  ImageIcon, HandHeart, Heart, Phone, Church, Menu, X
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/messages', label: 'Messages / Sermons', icon: Video },
  { href: '/admin/enseignements', label: 'Enseignements', icon: BookOpen },
  { href: '/admin/annonces', label: 'Annonces', icon: Megaphone },
  { href: '/admin/evenements', label: 'Événements', icon: Calendar },
  { href: '/admin/galerie', label: 'Galerie', icon: ImageIcon },
  { href: '/admin/prieres', label: 'Prières reçues', icon: HandHeart },
  { href: '/admin/dons', label: 'Dons', icon: Heart },
  { href: '/admin/contact', label: 'Contact', icon: Phone },
  { href: '/admin/a-propos', label: 'À propos / Église', icon: Church },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const nav = (
    <nav className="space-y-1 py-4">
      {navItems.map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={`
            flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg mx-2 transition-colors
            ${isActive(href)
              ? 'bg-cifm-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
        >
          <Icon className="w-4.5 h-4.5 shrink-0" />
          {label}
        </a>
      ))}
    </nav>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-3 right-14 z-50 w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center text-gray-600"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200
        overflow-y-auto transition-transform duration-200
        md:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="px-4 py-4 border-b border-gray-100">
          <p className="font-lora font-semibold text-cifm-blue-700 text-lg">CIFM4</p>
          <p className="text-xs text-gray-500">Administration</p>
        </div>
        {nav}
      </aside>
    </>
  )
}
