import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import SermonList from '@/components/messages/SermonList'
import type { Locale } from '@/types'
import { useTranslations } from 'next-intl'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function MessagesPage({ params }: Props) {
  const { locale } = await params
  return <MessagesContent locale={locale as Locale} />
}

function MessagesContent({ locale }: { locale: Locale }) {
  const t = useTranslations()

  return (
    <div>
      <PageHeader
        title={t('messages.title')}
        subtitle={t('messages.subtitle')}
        backgroundImage="/images/headers/hero-preaching-pastor.png"
      />
      <AnimatedSection className="max-w-3xl mx-auto px-4 py-8">
        <SermonList locale={locale} />
      </AnimatedSection>
    </div>
  )
}
