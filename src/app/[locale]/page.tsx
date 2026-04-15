import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import {
  Video, BookOpen, Bell, Calendar, ImageIcon, HandHeart,
  Heart, Phone, Info, Music, FileText, ChevronRight, ArrowRight
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import HeroSlider from '@/components/home/HeroSlider'
import { sermons, getFeaturedSermon } from '@/data/sermons-data'
import { events } from '@/data/events-data'
import { announcements } from '@/data/announcements-data'

export default function HomePage() {
  return <HomeContent />
}

function HomeContent() {
  const t = useTranslations()
  const locale = useLocale() as 'fr' | 'en'

  const slides = [
    {
      image: '/images/headers/hero-worship-congregation.png',
      title: t('home.hero_title'),
      subtitle: t('home.hero_subtitle'),
      cta: { label: t('home.hero_cta'), href: '#dernier-message' },
      ctaSecondary: { label: t('home.join_cta'), href: `/${locale}/a-propos` },
    },
    {
      image: '/images/headers/hero-church-sunset.png',
      title: t('home.slide2_title'),
      subtitle: t('home.slide2_subtitle'),
      cta: { label: t('home.slide2_cta'), href: `/${locale}/a-propos` },
    },
    {
      image: '/images/headers/hero-community-joy.png',
      title: t('home.slide3_title'),
      subtitle: t('home.slide3_subtitle'),
      cta: { label: t('home.slide3_cta'), href: `/${locale}/a-propos` },
    },
    {
      image: '/images/headers/hero-giving-offering.png',
      title: t('home.slide4_title'),
      subtitle: t('home.slide4_subtitle'),
      cta: { label: t('home.slide4_cta'), href: `/${locale}/dons` },
    },
  ]

  const featured = getFeaturedSermon()
  const urgentAnn = announcements.filter(a => a.priority === 'urgent')
  const upcomingEvents = events
    .filter(e => new Date(e.startAt) >= new Date())
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
    .slice(0, 3)

  // Quick access pages grid
  const quickPages = [
    { icon: Video, labelFr: 'Messages', labelEn: 'Sermons', path: '/messages', color: 'from-blue-500 to-blue-600' },
    { icon: BookOpen, labelFr: 'Enseignements', labelEn: 'Teachings', path: '/enseignements', color: 'from-indigo-500 to-indigo-600' },
    { icon: Video, labelFr: 'Vid\u00E9os', labelEn: 'Videos', path: '/videos', color: 'from-red-500 to-red-600' },
    { icon: FileText, labelFr: 'Textes', labelEn: 'Texts', path: '/textes', color: 'from-emerald-500 to-emerald-600' },
    { icon: Music, labelFr: 'Audios', labelEn: 'Audios', path: '/audios', color: 'from-purple-500 to-purple-600' },
    { icon: Bell, labelFr: 'Annonces', labelEn: 'News', path: '/annonces', color: 'from-amber-500 to-amber-600' },
    { icon: Calendar, labelFr: '\u00C9v\u00E9nements', labelEn: 'Events', path: '/evenements', color: 'from-teal-500 to-teal-600' },
    { icon: ImageIcon, labelFr: 'Galerie', labelEn: 'Gallery', path: '/galerie', color: 'from-pink-500 to-pink-600' },
    { icon: HandHeart, labelFr: 'Pri\u00E8re', labelEn: 'Prayer', path: '/priere', color: 'from-sky-500 to-sky-600' },
    { icon: Heart, labelFr: 'Dons', labelEn: 'Give', path: '/dons', color: 'from-rose-500 to-rose-600' },
    { icon: Info, labelFr: '\u00C0 propos', labelEn: 'About', path: '/a-propos', color: 'from-slate-500 to-slate-600' },
    { icon: Phone, labelFr: 'Contact', labelEn: 'Contact', path: '/contact', color: 'from-cyan-500 to-cyan-600' },
  ]

  return (
    <div className="space-y-0">
      {/* Hero Slider */}
      <HeroSlider
        slides={slides}
        logo="/images/logo/logo-cifm4.png"
        interval={6000}
      />

      {/* Quick Access Grid — All Pages with Icons */}
      <AnimatedSection className="px-4 py-8 max-w-4xl mx-auto">
        <h2 className="font-lora text-xl font-semibold text-gray-900 mb-5 text-center">
          {locale === 'fr' ? 'Acc\u00E8s rapide' : 'Quick Access'}
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {quickPages.map((page) => {
            const Icon = page.icon
            return (
              <Link
                key={page.path}
                href={`/${locale}${page.path}`}
                className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-cifm-blue-100"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${page.color} flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_24px_rgba(37,99,235,0.25)] group-hover:rotate-3`}>
                  <Icon size={22} />
                </div>
                <span className="text-[11px] font-medium text-gray-600 group-hover:text-cifm-blue-700 transition-colors text-center leading-tight">
                  {locale === 'fr' ? page.labelFr : page.labelEn}
                </span>
              </Link>
            )
          })}
        </div>
      </AnimatedSection>

      {/* Urgent announcement banner */}
      {urgentAnn.length > 0 && (
        <AnimatedSection className="px-4 max-w-2xl mx-auto">
          {urgentAnn.map(ann => (
            <Link key={ann.id} href={`/${locale}/annonces`}
              className="block bg-red-50 border border-red-200 rounded-2xl p-4 group hover:shadow-lg hover:shadow-red-100/50 transition-all duration-300">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  <Bell size={10} /> URGENT
                </span>
              </div>
              <p className="font-semibold text-red-900 text-sm group-hover:text-red-700 transition-colors">
                {ann.title[locale]}
              </p>
            </Link>
          ))}
        </AnimatedSection>
      )}

      {/* Dernier sermon */}
      <AnimatedSection id="dernier-message" className="px-4 py-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-lora text-xl font-semibold text-gray-900">{t('home.latest_sermon')}</h2>
          <Link href={`/${locale}/messages`} className="text-cifm-blue-600 text-xs font-semibold hover:underline flex items-center gap-1">
            {t('common.see_all')} <ArrowRight size={12} />
          </Link>
        </div>
        {featured && (
          <Link href={`/${locale}/messages/${featured.id}`}
            className="block group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="aspect-video bg-gray-100 overflow-hidden flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <div className="absolute bottom-3 left-3 right-3 z-20">
                <p className="text-white font-semibold text-sm drop-shadow-lg">{featured.title[locale]}</p>
                <p className="text-white/70 text-xs mt-0.5">{featured.speaker}</p>
              </div>
              <Video size={48} className="text-gray-300" />
            </div>
          </Link>
        )}
      </AnimatedSection>

      {/* Upcoming events */}
      {upcomingEvents.length > 0 && (
        <AnimatedSection className="px-4 pb-8 max-w-2xl mx-auto" delay={0.1}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-lora text-xl font-semibold text-gray-900">{t('home.upcoming_events')}</h2>
            <Link href={`/${locale}/evenements`} className="text-cifm-blue-600 text-xs font-semibold hover:underline flex items-center gap-1">
              {t('common.see_all')} <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map(evt => (
              <Link key={evt.id} href={`/${locale}/evenements`}
                className="flex items-center gap-3 bg-white rounded-xl p-3.5 shadow-sm group hover:shadow-md hover:border-cifm-blue-100 border border-transparent transition-all duration-300">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-cifm-blue-600 text-white flex flex-col items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(37,99,235,0.2)] transition-all duration-300">
                  <span className="text-base font-bold leading-none">{new Date(evt.startAt).getDate()}</span>
                  <span className="text-[8px] uppercase">
                    {new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-CA', { month: 'short' }).format(new Date(evt.startAt))}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate group-hover:text-cifm-blue-700 transition-colors">{evt.title[locale]}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{evt.location[locale]}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-cifm-blue-400 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* Presentation CIFM4 */}
      <AnimatedSection className="px-4 pb-8 max-w-2xl mx-auto" delay={0.1}>
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo/logo-cifm4.png"
              alt="CIFM4"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <h2 className="font-lora text-lg font-semibold text-cifm-blue-700">
              {locale === 'fr' ? 'Qui sommes-nous ?' : 'Who are we?'}
            </h2>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {t('about.mission_text')}
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2 text-sm text-gray-600">
              <span className="text-cifm-gold-400 mt-0.5">&#9670;</span>
              {t('about.objective_1')}
            </li>
            <li className="flex gap-2 text-sm text-gray-600">
              <span className="text-cifm-gold-400 mt-0.5">&#9670;</span>
              {t('about.objective_3')}
            </li>
            <li className="flex gap-2 text-sm text-gray-600">
              <span className="text-cifm-gold-400 mt-0.5">&#9670;</span>
              {t('about.objective_5')}
            </li>
          </ul>
          <Link
            href={`/${locale}/a-propos`}
            className="inline-block text-cifm-blue-600 text-sm font-semibold hover:text-cifm-blue-500 transition-colors"
          >
            {t('common.read_more')} &rarr;
          </Link>
        </div>
      </AnimatedSection>

      {/* Section priere */}
      <AnimatedSection className="px-4 pb-10 max-w-2xl mx-auto" delay={0.15}>
        <div className="relative bg-cifm-blue-50 border border-cifm-blue-100 rounded-2xl p-6 text-center space-y-3 overflow-hidden">
          <Image
            src="/images/sections/prayer-hands.png"
            alt=""
            fill
            className="object-cover opacity-10"
            sizes="(max-width: 768px) 100vw, 672px"
          />
          <div className="relative z-10 space-y-3">
            <p className="font-lora text-lg font-semibold text-cifm-blue-700">{t('home.prayer_cta')}</p>
            <p className="text-gray-600 text-sm">{t('prayer.intro')}</p>
            <Link href={`/${locale}/priere`}
               className="inline-block bg-cifm-blue-600 text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-cifm-blue-500 active:scale-[0.97] transition-all">
              {t('prayer.submit')}
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
