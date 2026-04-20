type FirebaseEnvKey =
  | 'NEXT_PUBLIC_FIREBASE_API_KEY'
  | 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'
  | 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  | 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'
  | 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'
  | 'NEXT_PUBLIC_FIREBASE_APP_ID'
  | 'NEXT_PUBLIC_FIREBASE_VAPID_KEY'

function cleanEnv(value: string | undefined): string | undefined {
  const cleaned = value?.trim()
  return cleaned ? cleaned : undefined
}

function normalizeStorageBucket(value: string | undefined): string | undefined {
  const cleaned = cleanEnv(value)?.replace(/\s+/g, '')
  if (!cleaned) return undefined

  return cleaned
    .replace(/^https?:\/\//i, '')
    .replace(/^gs:\/\//i, '')
    .replace(/\/+$/, '')
}

export const firebaseEnv = {
  apiKey: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: normalizeStorageBucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  vapidKey: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY),
}

export function getFirebaseEnvValue(key: FirebaseEnvKey): string | undefined {
  switch (key) {
    case 'NEXT_PUBLIC_FIREBASE_API_KEY':
      return firebaseEnv.apiKey
    case 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN':
      return firebaseEnv.authDomain
    case 'NEXT_PUBLIC_FIREBASE_PROJECT_ID':
      return firebaseEnv.projectId
    case 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET':
      return firebaseEnv.storageBucket
    case 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID':
      return firebaseEnv.messagingSenderId
    case 'NEXT_PUBLIC_FIREBASE_APP_ID':
      return firebaseEnv.appId
    case 'NEXT_PUBLIC_FIREBASE_VAPID_KEY':
      return firebaseEnv.vapidKey
  }
}
