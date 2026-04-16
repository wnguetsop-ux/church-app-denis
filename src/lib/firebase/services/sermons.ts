import { collection, query, orderBy, limit, getDocs, doc, getDoc, where } from 'firebase/firestore'
import { getDb } from '../client'
import type { Sermon } from '@/types'

const COL = 'sermons'

export async function getSermons(count = 12): Promise<Sermon[]> {
  const q = query(collection(getDb(), COL), orderBy('publishedAt', 'desc'), limit(count))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Sermon))
}

export async function getFeaturedSermon(): Promise<Sermon | null> {
  const q = query(collection(getDb(), COL), where('featured', '==', true), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Sermon
}

export async function getSermonById(id: string): Promise<Sermon | null> {
  const snap = await getDoc(doc(getDb(), COL, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Sermon
}
