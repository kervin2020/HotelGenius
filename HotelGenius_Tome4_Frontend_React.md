# 🏨 HotelGenius — Tome 4 : Frontend React — Interface Utilisateur et Intégration API

> **Formation pratique complète pour construire l'interface React avec Vite, TailwindCSS, TanStack Query, et connecter les composants existants à l'API backend.**

**Style pédagogique :**
- 🎓 **Cours universitaire** — Définitions académiques et concepts théoriques
- 👨🏽‍🏫 **Mentor** — Explications concrètes et analogies
- 🧠 **Ingénierie SaaS** — Patterns avancés et décisions techniques
- 💻 **Code pratique** — Exemples complets prêts à copier-coller
- ⚠️ **Bonnes pratiques** — Conseils d'ingénieur senior

**Prérequis :** Avoir terminé le Tome 3 (Backend Express fonctionnel)

---

## 📋 Table des Matières

1. [Chapitre 1 — Architecture Frontend et TanStack Query](#chapitre-1--architecture-frontend-et-tanstack-query)
2. [Chapitre 2 — Configuration TailwindCSS et shadcn/ui](#chapitre-2--configuration-tailwindcss-et-shadcnui)
3. [Chapitre 3 — Hooks TanStack Query et Communication API](#chapitre-3--hooks-tanstack-query-et-communication-api)
4. [Chapitre 4 — Connexion des Pages Existantes à l'API](#chapitre-4--connexion-des-pages-existantes-à-lapi)
5. [Chapitre 5 — Gestion d'État Client et Authentification](#chapitre-5--gestion-détat-client-et-authentification)
6. [Chapitre 6 — Bilan, Exercices et Préparation du Tome 5](#chapitre-6--bilan-exercices-et-préparation-du-tome-5)

---

# Chapitre 1 — Architecture Frontend et TanStack Query

## 🎓 Cours Universitaire — Qu'est-ce que TanStack Query ?

### Définition Académique

**TanStack Query** (anciennement React Query) est une bibliothèque pour gérer l'**état serveur** (server state) dans les applications React. Contrairement à Redux qui gère l'état global, TanStack Query se concentre sur la **synchronisation avec les APIs**.

**Caractéristiques fondamentales :**
1. **Cache automatique** : Les données fetchées sont mises en cache
2. **Refetch intelligent** : Re-fetch automatique quand nécessaire
3. **Loading/Error states** : Gestion automatique des états de chargement
4. **Optimistic updates** : Mise à jour UI avant confirmation serveur
5. **Deduplication** : Évite les requêtes dupliquées

### Différence avec Redux

**Redux** : Gère l'état global de l'application (client state)
- Exemples : Thème, sidebar ouvert/fermé, panier e-commerce

**TanStack Query** : Gère l'état serveur (server state)
- Exemples : Liste des chambres, réservations, données depuis API

**Pourquoi ne pas utiliser Redux pour HotelGenius ?**
- ✅ TanStack Query est **spécialement conçu** pour les données API
- ✅ Cache automatique (évite les refetch inutiles)
- ✅ Moins de code boilerplate que Redux
- ✅ Gestion d'erreurs intégrée

---

## 👨🏽‍🏫 Mentor — Pourquoi TanStack Query ?

### Analogie avec un Réfrigérateur Intelligent

Imagine un **réfrigérateur intelligent** qui garde la trace de ce que tu as :

**Sans TanStack Query (fetch classique) :**
- Tu ouvres le frigo → Va au magasin → Revient avec la nourriture
- À chaque fois que tu ouvres, tu retournes au magasin (même si tu as déjà la nourriture)
- ⚠️ Inefficace et lent

**Avec TanStack Query :**
- Tu ouvres le frigo → TanStack Query vérifie : "Ai-je déjà cette nourriture ?"
- Si oui et fraîche (< 5min) → Te donne directement (cache)
- Si non ou périmée → Va au magasin → Met dans le cache
- ✅ Efficace et rapide

**Dans HotelGenius :**
- User ouvre la page Rooms → TanStack Query vérifie le cache
- Si les chambres sont déjà en cache et fraîches → Affiche directement
- Sinon → Fetch depuis l'API → Met en cache → Affiche

---

## 🧠 Ingénierie SaaS — Architecture Frontend Multi-Tenant

### Schéma d'Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  React Components (Pages, Components)            │   │
│  │  - rooms.tsx, dashboard.tsx, etc.                │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                      │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │  Custom Hooks (useRooms, useReservations)         │   │
│  │  - Utilisent TanStack Query                       │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                      │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │  TanStack Query (Cache + State Management)        │   │
│  │  - Cache les réponses API                         │   │
│  │  - Gère loading/error states                      │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                      │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │  API Client (apiRequest helper)                   │   │
│  │  - Ajoute JWT token automatiquement               │   │
│  │  - Gère les erreurs HTTP                          │   │
│  └──────────────────┬───────────────────────────────┘   │
└─────────────────────┼─────────────────────────────────────┘
                      │ HTTP Request avec JWT
┌─────────────────────▼─────────────────────────────────────┐
│              EXPRESS API                                    │
│  (Déjà construit dans Tome 3)                              │
└─────────────────────────────────────────────────────────────┘
```

**Isolation Multi-Tenant côté Frontend :**
- Le JWT token contient `hotel_id`
- Chaque requête inclut automatiquement le token
- Le backend filtre par `hotel_id` (garanti)
- Le frontend n'a jamais besoin de manipuler `hotel_id` manuellement

---

## 💻 Code Pratique — Configuration TanStack Query

### Étape 1 : Configuration du QueryClient

**Fichier : `client/src/lib/queryClient.ts`**
```typescript
import { QueryClient, QueryFunction } from '@tanstack/react-query';

// ============================================================================
// HELPER : Vérifie si la réponse HTTP est OK
// ============================================================================

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// ============================================================================
// HELPER : Requête API avec gestion automatique du token
// ============================================================================

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Récupère le token depuis localStorage (ou cookie)
  const token = localStorage.getItem('auth_token');
  
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
  });

  await throwIfResNotOk(res);
  return res;
}

// ============================================================================
// QUERY FUNCTION PAR DÉFAUT
// ============================================================================

type UnauthorizedBehavior = 'returnNull' | 'throw';

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join('/') as string;
    const token = localStorage.getItem('auth_token');
    
    const res = await fetch(url, {
      credentials: 'include',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (unauthorizedBehavior === 'returnNull' && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// ============================================================================
// QUERY CLIENT CONFIGURÉ
// ============================================================================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: 'throw' }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity, // Données considérées fraîches indéfiniment
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
```

**Explication :**

- `apiRequest` : Helper qui ajoute automatiquement le JWT token
- `queryClient` : Configuration globale de TanStack Query
- `staleTime: Infinity` : Les données restent fraîches jusqu'à invalidation manuelle
- `retry: false` : Pas de retry automatique (gestion manuelle des erreurs)

---

### Étape 2 : Provider TanStack Query dans App

**Fichier : `client/src/App.tsx`** (mis à jour)
```typescript
import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/pages/dashboard';
import Rooms from '@/pages/rooms';
import Reservations from '@/pages/reservations';
import Clients from '@/pages/clients';
import Login from '@/pages/login';
import NotFound from '@/pages/not-found';
import { AppSidebar } from '@/components/app-sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { useState } from 'react';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen w-full">
        <AppSidebar currentPath={currentPath} userRole="owner" />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Switch>
              <Route path="/">
                {() => {
                  setCurrentPath('/');
                  return <Dashboard />;
                }}
              </Route>
              <Route path="/rooms">
                {() => {
                  setCurrentPath('/rooms');
                  return <Rooms />;
                }}
              </Route>
              <Route path="/reservations">
                {() => {
                  setCurrentPath('/reservations');
                  return <Reservations />;
                }}
              </Route>
              <Route path="/clients">
                {() => {
                  setCurrentPath('/clients');
                  return <Clients />;
                }}
              </Route>
              <Route path="/login">
                {() => {
                  setCurrentPath('/login');
                  return <Login />;
                }}
              </Route>
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
```

---

## 💻 Code Pratique — Créer des Hooks TanStack Query

### Exemple Complet : Hook useRooms

**Fichier : `client/src/hooks/useRooms.ts`**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Room, InsertRoom } from '@shared/schema';

// ============================================================================
// QUERY : Liste toutes les chambres
// ============================================================================

export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/rooms');
      return res.json() as Promise<Room[]>;
    },
  });
}

// ============================================================================
// QUERY : Une chambre spécifique
// ============================================================================

export function useRoom(id: string) {
  return useQuery({
    queryKey: ['rooms', id],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/rooms/${id}`);
      return res.json() as Promise<Room>;
    },
    enabled: !!id, // Ne fetch que si l'ID existe
  });
}

// ============================================================================
// MUTATION : Créer une chambre
// ============================================================================

export function useCreateRoom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertRoom) => {
      const res = await apiRequest('POST', '/api/rooms', data);
      return res.json() as Promise<Room>;
    },
    onSuccess: () => {
      // Invalide le cache "rooms" pour forcer un refetch
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}

