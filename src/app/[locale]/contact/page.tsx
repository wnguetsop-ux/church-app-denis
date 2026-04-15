import Image from 'next/image'
import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { useTranslations, useLocale } from 'next-intl'

export default function ContactPage() {
  return <ContactContent />
}

function ContactContent() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <div>
      <PageHeader
        title={t('contact.title')}
        subtitle={locale === 'fr' ? 'Prenez contact avec la CIFM4' : 'Get in touch with CIFM4'}
        backgroundImage="/images/sections/welcome-hands.png"
      />
      <AnimatedSection className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        {/* Coordonnées principales */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo/logo-cifm4.png"
              alt="CIFM4"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <p className="font-lora font-semibold text-cifm-blue-700 text-sm leading-snug">
                Communauté Internationale des Fils de Malachie 4
              </p>
              <p className="text-xs text-gray-400">C. I. F. M. 4</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100">
            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cifm-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-cifm-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <a href="mailto:tadumdenis@gmail.com" className="text-sm text-cifm-blue-600 hover:underline">
                  tadumdenis@gmail.com
                </a>
                <p className="text-xs text-gray-400 mt-0.5">
                  {locale === 'fr' ? 'Réponse sous 24-48h' : 'Response within 24-48h'}
                </p>
              </div>
            </div>

            {/* Réseaux */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cifm-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-cifm-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {locale === 'fr' ? 'Réseaux sociaux' : 'Social media'}
                </p>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  <a href="https://www.youtube.com/@communauteinternationalede1948" target="_blank" rel="noopener noreferrer"
                     className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors font-medium">
                    YouTube
                  </a>
                  <a href="https://www.tiktok.com/@communaut.fils.de" target="_blank" rel="noopener noreferrer"
                     className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors font-medium">
                    TikTok
                  </a>
                </div>
              </div>
            </div>

            {/* Site web */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cifm-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-cifm-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.886-3.497l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{locale === 'fr' ? 'Site web' : 'Website'}</p>
                <p className="text-sm text-cifm-blue-600">communautedesfilsdemalachie4.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire placeholder */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-lora text-lg font-semibold text-cifm-blue-700">
            {locale === 'fr' ? 'Envoyez-nous un message' : 'Send us a message'}
          </h2>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">{t('contact.name')}</label>
              <input type="text" className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-cifm-blue-400/30 focus:border-cifm-blue-400" placeholder={locale === 'fr' ? 'Votre nom' : 'Your name'} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">{t('contact.email')}</label>
              <input type="email" className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-cifm-blue-400/30 focus:border-cifm-blue-400" placeholder={locale === 'fr' ? 'votre@email.com' : 'your@email.com'} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">{t('contact.message')}</label>
              <textarea className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cifm-blue-400/30 focus:border-cifm-blue-400 resize-none" placeholder={locale === 'fr' ? 'Votre message...' : 'Your message...'} />
            </div>
          </div>
          <button className="w-full bg-cifm-blue-600 text-white rounded-full py-3 font-semibold opacity-60 cursor-not-allowed">
            {t('contact.submit')}
          </button>
          <p className="text-center text-xs text-gray-400">
            {locale === 'fr' ? 'Formulaire bientôt fonctionnel — contactez-nous par email en attendant.' : 'Form coming soon — contact us by email in the meantime.'}
          </p>
        </div>
      </AnimatedSection>
    </div>
  )
}
