# client-notes.md — Denis Descartes Tadum / CIFM4

> Source de vérité sur le client. À mettre à jour après chaque échange.
> Ne jamais coder une feature qui contredit ce fichier.

---

## Le client

| Champ | Info |
|---|---|
| Nom complet | Denis Descartes Tadum |
| Rôle | Responsable / Pasteur de la CIFM4 |
| Email | tadumdenis@gmail.com |
| Téléphone | À recevoir (numéro personnel pour le contact) |
| Langue principale | Français |
| Langue secondaire | Anglais |
| Profil technique | Non-développeur. Publie lui-même les contenus via l'admin. |

---

## La communauté

| Champ | Info |
|---|---|
| Nom officiel | Communauté Internationale des Fils de Malachie 4 |
| Abréviation | CIFM4 / C.I.F.M.4 |
| Type | Organisation chrétienne à but non lucratif |
| Couleurs officielles | Bleu + Blanc |
| Ville / pays | À confirmer par Denis |
| Adresse | À confirmer |
| Téléphone | À confirmer |
| Horaires cultes | À confirmer |
| Domaine web | À recevoir de Denis |
| Site actuel | À confirmer — existe-t-il un site à remplacer ? |

---

## Mission de la CIFM4 — confirmée

Denis a décrit les objectifs de l'organisation :

1. Promouvoir la parole de Dieu
2. Promouvoir le message de **Malachie 4:5-6**
3. Promouvoir le style de vie communautaire des chrétiens de **Actes 2**
4. Aider les laissés pour compte
5. Accueillir les personnes en difficulté par une aide matérielle, morale et spirituelle
6. Mettre à disposition le message biblique et diverses publications chrétiennes

> Ces objectifs doivent guider le ton, le contenu et la navigation de l'app.

---

## Réseaux sociaux — état actuel

| Réseau | URL / Info | Statut |
|---|---|---|
| Facebook | https://www.facebook.com/communautedesfilsdemalachie4 | Confirmé |
| YouTube | À recevoir | En attente |
| TikTok | À recevoir | En attente |
| Instagram | Non mentionné | À confirmer |

---

## Coordonnées de don — confirmées

| Méthode | Numéro / Contact | Titulaire |
|---|---|---|
| Orange Money | 656075637 | Denis Descartes Tadum |
| MTN Money | 681441569 | Denis Descartes Tadum |
| PayPal | tadumdenis@gmail.com | Denis Descartes Tadum |
| Virement bancaire | À recevoir (IBAN / RIB) | À confirmer |

> L'app affiche ces coordonnées et les instructions. Elle ne traite aucun paiement directement.

---

## Assets locaux disponibles

Ces dossiers existent déjà sur la machine du développeur et contiennent du matériel réel :

```
immage evenement denis/
├── [~50 photos de la communauté et d'événements]
├── [quelques courtes vidéos d'événements]
└── logo et insigne eglise/
    └── [logo et insigne officiel de la CIFM4]
```

**Ce qu'il faut faire avec ces assets :**
- [ ] Inventorier les photos disponibles (noms, qualité, catégories)
- [ ] Identifier les vidéos courtes (durée, poids) — décider si Storage ou YouTube
- [ ] Extraire et préparer le logo (SVG ou PNG haute résolution)
- [ ] Préparer les variantes d'icônes PWA depuis le logo

---

## Stratégie médias — confirmée

| Type de média | Hébergement | Limite |
|---|---|---|
| Photos | Firebase Storage | OK, compressées à 1.5 MB |
| Images galerie | Firebase Storage | ~50 images, OK |
| Audios | Firebase Storage | Max 50 MB/fichier |
| Vidéos courtes (galerie/événements) | Firebase Storage | Max 3 min / 50 MB / ~10 en v1 |
| Vidéos longues (messages, sermons, enseignements) | **YouTube obligatoire** | Jamais sur Firebase |

---

## Ce que Denis veut — confirmé

### L'esprit général
Denis a montré l'application **Kanguka** comme référence directe.
Il aime la logique simple, spirituelle, centrée sur la communauté de foi.
Il ne veut pas changer cet esprit — il veut le moderniser.

