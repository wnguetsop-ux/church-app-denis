'use client'

import { useState, useCallback, useRef } from 'react'
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
  fallbackData,
}: UseAdminCrudOptions) {
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)
  const fallbackRef = useRef(fallbackData ?? [])

  const swrKey = `admin-${col}`

  const fetcher = useCallback(async () => {
    if (!isFirebaseConfigured) return fallbackRef.current as T[]
    try {
      const constraints: QueryConstraint[] = [orderBy(orderField, orderDirection)]
      const results = await listDocs(col, constraints)
      return results as unknown as T[]
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? String(err)
      console.error(`[useAdminCrud] Fetch error for ${col}:`, msg)
      // If it's an index error, return empty array instead of throwing
      if (msg.includes('index') || msg.includes('requires an index')) {
        return [] as T[]
      }
      throw err
    }
  }, [col, orderField, orderDirection])

  const { data, error, isLoading } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10_000,
    onError: (err) => {
      console.error(`[useAdminCrud] SWR error for ${col}:`, err)
    }
  })

  const items: T[] = (data ?? []) as T[]

  async function create(docData: DocumentData): Promise<string | null> {
    if (!isFirebaseConfigured) {
      alert('Firebase non configuré — mode démo. Configurez les variables d\'environnement Firebase pour sauvegarder.')
      return null
    }
    setSaving(true)
    setLastError(null)
    try {
      const id = await createDoc(col, docData)
      await globalMutate(swrKey)
      return id
    } catch (err: unknown) {
      const msg = (err as { code?: string; message?: string })
      const errorMsg = msg.code === 'permission-denied'
        ? 'Permission refusée. Vérifiez les règles Firestore et que vous êtes connecté.'
        : msg.message ?? 'Erreur lors de la sauvegarde.'
      setLastError(errorMsg)
      alert('Erreur: ' + errorMsg)
      console.error('[useAdminCrud] Create error:', err)
      return null
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
    setLastError(null)
    try {
      await updateDocById(col, id, docData)
      await globalMutate(swrKey)
      return true
    } catch (err: unknown) {
      const msg = (err as { code?: string; message?: string })
      const errorMsg = msg.code === 'permission-denied'
        ? 'Permission refusée. Vérifiez les règles Firestore et que vous êtes connecté.'
        : msg.message ?? 'Erreur lors de la mise à jour.'
      setLastError(errorMsg)
      alert('Erreur: ' + errorMsg)
      console.error('[useAdminCrud] Update error:', err)
      return false
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
    setLastError(null)
    try {
      await deleteDocById(col, id)
      await globalMutate(swrKey)
      return true
    } catch (err: unknown) {
      const msg = (err as { code?: string; message?: string })
      const errorMsg = msg.code === 'permission-denied'
        ? 'Permission refusée. Vérifiez les règles Firestore.'
        : msg.message ?? 'Erreur lors de la suppression.'
      setLastError(errorMsg)
      alert('Erreur: ' + errorMsg)
      console.error('[useAdminCrud] Delete error:', err)
      return false
    } finally {
      setDeleting(false)
    }
  }

  return {
    items,
    isLoading,
    error,
    lastError,
    create,
    update,
    remove,
    saving,
    deleting,
    refresh: () => globalMutate(swrKey),
  }
}
