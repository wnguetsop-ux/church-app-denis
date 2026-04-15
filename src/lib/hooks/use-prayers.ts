import useSWR, { mutate } from 'swr'
import { getPublicPrayers, submitPrayerRequest, incrementPrayedFor } from '@/lib/firebase/services/prayers'
import type { PrayerRequest } from '@/types'

const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

async function fetchPrayers(): Promise<PrayerRequest[]> {
  if (!isFirebaseConfigured) return []
  return getPublicPrayers()
}

export function usePublicPrayers() {
  const { data, error, isLoading } = useSWR('prayers-public', fetchPrayers, {
    revalidateOnFocus: false,
    dedupingInterval: 30_000,
  })
  return {
    prayers: data ?? [],
    error,
    isLoading,
  }
}

export async function submitPrayer(data: {
  name: string | null
  request: string
  isPublic: boolean
}): Promise<string | null> {
  if (!isFirebaseConfigured) {
    // Simulate submission when Firebase is not configured
    await new Promise(resolve => setTimeout(resolve, 600))
    return 'simulated-id'
  }
  const id = await submitPrayerRequest(data)
  mutate('prayers-public')
  return id
}

export async function prayFor(id: string): Promise<void> {
  if (!isFirebaseConfigured) return
  await incrementPrayedFor(id)
  mutate('prayers-public')
}
