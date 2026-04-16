import useSWR from 'swr'
import { getSermons } from '@/lib/firebase/services/sermons'
import { sermons as staticSermons, type StaticSermon } from '@/data/sermons-data'
import { galleryItems } from '@/data/gallery-data'

const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

async function fetchVideoSermons(): Promise<StaticSermon[]> {
  if (!isFirebaseConfigured) {
    return staticSermons
  }
  const docs = await getSermons()
  return docs.map(d => ({
    ...d,
    publishedAt: typeof d.publishedAt === 'string' ? d.publishedAt : d.publishedAt?.toDate?.().toISOString() ?? '',
  })) as unknown as StaticSermon[]
}

export function useVideoSermons() {
  const { data, error, isLoading } = useSWR('video-sermons', fetchVideoSermons, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  })
  return {
    sermons: data ?? [],
    error,
    isLoading,
  }
}

export function useGalleryVideos() {
  // Gallery videos are local files, no Firestore needed
  const videos = galleryItems.filter(item => item.type === 'video')
  return { videos }
}
