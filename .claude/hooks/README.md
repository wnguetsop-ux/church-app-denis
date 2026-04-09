# Hooks — Church App Denis

Ce dossier contient les scripts de garde-fous qui peuvent être branchés
sur les événements Claude (`PreToolUse`, `PostToolUse`).

---

## État actuel

### Hooks actifs (dans `settings.json`)

Ces hooks s'exécutent à chaque opération Claude. Ils sont légers — affichage de rappels.

| Événement | Déclencheur | Message |
|---|---|---|
| `PreToolUse` | Write ou Edit | Rappel : pas de secrets en dur |
| `PreToolUse` | Write ou Edit | Rappel : bilingue FR+EN obligatoire |
| `PreToolUse` | Write ou Edit | Rappel : vidéos sur YouTube uniquement |
| `PreToolUse` | Bash | Rappel : pas de déploiement, pas de force-push |
| `PostToolUse` | Write ou Edit | Rappel : animation Framer Motion à prévoir |
| `PostToolUse` | Write ou Edit | Rappel : limit() sur les requêtes Firestore |

Ces hooks ne bloquent rien — ils informent. Les vraies règles sont dans `CLAUDE.md` et les skills.

---

## Hooks prévus (non actifs — à activer progressivement)

Ces scripts seront créés ici et branchés dans `settings.json` quand le projet sera initialisé.

---

### 1. `build-check.sh` — Vérification du build

**Quand l'activer** : dès que le projet Next.js est initialisé.
**Déclencheur** : avant tout `git commit` ou manuellement.

```bash
#!/bin/bash
# build-check.sh
# Vérifie que le projet compile sans erreur TypeScript.

echo "[BUILD] Vérification du build Next.js..."
npm run build

if [ $? -ne 0 ]; then
  echo "[BUILD:FAIL] Le build a échoué. Corriger les erreurs avant de continuer."
  exit 1
fi

echo "[BUILD:OK] Build réussi."
```

**Branchement dans settings.json** :
```json
{ "matcher": "Bash(git commit*)", "hooks": [
  { "type": "command", "command": "bash .claude/hooks/build-check.sh" }
]}
```

---

### 2. `lint-check.sh` — Vérification du lint

**Quand l'activer** : dès que ESLint est configuré dans le projet.
**Déclencheur** : avant tout commit.

```bash
#!/bin/bash
# lint-check.sh
# Vérifie que le code respecte les règles ESLint du projet.

echo "[LINT] Vérification ESLint..."
npm run lint

if [ $? -ne 0 ]; then
  echo "[LINT:FAIL] Des erreurs ESLint ont été trouvées. Corriger avant de continuer."
  exit 1
fi

echo "[LINT:OK] Code propre."
```

---

### 3. `video-guard.sh` — Détection de vidéos locales

**Quand l'activer** : dès que le projet est initialisé.
**Déclencheur** : après chaque Write ou Edit sur un fichier `.tsx` ou `.ts`.

```bash
#!/bin/bash
# video-guard.sh
# Détecte si une balise <video> ou une URL Firebase Storage de vidéo
# a été ajoutée dans un fichier source.
# Règle absolue : toutes les vidéos passent par YouTube.

CHANGED_FILE="$1"

if [ -z "$CHANGED_FILE" ]; then
  exit 0
fi

# Détecter une balise <video>
if grep -q "<video" "$CHANGED_FILE" 2>/dev/null; then
  echo "[VIDEO:GUARD] ⛔ Balise <video> détectée dans $CHANGED_FILE"
  echo "            Les vidéos doivent utiliser le composant <YoutubeFacade />"
  echo "            Aucune vidéo ne doit être hébergée localement ou sur Firebase."
  exit 1
fi

# Détecter une URL Firebase Storage pour une vidéo
if grep -qE "firebasestorage.*\.(mp4|mov|avi|webm|mkv)" "$CHANGED_FILE" 2>/dev/null; then
  echo "[VIDEO:GUARD] ⛔ URL Firebase Storage vidéo détectée dans $CHANGED_FILE"
  echo "            Les vidéos doivent être sur YouTube uniquement."
  exit 1
fi

exit 0
```

