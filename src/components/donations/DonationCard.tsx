'use client'

import { motion } from 'framer-motion'
import { Check, Copy, Phone, Mail, Landmark, Smartphone } from 'lucide-react'
import { useState } from 'react'
import type { DonationMethodViewItem } from '@/lib/hooks/use-donations'
import type { Locale } from '@/types'

interface Props {
  method: DonationMethodViewItem
  locale: Locale
  index: number
}

const methodIcons: Record<string, React.ReactNode> = {
  orange_money: <Smartphone className="w-6 h-6" />,
  mtn_money: <Phone className="w-6 h-6" />,
  paypal: <Mail className="w-6 h-6" />,
  bank_transfer: <Landmark className="w-6 h-6" />,
}

const methodColors: Record<string, { bg: string; icon: string; border: string; accent: string }> = {
  orange_money: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-100 text-orange-600',
    border: 'border-orange-200',
    accent: 'text-orange-600',
  },
  mtn_money: {
    bg: 'bg-yellow-50',
    icon: 'bg-yellow-100 text-yellow-700',
    border: 'border-yellow-200',
    accent: 'text-yellow-700',
  },
  paypal: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100 text-blue-600',
    border: 'border-blue-200',
    accent: 'text-blue-600',
  },
  bank_transfer: {
    bg: 'bg-gray-50',
    icon: 'bg-gray-100 text-gray-600',
    border: 'border-gray-200',
    accent: 'text-gray-600',
  },
}

export default function DonationCard({ method, locale, index }: Props) {
  const [copied, setCopied] = useState(false)

  const label = method.label[locale] || method.label.fr
  const instructions = method.instructions[locale] || method.instructions.fr
  const colors = methodColors[method.method] || methodColors.bank_transfer
  const icon = methodIcons[method.method] || methodIcons.bank_transfer
  const copyValue = method.contact.replace(/\s+/g, '')

  async function handleCopy() {
    if (!copyValue) return
    try {
      await navigator.clipboard.writeText(copyValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input')
      input.value = copyValue
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35, ease: 'easeOut', delay: index * 0.08 },
        },
      }}
      className={`
        ${colors.bg} border ${colors.border} rounded-2xl p-5
        transition-shadow duration-200 hover:shadow-md
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-11 h-11 rounded-xl ${colors.icon} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-lora text-lg font-semibold text-gray-900">{label}</h3>
          {method.contact && <p className="text-sm text-gray-500 truncate">{method.contact}</p>}
        </div>
      </div>

      {/* Contact / Number with copy button */}
      {copyValue && (
        <button
          onClick={handleCopy}
          className={`
            w-full flex items-center justify-between gap-3
            bg-white rounded-xl px-4 py-3 mb-3
            border border-gray-200 hover:border-gray-300
          transition-all duration-200 group
          `}
        >
          <span className={`font-mono text-base font-semibold ${colors.accent} tracking-wide`}>
            {method.contact || label}
          </span>
          <span className={`
            flex items-center gap-1.5 text-xs font-medium shrink-0 px-2.5 py-1 rounded-full transition-all duration-200
            ${copied
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
            }
          `}>
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                {locale === 'fr' ? 'Copié' : 'Copied'}
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                {locale === 'fr' ? 'Copier' : 'Copy'}
              </>
            )}
          </span>
        </button>
      )}

      {/* Instructions */}
      <p className="text-sm text-gray-600 leading-relaxed">
        {instructions}
      </p>
    </motion.div>
  )
}
