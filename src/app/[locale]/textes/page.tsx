'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Calendar, Tag, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { teachings } from '@/data/teachings-data'

export default function TextesPage() {
  const t = useTranslations()
  const locale = useLocale() as 'fr' | 'en'
  const [expanded, setExpanded] = useState<string | null>(null)

  const textTeachings = teachings.filter(item => item.type === 'text')

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-CA', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(iso))

  return (
    <div>
      <PageHeader
        title={locale === 'fr' ? 'Enseignements \u00C9crits' : 'Written Teachings'}
        subtitle={locale === 'fr' ? 'Articles et textes bibliques de la CIFM4' : 'Biblical articles and texts from CIFM4'}
        backgroundImage="/images/headers/hero-bible-teaching.png"
      />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <AnimatedSection>
          <p className="text-gray-500 text-sm mb-6">
            {locale === 'fr'
              ? `${textTeachings.length} enseignement(s) \u00E9crit(s) disponible(s)`
              : `${textTeachings.length} written teaching(s) available`}
          </p>
        </AnimatedSection>

        {textTeachings.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-transparent hover:border-cifm-blue-100 transition-all duration-300 group"
          >
            {/* Header - always visible */}
            <button
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              className="w-full text-left p-5 flex items-start gap-3"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-cifm-blue-50 flex items-center justify-center text-cifm-blue-600 group-hover:bg-cifm-blue-100 group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(37,99,235,0.15)] transition-all duration-300">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-lora font-semibold text-gray-900 group-hover:text-cifm-blue-700 transition-colors text-sm leading-snug">
                  {item.title[locale]}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={11} />
                    {formatDate(item.publishedAt)}
                  </span>
                  {item.featured && (
                    <span className="text-[10px] bg-cifm-gold-100 text-cifm-gold-400 px-2 py-0.5 rounded-full font-semibold">
                      {locale === 'fr' ? '\u00C0 la une' : 'Featured'}
                    </span>
                  )}
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      <Tag size={9} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="shrink-0 text-gray-400 mt-1">
                {expanded === item.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            {/* Expandable body */}
            <AnimatePresence>
              {expanded === item.id && item.body && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                      {item.body[locale]}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {textTeachings.length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">{t('teachings.no_content')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
