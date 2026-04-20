'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import { useSermons } from '@/lib/hooks/use-sermons'
import SermonCard from './SermonCard'
import type { Locale } from '@/types'
import type { SermonCategory } from '@/data/sermons-data'

interface Props {
  locale: Locale
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
}

const TABS: { key: SermonCategory | 'all'; labelFr: string; labelEn: string }[] = [
  { key: 'all',          labelFr: 'Tout',          labelEn: 'All' },
  { key: 'message',      labelFr: 'Messages',       labelEn: 'Sermons' },
  { key: 'conference',   labelFr: 'Conférences',    labelEn: 'Conferences' },
  { key: 'enseignement', labelFr: 'Enseignements',  labelEn: 'Teachings' },
  { key: 'meditation',   labelFr: 'Méditons',       labelEn: 'Meditations' },
]

export default function SermonList({ locale }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<SermonCategory | 'all'>('message')
  const { sermons, isLoading } = useSermons()

  const featured = sermons.find(s => s.featured) ?? sermons[0] ?? null

  const filteredSermons = sermons.filter(s => {
    const matchesTab = activeTab === 'all' || (s as any).category === activeTab
    if (!matchesTab) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    const title = typeof s.title === 'string' ? s.title : s.title[locale]
    const desc = typeof s.description === 'string' ? s.description : s.description[locale]
    return (
      title.toLowerCase().includes(q) ||
      desc.toLowerCase().includes(q) ||
      s.speaker.toLowerCase().includes(q) ||
      s.tags.some((tag: string) => tag.toLowerCase().includes(q))
    )
  })

  const nonFeatured = (featured && activeTab === 'message' && !searchQuery)
    ? filteredSermons.filter(s => s.id !== featured.id)
    : filteredSermons

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
            <div className="aspect-video bg-gray-100 rounded-xl mb-3" />
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-cifm-blue-600 text-white shadow-md shadow-blue-200'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-cifm-blue-300 hover:text-cifm-blue-600'
            }`}
          >
            {locale === 'fr' ? tab.labelFr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={locale === 'fr' ? 'Rechercher...' : 'Search...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cifm-blue-500 focus:border-transparent transition-shadow"
        />
      </div>

      {/* Stats */}
      <p className="text-xs text-gray-400">
        {filteredSermons.length} {locale === 'fr' ? 'vidéo(s)' : 'video(s)'}
        {searchQuery && ` — "${searchQuery}"`}
      </p>

      {/* Featured sermon */}
      {!searchQuery && featured && activeTab === 'message' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SermonCard sermon={featured} locale={locale} featured />
        </motion.div>
      )}

      {/* Sermon grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={searchQuery}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {nonFeatured.map(sermon => (
            <SermonCard key={sermon.id} sermon={sermon} locale={locale} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredSermons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">
            {locale === 'fr'
              ? 'Aucun message trouvé pour cette recherche.'
              : 'No sermons found for this search.'}
          </p>
        </div>
      )}
    </div>
  )
}
