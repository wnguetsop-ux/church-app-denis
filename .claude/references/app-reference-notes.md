# app-reference-notes.md — Analyse de la référence et direction du projet

> Ce fichier documente l'analyse de l'app de référence (Kanguka),
> les décisions techniques du projet, et le statut des features.
> À mettre à jour au fil du développement.

---

## L'app de référence : Kanguka

Denis a présenté l'application Kanguka comme modèle de départ.
Ce n'est pas un modèle à copier — c'est un point de départ à dépasser.

---

## Ce qui plaît dans Kanguka

Ces éléments doivent être **conservés et portés dans le nouveau projet** :

### La philosophie
- **Centré sur la foi** — tout dans l'app tourne autour de la vie spirituelle de la communauté
- **Pas de superflu** — pas de réseau social, pas de fonctions gadgets, l'essentiel
- **Accessible à tous** — compréhensible par n'importe quel membre de la congrégation, quel que soit son niveau technique
- **Logique simple** — chaque section a un seul rôle, clairement identifié

### La structure
- Navigation par sections thématiques (messages, prières, événements)
- Contenu organisé chronologiquement (les plus récents en premier)
- Séparation claire entre le contenu de la direction (sermons, annonces) et la participation des membres (prières)
- Accès rapide au contenu principal depuis la page d'accueil

### L'esprit
- L'app donne l'impression d'appartenir à une communauté réelle, pas à une marque
- Le ton est chaleureux et inclusif
- La prière est traitée avec sérieux, pas comme une fonctionnalité parmi d'autres

---

## Ce qui est trop ancien / trop statique dans Kanguka

Ces défauts doivent être **corrigés intégralement** dans le nouveau projet.

### Problèmes visuels

| Défaut | Impact | Priorité de correction |
|---|---|---|
| Interface plate, sans relief ni profondeur | Donne une impression de vieilli et d'abandon | Haute |
| Typographie basique, non soignée | Nuit à la lisibilité et au sentiment de qualité | Haute |
| Couleurs ternes ou génériques | Aucune identité visuelle, pas mémorable | Haute |
| Images mal cadrées, sans mise en scène | Le contenu visuel n'est pas mis en valeur | Haute |
| Pas de hiérarchie visuelle claire | L'œil ne sait pas où aller en premier | Moyenne |
| Espacement insuffisant | Le contenu est à l'étroit, peu lisible | Moyenne |

### Problèmes d'interaction

| Défaut | Impact | Correction |
|---|---|---|
| Aucune animation | L'app semble figée, sans vie | Framer Motion — entrées, transitions, hover |
| Aucune transition entre les pages | Navigation brutale, saut d'écran | Transitions fade entre les routes |
| Aucun hover state sur les cartes | Pas de feedback visuel, pas de profondeur | Scale léger + shadow au hover |
| Aucun feedback sur les boutons | Incertitude sur si l'action a été prise | Active state (scale down) sur tous les boutons |
| Chargements sans feedback | Écran blanc ou spinner seul | Skeleton loaders sur tous les contenus |

### Problèmes mobile

| Défaut | Impact | Correction |
|---|---|---|
| Navigation inadaptée au mobile | Difficile à utiliser avec le pouce | Bottom navigation fixe, 5 tabs |
| Touch targets trop petits | Erreurs de tap fréquentes | Minimum 44×44px sur tout élément interactif |
| Pas de safe area iOS | Contenu masqué par la barre d'accueil iPhone | `env(safe-area-inset-bottom)` sur la nav |
| Scroll pas fluide | Expérience saccadée | CSS `scroll-behavior: smooth` + Framer Motion |
| Galerie sans lightbox | Impossible de voir les images en grand | Lightbox avec swipe et zoom |

### Problèmes de contenu

| Défaut | Impact | Correction |
|---|---|---|
| Pas de mise en valeur du dernier sermon | L'élément le plus important noyé dans la liste | Sermon vedette en grand format sur l'accueil |
| Listes sans tri ni filtre | Difficile de retrouver un contenu spécifique | Filtres par série, speaker, date |
| Pas de skeleton pendant le chargement | Impression de lenteur | Skeleton animé sur toutes les listes |

---

## Ce qu'il faut garder — synthèse

```
✓ La philosophie centrée sur la foi
✓ La navigation par sections thématiques
✓ La simplicité : une section = un rôle
✓ Le ton chaleureux et inclusif
✓ La section prière traitée avec sérieux
✓ L'accessibilité au grand public
✓ Le contenu récent en premier
```

---

## Ce qu'il faut améliorer — synthèse

```
✗ → ✓  Statique           → Vivant (animations, micro-interactions)
✗ → ✓  Vieilli            → Moderne (typographie, couleurs, spacing)
✗ → ✓  Pas fluide         → Fluide (transitions de page, scroll doux)
✗ → ✓  Mauvais sur mobile → Beau sur mobile (bottom nav, touch, safe area)
✗ → ✓  Images mal mises en valeur → Thumbnails, lightbox, ratios définis
✗ → ✓  Aucun feedback     → Hover states, press states, skeletons, toasts
```

---

## Architecture technique du projet

### Stack décidée

