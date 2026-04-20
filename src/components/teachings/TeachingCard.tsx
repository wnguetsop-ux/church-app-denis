'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { BookOpen, Headphones, Calendar, Clock, Tag } from 'lucide-react'
import type { StaticTeaching } from '@/data/teachings-data'
import type { Locale } from '@/types'

interface Props {
  teaching: StaticTeaching
  locale: Locale
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function TeachingCard({ teaching, locale }: Props) {
  const title = teaching.title[locale] || teaching.title.fr
  const body = teaching.body?.[locale] ?? teaching.body?.fr ?? ''
  const isText = teaching.type === 'text'
  const preview = body.slice(0, 150) + (body.length > 150 ? '...' : '')

  const date = new Date(teaching.publishedAt).toLocaleDateString(
    locale === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.10)' }}
      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
    >
      {!isText && teaching.coverImageUrl && (
        <div className="relative h-32 overflow-hidden bg-cifm-blue-100">
          <Image
            src={teaching.coverImageUrl}
            alt={title}
            fill
            className="object-cover group-hover-zoom"
            sizes="(max-width: 768px) 100vw, 320px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow">
              <Headphones className="h-4 w-4 text-cifm-blue-700" />
            </div>
            {teaching.audioDuration && (
              <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-xs font-medium text-white">
                <Clock className="h-3 w-3" />
                {teaching.audioDuration}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2.5 p-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isText ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'
          }`}>
            {isText ? <BookOpen className="h-3 w-3" /> : <Headphones className="h-3 w-3" />}
            {isText ? (locale === 'fr' ? 'Texte' : 'Text') : 'Podcast'}
          </span>
          {!isText && teaching.audioDuration && !teaching.coverImageUrl && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              {teaching.audioDuration}
            </span>
          )}
          {teaching.featured && (
            <span className="rounded-full bg-cifm-gold-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {locale === 'fr' ? 'A la une' : 'Featured'}
            </span>
          )}
        </div>

        <h3 className="font-lora line-clamp-2 text-base font-semibold leading-snug text-gray-900">
          {title}
        </h3>

        {preview && (
          <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">
            {preview}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {date}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {teaching.tags.slice(0, 3).map(tag => (
            <span key={tag} className="flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] text-cifm-blue-600">
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-2">
          {isText ? (
            <button className="w-full rounded-xl bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-100">
              {locale === 'fr' ? 'Lire l enseignement' : 'Read teaching'}
            </button>
          ) : teaching.audioUrl ? (
            <audio controls preload="none" className="w-full">
              <source src={teaching.audioUrl} />
            </audio>
          ) : (
            <button className="w-full rounded-xl bg-purple-50 py-2.5 text-sm font-semibold text-purple-600 transition-colors hover:bg-purple-100">
              {locale === 'fr' ? 'Podcast bientot disponible' : 'Podcast coming soon'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
