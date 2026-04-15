import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import VideoHub from '@/components/videos/VideoHub'
import type { Locale } from '@/types'
import { useTranslations } from 'next-intl'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function VideosPage({ params }: Props) {
  const { locale } = await params
  return <VideosContent locale={locale as Locale} />
}

function VideosContent({ locale }: { locale: Locale }) {
  const t = useTranslations()

  return (
    <div>
      <PageHeader
        title={locale === 'fr' ? 'Vidéos' : 'Videos'}
        subtitle={locale === 'fr' ? 'Sermons YouTube et clips de la communauté' : 'YouTube sermons and community clips'}
        backgroundImage="/images/headers/hero-worship-stage.png"
      />
      <AnimatedSection className="max-w-3xl mx-auto px-4 py-8">
        <VideoHub locale={locale} />
      </AnimatedSection>
    </div>
  )
}
