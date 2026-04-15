import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import PrayerForm from '@/components/prayer/PrayerForm'
import type { Locale } from '@/types'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function PrierePage({ params }: Props) {
  const { locale } = await params
  return <PriereContent locale={locale as Locale} />
}

function PriereContent({ locale }: { locale: Locale }) {
  const t = useTranslations()

  return (
    <div>
      <PageHeader
        title={t('prayer.title')}
        subtitle={t('prayer.subtitle')}
        backgroundImage="/images/sections/prayer-hands.png"
      />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Intro */}
        <AnimatedSection>
          <div className="relative bg-gradient-to-br from-cifm-blue-50 to-white border border-cifm-blue-100 rounded-2xl p-6 overflow-hidden">
            <div className="relative z-10 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cifm-blue-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-cifm-blue-600" />
              </div>
              <div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {t('prayer.intro')}
                </p>
              </div>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-cifm-blue-100/40" />
          </div>
        </AnimatedSection>

        {/* Form */}
        <AnimatedSection delay={0.1}>
          <PrayerForm locale={locale} />
        </AnimatedSection>

        {/* Scripture encouragement */}
        <AnimatedSection delay={0.2}>
          <div className="border-l-4 border-cifm-gold-400 bg-cifm-gold-100 rounded-r-2xl px-5 py-4">
            <p className="text-gray-700 text-sm italic leading-relaxed">
              {t('prayer.verse')}
            </p>
            <p className="text-gray-500 text-xs mt-2 font-medium">{t('prayer.verse_ref')}</p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
