import Image from 'next/image'
import { useTranslations } from 'next-intl'
import AnimatedSection from '@/components/shared/AnimatedSection'
import HeroSlider from '@/components/home/HeroSlider'

export default function HomePage() {
  return <HomeContent />
}

function HomeContent() {
  const t = useTranslations()

  const slides = [
    {
      image: '/images/headers/hero-worship-congregation.png',
      title: t('home.hero_title'),
      subtitle: t('home.hero_subtitle'),
      cta: { label: t('home.hero_cta'), href: '#dernier-message' },
      ctaSecondary: { label: t('home.join_cta'), href: '#a-propos' },
    },
    {
      image: '/images/headers/hero-church-sunset.png',
      title: t('home.slide2_title'),
      subtitle: t('home.slide2_subtitle'),
      cta: { label: t('home.slide2_cta'), href: '/fr/a-propos' },
    },
    {
      image: '/images/headers/hero-community-joy.png',
      title: t('home.slide3_title'),
      subtitle: t('home.slide3_subtitle'),
      cta: { label: t('home.slide3_cta'), href: '/fr/a-propos' },
    },
    {
      image: '/images/headers/hero-giving-offering.png',
      title: t('home.slide4_title'),
      subtitle: t('home.slide4_subtitle'),
      cta: { label: t('home.slide4_cta'), href: '/fr/dons' },
    },
  ]

  return (
    <div className="space-y-0">
      {/* Hero Slider */}
      <HeroSlider
        slides={slides}
        logo="/images/logo/logo-cifm4.png"
        interval={6000}
      />

      {/* Dernier sermon */}
      <AnimatedSection className="px-4 py-10 max-w-2xl mx-auto">
        <h2 className="font-lora text-2xl font-semibold text-gray-900 mb-6">{t('home.latest_sermon')}</h2>
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="aspect-video bg-gray-100 overflow-hidden flex items-center justify-center">
            <p className="text-gray-400 text-sm">[Dernier sermon YouTube — a venir]</p>
          </div>
          <div className="p-4 space-y-1">
            <p className="font-semibold text-gray-900">[Titre du sermon]</p>
            <p className="text-sm text-gray-500">[Speaker] · [Date]</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Annonces urgentes */}
      <AnimatedSection className="px-4 pb-6 max-w-2xl mx-auto" delay={0.1}>
        <h2 className="font-lora text-2xl font-semibold text-gray-900 mb-4">{t('home.upcoming_events')}</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 hover:shadow-sm transition-shadow duration-300">
          <p className="text-gray-500 text-sm">[Annonces de la communaute — a venir]</p>
        </div>
      </AnimatedSection>

      {/* Evenements a venir */}
      <AnimatedSection className="px-4 pb-6 max-w-2xl mx-auto" delay={0.15}>
        <h2 className="font-lora text-2xl font-semibold text-gray-900 mb-4">{t('home.upcoming_events')}</h2>
        <div className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow duration-300">
          <p className="text-gray-500 text-sm">[Evenements — a venir]</p>
        </div>
      </AnimatedSection>

      {/* Section priere */}
      <AnimatedSection className="px-4 pb-10 max-w-2xl mx-auto" delay={0.2}>
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
            <a href="/fr/priere"
               className="inline-block bg-cifm-blue-600 text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-cifm-blue-500 active:scale-[0.97] transition-all">
              {t('prayer.submit')}
            </a>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
