# 🏨 HotelGenius — Tome 3 : Backend Express — Authentification et API CRUD

> **Formation pratique complète pour construire le backend Express avec authentification JWT, routes CRUD, isolation multi-tenant, et validation stricte.**

**Style pédagogique :**
- 🎓 **Cours universitaire** — Définitions académiques et concepts théoriques
- 👨🏽‍🏫 **Mentor** — Explications concrètes et analogies
- 🧠 **Ingénierie SaaS** — Patterns avancés et décisions techniques
- 💻 **Code pratique** — Exemples complets prêts à copier-coller
- ⚠️ **Bonnes pratiques** — Conseils d'ingénieur senior

**Prérequis :** Avoir terminé le Tome 2 (base de données configurée)

---

## 📋 Table des Matières

1. [Chapitre 1 — Architecture Backend et Patterns Express](#chapitre-1--architecture-backend-et-patterns-express)
2. [Chapitre 2 — Authentification JWT et Sécurité](#chapitre-2--authentification-jwt-et-sécurité)
3. [Chapitre 3 — DatabaseStorage et Repository Pattern](#chapitre-3--databasestorage-et-repository-pattern)
4. [Chapitre 4 — Routes CRUD avec Validation Zod](#chapitre-4--routes-crud-avec-validation-zod)
5. [Chapitre 5 — Middleware Multi-Tenant et Gestion d'Erreurs](#chapitre-5--middleware-multi-tenant-et-gestion-derreurs)
6. [Chapitre 6 — Bilan, Exercices et Préparation du Tome 4](#chapitre-6--bilan-exercices-et-préparation-du-tome-4)

---

# Chapitre 1 — Architecture Backend et Patterns Express

## 🎓 Cours Universitaire — Architecture RESTful API

### Définition Académique

Une **API REST (Representational State Transfer)** est un style architectural pour concevoir des services web. Les principes fondamentaux sont :

1. **Stateless** : Chaque requête contient toute l'information nécessaire
2. **Ressources** : Les données sont représentées comme des ressources (nouns)
3. **HTTP Verbs** : Méthodes HTTP standardisées (GET, POST, PUT, DELETE, PATCH)
4. **Uniform Interface** : Format cohérent pour toutes les interactions

**Exemple de route REST :**
```
GET    /api/rooms          → Liste toutes les chambres
GET    /api/rooms/:id      → Détails d'une chambre
POST   /api/rooms          → Crée une nouvelle chambre
PATCH  /api/rooms/:id      → Met à jour une chambre (partiel)
PUT    /api/rooms/:id      → Remplace une chambre (complet)
DELETE /api/rooms/:id      → Supprime une chambre
```

**Avantages :**
- ✅ Standardisé (facile à comprendre et documenter)
- ✅ Scalable (stateless permet load balancing)
- ✅ Cacheable (réponses HTTP peuvent être cachées)
- ✅ Langage-agnostic (fonctionne avec n'importe quel client)

---

## 👨🏽‍🏫 Mentor — Pourquoi Express.js ?

### Analogie avec un Restaurant

Imagine un **restaurant** :

**Express.js** = Le serveur qui prend les commandes et les transmet à la cuisine

**Routes** = Le menu (chaque plat = une route)

**Middleware** = Les vérifications (vérifier si le client a de l'argent, si la table est réservée)

**Handlers** = Les cuisiniers qui préparent le plat (logique métier)

**Dans HotelGenius :**
- Client demande "Je veux voir mes chambres" → `GET /api/rooms`
- Express route vérifie l'authentification (middleware)
- Handler récupère les chambres depuis la DB
- Retourne la réponse JSON

**Pourquoi Express plutôt que Nest.js, Fastify, etc. ?**
- ✅ **Simplicité** : Minimaliste, facile à apprendre
- ✅ **Écosystème** : Nombreux middlewares disponibles
- ✅ **Maturité** : Stable depuis 10+ ans
- ✅ **Flexibilité** : Pas d'opinion forte, tu choisis tes patterns

**Trade-off :** Express est moins "opinionated" que Nest.js, donc tu dois structurer toi-même (mais c'est formatant !).

---

## 🧠 Ingénierie SaaS — Architecture Backend Multi-Tenant

### Schéma d'Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  fetch('/api/rooms', { headers: { Authorization: ... }}) │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP Request
┌────────────────────▼────────────────────────────────────┐
│              EXPRESS SERVER                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 1. Middleware: CORS, Body Parser, Logging        │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                      │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │ 2. Middleware: authenticate (vérifie JWT)         │   │
│  │    → Extrait hotel_id depuis token                │   │
│  │    → Ajoute req.user = { id, hotel_id, role }     │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                      │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │ 3. Middleware: requireTenant (vérifie hotel_id)    │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                      │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │ 4. Route Handler: logique métier                 │   │
│  │    → Validation Zod                             │   │
│  │    → Appelle DatabaseStorage                    │   │
│  │    → Retourne réponse JSON                      │   │
│  └──────────────────┬───────────────────────────────┘   │
└─────────────────────┼─────────────────────────────────────┘
                      │ SQL (via Drizzle ORM)
┌─────────────────────▼─────────────────────────────────────┐
│         DATABASE (PostgreSQL)                              │
│  SELECT * FROM rooms WHERE hotel_id = $1                   │
└─────────────────────────────────────────────────────────────┘
```

**Flux typique :**
1. Client envoie requête avec JWT
2. Middleware `authenticate` vérifie le token → extrait `hotel_id`
3. Middleware `requireTenant` vérifie que `hotel_id` existe
4. Handler exécute la logique métier avec `hotel_id` garantit
5. DatabaseStorage filtre automatiquement par `hotel_id`
6. Réponse JSON retournée au client

**Pourquoi cette architecture ?**
- ✅ **Sécurité** : `hotel_id` extrait du JWT (non falsifiable)
- ✅ **Isolation** : Impossible d'accéder aux données d'un autre tenant
- ✅ **Réutilisabilité** : Middlewares utilisables sur toutes les routes
- ✅ **Testabilité** : Chaque couche testable indépendamment

---

## 💻 Code Pratique — Configuration Express de Base

### Étape 1 : Structure du Serveur

**Fichier : `server/src/index.ts`**
```typescript
import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { registerRoutes } from './routes';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// MIDDLEWARE GLOBAUX
// ============================================================================

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// Logging middleware (simple)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, path } = req;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${method} ${path} ${res.statusCode} in ${duration}ms`);
  });
  
  next();
});

// ============================================================================
// ROUTES
// ============================================================================

registerRoutes(app);

// ============================================================================
// ERROR HANDLER GLOBAL
// ============================================================================

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({ message });
});

// ============================================================================
// DÉMARRAGE DU SERVEUR
// ============================================================================

async function start() {
  try {
    const httpServer = await registerRoutes(app);
    
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
```

**Explication ligne par ligne :**

- `express.json({ limit: '10mb' })` : Parse les bodies JSON, limite à 10MB (protection contre DoS)
- `express.urlencoded` : Parse les formulaires HTML classiques
- Logging middleware : Log chaque requête avec durée (utile pour debugging)
- Error handler : Attrape toutes les erreurs non gérées (sécurité)

---

### Étape 2 : Structure des Routes

**Fichier : `server/src/routes.ts`**
```typescript
import type { Express } from 'express';
import { createServer, type Server } from 'http';
import { authRoutes } from './routes/auth';
import { roomRoutes } from './routes/rooms';
import { reservationRoutes } from './routes/reservations';
import { clientRoutes } from './routes/clients';

export async function registerRoutes(app: Express): Promise<Server> {
  // ============================================================================
  // ROUTES PUBLIQUES (pas d'authentification)
  // ============================================================================
  
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ============================================================================
  // ROUTES D'AUTHENTIFICATION
  // ============================================================================
  
  app.use('/api/auth', authRoutes);

  // ============================================================================
  // ROUTES PROTÉGÉES (nécessitent authentification)
  // ============================================================================
  
  app.use('/api/rooms', roomRoutes);
  app.use('/api/reservations', reservationRoutes);
  app.use('/api/clients', clientRoutes);

  // ============================================================================
  // CRÉER LE SERVEUR HTTP
  // ============================================================================
  
  const httpServer = createServer(app);
  return httpServer;
}
```

**Explication :**
- Routes séparées par module (`auth`, `rooms`, etc.)
- Préfixe `/api` pour toutes les routes API
- Routes publiques en premier (`/health`)

---

## ⚠️ Bonnes Pratiques — Architecture Backend

### 1. Séparation des Responsabilités

**Structure recommandée :**
```
server/src/
├── index.ts              # Point d'entrée, configuration Express
├── db.ts                 # Connexion Drizzle
├── routes/
│   ├── index.ts          # Enregistrement de toutes les routes
│   ├── auth.ts           # Routes authentification
│   ├── rooms.ts          # Routes chambres
│   └── reservations.ts   # Routes réservations
├── middleware/
│   ├── auth.ts           # Middleware authenticate
│   ├── tenant.ts         # Middleware multi-tenant
│   └── errors.ts         # Error handlers
└── storage/
    └── database.ts        # DatabaseStorage (Repository)
```

**Principe :** Chaque fichier a une seule responsabilité (Single Responsibility Principle)

### 2. Toujours Préfixer les Routes API

**Bon :**
```typescript
app.use('/api/rooms', roomRoutes);
```

**Mauvais :**
```typescript
app.use('/rooms', roomRoutes); // Risque de conflit avec routes frontend
```

---

## ✅ Checkpoint Chapitre 1

**Tests à effectuer :**

1. **Serveur démarre :**
```bash
cd server
pnpm dev
# Doit afficher "🚀 Server running..."
```

2. **Health check fonctionne :**
```bash
curl http://localhost:5000/health
# Doit retourner {"status":"ok","timestamp":"..."}
```

**Si tout fonctionne → Chapitre 2 (Authentification) !** 🔐

---

# Chapitre 2 — Authentification JWT et Sécurité

## 🎓 Cours Universitaire — Qu'est-ce qu'un JWT ?

### Définition Académique

**JWT (JSON Web Token)** est un standard ouvert (RFC 7519) pour transmettre des informations entre parties de manière sécurisée sous forme d'objet JSON. Un JWT est composé de trois parties séparées par des points :

```
header.payload.signature
```

**Structure :**
1. **Header** : Type de token (JWT) + algorithme de signature (ex: HS256)
2. **Payload** : Les données (claims) - ex: `{ id: "...", hotel_id: "...", role: "owner" }`
3. **Signature** : Hash cryptographique qui garantit l'intégrité

**Exemple de JWT :**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMSIsImhvdGVsX2lkIjoiaG90ZWwtMSIsInJvbGUiOiJvd25lciIsImlhdCI6MTYzODAyODAwMH0.abc123...
```

**Avantages :**
- ✅ **Stateless** : Pas besoin de session serveur (scalable)
- ✅ **Portable** : Token contient toutes les infos nécessaires
- ✅ **Vérifiable** : Signature garantit l'authenticité

**Inconvénients :**
- ⚠️ **Non révocable** : Une fois émis, valide jusqu'expiration (solution : blacklist)
- ⚠️ **Taille** : Plus gros qu'un ID de session (mais acceptable)

---

## 👨🏽‍🏫 Mentor — Comment l'Authentification Fonctionne

### Analogie avec une Carte d'Identité

Imagine que tu veux entrer dans un **club privé** :

1. **Enregistrement** : Tu fournis tes infos → Le club te donne une **carte d'identité** (JWT)
2. **Connexion** : Tu montres ta carte à l'entrée → Le garde vérifie la signature (vérification JWT)
3. **Accès** : Si la carte est valide, tu entres → Tu as accès aux services

**Dans HotelGenius :**

**1. Register/Login :**
```typescript
// User s'enregistre ou se connecte
POST /api/auth/login
Body: { username: "owner", password: "secret123" }

// Server vérifie les credentials
// Si valide → Génère JWT
Response: { token: "eyJhbGciOiJIUzI1NiIs..." }
```

**2. Utilisation du Token :**
```typescript
// Client envoie le token dans chaque requête
GET /api/rooms
Headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIs..." }

// Server vérifie le token
// Si valide → Extrait hotel_id
// → Retourne les chambres de cet hôtel
```

**Sécurité :**
- Le token est **signé** avec un secret (seul le serveur peut le créer/vérifier)
- Le token contient `hotel_id` (isolation multi-tenant)
- Le token expire après un délai (ex: 7 jours)

---

## 🧠 Ingénierie SaaS — Flux d'Authentification Complet

### Diagramme de Séquence

```mermaid
sequenceDiagram
    participant C as Client
    participant API as Express API
    participant DB as PostgreSQL
    participant JWT as JWT Service

    C->>API: POST /api/auth/login {username, password}
    API->>DB: SELECT user WHERE username = ?
    DB-->>API: User avec password hash
    API->>API: bcrypt.compare(password, hash)
    alt Password valide
        API->>JWT: Génère token {id, hotel_id, role}
        JWT-->>API: Token signé
        API-->>C: {token: "..."}
    else Password invalide
        API-->>C: 401 Unauthorized
    end

    Note over C,API: Token stocké côté client (localStorage/cookie)

    C->>API: GET /api/rooms (avec Authorization: Bearer token)
    API->>API: Vérifie signature JWT
    alt Token valide
        API->>API: Extrait hotel_id depuis payload
        API->>DB: SELECT rooms WHERE hotel_id = ?
        DB-->>API: Rooms de cet hôtel
        API-->>C: {rooms: [...]}
    else Token invalide/expiré
        API-->>C: 401 Unauthorized
    end
```

---

## 💻 Code Pratique — Implémentation Complète

### Étape 1 : Configuration bcrypt et JWT

**Installer les dépendances :**
```bash
cd server
pnpm add bcryptjs jsonwebtoken
pnpm add -D @types/bcryptjs @types/jsonwebtoken
```

**Fichier : `server/src/auth/utils.ts`**
```typescript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ============================================================================
// HASHING DES MOTS DE PASSE
// ============================================================================

const SALT_ROUNDS = 10;

/**
 * Hash un mot de passe avec bcrypt
 * @param password - Mot de passe en clair
 * @returns Hash bcrypt (ex: "$2a$10$abcdef...")
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Vérifie un mot de passe contre un hash
 * @param password - Mot de passe en clair
 * @param hash - Hash bcrypt stocké en DB
 * @returns true si le mot de passe correspond
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ============================================================================
// JWT TOKENS
// ============================================================================

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = '7d'; // 7 jours

export interface JWTPayload {
  id: string;
  hotel_id: string | null;
  role: string;
}

/**
 * Génère un JWT token
 * @param payload - Données à inclure dans le token
 * @returns Token JWT signé
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Vérifie et décode un JWT token
 * @param token - Token JWT
 * @returns Payload décodé (ou null si invalide)
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null; // Token invalide ou expiré
  }
}
```

**Explication :**

- `SALT_ROUNDS = 10` : Nombre d'itérations de hash (plus élevé = plus sécurisé mais plus lent)
- `bcrypt.hash()` : Génère un hash unique même pour le même mot de passe (salt inclus)
- `jwt.sign()` : Crée un token signé avec le secret (seul le serveur peut le vérifier)
- `jwt.verify()` : Vérifie la signature et l'expiration

**⚠️ IMPORTANT :** Ne jamais commiter `JWT_SECRET` dans Git. Utiliser `.env` :

```env
JWT_SECRET=ton-secret-super-securise-change-en-production
```

---

### Étape 2 : Middleware d'Authentification

**Fichier : `server/src/middleware/auth.ts`**
```typescript
import type { Request, Response, NextFunction } from 'express';
import { verifyToken, type JWTPayload } from '../auth/utils';

// Extension du type Request pour inclure user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware d'authentification
 * Vérifie le JWT token et extrait les infos utilisateur
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Récupère le token depuis le header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid authorization header' });
    }
    
    // 2. Extrait le token (enlève "Bearer ")
    const token = authHeader.substring(7);
    
    // 3. Vérifie le token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    // 4. Ajoute l'utilisateur à la request
    req.user = decoded;
    
    // 5. Continue vers le handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
}

/**
 * Middleware qui vérifie qu'un tenant (hotel_id) est présent
 */
export function requireTenant(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.hotel_id) {
    return res.status(403).json({ message: 'Tenant context required' });
  }
  next();
}
```

**Explication ligne par ligne :**

- `req.headers.authorization` : Récupère le header `Authorization: Bearer <token>`
- `startsWith('Bearer ')` : Vérifie le format standard
- `substring(7)` : Enlève "Bearer " (7 caractères)
- `verifyToken()` : Vérifie la signature et l'expiration
- `req.user = decoded` : Ajoute les infos utilisateur à la request (accessible dans les handlers)

---

### Étape 3 : Routes d'Authentification

**Fichier : `server/src/routes/auth.ts`**
```typescript
import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { users, hotels } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword, generateToken } from '../auth/utils';

const router = Router();

// ============================================================================
// SCHÉMAS DE VALIDATION
// ============================================================================

const registerSchema = z.object({
  hotel_name: z.string().min(1, 'Nom de l\'hôtel requis'),
  username: z.string().min(3, 'Username trop court'),
  password: z.string().min(8, 'Mot de passe doit contenir au moins 8 caractères'),
  email: z.string().email().optional(),
});

const loginSchema = z.object({
  username: z.string().min(1, 'Username requis'),
  password: z.string().min(1, 'Password requis'),
});

// ============================================================================
// POST /api/auth/register
// ============================================================================

router.post('/register', async (req, res, next) => {
  try {
    // 1. Validation des données
    const validated = registerSchema.parse(req.body);
    
    // 2. Vérifier si username existe déjà
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, validated.username))
      .limit(1);
    
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    
    // 3. Créer l'hôtel
    const [hotel] = await db
      .insert(hotels)
      .values({
        name: validated.hotel_name,
        email: validated.email,
      })
      .returning();
    
    // 4. Hash le mot de passe
    const passwordHash = await hashPassword(validated.password);
    
    // 5. Créer l'utilisateur owner
    const [user] = await db
      .insert(users)
      .values({
        hotel_id: hotel.id,
        username: validated.username,
        password: passwordHash,
        email: validated.email,
        role: 'owner',
      })
      .returning();
    
    // 6. Générer le JWT
    const token = generateToken({
      id: user.id,
      hotel_id: hotel.id,
      role: user.role || 'owner',
    });
    
    // 7. Retourner le token et les infos utilisateur (sans le password)
    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        hotel_id: hotel.id,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors,
      });
    }
    next(error);
  }
});

// ============================================================================
// POST /api/auth/login
// ============================================================================

router.post('/login', async (req, res, next) => {
  try {
    // 1. Validation
    const validated = loginSchema.parse(req.body);
    
    // 2. Chercher l'utilisateur
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, validated.username))
      .limit(1);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // 3. Vérifier le mot de passe
    const isValidPassword = await verifyPassword(validated.password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // 4. Générer le JWT
    const token = generateToken({
      id: user.id,
      hotel_id: user.hotel_id || null,
      role: user.role || 'receptionist',
    });
    
    // 5. Retourner le token
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        hotel_id: user.hotel_id,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors,
      });
    }
    next(error);
  }
});

// ============================================================================
// GET /api/auth/me (route protégée)
// ============================================================================

router.get('/me', authenticate, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  // Récupérer les infos complètes de l'utilisateur
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, req.user.id))
    .limit(1);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    hotel_id: user.hotel_id,
  });
});

export { router as authRoutes };
```

**Explication des routes :**

- `/register` : Crée un hôtel + utilisateur owner + retourne JWT
- `/login` : Vérifie credentials + retourne JWT
- `/me` : Route protégée qui retourne les infos de l'utilisateur connecté

---

## ⚠️ Bonnes Pratiques — Sécurité

### 1. Ne Jamais Logger les Mots de Passe

```typescript
// ❌ MAUVAIS
console.log('Password:', password);

// ✅ BON
console.log('User attempting login:', username);
```

### 2. Messages d'Erreur Génériques pour Login

```typescript
// ❌ MAUVAIS (révèle que l'username existe)
if (!user) {
  return res.status(401).json({ message: 'User not found' });
}

// ✅ BON (message générique)
if (!user || !isValidPassword) {
  return res.status(401).json({ message: 'Invalid credentials' });
}
```

### 3. Expiration des Tokens

```typescript
// Tokens courts pour sécurité (ex: 1h) + refresh tokens pour UX
const JWT_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';
```

---

## ✅ Checkpoint Chapitre 2

**Tests à effectuer :**

1. **Register fonctionne :**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"hotel_name":"Test Hotel","username":"owner","password":"test123456"}'
# Doit retourner {token: "...", user: {...}}
```

2. **Login fonctionne :**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"owner","password":"test123456"}'
# Doit retourner {token: "..."}
```

3. **Route protégée fonctionne :**
```bash
TOKEN="ton-token-ici"
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
# Doit retourner les infos utilisateur
```

**Si tout fonctionne → Chapitre 3 (DatabaseStorage) !** 💾

---

*[Le guide continue avec les Chapitres 3-6 couvrant DatabaseStorage, Routes CRUD complètes, Middleware multi-tenant, et Gestion d'erreurs...]*

**Note :** Ce Tome 3 couvre le Sprint 3 (Backend complet). Le Tome 4 couvrira le Frontend (Sprint 4).

