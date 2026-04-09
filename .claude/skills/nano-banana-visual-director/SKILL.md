# SKILL — nano-banana-visual-director

## name
nano-banana-visual-director

## description
Directeur artistique de l'application CIFM4. Définit et impose l'identité visuelle de la Communauté Internationale des Fils de Malachie 4 : bleu + blanc, chaud, minimal, vivant, humain. Transforme l'esthétique vieillissante de Kanguka en une expérience moderne et fluide.

## mission
L'application de référence (Kanguka) est visuellement vieille, statique et sans vie. Ce projet doit être son opposé sur la forme, tout en gardant son âme sur le fond. Les couleurs officielles de la CIFM4 sont **bleu + blanc**. Chaque décision visuelle doit communiquer : foi solide, communauté vivante, modernité, chaleur humaine — dans une palette bleu/blanc noble et accessible.

---

## le diagnostic Kanguka — ce qu'il faut corriger

| Problème observé dans Kanguka | Solution nano-banana |
|---|---|
| Interface plate, sans profondeur | Ombres douces, cartes légèrement élevées, hiérarchie visuelle claire |
| Typographie basique, peu lisible | Lora pour les titres (élégance), Inter pour le corps (lisibilité) |
| Couleurs ternes ou génériques | Palette banana chaude, accents sage et rust, fond crème |
| Pas d'animations | Framer Motion — entrées en fadeUp, hover states, transitions de page |
| Images mal affichées | Ratios définis, object-cover, lazy loading, thumbnails soignés |
| Pas de micro-interactions | Hover sur cartes, press sur boutons, feedback visuel partout |
| Navigation confuse sur mobile | Bottom navigation fixe, claire, 5 tabs max |
| Contenu noyé dans la page | Espacement généreux, sections bien séparées, titres respirants |

---

## règles

### R1 — Bleu + Blanc sont les couleurs officielles de la CIFM4
Denis a confirmé : les couleurs officielles sont **bleu + blanc**.
La palette ci-dessous est une proposition de travail basée sur ces couleurs.
Dès réception du logo exact et des teintes précises, affiner immédiatement.
Documenter toute mise à jour dans ce fichier.

Ne jamais utiliser la palette "banana" (jaune) sur ce projet — elle était un placeholder avant réception du branding.

### R2 — Lora + Inter, jamais de mélange
Lora pour les titres (H1, H2, H3). Inter pour tout le reste. Jamais d'autres polices sans validation explicite. Jamais de mélange de polices dans un même composant.

### R3 — Framer Motion pour toutes les animations
Aucune animation CSS `transition` complexe sur les entrées d'éléments. Tout passe par Framer Motion. Les variantes exportées de `src/lib/animations.ts` sont la source de vérité.

### R4 — Chaleur avant esthétique
Si un choix visuel est beau mais froid, choisir l'option plus chaleureuse. L'app doit inspirer confiance et bienveillance, pas impressionner techniquement.

### R5 — Photos de la communauté > stock
Jamais de photo stock générique si des vraies photos de la communauté sont disponibles. Lumières chaudes, moments réels, personnes authentiques.

### R6 — Icônes lucide-react uniquement
Aucune autre librairie. Taille cohérente. Couleur `currentColor` ou banana pour l'emphase.

### R7 — Pas de dark mode en v1
Non demandé par Denis. Ne pas l'implémenter, ne pas préparer les tokens pour ça. Le faire uniquement si Denis le demande explicitement.

---

## palette de couleurs CIFM4

> Couleurs officielles confirmées : **Bleu + Blanc**.
> Palette de travail ci-dessous — à affiner dès réception du logo exact.

```css
/* ── Primaire — Bleu CIFM4 ─────────────────────────────────── */
--cifm-blue-700: #1A3A6B;   /* titres, texte sur fond blanc, nav */
--cifm-blue-600: #1E4D9B;   /* CTA principaux */
--cifm-blue-500: #2563EB;   /* hover sur CTA */
--cifm-blue-400: #3B82F6;   /* accents, icônes actives */
--cifm-blue-100: #DBEAFE;   /* fond teinté bleu très léger */
--cifm-blue-50:  #EFF6FF;   /* fond de section claire */

/* ── Blanc et neutres clairs ────────────────────────────────── */
--white:         #FFFFFF;   /* fond principal, cartes */
--off-white:     #F8FAFC;   /* fond de page (légèrement teinté) */
--gray-50:       #F9FAFB;   /* fond de card alternative */
--gray-100:      #F3F4F6;   /* bordures légères, séparateurs */
--gray-200:      #E5E7EB;   /* bordures normales */

/* ── Texte ──────────────────────────────────────────────────── */
--gray-500:      #6B7280;   /* texte secondaire, captions */
--gray-700:      #374151;   /* texte corps */
--gray-900:      #111827;   /* titres, texte fort */

/* ── Accent — Or/Doré (spirituel, versets, citations) ────────── */
--gold-400:      #D4A017;   /* citations bibliques, versets clés */
--gold-100:      #FEF3C7;   /* fond de citation */

/* ── Accent — Urgence / Dons ────────────────────────────────── */
--alert-red:     #DC2626;   /* annonces urgentes */
--alert-red-bg:  #FEE2E2;   /* fond annonce urgente */

/* ── Sémantique ─────────────────────────────────────────────── */
--success:       #16A34A;
--warning:       #D97706;
--error:         #DC2626;
```

### Utilisation des couleurs

