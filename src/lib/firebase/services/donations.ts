import { collection, query, orderBy, getDocs, where } from 'firebase/firestore'
import { db } from '../client'
import type { DonationMethod } from '@/types'

const COL = 'donationMethods'

export async function getDonationMethods(): Promise<DonationMethod[]> {
  const q = query(
    collection(db, COL),
    where('isActive', '==', true),
    orderBy('order', 'asc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as DonationMethod))
}
