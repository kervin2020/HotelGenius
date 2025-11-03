# 🏨 HotelGenius — Tome 2 : Initialisation Technique et Base de Données

> **Formation pratique complète pour initialiser le monorepo, configurer TypeScript, créer le schéma de base de données avec Drizzle ORM, et générer les migrations PostgreSQL.**

**Style pédagogique :**
- 🎓 **Cours universitaire** — Définitions académiques et concepts théoriques
- 👨🏽‍🏫 **Mentor** — Explications concrètes et analogies
- 🧠 **Ingénierie SaaS** — Patterns avancés et décisions techniques
- 💻 **Code pratique** — Exemples complets prêts à copier-coller
- ⚠️ **Bonnes pratiques** — Conseils d'ingénieur senior

**Prérequis :** Avoir terminé le Tome 1 (compréhension théorique du SaaS et multi-tenancy)

---

## 📋 Table des Matières

1. [Chapitre 1 — Setup Monorepo et Configuration TypeScript](#chapitre-1--setup-monorepo-et-configuration-typescript)
2. [Chapitre 2 — Installation et Configuration des Outils](#chapitre-2--installation-et-configuration-des-outils)
3. [Chapitre 3 — Création du Schéma de Base de Données avec Drizzle](#chapitre-3--création-du-schéma-de-base-de-données-avec-drizzle)
4. [Chapitre 4 — Migrations PostgreSQL et Tests de Connexion](#chapitre-4--migrations-postgresql-et-tests-de-connexion)
5. [Chapitre 5 — Documentation du Modèle de Données](#chapitre-5--documentation-du-modèle-de-données)
6. [Chapitre 6 — Bilan, Exercices et Préparation du Tome 3](#chapitre-6--bilan-exercices-et-préparation-du-tome-3)

---

# Chapitre 1 — Setup Monorepo et Configuration TypeScript

## 🎓 Cours Universitaire — Qu'est-ce qu'un Monorepo ?

### Définition Académique

Un **monorepo** (monolithic repository) est une stratégie de gestion de code où **plusieurs projets interdépendants** sont versionnés dans **un seul dépôt Git**. Contrairement aux **multi-repos** (un dépôt par projet), le monorepo facilite le partage de code, la cohérence des versions et la maintenance.

**Caractéristiques fondamentales :**
1. **Workspace management** : Gestion de plusieurs packages dans un seul repo
2. **Shared dependencies** : Dépendances partagées optimisées
3. **Atomic commits** : Modifications frontend/backend dans un seul commit
4. **Cross-project refactoring** : Refactoring facilité entre projets
5. **Single source of truth** : Un seul point de vérité pour la configuration

### Évolution Historique

**Années 2000 : Multi-repos**
- Un dépôt par projet (frontend, backend, mobile)
- Synchronisation complexe des versions
- Duplication de code

**Depuis 2010 : Monorepos populaires**
- Google utilise un monorepo géant (millions de lignes)
- Facebook, Twitter, Microsoft adoptent cette stratégie
- Outils dédiés : Bazel, Nx, Lerna, pnpm workspaces

**Aujourd'hui : Standard pour projets full-stack TypeScript**
- Partage de types entre frontend/backend
- Build optimisé
- CI/CD simplifié

---

## 👨🏽‍🏫 Mentor — Pourquoi un Monorepo pour HotelGenius ?

### Analogie avec un Immeuble

Imagine un **immeuble avec plusieurs appartements** :

**Multi-repo** = Chaque appartement est dans un bâtiment séparé
- ❌ Pour partager un outil, il faut le copier entre bâtiments
- ❌ Si tu changes la structure d'un bâtiment, les autres ne sont pas affectés (mais tu dois les mettre à jour manuellement)
- ❌ Plus difficile de coordonner les réparations

**Monorepo** = Tous les appartements dans le même immeuble
- ✅ Tu peux partager des outils facilement (ascenseur, concierge)
- ✅ Les modifications structurelles affectent tout l'immeuble de manière cohérente
- ✅ Maintenance simplifiée (une seule adresse)

**Dans HotelGenius :**
- `client/` = Appartement frontend
- `server/` = Appartement backend
- `shared/` = Espaces communs (types, schémas)

### Avantages Concrets

**1. Partage de Types TypeScript**
```typescript
// shared/src/schema.ts
export type Room = { id: string; room_number: string; ... };

// client/src/components/RoomCard.tsx
import { Room } from '@shared/schema'; // ✅ Type partagé

// server/src/routes/rooms.ts
import { Room } from '@shared/schema'; // ✅ Même type
```

**Sans monorepo :** Tu devrais exporter/importer les types via npm packages (plus complexe).

**2. Refactoring Sécurisé**
Si tu renommes `room_number` en `roomNumber` dans le schéma :
- TypeScript te montre **toutes** les utilisations (client + server)
- Un seul commit pour changer tout le code
- Pas de risque d'incohérence

**3. Build Simplifié**
```bash
# Une seule commande pour builder tout
pnpm build
# vs Multi-repo :
# cd frontend && npm build && cd ../backend && npm build
```

---

## 🧠 Ingénierie SaaS — Structure du Monorepo

### Architecture Cible

```
hotelgenius/
├── .git/                          # Dépôt Git
├── .gitignore
├── package.json                   # Root workspace config
├── tsconfig.json                  # TypeScript config root
├── pnpm-workspace.yaml            # Workspaces pnpm
├── drizzle.config.ts              # Config Drizzle ORM
├── .env                           # Variables d'environnement (non commité)
│
├── client/                        # Frontend React
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── lib/
│
├── server/                        # Backend Express
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── db.ts
│       ├── routes/
│       └── middleware/
│
├── shared/                        # Code partagé
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── schema.ts              # Schéma Drizzle
│
├── migrations/                    # Migrations SQL générées
│   └── 0000_initial.sql
│
└── docs/                          # Documentation
    ├── data-model.md
    └── architecture.md
```

### Pourquoi Cette Structure ?

**Séparation claire des responsabilités :**
- `client/` : Seule responsabilité = UI React
- `server/` : Seule responsabilité = API Express
- `shared/` : Seule responsabilité = Types et schémas partagés

**Avantages :**
- ✅ Testabilité : Teste chaque package indépendamment
- ✅ Scalabilité : Peut déployer client et server séparément
- ✅ Clarté : Structure intuitive pour nouveaux développeurs

---

## 💻 Code Pratique — Initialisation Complète

### Étape 1 : Créer le Dépôt Git

```bash
# Créer le dossier du projet
mkdir hotelgenius && cd hotelgenius

# Initialiser Git
git init

# Créer .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.production
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Database
*.db
*.sqlite

# Migrations (on garde les SQL, mais pas les lock files)
migrations/*.lock
EOF
```

**Explication :**
- `node_modules/` : Dépendances installées (ne pas versionner, trop volumineux)
- `.env` : Variables sensibles (secrets, jamais dans Git)
- `dist/`, `build/` : Artéfacts de build (régénérables)
- `*.tsbuildinfo` : Cache TypeScript (pas nécessaire dans Git)

---

### Étape 2 : Initialiser le Workspace pnpm

```bash
# Initialiser package.json root
pnpm init -y
```

**Modifier `package.json` (racine) :**
```json
{
  "name": "hotelgenius",
  "version": "1.0.0",
  "private": true,
  "description": "SaaS multi-tenant de gestion hôtelière avec module restaurant",
  "type": "module",
  "workspaces": [
    "client",
    "server",
    "shared"
  ],
  "scripts": {
    "dev": "pnpm --filter server dev",
    "dev:client": "pnpm --filter client dev",
    "dev:server": "pnpm --filter server dev",
    "dev:all": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "type-check": "pnpm -r type-check",
    "clean": "pnpm -r clean && rm -rf node_modules"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.3"
  }
}
```

**Explication ligne par ligne :**

- `"private": true` : Empêche la publication accidentelle sur npm
- `"type": "module"` : Utilise ES modules (import/export) au lieu de CommonJS
- `"workspaces": [...]` : Déclare les packages du monorepo
- `"dev"` : Lance le serveur en mode développement
- `"dev:all"` : Lance client + server en parallèle
- `"-r"` : Recursive (tous les workspaces)
- `"--parallel"` : Exécute en parallèle

---

### Étape 3 : Créer la Structure de Dossiers

```bash
# Créer les dossiers principaux
mkdir -p client/src/{components,pages,hooks,lib}
mkdir -p server/src/{routes,middleware,db}
mkdir -p shared/src
mkdir -p docs
mkdir migrations
```

**Vérification :**
```bash
tree -L 3  # Si tree installé
# ou
find . -type d -maxdepth 3 | sort
```

---

### Étape 4 : Configuration TypeScript Root

**Fichier : `tsconfig.json` (racine)**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": false,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "incremental": true,
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/src/*"]
    }
  },
  "include": ["client/src/**/*", "server/src/**/*", "shared/src/**/*"],
  "exclude": ["node_modules", "dist", "build", "migrations"]
}
```

**Explication des options critiques :**

- `"strict": true` : Active toutes les vérifications strictes (évite les bugs)
- `"noImplicitAny": true` : Interdit `any` implicite (force le typage)
- `"strictNullChecks": true` : Distingue `string` et `string | null` (sécurité)
- `"paths"` : Permet d'importer avec `@/components` au lieu de chemins relatifs
- `"isolatedModules": true` : Nécessaire pour Vite/esbuild (transpilation rapide)

---

### Étape 5 : Package.json pour Chaque Workspace

**Fichier : `client/package.json`**
```json
{
  "name": "@hotelgenius/client",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist node_modules"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@tanstack/react-query": "^5.60.5",
    "wouter": "^3.3.5",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.7.0",
    "typescript": "^5.6.3",
    "vite": "^5.4.20"
  }
}
```

**Fichier : `server/package.json`**
```json
{
  "name": "@hotelgenius/server",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc && node dist/index.js",
    "start": "node dist/index.js",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist node_modules"
  },
  "dependencies": {
    "express": "^4.21.2",
    "drizzle-orm": "^0.39.1",
    "@neondatabase/serverless": "^0.10.4",
    "zod": "^3.24.2",
    "ws": "^8.18.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.16.11",
    "tsx": "^4.20.5",
    "typescript": "^5.6.3"
  }
}
```

**Fichier : `shared/package.json`**
```json
{
  "name": "@hotelgenius/shared",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist node_modules"
  },
  "dependencies": {
    "drizzle-orm": "^0.39.1",
    "drizzle-zod": "^0.7.0",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "typescript": "^5.6.3"
  }
}
```

**Explication :**
- Préfixe `@hotelgenius/` : Namespace pour éviter les conflits
- `"type": "module"` : Utilise ES modules partout
- Scripts `type-check` : Vérifie TypeScript sans générer de fichiers

---

### Étape 6 : TypeScript Config par Workspace

**Fichier : `client/tsconfig.json`**
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../shared/src/*"]
    }
  },
  "include": ["src/**/*"],
  "references": [{ "path": "../shared" }]
}
```

**Fichier : `server/tsconfig.json`**
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "lib": ["ES2022"],
    "types": ["node"],
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["../shared/src/*"]
    }
  },
  "include": ["src/**/*"],
  "references": [{ "path": "../shared" }]
}
```

**Fichier : `shared/tsconfig.json`**
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

**Explication :**
- `"extends": "../tsconfig.json"` : Hérite de la config root (DRY principle)
- `"references"` : Project references TypeScript (meilleure performance)
- `"paths"` : Permet les imports avec `@/` et `@shared/`

---

## ⚠️ Bonnes Pratiques — Configuration

### 1. Toujours Utiliser TypeScript Strict

**Pourquoi ?**
- Détecte les bugs à la compilation, pas en production
- Force le typage explicite (moins de `any`)
- Améliore la maintenabilité

**Règle d'or :** Si TypeScript se plaint, c'est probablement un vrai problème.

### 2. Versionner les Configs, Pas les node_modules

**Fichier : `.gitignore`**
```gitignore
node_modules/  # ✅ Ne pas versionner
package-lock.json  # ✅ pnpm utilise pnpm-lock.yaml
```

**Pourquoi ?**
- `node_modules/` = 100+ MB (inutile dans Git)
- Les dépendances sont réinstallables via `pnpm install`
- Git serait très lent avec node_modules

### 3. Utiliser des Workspace Namespaces

**Bon :**
```json
{
  "name": "@hotelgenius/client"
}
```

**Mauvais :**
```json
{
  "name": "client"  // Risque de conflit avec un package npm réel
}
```

---

## ✅ Checkpoint Chapitre 1

**Tests à effectuer :**

1. **Structure créée :**
```bash
ls -R | head -20  # Vérifier la structure
```

2. **Installation :**
```bash
pnpm install
# Doit installer les dépendances sans erreurs
```

3. **TypeScript :**
```bash
pnpm type-check
# Doit compiler sans erreurs
```

4. **Git :**
```bash
git status
# Doit montrer les fichiers non commités
```

**Si tout fonctionne → Chapitre 2 !** 🎉

---

# Chapitre 2 — Installation et Configuration des Outils

## 🎓 Cours Universitaire — Gestionnaires de Paquets Modernes

### Définition : pnpm vs npm vs yarn

**npm** (Node Package Manager) : Gestionnaire de paquets officiel de Node.js, utilise un système de copie plate.

**yarn** : Alternative à npm développée par Facebook, utilise des liens symboliques.

**pnpm** : Gestionnaire rapide qui utilise un store global avec des liens hard, évitant la duplication.

**Comparaison :**
| Critère | npm | yarn | pnpm |
|---------|-----|------|------|
| Vitesse | Moyenne | Rapide | **Très rapide** |
| Espace disque | Élevé (duplication) | Moyen | **Faible** (store global) |
| Workspaces | ✅ Supporté | ✅ Supporté | ✅ **Excellente implémentation** |
| Strictness | Moyen | Élevé | **Très élevé** |

**Pourquoi pnpm pour HotelGenius ?**
- ✅ Plus rapide (2-3x plus rapide que npm)
- ✅ Économise l'espace disque (store global partagé)
- ✅ Meilleur support des workspaces
- ✅ Plus strict (détecte les dépendances invalides)

---

## 👨🏽‍🏫 Mentor — Installation des Outils

### Checklist Préalable

**Vérifier les versions :**
```bash
node --version   # Doit être >= 18.0.0
npm --version    # Vient avec Node.js
```

**Si Node.js n'est pas installé :**
- **macOS** : `brew install node@18`
- **Linux** : `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`
- **Windows** : Télécharger depuis [nodejs.org](https://nodejs.org)

### Installation de pnpm

```bash
# Méthode recommandée (via npm)
npm install -g pnpm

