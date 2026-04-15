'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Slide {
  image: string
  title: string
  subtitle: string
  cta?: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
}

interface Props {
  slides: Slide[]
  interval?: number
  logo?: string
}

export default function HeroSlider({ slides, interval = 6000, logo }: Props) {
  const [current, setCurrent] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return
    timerRef.current = setInterval(nextSlide, interval)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [nextSlide, interval, slides.length])

  const goTo = (index: number) => {
    setCurrent(index)
    // Reset timer on manual nav
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(nextSlide, interval)
  }

  // Touch/swipe support
  const touchStartX = useRef(0)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goTo((current + 1) % slides.length)
      } else {
        goTo((current - 1 + slides.length) % slides.length)
      }
    }
  }

  const slide = slides[current]

  return (
    <section
      className="relative w-full h-[75vh] min-h-[480px] max-h-[700px] overflow-hidden text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Hero slider"
    >
      {/* Background images with crossfade + Ken Burns */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div className={`absolute inset-0 ${reducedMotion ? '' : 'animate-ken-burns'}`}>
            <Image
              src={slide.image}
              alt=""
              fill
              className="object-cover"
              priority={current === 0}
              sizes="100vw"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-cifm-blue-900/90 via-cifm-blue-900/40 to-cifm-blue-900/20" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Logo on first slide */}
          {logo && current === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mb-2"
            >
              <Image
                src={logo}
                alt="CIFM4"
                width={72}
                height={72}
                className="rounded-2xl shadow-lg shadow-black/20"
              />
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="font-lora text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed max-w-lg mx-auto drop-shadow-md">
                {slide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTAs */}
          {(slide.cta || slide.ctaSecondary) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
            >
              {slide.cta && (
                <a
                  href={slide.cta.href}
                  className="bg-white text-cifm-blue-700 rounded-full px-6 py-3 font-semibold hover:bg-blue-50 active:scale-[0.97] transition-all shadow-md"
                >
                  {slide.cta.label}
                </a>
              )}
              {slide.ctaSecondary && (
                <a
                  href={slide.ctaSecondary.href}
                  className="border border-white/40 text-white rounded-full px-6 py-3 hover:bg-white/10 active:scale-[0.97] transition-all"
                >
                  {slide.ctaSecondary.label}
                </a>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-8 bg-white'
                  : 'w-1.5 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