// ============================================================================
// MUTATION : Mettre à jour une chambre
// ============================================================================

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertRoom> }) => {
      const res = await apiRequest('PATCH', `/api/rooms/${id}`, data);
      return res.json() as Promise<Room>;
    },
    onSuccess: (updatedRoom) => {
      // Met à jour le cache directement (optimistic update)
      queryClient.setQueryData(['rooms'], (old: Room[] | undefined) => {
        return old?.map(room => room.id === updatedRoom.id ? updatedRoom : room);
      });
      // Met aussi à jour la query individuelle
      queryClient.setQueryData(['rooms', updatedRoom.id], updatedRoom);
    },
  });
}

// ============================================================================
// MUTATION : Supprimer une chambre
// ============================================================================

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/rooms/${id}`);
      return res.json();
    },
    onSuccess: (_, deletedId) => {
      // Retire la chambre du cache
      queryClient.setQueryData(['rooms'], (old: Room[] | undefined) => {
        return old?.filter(room => room.id !== deletedId);
      });
      // Supprime la query individuelle
      queryClient.removeQueries({ queryKey: ['rooms', deletedId] });
    },
  });
}
```

**Explication des patterns :**

- `useQuery` : Pour les opérations de lecture (GET)
- `useMutation` : Pour les opérations d'écriture (POST, PATCH, DELETE)
- `invalidateQueries` : Force un refetch (après création)
- `setQueryData` : Met à jour le cache directement (optimistic update)
- `removeQueries` : Supprime du cache (après suppression)

