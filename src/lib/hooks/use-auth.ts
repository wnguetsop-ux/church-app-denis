'use client'

import { useState, useEffect } from 'react'
import type { User } from 'firebase/auth'
import { onAuthChange, signIn, signOut } from '@/lib/firebase/auth'
import { isFirebaseConfigured } from '@/lib/firebase/client'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false)
      return
    }
    const unsub = onAuthChange((u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signIn: async (email: string, password: string) => {
      const u = await signIn(email, password)
      setUser(u)
      return u
    },
    signOut: async () => {
      await signOut()
      setUser(null)
    },
  }
}