# Vérification
pnpm --version  # Doit afficher >= 8.0.0
```

**Alternative (standalone) :**
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

---

## 🧠 Ingénierie SaaS — Configuration PostgreSQL

### Options d'Hébergement

**1. Neon (Serverless PostgreSQL) — Recommandé pour début**
- ✅ Gratuit (tier gratuit généreux)
- ✅ Setup en 5 minutes
- ✅ Pas besoin d'installer PostgreSQL localement
- ✅ Auto-scaling
- ✅ Backups automatiques

**2. Supabase**
- ✅ Alternative à Neon
- ✅ Interface graphique excellente
- ✅ Fonctionnalités supplémentaires (auth, storage)

**3. PostgreSQL Local**
- ✅ Contrôle total
- ✅ Gratuit (mais setup plus complexe)
- ⚠️ Doit gérer les backups manuellement

**4. Railway / Render**
- ✅ Hébergement PostgreSQL managé
- ✅ Intégration facile avec déploiement

### Setup Neon (Recommandé)

**Étapes :**

1. Créer un compte sur [neon.tech](https://neon.tech)
2. Créer un nouveau projet → "HotelGenius"
3. Copier la connection string (exemple) :
   ```
   postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
4. Créer `.env` à la racine :
   ```env
   DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   PORT=5000
   NODE_ENV=development
   ```

