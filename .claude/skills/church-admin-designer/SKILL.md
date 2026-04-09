# SKILL — church-admin-designer

## name
church-admin-designer

## description
Designer et architecte de l'interface admin de l'application d'église. Conçoit un CMS simple, utilisable depuis un téléphone, permettant à Denis de publier tous les contenus sans aide technique.

## mission
Donner à Denis un outil de publication autonome, intuitif et fiable. L'admin doit être aussi simple à utiliser qu'une application de messagerie — sans formation, sans guide, sans erreur possible non récupérable.

---

## règles

### R1 — Denis n'est pas développeur
Chaque action doit être évidente sans explication. Pas de jargon technique dans l'interface. Les libellés sont en langage naturel, pas en termes informatiques.

### R2 — Mobile-first pour l'admin
Denis publiera depuis son téléphone. L'admin doit être parfaitement utilisable sur 375px. Boutons larges, formulaires verticaux, keyboard-aware.

### R3 — Jamais de perte de données silencieuse
Toute suppression demande une confirmation explicite avec le nom de l'élément à supprimer. Pas de bouton "Supprimer" rouge directement actionnable.

### R4 — Feedback immédiat
Chaque action (save, delete, upload) affiche un toast de succès ou d'erreur. Pas de rechargement de page. Pas d'incertitude sur "est-ce que ça a fonctionné ?".

### R5 — Formulaires toujours bilingues
Chaque formulaire de contenu affiche les champs FR et EN côte à côte sur desktop, empilés avec labels clairs ("Français" / "English") sur mobile.

### R6 — Traçabilité
Chaque document Firestore a `updatedBy` (uid de l'admin) et `updatedAt`. Afficher "Dernière modification par [nom] le [date]" sous chaque item dans la liste admin.

### R7 — Sécurité double couche
Toutes les routes `/admin/*` sont protégées par :
1. Firebase Auth (token vérifié côté serveur via middleware Next.js)
2. Rôle Firestore (lu dans `users/{uid}.role`)
Les deux doivent être vrais. Jamais de vérification uniquement côté client.

### R8 — Upload d'images avec compression automatique
Toute image uploadée est compressée côté client avant l'envoi (max 1.5 MB, max 1920px). Denis ne doit pas avoir à penser à la taille des fichiers.

---

## rôles

| Rôle | Accès |
|---|---|
| `superadmin` | Tout — Denis uniquement |
| `editor` | Créer/modifier les contenus, envoyer des notifications. Ne peut pas supprimer ni gérer les utilisateurs |
| `viewer` | Lecture seule (statistiques, listes) |

Rôle stocké dans `users/{uid}.role`. Vérifié côté serveur sur chaque requête admin.

---

## sections admin

| Section | Actions |
|---|---|
| Messages (sermons) | Ajouter (URL YouTube → extraction auto) · Modifier · Supprimer · Mettre en vedette |
| Enseignements | Ajouter (type texte/audio) · Upload audio · Modifier · Supprimer |
| Annonces | Ajouter · Modifier · Archiver · Définir priorité urgente · Date d'expiration |
| Événements | Ajouter · Modifier · Supprimer |
| Galerie | Upload multiple · Caption bilingue · Réorganiser par ordre · Supprimer |
| Prière | Voir les demandes publiques · Masquer (modération) |
| Dons | Modifier les infos de chaque méthode (numéros, instructions) |
| Pages statiques | Modifier le texte de bienvenue, À propos, Contact |
| Équipe | Ajouter/modifier/supprimer membres (photo + nom + rôle bilingue) |
| Notifications | Composer (titre + corps FR+EN) · Choisir audience · Envoyer via FCM |
| Utilisateurs | Gérer les rôles (superadmin uniquement) |

---

## routes admin

```
/admin                             → Dashboard (stats + raccourcis rapides)
/admin/messages                    → Liste sermons
/admin/messages/new                → Ajouter sermon
/admin/messages/[id]/edit          → Modifier sermon
/admin/enseignements               → Liste enseignements
/admin/enseignements/new           → Ajouter enseignement
/admin/annonces                    → Liste annonces
/admin/annonces/new                → Ajouter annonce
/admin/evenements                  → Liste événements
/admin/evenements/new              → Ajouter événement
/admin/galerie                     → Gestion galerie
/admin/prieres                     → Modération prières
/admin/dons                        → Infos méthodes de don
/admin/notifications               → Envoi notifications push
/admin/pages                       → Éditeur pages statiques
/admin/equipe                      → Gestion équipe
/admin/utilisateurs                → Gestion rôles (superadmin)
/admin/parametres                  → Paramètres généraux
```

---

## workflow upload galerie

```
1. Denis sélectionne 1 ou plusieurs images (accept="image/*", multiple)
2. Compression client-side : browser-image-compression → max 1.5MB, 1920px
3. Upload Firebase Storage : /gallery/{uuid}.webp
4. Génération thumbnail 400px → /gallery/thumbs/{uuid}.webp
5. Sauvegarde URLs dans Firestore (url + thumbnailUrl + uploadedBy + createdAt)
6. Prévisualisation immédiate dans l'admin
7. Denis ajoute les captions FR et EN (optionnel)
```

---

## formulaire sermon (exemple de logique UX)

```
1. Denis colle l'URL YouTube complète
2. L'app extrait l'ID automatiquement et affiche la prévisualisation du thumbnail
3. Denis vérifie que c'est la bonne vidéo
4. Remplit : titre FR · titre EN · speaker · série FR · série EN · date · tags
5. Prévisualise la carte telle qu'elle apparaîtra sur l'app
6. Clique "Publier"
7. Toast de confirmation · Redirection vers la liste
```

---

## points à surveiller

- **Formulaires sur mobile** : le clavier virtuel masque le bas du formulaire. Prévoir `KeyboardAvoidingView`-style (scroll vers le champ actif) ou `ScrollView` natif.
- **Upload photo lent** : afficher une barre de progression pendant l'upload Firebase. Denis sur réseau mobile peut avoir une connexion lente.
- **Perte de saisie** : si Denis quitte accidentellement un formulaire à moitié rempli, proposer "Voulez-vous continuer où vous en étiez ?".
- **Sermon déjà publié** : si Denis recolle la même URL YouTube, détecter le doublon et avertir.
- **Notification de masse** : l'envoi FCM à "Tous" est irréversible. Afficher un écran de confirmation avec prévisualisation du message avant l'envoi.
- **Sécurité admin** : déconnexion automatique après 24h d'inactivité. Ne jamais stocker le token admin dans localStorage sans expiration.
