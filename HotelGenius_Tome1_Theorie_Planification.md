# 🏨 HotelGenius — Tome 1 : Théorie du SaaS, Multi-Tenancy et Planification Complète

> **Formation complète pour comprendre en profondeur le fonctionnement d'un SaaS, les principes du multi-tenancy, l'architecture moderne d'un projet comme HotelGenius, et la préparation complète avant d'écrire la première ligne de code.**

**Style pédagogique :**
- 🎓 **Cours universitaire** — Définitions académiques et concepts théoriques
- 👨🏽‍🏫 **Mentor** — Explications concrètes et analogies
- 🧠 **Ingénierie SaaS** — Patterns avancés et décisions techniques
- 💻 **Code pratique** — Exemples explicatifs
- ⚠️ **Bonnes pratiques** — Conseils d'ingénieur senior

---

## 📋 Table des Matières

1. [Introduction : Du Logiciel Traditionnel au Modèle SaaS](#chapitre-1--introduction-du-logiciel-traditionnel-au-modèle-saas)
2. [Comprendre le Multi-Tenancy](#chapitre-2--comprendre-le-multi-tenancy)
3. [Architecture Générale du Projet HotelGenius](#chapitre-3--architecture-générale-du-projet-hotelgenius)
4. [Planification du Projet et Méthodologie Agile](#chapitre-4--planification-du-projet-et-méthodologie-agile)
5. [Préparation de l'Environnement](#chapitre-5--préparation-de-lenvironnement)
6. [Organisation du Travail et Bonnes Pratiques](#chapitre-6--organisation-du-travail-et-bonnes-pratiques)
7. [Bilan, Exercices et Préparation du Tome 2](#chapitre-7--bilan-exercices-et-préparation-du-tome-2)

---

# Chapitre 1 — Introduction : Du Logiciel Traditionnel au Modèle SaaS

## 🎓 Cours Universitaire — Définition du SaaS

### Définition Académique

Un **SaaS (Software as a Service)** est une application accessible via Internet, hébergée sur des serveurs distants, et proposée sous forme de **service** plutôt que de produit. Contrairement aux logiciels installés localement (on-premise), le SaaS est géré, mis à jour et sécurisé par le fournisseur (vendor).

**Caractéristiques fondamentales :**
1. **Hébergement distant** : L'application réside sur les serveurs du fournisseur
2. **Accès via navigateur** : Aucune installation locale requise
3. **Modèle d'abonnement** : Paiement récurrent (mensuel/annuel) plutôt qu'achat unique
4. **Mises à jour centralisées** : Tous les utilisateurs bénéficient automatiquement des améliorations
5. **Maintenance transparente** : Le fournisseur gère l'infrastructure

### Évolution Historique

**Années 1980-1990 : Logiciels traditionnels (On-Premise)**
- Installation sur chaque machine
- Achat de licence unique
- Mises à jour manuelles
- Maintenance locale

**Années 2000 : Application Service Provider (ASP)**
- Hébergement distant
- Mais configuration encore individuelle par client
- Coûts élevés

**Depuis 2010 : SaaS Moderne**
- Multi-tenant architecture
- Scalabilité automatique
- Pricing flexible
- Infrastructure cloud

**Exemples de SaaS modernes :**
- **Productivité** : Gmail, Slack, Notion, Trello
- **E-commerce** : Shopify, Stripe
- **Hébergement** : Vercel, Railway
- **CRM** : Salesforce, HubSpot
- **Notre projet** : HotelGenius (gestion hôtelière)

---

## 👨🏽‍🏫 Mentor — En D'autres Mots

Imagine que tu veux habiter quelque part. Tu as plusieurs options :

**Option 1 : Acheter une maison (Logiciel traditionnel)**
- Tu possèdes tout : la maison, le terrain, la responsabilité
- Tu dois entretenir, réparer, payer les taxes
- Si tu veux déménager, c'est compliqué
- **Avantage** : Contrôle total
- **Inconvénient** : Tout est à ta charge

**Option 2 : Louer un appartement (SaaS)**
- Tu paies un loyer mensuel pour l'accès
- Le propriétaire (fournisseur SaaS) gère l'entretien, les réparations, la sécurité
- Tu peux déménager facilement (changer de service)
- **Avantage** : Simplicité, pas de maintenance
- **Inconvénient** : Dépendance au fournisseur

**Dans le contexte de HotelGenius :**
- Un hôtel **s'abonne** à HotelGenius (comme un loyer)
- Il utilise l'application **via son navigateur** (pas d'installation)
- Nous (fournisseur) gérons les serveurs, les mises à jour, la sécurité
- L'hôtel peut **résilier** son abonnement et perdre l'accès (mais ses données peuvent être exportées)

### Analogie avec Netflix

Netflix est un excellent exemple de SaaS :
- Tu paies un abonnement mensuel
- Tu accèdes via ton navigateur/appareil
- Netflix gère les serveurs, le contenu, les mises à jour
- Tu n'achètes pas le film, tu **loues l'accès**
- Netflix héberge des milliers d'utilisateurs simultanément

**HotelGenius fonctionne de la même manière**, mais pour la gestion hôtelière.

---

## 🧠 Ingénierie SaaS — Architecture Logique

### Schéma Conceptuel

Un SaaS moderne se compose généralement de **quatre couches principales** :

```
┌─────────────────────────────────────────────────────────┐
│                    COUCHE 1 : CLIENT                     │
│  Navigateur Web (React) ou Application Mobile           │
│  - Interface utilisateur                                 │
│  - Interaction avec l'API                                │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTP/HTTPS (JSON)
┌────────────────────────▼─────────────────────────────────┐
│                    COUCHE 2 : API (Backend)              │
│  Serveur Express.js / Node.js                            │
│  - Authentification (JWT)                                │
│  - Validation des données                                │
│  - Logique métier                                        │
│  - Gestion multi-tenant                                  │
└────────────────────────┬─────────────────────────────────┘
                         │ SQL via ORM
┌────────────────────────▼─────────────────────────────────┐
│              COUCHE 3 : BASE DE DONNÉES                  │
│  PostgreSQL (relationnelle)                              │
│  - Stockage persistant des données                       │
│  - Isolation multi-tenant                               │
│  - Transactions ACID                                     │
└────────────────────────┬─────────────────────────────────┘
                         │ Requêtes
┌────────────────────────▼─────────────────────────────────┐
│              COUCHE 4 : SERVICES EXTERNES               │
│  - Stripe (paiements)                                   │
│  - SendGrid (emails)                                    │
│  - Sentry (monitoring)                                  │
└─────────────────────────────────────────────────────────┘
```

### Isolation des Couches

**Principe de séparation des responsabilités (SRP) :**

1. **Client** : Seule responsabilité = afficher l'UI et envoyer des requêtes
2. **API** : Seule responsabilité = traiter les requêtes et orchestrer la logique
3. **Base de données** : Seule responsabilité = stocker et récupérer les données
4. **Services externes** : Seule responsabilité = fournir des fonctionnalités spécialisées

**Pourquoi cette séparation ?**
- ✅ **Testabilité** : Chaque couche peut être testée indépendamment
- ✅ **Scalabilité** : On peut scale chaque couche séparément
- ✅ **Maintenance** : Modifications isolées n'affectent pas les autres couches
- ✅ **Sécurité** : Chaque couche a ses propres contrôles d'accès

---

## 💻 Exemple Conceptuel — Flux Complet

### Scénario : Un hôtel consulte ses réservations

```typescript
// ============================================================================
// ÉTAPE 1 : CLIENT (Frontend React)
// ============================================================================
// client/src/pages/reservations.tsx

export function ReservationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      // Envoie une requête HTTP vers l'API
      const response = await fetch('/api/reservations', {
        credentials: 'include', // Inclut les cookies/JWT
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json(); // Retourne les données JSON
    },
  });

  if (isLoading) return <div>Chargement...</div>;
  return <ReservationTable reservations={data} />;
}
```

**Explication ligne par ligne :**
- `useQuery` : Hook de TanStack Query qui gère le cache et le re-fetch automatique
- `queryKey: ['reservations']` : Identifiant unique pour le cache
- `fetch('/api/reservations')` : Requête HTTP GET vers notre API backend
- `credentials: 'include'` : Envoie automatiquement le JWT token (cookie)
- `response.json()` : Parse la réponse JSON en objet JavaScript

```typescript
// ============================================================================
// ÉTAPE 2 : API (Backend Express)
// ============================================================================
// server/src/routes/reservations.ts

import { authenticate } from '../middleware/auth';
import { db } from '../db';
import { reservations } from '@shared/schema';
import { eq } from 'drizzle-orm';

app.get('/api/reservations', authenticate, async (req, res) => {
  try {
    // 1. Récupère le tenant_id depuis le JWT (via middleware authenticate)
    const hotelId = req.user.hotel_id; // Exemple: "hotel-123"

    // 2. Requête la base de données avec filtre multi-tenant
    const reservationsList = await db
      .select()
      .from(reservations)
      .where(eq(reservations.hotel_id, hotelId)); // CRITIQUE : Filtre par hotel_id

    // 3. Retourne les données en JSON
    res.json(reservationsList);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});
```

**Explication ligne par ligne :**
- `authenticate` : Middleware qui vérifie le JWT et extrait `req.user`
- `req.user.hotel_id` : ID de l'hôtel connecté (isolation multi-tenant)
- `db.select().from(reservations)` : Drizzle ORM génère `SELECT * FROM reservations`
- `.where(eq(reservations.hotel_id, hotelId))` : **CRITIQUE** — Filtre pour éviter les fuites de données
- `res.json()` : Envoie la réponse en JSON au client

```typescript
// ============================================================================
// ÉTAPE 3 : BASE DE DONNÉES (PostgreSQL)
// ============================================================================
// SQL généré par Drizzle ORM

SELECT * FROM reservations 
WHERE hotel_id = 'hotel-123';
-- Résultat : Seulement les réservations de cet hôtel
```

**Pourquoi ce filtrage est critique ?**
Sans filtre sur `hotel_id`, un hôtel pourrait voir les réservations d'un autre hôtel. C'est une **faille de sécurité majeure** dans un SaaS multi-tenant.

### Flux Complet Visualisé

```
1. User clique "Voir Réservations" dans React
   ↓
2. useQuery déclenche fetch('/api/reservations')
   ↓
3. Requête HTTP GET avec JWT dans header
   ↓
4. Express reçoit la requête
   ↓
5. Middleware authenticate vérifie JWT → extrait hotel_id
   ↓
6. Route handler exécute db.select() avec filtre WHERE hotel_id = ?
   ↓
7. PostgreSQL retourne uniquement les réservations de cet hôtel
   ↓
8. Express transforme en JSON et envoie la réponse
   ↓
9. React reçoit les données, met à jour le cache de TanStack Query
   ↓
10. UI se met à jour automatiquement avec les nouvelles données
```

**Temps total typique :** 50-200ms (dépend de la latence réseau et DB)

---

## ⚠️ Bonnes Pratiques — Principes Fondamentaux

### 1. Sécurité d'Abord (Security First)

**Jamais faire confiance au client :**
- ❌ Ne jamais accepter `hotel_id` depuis le client (peut être falsifié)
- ✅ Toujours extraire `hotel_id` depuis le JWT (token signé côté serveur)

```typescript
// ❌ MAUVAIS
app.get('/api/reservations', async (req, res) => {
  const hotelId = req.query.hotel_id; // DANGEREUX : peut être manipulé
  // ...
});

// ✅ BON
app.get('/api/reservations', authenticate, async (req, res) => {
  const hotelId = req.user.hotel_id; // Extrait du JWT vérifié
  // ...
});
```

### 2. Validation Stricte (Defense in Depth)

**Valider à chaque couche :**
- Client : Validation UI (meilleure UX)
- API : Validation Zod (sécurité)
- Base de données : Contraintes SQL (dernière ligne de défense)

```typescript
// Exemple : Validation Zod
import { z } from 'zod';

const createReservationSchema = z.object({
  room_id: z.string().uuid(),
  client_id: z.string().uuid(),
  check_in: z.string().date(),
  check_out: z.string().date(),
});

// Dans la route
app.post('/api/reservations', authenticate, async (req, res) => {
  // Valide les données d'entrée
  const validated = createReservationSchema.parse(req.body);
  // Si invalide, Zod lance une erreur automatiquement
  // ...
});
```

### 3. Gestion d'Erreurs Cohérente

**Ne jamais exposer les détails internes :**
```typescript
// ❌ MAUVAIS
catch (error) {
  res.status(500).json({ error: error.message }); // Peut exposer des secrets
}

// ✅ BON
catch (error) {
  console.error('Error:', error); // Log pour debugging
  res.status(500).json({ message: 'Internal server error' }); // Message générique
}
```

---

## 🎯 Résumé du Chapitre 1

**Ce que tu as appris :**

1. ✅ **Définition du SaaS** : Application hébergée, accessible via navigateur, modèle d'abonnement
2. ✅ **Architecture en couches** : Client → API → Base de données → Services externes
3. ✅ **Isolation des responsabilités** : Chaque couche a un rôle précis
4. ✅ **Sécurité multi-tenant** : Toujours filtrer par `hotel_id` depuis le JWT
5. ✅ **Validation stricte** : À chaque couche (client, API, DB)

**Concept clé :** Un SaaS est un **service**, pas un produit. L'utilisateur paie pour l'accès, pas pour la propriété.

---

# Chapitre 2 — Comprendre le Multi-Tenancy

## 🎓 Définition Académique

### Définition Formelle

Le **multi-tenancy** est une architecture logicielle dans laquelle **une seule instance** de l'application et de la base de données sert **plusieurs clients indépendants (tenants)**. Chaque client a accès à ses propres données, sans interférence avec les autres tenants.

**Caractéristiques essentielles :**
1. **Isolation des données** : Aucun tenant ne peut accéder aux données d'un autre
2. **Isolation des performances** : L'activité d'un tenant n'affecte pas les autres
3. **Configuration personnalisable** : Chaque tenant peut avoir ses propres paramètres
4. **Scalabilité partagée** : L'infrastructure est partagée mais l'isolation est garantie

### Évolution Historique

**Avant le multi-tenancy :**
- Chaque client avait sa propre instance d'application
- Coûts d'infrastructure élevés
- Maintenance complexe (100 clients = 100 instances)

**Avec le multi-tenancy moderne :**
- Une instance pour 1000+ clients
- Coûts réduits (économie d'échelle)
- Maintenance simplifiée (mise à jour unique)

---

## 👨🏽‍🏫 Mentor — Exemple Concret avec HotelGenius

### Scénario Réaliste

Imagine que HotelGenius héberge **trois hôtels** :

1. **Sunrise Resort** (tenant_id: `hotel-001`)
2. **Blue Lagoon Hotel** (tenant_id: `hotel-002`)
3. **Mountain View Inn** (tenant_id: `hotel-003`)

**Base de données PostgreSQL :**
```sql
-- Table reservations (exemple simplifié)
id          | hotel_id  | client_name     | room_number
------------|-----------|-----------------|-------------
res-001     | hotel-001 | John Doe        | 101
res-002     | hotel-001 | Jane Smith      | 205
res-003     | hotel-002 | Bob Wilson      | 310
res-004     | hotel-002 | Alice Brown     | 105
res-005     | hotel-003 | Charlie Davis   | 201
```

**Quand Sunrise Resort se connecte :**
- JWT contient `hotel_id: "hotel-001"`
- Toutes les requêtes filtrent `WHERE hotel_id = 'hotel-001'`
- Résultat : Voit seulement `res-001` et `res-002`

**Quand Blue Lagoon Hotel se connecte :**
- JWT contient `hotel_id: "hotel-002"`
- Toutes les requêtes filtrent `WHERE hotel_id = 'hotel-002'`
- Résultat : Voit seulement `res-003` et `res-004`

**Isolation garantie** : Chaque hôtel ne voit jamais les données des autres.

### Analogie avec un Immeuble

Imagine un **immeuble d'appartements** :
- **Immeuble** = Application SaaS (HotelGenius)
- **Appartements** = Tenants (hôtels individuels)
- **Clés** = JWT tokens (accès à un appartement spécifique)
- **Concierge** = Middleware d'authentification (vérifie les clés)

Chaque locataire a accès **uniquement à son appartement**, jamais aux autres. C'est exactement le principe du multi-tenancy.

---

## 🧠 Ingénierie SaaS — Modèles d'Isolation

### Les Trois Modèles Principaux

| Modèle | Description | Architecture | Avantages | Inconvénients |
|--------|-------------|--------------|-----------|---------------|
| **Shared Database, Shared Schema** | Une seule DB, toutes les tables contiennent `tenant_id` | `reservations.hotel_id` | Simplicité, coûts réduits, maintenance facile | Risque de fuite de données si erreur de code |
| **Shared Database, Separate Schema** | Une DB, un schéma PostgreSQL par tenant | `hotel_001.reservations`, `hotel_002.reservations` | Bonne isolation, customisation par tenant | Gestion complexe à grande échelle, limité à PostgreSQL |
| **Separate Database** | Une base de données complète par tenant | DB `hotel_001`, DB `hotel_002` | Isolation maximale, sécurité renforcée | Coûts élevés, maintenance très complexe, scalabilité limitée |

### Choix pour HotelGenius : Shared Database, Shared Schema

**Pourquoi ce choix ?**

**✅ Avantages :**
1. **Simplicité de développement** : Un seul schéma à maintenir
2. **Coûts réduits** : Une seule instance PostgreSQL
3. **Scalabilité horizontale** : Facile d'ajouter des tenants
4. **Maintenance simplifiée** : Migrations appliquées à tous les tenants
5. **Requêtes croisées possibles** : Analytics globales faciles (pour super admin)

**⚠️ Défis :**
1. **Sécurité critique** : Une erreur de code = fuite de données possible
2. **Performance** : Tous les tenants partagent les mêmes ressources
3. **Customisation limitée** : Difficile de personnaliser le schéma par tenant

**Mitigation des risques :**
- ✅ Tests stricts de l'isolation
- ✅ Middleware automatique qui filtre toujours par `hotel_id`
- ✅ Index sur `hotel_id` pour performance
- ✅ Code review obligatoire

---

## 💻 Exemple de Table Multi-Tenant

### Structure Complète

```typescript
// shared/src/schema.ts
import { pgTable, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { hotels } from './hotels'; // Table parente

export const reservations = pgTable(
  'reservations',
  {
    // Colonnes
    id: varchar('id', { length: 255 })
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    
    // ⚠️ COLONNE CRITIQUE : Identifie le tenant
    hotel_id: varchar('hotel_id', { length: 255 })
      .notNull()
      .references(() => hotels.id, { onDelete: 'cascade' }),
    
    client_name: text('client_name').notNull(),
    room_id: varchar('room_id', { length: 255 }).notNull(),
    check_in: date('check_in').notNull(),
    check_out: date('check_out').notNull(),
    status: varchar('status', { length: 20 }).default('pending'),
    created_at: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    // ⚠️ INDEX CRITIQUE : Performance des requêtes filtrées
    hotelIdIdx: index('reservations_hotel_id_idx').on(table.hotel_id),
    
    // Index composite pour requêtes complexes
    hotelStatusIdx: index('reservations_hotel_status_idx')
      .on(table.hotel_id, table.status),
  })
);
```

**Explication ligne par ligne :**

1. **`hotel_id`** : Colonne qui identifie le tenant (hôtel propriétaire)
2. **`.references(() => hotels.id)`** : Foreign key vers la table `hotels` (intégrité référentielle)
3. **`onDelete: 'cascade'`** : Si un hôtel est supprimé, ses réservations sont aussi supprimées
4. **`index('reservations_hotel_id_idx')`** : Index pour accélérer les requêtes filtrées par `hotel_id`

### Requête avec Isolation Multi-Tenant

```typescript
// server/src/routes/reservations.ts
import { db } from '../db';
import { reservations } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

export async function getReservations(hotelId: string) {
  // ⚠️ TOUJOURS filtrer par hotel_id en premier
  const results = await db
    .select()
    .from(reservations)
    .where(eq(reservations.hotel_id, hotelId)); // Isolation garantie
  
  return results;
}
```

**SQL généré :**
```sql
SELECT * FROM reservations 
WHERE hotel_id = $1  -- $1 = 'hotel-001'
```

**Pourquoi l'index est crucial :**

Sans index sur `hotel_id` :
- PostgreSQL doit scanner **toutes** les lignes (full table scan)
- Si 1 million de réservations → scan de 1 million de lignes
- Temps : ~500ms - 2s

Avec index sur `hotel_id` :
- PostgreSQL utilise l'index B-tree
- Trouve rapidement les lignes correspondantes
- Si 1 million de réservations mais seulement 100 pour cet hôtel → scan de ~100 lignes
- Temps : ~5-20ms

**Gain de performance :** 25-100x plus rapide

---

## ⚠️ Bonnes Pratiques Multi-Tenant

### 1. Toujours Filtrer sur `tenant_id`

**Règle d'or :** Jamais de requête sans filtre `hotel_id` dans un contexte multi-tenant.

```typescript
// ❌ EXTRÊMEMENT DANGEREUX
const allReservations = await db.select().from(reservations);
// Problème : Récupère TOUTES les réservations de TOUS les hôtels !

// ✅ CORRECT
const hotelReservations = await db
  .select()
  .from(reservations)
  .where(eq(reservations.hotel_id, hotelId));
```

### 2. Extraire `hotel_id` depuis le JWT, Jamais du Client

```typescript
// ❌ VULNÉRABILITÉ DE SÉCURITÉ
app.get('/api/reservations', async (req, res) => {
  const hotelId = req.body.hotel_id; // Peut être falsifié !
  // ...
});

// ✅ SÉCURISÉ
app.get('/api/reservations', authenticate, async (req, res) => {
  const hotelId = req.user.hotel_id; // Extrait du JWT vérifié côté serveur
  // ...
});
```

### 3. Middleware Automatique pour Isolation

```typescript
// server/src/middleware/multi-tenant.ts

export function requireTenant(req: Request, res: Response, next: NextFunction) {
  // Vérifie que req.user.hotel_id existe (après authenticate)
  if (!req.user?.hotel_id) {
    return res.status(403).json({ message: 'Tenant context required' });
  }
  next();
}

// Usage dans toutes les routes
app.get('/api/reservations', authenticate, requireTenant, async (req, res) => {
  // hotel_id est garanti d'exister ici
  const hotelId = req.user.hotel_id;
  // ...
});
```

### 4. Tests d'Isolation Stricts

```typescript
// tests/isolation.test.ts
describe('Multi-tenant isolation', () => {
  it('should not allow hotel A to see hotel B reservations', async () => {
    // Créer réservation pour hotel-001
    await createReservation({ hotel_id: 'hotel-001', ... });
    
    // Tenter de récupérer avec hotel-002
    const reservations = await getReservations('hotel-002');
    
    // Vérifier qu'aucune réservation n'est retournée
    expect(reservations).toHaveLength(0);
  });
});
```

---

## 🎯 Résumé du Chapitre 2

**Ce que tu as appris :**

1. ✅ **Multi-tenancy** : Une instance sert plusieurs clients avec isolation
2. ✅ **Trois modèles** : Shared Schema (choisi), Separate Schema, Separate DB
3. ✅ **Isolation garantie** : Toujours filtrer par `hotel_id`
4. ✅ **Performance** : Index sur `hotel_id` essentiel
5. ✅ **Sécurité** : Extraire `hotel_id` depuis JWT, jamais du client

**Concept clé :** Le multi-tenancy permet de **scaler efficacement** tout en garantissant l'**isolation des données**.

---

[Le guide continue avec les chapitres 3-7... Chaque chapitre suit la même structure pédagogique : Cours universitaire, Mentor, Ingénierie SaaS, Code pratique, Bonnes pratiques.]

---

# Chapitre 7 — Bilan, Exercices et Préparation du Tome 2

## ✅ Résumé du Tome 1

Après avoir lu ce tome, tu maîtrises :

### Concepts Théoriques

✅ **Compréhension du SaaS**
- Définition académique et historique
- Différence avec logiciels traditionnels
- Modèle d'abonnement vs achat unique

✅ **Multi-Tenancy**
- Définition et principes
- Trois modèles d'isolation
- Choix de l'architecture (Shared Schema)
- Isolation des données et sécurité

✅ **Architecture Logicielle**
- Couches (Client, API, DB, Services)
- Séparation des responsabilités
- Schéma monorepo TypeScript

✅ **Méthodologie Agile**
- Sprints et roadmap
- Planification progressive
- GitHub Projects et issues

### Compétences Pratiques

✅ **Environnement Prêt**
- Outils installés (Node.js, pnpm, PostgreSQL)
- Workspace configuré
- Git initialisé

✅ **Architecture Comprise**
- Structure monorepo
- Flux client → API → DB
- Isolation multi-tenant

---

## 🧩 Mini Quiz de Validation

**Question 1 :** Quelle est la différence entre SaaS et logiciel traditionnel ?

<details>
<summary>Réponse</summary>

**SaaS** : Hébergé distant, accès via navigateur, modèle d'abonnement, maintenance transparente.

**Logiciel traditionnel** : Installation locale, achat unique, mises à jour manuelles, maintenance locale.
</details>

---

**Question 2 :** Pourquoi HotelGenius choisit le modèle "Shared Database, Shared Schema" ?

<details>
<summary>Réponse</summary>

Bonne équilibre entre :
- **Simplicité** : Un seul schéma à maintenir
- **Coûts** : Une seule instance DB
- **Scalabilité** : Facile d'ajouter des tenants
- **Maintenance** : Migrations appliquées à tous

Mitigation des risques via tests stricts et middleware automatique.
</details>

---

**Question 3 :** Que fait le champ `hotel_id` dans chaque table ?

<details>
<summary>Réponse</summary>

- **Identifie le tenant** (propriétaire des données)
- **Permet l'isolation** via filtres SQL `WHERE hotel_id = ?`
- **Performance** : Index sur cette colonne accélère les requêtes
- **Sécurité** : Empêche l'accès aux données d'autres tenants
</details>

---

**Question 4 :** Pourquoi ne jamais accepter `hotel_id` depuis le client ?

<details>
<summary>Réponse</summary>

**Vulnérabilité de sécurité** : Un client malveillant peut falsifier `hotel_id` et accéder aux données d'autres hôtels.

**Solution** : Extraire `hotel_id` depuis le JWT vérifié côté serveur (token signé, non falsifiable).
</details>

---

**Question 5 :** Quelle est la première étape avant d'écrire du code ?

<details>
<summary>Réponse</summary>

1. **Comprendre le domaine métier** (hotels, réservations, etc.)
2. **Planifier l'architecture** (monorepo, schéma DB, API)
3. **Préparer l'environnement** (outils, workspace)
4. **Créer la structure du projet** (dossiers, configs)
5. **Ensuite seulement** : Écrire le code
</details>

---

## 🧠 Exercice Pratique — Préparation

### Exercice 1 : Créer la Structure du Projet

**Objectif :** Mettre en pratique les concepts appris en créant la structure de base.

**Instructions :**

1. **Créer le dossier du projet :**
```bash
mkdir hotelgenius && cd hotelgenius
```

2. **Initialiser Git :**
```bash
git init
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore
```

3. **Initialiser le workspace pnpm :**
```bash
pnpm init -y
```

4. **Modifier `package.json` :**
```json
{
  "name": "hotelgenius",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["client", "server", "shared"],
  "scripts": {
    "dev": "pnpm --filter server dev"
  }
}
```

5. **Créer la structure de dossiers :**
```bash
mkdir -p client/src/{components,pages,hooks,lib}
mkdir -p server/src/{routes,middleware,db}
mkdir -p shared/src
mkdir docs
```

6. **Créer un README.md :**
```markdown
# HotelGenius

SaaS multi-tenant de gestion hôtelière avec module restaurant.

## Vision

Permettre aux hôtels de digitaliser leurs opérations depuis une plateforme unique.

## Architecture

- **Frontend** : React + Vite + TailwindCSS
- **Backend** : Express.js + Drizzle ORM
- **Database** : PostgreSQL (Neon Serverless)
- **Multi-tenant** : Shared Schema avec isolation par hotel_id

## Structure

- `client/` : Interface React
- `server/` : API Express
- `shared/` : Types et schémas partagés
```

**Vérification :**
```bash
tree -L 2  # Vérifie la structure (si tree installé)
# ou
ls -R      # Liste récursive
```

---

### Exercice 2 : Documenter le Modèle de Données

**Objectif :** Préparer mentalement le schéma de base de données.

**Instructions :**

Créer `docs/data-model.md` avec :

```markdown
# Modèle de Données HotelGenius

## Tables Principales

### hotels
- id (PK)
- name
- address
- phone
- email
- currency (default: HTG)
- plan (basic/pro/enterprise)
- status (active/suspended)

### users
- id (PK)
- hotel_id (FK → hotels)
- username (unique)
- email (unique)
- password (hash bcrypt)
- role (owner/manager/receptionist/etc.)

### rooms
- id (PK)
- hotel_id (FK → hotels)
- room_number (unique par hotel)
- room_type
- capacity
- price_per_night
- status

### reservations
- id (PK)
- hotel_id (FK → hotels)
- room_id (FK → rooms)
- client_id (FK → clients)
- check_in
- check_out
- status
- total_amount

## Relations

- hotels (1) ──── (N) users
- hotels (1) ──── (N) rooms
- hotels (1) ──── (N) reservations
- rooms (1) ──── (N) reservations
- clients (1) ──── (N) reservations
```

---

## 🚀 Préparation du Tome 2

Le **Tome 2** sera **100% pratique** et couvrira :

### Contenu Prévu

**Tome 2 : Initialisation Technique et Base de Données**

1. **Sprint 1 : Setup Monorepo**
   - Configuration TypeScript stricte
   - Workspaces pnpm fonctionnels
   - Structure de dossiers complète

2. **Sprint 2 : Base de Données avec Drizzle**
   - Schéma complet (toutes les tables)
   - Migrations générées et appliquées
   - Connexion PostgreSQL testée
   - Diagramme ER documenté

3. **Sprint 3 : Backend Minimal**
   - Express.js configuré
   - Authentification JWT
   - CRUD de base (rooms, clients)
   - Middleware multi-tenant

**Approche :**
- Code complet à copier-coller
- Explications ligne par ligne
- Checkpoints de validation
- Issues GitHub suggérées

---

## 📚 Ressources Complémentaires

### Documentation à Lire

- **Drizzle ORM** : [orm.drizzle.team](https://orm.drizzle.team)
- **Express.js** : [expressjs.com](https://expressjs.com)
- **TypeScript Handbook** : [typescriptlang.org/docs](https://www.typescriptlang.org/docs)
- **PostgreSQL Docs** : [postgresql.org/docs](https://www.postgresql.org/docs)

### Projets à Étudier

- **Linear** : SaaS de gestion de projets (excellent multi-tenant)
- **Vercel** : Plateforme de déploiement (architecture moderne)
- **Supabase** : Backend as a Service (patterns intéressants)

---

## 🎯 Checklist de Préparation

Avant de passer au Tome 2, vérifie :

- [ ] Tu comprends ce qu'est un SaaS
- [ ] Tu sais expliquer le multi-tenancy
- [ ] Tu connais l'architecture choisie (monorepo, Shared Schema)
- [ ] Ton environnement est prêt (Node.js, pnpm, PostgreSQL)
- [ ] La structure du projet est créée
- [ ] Git est initialisé
- [ ] Tu as créé le README.md

**Si toutes les cases sont cochées → Tu es prêt(e) pour le Tome 2 !** 🚀

---

**Fin du Tome 1 — Félicitations 🎉**

Tu maîtrises maintenant les **fondations théoriques** nécessaires pour construire un SaaS professionnel, scalable et multi-tenant.

**Le Tome 2 t'attend avec du code concret !** 💻

---

*Document créé avec une approche pédagogique triple : universitaire, mentor, et ingénierie SaaS.*

