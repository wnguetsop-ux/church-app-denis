import useSWR, { mutate } from 'swr'
import { getPublicPrayers, submitPrayerRequest, incrementPrayedFor } from '@/lib/firebase/services/prayers'
import { createInAppNotification } from '@/lib/firebase/services/notifications'
import type { PrayerRequest } from '@/types'

const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

async function fetchPrayers(): Promise<PrayerRequest[]> {
  if (!isFirebaseConfigured) return []
  try {
    return await getPublicPrayers()
  } catch (err) {
    console.error('[use-prayers] Fetch error:', err)
    return []
  }
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
  subject: string | null
  request: string
  contact: string | null
  isPublic: boolean
  language: 'fr' | 'en'
}): Promise<string | null> {
  if (!isFirebaseConfigured) {
    // Simulate submission when Firebase is not configured
    await new Promise(resolve => setTimeout(resolve, 600))
    return 'simulated-id'
  }
  try {
    const id = await submitPrayerRequest(data)
    await createInAppNotification({
      category: 'priere',
      title: { fr: 'Nouvelle priere recue', en: 'New prayer request received' },
      body: {
        fr: data.subject || data.request.slice(0, 80),
        en: data.subject || data.request.slice(0, 80),
      },
      targetPath: '/priere',
      entityId: id,
    })
    mutate('prayers-public')
    return id
  } catch (err) {
    console.error('[use-prayers] Submit error:', err)
    throw err // Re-throw so the form can show an error
  }
}

export async function prayFor(id: string): Promise<void> {
  if (!isFirebaseConfigured) return
  await incrementPrayedFor(id)
  mutate('prayers-public')
}
