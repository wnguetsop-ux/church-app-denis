'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Headphones } from 'lucide-react'
import { teachings, getTextTeachings, getAudioTeachings } from '@/data/teachings-data'
import TeachingCard from './TeachingCard'
import type { Locale } from '@/types'

interface Props {
  locale: Locale
}

type TabType = 'all' | 'text' | 'audio'

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

export default function TeachingsList({ locale }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('all')

  const textCount = getTextTeachings().length
  const audioCount = getAudioTeachings().length

  const tabs: { key: TabType; label: { fr: string; en: string }; icon: typeof BookOpen; count: number }[] = [
    { key: 'all', label: { fr: 'Tous', en: 'All' }, icon: BookOpen, count: teachings.length },
    { key: 'text', label: { fr: 'Textes', en: 'Texts' }, icon: BookOpen, count: textCount },
    { key: 'audio', label: { fr: 'Audios', en: 'Audios' }, icon: Headphones, count: audioCount },
  ]

  const filtered = activeTab === 'all'
    ? teachings
    : teachings.filter(t => t.type === activeTab)

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cifm-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label[locale]}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Stats */}
      <p className="text-xs text-gray-400">
        {filtered.length} {locale === 'fr' ? 'enseignement(s)' : 'teaching(s)'}
      </p>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {filtered.map(teaching => (
            <TeachingCard key={teaching.id} teaching={teaching} locale={locale} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">
            {locale === 'fr'
              ? 'Aucun enseignement dans cette catégorie pour le moment.'
              : 'No teachings in this category yet.'}
          </p>
        </div>
      )}
    </div>
  )
}
