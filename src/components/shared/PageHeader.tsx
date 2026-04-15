'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

interface Props {
  title: string
  subtitle?: string
  backgroundImage?: string
}

export default function PageHeader({ title, subtitle, backgroundImage }: Props) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (!backgroundImage) {
    return (
      <div className="bg-cifm-blue-700 text-white px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-lora text-2xl md:text-3xl font-semibold">{title}</h1>
          {subtitle && <p className="text-blue-200 mt-2 text-sm leading-relaxed">{subtitle}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="relative text-white overflow-hidden">
      {/* Ken Burns: slow zoom + slight pan on the background image */}
      <div
        className={`absolute inset-0 ${reducedMotion ? '' : 'animate-ken-burns'}`}
        style={{ willChange: reducedMotion ? 'auto' : 'transform' }}
      >
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-cifm-blue-900/95 via-cifm-blue-900/50 to-cifm-blue-900/20" />

      {/* Content */}
      <div className="relative z-10 px-4 pt-20 pb-6 md:pt-28 md:pb-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-lora text-2xl md:text-3xl font-semibold drop-shadow-lg">{title}</h1>
          {subtitle && (
            <p className="text-white/80 mt-2 text-sm leading-relaxed drop-shadow-md">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}
