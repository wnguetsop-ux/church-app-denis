'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Play, Pause, Download } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { GalleryViewItem } from '@/lib/hooks/use-gallery'
import type { Locale } from '@/types'

interface Props {
  items: GalleryViewItem[]
  currentIndex: number
  locale: Locale
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function GalleryLightbox({ items, currentIndex, locale, onClose, onNavigate }: Props) {
  const item = items[currentIndex]
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const alt = item.alt[locale] || item.alt.fr

  const goPrev = useCallback(() => {
    if (currentIndex > 0) onNavigate(currentIndex - 1)
  }, [currentIndex, onNavigate])

  const goNext = useCallback(() => {
    if (currentIndex < items.length - 1) onNavigate(currentIndex + 1)
  }, [currentIndex, items.length, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, goPrev, goNext])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function togglePlay() {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white z-10">
        <span className="text-sm text-white/70">
          {currentIndex + 1} / {items.length}
        </span>
        <div className="flex items-center gap-2">
          {item.type === 'image' && (
            <a
              href={item.src}
              download
              onClick={(e) => e.stopPropagation()}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <Download className="w-5 h-5" />
            </a>
          )}
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Media area */}
      <div
        className="flex-1 flex items-center justify-center relative px-4"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStart === null) return
          const diff = e.changedTouches[0].clientX - touchStart
          if (diff > 60) goPrev()
          if (diff < -60) goNext()
          setTouchStart(null)
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="max-w-full max-h-[75vh] flex items-center justify-center"
          >
            {item.type === 'image' ? (
              <Image
                src={item.src}
                alt={alt}
                width={1200}
                height={900}
                className="max-h-[75vh] w-auto object-contain rounded-lg"
                priority
              />
            ) : (
              <div className="relative">
                <video
                  key={item.id}
                  ref={videoRef}
                  src={item.src}
                  poster={item.thumbnailSrc}
                  playsInline
                  className="max-h-[75vh] w-auto rounded-lg"
                  onClick={togglePlay}
                  onLoadedData={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </button>
                )}
                {isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
                  >
                    <Pause className="w-5 h-5 text-white fill-white" />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows — desktop only */}
        {currentIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors hidden md:flex"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}
        {currentIndex < items.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors hidden md:flex"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Caption */}
      <div className="px-4 py-4 text-center">
        <p className="text-white/90 text-sm font-medium">{alt}</p>
        <p className="text-white/50 text-xs mt-1">
          {new Date(item.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-CA', {
            day: 'numeric', month: 'long', year: 'numeric'
          })}
        </p>
      </div>
    </motion.div>
  )
}
