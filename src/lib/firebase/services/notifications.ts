import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { getDb } from '../client'
import type { AppNotification, BilingualText, NotificationCategory } from '@/types'

const COL = 'notifications'

export async function listNotifications(count = 50): Promise<AppNotification[]> {
  const q = query(collection(getDb(), COL), orderBy('createdAt', 'desc'), limit(count))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as AppNotification))
}

export async function listNotificationsByCategory(
  category: NotificationCategory,
  count = 20
): Promise<AppNotification[]> {
  const q = query(
    collection(getDb(), COL),
    where('category', '==', category),
    orderBy('createdAt', 'desc'),
    limit(count)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as AppNotification))
}

export async function createInAppNotification(input: {
  category: NotificationCategory
  title: BilingualText
  body: BilingualText
  targetPath?: string | null
  entityId?: string | null
  isManual?: boolean
}): Promise<string> {
  const ref = await addDoc(collection(getDb(), COL), {
    category: input.category,
    title: input.title,
    body: input.body,
    targetPath: input.targetPath ?? null,
    entityId: input.entityId ?? null,
    isManual: input.isManual ?? false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return ref.id
}

export async function publishContentNotification(input: {
  category: Exclude<NotificationCategory, 'general'>
  title: BilingualText
  body: BilingualText
  targetPath: string
  entityId?: string | null
}): Promise<string> {
  return createInAppNotification({
    category: input.category,
    title: input.title,
    body: input.body,
    targetPath: input.targetPath,
    entityId: input.entityId ?? null,
    isManual: false,
  })
}
