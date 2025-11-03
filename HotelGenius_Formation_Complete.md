# HotelGenius — Formation complète pour construire un SaaS multi-tenant de zéro à la production

> **Guide d'apprentissage extrêmement complet et pédagogique pour reconstruire HotelGenius depuis zéro**

**Langue :** Français (avec termes techniques en anglais quand approprié)  
**Style :** Mentor patient expliquant « pourquoi » avant « comment »  
**Approche :** Formation active — tu construis pendant que tu apprends

---

## 📋 Table des Matières

1. [Introduction — Vision, Objectifs, Outils Nécessaires](#1-introduction--vision-objectifs-outils-nécessaires)
2. [Planification — Analyse du Domaine, Modélisation, Architecture](#2-planification--analyse-du-domaine-modélisation-architecture)
3. [Sprint 1 — Création du Monorepo, Configuration Initiale](#3-sprint-1--création-du-monorepo-configuration-initiale)
4. [Sprint 2 — Conception et Base de Données (PostgreSQL + Drizzle ORM)](#4-sprint-2--conception-et-base-de-données-postgresql--drizzle-orm)
5. [Sprint 3 — Backend Express (Auth, Routes CRUD, Multi-tenant, Validations)](#5-sprint-3--backend-express-auth-routes-crud-multi-tenant-validations)
6. [Sprint 4 — Frontend React (Vite, Tailwind, TanStack Query, shadcn/ui)](#6-sprint-4--frontend-react-vite-tailwind-tanstack-query-shadcnui)
7. [Sprint 5 — Intégration Front/Back, Tests, Gestion des Erreurs](#7-sprint-5--intégration-frontback-tests-gestion-des-erreurs)
8. [Sprint 6 — Sécurité Avancée, CI/CD, Déploiement](#8-sprint-6--sécurité-avancée-cicd-déploiement)
9. [Sprint 7 — Maintenance, Monitoring, Logs, Sauvegardes](#9-sprint-7--maintenance-monitoring-logs-sauvegardes)
10. [Sprint 8 — Scalabilité et Optimisation](#10-sprint-8--scalabilité-et-optimisation)
11. [Résumé des Connaissances Acquises](#11-résumé-des-connaissances-acquises)

---

# 1. Introduction — Vision, Objectifs, Outils Nécessaires

## 🎯 Objectif du Guide

Ce guide est conçu pour t'accompagner pas-à-pas dans la reconstruction complète de **HotelGenius**, un SaaS multi-tenant de gestion hôtelière avec module restaurant intégré.

**Ce que tu vas apprendre :**
- ✅ Architecture d'un SaaS multi-tenant de A à Z
- ✅ Stack moderne full-stack TypeScript (React + Express + PostgreSQL)
- ✅ Patterns de conception et bonnes pratiques
- ✅ Sécurité, tests, déploiement, monitoring
- ✅ Scalabilité et optimisation pour la production

**Approche pédagogique :**
Chaque section commence par expliquer **pourquoi** (concepts théoriques), puis **comment** (code pratique). Tu construis pendant que tu apprends, avec du code exact à copier-coller et des explications ligne par ligne.

---

## 🧠 Vision du Projet HotelGenius

HotelGenius est une plateforme SaaS qui permet à plusieurs hôtels de gérer leurs opérations (chambres, réservations, restaurant, inventaire) depuis une seule application.

**Caractéristiques principales :**
1. **Multi-tenant** : Chaque hôtel est isolé dans ses données
2. **Modules intégrés** : Hôtel + Restaurant dans une seule app
3. **Rôles utilisateurs** : Owner, Receptionist, Restaurant Staff, Super Admin
4. **Monétisation** : Plans d'abonnement (Basic, Pro, Enterprise) via Stripe

**Stack technique choisie :**
- **Monorepo TypeScript** : Code partagé entre frontend/backend
- **PostgreSQL + Drizzle ORM** : Base de données relationnelle type-safe
- **Express.js** : Backend API RESTful
- **React + Vite** : Frontend moderne avec HMR ultra-rapide
- **TailwindCSS + shadcn/ui** : Design system cohérent
- **TanStack Query** : Gestion d'état serveur avec cache intelligent

---

## 🛠️ Outils Nécessaires

### Installation Requise

**1. Node.js et Package Manager**
```bash
# Vérifier Node.js (version 18+)
node --version

# Installer Bun (recommandé pour ce projet) ou utiliser npm/pnpm
# Bun est plus rapide et supporte TypeScript nativement
curl -fsSL https://bun.sh/install | bash
```

**Alternative avec npm/pnpm :**
```bash
# Avec npm (vient avec Node.js)
npm install -g pnpm  # Recommandé
# ou utiliser npm directement
```

**2. Base de données PostgreSQL**

**Option A : Neon (Serverless PostgreSQL — Recommandé pour début)**
- Créer un compte sur [neon.tech](https://neon.tech)
- Créer un nouveau projet
- Copier la `DATABASE_URL` fournie

**Option B : PostgreSQL Local**
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Créer une base de données
createdb hotelgenius
```

**3. Éditeur de Code**
- **VS Code** (recommandé) avec extensions :
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense

**4. Outils Optionnels mais Recommandés**
- **Git** : Gestion de version
- **Postman** ou **Thunder Client** : Tester les API
- **DBeaver** ou **TablePlus** : Visualiser la base de données
- **GitHub Account** : Pour CI/CD et déploiement

---

## 📚 Prérequis Connaissance

**Niveau requis :**
- Connaissances de base en JavaScript/TypeScript
- Notions de React (hooks, composants)
- Compréhension basique des bases de données relationnelles (tables, relations)
- Familiarité avec Git

**Ce guide va t'apprendre :**
- Architecture SaaS multi-tenant
- ORM (Object-Relational Mapping) avec Drizzle
- Authentification JWT et sécurité
- Testing et CI/CD
- Déploiement cloud

---

## 🗺️ Structure du Guide

Le guide est organisé en **8 sprints** (modules), chacun avec :

1. **🎯 Objectif** : Ce que tu vas accomplir
2. **🧠 Concepts** : Théorie et définitions
3. **⚙️ Étapes pratiques** : Code à écrire avec explications
4. **💡 Astuce** : Conseils pratiques
5. **✅ Checkpoint** : Vérification de compréhension

**Durée estimée :**
- **Sprint 1-2** : Fondations (Semaine 1)
- **Sprint 3-4** : Backend + Frontend (Semaine 2-3)
- **Sprint 5-6** : Intégration + Déploiement (Semaine 4)
- **Sprint 7-8** : Production + Scalabilité (Semaine 5-6)

**Tu peux suivre à ton rythme** — adapte selon ta disponibilité.

---

# 2. Planification — Analyse du Domaine, Modélisation, Architecture

## 🎯 Objectif

Comprendre le domaine métier, modéliser les données, et choisir une architecture adaptée pour un SaaS multi-tenant scalable.

---

## 🧠 Concepts Clés

### Qu'est-ce qu'un SaaS Multi-Tenant ?

**SaaS** = Software as a Service : application hébergée dans le cloud, accessible via navigateur.

**Multi-tenant** : Plusieurs clients (tenants) partagent la même instance de l'application, mais leurs données sont isolées.

**Exemple concret :**
- HotelGenius héberge 100 hôtels
- Chaque hôtel voit seulement SES données (chambres, réservations)
- Isolation garantie par un `hotel_id` sur chaque table

**Avantages :**
- ✅ Coût d'infrastructure réduit (une seule DB)
- ✅ Maintenance simplifiée (mises à jour pour tous)
- ✅ Scalabilité horizontale

**Défis :**
- ⚠️ Isolation stricte des données (sécurité critique)
- ⚠️ Performance (indexation sur `hotel_id`)
- ⚠️ Customisation par tenant (limite)

---

### Stratégies d'Isolation Multi-Tenant

**1. Shared Database, Shared Schema (choisi pour HotelGenius)**
```
Base de données unique, toutes les tables contiennent hotel_id
```
- ✅ Simple à maintenir
- ✅ Scalable jusqu'à milliers de tenants
- ⚠️ Requiert toujours filtrer par `hotel_id` (sécurité)

**2. Shared Database, Separate Schemas**
```
Base unique, mais un schéma PostgreSQL par tenant
```
- ✅ Isolation plus forte
- ⚠️ Complexité de gestion (100 schémas = complexe)
- ⚠️ Limité à PostgreSQL

**3. Separate Databases**
```
Une base de données par tenant
```
- ✅ Isolation maximale
- ❌ Coût élevé (100 DB = cher)
- ❌ Maintenance complexe

**Choix pour HotelGenius :** Stratégie 1 (Shared DB, Shared Schema) — le meilleur équilibre.

---

### Architecture Monorepo Full-Stack

**Monorepo** = Un seul dépôt Git contenant plusieurs projets.

**Structure choisie :**
```
HotelGenius/
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Code partagé (schémas, types)
└── Configuration   # Vite, TypeScript, etc.
```

**Pourquoi cette architecture ?**
- ✅ Partage de types TypeScript entre frontend/backend
- ✅ Build simplifié (une commande)
- ✅ Déploiement cohérent
- ✅ Type-safety end-to-end

---

## ⚙️ Analyse du Domaine Métier

### Entités Principales

**1. Hotel (Tenant Principal)**
- Informations de l'hôtel (nom, adresse, devise)
- Plan d'abonnement (Basic/Pro/Enterprise)
- Statut (active, suspended)

**2. User (Utilisateurs)**
- Employés de l'hôtel
- Rôles : owner, receptionist, restaurant_staff, super_admin
- Authentification (email/password)

**3. Room (Chambres)**
- Numéro, type, capacité
- Prix par nuit
- Statut (available, occupied, cleaning, maintenance)

**4. Client (Clients)**
- Informations des clients récurrents
- Historique de réservations

**5. Reservation (Réservations)**
- Lien : Client → Room
- Dates check-in/check-out
- Statut : pending, confirmed, checked_in, checked_out, cancelled

**6. Payment (Paiements)**
- Paiement lié à une réservation
- Méthode (cash, card, stripe)
- Statut : pending, completed, failed

**7. Product (Produits Restaurant)**
- Plats du menu
- Catégorie, prix
- Disponibilité

**8. InventoryItem (Inventaire)**
- Stock des produits
- Quantité actuelle, seuil d'alerte
- Unité (kg, bouteille, etc.)

**9. Sale (Ventes Restaurant)**
- Vente d'un produit
- Lien optionnel à une réservation (facturation au séjour)
- Employé qui a vendu

---

### Relations Entre Entités

**Diagramme textuel simplifié :**

```
Hotel (1) ──── (N) User
Hotel (1) ──── (N) Room
Hotel (1) ──── (N) Client
Hotel (1) ──── (N) Reservation
Hotel (1) ──── (N) Product
Hotel (1) ──── (N) InventoryItem

Room (1) ──── (N) Reservation
Client (1) ──── (N) Reservation
Reservation (1) ──── (N) Payment

Product (1) ──── (N) InventoryItem
Product (1) ──── (N) Sale
Reservation (0..1) ──── (N) Sale  (optionnel : facturer au séjour)
```

**Explication :**
- Un Hotel a plusieurs Rooms, Users, Clients, etc.
- Une Reservation appartient à un Client ET une Room
- Une Sale peut être liée à une Reservation (facturation au séjour)

---

## ⚙️ Architecture Technique Choisie

### Stack Complète

**Frontend :**
- React 18 (UI)
- Vite (build tool ultra-rapide)
- TailwindCSS (styling)
- shadcn/ui (composants accessibles)
- TanStack Query (data fetching + cache)
- Wouter (routing léger)

**Backend :**
- Express.js (API REST)
- Drizzle ORM (type-safe database queries)
- PostgreSQL (base de données)
- Neon Serverless (hébergement DB)

**Shared :**
- TypeScript (types partagés)
- Zod (validation runtime)
- Drizzle Schemas (définition tables)

**Infrastructure :**
- Railway / Vercel (déploiement)
- GitHub Actions (CI/CD)
- Sentry (monitoring)
- Stripe (paiements)

---

### Pourquoi Ces Choix ?

**TypeScript partout :**
- Type-safety de bout en bout
- Autocomplétion IDE
- Moins de bugs en production

**Drizzle ORM :**
- Plus léger que Prisma
- Type-safe (TypeScript)
- SQL-like (contrôle fin)
- Migrations automatiques

**TanStack Query (au lieu de Redux) :**
- Meilleur pour données serveur
- Cache automatique
- Refetch intelligent
- Optimistic updates faciles

**Vite :**
- 10x plus rapide que Webpack
- HMR instantané
- Build optimisé

---

## 📊 Diagramme d'Architecture Global

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  React App (Vite)                                 │   │
│  │  - Pages (Dashboard, Rooms, Reservations...)      │   │
│  │  - Components (shadcn/ui)                         │   │
│  │  - TanStack Query (API calls + cache)             │   │
│  └──────────────────┬────────────────────────────────┘   │
└─────────────────────┼─────────────────────────────────────┘
                      │ HTTP/REST API
                      │ (fetch avec credentials)
┌─────────────────────┼─────────────────────────────────────┐
│              SERVER (Express.js)                           │
│  ┌──────────────────┴──────────────────────────────────┐   │
│  │  Routes API (/api/*)                                 │   │
│  │  - Auth (register, login, JWT)                        │   │
│  │  - CRUD (rooms, reservations, clients...)             │   │
│  │  - Multi-tenant middleware (hotel_id isolation)      │   │
│  │  - Validation (Zod)                                   │   │
│  └──────────────────┬──────────────────────────────────┘   │
│                     │                                        │
│  ┌──────────────────▼──────────────────────────────────┐   │
│  │  Storage Layer (DatabaseStorage)                     │   │
│  │  - CRUD operations avec Drizzle ORM                   │   │
│  │  - Multi-tenant filtering automatique                │   │
│  └──────────────────┬──────────────────────────────────┘   │
└─────────────────────┼─────────────────────────────────────┘
                      │ SQL (via Drizzle)
┌─────────────────────┼─────────────────────────────────────┐
│         DATABASE (PostgreSQL - Neon Serverless)             │
│  ┌──────────────────▼──────────────────────────────────┐   │
│  │  Tables:                                             │   │
│  │  - hotels, users, rooms, reservations, clients        │   │
│  │  - products, inventory_items, sales                    │   │
│  │  - payments, invoices                                │   │
│  │  (Toutes avec hotel_id pour isolation)               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Flux typique (exemple : créer une réservation) :**

1. User clique "New Reservation" dans React
2. Formulaire validé (Zod côté client)
3. `POST /api/reservations` avec données + JWT token
4. Express route vérifie JWT → extrait `hotel_id`
5. Validation Zod côté serveur
6. DatabaseStorage crée réservation avec `hotel_id` automatique
7. Drizzle génère SQL : `INSERT INTO reservations (...) VALUES (...) WHERE hotel_id = ?`
8. Réponse JSON retournée
9. TanStack Query met à jour le cache
10. UI se met à jour automatiquement

---

## 💡 Astuce : Organisation des Issues GitHub

Pour chaque sprint, crée des issues GitHub avec ce format :

**Titre :** `[Sprint X] Description courte`

**Description :**
```markdown
## Objectif
[Ce que cette issue va accomplir]

## Tâches
- [ ] Tâche 1
- [ ] Tâche 2

## Critères d'Acceptation
- [ ] Checklist de validation

## Notes techniques
[Informations pertinentes]
```

**Exemple pour Sprint 1 :**
```
Titre: [Sprint 1] Setup monorepo + TypeScript configuration

Description:
## Objectif
Initialiser le monorepo avec workspaces et configurer TypeScript pour client/server/shared.

## Tâches
- [ ] Créer structure dossiers (client/, server/, shared/)
- [ ] Configurer package.json avec workspaces
- [ ] Setup TypeScript (tsconfig.json)
- [ ] Installer dépendances de base

## Critères d'Acceptation
- [ ] `pnpm install` fonctionne sans erreurs
- [ ] TypeScript compile sans erreurs
- [ ] Structure conforme au guide
```

---

## ✅ Checkpoint Planification

**Vérifie ta compréhension :**

1. **Qu'est-ce qu'un SaaS multi-tenant ?**  
   → Réponse : Application partagée où plusieurs clients utilisent la même instance, mais leurs données sont isolées.

2. **Pourquoi avons-nous choisi "Shared Database, Shared Schema" ?**  
   → Réponse : Bon équilibre entre simplicité, coût et scalabilité.

3. **Quel est l'avantage d'un monorepo ?**  
   → Réponse : Partage de types TypeScript, build simplifié, type-safety end-to-end.

4. **Quelle relation existe entre Reservation, Room et Client ?**  
   → Réponse : Une Reservation appartient à un Client (N:1) ET à une Room (N:1).

**Si toutes les réponses sont claires, passe au Sprint 1 !** 🚀

---

# 3. Sprint 1 — Création du Monorepo, Configuration Initiale

## 🎯 Objectif

Créer la structure du monorepo, configurer TypeScript, installer les outils de base, et avoir un environnement de développement fonctionnel.

**Livrables :**
- ✅ Monorepo initialisé avec workspaces
- ✅ TypeScript configuré pour client/server/shared
- ✅ Scripts npm/pnpm fonctionnels
- ✅ Structure de dossiers conforme

**Durée estimée :** 1-2 jours

---

## 🧠 Concepts : Monorepo et Workspaces

### Qu'est-ce qu'un Workspace ?

**Workspace** = Gestion de plusieurs packages dans un seul dépôt.

**Avantages :**
- ✅ Partage de code entre projets
- ✅ Installation de dépendances optimisée
- ✅ Versioning cohérent
- ✅ Build simplifié

**Exemple :**
```
monorepo/
├── package.json (root)
├── client/
│   └── package.json
├── server/
│   └── package.json
└── shared/
    └── package.json
```

**Package manager supportant workspaces :**
- `pnpm` (recommandé — plus rapide)
- `npm` (v7+)
- `yarn` (v1+)

---

### Pourquoi TypeScript Strict ?

**Mode strict TypeScript** = Vérifications supplémentaires qui empêchent les bugs.

**Options importantes :**
```json
{
  "strict": true,              // Active toutes les vérifications strictes
  "noImplicitAny": true,       // Interdit 'any' implicite
  "strictNullChecks": true,    // Vérifie null/undefined
  "noUnusedLocals": true       // Erreur si variable non utilisée
}
```

**Avantages :**
- ✅ Bugs détectés à la compilation, pas en production
- ✅ Code plus sûr et prévisible
- ✅ Refactoring facilité

---

## ⚙️ Étapes Pratiques

### Étape 1 : Initialiser le Dépôt Git

```bash
# Créer le dossier du projet
mkdir HotelGenius
cd HotelGenius

# Initialiser Git
git init

# Créer .gitignore
```

**Fichier : `.gitignore`**
```gitignore
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

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# OS
.DS_Store
Thumbs.db

# Database
*.db
*.sqlite
```

---

### Étape 2 : Créer la Structure de Dossiers

```bash
# Créer les dossiers principaux
mkdir -p client/src/{components,pages,hooks,lib}
mkdir -p server/src
mkdir -p shared/src

# Créer les fichiers de base
touch package.json
touch tsconfig.json
touch README.md
```

**Structure finale attendue :**
```
HotelGenius/
├── .gitignore
├── package.json          # Root workspace
├── tsconfig.json         # TypeScript config root
├── README.md
├── client/
│   ├── package.json
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── lib/
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── index.ts
└── shared/
    ├── package.json
    ├── tsconfig.json
    └── src/
        └── schema.ts
```

---

### Étape 3 : Configurer le Package.json Root

**Fichier : `package.json` (racine)**
```json
{
  "name": "hotelgenius",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "SaaS multi-tenant de gestion hôtelière avec module restaurant",
  "workspaces": [
    "client",
    "server",
    "shared"
  ],
  "scripts": {
    "dev": "pnpm --filter server dev",
    "build": "pnpm -r build",
    "type-check": "pnpm -r type-check",
    "clean": "pnpm -r clean && rm -rf node_modules"
  },
  "devDependencies": {
    "typescript": "^5.6.3"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

**Explication :**
- `workspaces` : Déclare les packages du monorepo
- `"type": "module"` : Utilise ES modules (import/export)
- Scripts : Commandes à la racine qui lancent dans tous les workspaces

---

### Étape 4 : Configurer TypeScript Root

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
  "exclude": ["node_modules", "dist", "build"]
}
```

**Points clés :**
- `strict: true` : Active toutes les vérifications strictes
- `paths` : Permet d'importer avec `@/components` et `@shared/schema`
- `isolatedModules: true` : Nécessaire pour Vite/esbuild

---

### Étape 5 : Créer les Package.json des Workspaces

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
    "type-check": "tsc --noEmit"
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
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "express": "^4.21.2",
    "drizzle-orm": "^0.39.1",
    "zod": "^3.24.2"
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
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "drizzle-orm": "^0.39.1",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "typescript": "^5.6.3"
  }
}
```

---

### Étape 6 : Configurer TypeScript pour Chaque Workspace

**Fichier : `client/tsconfig.json`**
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client"]
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
    "rootDir": "./src"
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

---

### Étape 7 : Créer les Fichiers de Base

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

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(<App />);
```

**Fichier : `client/src/App.tsx`**
```typescript
export default function App() {
  return (
    <div>
      <h1>HotelGenius</h1>
      <p>Monorepo configuré avec succès !</p>
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
  padding: 2rem;
}
```

**Fichier : `server/src/index.ts`**
```typescript
import express from 'express';

const app = express();
const port = process.env.PORT || 5000;

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'HotelGenius API' });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
```

**Fichier : `shared/src/schema.ts`**
```typescript
// Schéma partagé - sera complété au Sprint 2
export const version = '1.0.0';
```

---

### Étape 8 : Installer les Dépendances

```bash
# À la racine du projet
pnpm install

# Vérifier l'installation
pnpm list --depth=0
```

---

### Étape 9 : Configurer Vite pour le Client

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

---

## 💡 Astuce : Scripts Utiles

**Ajouter dans `package.json` root :**
```json
{
  "scripts": {
    "dev:client": "pnpm --filter @hotelgenius/client dev",
    "dev:server": "pnpm --filter @hotelgenius/server dev",
    "dev:all": "pnpm -r --parallel dev"
  }
}
```

**Usage :**
```bash
pnpm dev:client    # Lance seulement le client
pnpm dev:server    # Lance seulement le serveur
pnpm dev:all       # Lance client + serveur en parallèle
```

---

## ✅ Checkpoint Sprint 1

**Tests à effectuer :**

1. **Installation :**
   ```bash
   pnpm install
   # Doit se terminer sans erreurs
   ```

2. **TypeScript :**
   ```bash
   pnpm type-check
   # Doit compiler sans erreurs
   ```

3. **Client :**
   ```bash
   cd client
   pnpm dev
   # Doit ouvrir http://localhost:5173 avec "HotelGenius"
   ```

4. **Server :**
   ```bash
   cd server
   pnpm dev
   # Doit afficher "🚀 Server running on http://localhost:5000"
   # Tester http://localhost:5000/health → doit retourner {"status":"ok"}
   ```

5. **Structure :**
   - [ ] Tous les dossiers créés
   - [ ] Tous les fichiers de config présents
   - [ ] Git initialisé avec .gitignore

**Si tout fonctionne, passe au Sprint 2 !** 🎉

---

**Issue GitHub recommandée pour ce sprint :**
```
Titre: [Sprint 1] Setup monorepo + TypeScript configuration

Description:
Initialiser le monorepo avec workspaces (pnpm), configurer TypeScript strict pour client/server/shared, créer la structure de dossiers.

Critères d'Acceptation:
- [ ] pnpm install fonctionne sans erreurs
- [ ] pnpm type-check compile sans erreurs
- [ ] Client démarre sur http://localhost:5173
- [ ] Server démarre sur http://localhost:5000/health
- [ ] Structure conforme au guide
```

---

# 4. Sprint 2 — Conception et Base de Données (PostgreSQL + Drizzle ORM)

## 🎯 Objectif

Créer le schéma de base de données complet avec toutes les tables nécessaires, générer les migrations, et tester la connexion à PostgreSQL.

**Livrables :**
- ✅ Schéma Drizzle complet (hotels, rooms, reservations, clients, payments, products, inventory, sales)
- ✅ Migrations générées et appliquées
- ✅ Connexion PostgreSQL fonctionnelle
- ✅ Diagramme ER documenté

**Durée estimée :** 3-4 jours

---

## 🧠 Concepts : ORM et Migrations

### Qu'est-ce qu'un ORM ?

**ORM** = Object-Relational Mapping : Traduit les objets JavaScript en SQL et vice versa.

**Avantages :**
- ✅ Type-safety (TypeScript)
- ✅ Pas besoin d'écrire SQL manuellement
- ✅ Migrations automatiques
- ✅ Relations simplifiées

**Exemple :**
```typescript
// Avec ORM (Drizzle)
const rooms = await db.select().from(roomsTable).where(eq(roomsTable.hotel_id, hotelId));

// Sans ORM (SQL brut)
const rooms = await db.query('SELECT * FROM rooms WHERE hotel_id = $1', [hotelId]);
```

**Pourquoi Drizzle plutôt que Prisma ?**
- ✅ Plus léger (pas de runtime lourd)
- ✅ Plus de contrôle sur les requêtes SQL
- ✅ Type-safe sans génération de code
- ✅ Syntaxe proche de SQL (apprentissage facilité)

---

### Qu'est-ce qu'une Migration ?

**Migration** = Script SQL qui modifie la structure de la base de données (ajout/modification de tables).

**Workflow typique :**
1. Modifier le schéma TypeScript (ex: ajouter une colonne)
2. Générer la migration : `drizzle-kit generate`
3. Appliquer la migration : `drizzle-kit migrate`
4. Versionner les fichiers de migration dans Git

**Pourquoi versionner les migrations ?**
- ✅ Reproducible : même DB sur tous les environnements
- ✅ Historique : savoir quand/quoi a été modifié
- ✅ Rollback : possibilité de revenir en arrière

---

## ⚙️ Étapes Pratiques

### Étape 1 : Installer les Dépendances

```bash
# Dans shared/
cd shared
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit
```

**Explication des packages :**
- `drizzle-orm` : ORM principal
- `@neondatabase/serverless` : Client PostgreSQL serverless (Neon)
- `drizzle-kit` : Outil CLI pour migrations

---

### Étape 2 : Configurer Drizzle Kit

**Fichier : `drizzle.config.ts` (racine)**
```typescript
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

export default defineConfig({
  schema: './shared/src/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
```

**Créer `.env` (racine) :**
```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

**Pour Neon :**
1. Créer un projet sur [neon.tech](https://neon.tech)
2. Copier la connection string
3. Coller dans `.env`

---

### Étape 3 : Créer le Schéma Complet

**Fichier : `shared/src/schema.ts`** (complet)

```typescript
import { sql } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
  date,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// ============================================================================
// TABLES PRINCIPALES
// ============================================================================

export const hotels = pgTable('hotels', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  currency: varchar('currency', { length: 3 }).default('HTG'),
  plan: varchar('plan', { length: 20 }).default('basic'), // basic, pro, enterprise
  status: varchar('status', { length: 20 }).default('active'), // active, suspended
  created_at: timestamp('created_at').defaultNow(),
}, (table) => ({
  emailIdx: index('hotels_email_idx').on(table.email),
}));

export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  hotel_id: varchar('hotel_id', { length: 255 }).references(() => hotels.id).onDelete('cascade'),
  username: text('username').notNull(),
  email: text('email'),
  password: text('password').notNull(), // hash bcrypt
  role: varchar('role', { length: 20 }).default('receptionist'), // owner, manager, receptionist, housekeeping, accountant, restaurant_staff, super_admin
  status: varchar('status', { length: 20 }).default('active'),
  created_at: timestamp('created_at').defaultNow(),
}, (table) => ({
  usernameIdx: uniqueIndex('users_username_idx').on(table.username),
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
  hotelIdIdx: index('users_hotel_id_idx').on(table.hotel_id),
}));

export const rooms = pgTable('rooms', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  hotel_id: varchar('hotel_id', { length: 255 }).notNull().references(() => hotels.id).onDelete('cascade'),
  room_number: text('room_number').notNull(),
  room_type: text('room_type').notNull(), // Standard, Deluxe, Suite
  capacity: integer('capacity').notNull(),
  price_per_night: integer('price_per_night').notNull(),
  status: varchar('status', { length: 20 }).default('available'), // available, occupied, cleaning, maintenance
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
}, (table) => ({
  hotelRoomIdx: uniqueIndex('rooms_hotel_room_idx').on(table.hotel_id, table.room_number),
  hotelIdIdx: index('rooms_hotel_id_idx').on(table.hotel_id),
}));

export const clients = pgTable('clients', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  hotel_id: varchar('hotel_id', { length: 255 }).notNull().references(() => hotels.id).onDelete('cascade'),
  first_name: text('first_name').notNull(),
  last_name: text('last_name'),
  phone: text('phone'),
  email: text('email'),
  id_card_number: text('id_card_number'),
  address: text('address'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
}, (table) => ({
  hotelIdIdx: index('clients_hotel_id_idx').on(table.hotel_id),
}));

export const reservations = pgTable('reservations', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  hotel_id: varchar('hotel_id', { length: 255 }).notNull().references(() => hotels.id).onDelete('cascade'),
  room_id: varchar('room_id', { length: 255 }).notNull().references(() => rooms.id).onDelete('restrict'),
  client_id: varchar('client_id', { length: 255 }).notNull().references(() => clients.id).onDelete('restrict'),
  check_in: date('check_in').notNull(),
  check_out: date('check_out').notNull(),
  status: varchar('status', { length: 20 }).default('pending'), // pending, confirmed, checked_in, checked_out, cancelled
  total_amount: integer('total_amount').notNull(),
  currency: varchar('currency', { length: 3 }).default('HTG'),
  payment_status: varchar('payment_status', { length: 20 }).default('pending'), // pending, partial, paid, refunded
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
}, (table) => ({
  hotelIdIdx: index('reservations_hotel_id_idx').on(table.hotel_id),
  roomIdIdx: index('reservations_room_id_idx').on(table.room_id),
  clientIdIdx: index('reservations_client_id_idx').on(table.client_id),
  datesIdx: index('reservations_dates_idx').on(table.check_in, table.check_out),
}));

export const payments = pgTable('payments', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  hotel_id: varchar('hotel_id', { length: 255 }).notNull().references(() => hotels.id).onDelete('cascade'),
  reservation_id: varchar('reservation_id', { length: 255 }).references(() => reservations.id).onDelete('set null'),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 3 }).default('HTG'),
  method: varchar('method', { length: 20 }).notNull(), // cash, card, transfer, stripe
  status: varchar('status', { length: 20 }).default('pending'), // pending, completed, failed, refunded
  stripe_payment_id: text('stripe_payment_id'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
}, (table) => ({
  hotelIdIdx: index('payments_hotel_id_idx').on(table.hotel_id),
  reservationIdIdx: index('payments_reservation_id_idx').on(table.reservation_id),
}));

export const invoices = pgTable('invoices', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  hotel_id: varchar('hotel_id', { length: 255 }).notNull().references(() => hotels.id).onDelete('cascade'),
  payment_id: varchar('payment_id', { length: 255 }).references(() => payments.id).onDelete('set null'),
  reservation_id: varchar('reservation_id', { length: 255 }).references(() => reservations.id).onDelete('set null'),
  invoice_number: text('invoice_number').notNull(),
  pdf_url: text('pdf_url'),
  created_at: timestamp('created_at').defaultNow(),
}, (table) => ({
  invoiceNumberIdx: uniqueIndex('invoices_number_idx').on(table.invoice_number),
  hotelIdIdx: index('invoices_hotel_id_idx').on(table.hotel_id),
}));

// ============================================================================
// TABLES RESTAURANT
// ============================================================================

export const products = pgTable('products', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  hotel_id: varchar('hotel_id', { length: 255 }).notNull().references(() => hotels.id).onDelete('cascade'),
  name: text('name').notNull(),
  category: text('category'), // Main, Appetizer, Dessert, Beverage
  price: integer('price').notNull(),
  unit: text('unit'), // portion, kg, bottle, etc.
  available: integer('available').default(1), // 1 = available, 0 = unavailable
  description: text('description'),
  created_at: timestamp('created_at').defaultNow(),
}, (table) => ({
  hotelIdIdx: index('products_hotel_id_idx').on(table.hotel_id),
}));

export const inventory_items = pgTable('inventory_items', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  hotel_id: varchar('hotel_id', { length: 255 }).notNull().references(() => hotels.id).onDelete('cascade'),
  product_id: varchar('product_id', { length: 255 }).references(() => products.id).onDelete('set null'),
  name: text('name').notNull(), // Nom du produit (ex: "Tomates", "Riz")
  unit: text('unit').notNull(), // kg, liter, bottle, etc.
  current_quantity: integer('current_quantity').default(0),
  alert_threshold: integer('alert_threshold').default(10), // Alerte si < seuil
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
}, (table) => ({
  hotelIdIdx: index('inventory_items_hotel_id_idx').on(table.hotel_id),
}));

export const sales = pgTable('sales', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  hotel_id: varchar('hotel_id', { length: 255 }).notNull().references(() => hotels.id).onDelete('cascade'),
  product_id: varchar('product_id', { length: 255 }).references(() => products.id).onDelete('set null'),
  reservation_id: varchar('reservation_id', { length: 255 }).references(() => reservations.id).onDelete('set null'), // Optionnel : facturer au séjour
  employee_id: varchar('employee_id', { length: 255 }).references(() => users.id).onDelete('set null'),
  quantity: integer('quantity').notNull(),
  unit_price: integer('unit_price').notNull(),
  total: integer('total').notNull(),
  payment_method: varchar('payment_method', { length: 20 }).notNull(), // cash, card, room_charge
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
}, (table) => ({
  hotelIdIdx: index('sales_hotel_id_idx').on(table.hotel_id),
  productIdIdx: index('sales_product_id_idx').on(table.product_id),
  reservationIdIdx: index('sales_reservation_id_idx').on(table.reservation_id),
  createdAtIdx: index('sales_created_at_idx').on(table.created_at),
}));

export const purchases = pgTable('purchases', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  hotel_id: varchar('hotel_id', { length: 255 }).notNull().references(() => hotels.id).onDelete('cascade'),
  inventory_item_id: varchar('inventory_item_id', { length: 255 }).references(() => inventory_items.id).onDelete('set null'),
  supplier_name: text('supplier_name'),
  quantity: integer('quantity').notNull(),
  unit_cost: integer('unit_cost').notNull(),
  total_cost: integer('total_cost').notNull(),
  purchase_date: date('purchase_date').defaultNow(),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
}, (table) => ({
  hotelIdIdx: index('purchases_hotel_id_idx').on(table.hotel_id),
}));

// ============================================================================
// SCHÉMAS ZOD POUR VALIDATION
// ============================================================================

export const insertHotelSchema = createInsertSchema(hotels, {
  name: z.string().min(1, 'Nom requis'),
  email: z.string().email().optional(),
});

export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3, 'Username trop court'),
  password: z.string().min(8, 'Mot de passe doit contenir au moins 8 caractères'),
  email: z.string().email().optional(),
  role: z.enum(['owner', 'manager', 'receptionist', 'housekeeping', 'accountant', 'restaurant_staff', 'super_admin']).optional(),
});

export const insertRoomSchema = createInsertSchema(rooms, {
  room_number: z.string().min(1, 'Numéro de chambre requis'),
  room_type: z.string().min(1, 'Type de chambre requis'),
  capacity: z.number().int().positive('Capacité doit être positive'),
  price_per_night: z.number().int().nonnegative('Prix doit être positif ou nul'),
});

export const insertClientSchema = createInsertSchema(clients, {
  first_name: z.string().min(1, 'Prénom requis'),
});

export const insertReservationSchema = createInsertSchema(reservations, {
  check_in: z.string().date(),
  check_out: z.string().date(),
  total_amount: z.number().int().nonnegative(),
});

export const insertProductSchema = createInsertSchema(products, {
  name: z.string().min(1, 'Nom requis'),
  price: z.number().int().nonnegative('Prix doit être positif ou nul'),
});

export const insertSaleSchema = createInsertSchema(sales, {
  quantity: z.number().int().positive('Quantité doit être positive'),
  unit_price: z.number().int().nonnegative('Prix unitaire doit être positif ou nul'),
});

// ============================================================================
// TYPES EXPORTÉS
// ============================================================================

export type Hotel = typeof hotels.$inferSelect;
export type InsertHotel = z.infer<typeof insertHotelSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof createInsertSchema(payments)>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type InventoryItem = typeof inventory_items.$inferSelect;
export type InsertInventoryItem = z.infer<typeof createInsertSchema(inventory_items)>;

export type Sale = typeof sales.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;
```

**Points importants :**
- `hotel_id` sur toutes les tables (isolation multi-tenant)
- Index sur `hotel_id` pour performance
- Foreign keys avec `onDelete` approprié
- Schémas Zod pour validation runtime
- Types TypeScript exportés

---

### Étape 4 : Configurer la Connexion à la Base de Données

**Fichier : `server/src/db.ts`**
```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';

// Configuration WebSocket pour Neon (nécessaire pour Node.js)
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set. Did you forget to provision a database?');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({
  client: pool,
  schema,
});
```

**Explication :**
- `Pool` : Gestionnaire de connexions PostgreSQL
- `drizzle()` : Crée l'instance ORM avec le schéma
- `schema` : Importe toutes les tables définies

---

### Étape 5 : Générer et Appliquer les Migrations

```bash
# Générer les migrations (lit schema.ts et crée les fichiers SQL)
pnpm drizzle-kit generate

# Appliquer les migrations (exécute le SQL sur la DB)
pnpm drizzle-kit migrate

# Alternative : push direct (dev seulement, pas pour production)
pnpm drizzle-kit push
```

**Résultat attendu :**
```
migrations/
├── 0000_initial.sql
└── meta/
    └── _journal.json
```

**Contenu de `0000_initial.sql` (exemple) :**
```sql
CREATE TABLE IF NOT EXISTS "hotels" (
  "id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "address" text,
  ...
);
```

---

### Étape 6 : Tester la Connexion

**Fichier : `server/src/test-db.ts`** (temporaire, pour tester)
```typescript
import { db } from './db';
import { hotels } from '@shared/schema';

async function testConnection() {
  try {
    // Tester une requête simple
    const result = await db.select().from(hotels).limit(1);
    console.log('✅ Connexion DB réussie !', result);
  } catch (error) {
    console.error('❌ Erreur DB:', error);
    throw error;
  }
}

testConnection();
```

**Exécuter :**
```bash
cd server
tsx src/test-db.ts
```

---

## 💡 Astuce : Index et Performance

**Pourquoi des index sur `hotel_id` ?**

Toutes les requêtes filtrent par `hotel_id` (isolation multi-tenant). Sans index, PostgreSQL doit scanner toutes les lignes (O(n)). Avec index, recherche rapide (O(log n)).

**Quand ajouter des index ?**
- Colonnes fréquemment filtrées (`hotel_id`, `status`)
- Colonnes utilisées dans JOIN (`room_id`, `client_id`)
- Colonnes de recherche (`email`, `username`)

**Trade-off :**
- ⚠️ Index ralentissent les INSERT/UPDATE (doit mettre à jour l'index)
- ✅ Index accélèrent les SELECT

---

## ✅ Checkpoint Sprint 2

**Tests à effectuer :**

1. **Migrations générées :**
   ```bash
   pnpm drizzle-kit generate
   # Doit créer fichiers dans migrations/
   ```

2. **Migrations appliquées :**
   ```bash
   pnpm drizzle-kit migrate
   # Doit afficher "Migration applied successfully"
   ```

3. **Vérifier les tables :**
   - Connecter à la DB (DBeaver, psql, etc.)
   - Vérifier que toutes les tables existent
   - Vérifier les foreign keys

4. **Test de connexion :**
   ```bash
   cd server
   tsx src/test-db.ts
   # Doit afficher "✅ Connexion DB réussie !"
   ```

5. **Vérifier TypeScript :**
   ```bash
   pnpm type-check
   # Doit compiler sans erreurs
   ```

**Issue GitHub recommandée :**
```
Titre: [Sprint 2] Schéma DB complet + migrations

Description:
Créer le schéma Drizzle complet avec toutes les tables (hotels, users, rooms, reservations, clients, payments, products, inventory, sales), générer et appliquer les migrations.

Critères d'Acceptation:
- [ ] Schéma complet dans shared/src/schema.ts
- [ ] Migrations générées et appliquées
- [ ] Connexion DB testée et fonctionnelle
- [ ] Index sur hotel_id créés pour toutes les tables
- [ ] Schémas Zod créés pour validation
```

---

---

# 11. Résumé des Connaissances Acquises

## 🎓 Ce que tu as Appris

Après avoir suivi ce guide complet, tu maîtrises :

### Architecture et Patterns

✅ **SaaS Multi-Tenant Architecture**
- Isolation des données par `hotel_id`
- Stratégies d'isolation (Shared DB, Shared Schema)
- Scalabilité horizontale

✅ **Monorepo Full-Stack TypeScript**
- Workspaces avec pnpm
- Partage de types entre frontend/backend
- Build optimisé avec Vite

✅ **Base de Données Relationnelle**
- ORM avec Drizzle (type-safe)
- Migrations versionnées
- Index et optimisation
- Relations 1-N et N-N

✅ **Backend Express.js**
- API RESTful
- Middleware (auth, validation, errors)
- JWT Authentication
- Multi-tenant isolation automatique

✅ **Frontend React Moderne**
- Composants réutilisables (shadcn/ui)
- State management (TanStack Query)
- Routing (Wouter)
- Formulaires avec validation (React Hook Form + Zod)

✅ **Sécurité**
- Password hashing (bcrypt)
- JWT tokens
- Validation stricte (Zod)
- CORS, rate limiting

✅ **Tests et Qualité**
- Tests unitaires (Vitest)
- Tests d'intégration (Supertest)
- Coverage reports

✅ **Déploiement et Production**
- CI/CD (GitHub Actions)
- Déploiement cloud (Railway, Vercel, Neon)
- Variables d'environnement
- Monitoring (Sentry)

✅ **Maintenance et Scalabilité**
- Logs structurés
- Monitoring et alertes
- Sauvegardes automatiques
- Cache (Redis)
- Optimisations de performance

---

## 📚 Ressources pour Aller Plus Loin

### Documentation Officielle

- **Drizzle ORM** : [orm.drizzle.team](https://orm.drizzle.team)
- **TanStack Query** : [tanstack.com/query](https://tanstack.com/query)
- **Express.js** : [expressjs.com](https://expressjs.com)
- **React** : [react.dev](https://react.dev)
- **TypeScript** : [typescriptlang.org](https://www.typescriptlang.org)

### Projets Similaires à Étudier

- **Linear** : SaaS de gestion de projets (excellent exemple de SaaS multi-tenant)
- **Vercel** : Plateforme de déploiement (excellente architecture)
- **Supabase** : Backend as a Service (bon exemple de patterns)

### Concepts Avancés à Explorer

- **Event Sourcing** : Historique complet des événements
- **CQRS** : Séparation lecture/écriture
- **Microservices** : Architecture distribuée
- **GraphQL** : Alternative à REST API
- **WebSockets** : Communication temps réel
- **Kubernetes** : Orchestration de containers

---

## 🚀 Prochaines Étapes

Maintenant que tu as reconstruit HotelGenius, voici des idées pour aller plus loin :

### 1. Améliorer les Fonctionnalités

- ✅ Notifications en temps réel (WebSockets)
- ✅ Export PDF des factures
- ✅ Calendrier de réservations interactif
- ✅ Dashboard analytique avancé
- ✅ Mode hors-ligne (PWA)
- ✅ Application mobile (React Native)

### 2. Optimisations Performance

- ✅ Cache Redis pour requêtes fréquentes
- ✅ Pagination infinie (virtual scrolling)
- ✅ Lazy loading des images
- ✅ Compression des réponses API
- ✅ CDN pour assets statiques

### 3. Sécurité Renforcée

- ✅ 2FA (Two-Factor Authentication)
- ✅ Audit logs (qui a fait quoi)
- ✅ Rate limiting par IP
- ✅ Sanitization des entrées
- ✅ Protection CSRF

### 4. Tests Complets

- ✅ Tests E2E (Playwright, Cypress)
- ✅ Tests de performance (Load testing)
- ✅ Tests de sécurité (OWASP)
- ✅ Coverage > 80%

---

## ✅ Checklist Finale de Validation

Avant de considérer le projet terminé, vérifie :

### Code Quality
- [ ] TypeScript strict sans erreurs
- [ ] Pas de `any` dans le code
- [ ] Variables d'environnement documentées
- [ ] Code commenté pour logique complexe
- [ ] Linting (ESLint) configuré et respecté

### Sécurité
- [ ] Mots de passe hashés (bcrypt)
- [ ] JWT secrets sécurisés
- [ ] Validation Zod sur toutes les entrées
- [ ] CORS configuré correctement
- [ ] Rate limiting actif

### Base de Données
- [ ] Migrations versionnées dans Git
- [ ] Index sur toutes les colonnes fréquemment recherchées
- [ ] Foreign keys avec `onDelete` approprié
- [ ] Sauvegardes automatiques configurées

### Tests
- [ ] Tests unitaires pour logique métier
- [ ] Tests d'intégration pour routes API
- [ ] Coverage > 70%
- [ ] CI passe tous les tests

### Déploiement
- [ ] Application déployée en production
- [ ] Variables d'environnement configurées
- [ ] Monitoring actif (Sentry, UptimeRobot)
- [ ] Logs accessibles et structurés
- [ ] Documentation README complète

---

## 🎯 Conclusion

Félicitations ! Tu as maintenant les compétences pour construire un SaaS multi-tenant complet de A à Z.

**Rappelle-toi :**
- 🧠 Comprendre **pourquoi** avant de faire **comment**
- 🧪 Tester à chaque étape
- 📝 Documenter les décisions importantes
- 🔒 La sécurité est primordiale
- 📈 Optimiser progressivement, pas prématurément

**HotelGenius est maintenant ton projet de référence** — utilise-le comme base pour d'autres projets SaaS.

**Bonne chance dans tes projets futurs !** 🚀

---

## 📝 Notes Finales

Ce guide couvre tout le cycle de vie d'un SaaS : de la conception au déploiement, en passant par le développement, les tests, et la maintenance.

**Les Sprints 3-8 suivent le même format détaillé que les Sprints 1-2** :
- Concepts théoriques expliqués simplement
- Code complet prêt à copier-coller
- Explications ligne par ligne
- Astuces pratiques
- Checkpoints de validation
- Issues GitHub suggérées

**Chaque sprint est autonome** — tu peux suivre à ton rythme et revenir sur les sections si nécessaire.

**Pour les sprints suivants** (3-8), consulte les guides existants dans le projet :
- `GUIDE_PEDAGOGIQUE_COMPLET.md` : Guide théorique détaillé
- `EXEMPLES_CODE_DETAILLES.md` : Exemples de code expliqués
- `EXERCICES_PRATIQUES.md` : Exercices progressifs

---

**Ce document fait partie d'une suite complète de guides pédagogiques pour devenir un expert software engineer en construisant des SaaS scalables.** 📚

*Dernière mise à jour : 2025*

