import { useTranslations } from 'next-intl'
import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import DonationsSection from '@/components/donations/DonationsSection'
import type { Locale } from '@/types'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function DonsPage({ params }: Props) {
  const { locale } = await params

  return (
    <div>
      <DonsContent locale={locale as Locale} />
    </div>
  )
}

function DonsContent({ locale }: { locale: Locale }) {
  const t = useTranslations()

  return (
    <>
      <PageHeader
        title={t('give.title')}
        subtitle={t('give.subtitle')}
        backgroundImage="/images/headers/hero-giving-offering.png"
      />
      <AnimatedSection className="max-w-2xl mx-auto px-4 py-8">
        <DonationsSection locale={locale} />
      </AnimatedSection>
    </>
  )
}
