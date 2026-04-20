import { Timestamp } from 'firebase/firestore'

export type Locale = 'fr' | 'en'
export type BilingualText = { fr: string; en: string }

export interface Sermon {
  id: string
  youtubeVideoId: string
  title: BilingualText
  description: BilingualText
  speaker: string
  series: BilingualText | null
  tags: string[]
  publishedAt: Timestamp
  featured: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  updatedBy: string
}

export interface Teaching {
  id: string
  type: 'text' | 'audio'
  title: BilingualText
  body: BilingualText | null
  audioUrl: string | null
  audioDuration: string | null
  coverImageUrl: string | null
  tags: string[]
  publishedAt: Timestamp
  featured: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  updatedBy: string
}

export interface Announcement {
  id: string
  title: BilingualText
  body: BilingualText
  imageUrl: string | null
  priority: 'normal' | 'urgent'
  publishedAt: Timestamp
  expiresAt: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
  updatedBy: string
}

export interface ChurchEvent {
  id: string
  title: BilingualText
  description: BilingualText
  location: BilingualText
  startAt: Timestamp
  endAt: Timestamp | null
  imageUrl: string | null
  registrationRequired: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  updatedBy: string
}

export interface GalleryItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnailUrl: string
  caption: BilingualText | null
  album: string | null
  order: number
  duration: string | null   // pour les vidéos courtes
  createdAt: Timestamp
  uploadedBy: string
}

export interface PrayerRequest {
  id: string
  name: string | null
  subject: string | null
  request: string
  contact: string | null
  isPublic: boolean
  language: 'fr' | 'en'
  status: 'pending' | 'reviewed' | 'prayed'
  prayedForCount: number
  pastoralResponse?: string | null
  respondedAt?: Timestamp | null
  respondedBy?: string | null
  createdAt: Timestamp
}

export interface DonationMethod {
  id: string
  method: 'orange_money' | 'mtn_money' | 'paypal' | 'bank_transfer'
  label: BilingualText
  instructions: BilingualText
  contact: string
  isActive: boolean
  order: number
}

export interface ChurchInfo {
  id: string
  name: BilingualText
  tagline: BilingualText
  description: BilingualText
  address: string
  phone: string
  email: string
  schedules: BilingualText
  facebook: string
  youtube: string
  tiktok: string
  updatedAt: Timestamp
}

export interface AdminUser {
  uid: string
  email: string
  displayName: string
  role: 'superadmin' | 'editor' | 'viewer'
  createdAt: Timestamp
}

export type NotificationCategory =
  | 'messages'
  | 'enseignements'
  | 'audios'
  | 'annonces'
  | 'dons'
  | 'priere'
  | 'general'

export interface AppNotification {
  id: string
  category: NotificationCategory
  title: BilingualText
  body: BilingualText
  targetPath: string | null
  entityId: string | null
  isManual: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
