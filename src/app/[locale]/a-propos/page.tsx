import Image from 'next/image'
import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { useTranslations, useLocale } from 'next-intl'

export default function AProposPage() {
  return <AProposContent />
}

function AProposContent() {
  const t = useTranslations()
  const locale = useLocale()

  const objectives = [
    t('about.objective_1'),
    t('about.objective_2'),
    t('about.objective_3'),
    t('about.objective_4'),
    t('about.objective_5'),
    t('about.objective_6'),
  ]

  return (
    <div>
      <PageHeader
        title={t('about.title')}
        subtitle={t('about.who_we_are')}
        backgroundImage="/images/headers/hero-church-sunset.png"
      />
      <AnimatedSection className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Logo + identité */}
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm">
          <Image
            src="/images/logo/logo-cifm4.png"
            alt="Logo CIFM4"
            width={64}
            height={64}
            className="rounded-xl"
          />
          <div>
            <p className="font-lora text-base font-semibold text-cifm-blue-700 leading-snug">
              Communauté Internationale des Fils de Malachie 4
            </p>
            <p className="text-xs text-gray-500 mt-0.5">C. I. F. M. 4 · {locale === 'fr' ? 'Organisation chrétienne à but non lucratif' : 'Non-profit Christian organization'}</p>
          </div>
        </div>

        {/* Mission officielle */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-lora text-lg font-semibold text-cifm-blue-700">
            {t('about.mission')}
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            {t('about.mission_text')}
          </p>
          <ul className="space-y-2.5">
            {objectives.map((obj, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-gray-600 leading-relaxed">
                <span className="shrink-0 w-5 h-5 rounded-full bg-cifm-blue-100 text-cifm-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                {obj}
              </li>
            ))}
          </ul>
        </div>

        {/* Verset Malachie 4:5-6 */}
        <div className="border-l-4 border-cifm-gold-400 bg-cifm-gold-100/50 rounded-r-2xl p-5 space-y-2">
          <p className="text-gray-700 text-sm italic leading-relaxed">
            {locale === 'fr'
              ? '« Voici, je vous enverrai Élie, le prophète, avant que le jour de l\u2019Éternel arrive, ce jour grand et redoutable. Il ramènera le cœur des pères à leurs enfants, et le cœur des enfants à leurs pères. »'
              : '"Behold, I will send you Elijah the prophet before the coming of the great and dreadful day of the LORD. And he will turn the hearts of the fathers to the children, and the hearts of the children to their fathers."'
            }
          </p>
          <p className="text-cifm-gold-400 text-xs font-semibold">
            {locale === 'fr' ? 'Malachie 4:5-6' : 'Malachi 4:5-6'}
          </p>
        </div>

        {/* Réseaux sociaux */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-lora text-lg font-semibold text-cifm-blue-700">
            {t('about.follow_us')}
          </h2>
          <div className="flex flex-wrap gap-2">
            <a href="https://www.youtube.com/@communauteinternationalede1948" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-full hover:bg-red-100 transition-colors font-medium">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z"/>
              </svg>
              YouTube
            </a>
            <a href="https://www.tiktok.com/@communaut.fils.de" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 text-sm px-4 py-2.5 rounded-full hover:bg-gray-200 transition-colors font-medium">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.79a4.85 4.85 0 01-1-.1z"/>
              </svg>
              TikTok
            </a>
          </div>
          <div className="pt-2 border-t border-gray-100 space-y-1">
            <p className="text-gray-600 text-sm font-medium">sonsofmalachie4@gmail.com</p>
            <p className="text-gray-400 text-xs">communautedesfilsdemalachie4.com</p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