### Ce qu'il veut améliorer par rapport à Kanguka

| Ce qui ne va pas | Ce qu'il veut |
|---|---|
| Trop statique | Plus vivant |
| Trop ancien visuellement | Plus moderne |
| Pas assez dynamique | Plus dynamique |
| Pas fluide | Plus fluide |
| Mauvais sur mobile | Plus beau sur mobile |
| Aucune animation | Animations légères |
| Pas de transitions | Transitions douces |
| Pas de micro-interactions | Micro-interactions propres |
| Images mal mises en valeur | Meilleure mise en valeur des images, logo, galerie, événements |

---

## Sections confirmées

| Section | Statut | Notes |
|---|---|---|
| Messages (sermons) | Confirmé | Vidéos longues → YouTube |
| Enseignements | Confirmé | Textes + audios |
| Annonces | Confirmé | Actualités |
| Audios | Confirmé | Firebase Storage |
| Vidéos | Confirmé | Longues → YouTube · Courtes → Storage |
| Textes | Confirmé | Articles, publications chrétiennes |
| Galerie | Confirmé | ~50 photos + clips courts |
| Événements | Confirmé | Agenda |
| Prière | Confirmé | Formulaire + mur |
| Notifications push | Confirmé | FCM |
| Dons | Confirmé | 4 méthodes, coordonnées réelles reçues |
| À propos | Confirmé | Mission Malachie 4, Actes 2, équipe |
| Contact | Confirmé | Infos directes + formulaire |

---

## Contraintes techniques — confirmées

| Contrainte | Décision |
|---|---|
| Distribution | PWA installable en priorité |
| Play Store / Apple Store | Plus tard, après la PWA |
| Base de données | Firebase |
| Vidéos longues | YouTube obligatoire |
| Vidéos courtes (galerie) | Firebase Storage autorisé, limité |
| Autres médias | Firebase Storage (images, audios) |
| Publication contenu | Denis publie lui-même via l'admin |
| Paiements | Aucune API — liens et instructions manuels |

---

## Contenu encore en attente de Denis

| Élément | Statut |
|---|---|
| Logo (fichier dans `logo et insigne eglise/`) | Disponible localement — à préparer |
| Palette exacte (teintes bleu/blanc) | Partiellement connue — à affiner |
| Histoire de la CIFM4 (FR + EN) | En attente |
| Numéro de téléphone personnel | En attente |
| URL chaîne YouTube | En attente |
| Coordonnées bancaires (virement) | En attente |
| Nom de domaine | En attente |
| Horaires et adresse des cultes | En attente |
| Membres de l'équipe (photos + rôles) | En attente |

---

## Questions ouvertes

- [ ] Ville et pays exact de la communauté
- [ ] Ton du français : `vous` ou `tu` ?
- [ ] Les prières publiques sont-elles modérées avant publication ?
- [ ] Qui d'autre que Denis aura un accès admin (éditeur) ?
- [ ] Date de lancement souhaitée ?
- [ ] Plan Firebase : Spark (gratuit) ou Blaze (pay-as-you-go) ?
- [ ] Reçus fiscaux pour les dons ? Dans quel pays ?
- [ ] Un site existant à migrer ou remplacer ?

---

## Historique des échanges

| Date | Sujet | Ce qui a été décidé |
|---|---|---|
| — | Brief initial | Denis montre Kanguka. Même esprit, modernisation complète. |
| — | Sections | 13 sections confirmées. |
| — | Dons | Stripe refusé. Coordonnées Orange/MTN/PayPal fournies. |
| — | Vidéos | YouTube pour les longues. Storage autorisé pour les courtes (galerie). |
| — | Distribution | PWA d'abord. Play Store/Apple plus tard. |
| — | Identité | Nom officiel : CIFM4. Couleurs : bleu + blanc. |
| — | Réseaux | Facebook confirmé. YouTube et TikTok en attente. |
| — | Assets | Dossiers locaux `immage evenement denis/` et `logo et insigne eglise/` identifiés. |