| Contexte | Couleur |
|---|---|
| Fond de page | `off-white` (#F8FAFC) |
| Fond de cartes | `white` (#FFFFFF) |
| Header / Nav | `cifm-blue-700` fond ou blanc selon le contexte |
| Bouton CTA principal | `cifm-blue-600` fond, texte blanc |
| Bouton hover | `cifm-blue-500` |
| Titres H1/H2 | `gray-900` ou `cifm-blue-700` |
| Texte corps | `gray-700` |
| Texte secondaire | `gray-500` |
| Badges / tags | `cifm-blue-100` fond, `cifm-blue-700` texte |
| Citations bibliques | `gold-100` fond, `gold-400` bordure gauche |
| Annonces urgentes | `alert-red-bg` fond, `alert-red` badge |
| Footer | `cifm-blue-700` fond, blanc texte |
| Icônes actives | `cifm-blue-400` |

---

## typographie

```
Titres (Lora) :
  H1 page    : text-3xl md:text-4xl font-semibold leading-tight
  H2 section : text-2xl md:text-3xl font-semibold leading-snug
  H3 carte   : text-xl font-semibold leading-snug

Corps (Inter) :
  Texte long : text-base leading-relaxed (1.625)
  UI normal  : text-base leading-normal
  Caption    : text-sm text-stone-500
  Micro      : text-xs

Google Fonts import :
  Lora : weights 400, 600
  Inter : weights 400, 500, 600
```

---

## espacement système

```
4px  (space-1)  — espace icône/label
8px  (space-2)  — padding compact
12px (space-3)  — gap entre éléments proches
16px (space-4)  — base
24px (space-6)  — entre éléments liés
32px (space-8)  — entre groupes d'éléments
48px (space-12) — entre sections de page
64px (space-16) — sections majeures
80px (space-20) — hero
```

---

## composants — référence visuelle CIFM4

```
Bouton primaire  : bg-blue-600 text-white rounded-full px-6 py-3 font-semibold
                   hover:bg-blue-500 active:scale-95 transition-all

Bouton secondaire: border border-gray-200 text-gray-700 rounded-full px-6 py-3
                   hover:border-blue-300 hover:bg-blue-50

Bouton ghost     : text-blue-600 font-semibold hover:underline underline-offset-4

Carte            : bg-white rounded-2xl overflow-hidden shadow-sm
                   hover:shadow-md transition-shadow duration-200

Input            : bg-white border border-gray-200 rounded-xl px-4 py-3
                   focus:ring-2 focus:ring-blue-200 focus:border-blue-400

Badge normal     : bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-medium
Badge urgent     : bg-red-100 text-red-600 rounded-full px-3 py-1 text-xs font-bold

Citation biblique: border-l-4 border-yellow-400 bg-yellow-50 px-4 py-3 italic text-gray-700

Header           : bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0
Bottom nav       : bg-white border-t border-gray-100 fixed bottom-0 w-full
                   + padding pb-safe pour iOS
Footer           : bg-blue-700 text-white
```

---

## variantes Framer Motion (source de vérité)

```typescript
// src/lib/animations.ts

export const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } }
}

export const cardItem = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
}

export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } }
}

export const cardHover = {
  rest:  { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } }
}
```

---

## assets — état actuel

### Reçus / disponibles localement
- [x] Nom officiel : Communauté Internationale des Fils de Malachie 4 (CIFM4)
- [x] Couleurs officielles : Bleu + Blanc (teintes à affiner)
- [x] Logo / insigne : dans `logo et insigne eglise/` — à préparer
- [x] ~50 photos communauté : dans `immage evenement denis/`
- [x] Quelques vidéos courtes galerie : dans `immage evenement denis/`

### En attente
- [ ] Logo au format SVG vectoriel ou PNG haute résolution
- [ ] Teintes exactes bleu CIFM4 (hex) — à extraire du logo reçu
- [ ] Photo de couverture hero (format 16:9, lumineuse)
- [ ] Photos de l'équipe (portraits format 1:1)
- [ ] URL chaîne YouTube

---

## points à surveiller

- **Teintes exactes bleu non reçues** : la palette ci-dessus est une proposition. Extraire les valeurs hex exactes depuis le logo dès sa réception. Ne pas déployer en production sans les teintes officielles.
- **Contraste bleu sur blanc** : le bleu `#2563EB` sur fond blanc doit avoir un ratio de contraste ≥ 4.5:1 pour le texte. Vérifier avec un outil de contraste avant de figer les couleurs.
- **Bleu trop froid** : le bleu pur peut paraître corporate ou froid. Compenser par : photos de la communauté chaleureuses, typographie (Lora) humanisante, espacement généreux, tons dorés pour les citations.
- **Logo et insigne** : extraire le logo depuis `logo et insigne eglise/`. Préparer en SVG + PNG toutes tailles pour les icônes PWA. Placer dans `public/icons/`.
- **Galerie** : les ~50 photos de la communauté sont le matériel le plus chaleureux. Les mettre en valeur avec lightbox, transitions douces, légendes. C'est le cœur de la preuve sociale de la CIFM4.
- **Animations et performance** : trop d'entrées animées simultanément peut causer des chutes de framerate sur les téléphones bas de gamme. Limiter à `staggerChildren: 0.08` max.
- **Safe area iOS** : la bottom navigation doit utiliser `env(safe-area-inset-bottom)`.
- **Citations Malachie 4 / Actes 2** : traiter les versets clés avec le style citation doré — ils sont au cœur de l'identité de la CIFM4.
