# 💻 Exemples de Code Détaillés - HotelGenius

> **Explications ligne par ligne de code clé du projet**

Ce guide contient des exemples de code expliqués en détail pour comprendre chaque décision technique et chaque ligne.

---

## 📋 Table des Matières

1. [Exemple 1 : Structure de Base avec MemStorage](#exemple-1--structure-de-base-avec-memstorage)
2. [Exemple 2 : Migration vers Database Storage (Repository Pattern)](#exemple-2--migration-vers-database-storage-repository-pattern)
3. [Exemple 3 : Route API REST avec Validation](#exemple-3--route-api-rest-avec-validation)
4. [Exemple 4 : Hook React avec TanStack Query](#exemple-4--hook-react-avec-tanstack-query)
5. [Exemple 5 : Composant React avec Validation de Formulaire](#exemple-5--composant-react-avec-validation-de-formulaire)
6. [Exemple 6 : Optimistic Updates avec TanStack Query](#exemple-6--optimistic-updates-avec-tanstack-query)

---

## Exemple 1 : Structure de Base avec MemStorage

### Contexte

Le projet commence avec un `MemStorage` simple qui stocke les données en mémoire. C'est une bonne première étape pour prototyper sans avoir besoin d'une base de données.

### Code Complet

```typescript
// server/storage.ts
import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

// 1. Interface définissant le contrat du storage
export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

// 2. Implémentation en mémoire (temporaire)
export class MemStorage implements IStorage {
  // 3. Map pour stocker les utilisateurs en mémoire
  private users: Map<string, User>;

  constructor() {
    // 4. Initialise une Map vide au démarrage
    this.users = new Map();
  }

  // 5. Récupère un utilisateur par son ID
  async getUser(id: string): Promise<User | undefined> {
    // 6. Map.get() retourne undefined si la clé n'existe pas
    return this.users.get(id);
  }

  // 7. Récupère un utilisateur par son username
  async getUserByUsername(username: string): Promise<User | undefined> {
    // 8. Convertit la Map en Array pour pouvoir utiliser find()
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  // 9. Crée un nouvel utilisateur
  async createUser(insertUser: InsertUser): Promise<User> {
    // 10. Génère un UUID unique pour l'ID
    const id = randomUUID();
    
    // 11. Crée l'objet User complet avec l'ID
    const user: User = { ...insertUser, id };
    
    // 12. Stocke l'utilisateur dans la Map (clé = id, valeur = user)
    this.users.set(id, user);
    
    // 13. Retourne l'utilisateur créé
    return user;
  }
}

// 14. Instance unique exportée (Singleton pattern)
export const storage = new MemStorage();
```

### Explications Ligne par Ligne

**Ligne 1-2 : Imports**
- `type User, type InsertUser` : Types TypeScript importés depuis le schéma
- `randomUUID` : Fonction Node.js pour générer des UUID (identifiants uniques)

**Ligne 4-7 : Interface IStorage**
- **Pourquoi une interface ?** Permet de changer l'implémentation sans modifier le code qui l'utilise
- Définit le "contrat" : quelles méthodes le storage doit avoir
- Toutes les méthodes retournent des `Promise` (asynchrones)

**Ligne 9-13 : Classe MemStorage**
- `implements IStorage` : Garantit que MemStorage a toutes les méthodes de l'interface
- `private users: Map<string, User>` : 
  - `Map` : Structure de données clé-valeur native JavaScript
  - Plus performant que `{}` pour des ajouts/suppressions fréquentes
  - Type : clé = string (ID), valeur = User

**Ligne 15-17 : Constructor**
- S'exécute quand on fait `new MemStorage()`
- Initialise la Map vide

**Ligne 19-22 : Méthode getUser**
- `async` : Fonction asynchrone (retourne une Promise)
- `Promise<User | undefined>` : Peut retourner un User ou undefined (si pas trouvé)
- `Map.get(id)` : O(1) - recherche instantanée par clé

**Ligne 24-28 : Méthode getUserByUsername**
- `Array.from(this.users.values())` : Convertit les valeurs de la Map en Array
- `.find()` : Parcourt l'array jusqu'à trouver le premier élément qui match
- Performance : O(n) - moins efficace que Map.get(), mais nécessaire ici

**Ligne 30-39 : Méthode createUser**
- `randomUUID()` : Génère un UUID v4 (ex: "550e8400-e29b-41d4-a716-446655440000")
- `{ ...insertUser, id }` : Spread operator - copie toutes les propriétés et ajoute l'id
- `Map.set(id, user)` : Stocke l'utilisateur avec l'ID comme clé

**Ligne 41-42 : Export Singleton**
- `new MemStorage()` : Crée une seule instance
- Tous les modules qui importent `storage` partagent la même instance
- **Avantage** : Données partagées entre toutes les routes

### Limitations de MemStorage

- ❌ Données perdues au redémarrage du serveur
- ❌ Pas de persistance
- ❌ Ne scale pas (toute la DB en mémoire)
- ✅ Utile pour prototyper rapidement

**Prochaine étape** : Remplacer par `DatabaseStorage` qui utilise PostgreSQL.

---

## Exemple 2 : Migration vers Database Storage (Repository Pattern)

### Contexte

On remplace `MemStorage` par `DatabaseStorage` qui utilise Drizzle ORM pour interagir avec PostgreSQL. On garde l'interface `IStorage` pour que le code existant continue de fonctionner.

### Code Complet

```typescript
// server/storage.ts
import { db } from "./db";
import { users, rooms, type User, type Room, type InsertUser, type InsertRoom } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Méthodes Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Méthodes Rooms
  getRooms(hotelId: string): Promise<Room[]>;
  getRoom(id: string, hotelId: string): Promise<Room | undefined>;
  createRoom(room: InsertRoom & { hotel_id: string }): Promise<Room>;
  updateRoom(id: string, hotelId: string, data: Partial<InsertRoom>): Promise<Room>;
  deleteRoom(id: string, hotelId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // ========== MÉTHODES USERS ==========
  
  async getUser(id: string): Promise<User | undefined> {
    // 1. Requête SQL : SELECT * FROM users WHERE id = ?
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    // 2. Retourne le premier résultat ou undefined
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // 3. INSERT INTO users (username, password) VALUES (?, ?) RETURNING *
    const result = await db
      .insert(users)
      .values(insertUser)
      .returning(); // Retourne l'enregistrement créé
    
    // 4. returning() retourne un array, on prend le premier élément
    return result[0];
  }

  // ========== MÉTHODES ROOMS ==========
  
  async getRooms(hotelId: string): Promise<Room[]> {
    // 5. SELECT * FROM rooms WHERE hotel_id = ? ORDER BY room_number
    return await db
      .select()
      .from(rooms)
      .where(eq(rooms.hotel_id, hotelId))
      .orderBy(rooms.room_number);
  }

  async getRoom(id: string, hotelId: string): Promise<Room | undefined> {
    // 6. WHERE avec deux conditions (AND)
    const result = await db
      .select()
      .from(rooms)
      .where(and(
        eq(rooms.id, id),
        eq(rooms.hotel_id, hotelId)
      ))
      .limit(1);
    
    return result[0];
  }

  async createRoom(room: InsertRoom & { hotel_id: string }): Promise<Room> {
    // 7. Vérification : room_number unique par hôtel
    const existing = await db
      .select()
      .from(rooms)
      .where(and(
        eq(rooms.hotel_id, room.hotel_id),
        eq(rooms.room_number, room.room_number)
      ))
      .limit(1);
    
    if (existing[0]) {
      throw new Error(`Room ${room.room_number} already exists for this hotel`);
    }
    
    // 8. INSERT avec returning()
    const result = await db
      .insert(rooms)
      .values(room)
      .returning();
    
    return result[0];
  }

  async updateRoom(
    id: string,
    hotelId: string,
    data: Partial<InsertRoom>
  ): Promise<Room> {
    // 9. UPDATE rooms SET ... WHERE id = ? AND hotel_id = ?
    const result = await db
      .update(rooms)
      .set(data) // Set seulement les champs fournis
      .where(and(
        eq(rooms.id, id),
        eq(rooms.hotel_id, hotelId)
      ))
      .returning();
    
    if (!result[0]) {
      throw new Error("Room not found");
    }
    
    return result[0];
  }

  async deleteRoom(id: string, hotelId: string): Promise<void> {
    // 10. DELETE FROM rooms WHERE id = ? AND hotel_id = ?
    const result = await db
      .delete(rooms)
      .where(and(
        eq(rooms.id, id),
        eq(rooms.hotel_id, hotelId)
      ))
      .returning();
    
    if (!result[0]) {
      throw new Error("Room not found");
    }
  }
}

// 11. Export de l'instance unique
export const storage = new DatabaseStorage();
```

### Explications Ligne par Ligne

**Ligne 1-4 : Imports**
- `db` : Instance Drizzle pour les requêtes
- `users, rooms` : Tables définies dans le schéma
- `eq, and` : Fonctions Drizzle pour construire les conditions WHERE

**Ligne 6-16 : Interface IStorage étendue**
- Mêmes méthodes que MemStorage + nouvelles pour les rooms
- **Important** : L'interface reste la même, seule l'implémentation change

**Ligne 18 : Classe DatabaseStorage**
- `implements IStorage` : Même contrat que MemStorage

**Ligne 22-29 : getUser avec Drizzle**
- `db.select().from(users)` : Construit la requête SELECT
- `.where(eq(users.id, id))` : Ajoute la condition WHERE id = ?
- `eq()` : Fonction Drizzle qui crée une condition d'égalité
- `.limit(1)` : Optimise (on veut qu'un seul résultat)
- `result[0]` : Premier élément ou undefined si vide

**Ligne 38-43 : createUser avec INSERT**
- `db.insert(users).values(insertUser)` : Construit INSERT INTO users VALUES (...)
- `.returning()` : PostgreSQL retourne l'enregistrement créé (évite un SELECT après)
- **Avantage** : Récupère l'ID généré automatiquement par la DB

**Ligne 48-53 : getRooms avec filtre hotel_id**
- `.where(eq(rooms.hotel_id, hotelId))` : Filtre par hôtel (multi-tenant)
- `.orderBy(rooms.room_number)` : Trie par numéro de chambre

**Ligne 58-64 : getRoom avec deux conditions**
- `and(eq(rooms.id, id), eq(rooms.hotel_id, hotelId))` : 
  - Vérifie l'ID ET l'hôtel (sécurité multi-tenant)
  - Empêche un hôtel d'accéder aux chambres d'un autre

**Ligne 66-81 : createRoom avec vérification**
- **Lignes 67-72** : Vérifie si une chambre avec ce numéro existe déjà
- **Ligne 74-75** : Si existe, lève une erreur (validation métier)
- **Ligne 78-82** : Sinon, insère la nouvelle chambre

**Ligne 84-101 : updateRoom avec Partial**
- `data: Partial<InsertRoom>` : Permet de mettre à jour seulement certains champs
- `.set(data)` : Met à jour uniquement les propriétés fournies
- Vérifie que la chambre existe avant de retourner

**Ligne 103-115 : deleteRoom**
- Supprime la chambre si elle appartient à l'hôtel
- Vérifie qu'elle existait avant de retourner

### Avantages du Repository Pattern

✅ **Abstraction** : Le code qui utilise `storage` ne sait pas si c'est en mémoire ou en DB
✅ **Testabilité** : Facile de créer un `MockStorage` pour les tests
✅ **Flexibilité** : Changement d'implémentation sans modifier le reste du code

### Comparaison MemStorage vs DatabaseStorage

| Aspect | MemStorage | DatabaseStorage |
|--------|-----------|-----------------|
| Persistance | ❌ Perdu au redémarrage | ✅ Persiste dans PostgreSQL |
| Performance | ✅ Très rapide (mémoire) | ✅ Rapide (indexes DB) |
| Scalabilité | ❌ Limité à la RAM | ✅ Scale à des millions d'enregistrements |
| Multi-tenant | ❌ Pas d'isolation | ✅ Isolation par `hotel_id` |
| Transactions | ❌ Pas de transactions | ✅ Supporte les transactions ACID |

---

## Exemple 3 : Route API REST avec Validation

### Contexte

Création d'une route API complète pour créer une chambre, avec validation Zod, authentification, et gestion d'erreurs.

### Code Complet

```typescript
// server/routes.ts
import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { insertRoomSchema } from "@shared/schema";
import { z } from "zod";

// 1. Middleware d'authentification
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 2. Récupère le token depuis le header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }
    
    // 3. Extrait le token (enlève "Bearer ")
    const token = authHeader.substring(7);
    
    // 4. Vérifie le token JWT (simplifié - utiliser jwt.verify() en vrai)
    // Pour l'exemple, on simule
    const decoded = verifyJWT(token); // Fonction à créer
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    // 5. Ajoute l'utilisateur décodé à la request
    req.user = decoded; // { id: "...", hotel_id: "...", role: "owner" }
    
    // 6. Continue vers le handler de la route
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
}

// 7. Handler pour POST /api/rooms
export async function createRoomHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 8. VALIDATION : Parse et valide les données d'entrée
    const validatedData = insertRoomSchema.parse(req.body);
    
    // 9. AUTHENTICATION : req.user vient du middleware authenticate
    const hotelId = req.user.hotel_id;
    if (!hotelId) {
      return res.status(403).json({ message: "Hotel ID required" });
    }
    
    // 10. AUTORISATION : Vérifie les permissions
    const allowedRoles = ["owner", "manager"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Insufficient permissions. Only owners and managers can create rooms." 
      });
    }
    
    // 11. LOGIQUE MÉTIER : Crée la chambre via le storage layer
    const room = await storage.createRoom({
      ...validatedData,
      hotel_id: hotelId, // Ajoute l'hotel_id (pas dans le body pour sécurité)
    });
    
    // 12. RÉPONSE : Status 201 (Created) avec la chambre créée
    res.status(201).json({
      success: true,
      data: room,
    });
    
  } catch (error) {
    // 13. GESTION D'ERREURS
    
    // 13a. Erreur de validation Zod
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors.map(e => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
    
    // 13b. Erreur métier (ex: chambre déjà existante)
    if (error instanceof Error && error.message.includes("already exists")) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }
    
    // 13c. Autres erreurs → passe à l'error handler global
    next(error);
  }
}

// 14. Enregistrement de la route
export async function registerRoutes(app: Express) {
  // Route protégée : nécessite authentification
  app.post("/api/rooms", authenticate, createRoomHandler);
  
  // Autres routes...
}
```

### Explications Ligne par Ligne

**Ligne 1-5 : Imports**
- `Request, Response, NextFunction` : Types Express pour les handlers
- `insertRoomSchema` : Schéma Zod pour valider les données
- `z` : Pour vérifier si l'erreur est une ZodError

**Ligne 7-28 : Middleware authenticate**
- **Qu'est-ce qu'un middleware ?** Fonction qui s'exécute avant le handler de route
- **Ligne 12** : Vérifie que le header `Authorization` existe et commence par "Bearer "
- **Ligne 18** : Extrait le token (enlève "Bearer " du début)
- **Ligne 21** : `verifyJWT()` vérifie la signature et expire le token
- **Ligne 26** : `req.user` est ajouté à la request pour être accessible dans les handlers
- **Ligne 28** : `next()` passe au handler suivant

**Ligne 30-82 : Handler createRoomHandler**
- Fonction async qui gère la création d'une chambre

**Ligne 36 : Validation Zod**
- `insertRoomSchema.parse(req.body)` :
  - Valide que `req.body` correspond au schéma
  - Si invalide → lève une `ZodError`
  - Si valide → retourne les données validées
- **Pourquoi valider ?** Jamais faire confiance aux données client

**Ligne 39-42 : Récupération hotel_id**
- `req.user.hotel_id` vient du middleware authenticate
- **Sécurité** : hotel_id vient du token JWT, pas du body (utilisateur ne peut pas tricher)

**Ligne 44-49 : Vérification des permissions**
- RBAC (Role-Based Access Control)
- Seuls les `owner` et `manager` peuvent créer des chambres
- Les `receptionist` et autres rôles → 403 Forbidden

**Ligne 51-55 : Création de la chambre**
- Appelle le storage layer (abstraction)
- `...validatedData` : Spread toutes les propriétés validées
- `hotel_id: hotelId` : Ajoute l'hotel_id (sécurité multi-tenant)

**Ligne 57-61 : Réponse de succès**
- Status `201 Created` : Standard REST pour création réussie
- Retourne la chambre créée dans `data`

**Ligne 64-79 : Gestion d'erreurs**
- **Ligne 66** : Vérifie si c'est une ZodError (validation échouée)
- **Ligne 68-75** : Retourne 400 avec les erreurs détaillées par champ
- **Ligne 78** : Erreur métier (ex: chambre existe déjà) → 409 Conflict
- **Ligne 84** : Autres erreurs → passe à l'error handler global

**Ligne 88-91 : Enregistrement de la route**
- `app.post("/api/rooms", authenticate, createRoomHandler)` :
  - Route POST `/api/rooms`
  - `authenticate` : Middleware exécuté en premier
  - `createRoomHandler` : Handler exécuté si authenticate passe

### Flow Complet d'une Requête

```
1. Client envoie : POST /api/rooms
   Body: { room_number: "101", room_type: "Standard", ... }

2. Express reçoit la requête

3. Middleware authenticate :
   - Vérifie le token JWT
   - Ajoute req.user = { id: "...", hotel_id: "hotel-123", role: "owner" }

4. Handler createRoomHandler :
   a. Validation : insertRoomSchema.parse(req.body)
   b. Récupère hotel_id depuis req.user
   c. Vérifie les permissions (role = owner/manager)
   d. Crée la chambre : storage.createRoom(...)
   e. Retourne 201 avec la chambre créée

5. Client reçoit : { success: true, data: { id: "...", room_number: "101", ... } }
```

### Bonnes Pratiques Appliquées

✅ **Validation stricte** : Zod vérifie tous les champs
✅ **Sécurité multi-tenant** : hotel_id vient du token, pas du body
✅ **RBAC** : Vérification des permissions par rôle
✅ **Gestion d'erreurs** : Messages clairs, status codes appropriés
✅ **Separation of concerns** : Middleware pour auth, handler pour logique

---

## Exemple 4 : Hook React avec TanStack Query

### Contexte

Création d'un hook personnalisé avec TanStack Query pour fetcher et muter les chambres côté frontend.

### Code Complet

```typescript
// client/src/hooks/useRooms.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Room, InsertRoom } from "@shared/schema";

// 1. Hook pour fetcher la liste des chambres
export function useRooms() {
  return useQuery({
    // 2. Query Key : identifie cette query dans le cache
    queryKey: ["rooms"],
    
    // 3. Query Function : fonction qui fetch les données
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/rooms");
      return res.json() as Promise<Room[]>;
    },
    
    // 4. Options de cache
    staleTime: 1000 * 60 * 5, // 5 minutes : données considérées fraîches pendant 5min
    refetchOnWindowFocus: false, // Ne refetch pas quand on revient sur l'onglet
  });
}

// 5. Hook pour fetcher une chambre spécifique
export function useRoom(id: string) {
  return useQuery({
    queryKey: ["rooms", id], // Query key avec l'ID
    
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/rooms/${id}`);
      return res.json() as Promise<Room>;
    },
    
    // 6. Enabled : ne fetch que si l'ID est fourni
    enabled: !!id,
  });
}

// 7. Hook pour créer une chambre (Mutation)
export function useCreateRoom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    // 8. Mutation Function : fonction qui fait la mutation
    mutationFn: async (data: InsertRoom) => {
      const res = await apiRequest("POST", "/api/rooms", data);
      return res.json() as Promise<Room>;
    },
    
    // 9. On Success : après création réussie
    onSuccess: () => {
      // Invalide le cache "rooms" pour forcer un refetch
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

// 10. Hook pour mettre à jour une chambre
export function useUpdateRoom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertRoom> }) => {
      const res = await apiRequest("PATCH", `/api/rooms/${id}`, data);
      return res.json() as Promise<Room>;
    },
    
    onSuccess: (updatedRoom, variables) => {
      // 11. Met à jour le cache directement (optimisation)
      queryClient.setQueryData<Room[]>(["rooms"], (old = []) =>
        old.map(room => room.id === variables.id ? updatedRoom : room)
      );
      
      // 12. Met aussi à jour la query individuelle
      queryClient.setQueryData(["rooms", variables.id], updatedRoom);
    },
  });
}

