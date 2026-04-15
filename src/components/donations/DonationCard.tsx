'use client'

import { motion } from 'framer-motion'
import { Check, Copy, Phone, Mail, Landmark, Smartphone } from 'lucide-react'
import { useState } from 'react'
import type { StaticDonationMethod } from '@/data/donations-data'
import type { Locale } from '@/types'

interface Props {
  method: StaticDonationMethod
  locale: Locale
  index: number
}

const methodIcons: Record<string, React.ReactNode> = {
  orange: <Smartphone className="w-6 h-6" />,
  mtn: <Phone className="w-6 h-6" />,
  paypal: <Mail className="w-6 h-6" />,
  bank: <Landmark className="w-6 h-6" />,
}

const methodColors: Record<string, { bg: string; icon: string; border: string; accent: string }> = {
  orange: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-100 text-orange-600',
    border: 'border-orange-200',
    accent: 'text-orange-600',
  },
  mtn: {
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
  bank: {
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
  const colors = methodColors[method.iconKey] || methodColors.bank
  const icon = methodIcons[method.iconKey]

  async function handleCopy() {
    if (!method.copyValue) return
    try {
      await navigator.clipboard.writeText(method.copyValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input')
      input.value = method.copyValue
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
          {method.holder && (
            <p className="text-sm text-gray-500 truncate">{method.holder}</p>
          )}
        </div>
      </div>

      {/* Contact / Number with copy button */}
      {method.copyValue && (
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
            {method.contact}
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
