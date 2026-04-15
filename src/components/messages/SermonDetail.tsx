'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Share2, Calendar, User, Tag, Video } from 'lucide-react'
import type { StaticSermon } from '@/data/sermons-data'
import type { Locale } from '@/types'

interface Props {
  sermon: StaticSermon
  locale: Locale
}

export default function SermonDetail({ sermon, locale }: Props) {
  const title = sermon.title[locale]
  const description = sermon.description[locale]
  const series = sermon.series?.[locale]
  const isPlaceholder = sermon.youtubeVideoId.startsWith('_placeholder')

  const date = new Date(sermon.publishedAt).toLocaleDateString(
    locale === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Back nav */}
      <div className="bg-cifm-blue-700 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/${locale}/messages`}
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === 'fr' ? 'Retour aux messages' : 'Back to sermons'}
          </Link>
        </div>
      </div>

      {/* YouTube embed or placeholder */}
      <div className="bg-black">
        <div className="max-w-3xl mx-auto">
          <div className="relative aspect-video">
            {isPlaceholder ? (
              <div className="absolute inset-0 bg-gradient-to-br from-cifm-blue-800 to-cifm-blue-950 flex flex-col items-center justify-center text-white/60 gap-3">
                <Video className="w-16 h-16 opacity-30" />
                <p className="text-sm">
                  {locale === 'fr'
                    ? 'Vidéo YouTube à venir'
                    : 'YouTube video coming soon'}
                </p>
                <p className="text-xs opacity-40">
                  {locale === 'fr'
                    ? 'L\'URL YouTube sera ajoutée par l\'administrateur'
                    : 'YouTube URL will be added by the administrator'}
                </p>
              </div>
            ) : (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${sermon.youtubeVideoId}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-3xl mx-auto px-4 py-6 space-y-5"
      >
        {/* Title & meta */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          {series && (
            <span className="text-cifm-blue-600 text-xs font-semibold uppercase tracking-wide">
              {series}
            </span>
          )}
          <h1 className="font-lora text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-400" />
              {sermon.speaker}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              {date}
            </span>
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {sermon.tags.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1 bg-blue-50 text-cifm-blue-600 text-xs px-2.5 py-1 rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Share */}
          <button className="flex items-center gap-2 text-sm text-cifm-blue-600 hover:text-cifm-blue-800 transition-colors pt-1">
            <Share2 className="w-4 h-4" />
            {locale === 'fr' ? 'Partager' : 'Share'}
          </button>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-lora text-lg font-semibold text-gray-900 mb-3">
            {locale === 'fr' ? 'Description' : 'Description'}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* Info note */}
        <div className="bg-cifm-blue-50 border border-cifm-blue-100 rounded-2xl p-4 text-center">
          <p className="text-cifm-blue-700 text-sm">
            {locale === 'fr'
              ? '🙏 Que ce message vous bénisse et vous fortifie dans votre marche avec le Seigneur.'
              : '🙏 May this message bless you and strengthen you in your walk with the Lord.'}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