// 13. Hook pour supprimer une chambre
export function useDeleteRoom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/rooms/${id}`);
    },
    
    onSuccess: (_, deletedId) => {
      // 14. Retire la chambre du cache
      queryClient.setQueryData<Room[]>(["rooms"], (old = []) =>
        old.filter(room => room.id !== deletedId)
      );
      
      // 15. Supprime aussi la query individuelle
      queryClient.removeQueries({ queryKey: ["rooms", deletedId] });
    },
  });
}
```

### Explications Ligne par Ligne

**Ligne 1-3 : Imports**
- `useQuery` : Hook pour fetcher des données (GET)
- `useMutation` : Hook pour modifier des données (POST, PATCH, DELETE)
- `useQueryClient` : Pour manipuler le cache manuellement

**Ligne 5-19 : Hook useRooms**
- **Ligne 8** : `queryKey: ["rooms"]` :
  - Identifie cette query dans le cache TanStack Query
  - Si une autre query a la même key, elles partagent le cache
- **Ligne 11-14** : `queryFn` :
  - Fonction async qui retourne les données
  - TanStack Query appelle cette fonction automatiquement
  - Gère le loading state, les erreurs, etc.
- **Ligne 17** : `staleTime: 5 minutes` :
  - Pendant 5 minutes, les données sont considérées "fraîches"
  - Pas de refetch automatique pendant ce temps
  - **Pourquoi ?** Évite les requêtes inutiles

