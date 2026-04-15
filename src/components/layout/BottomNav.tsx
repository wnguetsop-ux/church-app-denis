'use client'
import Link from 'next/link'
import { Home, Video, Bell, Image, MoreHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function BottomNav({ locale }: { locale: string }) {
  const pathname = usePathname()
  const tabs = [
    { href: `/${locale}`,              icon: Home,           label: 'Accueil' },
    { href: `/${locale}/messages`,     icon: Video,          label: 'Messages' },
    { href: `/${locale}/annonces`,     icon: Bell,           label: 'Annonces' },
    { href: `/${locale}/galerie`,      icon: Image,          label: 'Galerie' },
    { href: `/${locale}/a-propos`,     icon: MoreHorizontal, label: 'Plus' },
  ]
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around h-16">
        {tabs.map(tab => {
          const active = pathname === tab.href || (tab.href !== `/${locale}` && pathname.startsWith(tab.href))
          return (
            <Link key={tab.href} href={tab.href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                    active ? 'text-cifm-blue-600' : 'text-gray-400'
                  }`}>
              <tab.icon size={22} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
