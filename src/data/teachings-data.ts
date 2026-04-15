/**
 * Static teachings data — mirrors the Teaching Firestore schema.
 * When Firebase is wired up, replace with Firestore queries from src/lib/firebase/services/teachings.ts
 *
 * Teachings are either 'text' (articles) or 'audio' (audio lessons).
 * This is distinct from Sermons (Messages) which are YouTube video-based.
 */

export interface StaticTeaching {
  id: string
  type: 'text' | 'audio'
  title: { fr: string; en: string }
  body: { fr: string; en: string } | null       // text teachings only
  audioUrl: string | null                        // audio teachings only (Firebase Storage)
  audioDuration: string | null                   // e.g. "38:42"
  coverImageUrl: string | null
  tags: string[]
  publishedAt: string  // ISO date
  featured: boolean
}

export const teachings: StaticTeaching[] = [
  // ── Text teachings ─────────────────────────────────
  {
    id: 'teach-text-01',
    type: 'text',
    title: {
      fr: 'Comprendre Malachie 4:5-6 — Le message pour notre temps',
      en: 'Understanding Malachi 4:5-6 — The Message for Our Time',
    },
    body: {
      fr: `Le prophète Malachie a annoncé un temps de restauration : « Voici, je vous enverrai Élie, le prophète, avant que le jour de l'Éternel arrive, ce jour grand et redoutable. Il ramènera le cœur des pères vers les enfants, et le cœur des enfants vers leurs pères. » (Malachie 4:5-6)

Ce message est au cœur de la mission de la CIFM4. Nous croyons que Dieu accomplit cette promesse dans notre génération — en restaurant les liens brisés, en ramenant les familles à la foi, et en préparant un peuple pour le retour du Seigneur.

Comment vivre ce message au quotidien ? En étant des agents de réconciliation dans nos familles, nos communautés et notre société. En portant le message de la Parole avec fidélité et amour.`,
      en: `The prophet Malachi announced a time of restoration: "Behold, I will send you Elijah the prophet before the coming of the great and dreadful day of the Lord. And he will turn the hearts of the fathers to the children, and the hearts of the children to their fathers." (Malachi 4:5-6)

This message is at the heart of CIFM4's mission. We believe that God is fulfilling this promise in our generation — restoring broken bonds, bringing families back to faith, and preparing a people for the Lord's return.

How do we live this message daily? By being agents of reconciliation in our families, communities, and society. By carrying the message of the Word with faithfulness and love.`,
    },
    audioUrl: null,
    audioDuration: null,
    coverImageUrl: null,
    tags: ['Malachie', 'prophétie', 'restauration', 'fondement'],
    publishedAt: '2025-03-10',
    featured: true,
  },
  {
    id: 'teach-text-02',
    type: 'text',
    title: {
      fr: 'Le style de vie communautaire d\'Actes 2',
      en: 'The Communal Lifestyle of Acts 2',
    },
    body: {
      fr: `« Ils persévéraient dans l'enseignement des apôtres, dans la communion fraternelle, dans la fraction du pain et dans les prières. » (Actes 2:42)

L'Église primitive nous donne un modèle puissant de vie en communauté. Les premiers chrétiens ne se contentaient pas d'assister à des cultes — ils vivaient ensemble, partageaient leurs biens, et s'entraidaient au quotidien.

À la CIFM4, nous aspirons à retrouver cet esprit communautaire :
• Partager nos repas et nos ressources
• Prier les uns pour les autres avec constance
• Soutenir matériellement et spirituellement ceux qui traversent des épreuves
• Grandir ensemble dans la connaissance de la Parole

Ce n'est pas un idéal inaccessible — c'est la vie normale du chrétien selon la Bible.`,
      en: `"They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer." (Acts 2:42)

The early Church gives us a powerful model of community living. The first Christians didn't just attend services — they lived together, shared their possessions, and helped each other daily.

At CIFM4, we aspire to rediscover this communal spirit:
• Sharing our meals and resources
• Praying for one another consistently
• Supporting materially and spiritually those going through trials
• Growing together in the knowledge of the Word

This is not an unattainable ideal — it is the normal Christian life according to the Bible.`,
    },
    audioUrl: null,
    audioDuration: null,
    coverImageUrl: null,
    tags: ['Actes 2', 'communauté', 'vie chrétienne', 'partage'],
    publishedAt: '2025-02-20',
    featured: false,
  },
  {
    id: 'teach-text-03',
    type: 'text',
    title: {
      fr: 'L\'appel à servir les plus vulnérables',
      en: 'The Call to Serve the Most Vulnerable',
    },
    body: {
      fr: `Jésus a dit : « En vérité, je vous le dis, toutes les fois que vous avez fait ces choses à l'un de ces plus petits de mes frères, c'est à moi que vous les avez faites. » (Matthieu 25:40)

Servir les laissés pour compte n'est pas une option pour le chrétien — c'est un commandement. La CIFM4 s'engage à accueillir les personnes en difficulté par une aide matérielle, morale et spirituelle.

Que pouvons-nous faire concrètement ?
• Offrir un repas, un vêtement, un abri à celui qui en a besoin
• Écouter avec compassion ceux qui souffrent
• Prier pour la guérison et la restauration des cœurs brisés
• Partager l'espérance de l'Évangile avec ceux qui sont dans les ténèbres`,
      en: `Jesus said: "Truly I tell you, whatever you did for one of the least of these brothers and sisters of mine, you did for me." (Matthew 25:40)

Serving the marginalized is not optional for Christians — it is a commandment. CIFM4 is committed to welcoming people in difficulty through material, moral and spiritual support.

What can we do practically?
• Offer a meal, clothing, shelter to those in need
• Listen with compassion to those who suffer
• Pray for healing and restoration of broken hearts
• Share the hope of the Gospel with those in darkness`,
    },
    audioUrl: null,
    audioDuration: null,
    coverImageUrl: null,
    tags: ['service', 'amour', 'compassion', 'aide'],
    publishedAt: '2025-01-15',
    featured: false,
  },

  // ── Audio teachings ─────────────────────────────────
  {
    id: 'teach-audio-01',
    type: 'audio',
    title: {
      fr: 'Audience avec Dieu par la prière — Volume 1',
      en: 'Audience with God Through Prayer — Volume 1',
    },
    body: {
      fr: 'Votre livre de prière pour changer les choses. Un enseignement audio sur la puissance de la prière et comment entrer en audience avec Dieu.',
      en: 'Your prayer book to change things. An audio teaching on the power of prayer and how to enter into audience with God.',
    },
    audioUrl: null, // Firebase Storage URL — to be uploaded
    audioDuration: '45:30',
    coverImageUrl: '/gallery/photos/IMG-20240709-WA0005.jpg',
    tags: ['prière', 'puissance', 'intercession'],
    publishedAt: '2025-04-01',
    featured: false,
  },
  {
    id: 'teach-audio-02',
    type: 'audio',
    title: {
      fr: 'Les promesses de Dieu ne peuvent échouer',
      en: 'God\'s Promises Cannot Fail',
    },
    body: {
      fr: 'Un enseignement sur la fidélité de Dieu et ses promesses immuables. Quand le divin est impliqué, l\'échec est impossible.',
      en: 'A teaching on God\'s faithfulness and His unchangeable promises. When the divine is involved, failure is impossible.',
    },
    audioUrl: null, // Firebase Storage URL — to be uploaded
    audioDuration: '38:15',
    coverImageUrl: null,
    tags: ['foi', 'promesses', 'fidélité'],
    publishedAt: '2025-03-20',
    featured: false,
  },
  {
    id: 'teach-audio-03',
    type: 'audio',
    title: {
      fr: 'Marcher dans la sanctification',
      en: 'Walking in Sanctification',
    },
    body: {
      fr: 'Se préparer, rejeter tout fardeau, se sanctifier. Comment l\'Épouse de Christ se prépare pour le retour du Seigneur.',
      en: 'Preparing yourself, casting off every burden, being sanctified. How the Bride of Christ prepares for the Lord\'s return.',
    },
    audioUrl: null, // Firebase Storage URL — to be uploaded
    audioDuration: '52:10',
    coverImageUrl: null,
    tags: ['sanctification', 'préparation', 'retour du Seigneur'],
    publishedAt: '2025-02-05',
    featured: false,
  },
]

export const getTextTeachings = (count?: number) => {
  const texts = teachings.filter(t => t.type === 'text')
  return count ? texts.slice(0, count) : texts
}

export const getAudioTeachings = (count?: number) => {
  const audios = teachings.filter(t => t.type === 'audio')
  return count ? audios.slice(0, count) : audios
}

export const getFeaturedTeaching = () => teachings.find(t => t.featured) ?? teachings[0]
export const getRecentTeachings = (count: number = 6) => teachings.slice(0, count)
