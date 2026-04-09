# SKILL — youtube-video-strategy

## name
youtube-video-strategy

## description
Stratège de l'intégration YouTube pour l'application d'église. Définit comment les sermons et vidéos sont stockés, affichés et optimisés. Impose la règle absolue : aucune vidéo n'est hébergée sur Firebase.

## mission
Garantir que toutes les vidéos de l'église transitent par YouTube — gratuitement, sans quota, sans bande passante Firebase. Optimiser l'affichage pour mobile avec la technique de façade. Rendre le lecteur de sermons aussi beau et fluide que possible.

---

## règles

### R1 — RÈGLE ABSOLUE : YouTube uniquement
Aucun fichier vidéo n'est jamais uploadé sur Firebase Storage.
Stocker uniquement l'ID YouTube (11 caractères) en Firestore.
Cette règle ne peut pas être contournée, même temporairement.

### R2 — Stocker l'ID, pas l'URL
```typescript
// CORRECT
{ youtubeVideoId: "dQw4w9WgXcQ" }

// INTERDIT — l'URL peut changer de format, l'ID est permanent
{ youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
```

### R3 — Façade YouTube obligatoire
Ne jamais charger l'iframe YouTube directement au rendu de la page.
Afficher : thumbnail + overlay play. Charger l'iframe uniquement au clic.
Économie : ~500KB de JS YouTube par vidéo non visionnée.

### R4 — Domaine youtube-nocookie.com
Toujours utiliser `youtube-nocookie.com` pour l'embed (conformité RGPD, réduit le tracking).
```
https://www.youtube-nocookie.com/embed/[ID]?rel=0&modestbranding=1
```

### R5 — Thumbnail sans API
Les thumbnails YouTube sont publics sans clé API :
```
https://img.youtube.com/vi/[ID]/hqdefault.jpg     (480×360 — pour les cartes)
https://img.youtube.com/vi/[ID]/maxresdefault.jpg  (1280×720 — pour la page sermon)
```
Ne jamais appeler l'API YouTube Data v3 pour obtenir les thumbnails.

### R6 — Validation de l'ID en admin
Au moment où Denis colle une URL YouTube dans le formulaire admin :
- Extraire l'ID automatiquement
- Afficher la prévisualisation du thumbnail
- Valider que l'ID fait exactement 11 caractères
- Afficher une erreur si l'extraction échoue (URL invalide)

### R7 — Pas d'autoplay
Aucune vidéo ne se lance automatiquement. Jamais. Réseau mobile + autoplay = mauvaise expérience utilisateur.

---

## extraction de l'ID YouTube

```typescript
// src/lib/youtube.ts

export function extractYouTubeId(url: string): string | null {
  if (!url) return null
  // Formats supportés :
  // youtube.com/watch?v=ID
  // youtu.be/ID
  // youtube.com/embed/ID
  // youtube.com/live/ID
  // youtube.com/shorts/ID
  const regex = /(?:v=|youtu\.be\/|embed\/|live\/|shorts\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

export function getYouTubeThumbnail(
  id: string,
  quality: 'default' | 'hq' | 'maxres' = 'hq'
): string {
  const map = {
    default: 'default',
    hq:      'hqdefault',
    maxres:  'maxresdefault'
  }
  return `https://img.youtube.com/vi/${id}/${map[quality]}.jpg`
}

export function getYouTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&enablejsapi=1`
}
```

---

## composant façade YouTube

```tsx
// src/components/sermons/YoutubeFacade.tsx

interface Props {
  videoId: string
  title: string
}

export function YoutubeFacade({ videoId, title }: Props) {
  const [playing, setPlaying] = useState(false)
  const thumbnail = getYouTubeThumbnail(videoId, 'hq')
  const embedUrl  = getYouTubeEmbedUrl(videoId)

  if (playing) {
    return (
      <div className="aspect-video w-full">
        <iframe
          src={`${embedUrl}&autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full rounded-xl"
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative aspect-video w-full rounded-xl overflow-hidden group"
      aria-label={`Lire la vidéo : ${title}`}
    >
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Overlay sombre au hover */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
      {/* Bouton play */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center
                        group-hover:scale-110 transition-transform duration-200 shadow-lg">
          <PlayIcon className="w-7 h-7 text-stone-900 ml-1" />
        </div>
      </div>
    </button>
  )
}
```

---

## carte sermon

```
┌─────────────────────────────────┐
│  [Thumbnail 16:9 + overlay play]│
├─────────────────────────────────┤
│  Titre (locale courant)         │
│  Speaker · Série · Date         │
│  Description (2 lignes tronqué) │
│                      [Voir →]   │
└─────────────────────────────────┘
```

---

## page sermon individuelle

```
1. YoutubeFacade (pleine largeur)
2. Titre H1 (locale)
3. Speaker · Série · Date
4. Tags (badges)
5. Description complète
6. Bouton "Partager" (Web Share API natif sur mobile)
7. Section "Autres messages" (même série ou speaker, 3 max)
```

---

## points à surveiller

- **thumbnail maxresdefault manquant** : certaines vieilles vidéos YouTube n'ont pas de `maxresdefault`. Fallback sur `hqdefault` si le chargement échoue (onerror).
- **Vidéo privée ou supprimée** : le thumbnail ne charge pas. Afficher un placeholder avec l'icône YouTube + message "Vidéo non disponible".
- **URL YouTube invalide** : Denis peut coller une URL de playlist ou de chaîne. L'extraction doit échouer proprement avec un message d'erreur clair.
- **Performance** : avec 20+ sermons sur la page liste, chaque thumbnail est une requête img. Utiliser `loading="lazy"` sur tous.
- **Autoplay sur mobile** : les navigateurs mobiles bloquent souvent l'autoplay même avec `autoplay=1`. Tester sur vrai appareil.
- **Partage** : `navigator.share()` n'est pas disponible sur tous les navigateurs desktop. Prévoir un fallback "Copier le lien".
