'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Music, Clock, Calendar, Tag, Play, Headphones } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { useTeachings } from '@/lib/hooks/use-teachings'

export default function AudiosPage() {
  const t = useTranslations()
  const locale = useLocale() as 'fr' | 'en'
  const { teachings, isLoading } = useTeachings()

  const audioTeachings = teachings.filter(item => item.type === 'audio')

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-CA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso))

  return (
    <div>
      <PageHeader
        title={locale === 'fr' ? 'Podcasts' : 'Podcasts'}
        subtitle={locale === 'fr' ? 'Ecouter les podcasts de la CIFM4' : 'Listen to CIFM4 podcasts'}
        backgroundImage="/images/headers/hero-worship-stage.png"
      />

      <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
        <AnimatedSection>
          <p className="mb-6 text-sm text-gray-500">
            {locale === 'fr'
              ? `${audioTeachings.length} podcast(s) disponible(s)`
              : `${audioTeachings.length} podcast(s) available`}
          </p>
        </AnimatedSection>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm animate-pulse">
                <div className="mb-3 h-4 w-2/3 rounded bg-gray-100" />
                <div className="mb-2 h-3 w-full rounded bg-gray-100" />
                <div className="h-10 rounded-xl bg-gray-100" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {audioTeachings.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="group overflow-hidden rounded-2xl border border-transparent bg-white shadow-sm transition-all duration-300 hover:border-cifm-blue-100 hover:shadow-lg hover:shadow-cifm-blue-100/40"
              >
                <div className="flex items-start gap-4 p-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cifm-blue-600 to-cifm-blue-500 text-white shadow-lg shadow-cifm-blue-600/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(37,99,235,0.3)]">
                    <Play size={24} className="ml-0.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-lora text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-cifm-blue-700">
                      {item.title[locale]}
                    </h3>

                    {item.body && (
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">{item.body[locale]}</p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      {item.audioDuration && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-cifm-blue-600">
                          <Clock size={12} />
                          {item.audioDuration}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={11} />
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                          <Tag size={9} /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-4">
                  {item.audioUrl ? (
                    <audio controls preload="none" className="w-full rounded-xl">
                      <source src={item.audioUrl} />
                    </audio>
                  ) : (
                    <div className="rounded-xl bg-gray-50 p-3">
                      <div className="flex items-center gap-3">
                        <Headphones size={16} className="shrink-0 text-gray-400" />
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                          <div className="h-full w-0 rounded-full bg-cifm-blue-500" />
                        </div>
                        <span className="shrink-0 text-[10px] text-gray-400">{item.audioDuration ?? '00:00'}</span>
                      </div>
                      <p className="mt-2 text-center text-[10px] text-gray-400">
                        {locale === 'fr' ? 'Podcast bientot disponible' : 'Podcast coming soon'}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {audioTeachings.length === 0 && (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <Music size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-500">{t('teachings.no_content')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
