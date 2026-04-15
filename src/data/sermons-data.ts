/**
 * Static sermons data — mirrors the Sermon Firestore schema.
 * When Firebase is wired up, replace with Firestore queries from src/lib/firebase/services/sermons.ts
 *
 * YouTube IDs are placeholders until Denis provides real URLs.
 * To get a real ID: extract 11 chars after ?v= or youtu.be/ in any YouTube URL.
 */

export interface StaticSermon {
  id: string
  youtubeVideoId: string  // 11 chars — placeholder until real URLs provided
  title: { fr: string; en: string }
  description: { fr: string; en: string }
  speaker: string
  series: { fr: string; en: string } | null
  tags: string[]
  publishedAt: string  // ISO date
  featured: boolean
}

export const sermons: StaticSermon[] = [
  {
    id: 'sermon-01',
    youtubeVideoId: '_placeholder_1',
    title: {
      fr: 'Le message de Malachie 4 : Restaurer les cœurs',
      en: 'The Message of Malachi 4: Restoring Hearts',
    },
    description: {
      fr: 'Une prédication sur le message central de Malachie 4:5-6 — comment Dieu restaure les liens entre les générations et ramène les cœurs vers Lui.',
      en: 'A sermon on the central message of Malachi 4:5-6 — how God restores the bonds between generations and turns hearts back to Him.',
    },
    speaker: 'Apôtre David Descartes Tadum',
    series: {
      fr: 'Fondements de la CIFM4',
      en: 'Foundations of CIFM4',
    },
    tags: ['Malachie', 'restauration', 'fondement'],
    publishedAt: '2025-03-15',
    featured: true,
  },
  {
    id: 'sermon-02',
    youtubeVideoId: '_placeholder_2',
    title: {
      fr: 'Vivre comme l\'Église d\'Actes 2',
      en: 'Living Like the Church of Acts 2',
    },
    description: {
      fr: 'Comment la première Église vivait en communauté selon Actes 2:42-47, et comment nous pouvons appliquer ces principes aujourd\'hui dans notre vie quotidienne.',
      en: 'How the early Church lived in community according to Acts 2:42-47, and how we can apply these principles today in our daily lives.',
    },
    speaker: 'Apôtre David Descartes Tadum',
    series: {
      fr: 'Fondements de la CIFM4',
      en: 'Foundations of CIFM4',
    },
    tags: ['Actes 2', 'communauté', 'vie chrétienne'],
    publishedAt: '2025-03-08',
    featured: false,
  },
  {
    id: 'sermon-03',
    youtubeVideoId: '_placeholder_3',
    title: {
      fr: 'La puissance de la prière communautaire',
      en: 'The Power of Community Prayer',
    },
    description: {
      fr: 'Découvrez la puissance transformatrice de la prière en communauté. Quand les croyants s\'unissent dans la prière, Dieu agit de manière extraordinaire.',
      en: 'Discover the transformative power of praying in community. When believers unite in prayer, God acts in extraordinary ways.',
    },
    speaker: 'Apôtre David Descartes Tadum',
    series: null,
    tags: ['prière', 'communauté', 'puissance'],
    publishedAt: '2025-02-22',
    featured: false,
  },
  {
    id: 'sermon-04',
    youtubeVideoId: '_placeholder_4',
    title: {
      fr: 'Aider les laissés pour compte : notre appel',
      en: 'Helping the Marginalized: Our Calling',
    },
    description: {
      fr: 'Un message sur notre responsabilité chrétienne d\'accueillir et aider les personnes en difficulté — par une aide matérielle, morale et spirituelle.',
      en: 'A message about our Christian responsibility to welcome and help people in need — through material, moral and spiritual support.',
    },
    speaker: 'Apôtre David Descartes Tadum',
    series: {
      fr: 'Servir comme Christ',
      en: 'Serving Like Christ',
    },
    tags: ['service', 'amour', 'aide', 'compassion'],
    publishedAt: '2025-02-15',
    featured: false,
  },
  {
    id: 'sermon-05',
    youtubeVideoId: '_placeholder_5',
    title: {
      fr: 'Venez dans la tente de guérison du Seigneur',
      en: 'Come Into the Lord\'s Healing Tent',
    },
    description: {
      fr: 'Le Seigneur Jésus-Christ vous attend avec amour et puissance pour vous restaurer et vous libérer. Un message d\'espérance et de guérison divine.',
      en: 'The Lord Jesus Christ awaits you with love and power to restore and set you free. A message of hope and divine healing.',
    },
    speaker: 'Rev. Pasteur Nguemou Ulrich',
    series: null,
    tags: ['guérison', 'foi', 'espérance', 'délivrance'],
    publishedAt: '2025-06-19',
    featured: false,
  },
  {
    id: 'sermon-06',
    youtubeVideoId: '_placeholder_6',
    title: {
      fr: 'Le divin ne peut échouer au nom du Seigneur',
      en: 'The Divine Cannot Fail in the Name of the Lord',
    },
    description: {
      fr: 'Quand Dieu est avec nous, rien ne peut échouer. Découvrez la fidélité de Dieu à travers les promesses bibliques et les témoignages de transformation.',
      en: 'When God is with us, nothing can fail. Discover God\'s faithfulness through biblical promises and testimonies of transformation.',
    },
    speaker: 'Apôtre David Descartes Tadum',
    series: null,
    tags: ['foi', 'fidélité', 'promesses', 'victoire'],
    publishedAt: '2025-01-28',
    featured: false,
  },
]

export const getFeaturedSermon = () => sermons.find(s => s.featured) ?? sermons[0]
export const getRecentSermons = (count: number = 6) => sermons.slice(0, count)
