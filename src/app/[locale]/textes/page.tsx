'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Calendar, Tag, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { useTeachings } from '@/lib/hooks/use-teachings'

export default function TextesPage() {
  const t = useTranslations()
  const locale = useLocale() as 'fr' | 'en'
  const [expanded, setExpanded] = useState<string | null>(null)
  const { teachings } = useTeachings()

  const textTeachings = teachings.filter(item => item.type === 'text')

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-CA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso))

  return (
    <div>
      <PageHeader
        title={locale === 'fr' ? 'Enseignements Ecrits' : 'Written Teachings'}
        subtitle={locale === 'fr' ? 'Articles et textes bibliques de la CIFM4' : 'Biblical articles and texts from CIFM4'}
        backgroundImage="/images/headers/hero-bible-teaching.png"
      />

      <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
        <AnimatedSection>
          <p className="mb-6 text-sm text-gray-500">
            {locale === 'fr'
              ? `${textTeachings.length} enseignement(s) ecrit(s) disponible(s)`
              : `${textTeachings.length} written teaching(s) available`}
          </p>
        </AnimatedSection>

        {textTeachings.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="group overflow-hidden rounded-2xl border border-transparent bg-white shadow-sm transition-all duration-300 hover:border-cifm-blue-100"
          >
            <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="flex w-full items-start gap-3 p-5 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cifm-blue-50 text-cifm-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-cifm-blue-100 group-hover:shadow-[0_0_16px_rgba(37,99,235,0.15)]">
                <FileText size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-lora text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-cifm-blue-700">
                  {item.title[locale]}
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={11} />
                    {formatDate(item.publishedAt)}
                  </span>
                  {item.featured && (
                    <span className="rounded-full bg-cifm-gold-100 px-2 py-0.5 text-[10px] font-semibold text-cifm-gold-400">
                      {locale === 'fr' ? 'A la une' : 'Featured'}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                      <Tag size={9} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-1 shrink-0 text-gray-400">
                {expanded === item.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            <AnimatePresence>
              {expanded === item.id && item.body && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                    <div className="prose prose-sm max-w-none whitespace-pre-line leading-relaxed text-gray-700">
                      {item.body[locale]}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {textTeachings.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-500">{t('teachings.no_content')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
