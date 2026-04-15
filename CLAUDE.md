# CLAUDE.md — Church App Denis / CIFM4

## Identité du projet

**Communauté Internationale des Fils de Malachie 4**
Abréviation : **CIFM4** / C.I.F.M.4

Application web **PWA** (Progressive Web App) + site web pour cette communauté chrétienne francophone/anglophone.
Inspiration : **Kanguka** — même esprit spirituel, rendu moderne, vivant, fluide et beau sur mobile.
Couleurs officielles : **bleu + blanc**.
Domaine prévu : **communautedesfilsdemalachie4.com**

Stack : **Next.js + Firebase + PWA + YouTube (vidéos longues) + Firebase Storage (médias courts)**.
Dons : **Orange Money · MTN Money · PayPal · virement bancaire** (pas de Stripe).

---

## Mission de la CIFM4

Organisation chrétienne à but non lucratif, avec comme objectifs :
- Promouvoir la parole de Dieu (Sainte Bible), de façon directe mais surtout par les moyens de diffusion en ligne (Internet)
- Promouvoir le message de Malachie 4:5-6
- Promouvoir le style de vie communautaire des chrétiens de Actes 2
- Apporter une aide à des laissés pour compte, sans distinction aucune, et leur proposer des actions de réinsertion
- Accueillir la personne en difficulté par une aide sur le plan matériel, moral et spirituel
- Mettre à disposition le message biblique (Bible et diverses publications chrétiennes)

> Ces objectifs doivent transparaître dans le contenu, le ton et la navigation de l'application.

---

## Règles absolues

### Workflow
- **Ne jamais coder l'app** sans une tâche confirmée par l'utilisateur.
- **Ne jamais pousser sur git** sans instruction explicite de l'utilisateur.
- **Ne jamais supprimer de fichiers** sans confirmation explicite.
- **Ne jamais exposer de secrets** — aucune clé API, aucune credential Firebase dans le code ou les commits.

### Contenu et données
- **Ne jamais sauter la gestion bilingue** — chaque chaîne visible par l'utilisateur doit exister en FR et EN.
- **Ne jamais utiliser Lorem Ipsum** — tester avec le vrai contenu de `content-samples.md`.
- **Ne jamais ajouter Stripe** — les dons passent par Orange Money, MTN Money, PayPal, virement.
- **Ne jamais transformer la plateforme en hébergement massif de vidéos** — voir stratégie médias ci-dessous.

### Design et expérience utilisateur
- **L'app ne doit jamais ressembler à Kanguka** sur la forme — même âme, exécution radicalement plus moderne.
- **Ne jamais livrer un composant sans animation prévue** — chaque carte, chaque entrée de page, chaque liste doit avoir sa variante Framer Motion. Si aucune animation n'est prévue, justifier avec `// no-animation: [raison]`.
- **Ne jamais créer d'écran blanc** — tout état de chargement a un skeleton animé. Jamais de spinner seul.
- **Ne jamais concevoir desktop-first** — mobile 375px est la référence. Le desktop est l'adaptation.
- **Mettre en valeur les visuels** — logo, galerie, photos d'événements et images doivent être traités avec soin : ratios définis, lightbox, lazy loading, mise en scène.

### Direction visuelle — headers et heroes (règle permanente)

> Inspiration visuelle complémentaire : **iyenis.com** — rendu vivant, fluide, premium.
> L'objectif est un résultat visuellement fort, vivant et professionnel.

**Règles obligatoires pour les headers / heroes :**
- **Chaque page principale doit avoir un header / hero visuellement fort** — jamais de header plat avec juste un fond bleu uni.
- **Les images des headers doivent être retravaillées via Gemini / Nano Banana** avant intégration — jamais de photo brute WhatsApp en header.
- **Les images doivent être vraiment visibles** — pas noyées dans un fond sombre. Image pleine opacité + gradient ciblé en bas pour la lisibilité du texte.
- **Certains visuels clés doivent intégrer l'emblème / logo CIFM4** — pas partout, mais intelligemment sur les heroes principaux (accueil, à propos, messages).
- **Lisibilité garantie** via : overlay intelligent, dégradé local derrière le texte, `drop-shadow` sur les titres, ou split layout texte + image.

**Effets visuels requis :**
- **Hero slider / carousel** sur la page d'accueil (plusieurs visuels en rotation)
- **Ken Burns léger** (scale + pan lent) sur les images de hero pour donner de la vie
- **Zoom on hover / scale on hover** sur les cartes et images importantes
- **Parallax léger** si pertinent sur les sections à fond image
- **Transitions douces** entre les slides et les pages
- **Micro-interactions légères** : hover, press, feedback visuel