**Ligne 21-32 : Hook useRoom (une seule chambre)**
- **Ligne 23** : `queryKey: ["rooms", id]` :
  - Query key avec paramètre : cache séparé par ID
  - Ex: `["rooms", "room-1"]` et `["rooms", "room-2"]` sont des caches différents
- **Ligne 29** : `enabled: !!id` :
  - Ne fetch que si `id` est truthy
  - Si `id` est undefined/null, la query ne s'exécute pas

**Ligne 34-46 : Hook useCreateRoom (Mutation)**
- **Ligne 37-40** : `mutationFn` :
  - Fonction qui fait la mutation (POST)
  - Reçoit les données en paramètre
- **Ligne 43-45** : `onSuccess` :
  - Exécuté après succès de la mutation
  - `invalidateQueries` : Marque le cache comme "stale"
  - TanStack Query refetch automatiquement les queries invalidées

**Ligne 48-65 : Hook useUpdateRoom**
- **Ligne 51** : `mutationFn` avec destructuring :
  - Reçoit `{ id, data }` en paramètre
- **Ligne 56-58** : `setQueryData` :
  - Met à jour le cache directement (optimisation)
  - Pas besoin de refetch, on met à jour manuellement
  - `.map()` : Remplace l'ancienne chambre par la nouvelle
