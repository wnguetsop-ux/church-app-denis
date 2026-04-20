import useSWR from 'swr'
import { getDonationMethods } from '@/lib/firebase/services/donations'
import { donationMethods as staticDonationMethods } from '@/data/donations-data'
import { isFirebaseConfigured } from '@/lib/firebase/client'
import type { BilingualText, DonationMethod } from '@/types'

export interface DonationMethodViewItem {
  id: string
  method: DonationMethod['method']
  label: BilingualText
  instructions: BilingualText
  contact: string
  isActive: boolean
  order: number
}

function staticToViewItem(method: (typeof staticDonationMethods)[number]): DonationMethodViewItem {
  return {
    id: method.id,
    method: method.method,
    label: method.label,
    instructions: method.instructions,
    contact: method.contact,
    isActive: method.isActive,
    order: method.order,
  }
}

function mergeDonationMethods(
  primary: DonationMethodViewItem[],
  fallback: DonationMethodViewItem[]
): DonationMethodViewItem[] {
  const byMethod = new Map<string, DonationMethodViewItem>()

  for (const item of [...primary, ...fallback]) {
    if (!byMethod.has(item.method)) {
      byMethod.set(item.method, item)
    }
  }

  return [...byMethod.values()].sort((a, b) => a.order - b.order)
}

async function fetchDonationMethods(): Promise<DonationMethodViewItem[]> {
  const staticMethods = staticDonationMethods.map(staticToViewItem)
  if (!isFirebaseConfigured) return staticMethods

  try {
    const docs = await getDonationMethods()
    const firestoreMethods = docs.map(method => ({
      id: method.id,
      method: method.method,
      label: method.label,
      instructions: method.instructions,
      contact: method.contact,
      isActive: method.isActive,
      order: method.order,
    }))

    return mergeDonationMethods(firestoreMethods, staticMethods)
  } catch (err) {
    console.error('[use-donations] Firestore fetch failed, using static fallback:', err)
    return staticMethods
  }
}

export function useDonationMethods() {
  const { data, error, isLoading } = useSWR('donation-methods', fetchDonationMethods, {
    revalidateOnFocus: false,
    dedupingInterval: 30_000,
  })

  return {
    methods: data ?? [],
    error,
    isLoading,
  }
}
