'use client'

import { useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import useSWR from 'swr'
import { isFirebaseConfigured } from '@/lib/firebase/client'
import { listNotifications } from '@/lib/firebase/services/notifications'
import type { NotificationCategory } from '@/types'

type BadgeMap = Record<NotificationCategory, number>

const STORAGE_PREFIX = 'cifm4:notification-seen:'

export const notificationCategoryPaths: Record<Exclude<NotificationCategory, 'general'>, string> = {
  messages: '/messages',
  enseignements: '/enseignements',
  audios: '/audios',
  annonces: '/annonces',
  dons: '/dons',
  priere: '/priere',
}

const emptyBadges: BadgeMap = {
  messages: 0,
  enseignements: 0,
  audios: 0,
  annonces: 0,
  dons: 0,
  priere: 0,
  general: 0,
}

function toMillis(value: unknown): number {
  if (typeof value === 'string') return new Date(value).getTime()
  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    const date = value.toDate()
    if (date instanceof Date) return date.getTime()
  }
  return 0
}

async function fetchNotifications() {
  if (!isFirebaseConfigured) return []
  return listNotifications(100)
}

function getCategoryFromPath(pathname: string): Exclude<NotificationCategory, 'general'> | null {
  const withoutLocale = pathname.replace(/^\/(fr|en)(?=\/|$)/, '') || '/'
  for (const [category, path] of Object.entries(notificationCategoryPaths)) {
    if (withoutLocale === path || withoutLocale.startsWith(`${path}/`)) {
      return category as Exclude<NotificationCategory, 'general'>
    }
  }
  return null
}

export function useNotificationBadges() {
  const pathname = usePathname()
  const { data } = useSWR('app-notifications', fetchNotifications, {
    revalidateOnFocus: true,
    refreshInterval: 20_000,
    dedupingInterval: 10_000,
  })

  const currentCategory = getCategoryFromPath(pathname)

  useEffect(() => {
    if (!currentCategory || typeof window === 'undefined') return
    window.localStorage.setItem(`${STORAGE_PREFIX}${currentCategory}`, String(Date.now()))
  }, [currentCategory])

  const badges = useMemo(() => {
    if (typeof window === 'undefined') return emptyBadges
    const next: BadgeMap = { ...emptyBadges }

    for (const item of data ?? []) {
      const seenAt = Number(window.localStorage.getItem(`${STORAGE_PREFIX}${item.category}`) ?? '0')
      if (toMillis(item.createdAt) > seenAt) {
        next[item.category] += 1
      }
    }

    if (currentCategory) next[currentCategory] = 0
    return next
  }, [currentCategory, data])

  return { badges }
}
