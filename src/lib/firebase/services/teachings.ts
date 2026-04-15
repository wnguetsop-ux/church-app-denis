import { collection, query, orderBy, limit, getDocs, doc, getDoc, where } from 'firebase/firestore'
import { db } from '../client'
import type { Teaching } from '@/types'

const COL = 'teachings'

export async function getTeachings(count = 12): Promise<Teaching[]> {
  const q = query(collection(db, COL), orderBy('publishedAt', 'desc'), limit(count))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Teaching))
}

export async function getTeachingsByType(type: 'text' | 'audio', count = 12): Promise<Teaching[]> {
  const q = query(
    collection(db, COL),
    where('type', '==', type),
    orderBy('publishedAt', 'desc'),
    limit(count)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Teaching))
}

export async function getFeaturedTeaching(): Promise<Teaching | null> {
  const q = query(collection(db, COL), where('featured', '==', true), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Teaching
}

export async function getTeachingById(id: string): Promise<Teaching | null> {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Teaching
}
