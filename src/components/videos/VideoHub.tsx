'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Video, Film, Calendar, User, Clock } from 'lucide-react'
import Image from 'next/image'
import { sermons } from '@/data/sermons-data'
import { galleryItems } from '@/data/gallery-data'
import type { Locale } from '@/types'

interface Props {
  locale: Locale
}

type TabType = 'all' | 'sermons' | 'clips'

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function VideoHub({ locale }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('all')

  const galleryVideos = galleryItems.filter(item => item.type === 'video')

  const tabs: { key: TabType; label: { fr: string; en: string }; icon: typeof Video; count: number }[] = [
    { key: 'all', label: { fr: 'Toutes', en: 'All' }, icon: Play, count: sermons.length + galleryVideos.length },
    { key: 'sermons', label: { fr: 'Sermons YouTube', en: 'YouTube Sermons' }, icon: Video, count: sermons.length },
    { key: 'clips', label: { fr: 'Clips courts', en: 'Short Clips' }, icon: Film, count: galleryVideos.length },
  ]

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

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* YouTube sermons */}
          {(activeTab === 'all' || activeTab === 'sermons') &&
            sermons.map(sermon => {
              const isPlaceholder = sermon.youtubeVideoId.startsWith('_placeholder')
              const thumbnailUrl = isPlaceholder
                ? null
                : `https://img.youtube.com/vi/${sermon.youtubeVideoId}/mqdefault.jpg`

              const date = new Date(sermon.publishedAt).toLocaleDateString(
                locale === 'fr' ? 'fr-FR' : 'en-US',
                { year: 'numeric', month: 'short', day: 'numeric' }
              )

              return (
                <motion.div
                  key={sermon.id}
                  variants={cardVariants}
                  whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 cursor-pointer"
                >
                  <div className="relative aspect-video bg-cifm-blue-100">
                    {thumbnailUrl ? (
                      <Image
                        src={thumbnailUrl}
                        alt={sermon.title[locale]}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 320px"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-cifm-blue-600 to-cifm-blue-800 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white/40" />
                      </div>
                    )}
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black/10 hover:bg-black/25 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow">
                        <Play className="w-4 h-4 text-cifm-blue-700 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    {/* YouTube badge */}
                    <div className="absolute top-2 right-2">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        YouTube
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h3 className="font-lora text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                      {sermon.title[locale]}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {sermon.speaker.split(' ').slice(-2).join(' ')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {date}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })
          }

          {/* Gallery short clips */}
          {(activeTab === 'all' || activeTab === 'clips') &&
            galleryVideos.map(video => (
              <motion.div
                key={video.id}
                variants={cardVariants}
                whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 cursor-pointer"
              >
                <div className="relative aspect-video bg-gray-900">
                  <video
                    src={video.src}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow">
                      <Play className="w-4 h-4 text-gray-800 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  {/* Clip badge */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-gray-800/80 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <Film className="w-3 h-3" />
                      Clip
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                    {video.alt[locale]}
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {locale === 'fr' ? 'Clip court' : 'Short clip'}
                  </p>
                </div>
              </motion.div>
            ))
          }
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