**Animations : élégantes et légères, jamais lourdes ni gadget.**

**Images des headers stockées dans `public/images/headers/`** — séparées des originaux galerie.

**Pages concernées au minimum :**
Accueil · Messages · Enseignements · Vidéos · Galerie · Dons · Prière · À propos · Contact · Événements

---

## Stratégie médias — règle critique

```
PHOTOS                    → Firebase Storage          ✓ Toujours OK
IMAGES GALERIE (~50)      → Firebase Storage          ✓ Toujours OK
AUDIOS (sermons, louanges)→ Firebase Storage          ✓ OK (max 50 MB/fichier)
VIDÉOS COURTES DE GALERIE → Firebase Storage          ✓ OK, limité et raisonnable
  (clips événements, 
   quelques minutes max)

VIDÉOS LONGUES            → YouTube OBLIGATOIRE       ✗ Jamais sur Firebase
  (messages, sermons,
   enseignements, prédications)
```

**Seuil à respecter pour les vidéos courtes sur Storage :**
- Durée max par vidéo : ~3 minutes
- Poids max par vidéo : ~50 MB
- Nombre max en v1 : ~10 vidéos courtes
- Au-delà de ces limites → passer sur YouTube

**Pourquoi cette distinction :**
- YouTube = bande passante gratuite, illimitée, qualité HD
- Firebase Storage = 1 Go gratuit total, ~$0.026/Go supplémentaire
- Les vidéos longues sur Storage videraient le quota en quelques téléchargements

> Voir `.claude/skills/firebase-cost-guard/SKILL.md` pour l'estimation des coûts.

---

## Assets locaux disponibles

Ces dossiers existent déjà sur la machine du développeur :

```
immage evenement denis/          ← Photos et événements de la communauté
  logo et insigne eglise/        ← Logo et insigne officiel de la CIFM4
```

**Ce que contiennent ces dossiers :**
- ~50 photos de la communauté (galerie)
- Photos d'événements
- Quelques courtes vidéos de galerie/événements
- Logo et insigne de l'église

**À faire avant de coder l'interface galerie :**
- Parcourir `immage evenement denis/` pour inventorier les assets disponibles
- Identifier les vidéos courtes (< 3 min) utilisables sur Storage
- Extraire le logo depuis `logo et insigne eglise/` pour le préparer au format SVG/PNG optimisé

---

## Sections de l'application

| Section | Description |
|---|---|
| **Messages** | Sermons et prédications (YouTube embed + fiche) |
| **Enseignements** | Contenu pédagogique : textes, audios |
| **Annonces** | Actualités de la communauté, nouvelles importantes |
| **Audios** | Prédications audio, louanges, podcasts (Firebase Storage) |
| **Vidéos** | Sermons longs → YouTube · Clips courts → Firebase Storage |
| **Textes** | Articles, études bibliques, publications chrétiennes |
| **Galerie** | ~50 photos + quelques clips courts (Firebase Storage) |
| **Événements** | Agenda, description, lieu, date |
| **Prière** | Formulaire de demande de prière, liste de prières partagées |
| **Notifications** | Push notifications via Firebase Cloud Messaging |
| **Dons** | Orange Money · MTN Money · PayPal · virement bancaire |
| **À propos** | Mission Malachie 4:5-6, Actes 2, histoire, équipe, croyances |
| **Contact** | Formulaire, numéro, email, carte |

---

## Coordonnées et réseaux — confirmés

| Champ | Info |
|---|---|
| Orange Money | 656075637 — Denis Descartes Tadum |
| MTN Money | 681441569 — Denis Descartes Tadum |
| PayPal | tadumdenis@gmail.com |
| Virement | À recevoir |
| Facebook | https://www.facebook.com/communautedesfilsdemalachie4 |
| YouTube | https://www.youtube.com/@communauteinternationalede1948 |
| TikTok | https://www.tiktok.com/@communaut.fils.de |
| Domaine | communautedesfilsdemalachie4.com (prévu) |

---

## Skills disponibles

| Skill | Quand l'utiliser |
|---|---|
| `church-product-architect` | Décisions d'architecture, scoping, modèle de données |
| `church-ui-designer` | UI/UX, composants, layout, animations |
| `church-content-structure` | Structure des pages, hiérarchie du contenu, copie |
| `church-admin-designer` | Dashboard admin, CMS pour Denis |
| `youtube-video-strategy` | Intégration YouTube, sermons longs |
| `firebase-cost-guard` | Requêtes Firestore, Storage, coûts |
| `church-bilingual-fr-en` | i18n, traductions, commutation de locale |
| `nano-banana-visual-director` | Identité visuelle CIFM4, couleurs bleu/blanc, animations |
| `safe-dev-workflow` | Git, secrets, PWA, déploiement |

