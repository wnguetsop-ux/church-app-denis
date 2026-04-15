import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { useTranslations } from 'next-intl'

export default function AProposPage() {
  return <AProposContent />
}

function AProposContent() {
  const t = useTranslations()

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
            &laquo; Voici, je vous enverrai &Eacute;lie, le proph&egrave;te, avant que le jour de l&rsquo;&Eacute;ternel arrive, ce jour grand et redoutable. Il ram&egrave;nera le c&oelig;ur des p&egrave;res &agrave; leurs enfants, et le c&oelig;ur des enfants &agrave; leurs p&egrave;res. &raquo;
          </p>
          <p className="text-cifm-gold-400 text-xs font-semibold">Malachie 4:5-6</p>
        </div>

        {/* Ce que nous croyons */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="font-lora text-lg font-semibold text-cifm-blue-700">
            {t('about.beliefs')}
          </h2>
          <p className="text-gray-400 text-sm">[D&eacute;claration de foi — &agrave; r&eacute;diger par Denis]</p>
        </div>

        {/* Cultes */}
        <div className="bg-cifm-blue-50 border border-cifm-blue-100 rounded-2xl p-6 space-y-3">
          <h2 className="font-lora text-lg font-semibold text-cifm-blue-700">
            {t('about.schedules')}
          </h2>
          <p className="text-gray-500 text-sm">[Horaires des cultes — &agrave; connecter &agrave; Firestore]</p>
        </div>

        {/* Contact + reseaux */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="font-lora text-lg font-semibold text-cifm-blue-700">
            {t('about.follow_us')}
          </h2>
          <div className="flex flex-wrap gap-2">
            <a href="https://www.facebook.com/communautedesfilsdemalachie4" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 bg-blue-50 text-cifm-blue-600 text-sm px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">
              Facebook
            </a>
            <a href="https://www.youtube.com/@communauteinternationalede1948" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-2 rounded-full hover:bg-red-100 transition-colors">
              YouTube
            </a>
            <a href="https://www.tiktok.com/@communaut.fils.de" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
              TikTok
            </a>
          </div>
          <p className="text-gray-600 text-sm">tadumdenis@gmail.com</p>
          <p className="text-gray-400 text-sm">[Adresse et t&eacute;l&eacute;phone — &agrave; fournir]</p>
        </div>
      </AnimatedSection>
    </div>
  )
}
