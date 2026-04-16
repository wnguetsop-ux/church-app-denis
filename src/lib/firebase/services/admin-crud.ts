import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  limit,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore'
import { getDb, isFirebaseConfigured } from '../client'
import { getAuthInstance } from '../client'

/** Wrap a promise with a timeout so it never hangs forever */
function withTimeout<T>(promise: Promise<T>, ms = 15_000, label = 'Firestore'): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label}: timeout après ${ms / 1000}s — vérifiez votre connexion et config Firebase.`))
    }, ms)
    promise
      .then(val => { clearTimeout(timer); resolve(val) })
      .catch(err => { clearTimeout(timer); reject(err) })
  })
}

export async function listDocs(
  col: string,
  constraints: QueryConstraint[] = [],
  maxCount = 200
): Promise<(DocumentData & { id: string })[]> {
  if (!isFirebaseConfigured) return []
  const q = query(collection(getDb(), col), ...constraints, limit(maxCount))
  const snap = await withTimeout(getDocs(q), 15_000, `listDocs(${col})`)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getDocById(col: string, id: string): Promise<(DocumentData & { id: string }) | null> {
  if (!isFirebaseConfigured) return null
  const snap = await withTimeout(getDoc(doc(getDb(), col, id)), 10_000, `getDocById(${col}/${id})`)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function createDoc(col: string, data: DocumentData): Promise<string> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase non configuré. Ajoutez les variables NEXT_PUBLIC_FIREBASE_* dans .env.local')
  }
  const user = getAuthInstance().currentUser
  console.log(`[admin-crud] createDoc(${col}) — user:`, user?.email ?? 'non connecté')
  const ref = await withTimeout(
    addDoc(collection(getDb(), col), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: user?.uid ?? 'anonymous',
    }),
    15_000,
    `createDoc(${col})`
  )
  console.log(`[admin-crud] ✅ Document créé: ${col}/${ref.id}`)
  return ref.id
}

export async function updateDocById(col: string, id: string, data: DocumentData): Promise<void> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase non configuré. Ajoutez les variables NEXT_PUBLIC_FIREBASE_* dans .env.local')
  }
  const user = getAuthInstance().currentUser
  console.log(`[admin-crud] updateDoc(${col}/${id}) — user:`, user?.email ?? 'non connecté')
  await withTimeout(
    updateDoc(doc(getDb(), col, id), {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: user?.uid ?? 'anonymous',
    }),
    15_000,
    `updateDoc(${col}/${id})`
  )
  console.log(`[admin-crud] ✅ Document mis à jour: ${col}/${id}`)
}

export async function deleteDocById(col: string, id: string): Promise<void> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase non configuré.')
  }
  console.log(`[admin-crud] deleteDoc(${col}/${id})`)
  await withTimeout(deleteDoc(doc(getDb(), col, id)), 10_000, `deleteDoc(${col}/${id})`)
  console.log(`[admin-crud] ✅ Document supprimé: ${col}/${id}`)
}
