'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, User, MessageSquare, Heart, Globe } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { submitPrayer } from '@/lib/hooks/use-prayers'
import type { Locale } from '@/types'

interface Props {
  locale: Locale
}

interface FormData {
  name: string
  subject: string
  request: string
  contact: string
  isPublic: boolean
  language: Locale
}

const initialForm: FormData = {
  name: '',
  subject: '',
  request: '',
  contact: '',
  isPublic: false,
  language: 'fr',
}

export default function PrayerForm({ locale }: Props) {
  const t = useTranslations()
  const [form, setForm] = useState<FormData>({ ...initialForm, language: locale })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function validate(): boolean {
    const errs: typeof errors = {}
    if (!form.request.trim()) {
      errs.request = t('prayer.error_request_required')
    } else if (form.request.trim().length < 10) {
      errs.request = t('prayer.error_request_short')
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)

    try {
      await submitPrayer({
        name: form.name || null,
        request: form.request,
        isPublic: form.isPublic,
      })
      setSubmitted(true)
    } catch {
      // Silently handle error — user sees no change
    } finally {
      setSubmitting(false)
    }
  }

  function handleReset() {
    setForm({ ...initialForm, language: locale })
    setErrors({})
    setSubmitted(false)
  }

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-sm text-center space-y-4"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <h3 className="font-lora text-xl font-semibold text-gray-900">
            {t('prayer.success_title')}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
            {t('prayer.success')}
          </p>
          <div className="border-l-4 border-cifm-gold-400 bg-cifm-gold-100 rounded-r-xl px-4 py-3 text-left">
            <p className="text-gray-700 text-sm italic leading-relaxed">
              {t('prayer.scripture')}
            </p>
            <p className="text-gray-500 text-xs mt-1 font-medium">{t('prayer.scripture_ref')}</p>
          </div>
          <button
            onClick={handleReset}
            className="text-cifm-blue-600 text-sm font-semibold hover:underline underline-offset-4"
          >
            {t('prayer.submit_another')}
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-sm space-y-5"
        >
          <h2 className="font-lora text-lg font-semibold text-gray-900">
            {t('prayer.form_title')}
          </h2>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <User className="w-4 h-4 text-gray-400" />
              {t('prayer.name_label')}
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => updateField('name', e.target.value)}
              placeholder={t('prayer.name_placeholder')}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm
                         focus:ring-2 focus:ring-cifm-blue-400/30 focus:border-cifm-blue-400
                         outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Heart className="w-4 h-4 text-gray-400" />
              {t('prayer.subject_label')}
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={e => updateField('subject', e.target.value)}
              placeholder={t('prayer.subject_placeholder')}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm
                         focus:ring-2 focus:ring-cifm-blue-400/30 focus:border-cifm-blue-400
                         outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Prayer request */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              {t('prayer.request_label')}
              <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.request}
              onChange={e => updateField('request', e.target.value)}
              placeholder={t('prayer.request_placeholder')}
              rows={4}
              className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm resize-none
                         focus:ring-2 focus:ring-cifm-blue-400/30 focus:border-cifm-blue-400
                         outline-none transition-all placeholder:text-gray-400
                         ${errors.request ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`}
            />
            {errors.request && (
              <p className="text-red-500 text-xs">{errors.request}</p>
            )}
          </div>

          {/* Contact (optional) */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Globe className="w-4 h-4 text-gray-400" />
              {t('prayer.contact_label')}
            </label>
            <input
              type="text"
              value={form.contact}
              onChange={e => updateField('contact', e.target.value)}
              placeholder={t('prayer.contact_placeholder')}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm
                         focus:ring-2 focus:ring-cifm-blue-400/30 focus:border-cifm-blue-400
                         outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Public toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={e => updateField('isPublic', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-cifm-blue-500 transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm
                              peer-checked:translate-x-4 transition-transform" />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
              {t('prayer.public_label')}
            </span>
          </label>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={submitting}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full flex items-center justify-center gap-2
              rounded-full py-3.5 font-semibold text-sm transition-all
              ${submitting
                ? 'bg-cifm-blue-400 text-white cursor-wait'
                : 'bg-cifm-blue-600 text-white hover:bg-cifm-blue-500 active:bg-cifm-blue-700 shadow-md shadow-cifm-blue-600/25'
              }
            `}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('prayer.submitting')}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {t('prayer.submit')}
              </>
            )}
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
