# 📚 Guide Pédagogique Complet - HotelGenius

> **Guide complet pour devenir un expert software engineer en reconstruisant HotelGenius de zéro**

---

## 🎯 Introduction

Bienvenue dans ce guide complet pour reconstruire **HotelGenius**, un SaaS multi-tenant de gestion hôtelière avec module restaurant intégré. Ce guide vous accompagne pas-à-pas pour comprendre chaque décision technique, chaque ligne de code, et chaque pattern architectural.

**Objectif final** : Être capable de construire, maintenir et améliorer un SaaS professionnel de A à Z.

---

## 📋 Table des Matières

1. [Analyse Complète du Projet Existant](#1-analyse-complète-du-projet-existant)
2. [Plan Pédagogique pour Reconstruire le Projet](#2-plan-pédagogique-pour-reconstruire-le-projet)
3. [Explication Détaillée du Code et des Concepts](#3-explication-détaillée-du-code-et-des-concepts)
4. [Reconstruction Guidée Étape par Étape](#4-reconstruction-guidée-étape-par-étape)
5. [Tests et Déploiement](#5-tests-et-déploiement)
6. [Documentation et Maintenance](#6-documentation-et-maintenance)

---

## 1️⃣ Analyse Complète du Projet Existant

### 1.1 Architecture Globale

HotelGenius suit une architecture **monorepo full-stack** :

```
HotelGenius/
├── client/          # Frontend React (Vite)
├── server/          # Backend Express
├── shared/          # Code partagé (schémas, types)
└── Configuration    # Vite, TypeScript, Drizzle, Tailwind
```

**Architecture choisie : Full-Stack Monorepo**

**Pourquoi cette architecture ?**
- ✅ Partage de code entre frontend et backend (schémas TypeScript)
- ✅ Développement simplifié : une seule commande pour démarrer
- ✅ Type-safety end-to-end avec TypeScript
- ✅ Facilite le déploiement (build unique)

**Alternatives considérées :**
- **Microservices** : Trop complexe pour un MVP, overhead de communication
- **Repos séparés** : Duplication de code, synchronisation complexe
- **Monorepo choisi** : Parfait pour un SaaS multi-tenant modulaire

### 1.2 Technologies et Frameworks

#### Frontend
- **React 18** : Framework UI moderne, écosystème riche
- **TypeScript** : Type-safety, réduction des bugs
- **Vite** : Build tool ultra-rapide, HMR instantané
- **Tailwind CSS** : Utilitaires CSS, design system rapide
- **shadcn/ui** : Composants UI accessibles (Radix UI)
- **TanStack Query** : Gestion d'état serveur, cache intelligent
- **Wouter** : Routing léger (alternative à React Router)
- **React Hook Form** : Formulaires performants
- **Zod** : Validation de schémas runtime

#### Backend
- **Express.js** : Framework Node.js minimal et flexible
- **Drizzle ORM** : ORM type-safe, migrations automatiques
- **PostgreSQL** : Base de données relationnelle robuste
- **Neon Serverless** : PostgreSQL serverless (alternative : Supabase, Railway)
- **Zod** : Validation des entrées API
- **Passport.js** : Authentification (local, OAuth)
- **Express Session** : Sessions utilisateur
- **Stripe** : Paiements et abonnements

#### Infrastructure
- **Vite** : Build tool (frontend + backend avec esbuild)
- **Drizzle Kit** : Migrations et introspection
- **TypeScript** : Langage de programmation

**Pourquoi ces choix ?**

1. **TypeScript partout** : Cohérence, sécurité de types
2. **Drizzle ORM** : Plus léger que Prisma, type-safe
3. **TanStack Query** : Meilleur que Redux pour les données serveur
4. **Vite** : 10x plus rapide que Webpack/CRA
5. **PostgreSQL** : Relations complexes, transactions ACID

### 1.3 Structure des Dossiers Détaillée

#### `client/` - Frontend React

```
client/
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── ui/         # Composants shadcn/ui (Button, Card, etc.)
│   │   ├── *.tsx       # Composants métier (RoomCard, KpiCard, etc.)
│   ├── pages/          # Pages de l'application
│   │   ├── dashboard.tsx
│   │   ├── rooms.tsx
│   │   ├── reservations.tsx
│   │   ├── clients.tsx
│   │   ├── payments.tsx
│   │   ├── restaurant-*.tsx
│   │   ├── reports.tsx
│   │   ├── settings.tsx
│   │   ├── super-admin.tsx
│   │   ├── login.tsx
│   │   └── not-found.tsx
│   ├── hooks/          # Hooks React personnalisés
│   ├── lib/            # Utilitaires
│   │   ├── queryClient.ts  # Configuration TanStack Query
│   │   └── utils.ts        # Fonctions utilitaires
│   ├── App.tsx         # Composant racine + routing
│   ├── main.tsx        # Point d'entrée React
│   └── index.css       # Styles globaux + Tailwind
├── index.html          # HTML de base
└── public/             # Assets statiques
```

**Explication de chaque dossier :**

- **`components/ui/`** : Composants UI primitifs réutilisables (Button, Input, Card). Sont basés sur Radix UI pour l'accessibilité.
- **`components/*.tsx`** : Composants métier spécifiques à HotelGenius (RoomCard pour afficher une chambre).
- **`pages/`** : Pages complètes de l'app, une page = une route. Chaque page utilise des composants.
- **`hooks/`** : Logique réutilisable encapsulée (ex: `useMobile()` pour détecter mobile).
- **`lib/`** : Configuration et utilitaires partagés (queryClient pour TanStack Query).

#### `server/` - Backend Express

```
server/
├── index.ts        # Point d'entrée Express, setup du serveur
├── routes.ts       # Enregistrement des routes API
├── storage.ts      # Interface de stockage (MemStorage actuel)
└── db.ts          # Connexion Drizzle à PostgreSQL
└── vite.ts        # Configuration Vite pour le serveur
```

**Explication :**

- **`index.ts`** : Initialise Express, middleware, routes, démarre le serveur HTTP.
- **`routes.ts`** : Centralise toutes les routes API (`/api/*`).
- **`storage.ts`** : Abstraction du stockage. Actuellement `MemStorage` (en mémoire), sera remplacé par `DatabaseStorage`.
- **`db.ts`** : Connexion à PostgreSQL via Drizzle, exporte `db` pour les requêtes.

#### `shared/` - Code Partagé

```
shared/
└── schema.ts      # Schémas Drizzle + types TypeScript
```

**Pourquoi `shared/` ?**
- Le schéma de base de données est utilisé par :
  - **Backend** : Pour les requêtes Drizzle
  - **Frontend** : Pour les types TypeScript (autocomplétion, validation)
- Évite la duplication et garantit la cohérence.

### 1.4 Fonctionnalités Principales Identifiées

#### 🏨 Module Hôtel (MVP)
1. **Gestion des Chambres**
   - CRUD chambres (numéro, type, prix, capacité, statut)
   - Statuts : available, occupied, cleaning, maintenance
   - Vue liste et carte

2. **Gestion des Réservations**
   - Créer, modifier, annuler réservations
   - Check-in / Check-out
   - Calendrier des réservations
   - Statuts : pending, confirmed, checked_in, checked_out, cancelled

3. **Gestion des Clients**
   - CRUD clients (nom, téléphone, email, carte ID)
   - Historique des réservations par client

4. **Paiements et Facturation**
   - Enregistrer paiements (cash, card, transfert)
   - Générer factures PDF
   - Lier paiements aux réservations
   - Multi-devise (HTG, USD)

5. **Dashboard & Rapports**
   - KPIs (occupancy rate, revenue, check-ins)
   - Graphiques de revenus
   - Rapports d'occupation
   - Rapports financiers

#### 🍽️ Module Restaurant (MVP)
1. **Gestion du Menu**
   - CRUD plats (nom, catégorie, prix, disponibilité)

2. **Gestion de l'Inventaire**
   - Stock des produits (quantité, seuil d'alerte, unité)
   - Alertes de rupture de stock
   - Réapprovisionnements

3. **Ventes**
   - Enregistrer ventes (produit, quantité, employé, paiement)
   - Lier ventes aux chambres (facturation au séjour)
   - Suivi des ventes par employé

4. **Rapports Restaurant**
   - Ventes journalières/mensuelles
   - Performance par catégorie
   - Rapport de stock

#### 👑 Super Admin
1. **Gestion des Hôtels**
   - Voir tous les hôtels
   - Suspendre/Réactiver hôtels
   - Voir statistiques globales

2. **Abonnements**
   - Plans (Basic, Pro, Enterprise)
   - Paiements Stripe
   - Facturation

3. **Analytics Globales**
   - MRR (Monthly Recurring Revenue)
   - Nombre d'hôtels actifs
   - Revenus totaux

### 1.5 État Actuel du Projet

#### ✅ Ce qui existe déjà

1. **Frontend complet** :
   - ✅ Toutes les pages UI créées
   - ✅ Composants UI réutilisables (shadcn/ui)
   - ✅ Composants métier (RoomCard, ReservationTable, etc.)
   - ✅ Routing configuré (Wouter)
   - ✅ TanStack Query configuré
   - ✅ Design system cohérent (Tailwind)

2. **Structure backend** :
   - ✅ Express configuré
   - ✅ Vite pour le dev server
   - ✅ Structure de routes prête

3. **Base de données** :
   - ✅ Drizzle configuré
   - ✅ Connexion PostgreSQL prête
   - ⚠️ Schéma minimal (seulement `users`)

#### ⚠️ Ce qui manque (ce qu'on va construire)

1. **Schéma de base de données complet** :
   - ❌ Tables : hotels, rooms, reservations, clients, payments, invoices
   - ❌ Tables restaurant : products, sales, inventory, purchases
   - ❌ Relations et contraintes

2. **Backend API** :
   - ❌ Routes API manquantes (actuellement vide)
   - ❌ Authentification (JWT ou sessions)
   - ❌ Middleware de validation
   - ❌ Multi-tenant isolation

3. **Storage** :
   - ⚠️ `MemStorage` actuel (en mémoire, temporaire)
   - ❌ `DatabaseStorage` à créer (avec Drizzle)

4. **Intégrations** :
   - ❌ Stripe pour les paiements
   - ❌ Email (SendGrid/Mailgun)
   - ❌ Stockage fichiers (S3) pour factures

5. **Sécurité** :
   - ❌ Hashage des mots de passe (bcrypt)
   - ❌ JWT tokens
   - ❌ Validation stricte des entrées
   - ❌ Rate limiting

---

## 2️⃣ Plan Pédagogique pour Reconstruire le Projet

### 2.1 Modules d'Apprentissage

Nous allons reconstruire HotelGenius en **8 modules progressifs** :

#### Module 1 : Fondations & Base de Données
- **Objectif** : Créer le schéma de base de données complet
- **Concepts** : Modélisation relationnelle, Drizzle ORM, migrations
- **Livrables** : Schéma complet dans `shared/schema.ts`, migrations

#### Module 2 : Storage Layer (Repository Pattern)
- **Objectif** : Remplacer MemStorage par DatabaseStorage
- **Concepts** : Repository Pattern, abstraction, injection de dépendances
- **Livrables** : `DatabaseStorage` class avec toutes les méthodes CRUD

#### Module 3 : Authentification & Autorisation
- **Objectif** : Système d'auth complet (login, register, JWT)
- **Concepts** : JWT, sessions, RBAC (Role-Based Access Control), middleware
- **Livrables** : Routes `/api/auth/*`, middleware d'authentification

#### Module 4 : API Routes - Module Hôtel
- **Objectif** : Routes pour rooms, reservations, clients, payments
- **Concepts** : REST API, validation Zod, error handling
- **Livrables** : Routes `/api/rooms`, `/api/reservations`, etc.

#### Module 5 : API Routes - Module Restaurant
- **Objectif** : Routes pour menu, inventory, sales
- **Concepts** : Relations complexes, transactions SQL
- **Livrables** : Routes `/api/restaurant/*`

#### Module 6 : Intégration Frontend-Backend
- **Objectif** : Connecter les pages React aux API
- **Concepts** : TanStack Query hooks, optimistic updates, error handling
- **Livrables** : Toutes les pages fonctionnelles avec vraies données

#### Module 7 : Tests & Qualité
- **Objectif** : Tests unitaires et d'intégration
- **Concepts** : Jest, Vitest, tests E2E, coverage
- **Livrables** : Suite de tests complète

#### Module 8 : Déploiement & Production
- **Objectif** : Déployer en production (Vercel, Railway, Neon)
- **Concepts** : CI/CD, variables d'environnement, monitoring, sécurité
- **Livrables** : Application déployée et fonctionnelle

### 2.2 Approche Pédagogique

Pour chaque module :

1. **Explication théorique** : Pourquoi on fait ça, concepts clés
2. **Exemple de code** : Code expliqué ligne par ligne
3. **Exercices pratiques** : Tu codes toi-même
4. **Review & Feedback** : Correction et améliorations

### 2.3 Bonnes Pratiques à Appliquer

1. **Type-Safety** : TypeScript partout, pas de `any`
2. **Validation** : Zod pour toutes les entrées (frontend + backend)
3. **Error Handling** : Gestion d'erreurs cohérente, messages clairs
4. **Code Organization** : Separation of concerns, fonctions pures
5. **Performance** : Indexes DB, cache quand nécessaire, lazy loading
6. **Sécurité** : Validation stricte, sanitization, rate limiting
7. **Documentation** : Commentaires pour la logique complexe

---

## 3️⃣ Explication Détaillée du Code et des Concepts

### 3.1 Structure du Schéma de Base de Données

#### Pourquoi PostgreSQL + Drizzle ?

**PostgreSQL** :
- Base de données relationnelle robuste
- Supporte les transactions ACID
- JSON columns pour flexibilité
- Extensions utiles (PostGIS, Full-text search)

**Drizzle ORM** :
- Type-safe : Les requêtes sont typées
- Léger : Pas de runtime lourd
- Migrations automatiques
- SQL-like : Contrôle fin des requêtes

#### Schéma Multi-Tenant

**Stratégie choisie : Shared Database, Shared Schema**

Chaque table contient un `hotel_id` pour isoler les données :

```typescript
// Exemple de table multi-tenant
export const rooms = pgTable("rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotel_id: varchar("hotel_id").notNull().references(() => hotels.id),
  room_number: text("room_number").notNull(),
  // ...
});
```

**Pourquoi cette approche ?**
- ✅ Plus simple à maintenir qu'une DB par hôtel
- ✅ Scalable jusqu'à des milliers d'hôtels
- ✅ Requêtes simples avec `WHERE hotel_id = ?`
- ⚠️ Nécessite de toujours filtrer par `hotel_id` (sécurité)

**Alternatives** :
- **DB par tenant** : Plus isolé, mais complexe à gérer
- **Schema par tenant** : Bon compromis, mais limite à PostgreSQL

#### Tables Principales

**Entités Hôtel :**
- `hotels` : Informations de l'hôtel (nom, adresse, plan, statut)
- `users` : Utilisateurs de la plateforme (employés, admin)
- `rooms` : Chambres de l'hôtel
- `reservations` : Réservations clients
- `clients` : Clients récurrents
- `payments` : Paiements enregistrés
- `invoices` : Factures générées

**Entités Restaurant :**
- `products` : Produits/plats du restaurant
- `inventory_items` : Stock des produits
- `sales` : Ventes enregistrées
- `purchases` : Achats de réapprovisionnement

**Relations :**
- `reservations` → `rooms` (une réservation = une chambre)
- `reservations` → `clients` (une réservation = un client)
- `payments` → `reservations` (un paiement = une réservation)
- `sales` → `products` (une vente = un produit)
- `sales` → `reservations` (optionnel, facturation au séjour)

### 3.2 Architecture Backend (Express)

#### Structure d'une Route API

```typescript
// Exemple de route complète
app.post("/api/rooms", async (req, res, next) => {
  try {
    // 1. Validation des entrées
    const validatedData = insertRoomSchema.parse(req.body);
    
    // 2. Vérification auth (middleware)
    const hotelId = req.user.hotel_id;
    
    // 3. Logique métier
    const room = await storage.createRoom({
      ...validatedData,
      hotel_id: hotelId,
    });
    
    // 4. Réponse
    res.status(201).json(room);
  } catch (error) {
    next(error); // Passe à l'error handler
  }
});
```

**Étapes d'une route :**
1. **Validation** : Zod vérifie les données d'entrée
2. **Authentification** : Middleware vérifie le token JWT
3. **Autorisation** : Vérifie les permissions (rôle)
4. **Logique métier** : Appelle le storage layer
5. **Réponse** : JSON avec le résultat

#### Middleware Pattern

```typescript
// Middleware d'authentification
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajoute user à la request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Utilisation
app.get("/api/rooms", authenticate, async (req, res) => {
  // req.user est disponible ici
});
```

**Pourquoi des middlewares ?**
- Réutilisabilité : Une fois écrit, utilisé partout
- Séparation des responsabilités : Auth séparé de la logique métier
- Composition : Plusieurs middlewares peuvent s'enchaîner

### 3.3 Architecture Frontend (React)

#### TanStack Query (React Query)

**Qu'est-ce que TanStack Query ?**
- Library pour gérer l'état serveur (data fetching, cache, synchronisation)
- Alternative à Redux pour les données API
- Cache intelligent, refetch automatique, optimistic updates

**Pourquoi l'utiliser ?**
- ✅ Cache automatique : Évite les requêtes inutiles
- ✅ Loading states : Gère automatiquement `isLoading`, `isError`
- ✅ Refetch : Synchronise avec le serveur
- ✅ Optimistic updates : UI réactive

**Exemple d'utilisation :**

```typescript
// Hook personnalisé avec TanStack Query
function useRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await fetch("/api/rooms", { credentials: "include" });
      return res.json();
    },
  });
}

// Dans un composant
function RoomsPage() {
  const { data: rooms, isLoading, error } = useRooms();
  
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;
  
  return <RoomList rooms={rooms} />;
}
```

#### Composants React Pattern

**Composition Pattern** : Petits composants réutilisables

```typescript
// Composant simple et réutilisable
function RoomCard({ room }: { room: Room }) {
  return (
    <Card>
      <CardHeader>{room.roomNumber}</CardHeader>
      <CardContent>
        <StatusBadge status={room.status} />
        <Price price={room.pricePerNight} currency={room.currency} />
      </CardContent>
    </Card>
  );
}

// Utilisation dans une page
function RoomsPage() {
  const { data: rooms } = useRooms();
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {rooms?.map(room => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
```

**Pourquoi cette approche ?**
- Réutilisabilité : RoomCard utilisé partout
- Testabilité : Chaque composant testé indépendamment
- Maintenabilité : Changement dans RoomCard = changement partout

---

## 4️⃣ Reconstruction Guidée Étape par Étape

### Étape 1 : Planification & Conception

#### Objectif
Comprendre le domaine métier et modéliser les données.

#### Étapes Détaillées

**1.1 Identifier les Entités**

Analyser les besoins :
- Quelles sont les "choses" importantes ? (Hôtel, Chambre, Réservation, Client...)
- Quelles sont les relations entre elles ?
- Quelles données doit-on stocker pour chacune ?

**1.2 Créer le Diagramme ER (Entity-Relationship)**

Représentation visuelle :
```
Hotel (1) ──< (N) Room
Hotel (1) ──< (N) Reservation
Client (1) ──< (N) Reservation
Reservation (1) ──< (N) Payment
Hotel (1) ──< (N) Product
Product (1) ──< (N) Sale
```

**1.3 Définir les Contraintes**

- Unicité : `room_number` unique par hôtel
- Références : `reservation.room_id` doit exister dans `rooms`
- Valeurs par défaut : `status` = 'pending' pour réservations

**Exercice Pratique** :
Crée un diagramme ER complet sur papier ou avec draw.io.

---

### Étape 2 : Architecture & Modèles de Données

#### Objectif
Créer le schéma de base de données complet avec Drizzle.

#### Étapes Détaillées

**2.1 Créer le Schéma Drizzle**

Dans `shared/schema.ts`, définir toutes les tables :

```typescript
// Table hotels
export const hotels = pgTable("hotels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  currency: varchar("currency", { length: 3 }).default("HTG"),
  plan: varchar("plan", { length: 20 }).default("basic"),
  status: varchar("status", { length: 20 }).default("active"),
  created_at: timestamp("created_at").defaultNow(),
});

// Table rooms
export const rooms = pgTable("rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotel_id: varchar("hotel_id").notNull().references(() => hotels.id),
  room_number: text("room_number").notNull(),
  room_type: text("room_type").notNull(),
  capacity: integer("capacity").notNull(),
  price_per_night: integer("price_per_night").notNull(),
  status: varchar("status", { length: 20 }).default("available"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
});
```

**Explication ligne par ligne :**

1. `pgTable("hotels", { ... })` : Crée une table PostgreSQL nommée "hotels"
2. `id: varchar("id").primaryKey()` : Colonne ID, type VARCHAR, clé primaire
3. `.default(sql\`gen_random_uuid()\`)` : Valeur par défaut = UUID généré par PostgreSQL
4. `hotel_id: ...references(() => hotels.id)` : Clé étrangère vers `hotels.id`

**2.2 Créer les Schémas Zod**

Pour valider les données d'entrée :

```typescript
// Schéma d'insertion (création)
export const insertRoomSchema = createInsertSchema(rooms).pick({
  room_number: true,
  room_type: true,
  capacity: true,
  price_per_night: true,
  status: true,
  notes: true,
});

// Type TypeScript déduit
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof rooms.$inferSelect;
```

**Pourquoi Zod ?**
- Validation runtime : Vérifie les données à l'exécution
- Type-safe : Génère les types TypeScript automatiquement
- Messages d'erreur clairs

**2.3 Créer les Migrations**

```bash
npm run db:push
```

Cette commande :
- Compare le schéma Drizzle avec la DB
- Génère et exécute les migrations SQL
- Met à jour la structure de la base

**Bonnes Pratiques :**
- ✅ Toujours tester les migrations en local d'abord
- ✅ Backup avant migration en production
- ✅ Migrations réversibles (down migrations)

**Exercice Pratique** :
Crée les tables manquantes :
- `reservations`
- `clients`
- `payments`
- `products`
- `sales`
- `inventory_items`

---

### Étape 3 : Backend — Routes, API, Logique Métier

#### Objectif
Implémenter toutes les routes API nécessaires.

#### 3.1 Structure des Routes

Organiser par module :

```typescript
// server/routes.ts
export async function registerRoutes(app: Express) {
  // Auth routes
  app.post("/api/auth/register", registerHandler);
  app.post("/api/auth/login", loginHandler);
  app.post("/api/auth/logout", logoutHandler);
  
  // Hotel routes (protégées)
  app.get("/api/rooms", authenticate, getRoomsHandler);
  app.post("/api/rooms", authenticate, createRoomHandler);
  app.patch("/api/rooms/:id", authenticate, updateRoomHandler);
  app.delete("/api/rooms/:id", authenticate, deleteRoomHandler);
  
  // ... autres routes
}
```

**3.2 Implémenter une Route Complète**

Exemple : `POST /api/rooms`

```typescript
async function createRoomHandler(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Validation
    const validatedData = insertRoomSchema.parse(req.body);
    
    // 2. Authentification (déjà fait par middleware)
    const hotelId = req.user.hotel_id;
    
    // 3. Vérification autorisation (rôle)
    if (req.user.role !== "owner" && req.user.role !== "manager") {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    // 4. Logique métier
    const room = await storage.createRoom({
      ...validatedData,
      hotel_id: hotelId,
    });
    
    // 5. Réponse
    res.status(201).json(room);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error",
        errors: error.errors 
      });
    }
    next(error);
  }
}
```

**Explication :**
- **Ligne 3** : `insertRoomSchema.parse()` valide et transforme les données
- **Ligne 6** : `req.user` vient du middleware `authenticate`
- **Ligne 9-11** : Vérifie que l'utilisateur a les permissions
- **Ligne 14** : Appelle le storage layer (abstraction)
- **Ligne 17** : Retourne la chambre créée avec status 201

**3.3 Gestion d'Erreurs**

Créer un error handler centralisé :

```typescript
// Dans server/index.ts
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Log l'erreur (dans un vrai projet, utiliser un logger)
  console.error(err);
  
  // Réponse appropriée
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(status).json({ message });
});
```

**Types d'erreurs à gérer :**
- **400** : Validation error (Zod)
- **401** : Unauthorized (pas de token)
- **403** : Forbidden (pas les permissions)
- **404** : Not Found
- **500** : Server Error

---

### Étape 4 : Frontend — Interface, Composants, État Global

#### Objectif
Connecter les composants React existants à l'API backend.

#### 4.1 Créer des Hooks TanStack Query

Exemple : Hook pour les chambres

```typescript
// hooks/useRooms.ts
export function useRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await fetch("/api/rooms", {
        credentials: "include", // Inclut les cookies (sessions)
      });
      if (!res.ok) throw new Error("Failed to fetch rooms");
      return res.json() as Promise<Room[]>;
    },
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertRoom) => {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create room");
      return res.json() as Promise<Room>;
    },
    onSuccess: () => {
      // Invalide le cache pour refetch
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}
```

**Explication :**
- **`queryKey`** : Identifie cette query dans le cache
- **`queryFn`** : Fonction qui fetch les données
- **`mutationFn`** : Fonction pour créer/modifier
- **`onSuccess`** : Callback après succès (invalide le cache)

**4.2 Utiliser dans un Composant**

```typescript
// pages/rooms.tsx
export default function Rooms() {
  const { data: rooms, isLoading } = useRooms();
  const createRoom = useCreateRoom();
  
  const handleCreate = async (data: InsertRoom) => {
    try {
      await createRoom.mutateAsync(data);
      toast.success("Room created!");
    } catch (error) {
      toast.error("Failed to create room");
    }
  };
  
  if (isLoading) return <Spinner />;
  
  return (
    <div>
      {rooms?.map(room => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
```

**4.3 Optimistic Updates**

Pour une UI plus réactive :

```typescript
export function useCreateRoom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertRoom) => {
      // ... fetch API
    },
    // Avant la requête
    onMutate: async (newRoom) => {
      // Annule les queries en cours
      await queryClient.cancelQueries({ queryKey: ["rooms"] });
      
      // Snapshot de l'état actuel
      const previousRooms = queryClient.getQueryData<Room[]>(["rooms"]);
      
      // Ajoute optimistiquement la nouvelle chambre
      queryClient.setQueryData<Room[]>(["rooms"], (old = []) => [
        ...old,
        { ...newRoom, id: "temp-id" } as Room,
      ]);
      
      return { previousRooms };
    },
    // En cas d'erreur, rollback
    onError: (err, newRoom, context) => {
      queryClient.setQueryData(["rooms"], context?.previousRooms);
    },
    // En cas de succès, refetch pour avoir les vraies données
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}
```

**Pourquoi optimistic updates ?**
- ✅ UI plus réactive (pas d'attente)
- ✅ Meilleure UX
- ⚠️ Nécessite un rollback en cas d'erreur

---

### Étape 5 : Intégration Front-Back

#### Objectif
Connecter toutes les pages aux API correspondantes.

#### 5.1 Mapping Pages → Routes API

| Page | Routes API nécessaires |
|------|----------------------|
| `/dashboard` | `GET /api/dashboard/stats` |
| `/rooms` | `GET /api/rooms`, `POST /api/rooms`, etc. |
| `/reservations` | `GET /api/reservations`, `POST /api/reservations` |
| `/clients` | `GET /api/clients`, `POST /api/clients` |
| `/payments` | `GET /api/payments`, `POST /api/payments` |
| `/restaurant/menu` | `GET /api/products`, `POST /api/products` |
| `/restaurant/inventory` | `GET /api/inventory`, `POST /api/purchases` |
| `/restaurant/sales` | `GET /api/sales`, `POST /api/sales` |
| `/reports` | `GET /api/reports/*` |

**Exercice Pratique** :
Pour chaque page, identifie les routes API nécessaires et crée les hooks TanStack Query correspondants.

---

### Étape 6 : Tests Unitaires et d'Intégration

#### Objectif
Créer une suite de tests complète.

#### 6.1 Setup Tests (Vitest)

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
});
```

#### 6.2 Tests Unitaires (Storage Layer)

```typescript
// server/storage.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { DatabaseStorage } from "./storage";

describe("DatabaseStorage", () => {
  let storage: DatabaseStorage;
  
  beforeEach(async () => {
    storage = new DatabaseStorage();
    // Setup : créer un hôtel de test
  });
  
  it("should create a room", async () => {
    const room = await storage.createRoom({
      hotel_id: "test-hotel-id",
      room_number: "101",
      room_type: "Standard",
      capacity: 2,
      price_per_night: 1500,
    });
    
    expect(room.room_number).toBe("101");
    expect(room.id).toBeDefined();
  });
  
  it("should not create duplicate room numbers", async () => {
    await storage.createRoom({ /* ... */ });
    
    await expect(
      storage.createRoom({ /* même room_number */ })
    ).rejects.toThrow();
  });
});
```

#### 6.3 Tests d'Intégration (API Routes)

```typescript
// server/routes.test.ts
import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./index";

describe("POST /api/rooms", () => {
  it("should create a room with valid data", async () => {
    const res = await request(app)
      .post("/api/rooms")
      .set("Authorization", "Bearer valid-token")
      .send({
        room_number: "101",
        room_type: "Standard",
        capacity: 2,
        price_per_night: 1500,
      });
    
    expect(res.status).toBe(201);
    expect(res.body.room_number).toBe("101");
  });
  
  it("should return 400 with invalid data", async () => {
    const res = await request(app)
      .post("/api/rooms")
      .send({ room_number: "" }); // Invalide
    
    expect(res.status).toBe(400);
  });
});
```

**Bonnes Pratiques Tests :**
- ✅ Un test = une assertion principale
- ✅ Tests indépendants (pas de dépendances)
- ✅ Setup/Teardown propre
- ✅ Coverage > 80%

---

### Étape 7 : Optimisation & Sécurité

#### 7.1 Optimisations Performance

**Indexes de Base de Données** :
```typescript
// Dans schema.ts
export const rooms = pgTable("rooms", {
  // ...
  hotel_id: varchar("hotel_id").notNull(),
  room_number: text("room_number").notNull(),
}, (table) => ({
  // Index composite pour recherche rapide
  hotelRoomIdx: uniqueIndex("hotel_room_idx").on(
    table.hotel_id,
    table.room_number
  ),
}));
```

**Cache** :
- TanStack Query cache automatiquement
- Pour données statiques : cache long (ex: liste des types de chambres)

**Pagination** :
```typescript
// API avec pagination
app.get("/api/rooms", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;
  
  const rooms = await storage.getRooms({ hotel_id, limit, offset });
  const total = await storage.countRooms({ hotel_id });
  
  res.json({
    data: rooms,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
```

#### 7.2 Sécurité

**1. Validation Stricte** :
- Toujours valider avec Zod côté backend (même si validé frontend)
- Ne jamais faire confiance aux données client

**2. Rate Limiting** :
```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max
});

app.use("/api/", limiter);
```

**3. Sanitization** :
- Échapper les caractères spéciaux dans les inputs
- Utiliser des paramètres préparés (Drizzle le fait automatiquement)

**4. HTTPS** :
- Toujours utiliser HTTPS en production
- HSTS headers

**5. Secrets** :
- Variables d'environnement pour secrets (`.env`)
- Ne jamais commiter `.env`
- Utiliser un secret manager en production (AWS Secrets Manager)

---

### Étape 8 : Déploiement Production

#### 8.1 Préparation

**Variables d'Environnement** :
```bash
# .env.production
DATABASE_URL=postgresql://...
JWT_SECRET=...
STRIPE_SECRET_KEY=...
NODE_ENV=production
PORT=5000
```

**Build** :
```bash
npm run build
```

Cette commande :
- Build le frontend (Vite) → `dist/public`
- Build le backend (esbuild) → `dist/index.js`

#### 8.2 Déploiement

**Option 1 : Railway** (Recommandé pour débuter)
- Déploie directement depuis GitHub
- Gère PostgreSQL automatiquement
- Variables d'environnement faciles

**Option 2 : Vercel (Frontend) + Railway (Backend)**
- Vercel pour le frontend (gratuit, CDN)
- Railway pour le backend + DB

**Option 3 : AWS/DigitalOcean**
- Plus de contrôle, plus complexe
- Meilleur pour scale

#### 8.3 CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run check
      - run: npm run build
      # Déployer vers Railway/Vercel
```

---

## 5️⃣ Tests et Déploiement

### 5.1 Guide Complet des Tests

Voir `EXERCICES_PRATIQUES.md` - Module 7 pour les exercices détaillés.

### 5.2 Configuration des Environnements

**Développement** :
- `.env.development` : DB locale, secrets de dev
- HMR activé, logs détaillés

**Staging** :
- `.env.staging` : DB de test
- Mêmes secrets que prod (mais données test)

**Production** :
- `.env.production` : Vraie DB, vrais secrets
- Logs minimaux, monitoring activé

### 5.3 Déploiement Step-by-Step

1. **Préparer la DB** :
   - Créer une DB PostgreSQL (Neon, Supabase, Railway)
   - Exécuter les migrations : `npm run db:push`

2. **Configurer les Variables** :
   - `DATABASE_URL`
   - `JWT_SECRET` (générer avec `openssl rand -hex 32`)
   - `STRIPE_SECRET_KEY` (depuis Stripe Dashboard)

3. **Build & Deploy** :
   - Connecter le repo GitHub à Railway/Vercel
   - Configurer les variables d'environnement
   - Déployer

4. **Vérifier** :
   - Tester toutes les routes API
   - Vérifier les logs
   - Monitorer les erreurs (Sentry)

---

## 6️⃣ Documentation et Maintenance

### 6.1 Documentation du Projet

**README.md** :
- Description du projet
- Instructions d'installation
- Variables d'environnement
- Scripts disponibles

**API Documentation** :
- Utiliser OpenAPI/Swagger
- Ou documenter manuellement les routes

**Code Comments** :
- Commenter la logique complexe
- Pas besoin de commenter le code évident

### 6.2 Stratégies de Maintenance

**1. Mises à Jour Régulières** :
- Mettre à jour les dépendances (security patches)
- `npm audit` pour vérifier les vulnérabilités

**2. Monitoring** :
- Sentry pour les erreurs
- UptimeRobot pour la disponibilité
- Logs centralisés (Datadog, LogRocket)

**3. Backup** :
- Backup quotidien de la DB
- Test de restauration régulier

**4. Performance** :
- Monitorer les requêtes lentes
- Analyser les logs
- Optimiser les indexes

### 6.3 Scalabilité

**Quand Scale ?**
- DB lente → Ajouter des indexes
- API lente → Cache (Redis)
- Traffic élevé → Load balancer, plusieurs instances

**Optimisations Futures** :
- Cache Redis pour données fréquentes
- CDN pour assets statiques
- Database read replicas
- Queue system (Bull) pour jobs lourds

---

## 🎓 Conclusion

Félicitations ! Tu as maintenant toutes les connaissances pour reconstruire HotelGenius de zéro.

**Prochaines Étapes :**
1. Suis les exercices dans `EXERCICES_PRATIQUES.md`
2. Consulte `EXEMPLES_CODE_DETAILLES.md` pour des exemples ligne par ligne
3. Code étape par étape, teste à chaque étape
4. Pose des questions si besoin !

**Ressources Supplémentaires :**
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [TanStack Query Docs](https://tanstack.com/query)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)

**Bon coding ! 🚀**