- **Ligne 61** : Met aussi à jour la query individuelle

**Ligne 67-83 : Hook useDeleteRoom**
- **Ligne 75-77** : Retire la chambre du cache avec `.filter()`
- **Ligne 80** : `removeQueries` : Supprime complètement la query du cache

### Utilisation dans un Composant

```typescript
// pages/rooms.tsx
import { useRooms, useCreateRoom, useDeleteRoom } from "@/hooks/useRooms";

export default function Rooms() {
  // 1. Fetcher les chambres
  const { data: rooms, isLoading, error } = useRooms();
  
  // 2. Mutation pour créer
  const createRoom = useCreateRoom();
  
  // 3. Mutation pour supprimer
  const deleteRoom = useDeleteRoom();
  
  // 4. Handler pour créer
  const handleCreate = async () => {
    try {
      await createRoom.mutateAsync({
        room_number: "101",
        room_type: "Standard",
        capacity: 2,
        price_per_night: 1500,
      });
      toast.success("Room created!");
    } catch (error) {
      toast.error("Failed to create room");
    }
  };
  
  // 5. Rendu conditionnel
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;
  
  return (
    <div>
      {rooms?.map(room => (
        <RoomCard 
          key={room.id} 
          room={room} 
          onDelete={() => deleteRoom.mutate(room.id)}
        />
      ))}
    </div>
  );
}
```

