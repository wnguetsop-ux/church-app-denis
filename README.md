# Church App Denis

Application web **PWA** + site web pour une église chrétienne francophone/anglophone.
Inspiration : Kanguka — même esprit spirituel, rendu moderne, vivant, fluide, beau sur mobile.

Stack : **Next.js · Firebase · PWA · YouTube · Framer Motion · Tailwind · Vercel**
Dons : Orange Money · MTN Money · PayPal · Virement bancaire

---

## Sections de l'application

Messages · Enseignements · Annonces · Audios · Vidéos · Textes ·
Galerie · Événements · Prière · Notifications · Dons · À propos · Contact

---

## Structure des fichiers Claude

```
church-app-denis/
├── CLAUDE.md                              ← Règles maîtres du projet
├── README.md                              ← Ce fichier
└── .claude/
    ├── settings.json                      ← Permissions, hooks, variables d'env, règles absolues
    ├── skills/
    │   ├── church-product-architect/      ← Architecture, scoping, schémas Firestore
    │   ├── church-ui-designer/            ← UI/UX, composants, animations, accessibilité
    │   ├── church-content-structure/      ← Structure de pages, copie FR+EN, CTA
    │   ├── church-admin-designer/         ← Dashboard admin, rôles, formulaires bilingues
    │   ├── youtube-video-strategy/        ← Intégration YouTube, façade, schéma vidéo
    │   ├── firebase-cost-guard/           ← Coûts Firestore, règles, cache, quotas
    │   ├── church-bilingual-fr-en/        ← next-intl, FR/EN, switcher, schéma bilingue
    │   ├── nano-banana-visual-director/   ← Palette, typo, espacement, animations
    │   └── safe-dev-workflow/             ← Git, secrets, PWA, déploiement
    └── references/
        ├── client-notes.md                ← Notes de Denis : vision, sections, dons, questions ouvertes
        ├── app-reference-notes.md         ← Architecture, statut features, décisions techniques
        └── content-samples.md            ← Vrai contenu FR+EN pour toutes les sections
```

---

## Rôle de chaque fichier

| Fichier | Contenu |
|---|---|
| `CLAUDE.md` | Règles absolues (vidéos = YouTube only, pas de Stripe, bilingue obligatoire, PWA first), stack, sections, code style |
| `settings.json` | Commandes bash autorisées/bloquées, hooks de garde-fous, variables d'env, règles en commentaires |
| `church-product-architect` | Priorités des sections (P0→P3), tous les schémas Firestore, routes de l'app, checklist avant code |
| `church-ui-designer` | Principes (vivant, chaud, mobile-first), catalogue d'animations Framer Motion, composants, accessibilité |
| `church-content-structure` | Templates de contenu page par page (toutes les 13 sections), règles de ton FR/EN |
| `church-admin-designer` | Rôles (superadmin/editor/viewer), toutes les routes admin, workflow upload galerie, sécurité |
| `youtube-video-strategy` | Règle absolue YouTube, extraction ID, thumbnails sans API, façade de performance, domaine nocookie |
| `firebase-cost-guard` | Limites plan gratuit, estimation des lectures par section (~10% du quota), règles Firestore complètes, patterns interdits |
| `church-bilingual-fr-en` | Setup next-intl, structure fr.json/en.json, schéma BilingualText Firestore, checklist déploiement bilingue |
| `nano-banana-visual-director` | Palette couleurs, typo (Lora+Inter), variantes Framer Motion réutilisables, guidelines images, assets en attente |
| `safe-dev-workflow` | Branches, commits, variables d'env requises, config PWA/manifest, checklist pré-déploiement, TWA future |
| `client-notes.md` | Ce que Denis a confirmé, sections validées, méthodes de don, contenu à recevoir, questions ouvertes |
| `app-reference-notes.md` | Arborescence complète du projet, toutes les décisions techniques, statut des features, cibles de performance |
| `content-samples.md` | Vrai contenu FR+EN pour chaque section — hero, sermons, annonces, galerie, prière, dons, navigation |

---

## Règles absolues (résumé)

- Vidéos → **YouTube uniquement**, jamais Firebase Storage
- Paiements → **liens manuels** (Orange Money, MTN, PayPal, virement), jamais Stripe
- Textes UI → **toujours bilingues** (FR + EN)
- Distribution → **PWA d'abord**, Play Store/Apple plus tard
- Déploiement → **jamais sans confirmation explicite**

---

## Prochaine étape

Remplir `client-notes.md` avec les informations restantes de Denis
(nom de l'église, numéros de dons, URL YouTube, photos, branding).
Ensuite : initialiser le projet Next.js.
