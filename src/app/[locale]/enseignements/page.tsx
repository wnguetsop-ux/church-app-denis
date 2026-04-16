import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import TeachingsList from '@/components/teachings/TeachingsList'
import type { Locale } from '@/types'
import { useTranslations } from 'next-intl'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function EnseignementsPage({ params }: Props) {
  const { locale } = await params
  return <EnseignementsContent locale={locale as Locale} />
}

function EnseignementsContent({ locale }: { locale: Locale }) {
  const t = useTranslations()

  return (
    <div>
      <PageHeader
        title={t('teachings.title')}
        subtitle={locale === 'fr' ? 'Textes et podcasts d\'enseignement biblique' : 'Biblical teaching texts and podcasts'}
        backgroundImage="/images/headers/hero-bible-teaching.png"
      />
      <AnimatedSection className="max-w-3xl mx-auto px-4 py-8">
        <TeachingsList locale={locale} />
      </AnimatedSection>
    </div>
  )
}
