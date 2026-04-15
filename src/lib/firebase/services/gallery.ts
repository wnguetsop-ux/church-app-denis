import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore'
import { db } from '../client'
import type { GalleryItem } from '@/types'

const COL = 'gallery'

export async function getGalleryItems(count = 24): Promise<GalleryItem[]> {
  const q = query(collection(db, COL), orderBy('order', 'asc'), limit(count))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem))
}

export async function getGalleryByAlbum(album: string, count = 24): Promise<GalleryItem[]> {
  const q = query(
    collection(db, COL),
    where('album', '==', album),
    orderBy('order', 'asc'),
    limit(count)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem))
}
