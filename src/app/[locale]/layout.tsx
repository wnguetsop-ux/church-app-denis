import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import Footer from '@/components/layout/Footer'
import NotificationBanner from '@/components/shared/NotificationBanner'

const locales = ['fr', 'en']

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()
  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={messages}>
      <Header locale={locale} />
      <main className="min-h-screen pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNav locale={locale} />
      <NotificationBanner />
    </NextIntlClientProvider>
  )
}
