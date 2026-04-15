'use client'

import { motion } from 'framer-motion'
import { Play, ZoomIn } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import type { StaticGalleryItem } from '@/data/gallery-data'
import type { Locale } from '@/types'

interface Props {
  item: StaticGalleryItem
  locale: Locale
  index: number
  onClick: () => void
}

export default function GalleryCard({ item, locale, index, onClick }: Props) {
  const [loaded, setLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const alt = item.alt[locale] || item.alt.fr

  const isLandscape = item.aspect === 'landscape'
  const spanClass = isLandscape ? 'col-span-2' : ''
  const aspectClass = isLandscape ? 'aspect-video' : 'aspect-square'

  return (
    <motion.button
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35, ease: 'easeOut' },
        },
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative group rounded-2xl overflow-hidden bg-gray-100 cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cifm-blue-400
        ${spanClass}
      `}
      onMouseEnter={() => {
        if (item.type === 'video' && videoRef.current) {
          videoRef.current.play().catch(() => {})
        }
      }}
      onMouseLeave={() => {
        if (item.type === 'video' && videoRef.current) {
          videoRef.current.pause()
          videoRef.current.currentTime = 0
        }
      }}
    >
      {/* Skeleton placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />
      )}

      {item.type === 'image' ? (
        <Image
          src={item.src}
          alt={alt}
          width={400}
          height={400}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`
            w-full h-full object-cover ${aspectClass} transition-transform duration-300
            group-hover:scale-[1.08]
            ${loaded ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <div className={`relative ${aspectClass}`}>
          <video
            ref={videoRef}
            src={item.src}
            muted
            playsInline
            loop
            preload="metadata"
            className={`
              w-full h-full object-cover transition-transform duration-300
              group-hover:scale-[1.08]
              ${loaded ? 'opacity-100' : 'opacity-0'}
            `}
            onLoadedData={() => setLoaded(true)}
          />
        </div>
      )}

      {/* Hover overlay */}
      <div className="
        absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
        flex items-end justify-between p-3
      ">
        <p className="text-white text-xs font-medium leading-tight line-clamp-2 max-w-[80%]">
          {alt}
        </p>
        <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          {item.type === 'video'
            ? <Play className="w-4 h-4 text-white fill-white" />
            : <ZoomIn className="w-4 h-4 text-white" />
          }
        </div>
      </div>

      {/* Video badge */}
      {item.type === 'video' && (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
          <Play className="w-3 h-3 fill-white" />
          Vidéo
        </div>
      )}
    </motion.button>
  )
}
