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
  const title = teaching.title[locale]
  const body = teaching.body?.[locale] ?? ''
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
      className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 cursor-pointer"
    >
      {/* Cover image for audio teachings */}
      {!isText && teaching.coverImageUrl && (
        <div className="relative h-32 bg-cifm-blue-100 overflow-hidden">
          <Image
            src={teaching.coverImageUrl}
            alt={title}
            fill
            className="object-cover group-hover-zoom"
            sizes="(max-width: 768px) 100vw, 320px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow">
              <Headphones className="w-4 h-4 text-cifm-blue-700" />
            </div>
            {teaching.audioDuration && (
              <span className="text-white text-xs font-medium bg-black/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {teaching.audioDuration}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-4 space-y-2.5">
        {/* Type badge + duration for audio without cover */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isText
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-purple-50 text-purple-600'
          }`}>
            {isText ? <BookOpen className="w-3 h-3" /> : <Headphones className="w-3 h-3" />}
            {isText
              ? (locale === 'fr' ? 'Texte' : 'Text')
              : (locale === 'fr' ? 'Podcast' : 'Podcast')
            }
          </span>
          {!isText && teaching.audioDuration && !teaching.coverImageUrl && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {teaching.audioDuration}
            </span>
          )}
          {teaching.featured && (
            <span className="bg-cifm-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {locale === 'fr' ? 'À la une' : 'Featured'}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-lora text-base font-semibold text-gray-900 leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Preview */}
        <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
          {preview}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {date}
          </span>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap">
          {teaching.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="flex items-center gap-0.5 bg-blue-50 text-cifm-blue-600 text-[11px] px-2 py-0.5 rounded-full"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        {/* Action */}
        <div className="pt-2">
          <button className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            isText
              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
              : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
          }`}>
            {isText
              ? (locale === 'fr' ? 'Lire l\'enseignement' : 'Read teaching')
              : (locale === 'fr' ? 'Écouter' : 'Listen')
            }
          </button>
        </div>
      </div>
    </motion.div>
  )
}
