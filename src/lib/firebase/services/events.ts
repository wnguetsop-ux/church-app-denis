import { collection, query, orderBy, limit, getDocs, doc, getDoc, where, Timestamp } from 'firebase/firestore'
import { db } from '../client'
import type { ChurchEvent } from '@/types'

const COL = 'events'

export async function getEvents(count = 12): Promise<ChurchEvent[]> {
  const q = query(collection(db, COL), orderBy('startAt', 'asc'), limit(count))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ChurchEvent))
}

export async function getUpcomingEvents(count = 5): Promise<ChurchEvent[]> {
  const now = Timestamp.now()
  const q = query(
    collection(db, COL),
    where('startAt', '>=', now),
    orderBy('startAt', 'asc'),
    limit(count)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ChurchEvent))
}

export async function getEventById(id: string): Promise<ChurchEvent | null> {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as ChurchEvent
}
