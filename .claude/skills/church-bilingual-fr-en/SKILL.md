# SKILL — church-bilingual-fr-en

## name
church-bilingual-fr-en

## description
Architecte du support bilingue Français/Anglais de l'application. Définit la structure i18n, les conventions de traduction, le schéma de données Firestore bilingue et le comportement du switcher de langue.

## mission
Garantir que chaque visiteur, qu'il soit francophone ou anglophone, vit une expérience complète et cohérente. Le français est la langue primaire — tout part de là. L'anglais est une traduction soignée, jamais une réflexion après coup.

---

## règles

### R1 — Jamais de texte UI en dur
Tout texte visible par l'utilisateur passe par `useTranslations()` ou `getTranslations()` de next-intl.
```typescript
// CORRECT
const t = useTranslations('nav')
<span>{t('messages')}</span>

// INTERDIT
<span>Messages</span>
<span>Sermons</span>
```

### R2 — Français en premier, toujours
Rédiger en français d'abord. Jamais créer les deux langues en parallèle. La clé FR est la référence.

### R3 — Jamais de champ vide
Si la traduction anglaise n'est pas encore disponible, marquer `[TO TRANSLATE]` — jamais laisser un champ vide ou retourner une clé brute.

### R4 — Fallback FR automatique
Si une clé next-intl manque en EN, afficher le FR. Jamais afficher la clé brute (`nav.messages`).

### R5 — Champs Firestore : toujours BilingualText
Tout champ textuel dynamique est stocké sous la forme `{ fr: string, en: string }`.
```typescript
type BilingualText = { fr: string; en: string }

// Accès en composant
const title = item.title[locale] ?? item.title.fr
```

### R6 — Dates et nombres localisés via Intl
```typescript
// Dates
new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-CA', {
  day: 'numeric', month: 'long', year: 'numeric'
}).format(date)
// FR : "12 avril 2025"   EN : "April 12, 2025"

// Nombres
new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-CA').format(n)
```

### R7 — Préférence stockée en localStorage
La langue choisie est sauvegardée dans `localStorage` clé `preferred-locale`.
Au retour, l'app recharge dans la langue préférée, pas la langue par défaut.

### R8 — SEO bilingue
Chaque page a ses balises `<title>`, `<meta description>`, `og:locale` et `<link rel="alternate">` dans la bonne langue.

---

## stack i18n

```
Librairie      : next-intl
URL structure  : /fr/[route] et /en/[route]
Locale défaut  : fr
Détection      : localStorage → Accept-Language header → défaut fr
Fichiers       : src/messages/fr.json
                 src/messages/en.json
```

---

## structure des fichiers de messages

```json
// src/messages/fr.json
{
  "nav": {
    "home": "Accueil",
    "messages": "Messages",
    "teachings": "Enseignements",
    "announcements": "Annonces",
    "events": "Événements",
    "gallery": "Galerie",
    "prayer": "Prière",
    "give": "Donner",
    "about": "À propos",
    "contact": "Contact",
    "more": "Plus",
    "language": "Langue"
  },
  "common": {
    "loading": "Chargement...",
    "error": "Une erreur est survenue",
    "retry": "Réessayer",
    "read_more": "Lire la suite",
    "see_all": "Voir tout",
    "share": "Partager",
    "back": "Retour",
    "close": "Fermer",
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "confirm_delete": "Êtes-vous sûr de vouloir supprimer ?"
  },
  "home": {
    "hero_cta": "Voir le dernier message",
    "join_cta": "Nous rejoindre",
    "latest_sermon": "Dernier message",
    "upcoming_events": "Prochains événements",
    "prayer_cta": "Nous prions pour vous",
    "give_cta": "Soutenir l'église"
  },
  "prayer": {
    "title": "Prière",
    "intro": "Partagez votre cœur avec nous. Nous portons vos prières.",
    "name_label": "Votre prénom (optionnel)",
    "request_label": "Votre demande de prière",
    "public_label": "Rendre cette prière publique",
    "submit": "Envoyer ma prière",
    "prayed_for": "J'ai prié pour ceci",
    "wall_title": "Mur de prières",
    "success": "Votre prière a été reçue. Nous prions pour vous.",
    "anonymous": "Anonyme"
  },
  "give": {
    "title": "Donnez avec générosité",
    "intro": "Votre générosité permet à notre église de poursuivre sa mission.",
    "instructions": "Instructions",
    "thank_you": "Merci pour votre générosité !"
  }
}
```

---

## switcher de langue — comportement

```
- Affiché dans le header sur toutes les pages
- Affiche la langue courante (ex: FR) avec icône globe
- Au clic : bascule vers l'autre locale
- Change l'URL : /fr/messages → /en/messages
- Sauvegarde dans localStorage: 'preferred-locale'
- Transition douce (Framer Motion opacity)
- Sur mobile : compact (abréviation 2 lettres)
- Sur desktop : peut afficher "Français / English"
```

---

## schéma bilingue Firestore — règles

```typescript
// Toujours ce pattern — pas de _fr / _en suffixés
type BilingualText = { fr: string; en: string }

// CORRECT
{ title: { fr: "La paix de Dieu", en: "The Peace of God" } }

// INTERDIT
{ title_fr: "La paix de Dieu", title_en: "The Peace of God" }
{ titleFr: "La paix de Dieu", titleEn: "The Peace of God" }

// Accès sécurisé en composant
const locale = useLocale() // 'fr' | 'en'
const title = sermon.title[locale as 'fr' | 'en'] ?? sermon.title.fr
```

---

## SEO bilingue

```tsx
export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('page_title'),
    description: t('page_description'),
    alternates: {
      languages: {
        'fr': `/fr/${slug}`,
        'en': `/en/${slug}`
      }
    },
    openGraph: {
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: locale === 'fr' ? ['en_US'] : ['fr_FR']
    }
  }
}
```

---

## checklist audit bilingue (avant tout déploiement)

- [ ] Toutes les clés de `fr.json` existent dans `en.json`
- [ ] Aucun texte FR ou EN en dur dans les composants
- [ ] Tous les documents Firestore ont les champs `fr` et `en` non vides
- [ ] Dates formatées avec `Intl`, pas en dur
- [ ] Switcher de langue fonctionne sur toutes les pages
- [ ] `<title>` et `<meta description>` sont localisés
- [ ] `og:locale` correct dans les balises Open Graph
- [ ] Fallback FR fonctionne quand EN est absent

---

## points à surveiller

- **Texte FR plus long que EN** : prévoir 15–20% d'espace supplémentaire dans les boutons et les labels. Tester les deux langues sur chaque composant.
- **Ton FR non confirmé** : `vous` ou `tu` ? Ne pas rédiger tout le contenu avant que Denis confirme.
- **Formulaires admin bilingues** : l'admin doit afficher FR et EN côte à côte. Si Denis laisse EN vide, bloquer la publication avec un message clair.
- **Cache et locale** : si la liste de sermons est mise en cache, le cache doit être par locale. Un visiteur EN ne doit pas voir les données FR en cache.
- **Slug d'URL** : les routes `/fr/evenements` et `/en/events` pointent vers la même page. Prévoir les deux slugs dans `next-intl` routing config.