| Couche | Technologie | Raison |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR/SSG, Vercel natif, modern |
| PWA | next-pwa | Intégration Next.js, service worker auto |
| i18n | next-intl | Meilleur support App Router |
| Base de données | Firebase Firestore | Temps réel, serverless, Auth intégré |
| Auth | Firebase Auth | Email/password pour l'admin |
| Storage | Firebase Storage | Images + audios uniquement |
| Vidéos | YouTube uniquement | Gratuit, scalable, aucune bande passante |
| Notifications | Firebase Cloud Messaging | Gratuit, cross-platform |
| Dons | Liens manuels (Orange Money, MTN, PayPal, virement) | Pas d'API de paiement |
| Styling | Tailwind CSS | Utility-first, itération rapide |
| Animations | Framer Motion | Le plus puissant pour React |
| Icônes | lucide-react | Cohérent, léger |
| Hosting | Vercel | Zero-config pour Next.js |
| Compression images | browser-image-compression | Client-side, avant upload Firebase |

### Arborescence du projet (cible)

```
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                  Accueil
│   │   ├── messages/
│   │   │   ├── page.tsx              Liste sermons
│   │   │   └── [id]/page.tsx         Sermon individuel
│   │   ├── enseignements/page.tsx
│   │   ├── annonces/page.tsx
│   │   ├── evenements/page.tsx
│   │   ├── galerie/page.tsx
│   │   ├── priere/page.tsx
│   │   ├── dons/page.tsx
│   │   ├── a-propos/page.tsx
│   │   └── contact/page.tsx
│   ├── admin/
│   │   ├── page.tsx                  Dashboard
│   │   ├── messages/
│   │   ├── enseignements/
│   │   ├── annonces/
│   │   ├── evenements/
│   │   ├── galerie/
│   │   ├── prieres/
│   │   ├── dons/
│   │   ├── notifications/
│   │   ├── pages/
│   │   ├── equipe/
│   │   └── utilisateurs/
│   └── api/
│       └── fcm/route.ts              Envoi notifications push
├── components/
│   ├── ui/                           Button, Card, Input, Badge, Toast...
│   ├── sermons/                      SermonCard, YoutubeFacade, SermonList
│   ├── gallery/                      GalleryGrid, Lightbox
│   ├── layout/                       Header, Footer, BottomNav
│   ├── admin/                        Composants admin
│   └── shared/                       SkeletonCard, BilingualField...
├── lib/
│   ├── firebase/
│   │   ├── client.ts
│   │   ├── admin.ts
│   │   ├── sermons.ts
│   │   ├── teachings.ts
│   │   ├── announcements.ts
│   │   ├── events.ts
│   │   ├── gallery.ts
│   │   ├── prayers.ts
│   │   └── notifications.ts
│   ├── youtube.ts
│   ├── animations.ts
│   ├── utils.ts
│   └── image-compression.ts
├── messages/
│   ├── fr.json
│   └── en.json
└── types/
    ├── sermon.ts
    ├── teaching.ts
    ├── announcement.ts
    ├── event.ts
    ├── gallery.ts
    ├── prayer.ts
    └── user.ts
```

---

## Statut des features

| Feature | Priorité | Statut |
|---|---|---|
| Setup Next.js + next-pwa + next-intl | P0 | Non démarré |
| Firebase client + admin SDK | P0 | Non démarré |
| Auth admin + middleware | P0 | Non démarré |
| PWA manifest + icônes | P0 | Non démarré |
| Page Accueil | P0 | Non démarré |
| Section Messages (liste + page) | P0 | Non démarré |
| Composant YoutubeFacade | P0 | Non démarré |
| Section Annonces | P0 | Non démarré |
| Section À propos | P0 | Non démarré |
| Section Contact | P0 | Non démarré |
| Section Enseignements | P1 | Non démarré |
| Section Événements | P1 | Non démarré |
| Section Galerie + Lightbox | P1 | Non démarré |
| Section Dons | P1 | Non démarré |
| Admin dashboard | P1 | Non démarré |
| Admin — upload galerie | P1 | Non démarré |
| Section Prière + mur | P2 | Non démarré |
| Notifications push (FCM) | P2 | Non démarré |
| Animations Framer Motion | P1 | Non démarré |
| Bottom navigation mobile | P0 | Non démarré |
| i18n FR + EN complet | P0 | Non démarré |
| Lecteur audio intégré | P1 | Non démarré |

---

## Infos Firebase (à compléter)

| Champ | Valeur |
|---|---|
| ID du projet | À confirmer avec Denis |
| Région Firestore | À confirmer — suggérer `europe-west3` (Frankfurt) selon localisation |
| Bucket Storage | À confirmer |
| VAPID Key (FCM) | À générer dans Firebase Console |

---

## Cibles de performance

| Métrique | Cible | Outil de mesure |
|---|---|---|
| Lighthouse Performance (mobile) | ≥ 85 | Lighthouse CLI |
| Lighthouse Accessibilité | ≥ 95 | Lighthouse CLI |
| Lighthouse PWA | 100 | Lighthouse CLI |
| First Contentful Paint | < 2s | Lighthouse / WebVitals |
| Time to Interactive | < 4s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse / WebVitals |

---

## Problèmes connus / décisions en suspens

| Sujet | Statut |
|---|---|
| Branding Denis non reçu | En attente — palette banana est un placeholder |
| Ton FR (vous / tu) non confirmé | En attente — ne pas rédiger le contenu final avant |
| Modération des prières | À confirmer — visible immédiatement ou après validation ? |
| Région Firebase | À confirmer selon le pays de Denis |

---

## Historique de déploiement

| Date | Environnement | Notes |
|---|---|---|
| — | — | Projet non démarré |
