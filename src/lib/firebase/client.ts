import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getAuth, type Auth } from 'firebase/auth'
import { firebaseEnv } from './config'

export const isFirebaseConfigured = !!firebaseEnv.projectId

let _app: FirebaseApp | null = null

function ensureApp(): FirebaseApp {
  if (_app) return _app
  const firebaseConfig = {
    apiKey: firebaseEnv.apiKey,
    authDomain: firebaseEnv.authDomain,
    projectId: firebaseEnv.projectId,
    storageBucket: firebaseEnv.storageBucket,
    messagingSenderId: firebaseEnv.messagingSenderId,
    appId: firebaseEnv.appId,
  }
  _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  return _app
}

let _db: Firestore | null = null
let _storage: FirebaseStorage | null = null
let _auth: Auth | null = null

/** Lazy Firestore — only initializes when first accessed */
export function getDb(): Firestore {
  if (!_db) _db = getFirestore(ensureApp())
  return _db
}

export function getStorageInstance(): FirebaseStorage {
  if (!_storage) _storage = getStorage(ensureApp())
  return _storage
}

export function getAuthInstance(): Auth {
  if (!_auth) _auth = getAuth(ensureApp())
  return _auth
}
