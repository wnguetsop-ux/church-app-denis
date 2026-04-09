# SKILL — church-product-architect

## name
church-product-architect

## description
Architecte produit de l'application d'église. Définit la structure, les priorités de features, les schémas de données et les flux utilisateurs avant que le moindre code soit écrit.

## mission
Structurer le produit de façon rigoureuse pour éviter le gaspillage de temps, les refactorisations coûteuses et les features mal conçues. Chaque décision produit doit être confirmée avant d'être implémentée.

---

## règles

### R1 — Aucun code sans scope validé
Avant de coder une feature, définir : qui l'utilise, pourquoi, ce que c'est au minimum viable, ce que ce n'est pas.

### R2 — Schéma Firestore avant composant
Aucun composant n'est créé avant que le schéma de la collection Firestore correspondante soit finalisé et documenté dans `app-reference-notes.md`.

### R3 — Priorités P0 → P3
Classer chaque feature avant de commencer :
- **P0** : bloquant au lancement (home, messages, annonces, à propos, contact)
- **P1** : important pour le lancement (enseignements, événements, galerie, dons)
- **P2** : amélioration post-lancement (prière, notifications push)
- **P3** : vision future (Play Store, Apple Store)

Ne jamais travailler sur P2 avant que P0 soit terminé.

### R4 — Denis publie lui-même
Chaque feature qui crée du contenu doit avoir une interface admin. Pas de feature sans son formulaire d'édition côté admin.

### R5 — PWA d'abord
Toutes les décisions d'architecture doivent être compatibles avec une PWA installable. Aucune dépendance qui empêcherait l'installation offline ou le manifest.

### R6 — YouTube pour les vidéos, jamais Firebase
Aucune collection Firestore ne stocke un fichier vidéo. On stocke uniquement des IDs YouTube (11 caractères). Cette règle est non négociable.

### R7 — Pas d'API de paiement
Les dons passent par Orange Money, MTN Money, PayPal et virement bancaire. Afficher des instructions et des liens. Aucune intégration d'API de paiement (Stripe interdit).

### R8 — Checklist obligatoire avant tout code
- [ ] Feature confirmée par Denis
- [ ] Schéma Firestore rédigé
- [ ] Impact coût Firestore estimé
- [ ] Besoins bilingues FR + EN identifiés
- [ ] Interface admin prévue
- [ ] Animations et transitions prévues
- [ ] Cas mobile validé (375px)

---

## schémas Firestore de référence

### `sermons`
```typescript
interface Sermon {
  id: string
  youtubeVideoId: string                    // ID 11 chars, jamais l'URL complète
  title: { fr: string; en: string }
  description: { fr: string; en: string }
  speaker: string
  series: { fr: string; en: string } | null
  tags: string[]
  publishedAt: Timestamp
  featured: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  updatedBy: string
}
```

### `teachings`
```typescript
interface Teaching {
  id: string
  type: 'text' | 'audio' | 'pdf'
  title: { fr: string; en: string }
  body: { fr: string; en: string } | null
  audioUrl: string | null                   // Firebase Storage
  pdfUrl: string | null                     // Firebase Storage
  coverImageUrl: string | null
  tags: string[]
  publishedAt: Timestamp
  featured: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  updatedBy: string
}
```

### `announcements`
```typescript
interface Announcement {
  id: string
  title: { fr: string; en: string }
  body: { fr: string; en: string }
  imageUrl: string | null
  priority: 'normal' | 'urgent'
  publishedAt: Timestamp
  expiresAt: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
  updatedBy: string
}
```

### `events`
```typescript
interface ChurchEvent {
  id: string
  title: { fr: string; en: string }
  description: { fr: string; en: string }
  location: { fr: string; en: string }
  startAt: Timestamp
  endAt: Timestamp | null
  imageUrl: string | null
  registrationRequired: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  updatedBy: string
}
```

### `gallery`
```typescript
interface GalleryImage {
  id: string
  url: string                               // Firebase Storage — original
  thumbnailUrl: string                      // Firebase Storage — 400px
  caption: { fr: string; en: string } | null
  album: string | null
  order: number
  createdAt: Timestamp
  uploadedBy: string
}
```

### `prayers`
```typescript
interface PrayerRequest {
  id: string
  name: string | null                       // anonyme si null
  request: string
  isPublic: boolean
  prayedForCount: number
  createdAt: Timestamp
}
```

### `donationMethods`
```typescript
interface DonationMethod {
  id: string
  method: 'orange_money' | 'mtn_money' | 'paypal' | 'bank_transfer'
  label: { fr: string; en: string }
  instructions: { fr: string; en: string }
  contact: string                           // numéro, lien, IBAN
  isActive: boolean
  order: number
}
```

---

## routes de l'application

```
/[locale]/                      → Accueil
/[locale]/messages              → Liste des sermons
/[locale]/messages/[id]         → Sermon individuel
/[locale]/enseignements         → Enseignements
/[locale]/annonces              → Annonces
/[locale]/evenements            → Événements
/[locale]/galerie               → Galerie photos
/[locale]/priere                → Prière
/[locale]/dons                  → Dons
/[locale]/a-propos              → À propos
/[locale]/contact               → Contact
/admin                          → Dashboard admin
/admin/[section]/...            → Gestion de contenu
```

---

## points à surveiller

- **Scope creep** : Denis peut demander des features non planifiées en cours de route. Toujours évaluer la priorité avant de commencer.
- **Schémas trop complexes** : Commencer simple. Ne pas anticiper des champs qui ne seront peut-être jamais utilisés.
- **Manque d'interface admin** : Si une feature est codée sans son admin, Denis ne peut pas publier. Toujours les coupler.
- **Dépendances circulaires** : Le schéma Firestore ne doit pas dépendre de l'UI et vice versa.
- **PWA incompatibilité** : Vérifier que chaque nouvelle dépendance est compatible avec l'environnement service worker.
- **Vidéos sur Firebase** : Risque critique de coût. Bloquer tout upload vidéo dans Storage.
