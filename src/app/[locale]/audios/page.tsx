'use client'

import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Music, Clock, Calendar, Tag, Play, Headphones } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { teachings } from '@/data/teachings-data'

export default function AudiosPage() {
  const t = useTranslations()
  const locale = useLocale() as 'fr' | 'en'

  const audioTeachings = teachings.filter(item => item.type === 'audio')

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-CA', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(iso))

  return (
    <div>
      <PageHeader
        title={locale === 'fr' ? 'Podcasts' : 'Podcasts'}
        subtitle={locale === 'fr' ? '\u00C9couter les podcasts de la CIFM4' : 'Listen to CIFM4 podcasts'}
        backgroundImage="/images/headers/hero-worship-stage.png"
      />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <AnimatedSection>
          <p className="text-gray-500 text-sm mb-6">
            {locale === 'fr'
              ? `${audioTeachings.length} podcast(s) disponible(s)`
              : `${audioTeachings.length} podcast(s) available`}
          </p>
        </AnimatedSection>

        {audioTeachings.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-lg hover:shadow-cifm-blue-100/40 transition-all duration-300 border border-transparent hover:border-cifm-blue-100"
          >
            <div className="p-5 flex items-start gap-4">
              {/* Play icon */}
              <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-cifm-blue-600 to-cifm-blue-500 flex items-center justify-center text-white shadow-lg shadow-cifm-blue-600/20 group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(37,99,235,0.3)] transition-all duration-300">
                <Play size={24} className="ml-0.5" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-lora font-semibold text-gray-900 group-hover:text-cifm-blue-700 transition-colors text-sm leading-snug">
                  {item.title[locale]}
                </h3>

                {item.body && (
                  <p className="text-gray-500 text-xs leading-relaxed mt-1.5 line-clamp-2">
                    {item.body[locale]}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                  {item.audioDuration && (
                    <span className="inline-flex items-center gap-1 text-xs text-cifm-blue-600 font-medium">
                      <Clock size={12} />
                      {item.audioDuration}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={11} />
                    {formatDate(item.publishedAt)}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {item.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      <Tag size={9} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Audio player placeholder */}
            <div className="px-5 pb-4">
              <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                <Headphones size={16} className="text-gray-400 shrink-0" />
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-cifm-blue-500 rounded-full" />
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">
                  {item.audioDuration ?? '00:00'}
                </span>
              </div>
              <p className="text-center text-[10px] text-gray-400 mt-2">
                {locale === 'fr' ? 'Podcast bient\u00F4t disponible' : 'Podcast coming soon'}
              </p>
            </div>
          </motion.div>
        ))}

        {audioTeachings.length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <Music size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">{t('teachings.no_content')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