### Avantages de TanStack Query

✅ **Cache automatique** : Évite les requêtes redondantes
✅ **Loading states** : `isLoading`, `isError` gérés automatiquement
✅ **Optimistic updates** : UI réactive (voir Exemple 6)
✅ **Refetch intelligent** : Refetch quand nécessaire (fenêtre focus, etc.)
✅ **Deduplication** : Plusieurs composants qui fetch la même data = une seule requête

---

## Exemple 5 : Composant React avec Validation de Formulaire

### Contexte

Création d'un formulaire pour créer une chambre avec validation React Hook Form + Zod.

### Code Complet

```typescript
// client/src/components/create-room-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRoomSchema } from "@shared/schema";
import { useCreateRoom } from "@/hooks/useRooms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { InsertRoom } from "@shared/schema";

export function CreateRoomForm({ onSuccess }: { onSuccess?: () => void }) {
  // 1. Hook pour la mutation
  const createRoom = useCreateRoom();
  
  // 2. Hook React Hook Form avec validation Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<InsertRoom>({
    // 3. Resolver Zod : valide avec insertRoomSchema
    resolver: zodResolver(insertRoomSchema),
    // 4. Valeurs par défaut
    defaultValues: {
      room_type: "Standard",
      status: "available",
    },
  });
  
  // 5. Handler de soumission
  const onSubmit = async (data: InsertRoom) => {
    try {
      // 6. Appelle la mutation
      await createRoom.mutateAsync(data);
      
      // 7. Callback de succès (ferme le dialog, etc.)
      onSuccess?.();
      
      // 8. Reset le formulaire
      reset();
    } catch (error) {
      // Erreur gérée par TanStack Query (affichée via toast)
      console.error("Failed to create room:", error);
    }
  };
  
  // 9. Rendu du formulaire
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 10. Champ Room Number */}
      <div>
        <Label htmlFor="room_number">Room Number *</Label>
        <Input
          id="room_number"
          {...register("room_number")}
          placeholder="101"
          className={errors.room_number ? "border-red-500" : ""}
        />
        {/* 11. Affichage de l'erreur de validation */}
        {errors.room_number && (
          <p className="text-sm text-red-500 mt-1">
            {errors.room_number.message}
          </p>
        )}
      </div>
      
      {/* 12. Champ Room Type */}
      <div>
        <Label htmlFor="room_type">Room Type *</Label>
        <Select
          onValueChange={(value) => setValue("room_type", value)}
          defaultValue={watch("room_type")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Standard">Standard</SelectItem>
            <SelectItem value="Deluxe">Deluxe</SelectItem>
            <SelectItem value="Suite">Suite</SelectItem>
          </SelectContent>
        </Select>
        {errors.room_type && (
          <p className="text-sm text-red-500 mt-1">
            {errors.room_type.message}
          </p>
        )}
      </div>
      
      {/* 13. Champ Capacity */}
      <div>
        <Label htmlFor="capacity">Capacity *</Label>
        <Input
          id="capacity"
          type="number"
          {...register("capacity", { valueAsNumber: true })}
          placeholder="2"
          min={1}
          max={10}
        />
        {errors.capacity && (
          <p className="text-sm text-red-500 mt-1">
            {errors.capacity.message}
          </p>
        )}
      </div>
      
      {/* 14. Champ Price per Night */}
      <div>
        <Label htmlFor="price_per_night">Price per Night (HTG) *</Label>
        <Input
          id="price_per_night"
          type="number"
          {...register("price_per_night", { valueAsNumber: true })}
          placeholder="1500"
          min={0}
        />
        {errors.price_per_night && (
          <p className="text-sm text-red-500 mt-1">
            {errors.price_per_night.message}
          </p>
        )}
      </div>
      
      {/* 15. Bouton de soumission */}
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Creating..." : "Create Room"}
      </Button>
    </form>
  );
}
```

