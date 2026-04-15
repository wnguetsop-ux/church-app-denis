'use client'
import Link from 'next/link'

export default function Header({ locale }: { locale: string }) {
  const other = locale === 'fr' ? 'en' : 'fr'
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-lora font-semibold text-cifm-blue-700 text-lg">
          CIFM4
        </Link>
        <div className="flex items-center gap-3">
          <Link href={`/${other}`}
                className="text-xs font-semibold text-gray-500 hover:text-cifm-blue-600 transition-colors uppercase border border-gray-200 rounded-full px-2.5 py-1">
            {other.toUpperCase()}
          </Link>
        </div>
      </div>
    </header>
  )
}
