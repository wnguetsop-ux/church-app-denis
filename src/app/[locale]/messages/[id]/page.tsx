'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ArrowLeft, Calendar, Share2, User, Video } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { useSermons } from '@/lib/hooks/use-sermons'
import { getYouTubeEmbedUrl } from '@/lib/media/youtube'
import type { Locale } from '@/types'

export default function MessageDetailPage() {
  const params = useParams<{ locale: string; id: string }>()
  const locale = (params.locale || 'fr') as Locale
  const id = params.id
  const t = useTranslations()
  const { sermons, isLoading } = useSermons()
  const sermon = sermons.find(item => item.id === id)

  if (isLoading) {
    return (
      <div>
        <PageHeader title={t('messages.title')} subtitle={t('common.loading')} backgroundImage="/images/headers/hero-preaching-pastor.png" />
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="aspect-video rounded-2xl bg-gray-100 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!sermon) {
    return (
      <div>
        <PageHeader title={t('messages.title')} subtitle={t('common.no_content')} backgroundImage="/images/headers/hero-preaching-pastor.png" />
        <div className="mx-auto max-w-3xl px-4 py-8">
          <Link href={`/${locale}/messages`} className="inline-flex items-center gap-2 text-sm font-semibold text-cifm-blue-600">
            <ArrowLeft className="h-4 w-4" />
            {t('messages.back')}
          </Link>
        </div>
      </div>
    )
  }

  const title = sermon.title[locale] || sermon.title.fr
  const description = sermon.description[locale] || sermon.description.fr
  const embedUrl = getYouTubeEmbedUrl(sermon.youtubeVideoId)
  const date = new Date(sermon.publishedAt).toLocaleDateString(
    locale === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <div>
      <PageHeader title={title} subtitle={sermon.speaker} backgroundImage="/images/headers/hero-preaching-pastor.png" />

      <AnimatedSection className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <Link href={`/${locale}/messages`} className="inline-flex items-center gap-2 text-sm font-semibold text-cifm-blue-600">
          <ArrowLeft className="h-4 w-4" />
          {t('messages.back')}
        </Link>

        <div className="overflow-hidden rounded-2xl bg-black shadow-lg">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-gray-900 text-white">
              <Video className="h-12 w-12 opacity-60" />
              <p className="text-sm">{t('messages.video_coming')}</p>
            </div>
          )}
        </div>

        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {sermon.speaker}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {date}
            </span>
          </div>

          <h1 className="font-lora mb-3 text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {sermon.tags.map(tag => (
              <span key={tag} className="rounded-full bg-cifm-blue-50 px-3 py-1 text-xs font-medium text-cifm-blue-600">
                {tag}
              </span>
            ))}
          </div>
        </article>

        <button
          type="button"
          onClick={() => navigator.share?.({ title, url: window.location.href })}
          className="inline-flex items-center gap-2 rounded-full bg-cifm-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cifm-blue-500"
        >
          <Share2 className="h-4 w-4" />
          {t('messages.share')}
        </button>
      </AnimatedSection>
    </div>
  )
}
