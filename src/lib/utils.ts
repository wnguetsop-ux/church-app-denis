import type { Locale } from '@/types'

export function formatDate(date: Date | null | undefined, locale: Locale): string {
  if (!date) return ''
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-CA', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(date)
}

export function getBilingualText(text: { fr: string; en: string } | null | undefined, locale: Locale): string {
  if (!text) return ''
  return text[locale] || text.fr
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '\u2026'
}
