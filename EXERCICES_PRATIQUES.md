# 🎯 Exercices Pratiques - HotelGenius

> **Exercices progressifs pour maîtriser chaque concept et reconstruire HotelGenius**

Ce guide contient des exercices pratiques pour chaque module, avec instructions détaillées et questions de réflexion.

---

## 📋 Table des Matières

1. [Module 1 : Fondations & Base de Données](#module-1--fondations--base-de-données)
2. [Module 2 : Storage Layer (Repository Pattern)](#module-2--storage-layer-repository-pattern)
3. [Module 3 : Authentification & Autorisation](#module-3--authentification--autorisation)
4. [Module 4 : API Routes - Module Hôtel](#module-4--api-routes---module-hôtel)
5. [Module 5 : API Routes - Module Restaurant](#module-5--api-routes---module-restaurant)
6. [Module 6 : Intégration Frontend-Backend](#module-6--intégration-frontend-backend)
7. [Module 7 : Tests & Qualité](#module-7--tests--qualité)
8. [Module 8 : Déploiement & Production](#module-8--déploiement--production)

---

## Module 1 : Fondations & Base de Données

### Objectif
Créer le schéma de base de données complet avec toutes les tables nécessaires pour HotelGenius.

### Exercice 1.1 : Analyser les Besoins

**Instructions :**
1. Lis toutes les pages frontend (`client/src/pages/*.tsx`)
2. Identifie toutes les entités nécessaires (Hôtel, Chambre, Réservation, Client, etc.)
3. Liste les propriétés de chaque entité
4. Identifie les relations entre les entités

**Questions de réflexion :**
- Quelles tables sont nécessaires pour le module hôtel ?
- Quelles tables sont nécessaires pour le module restaurant ?
- Comment modéliser la relation multi-tenant (isolation par hôtel) ?

**Livrable :**
Un document (ou schéma ER) listant toutes les tables avec leurs colonnes.

---

### Exercice 1.2 : Créer le Schéma Drizzle - Tables Hôtel

**Instructions :**
Dans `shared/schema.ts`, crée les tables suivantes :

1. **Table `hotels`**
   ```typescript
   - id: varchar (primary key, UUID)
   - name: text (not null)
   - address: text
   - phone: text
   - email: text
   - currency: varchar(3) (default: "HTG")
   - plan: varchar(20) (default: "basic") // "basic", "pro", "enterprise"
   - status: varchar(20) (default: "active") // "active", "suspended"
   - created_at: timestamp (default: now)
   ```

2. **Table `users`** (étendre l'existant)
   ```typescript
   - id: varchar (primary key, UUID)
   - hotel_id: varchar (foreign key → hotels.id, nullable pour super admin)
   - username: text (not null, unique)
   - email: text (unique)
   - password: text (not null) // hash bcrypt
   - role: varchar(20) (default: "receptionist") // "owner", "manager", "receptionist", "housekeeping", "accountant", "super_admin"
   - status: varchar(20) (default: "active")
   - created_at: timestamp (default: now)
   ```

3. **Table `rooms`**
   ```typescript
   - id: varchar (primary key, UUID)
   - hotel_id: varchar (foreign key → hotels.id, not null)
   - room_number: text (not null)
   - room_type: text (not null) // "Standard", "Deluxe", "Suite"
   - capacity: integer (not null)
   - price_per_night: integer (not null)
   - status: varchar(20) (default: "available") // "available", "occupied", "cleaning", "maintenance"
   - notes: text
   - created_at: timestamp (default: now)
   ```

4. **Table `clients`**
   ```typescript
   - id: varchar (primary key, UUID)
   - hotel_id: varchar (foreign key → hotels.id, not null)
   - name: text (not null)
   - phone: text
   - email: text
   - id_card_number: text
   - address: text
   - notes: text
   - created_at: timestamp (default: now)
   ```

5. **Table `reservations`**
   ```typescript
   - id: varchar (primary key, UUID)
   - hotel_id: varchar (foreign key → hotels.id, not null)
   - room_id: varchar (foreign key → rooms.id, not null)
   - client_id: varchar (foreign key → clients.id, not null)
   - check_in: date (not null)
   - check_out: date (not null)
   - status: varchar(20) (default: "pending") // "pending", "confirmed", "checked_in", "checked_out", "cancelled"
   - total_amount: integer (not null)
   - currency: varchar(3) (default: "HTG")
   - payment_status: varchar(20) (default: "pending") // "pending", "partial", "paid", "refunded"
   - notes: text
   - created_at: timestamp (default: now)
   ```

6. **Table `payments`**
   ```typescript
   - id: varchar (primary key, UUID)
   - hotel_id: varchar (foreign key → hotels.id, not null)
   - reservation_id: varchar (foreign key → reservations.id, nullable) // nullable pour paiements standalone
   - amount: integer (not null)
   - currency: varchar(3) (default: "HTG")
   - method: varchar(20) (not null) // "cash", "card", "transfer", "stripe"
   - status: varchar(20) (default: "pending") // "pending", "completed", "failed", "refunded"
   - stripe_payment_id: text (nullable) // pour paiements Stripe
   - notes: text
   - created_at: timestamp (default: now)
   ```

7. **Table `invoices`**
   ```typescript
   - id: varchar (primary key, UUID)
   - hotel_id: varchar (foreign key → hotels.id, not null)
   - payment_id: varchar (foreign key → payments.id, nullable)
   - reservation_id: varchar (foreign key → reservations.id, nullable)
   - invoice_number: text (not null, unique)
   - pdf_url: text
   - created_at: timestamp (default: now)
   ```

**Exercices spécifiques :**
1. Ajoute des contraintes d'unicité : `room_number` doit être unique par hôtel
2. Ajoute des indexes sur les colonnes fréquemment recherchées (`hotel_id`, `room_id`, `client_id`)
3. Crée les schémas Zod pour chaque table (ex: `insertRoomSchema`, `insertReservationSchema`)

**Validation :**
- Exécute `npm run db:push` pour créer les tables dans la base de données
- Vérifie qu'il n'y a pas d'erreurs

---

### Exercice 1.3 : Créer le Schéma - Tables Restaurant

**Instructions :**
Ajoute les tables pour le module restaurant :

1. **Table `products`** (menu du restaurant)
   ```typescript
   - id: varchar (primary key, UUID)
   - hotel_id: varchar (foreign key → hotels.id, not null)
   - name: text (not null)
   - category: text (not null) // "Appetizer", "Main", "Dessert", "Beverage"
   - price: integer (not null)
   - available: boolean (default: true)
   - description: text
   - created_at: timestamp (default: now)
   ```

2. **Table `inventory_items`** (stock)
   ```typescript
   - id: varchar (primary key, UUID)
   - hotel_id: varchar (foreign key → hotels.id, not null)
   - product_id: varchar (foreign key → products.id, nullable) // nullable pour produits non-menu
   - name: text (not null)
   - category: text // "Food", "Beverage", "Cleaning", "Other"
   - current_quantity: integer (default: 0)
   - unit: text (default: "piece") // "piece", "kg", "liter", "bottle"
   - alert_threshold: integer (default: 10) // Alerte si quantity < threshold
   - created_at: timestamp (default: now)
   ```

3. **Table `sales`** (ventes)
   ```typescript
   - id: varchar (primary key, UUID)
   - hotel_id: varchar (foreign key → hotels.id, not null)
   - product_id: varchar (foreign key → products.id, not null)
   - employee_id: varchar (foreign key → users.id, nullable) // serveur qui a fait la vente
   - reservation_id: varchar (foreign key → reservations.id, nullable) // facturation au séjour
   - quantity: integer (not null)
   - unit_price: integer (not null)
   - total: integer (not null) // quantity * unit_price
   - payment_method: varchar(20) (not null) // "cash", "card", "room_charge"
   - created_at: timestamp (default: now)
   ```

4. **Table `purchases`** (achats/réapprovisionnement)
   ```typescript
   - id: varchar (primary key, UUID)
   - hotel_id: varchar (foreign key → hotels.id, not null)
   - inventory_item_id: varchar (foreign key → inventory_items.id, not null)
   - supplier_name: text
   - quantity: integer (not null)
   - unit_cost: integer (not null)
   - total_cost: integer (not null)
   - purchase_date: date (not null)
   - created_at: timestamp (default: now)
   ```

**Questions de réflexion :**
- Pourquoi `product_id` dans `inventory_items` est nullable ?
- Comment gérer les alertes de stock (low stock) ?
- Faut-il une table `suppliers` séparée ou juste `supplier_name` ?

**Validation :**
- Exécute `npm run db:push` pour créer les tables
- Vérifie les relations et contraintes

---

### Exercice 1.4 : Migrations et Seeds

**Instructions :**
1. Crée un script `server/seed.ts` pour insérer des données de test :
   - 1 hôtel de test
   - 1 utilisateur owner
   - 5 chambres
   - 3 clients
   - 2 réservations
   - Quelques produits et ventes

2. Exécute le script pour vérifier que tout fonctionne

**Code de départ :**
```typescript
// server/seed.ts
import { db } from "./db";
import { hotels, users, rooms } from "@shared/schema";

async function seed() {
  // 1. Créer un hôtel
  const [hotel] = await db.insert(hotels).values({
    name: "Test Hotel",
    address: "123 Test Street",
    // ...
  }).returning();
  
  // 2. Créer un utilisateur owner
  // 3. Créer des chambres
  // ...
  
  console.log("Seed completed!");
}

seed();
```

---

## Module 2 : Storage Layer (Repository Pattern)

### Objectif
Remplacer `MemStorage` par `DatabaseStorage` qui utilise Drizzle ORM.

### Exercice 2.1 : Implémenter DatabaseStorage - Users

**Instructions :**
Dans `server/storage.ts`, remplace `MemStorage` par `DatabaseStorage` :

1. Implémente toutes les méthodes `User` :
   - `getUser(id)`
   - `getUserByUsername(username)`
   - `createUser(user)`
   - Ajoute : `getUserByEmail(email)`
   - Ajoute : `updateUser(id, data)`
   - Ajoute : `deleteUser(id)` (soft delete : met status = "inactive")

2. Utilise Drizzle ORM pour toutes les requêtes

**Code de départ :**
```typescript
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    // TODO: Implémenter avec Drizzle
  }
  
  // ... autres méthodes
}
```

**Tests manuels :**
```typescript
// Dans server/index.ts temporairement
const user = await storage.createUser({
  username: "test",
  password: "hashed_password",
});
console.log("Created user:", user);

const found = await storage.getUser(user.id);
console.log("Found user:", found);
```

---

### Exercice 2.2 : Implémenter DatabaseStorage - Rooms

**Instructions :**
1. Étends l'interface `IStorage` avec les méthodes pour les rooms :
   ```typescript
   getRooms(hotelId: string): Promise<Room[]>;
   getRoom(id: string, hotelId: string): Promise<Room | undefined>;
   createRoom(room: InsertRoom & { hotel_id: string }): Promise<Room>;
   updateRoom(id: string, hotelId: string, data: Partial<InsertRoom>): Promise<Room>;
   deleteRoom(id: string, hotelId: string): Promise<void>;
   getAvailableRooms(hotelId: string, checkIn: Date, checkOut: Date): Promise<Room[]>;
   ```

2. Implémente toutes ces méthodes dans `DatabaseStorage`

**Défi supplémentaire :**
- `getAvailableRooms` doit exclure les chambres qui ont des réservations qui chevauchent les dates demandées

**Code de départ pour `getAvailableRooms` :**
```typescript
async getAvailableRooms(
  hotelId: string,
  checkIn: Date,
  checkOut: Date
): Promise<Room[]> {
  // 1. Récupère toutes les chambres de l'hôtel
  // 2. Récupère les réservations qui chevauchent les dates
  // 3. Exclut les chambres occupées
  // 4. Retourne les chambres disponibles
}
```

---

### Exercice 2.3 : Implémenter DatabaseStorage - Reservations

**Instructions :**
1. Ajoute les méthodes pour les réservations :
   ```typescript
   getReservations(hotelId: string, filters?: { status?: string, dateFrom?: Date, dateTo?: Date }): Promise<Reservation[]>;
   getReservation(id: string, hotelId: string): Promise<Reservation | undefined>;
   createReservation(reservation: InsertReservation & { hotel_id: string }): Promise<Reservation>;
   updateReservation(id: string, hotelId: string, data: Partial<InsertReservation>): Promise<Reservation>;
   cancelReservation(id: string, hotelId: string): Promise<void>;
   ```

2. **Validation importante** : `createReservation` doit vérifier :
   - La chambre existe et appartient à l'hôtel
   - La chambre est disponible pour les dates demandées
   - Le client existe

**Code de validation :**
```typescript
async createReservation(...) {
  // 1. Vérifie que la chambre existe
  const room = await this.getRoom(reservation.room_id, reservation.hotel_id);
  if (!room) throw new Error("Room not found");
  
  // 2. Vérifie que la chambre est disponible
  const availableRooms = await this.getAvailableRooms(
    reservation.hotel_id,
    reservation.check_in,
    reservation.check_out
  );
  if (!availableRooms.some(r => r.id === reservation.room_id)) {
    throw new Error("Room not available for these dates");
  }
  
  // 3. Crée la réservation
  // ...
}
```

---

### Exercice 2.4 : Implémenter DatabaseStorage - Restaurant

**Instructions :**
Ajoute les méthodes pour le module restaurant :

1. **Products** :
   - `getProducts(hotelId)`
   - `createProduct(product)`
   - `updateProduct(id, hotelId, data)`

2. **Inventory** :
   - `getInventoryItems(hotelId)`
   - `getLowStockItems(hotelId)` // quantity < alert_threshold
   - `updateInventoryQuantity(id, hotelId, quantity)`

3. **Sales** :
   - `createSale(sale)`
   - `getSales(hotelId, filters)`
   - `getSalesByEmployee(employeeId, hotelId, dateFrom, dateTo)`

4. **Purchases** :
   - `createPurchase(purchase)`
   - `getPurchases(hotelId, filters)`

**Défi :**
- `createSale` doit décrémenter automatiquement `inventory_items.current_quantity` si le produit est lié à un item d'inventaire

---

## Module 3 : Authentification & Autorisation

### Objectif
Créer un système d'authentification complet avec JWT et sessions.

### Exercice 3.1 : Hashage des Mots de Passe

**Instructions :**
1. Installe `bcrypt` : `npm install bcrypt @types/bcrypt`

2. Crée un fichier `server/auth.ts` avec des fonctions utilitaires :
   ```typescript
   import bcrypt from "bcrypt";
   
   export async function hashPassword(password: string): Promise<string> {
     // TODO: Hash le mot de passe avec bcrypt (10 rounds)
   }
   
   export async function verifyPassword(
     password: string,
     hash: string
   ): Promise<boolean> {
     // TODO: Vérifie le mot de passe contre le hash
   }
   ```

3. Modifie `DatabaseStorage.createUser` pour hasher le mot de passe avant stockage

**Tests :**
```typescript
const hash = await hashPassword("myPassword123");
console.log("Hash:", hash);

const isValid = await verifyPassword("myPassword123", hash);
console.log("Valid:", isValid); // true
```

---

### Exercice 3.2 : JWT Tokens

**Instructions :**
1. Installe `jsonwebtoken` : `npm install jsonwebtoken @types/jsonwebtoken`

2. Crée des fonctions JWT dans `server/auth.ts` :
   ```typescript
   import jwt from "jsonwebtoken";
   
   const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
   const JWT_EXPIRES_IN = "7d"; // 7 jours
   
   export function generateToken(payload: {
     id: string;
     hotel_id?: string;
     role: string;
   }): string {
     // TODO: Génère un JWT avec le payload
   }
   
   export function verifyToken(token: string): {
     id: string;
     hotel_id?: string;
     role: string;
   } {
     // TODO: Vérifie et décode le JWT
   }
   ```

3. Ajoute `JWT_SECRET` dans `.env`

**Tests :**
```typescript
const token = generateToken({ id: "user-1", hotel_id: "hotel-1", role: "owner" });
console.log("Token:", token);

const decoded = verifyToken(token);
console.log("Decoded:", decoded);
```

---

### Exercice 3.3 : Routes d'Authentification

**Instructions :**
Dans `server/routes.ts`, crée les routes d'authentification :

1. **POST `/api/auth/register`**
   - Crée un hôtel ET un utilisateur owner
   - Hash le mot de passe
   - Génère un JWT
   - Retourne le token et les infos utilisateur

2. **POST `/api/auth/login`**
   - Vérifie username/password
   - Génère un JWT
   - Retourne le token

3. **GET `/api/auth/me`**
   - Route protégée (nécessite token)
   - Retourne les infos de l'utilisateur connecté

**Code de départ :**
```typescript
app.post("/api/auth/register", async (req, res) => {
  try {
    const { hotel_name, username, password, email } = req.body;
    
    // 1. Valider les données (Zod)
    // 2. Créer l'hôtel
    // 3. Créer l'utilisateur owner (hash password)
    // 4. Générer JWT
    // 5. Retourner token + user
    
  } catch (error) {
    // Gestion d'erreurs
  }
});
```

**Validation :**
- Teste avec Postman ou curl :
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"hotel_name":"Test Hotel","username":"owner","password":"test123","email":"owner@test.com"}'
```

---

### Exercice 3.4 : Middleware d'Authentification

**Instructions :**
1. Crée un middleware `authenticate` dans `server/middleware.ts` :
   ```typescript
   export async function authenticate(
     req: Request,
     res: Response,
     next: NextFunction
   ) {
     // 1. Récupère le token depuis Authorization header
     // 2. Vérifie le token avec verifyToken()
     // 3. Ajoute req.user = { id, hotel_id, role }
     // 4. Continue avec next()
     // 5. Si erreur → retourne 401
   }
   ```

2. Utilise ce middleware sur les routes protégées :
   ```typescript
   app.get("/api/rooms", authenticate, getRoomsHandler);
   ```

**Défi :**
- Crée aussi un middleware `requireRole(roles: string[])` pour vérifier les permissions :
  ```typescript
  app.post("/api/rooms", authenticate, requireRole(["owner", "manager"]), createRoomHandler);
  ```

---

## Module 4 : API Routes - Module Hôtel

### Objectif
Créer toutes les routes API pour le module hôtel (rooms, reservations, clients, payments).

### Exercice 4.1 : Routes CRUD Rooms

**Instructions :**
Crée toutes les routes pour les chambres :

1. **GET `/api/rooms`**
   - Liste toutes les chambres de l'hôtel de l'utilisateur
   - Supporte des filtres : `?status=available&room_type=Standard`

2. **GET `/api/rooms/:id`**
   - Détails d'une chambre spécifique

3. **POST `/api/rooms`**
   - Crée une nouvelle chambre
   - Validation Zod
   - Vérifie que room_number est unique pour l'hôtel

4. **PATCH `/api/rooms/:id`**
   - Met à jour une chambre
   - Validation partielle (Partial<InsertRoom>)

5. **DELETE `/api/rooms/:id`**
   - Supprime une chambre
   - Vérifie qu'elle n'a pas de réservations actives

**Code de départ :**
```typescript
// GET /api/rooms
app.get("/api/rooms", authenticate, async (req, res) => {
  const { status, room_type } = req.query;
  const hotelId = req.user.hotel_id!;
  
  const rooms = await storage.getRooms(hotelId);
  // Filtrer si nécessaire
  
  res.json({ success: true, data: rooms });
});
```

---

### Exercice 4.2 : Routes Reservations

**Instructions :**
Crée les routes pour les réservations :

1. **GET `/api/reservations`**
   - Liste les réservations avec filtres (status, dateFrom, dateTo)
   - Inclut les relations (room, client) dans la réponse

2. **GET `/api/reservations/:id`**
   - Détails d'une réservation

3. **POST `/api/reservations`**
   - Crée une réservation
   - **Validation importante** :
     - Vérifie que la chambre est disponible
     - Calcule le `total_amount` (nombre de nuits × prix)
     - Vérifie que check_out > check_in

4. **PATCH `/api/reservations/:id`**
   - Met à jour une réservation
   - Permet de changer de chambre si disponible

5. **POST `/api/reservations/:id/check-in`**
   - Marque la réservation comme checked_in
   - Change le statut de la chambre à "occupied"

6. **POST `/api/reservations/:id/check-out`**
   - Marque la réservation comme checked_out
   - Change le statut de la chambre à "cleaning"

**Défi :**
- Calcule automatiquement le nombre de nuits :
  ```typescript
  const nights = Math.ceil(
    (new Date(check_out).getTime() - new Date(check_in).getTime()) 
    / (1000 * 60 * 60 * 24)
  );
  ```

---

### Exercice 4.3 : Routes Clients

**Instructions :**
Crée les routes CRUD pour les clients :

1. **GET `/api/clients`**
   - Liste les clients avec recherche (nom, email, téléphone)

2. **GET `/api/clients/:id`**
   - Détails d'un client avec historique des réservations

3. **POST `/api/clients`**
   - Crée un client

4. **PATCH `/api/clients/:id`**
   - Met à jour un client

5. **DELETE `/api/clients/:id`** (soft delete)

**Défi :**
- Ajoute une route `GET /api/clients/:id/reservations` qui retourne l'historique complet

---

### Exercice 4.4 : Routes Payments

**Instructions :**
Crée les routes pour les paiements :

1. **GET `/api/payments`**
   - Liste les paiements avec filtres

2. **POST `/api/payments`**
   - Enregistre un paiement
   - Si lié à une réservation, met à jour `payment_status` de la réservation

3. **GET `/api/payments/:id`**
   - Détails d'un paiement

4. **POST `/api/payments/:id/refund`**
   - Marque un paiement comme refunded
   - Met à jour la réservation si applicable

**Défi :**
- Calcule automatiquement le montant restant à payer pour une réservation

---

## Module 5 : API Routes - Module Restaurant

### Objectif
Créer toutes les routes API pour le module restaurant.

### Exercice 5.1 : Routes Products (Menu)

**Instructions :**
Crée les routes CRUD pour les produits du menu :

1. **GET `/api/restaurant/products`**
   - Liste tous les produits
   - Filtre par catégorie : `?category=Main`

2. **POST `/api/restaurant/products`**
   - Crée un produit

3. **PATCH `/api/restaurant/products/:id`**
   - Met à jour un produit (ex: prix, disponibilité)

4. **DELETE `/api/restaurant/products/:id`**

---

### Exercice 5.2 : Routes Inventory

**Instructions :**
Crée les routes pour l'inventaire :

1. **GET `/api/restaurant/inventory`**
   - Liste tous les items d'inventaire
   - Option : `?low_stock=true` pour voir seulement les alertes

2. **POST `/api/restaurant/inventory`**
   - Crée un item d'inventaire

3. **PATCH `/api/restaurant/inventory/:id`**
   - Met à jour la quantité ou le seuil d'alerte

4. **POST `/api/restaurant/inventory/:id/adjust`**
   - Ajuste la quantité (ajoute ou retire)

---

### Exercice 5.3 : Routes Sales

**Instructions :**
Crée les routes pour les ventes :

1. **GET `/api/restaurant/sales`**
   - Liste les ventes avec filtres (date, employé, produit)
   - Inclut les relations (product, employee, reservation)

2. **POST `/api/restaurant/sales`**
   - Enregistre une vente
   - **Important** : Décrémente automatiquement l'inventaire si applicable
   - Si `reservation_id` fourni, lie la vente au séjour

3. **GET `/api/restaurant/sales/stats`**
   - Retourne des statistiques :
     - Total ventes aujourd'hui
     - Total ventes ce mois
     - Top produits vendus
     - Ventes par employé

**Défi :**
- Supporte les ventes multiples (array de produits) en une seule requête

---

### Exercice 5.4 : Routes Purchases

**Instructions :**
Crée les routes pour les achats :

1. **GET `/api/restaurant/purchases`**
   - Liste les achats

2. **POST `/api/restaurant/purchases`**
   - Enregistre un achat
   - **Important** : Incrémente automatiquement `inventory_items.current_quantity`

---

## Module 6 : Intégration Frontend-Backend

### Objectif
Connecter toutes les pages React aux API backend correspondantes.

### Exercice 6.1 : Créer les Hooks TanStack Query

**Instructions :**
Pour chaque module, crée des hooks dans `client/src/hooks/` :

1. **`useRooms.ts`**
   - `useRooms()` : Liste des chambres
   - `useRoom(id)` : Une chambre
   - `useCreateRoom()` : Créer
   - `useUpdateRoom()` : Mettre à jour
   - `useDeleteRoom()` : Supprimer

2. **`useReservations.ts`**
   - Même pattern pour les réservations
   - Ajoute `useCheckIn()` et `useCheckOut()`

3. **`useClients.ts`**
   - Même pattern

4. **`useRestaurant.ts`**
   - Hooks pour products, inventory, sales

**Code de départ :**
```typescript
// hooks/useRooms.ts
export function useRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/rooms");
      return res.json();
    },
  });
}
```

---

### Exercice 6.2 : Connecter la Page Rooms

**Instructions :**
Dans `client/src/pages/rooms.tsx` :

1. Remplace les données mockées par `useRooms()`
2. Ajoute un formulaire pour créer une chambre (utilise `CreateRoomForm` de l'exemple 5)
3. Ajoute des boutons pour éditer/supprimer
4. Ajoute des filtres (status, room_type)

**Avant :**
```typescript
const mockRooms = [ /* données statiques */ ];
```

**Après :**
```typescript
const { data: rooms, isLoading } = useRooms();
const createRoom = useCreateRoom();
```

---

### Exercice 6.3 : Connecter la Page Reservations

**Instructions :**
1. Remplace les données mockées
2. Ajoute un formulaire de création de réservation
3. Implémente les boutons Check-in / Check-out
4. Affiche les réservations dans un calendrier (optionnel)

**Défi :**
- Crée un composant `ReservationCalendar` qui affiche les réservations dans une vue calendrier

---

### Exercice 6.4 : Connecter le Dashboard

**Instructions :**
Dans `client/src/pages/dashboard.tsx` :

1. Crée des hooks pour les statistiques :
   - `useDashboardStats()` : KPIs (occupancy rate, revenue, etc.)

2. Remplace les données mockées par de vraies données :
   - `useRooms()` pour le nombre de chambres
   - `useReservations()` pour les réservations du jour
   - API `/api/dashboard/stats` pour les KPIs

3. Implémente les "Quick Actions" :
   - Quick Check-in → ouvre un dialog
   - Add Restaurant Sale → navigue vers `/restaurant/sales`

**Code de départ :**
```typescript
// Crée une route API : GET /api/dashboard/stats
app.get("/api/dashboard/stats", authenticate, async (req, res) => {
  const hotelId = req.user.hotel_id!;
  
  // Calcule les stats
  const stats = {
    totalRooms: await storage.countRooms(hotelId),
    availableRooms: await storage.countAvailableRooms(hotelId),
    occupancyRate: /* calcul */,
    revenueToday: /* calcul */,
    // ...
  };
  
  res.json({ success: true, data: stats });
});
```

---

### Exercice 6.5 : Formulaire de Réservation

**Instructions :**
Crée un formulaire complet pour créer une réservation :

1. **Sélection du client** :
   - Dropdown avec recherche
   - Option "Créer nouveau client" (dialog)

2. **Sélection de la chambre** :
   - Dropdown avec seulement les chambres disponibles pour les dates
   - Affiche le prix par nuit

3. **Dates** :
   - Date picker pour check-in et check-out
   - Validation : check-out > check-in

4. **Calcul automatique** :
   - Affiche le nombre de nuits
   - Affiche le total (nuits × prix)

**Code de départ :**
```typescript
function CreateReservationForm() {
  const { data: clients } = useClients();
  const { data: availableRooms } = useAvailableRooms(checkIn, checkOut);
  
  const form = useForm({
    resolver: zodResolver(insertReservationSchema),
  });
  
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);
  
  // ...
}
```

---

## Module 7 : Tests & Qualité

### Objectif
Créer une suite de tests complète pour valider le code.

### Exercice 7.1 : Setup Tests (Vitest)

**Instructions :**
1. Installe Vitest : `npm install -D vitest @vitest/ui`

2. Crée `vitest.config.ts` :
   ```typescript
   import { defineConfig } from "vitest/config";
   
   export default defineConfig({
     test: {
       environment: "node",
     },
   });
   ```

3. Ajoute dans `package.json` :
   ```json
   "scripts": {
     "test": "vitest",
     "test:ui": "vitest --ui"
   }
   ```

---

### Exercice 7.2 : Tests Unitaires - Storage Layer

**Instructions :**
Crée `server/storage.test.ts` :

1. Teste `DatabaseStorage.getUser` :
   ```typescript
   describe("DatabaseStorage", () => {
     it("should get a user by id", async () => {
       // 1. Crée un user
       // 2. Récupère-le
       // 3. Vérifie qu'il correspond
     });
     
     it("should return undefined for non-existent user", async () => {
       // Vérifie que getUser("fake-id") retourne undefined
     });
   });
   ```

2. Teste toutes les méthodes CRUD pour rooms, reservations, etc.

**Défi :**
- Utilise une base de données de test séparée
- Setup/Teardown pour nettoyer entre les tests

---

### Exercice 7.3 : Tests d'Intégration - API Routes

**Instructions :**
Crée `server/routes.test.ts` :

1. Utilise `supertest` pour tester les routes :
   ```typescript
   import request from "supertest";
   import { app } from "./index";
   
   describe("POST /api/rooms", () => {
     it("should create a room with valid data", async () => {
       const token = await getTestToken();
       
       const res = await request(app)
         .post("/api/rooms")
         .set("Authorization", `Bearer ${token}`)
         .send({
           room_number: "101",
           room_type: "Standard",
           capacity: 2,
           price_per_night: 1500,
         });
       
       expect(res.status).toBe(201);
       expect(res.body.data.room_number).toBe("101");
     });
     
     it("should return 400 with invalid data", async () => {
       // Test validation
     });
     
     it("should return 401 without token", async () => {
       // Test auth
     });
   });
   ```

2. Teste toutes les routes principales

---

### Exercice 7.4 : Tests Frontend (Optionnel)

**Instructions :**
Si tu veux tester le frontend, utilise Vitest + React Testing Library :

1. Teste un composant simple :
   ```typescript
   import { render, screen } from "@testing-library/react";
   import { RoomCard } from "@/components/room-card";
   
   test("renders room number", () => {
     render(<RoomCard room={{ id: "1", room_number: "101", ... }} />);
     expect(screen.getByText("101")).toBeInTheDocument();
   });
   ```

2. Teste les hooks TanStack Query avec mocks

---

## Module 8 : Déploiement & Production

### Objectif
Déployer HotelGenius en production.

### Exercice 8.1 : Préparer pour la Production

**Instructions :**
1. Crée un fichier `.env.production.example` :
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=change-this-to-random-secret
   NODE_ENV=production
   PORT=5000
   ```

2. Vérifie que tous les secrets sont dans les variables d'environnement (pas hardcodés)

3. Teste le build :
   ```bash
   npm run build
   npm run start
   ```

---

### Exercice 8.2 : Déployer sur Railway

**Instructions :**
1. Crée un compte Railway
2. Connecte ton repo GitHub
3. Configure les variables d'environnement
4. Déploie

**Checklist :**
- [ ] DATABASE_URL configuré
- [ ] JWT_SECRET généré (utilise `openssl rand -hex 32`)
- [ ] Migrations exécutées
- [ ] Build réussi
- [ ] Application accessible

---

### Exercice 8.3 : CI/CD avec GitHub Actions

**Instructions :**
Crée `.github/workflows/deploy.yml` :

```yaml
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
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run check
      - run: npm run build
      # Déploie vers Railway/Vercel
```

---

## 📊 Checklist de Progression

### Module 1 : Base de Données
- [ ] Schéma complet créé
- [ ] Tables créées dans la DB
- [ ] Migrations fonctionnelles
- [ ] Données de test insérées

### Module 2 : Storage Layer
- [ ] DatabaseStorage implémenté
- [ ] Toutes les méthodes CRUD fonctionnelles
- [ ] Tests manuels réussis

### Module 3 : Authentification
- [ ] Hashage des mots de passe
- [ ] JWT tokens
- [ ] Routes auth fonctionnelles
- [ ] Middleware d'authentification

### Module 4 : API Hôtel
- [ ] Routes rooms
- [ ] Routes reservations
- [ ] Routes clients
- [ ] Routes payments

### Module 5 : API Restaurant
- [ ] Routes products
- [ ] Routes inventory
- [ ] Routes sales
- [ ] Routes purchases

### Module 6 : Frontend
- [ ] Toutes les pages connectées
- [ ] Hooks TanStack Query créés
- [ ] Formulaires fonctionnels
- [ ] Dashboard avec vraies données

### Module 7 : Tests
- [ ] Tests unitaires storage
- [ ] Tests d'intégration API
- [ ] Coverage > 80%

### Module 8 : Déploiement
- [ ] Application déployée
- [ ] Variables d'environnement configurées
- [ ] CI/CD fonctionnel
- [ ] Monitoring en place

---

## 🎓 Conclusion

Félicitations ! Tu as maintenant tous les exercices pour reconstruire HotelGenius de zéro.

**Conseils :**
- ✅ Fais les exercices dans l'ordre
- ✅ Teste à chaque étape
- ✅ Ne saute pas les étapes
- ✅ Pose des questions si bloqué

**Prochaines Étapes :**
1. Commence par le Module 1
2. Code étape par étape
3. Consulte les guides si besoin
4. Teste régulièrement

**Bon coding ! 🚀**