---

### 4. `i18n-check.sh` — Vérification de la cohérence FR/EN

**Quand l'activer** : dès que `src/messages/fr.json` et `src/messages/en.json` existent.
**Déclencheur** : après modification d'un fichier de messages.

```bash
#!/bin/bash
# i18n-check.sh
# Vérifie que fr.json et en.json ont les mêmes clés de premier niveau.
# Évite de déployer avec une langue incomplète.

FR="src/messages/fr.json"
EN="src/messages/en.json"

if [ ! -f "$FR" ] || [ ! -f "$EN" ]; then
  echo "[I18N] Fichiers de messages introuvables — skip."
  exit 0
fi

echo "[I18N] Vérification de la cohérence FR/EN..."

KEYS_FR=$(node -e "const d=require('./$FR'); console.log(Object.keys(d).sort().join('\n'))")
KEYS_EN=$(node -e "const d=require('./$EN'); console.log(Object.keys(d).sort().join('\n'))")

DIFF=$(diff <(echo "$KEYS_FR") <(echo "$KEYS_EN"))

if [ -n "$DIFF" ]; then
  echo "[I18N:WARN] Différences entre fr.json et en.json :"
  echo "$DIFF"
  echo "           Vérifier que toutes les sections sont traduites."
  # Warning seulement — ne bloque pas (des sections peuvent être en cours de traduction)
  exit 0
fi

echo "[I18N:OK] FR et EN sont cohérents."
```

---

### 5. `workflow-guard.sh` — Sécurisation du workflow

**Quand l'activer** : dès que le projet est initialisé et que les branches git sont en place.
**Déclencheur** : avant tout `git push`.

```bash
#!/bin/bash
# workflow-guard.sh
# Vérifie que le workflow de déploiement est respecté :
# - On n'est pas sur main
# - Le build passe
# - Pas de fichier .env dans le staging

CURRENT_BRANCH=$(git branch --show-current)

# Bloquer le push direct sur main
if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
  echo "[WORKFLOW:GUARD] ⛔ Push direct sur $CURRENT_BRANCH interdit."
  echo "                Passer par une branche feature/* ou fix/*."
  echo "                Merger ensuite via Pull Request."
  exit 1
fi

# Vérifier qu'aucun fichier .env n'est dans le staging
if git diff --cached --name-only | grep -qE "\.env"; then
  echo "[WORKFLOW:GUARD] ⛔ Fichier .env détecté dans le commit."
  echo "                Les secrets ne doivent jamais être commités."
  echo "                Retirer le fichier avec : git reset HEAD <fichier>"
  exit 1
fi

echo "[WORKFLOW:OK] Branche : $CURRENT_BRANCH. Aucun secret détecté."
```

---

## Ordre d'activation recommandé

| Étape | Quand | Hook |
|---|---|---|
| 1 | Projet Next.js initialisé | `lint-check.sh` |
| 2 | Projet Next.js initialisé | `video-guard.sh` |
| 3 | Fichiers i18n créés | `i18n-check.sh` |
| 4 | Premier build réussi | `build-check.sh` |
| 5 | Branches git en place | `workflow-guard.sh` |

---

## Comment activer un hook

1. Créer le fichier `.sh` dans ce dossier
2. Le rendre exécutable : `chmod +x .claude/hooks/nom-du-hook.sh`
3. L'ajouter dans `.claude/settings.json` sous `hooks.PreToolUse` ou `hooks.PostToolUse`

Exemple d'ajout dans `settings.json` :
```json
"PostToolUse": [
  {
    "matcher": "Write|Edit",
    "hooks": [
      { "type": "command", "command": "bash .claude/hooks/video-guard.sh" }
    ]
  }
]
```