### Explications Ligne par Ligne

**Ligne 1-10 : Imports**
- `useForm` : Hook principal de React Hook Form
- `zodResolver` : Bridge entre React Hook Form et Zod
- `insertRoomSchema` : Schéma de validation Zod

**Ligne 12-13 : Composant**
- `onSuccess` : Callback optionnel appelé après création réussie (ferme le dialog)

**Ligne 15-16 : Hooks**
- `useCreateRoom()` : Hook TanStack Query pour créer une chambre

**Ligne 18-31 : Configuration React Hook Form**
- **Ligne 22** : `resolver: zodResolver(insertRoomSchema)` :
  - Valide les données avec Zod avant soumission
  - Affiche les erreurs automatiquement
- **Ligne 24-27** : `defaultValues` :
  - Valeurs initiales du formulaire
- **Ligne 19-29** : Destructuring de `useForm` :
  - `register` : Fonction pour enregistrer un input
  - `handleSubmit` : Fonction qui valide avant d'appeler `onSubmit`
  - `formState.errors` : Objet avec les erreurs par champ
  - `isSubmitting` : True pendant la soumission
  - `setValue` : Met à jour une valeur programmatiquement
  - `watch` : Observe une valeur en temps réel

**Ligne 33-46 : Handler onSubmit**
- **Ligne 34** : `data: InsertRoom` :
  - Type-safe grâce à Zod resolver
  - `data` est déjà validé quand cette fonction est appelée
