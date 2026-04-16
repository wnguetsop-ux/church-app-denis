export interface StaticEvent {
  id: string
  title: { fr: string; en: string }
  description: { fr: string; en: string }
  location: { fr: string; en: string }
  startAt: string
  endAt: string | null
  imageUrl: string | null
  registrationRequired: boolean
}

export const events: StaticEvent[] = [
  {
    id: 'evt-01',
    title: {
      fr: 'Culte dominical',
      en: 'Sunday Service',
    },
    description: {
      fr: 'Notre culte hebdomadaire de louange, d\'adoration et d\'enseignement de la Parole de Dieu. Venez vivre un moment de communion avec la communauté CIFM4.',
      en: 'Our weekly worship, praise and Bible teaching service. Come experience a time of fellowship with the CIFM4 community.',
    },
    location: {
      fr: 'Lieu de culte CIFM4',
      en: 'CIFM4 Worship Center',
    },
    startAt: '2025-04-20T10:00:00',
    endAt: '2025-04-20T13:00:00',
    imageUrl: null,
    registrationRequired: false,
  },
  {
    id: 'evt-02',
    title: {
      fr: 'Soirée de prière et intercession',
      en: 'Prayer and Intercession Evening',
    },
    description: {
      fr: 'Une soirée dédiée à la prière et à l\'intercession pour notre communauté, nos familles et notre nation. Comme l\'Église d\'Actes 2, prions ensemble avec ferveur.',
      en: 'An evening dedicated to prayer and intercession for our community, families and nation. Like the Church of Acts 2, let us pray together fervently.',
    },
    location: {
      fr: 'En ligne (Zoom) & sur place',
      en: 'Online (Zoom) & on-site',
    },
    startAt: '2025-04-18T19:00:00',
    endAt: '2025-04-18T21:00:00',
    imageUrl: null,
    registrationRequired: false,
  },
  {
    id: 'evt-03',
    title: {
      fr: 'Retraite spirituelle — Malachie 4',
      en: 'Spiritual Retreat — Malachi 4',
    },
    description: {
      fr: 'Un week-end de retraite spirituelle pour approfondir le message de Malachie 4:5-6. Enseignements, prière, louange et communion fraternelle dans un cadre propice au ressourcement.',
      en: 'A weekend spiritual retreat to deepen the message of Malachi 4:5-6. Teaching, prayer, worship and fellowship in a setting conducive to renewal.',
    },
    location: {
      fr: 'Centre de retraite (à confirmer)',
      en: 'Retreat center (to be confirmed)',
    },
    startAt: '2025-05-10T09:00:00',
    endAt: '2025-05-11T17:00:00',
    imageUrl: null,
    registrationRequired: true,
  },
  {
    id: 'evt-04',
    title: {
      fr: 'Journée d\'évangélisation communautaire',
      en: 'Community Evangelization Day',
    },
    description: {
      fr: 'Sortie d\'évangélisation dans notre quartier. Distribution de Bibles, témoignages, prières pour les malades et partage de l\'amour de Christ avec nos voisins.',
      en: 'Evangelization outing in our neighborhood. Bible distribution, testimonies, prayers for the sick and sharing Christ\'s love with our neighbors.',
    },
    location: {
      fr: 'Quartier local',
      en: 'Local neighborhood',
    },
    startAt: '2025-04-26T08:00:00',
    endAt: '2025-04-26T14:00:00',
    imageUrl: null,
    registrationRequired: true,
  },
]

export const getUpcomingEvents = () =>
  events.filter(e => new Date(e.startAt) >= new Date()).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())

export const getPastEvents = () =>
  events.filter(e => new Date(e.startAt) < new Date()).sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime())
