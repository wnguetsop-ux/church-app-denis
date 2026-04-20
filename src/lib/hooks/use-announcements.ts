import useSWR from 'swr'
import { getAnnouncements } from '@/lib/firebase/services/announcements'
import { announcements as staticAnnouncements } from '@/data/announcements-data'
import { isFirebaseConfigured } from '@/lib/firebase/client'
import type { Announcement } from '@/types'

export interface AnnouncementViewItem {
  id: string
  title: { fr: string; en: string }
  body: { fr: string; en: string }
  imageUrl: string | null
  priority: 'normal' | 'urgent'
  publishedAt: string
  expiresAt: string | null
}

function toIsoDate(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    const date = value.toDate()
    if (date instanceof Date && !Number.isNaN(date.getTime())) return date.toISOString()
  }
  return new Date().toISOString()
}

function toViewItem(item: Announcement): AnnouncementViewItem {
  return {
    id: item.id,
    title: item.title,
    body: item.body,
    imageUrl: item.imageUrl,
    priority: item.priority,
    publishedAt: toIsoDate(item.publishedAt),
    expiresAt: item.expiresAt ? toIsoDate(item.expiresAt) : null,
  }
}

async function fetchAnnouncements(): Promise<AnnouncementViewItem[]> {
  if (!isFirebaseConfigured) return staticAnnouncements
  const docs = await getAnnouncements(50)
  return docs.map(toViewItem)
}

export function useAnnouncements() {
  const { data, error, isLoading } = useSWR('announcements', fetchAnnouncements, {
    revalidateOnFocus: false,
    dedupingInterval: 30_000,
  })

  return {
    announcements: data ?? [],
    error,
    isLoading,
  }
}