- **Ligne 37** : `mutateAsync` :
  - Version async de `mutate`
  - Attend la completion (pour gérer le reset après)
- **Ligne 40** : `onSuccess?.()` :
  - `?.` : Optional chaining (appelle seulement si défini)
  - Peut fermer un dialog, naviguer, etc.
- **Ligne 43** : `reset()` :
  - Remet le formulaire à zéro

**Ligne 48-55 : Champ Room Number**
- **Ligne 52** : `{...register("room_number")}` :
  - Spread operator : ajoute `name`, `onChange`, `onBlur`, `ref` à l'input
  - React Hook Form gère l'état automatiquement
- **Ligne 53** : `className` conditionnel :
  - Bordure rouge si erreur
- **Ligne 56-60** : Affichage de l'erreur :
  - `errors.room_number?.message` : Message d'erreur de Zod

**Ligne 62-78 : Champ Room Type (Select)**
- **Ligne 64** : `onValueChange` :
  - Met à jour la valeur avec `setValue`
- **Ligne 65** : `defaultValue={watch("room_type")}` :
  - `watch()` : Lit la valeur actuelle
  - Pour les Select de shadcn/ui, il faut gérer manuellement

**Ligne 80-92 : Champ Capacity (Number)**
- **Ligne 85** : `type="number"` :
  - Input HTML5 pour les nombres
- **Ligne 86** : `{...register("capacity", { valueAsNumber: true })}` :
  - `valueAsNumber` : Convertit la string en number
  - Nécessaire car les inputs HTML retournent toujours des strings

**Ligne 114-118 : Bouton Submit**
- **Ligne 116** : `disabled={isSubmitting}` :
  - Désactive le bouton pendant la soumission (évite double soumission)
- **Ligne 117** : Texte conditionnel :
  - "Creating..." pendant la soumission
  - "Create Room" sinon

### Flow Complet du Formulaire

```
1. Utilisateur remplit le formulaire

2. À chaque changement :
   - React Hook Form met à jour l'état interne
   - Zod valide en temps réel (si configuré)

3. Clic sur "Create Room" :
   - handleSubmit() valide avec Zod
   - Si erreur → affiche les messages d'erreur
   - Si valide → appelle onSubmit()

4. onSubmit() :
   - Appelle createRoom.mutateAsync(data)
   - TanStack Query fait la requête POST /api/rooms
   - Si succès → onSuccess() appelé, reset()
   - Si erreur → catch, affichage toast d'erreur

5. TanStack Query :
   - Invalide le cache "rooms"
   - Refetch automatique de la liste des chambres
   - UI mise à jour avec la nouvelle chambre
```

### Avantages de React Hook Form + Zod

✅ **Performance** : Re-renders minimaux (contrôle non contrôlé)
✅ **Type-safety** : Types TypeScript déduits de Zod
✅ **Validation** : Zod valide côté client ET serveur (même schéma)
✅ **UX** : Erreurs en temps réel, messages clairs
✅ **Accessibilité** : Labels correctement associés

---

## Exemple 6 : Optimistic Updates avec TanStack Query

### Contexte

Pour une UI plus réactive, on met à jour l'interface optimistiquement avant que le serveur confirme, puis on rollback en cas d'erreur.

### Code Complet

```typescript
// client/src/hooks/useRooms.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateRoomOptimistic() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertRoom) => {
      const res = await apiRequest("POST", "/api/rooms", data);
      return res.json() as Promise<Room>;
    },
    
    // 1. ON MUTATE : Exécuté AVANT la requête
    onMutate: async (newRoom) => {
      // 2. Annule toutes les queries "rooms" en cours
      // (évite qu'un refetch annule notre optimistic update)
      await queryClient.cancelQueries({ queryKey: ["rooms"] });
      
      // 3. Snapshot de l'état actuel du cache
      // (nécessaire pour rollback en cas d'erreur)
      const previousRooms = queryClient.getQueryData<Room[]>(["rooms"]);
      
      // 4. Optimistic update : ajoute la nouvelle chambre au cache
      queryClient.setQueryData<Room[]>(["rooms"], (old = []) => {
        // 5. Crée une chambre temporaire avec un ID temporaire
        const optimisticRoom: Room = {
          ...newRoom,
          id: `temp-${Date.now()}`, // ID temporaire unique
          hotel_id: "current-hotel-id", // À récupérer du contexte
          created_at: new Date().toISOString(),
        } as Room;
        
        // 6. Retourne l'ancienne liste + la nouvelle chambre
        return [...old, optimisticRoom];
      });
      
      // 7. Retourne le snapshot pour onError
      return { previousRooms };
    },
    
    // 8. ON ERROR : Si la requête échoue
    onError: (err, newRoom, context) => {
      // 9. Rollback : remet l'ancien état
      if (context?.previousRooms) {
        queryClient.setQueryData(["rooms"], context.previousRooms);
      }
      
      // 10. Affiche une erreur à l'utilisateur
      toast.error("Failed to create room. Changes reverted.");
    },
    
    // 11. ON SUCCESS : Si la requête réussit
    onSuccess: (realRoom, newRoom, context) => {
      // 12. Remplace la chambre optimiste par la vraie chambre du serveur
      queryClient.setQueryData<Room[]>(["rooms"], (old = []) => {
        return old.map(room => 
          // 13. Trouve la chambre temporaire et la remplace
          room.id.startsWith("temp-") 
            ? realRoom // Remplace par la vraie chambre (avec le vrai ID)
            : room
        );
      });
      
      // 14. Optionnel : invalide pour refetch (pour avoir les données les plus à jour)
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    
    // 15. ON SETTLED : Exécuté dans tous les cas (succès ou erreur)
    onSettled: () => {
      // 16. Finalement, refetch pour être sûr d'avoir les données à jour
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}
```

