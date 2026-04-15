/**
 * Static donation methods — mirrors the DonationMethod Firestore schema.
 * When Firebase admin is wired up, this is replaced by Firestore queries.
 */

export type PaymentMethod = 'orange_money' | 'mtn_money' | 'paypal' | 'bank_transfer'

export interface StaticDonationMethod {
  id: string
  method: PaymentMethod
  iconKey: string
  label: { fr: string; en: string }
  contact: string
  holder: string
  instructions: { fr: string; en: string }
  copyValue: string
  isActive: boolean
  order: number
}

export const donationMethods: StaticDonationMethod[] = [
  {
    id: 'orange',
    method: 'orange_money',
    iconKey: 'orange',
    label: { fr: 'Orange Money', en: 'Orange Money' },
    contact: '656 075 637',
    holder: 'Denis Descartes Tadum',
    instructions: {
      fr: 'Envoyez votre don au 656 075 637 (Denis Descartes Tadum) avec la mention "Don CIFM4".',
      en: 'Send your gift to 656 075 637 (Denis Descartes Tadum) with the note "CIFM4 Donation".',
    },
    copyValue: '656075637',
    isActive: true,
    order: 1,
  },
  {
    id: 'mtn',
    method: 'mtn_money',
    iconKey: 'mtn',
    label: { fr: 'MTN Money', en: 'MTN Money' },
    contact: '681 441 569',
    holder: 'Denis Descartes Tadum',
    instructions: {
      fr: 'Envoyez votre don au 681 441 569 (Denis Descartes Tadum) avec la mention "Don CIFM4".',
      en: 'Send your gift to 681 441 569 (Denis Descartes Tadum) with the note "CIFM4 Donation".',
    },
    copyValue: '681441569',
    isActive: true,
    order: 2,
  },
  {
    id: 'paypal',
    method: 'paypal',
    iconKey: 'paypal',
    label: { fr: 'PayPal', en: 'PayPal' },
    contact: 'tadumdenis@gmail.com',
    holder: 'Denis Descartes Tadum',
    instructions: {
      fr: 'Envoyez votre don via PayPal à tadumdenis@gmail.com avec la mention "Don CIFM4".',
      en: 'Send your gift via PayPal to tadumdenis@gmail.com with the note "CIFM4 Donation".',
    },
    copyValue: 'tadumdenis@gmail.com',
    isActive: true,
    order: 3,
  },
  {
    id: 'bank',
    method: 'bank_transfer',
    iconKey: 'bank',
    label: { fr: 'Virement bancaire', en: 'Bank Transfer' },
    contact: '',
    holder: '',
    instructions: {
      fr: 'Les coordonnées bancaires seront bientôt disponibles. En attendant, contactez-nous pour effectuer un virement.',
      en: 'Bank details will be available soon. In the meantime, contact us to make a transfer.',
    },
    copyValue: '',
    isActive: true,
    order: 4,
  },
]
