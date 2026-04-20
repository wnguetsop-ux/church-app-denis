import useSWR from 'swr'
import { getGalleryItems } from '@/lib/firebase/services/gallery'
import { galleryItems as staticGalleryItems } from '@/data/gallery-data'
import { isFirebaseConfigured } from '@/lib/firebase/client'
import type { GalleryItem as FirebaseGalleryItem, BilingualText } from '@/types'

export interface GalleryViewItem {
  id: string
  type: 'image' | 'video'
  src: string
  alt: BilingualText
  album: string
  date: string
  thumbnailSrc?: string
}

function toIsoDate(value: unknown): string {
  if (typeof value === 'string') {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString()
  }

  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    const date = value.toDate()
    if (date instanceof Date && !Number.isNaN(date.getTime())) return date.toISOString()
  }

  return '1970-01-01T00:00:00.000Z'
}

function toViewItem(item: FirebaseGalleryItem): GalleryViewItem {
  const fallbackCaption = item.album || 'Galerie CIFM4'

  return {
    id: item.id,
    type: item.type,
    src: item.url,
    thumbnailSrc: item.thumbnailUrl || item.url,
    alt: item.caption ?? { fr: fallbackCaption, en: fallbackCaption },
    album: item.album || 'all',
    date: toIsoDate(item.createdAt),
  }
}

function staticToViewItem(item: (typeof staticGalleryItems)[number]): GalleryViewItem {
  return {
    id: item.id,
    type: item.type,
    src: item.src,
    thumbnailSrc: item.src,
    alt: item.alt,
    album: item.album,
    date: item.date,
  }
}

function normalizeMediaKey(src: string): string {
  return src
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/[^/]+/i, '')
}

function mergeGalleryItems(primary: GalleryViewItem[], fallback: GalleryViewItem[]): GalleryViewItem[] {
  const seen = new Set<string>()
  const merged: GalleryViewItem[] = []

  for (const item of [...primary, ...fallback]) {
    const key = normalizeMediaKey(item.src)
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(item)
  }

  return merged.sort((a, b) => b.date.localeCompare(a.date))
}

async function fetchGallery(): Promise<GalleryViewItem[]> {
  const staticItems = staticGalleryItems.map(staticToViewItem)

  if (!isFirebaseConfigured) {
    return staticItems
  }

  const docs = await getGalleryItems(200)
  return mergeGalleryItems(docs.map(toViewItem), staticItems)
}

export function useGalleryItems() {
  const { data, error, isLoading } = useSWR('gallery-public', fetchGallery, {
    revalidateOnFocus: false,
    dedupingInterval: 30_000,
  })

  return {
    items: data ?? [],
    error,
    isLoading,
  }
}
