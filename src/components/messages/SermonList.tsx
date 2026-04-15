'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import { sermons, getFeaturedSermon } from '@/data/sermons-data'
import SermonCard from './SermonCard'
import type { Locale } from '@/types'

interface Props {
  locale: Locale
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

export default function SermonList({ locale }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const featured = getFeaturedSermon()

  const filteredSermons = sermons.filter(s => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      s.title[locale].toLowerCase().includes(q) ||
      s.description[locale].toLowerCase().includes(q) ||
      s.speaker.toLowerCase().includes(q) ||
      s.tags.some(tag => tag.toLowerCase().includes(q))
    )
  })

  const nonFeatured = filteredSermons.filter(s => s.id !== featured.id)

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={locale === 'fr' ? 'Rechercher un message...' : 'Search for a sermon...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cifm-blue-500 focus:border-transparent transition-shadow"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-cifm-blue-600 transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <p className="text-xs text-gray-400">
        {filteredSermons.length} {locale === 'fr' ? 'message(s)' : 'sermon(s)'}
        {searchQuery && ` — "${searchQuery}"`}
      </p>

      {/* Featured sermon */}
      {!searchQuery && featured && (
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
