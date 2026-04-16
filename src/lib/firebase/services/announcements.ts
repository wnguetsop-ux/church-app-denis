import { collection, query, orderBy, limit, getDocs, doc, getDoc, where } from 'firebase/firestore'
import { getDb } from '../client'
import type { Announcement } from '@/types'

const COL = 'announcements'

export async function getAnnouncements(count = 20): Promise<Announcement[]> {
  const q = query(collection(getDb(), COL), orderBy('publishedAt', 'desc'), limit(count))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Announcement))
}

export async function getUrgentAnnouncements(): Promise<Announcement[]> {
  const q = query(
    collection(getDb(), COL),
    where('priority', '==', 'urgent'),
    orderBy('publishedAt', 'desc'),
    limit(5)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Announcement))
}

export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  const snap = await getDoc(doc(getDb(), COL, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Announcement
}
