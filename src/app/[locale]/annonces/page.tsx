'use client'

import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { AlertTriangle, Bell, Calendar } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { announcements } from '@/data/announcements-data'

export default function AnnoncesPage() {
  const t = useTranslations()
  const locale = useLocale() as 'fr' | 'en'

  const urgent = announcements.filter(a => a.priority === 'urgent')
  const normal = announcements.filter(a => a.priority === 'normal')

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-CA', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(iso))

  return (
    <div>
      <PageHeader
        title={t('announcements.title')}
        subtitle={locale === 'fr' ? 'Informations et actualit\u00E9s de la CIFM4' : 'News and updates from CIFM4'}
        backgroundImage="/images/headers/hero-church-interior.png"
      />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Urgent announcements */}
        {urgent.length > 0 && (
          <AnimatedSection>
            <div className="space-y-4">
              {urgent.map((ann, i) => (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:shadow-lg hover:shadow-red-100/50 transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-red-100/50 rounded-bl-[60px]" />
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      <AlertTriangle size={12} />
                      {t('announcements.urgent')}
                    </span>
                    <span className="text-xs text-red-400">{formatDate(ann.publishedAt)}</span>
                  </div>
                  <h3 className="font-lora text-lg font-semibold text-red-900 group-hover:text-red-700 transition-colors">
                    {ann.title[locale]}
                  </h3>
                  <p className="text-red-800/80 text-sm leading-relaxed">{ann.body[locale]}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Normal announcements */}
        <AnimatedSection delay={0.1}>
          <div className="space-y-4">
            {normal.map((ann, i) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="bg-white rounded-2xl p-5 shadow-sm space-y-3 group hover:shadow-md hover:shadow-cifm-blue-100/40 transition-all duration-300 border border-transparent hover:border-cifm-blue-100"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cifm-blue-50 flex items-center justify-center text-cifm-blue-600 group-hover:bg-cifm-blue-100 group-hover:scale-110 transition-all duration-300">
                    <Bell size={16} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-cifm-blue-700 transition-colors">
                      {ann.title[locale]}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <Calendar size={11} />
                      {formatDate(ann.publishedAt)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed pl-[42px]">
                  {ann.body[locale]}
                </p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Empty state */}
        {announcements.length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <Bell size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">{t('common.no_content')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
