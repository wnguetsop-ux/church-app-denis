'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, Play, Star, Tag, User } from 'lucide-react'
import type { StaticSermon } from '@/data/sermons-data'
import type { Locale } from '@/types'
import { getYouTubeThumbnailUrl } from '@/lib/media/youtube'

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
  const title = sermon.title[locale] || sermon.title.fr
  const description = sermon.description[locale] || sermon.description.fr
  const thumbnail = getYouTubeThumbnailUrl(sermon.youtubeVideoId)
  const hasVideo = Boolean(thumbnail)

  const date = new Date(sermon.publishedAt).toLocaleDateString(
    locale === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.10)' }}
      className={`group overflow-hidden rounded-2xl bg-white shadow-sm ${featured ? 'ring-2 ring-cifm-gold-400/40' : 'border border-gray-100'}`}
    >
      <Link href={`/${locale}/messages/${sermon.id}`} className="block">
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          {hasVideo ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 420px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <Play className="h-12 w-12" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-cifm-blue-700 shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-0.5 h-6 w-6 fill-current" />
            </div>
          </div>
          {featured && (
            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-cifm-gold-500 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
              <Star className="h-3 w-3 fill-current" />
              {locale === 'fr' ? 'A la une' : 'Featured'}
            </div>
          )}
        </div>

        <div className="space-y-2.5 p-4">
          <h3 className="font-lora line-clamp-2 text-base font-semibold leading-snug text-gray-900 group-hover:text-cifm-blue-700">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">{description}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {sermon.speaker}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {date}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {sermon.tags.slice(0, 3).map(tag => (
              <span key={tag} className="flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] text-cifm-blue-600">
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
