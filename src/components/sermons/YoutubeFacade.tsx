'use client'
import { useState } from 'react'
import { Play } from 'lucide-react'
import { getYouTubeThumbnail, getYouTubeEmbedUrl } from '@/lib/youtube'
import Image from 'next/image'

interface Props { videoId: string; title: string }

export default function YoutubeFacade({ videoId, title }: Props) {
  const [playing, setPlaying] = useState(false)
  if (playing) {
    return (
      <div className="aspect-video w-full">
        <iframe
          src={`${getYouTubeEmbedUrl(videoId)}&autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full rounded-xl"
        />
      </div>
    )
  }
  return (
    <button
      onClick={() => setPlaying(true)}
      aria-label={`Lire : ${title}`}
      className="relative aspect-video w-full rounded-xl overflow-hidden group bg-gray-900">
      <Image
        src={getYouTubeThumbnail(videoId, 'hq')}
        alt={title}
        fill
        className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center
                        group-hover:scale-110 transition-transform duration-200 shadow-lg">
          <Play className="w-7 h-7 text-cifm-blue-700 ml-1" fill="currentColor" />
        </div>
      </div>
    </button>
  )
}