**⚠️ Important :** Ne jamais commiter `.env` dans Git (déjà dans `.gitignore`)

---

## 💻 Code Pratique — Configuration Vite (Client)

**Fichier : `client/vite.config.ts`**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

**Explication :**
- `alias` : Permet d'importer avec `@/components` au lieu de `../../components`
- `proxy` : Redirige `/api/*` vers le backend Express (évite CORS en dev)

**Fichier : `client/index.html`**
```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HotelGenius</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Fichier : `client/src/main.tsx`**
```typescript
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(<App />);
```

**Fichier : `client/src/App.tsx`**
```typescript
export default function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>🏨 HotelGenius</h1>
      <p>Monorepo configuré avec succès !</p>
      <p>Client React fonctionnel ✅</p>
    </div>
  );
}
```

**Fichier : `client/src/index.css`**
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
}
```

---

## 💻 Code Pratique — Configuration Express (Server)

**Fichier : `server/src/index.ts`**
```typescript
import express from 'express';

const app = express();
const port = process.env.PORT || 5000;

// Middleware pour parser JSON
app.use(express.json());

// Route de santé
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'HotelGenius API',
    timestamp: new Date().toISOString(),
  });
});

// Route API exemple
app.get('/api/test', (_req, res) => {
  res.json({ message: 'API fonctionnelle !' });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
});
```