---

## 💻 Code Pratique — Connecter la Page Rooms

### Mise à Jour de `client/src/pages/rooms.tsx`

```typescript
import { RoomCard } from '@/components/room-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRooms, useDeleteRoom } from '@/hooks/useRooms';
import { useToast } from '@/hooks/use-toast';

export default function Rooms() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Fetch les chambres depuis l'API
  const { data: rooms = [], isLoading, error } = useRooms();
  const deleteRoom = useDeleteRoom();

  // Filtrer les chambres (côté client pour l'instant)
  const filteredRooms = rooms.filter(room => {
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesSearch = 
      room.room_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.room_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    
    try {
      await deleteRoom.mutateAsync(id);
      toast({
        title: 'Success',
        description: 'Room deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete room',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading rooms. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Room Management</h1>
          <p className="text-muted-foreground mt-1">Manage your hotel rooms and availability.</p>
        </div>
        <Button data-testid="button-add-room">
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rooms</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="cleaning">Cleaning</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <RoomCard
            key={room.id}
            roomNumber={room.room_number}
            roomType={room.room_type}
            capacity={room.capacity}
            pricePerNight={room.price_per_night}
            currency="HTG"
            status={room.status as any}
            onEdit={() => console.log(`Edit room ${room.id}`)}
            onDelete={() => handleDelete(room.id)}
          />
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== 'all' 
              ? 'No rooms found matching your criteria.'
              : 'No rooms yet. Create your first room!'}
          </p>
        </div>
      )}
    </div>
  );
}
```

**Changements principaux :**

1. Remplacement de `mockRooms` par `useRooms()` hook
2. Ajout de `isLoading` et `error` states
3. Gestion de la suppression avec `useDeleteRoom()`
4. Mapping des données API vers les props du composant

---

## ⚠️ Bonnes Pratiques — Frontend

### 1. Toujours Gérer les États de Chargement

```typescript
// ✅ BON
if (isLoading) return <Spinner />;
if (error) return <ErrorMessage />;
return <DataComponent data={data} />;

// ❌ MAUVAIS
return <DataComponent data={data} />; // data peut être undefined
```

### 2. Optimistic Updates pour Meilleure UX

```typescript
onSuccess: (newRoom) => {
  // Met à jour immédiatement l'UI (optimistic)
  queryClient.setQueryData(['rooms'], (old) => [...old, newRoom]);
  
  // Puis refetch en arrière-plan pour synchroniser
  queryClient.invalidateQueries({ queryKey: ['rooms'] });
}
```

### 3. Gestion Centralisée du Token

**Fichier : `client/src/lib/auth.ts`**
```typescript
const AUTH_TOKEN_KEY = 'auth_token';

export function setAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function removeAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}
```

---

## ✅ Checkpoint Chapitre 4

**Tests à effectuer :**

1. **Page Rooms charge les données :**
   - Se connecter à l'app
   - Aller sur `/rooms`
   - Vérifier que les chambres s'affichent (depuis l'API)

2. **Suppression fonctionne :**
   - Cliquer sur "Delete" d'une chambre
   - Vérifier que la chambre disparaît de l'UI

**Si tout fonctionne → Tome 5 (Tests et Intégration) !** 🧪

---

*[Ce tome couvre le Sprint 4. Le Tome 5 couvrira les Tests, l'Intégration complète, et la Gestion d'erreurs avancée.]*

