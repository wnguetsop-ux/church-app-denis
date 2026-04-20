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
import { firebaseEnv } from '../config'

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

function logDebug(msg: string, data?: unknown) {
  console.log(`[firebase] ${msg}`, data ?? '')
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
  logDebug(`createDoc(${col}) START`)
  logDebug(`isFirebaseConfigured: ${isFirebaseConfigured}`)
  logDebug(`projectId from env: ${firebaseEnv.projectId}`)

  if (!isFirebaseConfigured) {
    throw new Error('Firebase non configuré. Ajoutez les variables NEXT_PUBLIC_FIREBASE_* dans .env.local')
  }

  let db
  try {
    db = getDb()
    logDebug(`getDb() OK — app: ${db.app.options.projectId}`)
  } catch (e) {
    logDebug(`getDb() FAILED`, e)
    throw e
  }

  const auth = getAuthInstance()
  const user = auth.currentUser
  logDebug(`auth.currentUser: ${user?.email ?? 'null'} (uid: ${user?.uid ?? 'none'})`)

  logDebug(`addDoc to ${col}...`)
  try {
    const ref = await withTimeout(
      addDoc(collection(db, col), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid ?? 'anonymous',
      }),
      15_000,
      `createDoc(${col})`
    )
    logDebug(`✅ Document créé: ${col}/${ref.id}`)
    return ref.id
  } catch (e: unknown) {
    logDebug(`❌ addDoc FAILED`, e)
    throw e
  }
}

export async function updateDocById(col: string, id: string, data: DocumentData): Promise<void> {
  logDebug(`updateDoc(${col}/${id}) START`)
  if (!isFirebaseConfigured) {
    throw new Error('Firebase non configuré.')
  }
  const user = getAuthInstance().currentUser
  logDebug(`auth.currentUser: ${user?.email ?? 'null'}`)
  await withTimeout(
    updateDoc(doc(getDb(), col, id), {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: user?.uid ?? 'anonymous',
    }),
    15_000,
    `updateDoc(${col}/${id})`
  )
  logDebug(`✅ Document mis à jour: ${col}/${id}`)
}

export async function deleteDocById(col: string, id: string): Promise<void> {
  if (!isFirebaseConfigured) throw new Error('Firebase non configuré.')
  await withTimeout(deleteDoc(doc(getDb(), col, id)), 10_000, `deleteDoc(${col}/${id})`)
  logDebug(`✅ Document supprimé: ${col}/${id}`)
}