**Tester :**
```bash
cd server
pnpm dev
# Devrait afficher "🚀 Server running..."
# Tester http://localhost:5000/health
```

---

## ⚠️ Bonnes Pratiques — Outils

### 1. Toujours Utiliser des Versions Exactes pour les Dépendances Critiques

**Bon :**
```json
{
  "dependencies": {
    "drizzle-orm": "^0.39.1"  // ^ = accepte les versions mineures
  }
}
```

**Meilleur (pour production) :**
```json
{
  "dependencies": {
    "drizzle-orm": "0.39.1"  // Version exacte (reproductibilité)
  }
}
```

**Compromis :**
- Utiliser `^` en développement (mises à jour automatiques)
- Utiliser versions exactes en production (stabilité)

### 2. Documenter les Versions Node.js Requises

**Fichier : `.nvmrc` (optionnel, si tu utilises nvm)**
```
18.20.0
```

**Dans `package.json` :**
```json
{
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

---

## ✅ Checkpoint Chapitre 2

**Tests à effectuer :**

1. **Client démarre :**
```bash
cd client
pnpm dev
# Ouvrir http://localhost:5173
# Doit afficher "HotelGenius - Monorepo configuré avec succès !"
```

2. **Server démarre :**
```bash
cd server
pnpm dev
# Tester http://localhost:5000/health
# Doit retourner {"status":"ok",...}
```

3. **TypeScript compile :**
```bash
pnpm type-check
# Doit passer sans erreurs
```

**Si tout fonctionne → Chapitre 3 (Base de données) !** 🎉

---

*[Le guide continue avec les Chapitres 3-6 couvrant le schéma Drizzle complet, les migrations, et la documentation...]*

---

**Note :** Ce Tome 2 couvre les Sprints 1-2 (Setup + Base de données). Le Tome 3 couvrira le Backend (Sprint 3), le Tome 4 le Frontend (Sprint 4), etc.

