'use client'

import { motion } from 'framer-motion'

interface Props {
  albums: Array<{ key: string; label: string }>
  active: string
  onChange: (album: string) => void
  counts: Record<string, number>
}

export default function AlbumFilter({ albums, active, onChange, counts }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
      {albums.map(({ key, label }) => {
        const isActive = active === key
        const count = counts[key] ?? 0
        return (
          <motion.button
            key={key}
            onClick={() => onChange(key)}
            whileTap={{ scale: 0.95 }}
            className={`
              shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
              transition-colors duration-200
              ${isActive
                ? 'bg-cifm-blue-600 text-white shadow-md shadow-cifm-blue-600/25'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-cifm-blue-400 hover:text-cifm-blue-600'
              }
            `}
          >
            {label}
            <span className={`
              text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center
              ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}
            `}>
              {count}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
