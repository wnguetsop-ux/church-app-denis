'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { AlertTriangle, Bell, Calendar } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { useAnnouncements } from '@/lib/hooks/use-announcements'

export default function AnnoncesPage() {
  const t = useTranslations()
  const locale = useLocale() as 'fr' | 'en'
  const { announcements, isLoading } = useAnnouncements()

  const activeAnnouncements = announcements
  const urgent = activeAnnouncements.filter(item => item.priority === 'urgent')
  const normal = activeAnnouncements.filter(item => item.priority === 'normal')

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-CA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso))

  return (
    <div>
      <PageHeader
        title={t('announcements.title')}
        subtitle={locale === 'fr' ? 'Informations et actualites de la CIFM4' : 'News and updates from CIFM4'}
        backgroundImage="/images/headers/hero-church-interior.png"
      />

      <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl bg-white p-5 shadow-sm animate-pulse">
                <div className="mb-3 h-4 w-1/3 rounded bg-gray-100" />
                <div className="mb-2 h-4 w-2/3 rounded bg-gray-100" />
                <div className="h-3 w-full rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {urgent.length > 0 && (
              <AnimatedSection>
                <div className="space-y-4">
                  {urgent.map((ann, index) => (
                    <motion.div
                      key={ann.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative space-y-3 overflow-hidden rounded-2xl border border-red-200 bg-red-50 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-red-100/50"
                    >
                      <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[60px] bg-red-100/50" />
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                          <AlertTriangle size={12} />
                          {t('announcements.urgent')}
                        </span>
                        <span className="text-xs text-red-400">{formatDate(ann.publishedAt)}</span>
                      </div>
                      <h3 className="font-lora text-lg font-semibold text-red-900 transition-colors group-hover:text-red-700">
                        {ann.title[locale]}
                      </h3>
                      <p className="text-sm leading-relaxed text-red-800/80">{ann.body[locale]}</p>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>
            )}

            <AnimatedSection delay={0.1}>
              <div className="space-y-4">
                {normal.map((ann, index) => (
                  <motion.div
                    key={ann.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.08 }}
                    className="group space-y-3 rounded-2xl border border-transparent bg-white p-5 shadow-sm transition-all duration-300 hover:border-cifm-blue-100 hover:shadow-md hover:shadow-cifm-blue-100/40"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cifm-blue-50 text-cifm-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-cifm-blue-100">
                        <Bell size={16} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-cifm-blue-700">
                          {ann.title[locale]}
                        </h3>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                          <Calendar size={11} />
                          {formatDate(ann.publishedAt)}
                        </div>
                      </div>
                    </div>
                    <p className="pl-[42px] text-sm leading-relaxed text-gray-600">{ann.body[locale]}</p>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            {activeAnnouncements.length === 0 && (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <Bell size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-500">{t('common.no_content')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
