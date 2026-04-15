'use client'

import { useState, useCallback } from 'react'
import useSWR, { mutate as globalMutate } from 'swr'
import { isFirebaseConfigured } from '@/lib/firebase/client'
import { listDocs, createDoc, updateDocById, deleteDocById } from '@/lib/firebase/services/admin-crud'
import { orderBy, type QueryConstraint } from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'

interface UseAdminCrudOptions {
  collection: string
  orderField?: string
  orderDirection?: 'asc' | 'desc'
  fallbackData?: DocumentData[]
}

export function useAdminCrud<T extends { id: string }>({
  collection: col,
  orderField = 'createdAt',
  orderDirection = 'desc',
  fallbackData = [],
}: UseAdminCrudOptions) {
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const swrKey = `admin-${col}`

  const fetcher = useCallback(async () => {
    if (!isFirebaseConfigured) return fallbackData as T[]
    const constraints: QueryConstraint[] = [orderBy(orderField, orderDirection)]
    return listDocs(col, constraints) as unknown as T[]
  }, [col, orderField, orderDirection, fallbackData])

  const { data, error, isLoading } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10_000,
  })

  const items: T[] = (data ?? []) as T[]

  async function create(docData: DocumentData): Promise<string | null> {
    if (!isFirebaseConfigured) {
      alert('Firebase non configuré — mode démo. Configurez les variables d\'environnement Firebase pour sauvegarder.')
      return null
    }
    setSaving(true)
    try {
      const id = await createDoc(col, docData)
      await globalMutate(swrKey)
      return id
    } finally {
      setSaving(false)
    }
  }

  async function update(id: string, docData: DocumentData): Promise<boolean> {
    if (!isFirebaseConfigured) {
      alert('Firebase non configuré — mode démo.')
      return false
    }
    setSaving(true)
    try {
      await updateDocById(col, id, docData)
      await globalMutate(swrKey)
      return true
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string): Promise<boolean> {
    if (!isFirebaseConfigured) {
      alert('Firebase non configuré — mode démo.')
      return false
    }
    setDeleting(true)
    try {
      await deleteDocById(col, id)
      await globalMutate(swrKey)
      return true
    } finally {
      setDeleting(false)
    }
  }

  return {
    items,
    isLoading,
    error,
    create,
    update,
    remove,
    saving,
    deleting,
    refresh: () => globalMutate(swrKey),
  }
}
