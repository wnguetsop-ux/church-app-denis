'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { requestNotificationPermission, onForegroundMessage } from '@/lib/firebase/messaging'
import { isFirebaseConfigured } from '@/lib/firebase/client'

export default function NotificationBanner() {
  const [show, setShow] = useState(false)
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured || typeof window === 'undefined') return
    if (Notification.permission === 'default') {
      // Show banner after 5 seconds
      const t = setTimeout(() => setShow(true), 5000)
      return () => clearTimeout(t)
    }
    if (Notification.permission === 'granted') {
      // Already granted — register token silently and listen
      requestNotificationPermission()
      const unsub = onForegroundMessage((payload) => {
        setToast({
          title: payload.notification?.title ?? 'CIFM4',
          body: payload.notification?.body ?? '',
        })
        setTimeout(() => setToast(null), 6000)
      })
      return unsub
    }
  }, [])

  async function handleAccept() {
    setShow(false)
    await requestNotificationPermission()
  }

  if (toast) {
    return (
      <div className="fixed top-20 right-4 left-4 md:left-auto md:w-96 z-[100] animate-slide-down">
        <div className="bg-white rounded-2xl shadow-2xl border border-cifm-blue-100 p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-cifm-blue-600 flex items-center justify-center shrink-0">
            <Bell size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{toast.title}</p>
            <p className="text-gray-600 text-xs mt-0.5">{toast.body}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 shrink-0">
            <X size={16} />
          </button>
        </div>
      </div>
    )
  }

  if (!show) return null

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-[100]">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-cifm-blue-50 flex items-center justify-center shrink-0">
            <Bell size={18} className="text-cifm-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Activer les notifications ?</p>
            <p className="text-gray-500 text-xs mt-0.5">
              Recevez les annonces et nouveaux messages de la CIFM4
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setShow(false)}
            className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Plus tard
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-xs font-semibold text-white bg-cifm-blue-600 rounded-lg hover:bg-cifm-blue-500 transition-colors"
          >
            Activer
          </button>
        </div>
      </div>
    </div>
  )
}
