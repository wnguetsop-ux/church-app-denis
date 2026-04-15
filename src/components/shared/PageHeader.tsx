'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

interface Props {
  title: string
  subtitle?: string
  backgroundImage?: string
  showLogo?: boolean
}

export default function PageHeader({ title, subtitle, backgroundImage, showLogo = true }: Props) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const logoBlock = showLogo && (
    <div className="flex items-center gap-2.5 mb-3">
      <div className="p-0.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15">
        <Image
          src="/images/logo/logo-cifm4.png"
          alt="CIFM4"
          width={36}
          height={36}
          className="rounded-md"
        />
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-[1px] bg-cifm-gold-400/60" />
        <span className="text-[9px] tracking-[0.2em] uppercase text-cifm-gold-400/80 font-semibold">CIFM4</span>
      </div>
    </div>
  )

  if (!backgroundImage) {
    return (
      <div className="bg-cifm-blue-700 text-white px-4 py-10">
        <div className="max-w-2xl mx-auto">
          {logoBlock}
          <h1 className="font-lora text-2xl md:text-3xl font-semibold">{title}</h1>
          {subtitle && <p className="text-blue-200 mt-2 text-sm leading-relaxed">{subtitle}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="relative text-white overflow-hidden">
      {/* Ken Burns background */}
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

      {/* Dual gradient for depth + readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-cifm-blue-900/95 via-cifm-blue-900/65 to-cifm-blue-900/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-4 pt-20 pb-6 md:pt-28 md:pb-8">
        <div className="max-w-2xl mx-auto">
          {logoBlock}
          <h1 className="font-lora text-2xl md:text-3xl font-semibold drop-shadow-lg">{title}</h1>
          {subtitle && (
            <p className="text-white/80 mt-2 text-sm leading-relaxed drop-shadow-md">{subtitle}</p>
          )}
          <div className="mt-4 w-10 h-[1.5px] bg-gradient-to-r from-cifm-gold-400/80 to-transparent rounded-full" />
        </div>
      </div>
    </div>
  )
}
