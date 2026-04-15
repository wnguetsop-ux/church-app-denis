import useSWR from 'swr'
import { getTeachings } from '@/lib/firebase/services/teachings'
import { teachings as staticTeachings, type StaticTeaching } from '@/data/teachings-data'

const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

async function fetchTeachings(): Promise<StaticTeaching[]> {
  if (!isFirebaseConfigured) {
    return staticTeachings
  }
  const docs = await getTeachings()
  return docs.map(d => ({
    ...d,
    publishedAt: typeof d.publishedAt === 'string' ? d.publishedAt : d.publishedAt?.toDate?.().toISOString() ?? '',
  })) as unknown as StaticTeaching[]
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
