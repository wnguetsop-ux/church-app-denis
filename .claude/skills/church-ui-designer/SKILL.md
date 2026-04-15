# SKILL — church-ui-designer

## name
church-ui-designer

## description
Designer UI/UX de l'application d'église. Transforme l'esprit Kanguka en une expérience moderne, vivante, fluide et belle sur mobile. Définit les composants, les animations, les interactions et la hiérarchie visuelle.

## mission
L'application de référence (Kanguka) était trop statique, trop ancienne visuellement, pas assez vivante. Ce projet doit corriger exactement ça : même âme spirituelle, mais rendu moderne, dynamique, fluide et beau sur mobile. Chaque écran doit donner l'impression que le contenu respire.

---

## le problème à résoudre (critique)

L'app Kanguka souffre de ces défauts visuels précis :

| Défaut Kanguka | Correction attendue |
|---|---|
| Contenu statique, figé | Entrées animées, éléments qui arrivent avec douceur |
| Visuellement vieilli | Design system moderne, typographie soignée, espacement généreux |
| Pas fluide | Transitions de page, scroll smooth, pas de chargements brutaux |
| Mauvaise expérience mobile | Mobile-first strict, touch targets larges, bottom navigation |
| Images mal mises en valeur | Ratios définis, lazy loading, lightbox, thumbnails soignés |
| Aucune micro-interaction | Hover states, press states, feedback visuel immédiat |

**Ce projet ne doit jamais ressembler à une brochure PDF mise en ligne.**

---

## règles

### R1 — Mobile-first absolu
Concevoir pour 375px. Adapter vers le haut. Jamais l'inverse. Sur mobile : bottom navigation fixe, touch targets ≥ 44×44px, padding horizontal minimum `px-4`.

### R2 — Framer Motion uniquement pour les animations
Aucune animation CSS personnalisée complexe. Toutes les animations passent par Framer Motion pour garantir la cohérence, la fluidité et le respect de `prefers-reduced-motion`.

### R3 — Vivant mais non distrayant
Les animations servent le contenu. Elles ne font pas de compétition avec lui. Durée max : 500ms. Pas d'animations en boucle sur le contenu principal. Pas de parallaxe agressif.

### R3b — Justification obligatoire en cas d'absence d'animation
Tout nouveau composant de liste, carte ou page doit avoir une animation Framer Motion associée (au minimum `fadeUp` ou `cardItem`). Si aucune animation n'est prévue, justifier explicitement dans le code avec un commentaire `// no-animation: [raison]`. Les exceptions légitimes sont : formulaires, messages d'erreur, contenu de prière, texte de confirmation critique.

### R4 — Jamais d'écran blanc
Tout état de chargement a un skeleton animé (`animate-pulse`). Jamais de spinner seul. Jamais de page vide pendant un fetch Firestore.

### R5 — Mise en valeur des images
- Ratio CSS défini sur chaque image (pas de layout shift)
- `object-cover` systématique
- Lazy loading natif + `loading="lazy"`
- Skeleton pendant le chargement
- Galerie : lightbox avec zoom doux et swipe mobile

### R6 — Accessibilité non négociable
WCAG AA minimum. Focus visible sur tout. `aria-label` sur tous les boutons icônes. Contraste suffisant. `prefers-reduced-motion` respecté.

### R7 — Composants de base avant les pages
Définir `Button`, `Card`, `Input`, `Badge`, `SkeletonCard`, `YoutubeFacade` avant de construire les pages. Les pages s'assemblent depuis ces briques.

### R8 — Icônes lucide-react uniquement
Aucune autre librairie d'icônes. Pas de mélange. Tailles : 18–20px inline, 24px standalone, 32–40px feature icon.

---

## système de composants

### Boutons
```
Primaire   : bg-banana rounded-full px-6 py-3 font-semibold active:scale-95
Secondaire : border border-stone-300 rounded-full px-6 py-3
Ghost      : text-banana font-semibold hover:underline underline-offset-4
```

### Cartes
```
Base       : bg-white rounded-2xl overflow-hidden shadow-sm
Hover      : hover:shadow-md transition-shadow duration-200
Press      : active:scale-[0.99]
```

### Navigation mobile
```
Bottom nav : bg-white border-t border-stone-100 fixed bottom-0 w-full
             5 tabs max : Accueil · Messages · Annonces · Galerie · Plus
             "Plus" → drawer avec les sections secondaires
```

### Header
```
bg-cream-50/80 backdrop-blur-sm border-b border-stone-100 sticky top-0 z-50
Logo à gauche · Switcher FR/EN à droite
```

---

## animations — catalogue complet

Définir dans `src/lib/animations.ts` :

