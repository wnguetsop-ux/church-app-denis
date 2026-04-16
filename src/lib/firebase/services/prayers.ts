import { collection, query, orderBy, limit, getDocs, addDoc, doc, updateDoc, increment, where, serverTimestamp } from 'firebase/firestore'
import { getDb } from '../client'
import type { PrayerRequest } from '@/types'

const COL = 'prayers'

export async function getPublicPrayers(count = 20): Promise<PrayerRequest[]> {
  const q = query(
    collection(getDb(), COL),
    where('isPublic', '==', true),
    orderBy('createdAt', 'desc'),
    limit(count)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as PrayerRequest))
}

export async function submitPrayerRequest(data: {
  name: string | null
  request: string
  isPublic: boolean
}): Promise<string> {
  const ref = await addDoc(collection(getDb(), COL), {
    ...data,
    prayedForCount: 0,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function incrementPrayedFor(id: string): Promise<void> {
  await updateDoc(doc(getDb(), COL, id), {
    prayedForCount: increment(1)
  })
}
