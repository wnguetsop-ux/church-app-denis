'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Calendar, User, Tag } from 'lucide-react'
import type { StaticSermon } from '@/data/sermons-data'
import type { Locale } from '@/types'

interface Props {
  sermon: StaticSermon
  locale: Locale
  featured?: boolean
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function SermonCard({ sermon, locale, featured = false }: Props) {
  const title = sermon.title[locale]
  const description = sermon.description[locale]
  const series = sermon.series?.[locale]
  const isPlaceholder = sermon.youtubeVideoId.startsWith('_placeholder')
  const thumbnailUrl = isPlaceholder
    ? null
    : `https://img.youtube.com/vi/${sermon.youtubeVideoId}/mqdefault.jpg`

  const date = new Date(sermon.publishedAt).toLocaleDateString(
    locale === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  if (featured) {
    return (
      <motion.div
        variants={cardVariants}
        className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300"
      >
        <div className="relative aspect-video bg-cifm-blue-100 overflow-hidden">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover group-hover-zoom"
              sizes="(max-width: 768px) 100vw, 640px"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-cifm-blue-600 to-cifm-blue-800 flex items-center justify-center">
              <div className="text-center text-white/80">
                <Play className="w-12 h-12 mx-auto mb-2 opacity-60" />
                <p className="text-xs opacity-50">
                  {locale === 'fr' ? 'Vidéo YouTube à venir' : 'YouTube video coming soon'}
                </p>
              </div>
            </div>
          )}
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Play className="w-7 h-7 text-cifm-blue-700 ml-1" fill="currentColor" />
            </div>
          </div>
          {/* Featured badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-cifm-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              {locale === 'fr' ? 'À la une' : 'Featured'}
            </span>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {series && (
            <span className="text-cifm-blue-600 text-xs font-semibold uppercase tracking-wide">
              {series}
            </span>
          )}
          <h3 className="font-lora text-xl font-semibold text-gray-900 leading-tight">
            {title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {sermon.speaker}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {date}
            </span>
          </div>
          <div className="flex gap-1.5 flex-wrap pt-1">
            {sermon.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="flex items-center gap-0.5 bg-blue-50 text-cifm-blue-600 text-xs px-2 py-0.5 rounded-full"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.10)' }}
      className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 transition-shadow"
    >
      <Link href={`/${locale}/messages/${sermon.id}`} className="block">
        <div className="relative aspect-video bg-cifm-blue-100 overflow-hidden">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover group-hover-zoom"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-cifm-blue-600 to-cifm-blue-800 flex items-center justify-center">
              <Play className="w-8 h-8 text-white/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="w-4 h-4 text-cifm-blue-700 ml-0.5" fill="currentColor" />
            </div>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {series && (
            <span className="text-cifm-blue-600 text-[11px] font-semibold uppercase tracking-wide">
              {series}
            </span>
          )}
          <h3 className="font-lora text-base font-semibold text-gray-900 leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
            {description}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {sermon.speaker.split(' ').slice(-2).join(' ')}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {date}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