---

## Stack technique

- **Framework** : Next.js 14+ (App Router)
- **PWA** : `next-pwa` — installable sur mobile en priorité
- **Base de données** : Firebase Firestore
- **Auth** : Firebase Auth
- **Storage** : Firebase Storage (images, audios, vidéos courtes galerie)
- **Vidéos longues** : YouTube uniquement (embed `youtube-nocookie.com`)
- **Push notifications** : Firebase Cloud Messaging (FCM)
- **Dons** : Orange Money, MTN Money, PayPal, virement (liens + instructions)
- **Hosting** : Vercel
- **Styling** : Tailwind CSS + Framer Motion (animations)
- **i18n** : next-intl (FR par défaut, EN secondaire)
- **Future** : Play Store (TWA) + Apple App Store (après PWA validée)

---

## Contraintes critiques

### Vidéos longues
- **YouTube obligatoire** pour : sermons, messages, prédications, enseignements vidéo
- Stocker uniquement l'ID YouTube (11 caractères) en Firestore
- Embed via `youtube-nocookie.com` pour la RGPD

### Vidéos courtes (galerie/événements)
- Firebase Storage autorisé si : < 3 min, < 50 MB, usage galerie uniquement
- Limiter à ~10 vidéos courtes en v1
- Surveiller le quota Storage (1 Go gratuit total)

### Dons
- **Pas de passerelle de paiement intégrée**
- Afficher les coordonnées directes (Orange/MTN + PayPal + virement)
- Denis confirme les dons manuellement

### PWA
- Installable dès le départ
- `manifest.json` complet, service worker, offline partiel
- Couleur de thème : bleu CIFM4
- Play Store (TWA) et App Store prévus pour plus tard

### Galerie
- ~50 photos + quelques clips courts
- Assets disponibles localement dans `immage evenement denis/`
- Compression automatique à l'upload (images : max 1.5 MB)
- Lightbox obligatoire — pas d'affichage plat

---

## Le diagnostic Kanguka — ce que ce projet doit corriger

| Défaut Kanguka | Exigence pour ce projet |
|---|---|
| Interface plate, sans relief | Cartes avec shadow, hiérarchie visuelle, profondeur |
| Visuellement vieilli | Typographie soignée (Lora + Inter), spacing généreux |
| Aucune animation | Framer Motion sur chaque entrée d'élément |
| Pas de transitions entre pages | Fade de page via `pageTransition` |
| Aucun feedback d'interaction | Hover scale sur cartes, active scale sur boutons |
| Mauvais sur mobile | Bottom navigation, touch targets 44px, safe area iOS |
| Images mal affichées | Ratios définis, lazy loading, lightbox galerie |
| Chargements sans feedback | Skeleton animé sur tous les états de chargement |

> Référence complète : `.claude/references/app-reference-notes.md`

---

## Fichiers de référence

- `.claude/references/client-notes.md` — Tout ce que Denis a partagé
- `.claude/references/app-reference-notes.md` — Features, flux, décisions techniques
- `.claude/references/content-samples.md` — Contenu réel et placeholders structurés

---

## Style de code

- TypeScript partout — pas de `any` sans commentaire justificatif
- Composants dans `src/components/`, pages dans `src/app/`
- Composants petits et mono-responsabilité
- Tous les appels Firebase passent par des fichiers service dans `src/lib/`
- Aucun appel Firestore direct depuis les composants
- Animations : Framer Motion uniquement

---

## Conscience des coûts Firebase

- Toujours paginer — jamais de collection sans `limit()`
- Pas de `onSnapshot` sauf si temps réel strictement nécessaire
- Cache SWR sur toutes les listes
- **Courir le skill `firebase-cost-guard` avant tout nouveau schéma Firestore**
- Alertes de budget : $1, $5, $10 — à activer dès le départ
- Storage : images + audios + vidéos courtes uniquement
- Quota Storage : 1 Go gratuit — ~50 images (75 MB) + audios (~300 MB) + vidéos courtes (~200 MB) ≈ 575 MB — surveiller

---

## Déploiement

- `main` → production (Vercel auto-deploy)
- `dev` → staging
- Ne jamais force-pusher `main`
- Toujours tester le contenu bilingue avant de déployer
- Score Lighthouse (PWA + Performance + Accessibilité) avant chaque mise en production