```typescript
// Entrée d'un élément (page, section, carte)
export const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

// Container de liste en cascade
export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } }
}

// Élément dans une liste cascade
export const cardItem = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
}

// Transition entre pages
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } }
}

// Hover sur carte
export const cardHover = {
  rest:  { scale: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  hover: { scale: 1.02, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
           transition: { duration: 0.2 } }
}

// Tap sur bouton
export const buttonTap = { whileTap: { scale: 0.97 } }

// Wrapper respect prefers-reduced-motion
export const reducedMotion = (variants) =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? {} : variants
```

### Ce qui s'anime
- Entrée des cartes dans le viewport (fadeUp en cascade)
- Transitions entre pages (fade)
- Hover sur les cartes (scale léger)
- Press sur les boutons (scale down)
- Ouverture du drawer de navigation
- Lightbox galerie (zoom doux)
- Toast de notification

### Ce qui ne s'anime jamais
- Titres H1 des pages — immédiats
- Contenu de prière — solennel, pas d'effets
- Messages d'erreur — immédiats
- Formulaires — aucun délai
- Tout ce qui a une durée > 500ms

---

## direction visuelle premium — effets obligatoires

Référence d'inspiration : **iyenis.com** — hero slider, Ken Burns, zoom on hover, parallax, sensation premium.

### Hero Slider / Carousel (page d'accueil)
- Slider automatique avec 3–5 slides, intervalle ~6 secondes
- Transition : crossfade doux (pas de slide latéral brutal)
- Chaque slide : image plein écran + titre + CTA
- Indicateurs discrets (dots ou barre de progression fine)
- Swipe mobile natif
- Composant : `src/components/home/HeroSlider.tsx`

### Ken Burns (tous les heroes de pages)
- Effet de zoom lent + léger pan sur les images hero de chaque page
- Animation CSS `scale(1) → scale(1.08)` sur 12–15 secondes, `ease-in-out`
- Direction aléatoire ou alternée entre les slides
- Respecter `prefers-reduced-motion` : désactiver si activé
- S'applique à : `PageHeader` quand `backgroundImage` est présent

### Zoom on Hover (cartes et images)
- Toutes les cartes cliquables : `scale(1.03)` au hover, durée 300ms
- Images dans les cartes : zoom interne `scale(1.08)` avec `overflow-hidden` sur le container
- Galerie : zoom doux sur hover avec overlay subtil
- Implémentation : Framer Motion `whileHover` ou CSS `group-hover`

### Parallax (sections et images)
- Parallax léger sur les sections hero : vitesse 0.3–0.5× du scroll
- Pas de parallax agressif — mouvement subtil qui ajoute de la profondeur
- Désactiver sur mobile bas de gamme (détection via `matchMedia` ou `navigator.hardwareConcurrency`)
- Implémentation : `useScroll` + `useTransform` de Framer Motion

### Micro-interactions premium
- Boutons : `scale(0.97)` au press + ripple subtil
- Links : underline animate de gauche à droite au hover
- Icônes de navigation : léger bounce au tap
- Transitions de page : fade + léger slide vertical (20px)
- Scroll indicators : fade in/out selon la position

### Règle de performance
- Toutes les animations premium utilisent `transform` et `opacity` uniquement (GPU)
- Ken Burns : CSS animation (pas JS) pour économiser le CPU
- Parallax : `will-change: transform` sur l'élément cible
- Désactiver les effets lourds si `prefers-reduced-motion: reduce`

---

## layout système

```
Max width      : max-w-2xl (mobile-first, lisible)
Padding horiz  : px-4 md:px-6
Sections       : py-10 md:py-16
Gap cartes     : gap-4
Radius carte   : rounded-2xl
Radius image   : rounded-xl (dans une carte rounded-2xl)
Radius bouton  : rounded-full
```

---

## ratios d'images

```
Sermons / vidéos  : 16:9
Événements        : 3:2
Galerie (grille)  : 1:1 (carré)
Équipe            : 1:1 (circulaire)
Hero              : 16:9 ou full-bleed selon le design
Annonces          : 16:9 ou 3:2
```

---

## points à surveiller

- **Animations trop nombreuses** : si tout bouge en même temps, rien n'est mis en valeur. Hiérarchiser.
- **Performance des animations** : utiliser `transform` et `opacity` uniquement (GPU). Jamais `width`, `height`, `top` en animation.
- **Layout shift** : chaque image doit avoir son ratio défini avant chargement. Vérifier avec Lighthouse CLS.
- **Touch targets trop petits** : vérifier sur vrai mobile, pas seulement en DevTools.
- **Lightbox galerie** : tester le swipe sur iOS Safari — différent de Chrome Android.
- **Skeleton trop long** : si les skeletons s'affichent > 2 secondes, c'est un problème de requête, pas de design.
- **Bottom nav et safe area** : ajouter `pb-safe` (env(safe-area-inset-bottom)) pour les iPhones avec encoche.
