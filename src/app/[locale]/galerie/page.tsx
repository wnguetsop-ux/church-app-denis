import { useTranslations } from 'next-intl'
import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import type { Locale } from '@/types'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function GaleriePage({ params }: Props) {
  const { locale } = await params

  return (
    <div>
      <GalerieContent locale={locale as Locale} />
    </div>
  )
}

function GalerieContent({ locale }: { locale: Locale }) {
  const t = useTranslations()

  return (
    <>
      <PageHeader
        title={t('gallery.title')}
        subtitle={t('gallery.subtitle')}
        backgroundImage="/images/headers/hero-community-joy.png"
      />
      <AnimatedSection className="max-w-5xl mx-auto px-4 py-8">
        <GalleryGrid locale={locale} />
      </AnimatedSection>
    </>
  )
}
