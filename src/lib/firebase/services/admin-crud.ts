import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore'
import { getDb } from '../client'

export async function listDocs(
  col: string,
  constraints: QueryConstraint[] = [],
  maxCount = 100
): Promise<(DocumentData & { id: string })[]> {
  const q = query(collection(getDb(), col), ...constraints, limit(maxCount))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getDocById(col: string, id: string): Promise<(DocumentData & { id: string }) | null> {
  const snap = await getDoc(doc(getDb(), col, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function createDoc(col: string, data: DocumentData): Promise<string> {
  const ref = await addDoc(collection(getDb(), col), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateDocById(col: string, id: string, data: DocumentData): Promise<void> {
  await updateDoc(doc(getDb(), col, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteDocById(col: string, id: string): Promise<void> {
  await deleteDoc(doc(getDb(), col, id))
}
