'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Camera, Film, ImageIcon } from 'lucide-react'
import AlbumFilter from './AlbumFilter'
import GalleryCard from './GalleryCard'
import GalleryLightbox from './GalleryLightbox'
import type { GalleryAlbum, StaticGalleryItem } from '@/data/gallery-data'
import { galleryItems } from '@/data/gallery-data'
import type { Locale } from '@/types'

interface Props {
  locale: Locale
}

const INITIAL_COUNT = 24
const LOAD_MORE_COUNT = 12

export default function GalleryGrid({ locale }: Props) {
  const t = useTranslations()
  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum>('all')
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Sorted by date descending (most recent first)
  const sorted = useMemo(
    () => [...galleryItems].sort((a, b) => b.date.localeCompare(a.date)),
    []
  )

  // Counts per album
  const counts = useMemo(() => {
    const c: Record<GalleryAlbum, number> = {
      all: sorted.length,
      cultes: 0,
      evangelisation: 0,
      communaute: 0,
      versets: 0,
    }
    for (const item of sorted) {
      c[item.album]++
    }
    return c
  }, [sorted])

  // Filtered items
  const filtered = useMemo(
    () => activeAlbum === 'all' ? sorted : sorted.filter(i => i.album === activeAlbum),
    [sorted, activeAlbum]
  )

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  // Stats
  const photoCount = filtered.filter(i => i.type === 'image').length
  const videoCount = filtered.filter(i => i.type === 'video').length

  function handleAlbumChange(album: GalleryAlbum) {
    setActiveAlbum(album)
    setVisibleCount(INITIAL_COUNT)
  }

  function openLightbox(index: number) {
    setLightboxIndex(index)
  }

  return (
    <div className="space-y-6">
      {/* Album filter pills */}
      <AlbumFilter active={activeAlbum} onChange={handleAlbumChange} counts={counts} />

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Camera className="w-3.5 h-3.5" />
          {photoCount} {t(photoCount === 1 ? 'gallery.photo' : 'gallery.photos')}
        </span>
        {videoCount > 0 && (
          <span className="flex items-center gap-1">
            <Film className="w-3.5 h-3.5" />
            {videoCount} {t(videoCount === 1 ? 'gallery.video' : 'gallery.videos')}
          </span>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <ImageIcon className="w-12 h-12 mb-3 text-gray-300" />
          <p className="text-sm">{t('common.no_content')}</p>
        </div>
      ) : (
        <motion.div
          layout
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((item, i) => (
              <GalleryCard
                key={item.id}
                item={item}
                locale={locale}
                index={i}
                onClick={() => openLightbox(i)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setVisibleCount(v => v + LOAD_MORE_COUNT)}
            className="px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:border-cifm-blue-400 hover:text-cifm-blue-600 transition-colors shadow-sm"
          >
            {t('gallery.load_more')} ({filtered.length - visibleCount} {t('gallery.remaining')})
          </motion.button>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <GalleryLightbox
            items={visible}
            currentIndex={lightboxIndex}
            locale={locale}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
