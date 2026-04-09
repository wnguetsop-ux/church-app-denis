# SKILL — church-content-structure

## name
church-content-structure

## description
Organisateur du contenu de l'application d'église. Définit la hiérarchie de chaque page, l'ordre des sections, les templates de contenu et les règles de copie bilingue FR/EN.

## mission
Faire en sorte que chaque page communique clairement dès le premier coup d'œil, sur mobile, en français comme en anglais. Le contenu doit guider naturellement le visiteur vers l'action principale de chaque section.

---

## règles

### R1 — Une mission par page
Chaque page répond à une seule question centrale. Si une page tente de répondre à plusieurs questions, elle est à découper.

### R2 — Mobile-first au-dessus du fold
Les 375px visibles sur mobile doivent répondre à : "Qu'est-ce que c'est ? Est-ce pour moi ? Que dois-je faire ?" Sans scroller.

### R3 — Toujours un CTA principal
Chaque page a un bouton ou lien d'action principal, visible sans scroller sur mobile.

### R4 — Français en premier
Rédiger toujours le contenu en français d'abord. L'anglais est une traduction, jamais une création parallèle.

### R5 — Jamais de Lorem Ipsum
Tester uniquement avec le vrai contenu de `content-samples.md`. Si le contenu manque, l'indiquer avec `[À CONFIRMER]`, pas avec du faux texte.

### R6 — Expiration automatique des annonces
Les annonces ont une date `expiresAt`. Après cette date, elles ne s'affichent plus. À prévoir dans la requête Firestore.

### R7 — Dons sans culpabilité
La section dons ne contient aucun texte culpabilisant. Ton chaleureux, positif, axé sur l'impact communautaire.

---

## structure page par page

### Accueil
```
1. Hero         : nom de l'église + tagline + CTA "Voir le dernier message"
2. Dernier sermon : thumbnail + titre + speaker (card large)
3. Annonce urgente : si active, badge bien visible
4. Événements   : 2–3 prochains événements
5. Qui sommes-nous : 2–3 phrases + lien vers À propos
6. Dons         : CTA discret mais présent
7. Prière       : "Nous prions pour vous" + bouton formulaire
```

### Messages (sermons)
```
1. En-tête bilingue
2. Dernier sermon en vedette (grand format, façade YouTube)
3. Filtres : série · speaker · date
4. Liste de cartes : thumbnail 16:9 + titre + speaker + date + série
5. Pagination "Charger plus"
---
Page sermon individuelle :
1. Façade YouTube (pleine largeur mobile)
2. Titre H1 (locale)
3. Speaker · Série · Date · Tags
4. Description complète
5. Bouton Partager
6. Sermons similaires (3 max, même série ou speaker)
```

### Enseignements
```
1. En-tête
2. Onglets : Textes · Audios
3. Cartes par type (icône de format distincte par type)
4. Lecteur audio intégré (pas de redirection)
5. Lecture d'article en plein écran, typo soignée
```

### Annonces
```
1. Annonces urgentes en haut (badge rouge/orange)
2. Annonces normales, ordre chronologique inverse
3. Card : titre + image (si dispo) + résumé + date
4. Annonces expirées : masquées automatiquement
```

### Galerie
```
1. Grille 3 colonnes mobile, 4 colonnes tablet
2. Filtre par album si albums définis
3. Tap → lightbox plein écran avec swipe
4. Caption bilingue dans la lightbox
5. ~50 images — pagination ou scroll infini
```

### Événements
```
1. Événements à venir en premier
2. Card : image + titre + date/heure + lieu
3. Page événement : description + lieu + horaire + inscription
4. Événements passés archivés (accessibles mais pas mis en avant)
```

### Prière
```
1. Intro courte et chaleureuse (2–3 phrases)
2. Formulaire : prénom (optionnel) + demande + option "rendre public"
3. Bouton "Envoyer ma prière"
4. Confirmation visuelle (pas de rechargement de page)
5. Mur de prières : prières publiques + bouton "J'ai prié pour ceci"
```

### Dons
```
1. Titre + message chaleureux court (pas culpabilisant)
2. 4 cartes méthodes :
   - Orange Money : numéro + instructions
   - MTN Money    : numéro + instructions
   - PayPal       : lien + instructions
   - Virement     : IBAN + BIC + instructions
3. Merci visible en bas
```

### À propos
```
1. Histoire de l'église
2. Ce que nous croyons (confession de foi courte)
3. L'équipe (avatars circulaires + noms + rôles)
4. Nos cultes (horaires + adresse)
5. Réseaux sociaux
```

### Contact
```
1. Formulaire : nom + email + message
2. Téléphone cliquable (tel:)
3. Email cliquable (mailto:)
4. Adresse + lien Google Maps
```

---

## contenu en attente de Denis

- [ ] Logo + charte graphique
- [ ] Histoire de l'église (FR + EN)
- [ ] Horaires et adresse des cultes
- [ ] Numéros Orange Money et MTN Money
- [ ] Lien PayPal
- [ ] Coordonnées bancaires (virement)
- [ ] ~50 photos pour la galerie
- [ ] URL chaîne YouTube
- [ ] Numéro de contact

---

## points à surveiller

- **Contenu trop long sur mobile** : les descriptions doivent être tronquées avec "Lire plus" si > 3 lignes dans les cartes.
- **Ton FR vs EN** : le français de l'église peut être formel (`vous`) ou familier (`tu`). Confirmer avec Denis avant de rédiger tout le contenu.
- **Annonces sans image** : la card doit rester propre même sans image. Prévoir une variante texte-only.
- **Prières modérées** : Denis doit pouvoir masquer une prière publique inappropriée depuis l'admin. Prévoir ce bouton.
- **Dons sans confirmation technique** : l'utilisateur envoie l'argent directement via Orange Money etc. L'app ne confirme rien — être honnête sur ce point dans le wording.
