import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        title="Contact"
        subtitle="Écrivez-nous"
        backgroundImage="/images/sections/welcome-hands.png"
      />
      <AnimatedSection className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nom</label>
              <div className="h-10 bg-gray-100 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="h-10 bg-gray-100 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <div className="h-32 bg-gray-100 rounded-xl" />
            </div>
          </div>
          <div className="bg-cifm-blue-50 rounded-xl p-3 text-center">
            <p className="text-cifm-blue-600 text-sm font-medium">
              [Formulaire de contact — à implémenter avec une API Route ou service email]
            </p>
          </div>
          <button className="w-full bg-cifm-blue-600 text-white rounded-full py-3 font-semibold opacity-60 cursor-not-allowed">
            Envoyer
          </button>
          <div className="text-center space-y-1 pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600 font-medium">tadumdenis@gmail.com</p>
            <p className="text-xs text-gray-400">Nous répondons généralement sous 24-48h</p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
