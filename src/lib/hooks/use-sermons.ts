import useSWR from 'swr'
import { getSermons, getFeaturedSermon } from '@/lib/firebase/services/sermons'
import { sermons as staticSermons, getFeaturedSermon as getStaticFeatured, type StaticSermon } from '@/data/sermons-data'

const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

function mergeSermons(primary: StaticSermon[], fallback: StaticSermon[]): StaticSermon[] {
  const seen = new Set<string>()
  const merged: StaticSermon[] = []

  for (const item of [...primary, ...fallback]) {
    const key = item.id || item.youtubeVideoId || `${item.title.fr}-${item.publishedAt}`
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(item)
  }

  return merged.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

async function fetchSermons(): Promise<StaticSermon[]> {
  if (!isFirebaseConfigured) {
    return staticSermons
  }
  try {
    const docs = await getSermons(100)
    const firebaseSermons = docs.map(d => ({
      ...d,
      publishedAt: typeof d.publishedAt === 'string' ? d.publishedAt : d.publishedAt?.toDate?.().toISOString() ?? '',
    })) as unknown as StaticSermon[]

    return mergeSermons(firebaseSermons, staticSermons)
  } catch (err) {
    console.error('[use-sermons] Firestore fetch failed, using static fallback:', err)
    return staticSermons
  }
}

async function fetchFeaturedSermon(): Promise<StaticSermon | null> {
  if (!isFirebaseConfigured) {
    return getStaticFeatured()
  }
  try {
    const doc = await getFeaturedSermon()
    if (!doc) return getStaticFeatured()
    return {
      ...doc,
      publishedAt: typeof doc.publishedAt === 'string' ? doc.publishedAt : doc.publishedAt?.toDate?.().toISOString() ?? '',
    } as unknown as StaticSermon
  } catch (err) {
    console.error('[use-sermons] Featured fetch failed, using static fallback:', err)
    return getStaticFeatured()
  }
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