### Explications Ligne par Ligne

**Ligne 1-2 : Imports**
- `useQueryClient` : Pour manipuler le cache manuellement

**Ligne 4-7 : Hook useCreateRoomOptimistic**
- Même structure que `useCreateRoom`, mais avec optimistic updates

**Ligne 9-31 : onMutate (Avant la requête)**
- **Ligne 11** : `onMutate` s'exécute **avant** `mutationFn`
- **Ligne 13** : `cancelQueries` :
  - Annule les requêtes en cours
  - Évite qu'un refetch vienne écraser notre optimistic update
- **Ligne 16** : `getQueryData` :
  - Lit l'état actuel du cache
  - Sauvegarde pour rollback si erreur
- **Ligne 19-28** : `setQueryData` :
  - Met à jour le cache avec la nouvelle chambre
  - UI se met à jour immédiatement (optimistic)
  - `old = []` : Valeur par défaut si le cache est vide
- **Ligne 21-26** : Crée une chambre temporaire :
  - ID temporaire : `temp-${Date.now()}`
  - Permet d'identifier la chambre optimiste pour la remplacer après

**Ligne 33-41 : onError (En cas d'erreur)**
- **Ligne 35** : `context` contient ce qu'on a retourné dans `onMutate`
- **Ligne 37-39** : Rollback :
  - Remet l'ancien état du cache
  - UI revient à l'état d'avant (comme si rien ne s'était passé)
- **Ligne 42** : Toast d'erreur pour informer l'utilisateur

**Ligne 45-58 : onSuccess (Si réussite)**
- **Ligne 47** : `realRoom` : La vraie chambre retournée par le serveur (avec le vrai ID)
- **Ligne 49-54** : Remplace la chambre optimiste :
  - Trouve la chambre avec `id.startsWith("temp-")`
  - Remplace par `realRoom` (avec le vrai ID, timestamps, etc.)
- **Ligne 57** : `invalidateQueries` :
  - Optionnel : refetch pour avoir les données les plus à jour
  - Si le serveur fait des calculs supplémentaires (ex: prix calculé)

**Ligne 61-64 : onSettled (Toujours exécuté)**
- S'exécute dans tous les cas (succès ou erreur)
- Utile pour nettoyer, refetch final, etc.

### Flow Visuel

```
État Initial:
rooms = [room1, room2]

1. Utilisateur clique "Create Room"
   → onMutate() exécuté
   → rooms = [room1, room2, temp-room] (optimistic)

2. UI se met à jour immédiatement ✅
   (L'utilisateur voit la nouvelle chambre)

3a. Requête réussit :
   → onSuccess() exécuté
   → rooms = [room1, room2, real-room] (remplace temp-room)

3b. Requête échoue :
   → onError() exécuté
   → rooms = [room1, room2] (rollback)
   → Toast d'erreur affiché
```

### Avantages des Optimistic Updates

✅ **UX meilleure** : UI réactive, pas d'attente
✅ **Perçu comme plus rapide** : Réponse instantanée
✅ **Rollback automatique** : En cas d'erreur, revient à l'état d'avant

### Quand Utiliser ?

✅ **Création/Suppression** : Souvent réussissent, rollback facile
⚠️ **Mise à jour** : Plus complexe, mais faisable
❌ **Actions critiques** : Éviter (ex: paiement, suppression définitive)

---

## 🎓 Conclusion

Ces exemples couvrent les patterns essentiels de HotelGenius :

1. **Storage Layer** : Abstraction avec interface, implémentation flexible
2. **API Routes** : Validation, auth, gestion d'erreurs
3. **TanStack Query** : Cache intelligent, mutations, optimistic updates
4. **Formulaires** : React Hook Form + Zod pour validation
5. **Optimistic Updates** : UX réactive avec rollback

**Prochaines Étapes** :
- Applique ces patterns aux autres modules (reservations, clients, etc.)
- Consulte `EXERCICES_PRATIQUES.md` pour des exercices guidés

**Bon coding ! 🚀**

