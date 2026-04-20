'use client'

import { motion } from 'framer-motion'
import { Heart, BookOpen } from 'lucide-react'
import { useTranslations } from 'next-intl'
import DonationCard from './DonationCard'
import { useDonationMethods } from '@/lib/hooks/use-donations'
import type { Locale } from '@/types'

interface Props {
  locale: Locale
}

export default function DonationsSection({ locale }: Props) {
  const t = useTranslations()
  const { methods } = useDonationMethods()
  const activeMethods = methods.filter(m => m.isActive)

  return (
    <div className="space-y-8">
      {/* Intro message */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative overflow-hidden bg-gradient-to-br from-cifm-blue-50 to-white border border-cifm-blue-100 rounded-2xl p-6"
      >
        <div className="relative z-10">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cifm-blue-100 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-cifm-blue-600" />
            </div>
            <div>
              <h2 className="font-lora text-lg font-semibold text-cifm-blue-700">
                {t('give.why_title')}
              </h2>
            </div>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {t('give.intro')}
          </p>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-cifm-blue-100/40" />
      </motion.div>

      {/* Donation methods */}
      <div>
        <h2 className="font-lora text-xl font-semibold text-gray-900 mb-4">
          {t('give.methods_title')}
        </h2>
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {activeMethods.map((method, i) => (
            <DonationCard key={method.id} method={method} locale={locale} index={i} />
          ))}
        </motion.div>
      </div>

      {/* Reference note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="text-center text-xs text-gray-400 px-4"
      >
        {t('give.reference_note')}
      </motion.p>

      {/* Thank you / Scripture */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="bg-cifm-gold-100 border border-cifm-gold-400/30 rounded-2xl p-6 text-center"
      >
        <div className="flex justify-center mb-3">
          <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-cifm-gold-400" />
          </div>
        </div>
        <p className="font-lora text-cifm-blue-700 font-semibold text-lg">
          {t('give.thank_you')}
        </p>
        <p className="text-gray-600 text-sm mt-2 italic leading-relaxed">
          {t('give.scripture')}
        </p>
        <p className="text-gray-500 text-xs mt-1 font-medium">
          {t('give.scripture_ref')}
        </p>
      </motion.div>
    </div>
  )
}
