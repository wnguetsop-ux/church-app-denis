import {
  Video, Megaphone, Calendar, ImageIcon,
  HandHeart, Heart, Phone, Church, Headphones
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface SectionCard {
  href: string
  label: string
  description: string
  icon: LucideIcon
  count?: string
  color: string
}

const sections: SectionCard[] = [
  {
    href: '/admin/messages',
    label: 'Messages / Sermons',
    description: 'Vidéos YouTube, prédications',
    icon: Video,
    color: 'bg-red-50 text-red-600',
  },
  {
    href: '/admin/enseignements',
    label: 'Enseignements / Podcasts',
    description: 'Textes et podcasts',
    icon: Headphones,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    href: '/admin/annonces',
    label: 'Annonces',
    description: 'Actualités de la communauté',
    icon: Megaphone,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    href: '/admin/evenements',
    label: 'Événements',
    description: 'Agenda, lieux, dates',
    icon: Calendar,
    color: 'bg-green-50 text-green-600',
  },
  {
    href: '/admin/galerie',
    label: 'Galerie',
    description: 'Photos et vidéos courtes',
    icon: ImageIcon,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    href: '/admin/prieres',
    label: 'Prières reçues',
    description: 'Demandes de prière des fidèles',
    icon: HandHeart,
    color: 'bg-pink-50 text-pink-600',
  },
  {
    href: '/admin/dons',
    label: 'Dons',
    description: 'Méthodes de don, coordonnées',
    icon: Heart,
    color: 'bg-yellow-50 text-yellow-700',
  },
  {
    href: '/admin/contact',
    label: 'Contact',
    description: 'Infos de contact, réseaux sociaux',
    icon: Phone,
    color: 'bg-teal-50 text-teal-600',
  },
  {
    href: '/admin/a-propos',
    label: 'À propos / Église',
    description: 'Mission, histoire, équipe, croyances',
    icon: Church,
    color: 'bg-indigo-50 text-indigo-600',
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-lora text-2xl font-semibold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">
          Bienvenue, Denis. Gérez le contenu de la CIFM4 depuis cet espace.
        </p>
      </div>

      {/* Quick stats placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Messages', value: '—', sub: 'vidéos YouTube' },
          { label: 'Prières', value: '—', sub: 'demandes reçues' },
          { label: 'Galerie', value: '66', sub: 'photos et vidéos' },
          { label: 'Événements', value: '—', sub: 'à venir' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Section cards */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Gérer le contenu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map(s => (
            <a
              key={s.href}
              href={s.href}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center`}>
                  <s.icon className="w-4.5 h-4.5" />
                </div>
                <span className="font-semibold text-gray-800 text-sm group-hover:text-cifm-blue-600 transition-colors">
                  {s.label}
                </span>
              </div>
              <p className="text-xs text-gray-500">{s.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
