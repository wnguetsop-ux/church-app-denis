'use client'

import { getToken, onMessage, type MessagePayload } from 'firebase/messaging'
import { getMessaging, isSupported } from 'firebase/messaging'
import { isFirebaseConfigured } from './client'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { getDb } from './client'

let _messaging: ReturnType<typeof getMessaging> | null = null

async function getMessagingInstance() {
  if (_messaging) return _messaging
  const supported = await isSupported()
  if (!supported) return null
  const { initializeApp, getApps } = await import('firebase/app')
  const app = getApps()[0] ?? initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  })
  _messaging = getMessaging(app)
  return _messaging
}

/**
 * Request notification permission and get FCM token.
 * Saves the token to Firestore for later use.
 */
export async function requestNotificationPermission(): Promise<string | null> {
  if (!isFirebaseConfigured) return null
  if (typeof window === 'undefined') return null

  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return null

    const messaging = await getMessagingInstance()
    if (!messaging) return null

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    const token = await getToken(messaging, { vapidKey })

    if (token) {
      // Save token to Firestore
      await setDoc(doc(getDb(), 'fcmTokens', token), {
        token,
        createdAt: serverTimestamp(),
        userAgent: navigator.userAgent,
        locale: navigator.language,
      })
    }

    return token
  } catch (err) {
    console.error('FCM permission error:', err)
    return null
  }
}

/**
 * Listen for foreground messages
 */
export function onForegroundMessage(callback: (payload: MessagePayload) => void): () => void {
  if (!isFirebaseConfigured || typeof window === 'undefined') return () => {}

  let unsub = () => {}

  getMessagingInstance().then(messaging => {
    if (messaging) {
      unsub = onMessage(messaging, callback)
    }
  })

  return () => unsub()
}
