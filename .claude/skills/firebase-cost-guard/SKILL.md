# SKILL — firebase-cost-guard

## name
firebase-cost-guard

## description
Gardien des coûts Firebase. Surveille chaque requête Firestore, chaque upload Storage, chaque écriture — pour maintenir l'application dans les limites du plan gratuit et éviter toute facture surprise.

## mission
Une église n'a pas de budget illimité pour les services cloud. Ce skill s'assure que chaque feature est conçue pour consommer le minimum de ressources Firebase, sans compromettre l'expérience utilisateur. À exécuter avant tout nouveau schéma Firestore ou feature avec des données.

---

## règles

### R1 — Toujours paginer
Aucune collection n'est jamais lue sans `limit()`. Sans exception.
```typescript
// CORRECT
query(collection(db, 'sermons'), orderBy('publishedAt', 'desc'), limit(12))

// INTERDIT — lit toute la collection à chaque visite
collection(db, 'sermons')
```

### R2 — getDocs avant onSnapshot
Par défaut, utiliser `getDocs` (one-time fetch). N'utiliser `onSnapshot` que si le temps réel est strictement nécessaire (ex: compteur de prières).

### R3 — Jamais de vidéo sur Firebase Storage
Les vidéos sur Storage coûtent en téléchargement. YouTube est gratuit et illimité. Règle absolue.

### R3b — Surveiller le volume des audios
Le plan gratuit offre 1 Go de Storage. Chaque audio de sermon fait 30–50 MB.
Avec 20 enseignements audio : ~700 MB — proche de la limite.
À partir de 15 fichiers audio : évaluer le passage au plan Blaze (pay-as-you-go, ~$0.026/Go).
Stocker cette évaluation dans `app-reference-notes.md`.

### R4 — Filtrer dans la requête, pas côté client
```typescript
// CORRECT — 10 lectures
query(col, where('priority', '==', 'urgent'), limit(10))

// INTERDIT — lit tout, filtre en JS
getDocs(col).then(snap => snap.docs.filter(d => d.data().priority === 'urgent'))
```

### R5 — Cache SWR sur toutes les listes
Toute liste (sermons, événements, annonces) est mise en cache avec SWR.
```typescript
const { data } = useSWR('sermons-list', fetchSermons, {
  revalidateOnFocus: false,       // pas de re-fetch au focus
  dedupingInterval: 300_000       // cache 5 minutes
})
```

### R6 — Contenu statique via ISR Next.js
Les pages dont le contenu change rarement (À propos, Dons/infos méthodes) utilisent `export const revalidate = 600` (régénération toutes les 10 minutes). Zéro lecture Firestore pour les visiteurs habituels.

### R7 — Compteurs dénormalisés
Jamais de `count()` live sur une collection pour afficher un chiffre.
Stocker un compteur dans un document dédié, incrémenté/décrémenté par Cloud Functions.
```typescript
// Un document "stats" contient : { totalSermons: 47, totalPrayers: 203 }
// Lire ce document = 1 lecture. Pas 203.
```

### R8 — Alertes de budget dès le départ
Configurer dans Firebase Console avant le premier déploiement :
- Alerte à 1$ → investigation
- Alerte à 5$ → audit immédiat
- Alerte à 10$ → blocage et revue

---

## limites du plan gratuit (Spark)

| Ressource | Limite / jour ou mois |
|---|---|
| Lectures Firestore | 50 000 / jour |
| Écritures Firestore | 20 000 / jour |
| Suppressions Firestore | 20 000 / jour |
| Firebase Storage stocké | 1 Go total |
| Firebase Storage téléchargé | 1 Go / jour |
| Firebase Auth | Illimité |
| Firebase Cloud Messaging | Illimité |
| Vercel Hosting bandwidth | 100 Go / mois (Vercel gratuit) |

---

## estimation des lectures par section

| Section | Lectures / visite | Visites estimées / jour | Lectures / jour | % quota |
|---|---|---|---|---|
| Accueil | 5 | 100 | 500 | 1% |
| Messages (liste) | 12 | 60 | 720 | 1.4% |
| Annonces | 10 | 80 | 800 | 1.6% |
| Événements | 8 | 60 | 480 | 1% |
| Galerie | 1 (index) | 50 | 50 | 0.1% |
| Enseignements | 12 | 40 | 480 | 1% |
| Prière | 20 | 30 | 600 | 1.2% |
| À propos (ISR) | 0 (cache) | — | 0 | 0% |
| **Total estimé** | | | **~3 630 / jour** | **~7%** |

Marge confortable sur le plan gratuit. Surveiller si la communauté dépasse 500 visites/jour.

---

## règles Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Collections publiques en lecture
    match /sermons/{doc}       { allow read: if true; allow write: if isEditor(); }
    match /teachings/{doc}     { allow read: if true; allow write: if isEditor(); }
    match /announcements/{doc} { allow read: if true; allow write: if isEditor(); }
    match /events/{doc}        { allow read: if true; allow write: if isEditor(); }
    match /gallery/{doc}       { allow read: if true; allow write: if isEditor(); }
    match /donationMethods/{doc} { allow read: if true; allow write: if isSuperAdmin(); }

    // Prières : lecture conditionnelle, écriture ouverte (formulaire public)
    match /prayers/{doc} {
      allow read: if resource.data.isPublic == true;
      allow create: if true;
      allow update, delete: if isEditor();
    }

    // Utilisateurs : lecture de son propre profil seulement
    match /users/{uid} {
      allow read: if request.auth.uid == uid || isAdmin();
      allow write: if isSuperAdmin();
    }

    // Notifications envoyées : admin seulement
    match /notifications/{doc} {
      allow read, write: if isAdmin();
    }

    // Stats (compteurs) : lecture publique, écriture admin
    match /stats/{doc} {
      allow read: if true;
      allow write: if isAdmin();
    }

    function isAdmin() {
      return request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role
           in ['editor', 'superadmin'];
    }
    function isEditor() {
      return isAdmin();
    }
    function isSuperAdmin() {
      return request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role
           == 'superadmin';
    }
  }
}
```

---

## règles Firebase Storage

```
Vidéos : INTERDIT (aucune règle d'upload pour les vidéos — elles ne doivent pas exister)
Images : upload par éditeurs authentifiés, lecture publique, max 5MB (filet de sécurité)
Audios : upload par éditeurs authentifiés, lecture publique, max 50MB
```

---

## checklist avant tout nouveau schéma Firestore

- [ ] Toutes les requêtes sont paginées avec `limit()`
- [ ] Aucun `onSnapshot` inutile
- [ ] Estimation lectures/jour calculée et < 20% du quota
- [ ] Cache SWR ou ISR prévu
- [ ] Filtrage dans la requête, pas côté client
- [ ] Règles Firestore rédigées avant de coder
- [ ] Aucun champ vidéo dans Storage

---

## points à surveiller

- **Galerie de 50 images** : si chaque visite charge 50 documents Firestore, ça coûte 50 lectures. Paginer par album ou charger 12 à la fois.
- **Prières publiques** : si la liste grandit vite, limiter à 20 dernières + pagination.
- **onSnapshot sur la liste de prières** : le compteur "J'ai prié pour ceci" peut utiliser onSnapshot sur un seul document, pas sur la liste entière.
- **Cache invalidation** : quand Denis publie un nouveau sermon, le cache SWR côté visiteurs doit expirer. Prévoir une revalidation via tag ou timestamp.
- **Storage d'audios** : un fichier audio de sermon peut faire 30–50 MB. Avec 20 enseignements, c'est déjà ~1 Go. Surveiller le quota Storage.
