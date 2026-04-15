import { notFound } from 'next/navigation'
import { sermons } from '@/data/sermons-data'
import SermonDetail from '@/components/messages/SermonDetail'
import type { Locale } from '@/types'

export default async function SermonDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const sermon = sermons.find(s => s.id === id)
  if (!sermon) notFound()

  return <SermonDetail sermon={sermon} locale={locale as Locale} />
}
