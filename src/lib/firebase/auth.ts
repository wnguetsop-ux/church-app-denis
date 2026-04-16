'use client'

import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { getAuthInstance } from './client'
import { isFirebaseConfigured } from './client'

export async function signIn(email: string, password: string): Promise<User> {
  if (!isFirebaseConfigured) throw new Error('Firebase non configuré')
  const cred = await signInWithEmailAndPassword(getAuthInstance(), email, password)
  return cred.user
}

export async function signOut(): Promise<void> {
  if (!isFirebaseConfigured) return
  await fbSignOut(getAuthInstance())
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!isFirebaseConfigured) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(getAuthInstance(), callback)
}
