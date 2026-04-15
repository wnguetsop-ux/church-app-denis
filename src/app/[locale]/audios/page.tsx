import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function AudiosPage() {
  return (
    <div>
      <PageHeader
        title="Enseignements Audio"
        subtitle="Écouter les messages audio de la CIFM4"
        backgroundImage="/images/headers/hero-worship-stage.png"
      />
      <AnimatedSection className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center space-y-3">
          <p className="text-gray-500">
            [Contenu à venir — connecter à Firestore collection <code className="text-cifm-blue-600 bg-blue-50 px-1 rounded">teachings</code> (type: audio)]
          </p>
          <p className="text-gray-400 text-sm">
            Les enseignements audio seront listés ici avec un lecteur intégré.
          </p>
        </div>
      </AnimatedSection>
    </div>
  )
}
