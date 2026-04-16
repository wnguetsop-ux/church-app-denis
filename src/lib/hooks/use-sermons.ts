import useSWR from 'swr'
import { getSermons, getFeaturedSermon } from '@/lib/firebase/services/sermons'
import { sermons as staticSermons, getFeaturedSermon as getStaticFeatured, type StaticSermon } from '@/data/sermons-data'

const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

async function fetchSermons(): Promise<StaticSermon[]> {
  if (!isFirebaseConfigured) {
    return staticSermons
  }
  const docs = await getSermons()
  return docs.map(d => ({
    ...d,
    publishedAt: typeof d.publishedAt === 'string' ? d.publishedAt : d.publishedAt?.toDate?.().toISOString() ?? '',
  })) as unknown as StaticSermon[]
}

async function fetchFeaturedSermon(): Promise<StaticSermon | null> {
  if (!isFirebaseConfigured) {
    return getStaticFeatured()
  }
  const doc = await getFeaturedSermon()
  if (!doc) return null
  return {
    ...doc,
    publishedAt: typeof doc.publishedAt === 'string' ? doc.publishedAt : doc.publishedAt?.toDate?.().toISOString() ?? '',
  } as unknown as StaticSermon
}

export function useSermons() {
  const { data, error, isLoading } = useSWR('sermons', fetchSermons, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  })
  return {
    sermons: data ?? [],
    error,
    isLoading,
  }
}

export function useFeaturedSermon() {
  const { data, error, isLoading } = useSWR('sermon-featured', fetchFeaturedSermon, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  })
  return {
    sermon: data ?? null,
    error,
    isLoading,
  }
}
