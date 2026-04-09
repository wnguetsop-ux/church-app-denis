# SKILL — safe-dev-workflow

## name
safe-dev-workflow

## description
Gardien du workflow de développement. Impose les pratiques sûres : branches git, secrets, déploiement, configuration PWA, tests, et gestion des variables d'environnement.

## mission
Éviter les erreurs irréversibles — commits de secrets, déploiements non testés, force-push sur main, données perdues. Ce projet est une application publique pour une église : une mauvaise mise en production peut toucher des centaines de personnes et endommager la confiance.

---

## règles

### R1 — Jamais de commit direct sur `main`
Tout passe par `dev`. Les features passent par `feature/*`. Les corrections par `fix/*`. Seule exception : les hotfixes critiques via `hotfix/*` (avec confirmation explicite).

### R2 — Jamais de secrets dans le code
Aucune clé API, credential Firebase, clé privée, numéro de compte, IBAN dans le code ou les commits. Tout passe par les variables d'environnement Vercel. `.env.local` dans `.gitignore`.

### R3 — Confirmation avant toute action destructive
Les actions suivantes nécessitent une confirmation explicite de l'utilisateur :
- `git push --force` ou `--force-with-lease` sur `main`
- `git reset --hard`
- Suppression d'une collection Firestore en production
- Envoi d'une notification push à "Tous"
- Déploiement en production (`vercel --prod` ou merge sur `main`)

### R4 — Tester bilingue avant tout déploiement
Tester FR et EN sur chaque page modifiée. Pas de déploiement avec une langue cassée.

### R5 — Lighthouse avant mise en production
Score minimum avant tout déploiement : Performance ≥ 80, Accessibilité ≥ 95, PWA = 100.

### R6 — PWA toujours valide
Le `manifest.json` et les icônes doivent être présents et valides à tout moment. Ne jamais deployer une PWA sans avoir vérifié l'installation sur mobile.

### R7 — Variables d'env serveur jamais en `NEXT_PUBLIC_`
Les clés secrètes (Firebase Admin, etc.) ne doivent jamais être préfixées `NEXT_PUBLIC_`. Ce préfixe expose la valeur dans le bundle client.

---

## stratégie de branches

```
main        → production (Vercel auto-déploie)
dev         → staging (Vercel preview auto-généré)
feature/*   → nouvelles features → PR vers dev
fix/*       → corrections bugs → PR vers dev
hotfix/*    → fix critique prod → PR vers main + dev
```

---

## format des commits

```
type(scope): description courte en français ou anglais

Types : feat | fix | chore | docs | style | refactor | test | perf

Exemples :
  feat(sermons): add YouTube facade component
  fix(i18n): correct French date format in event cards
  feat(pwa): add service worker offline cache for sermon list
  chore(firebase): update Firestore security rules
  perf(gallery): add image compression before Firebase upload
  fix(admin): prevent duplicate sermon from same YouTube URL
```

---

## variables d'environnement requises

```bash
# Firebase — côté client (NEXT_PUBLIC_ OK)
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_VAPID_KEY          # FCM push — côté client

# Firebase Admin — côté serveur UNIQUEMENT (jamais NEXT_PUBLIC_)
FIREBASE_ADMIN_PRIVATE_KEY              # JSON stringifié
FIREBASE_ADMIN_CLIENT_EMAIL

# App
NEXT_PUBLIC_APP_URL                     # URL de production (OG tags, PWA)
```

Ne jamais logger `FIREBASE_ADMIN_PRIVATE_KEY`. Ne jamais la committer.

---

## configuration PWA

### `public/manifest.json`
```json
{
  "name": "[Nom complet de l'église]",
  "short_name": "[Nom court]",
  "description": "Messages, prières, événements — [nom de l'église]",
  "start_url": "/fr/",
  "display": "standalone",
  "background_color": "#FAFAF7",
  "theme_color": "#F5C842",
  "orientation": "portrait",
  "lang": "fr",
  "icons": [
    { "src": "/icons/icon-72.png",   "sizes": "72x72",   "type": "image/png" },
    { "src": "/icons/icon-96.png",   "sizes": "96x96",   "type": "image/png" },
    { "src": "/icons/icon-128.png",  "sizes": "128x128", "type": "image/png" },
    { "src": "/icons/icon-144.png",  "sizes": "144x144", "type": "image/png" },
    { "src": "/icons/icon-152.png",  "sizes": "152x152", "type": "image/png" },
    { "src": "/icons/icon-192.png",  "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-384.png",  "sizes": "384x384", "type": "image/png" },
    { "src": "/icons/icon-512.png",  "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### Stratégie de cache service worker
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /\/api\//,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'api', expiration: { maxAgeSeconds: 300 } }
    },
    {
      urlPattern: /firebasestorage\.googleapis\.com/,
      handler: 'CacheFirst',
      options: { cacheName: 'storage', expiration: { maxAgeSeconds: 2592000 } }
    },
    {
      urlPattern: /img\.youtube\.com/,
      handler: 'CacheFirst',
      options: { cacheName: 'yt-thumbs', expiration: { maxAgeSeconds: 604800 } }
    }
  ]
})
```

---

## checklist pré-déploiement

- [ ] Toutes les chaînes FR + EN remplies
- [ ] Aucun `console.log` en production
- [ ] Aucune clé ou secret en dur dans le code
- [ ] Règles Firestore testées (Emulator)
- [ ] Variables d'env configurées dans Vercel
- [ ] Testé sur mobile réel (375px) en FR et EN
- [ ] Aucune vidéo sur Firebase Storage
- [ ] `manifest.json` valide, toutes les icônes présentes
- [ ] Score Lighthouse PWA = 100
- [ ] Score Lighthouse Performance ≥ 80 (mobile)
- [ ] Score Lighthouse Accessibilité ≥ 95
- [ ] Installation PWA testée sur Android Chrome
- [ ] Notifications push testées (si feature active)

---

## feuille de route Play Store / Apple Store (futur)

### Play Store via TWA (Trusted Web Activity)
1. PWA Lighthouse PWA = 100 requis
2. Générer APK via Bubblewrap ou PWABuilder
3. Configurer `/.well-known/assetlinks.json`
4. Tester sur Android réel avant soumission
5. Compte Google Play Developer ($25 one-time)

### Apple App Store
1. Compte Apple Developer requis ($99/an)
2. Option A : Capacitor (wrapper natif WebView)
3. Option B : PWABuilder (plus simple)
4. Tester sur iOS réel (Safari WebKit)
5. Review Apple peut prendre 1–7 jours

**Ne pas commencer cette étape avant que la PWA soit validée et utilisée.**

---

## points à surveiller

- **Merge sur main sans test** : toujours tester la branche `dev` sur mobile avant de merger sur `main`. Vercel preview est là pour ça.
- **Variables d'env manquantes en production** : après chaque ajout de variable en `.env.local`, vérifier qu'elle est aussi configurée dans Vercel > Settings > Environment Variables.
- **Icônes PWA manquantes** : si une taille d'icône manque dans le manifest, Chrome ne proposera pas l'installation. Vérifier avec Lighthouse.
- **Service worker périmé** : après une mise à jour, forcer le nouveau SW avec `skipWaiting: true`. Sinon les utilisateurs peuvent rester sur l'ancienne version indéfiniment.
- **CORS Firebase Storage** : configurer les règles CORS Firebase Storage pour autoriser les requêtes depuis le domaine de production.
- **Déploiement avant logo** : ne pas déployer en production sans le vrai logo de Denis. Le favicon et les icônes PWA sont critiques pour la perception de sérieux.
