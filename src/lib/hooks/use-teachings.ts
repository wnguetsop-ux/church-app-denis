import useSWR from 'swr'
import { getTeachings } from '@/lib/firebase/services/teachings'
import { teachings as staticTeachings, type StaticTeaching } from '@/data/teachings-data'

const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

function mergeTeachings(primary: StaticTeaching[], fallback: StaticTeaching[]): StaticTeaching[] {
  const seen = new Set<string>()
  const merged: StaticTeaching[] = []

  for (const item of [...primary, ...fallback]) {
    const key = item.id || `${item.type}-${item.title.fr}-${item.publishedAt}`
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(item)
  }

  return merged.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

async function fetchTeachings(): Promise<StaticTeaching[]> {
  if (!isFirebaseConfigured) {
    return staticTeachings
  }
  try {
    const docs = await getTeachings(100)
    const firebaseTeachings = docs.map(d => ({
      ...d,
      publishedAt: typeof d.publishedAt === 'string' ? d.publishedAt : d.publishedAt?.toDate?.().toISOString() ?? '',
    })) as unknown as StaticTeaching[]

    return mergeTeachings(firebaseTeachings, staticTeachings)
  } catch (err) {
    console.error('[use-teachings] Firestore fetch failed, using static fallback:', err)
    return staticTeachings
  }
}

export function useTeachings() {
  const { data, error, isLoading } = useSWR('teachings', fetchTeachings, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  })
  return {
    teachings: data ?? [],
    error,
    isLoading,
  }
}
