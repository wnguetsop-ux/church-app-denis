import { doc, getDoc } from 'firebase/firestore'
import { getDb } from '../client'
import type { ChurchInfo } from '@/types'

const DOC_ID = 'main'
const COL = 'churchInfo'

export async function getChurchInfo(): Promise<ChurchInfo | null> {
  const snap = await getDoc(doc(getDb(), COL, DOC_ID))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as ChurchInfo
}
