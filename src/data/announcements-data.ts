export interface StaticAnnouncement {
  id: string
  title: { fr: string; en: string }
  body: { fr: string; en: string }
  imageUrl: string | null
  priority: 'normal' | 'urgent'
  publishedAt: string
  expiresAt: string | null
}

export const announcements: StaticAnnouncement[] = [
  {
    id: 'ann-01',
    title: {
      fr: 'Culte spécial de louange — Dimanche prochain',
      en: 'Special Worship Service — Next Sunday',
    },
    body: {
      fr: 'Rejoignez-nous pour un culte spécial de louange et d\'adoration ce dimanche. Un temps de communion profonde avec le Seigneur nous attend. Venez avec vos familles et vos amis !',
      en: 'Join us for a special worship and praise service this Sunday. A time of deep fellowship with the Lord awaits us. Come with your families and friends!',
    },
    imageUrl: null,
    priority: 'urgent',
    publishedAt: '2025-04-10',
    expiresAt: '2025-04-20',
  },
  {
    id: 'ann-02',
    title: {
      fr: 'Nouvelle série d\'enseignements sur Malachie 4',
      en: 'New Teaching Series on Malachi 4',
    },
    body: {
      fr: 'L\'Apôtre David Descartes Tadum entame une nouvelle série d\'enseignements sur Malachie 4:5-6. Chaque mercredi soir à 19h. Ne manquez pas cette occasion d\'approfondir votre compréhension du message fondateur de la CIFM4.',
      en: 'Apostle David Descartes Tadum is starting a new teaching series on Malachi 4:5-6. Every Wednesday evening at 7 PM. Don\'t miss this opportunity to deepen your understanding of CIFM4\'s founding message.',
    },
    imageUrl: null,
    priority: 'normal',
    publishedAt: '2025-04-05',
    expiresAt: null,
  },
  {
    id: 'ann-03',
    title: {
      fr: 'Collecte de vêtements pour les personnes dans le besoin',
      en: 'Clothing Drive for People in Need',
    },
    body: {
      fr: 'Dans l\'esprit d\'Actes 2, nous organisons une collecte de vêtements pour les personnes en difficulté de notre communauté. Apportez vos dons de vêtements propres et en bon état lors des prochains cultes. Ensemble, faisons une différence !',
      en: 'In the spirit of Acts 2, we are organizing a clothing drive for people in need in our community. Bring your donations of clean, good-condition clothing to the upcoming services. Together, let\'s make a difference!',
    },
    imageUrl: null,
    priority: 'normal',
    publishedAt: '2025-03-28',
    expiresAt: null,
  },
  {
    id: 'ann-04',
    title: {
      fr: 'Groupe de prière en ligne — Chaque vendredi',
      en: 'Online Prayer Group — Every Friday',
    },
    body: {
      fr: 'Rejoignez notre groupe de prière en ligne chaque vendredi de 20h à 21h. Un temps d\'intercession puissant où nous portons ensemble les besoins de la communauté devant le Seigneur. Lien de connexion disponible sur demande.',
      en: 'Join our online prayer group every Friday from 8 PM to 9 PM. A powerful time of intercession where we bring the community\'s needs before the Lord together. Connection link available upon request.',
    },
    imageUrl: null,
    priority: 'normal',
    publishedAt: '2025-03-15',
    expiresAt: null,
  },
]

export const getUrgentAnnouncements = () => announcements.filter(a => a.priority === 'urgent')
export const getNormalAnnouncements = () => announcements.filter(a => a.priority === 'normal')
