# 🏨 HotelGenius — Tome 5 : Intégration Front/Back, Tests et Gestion d'Erreurs

> **Formation pratique complète pour intégrer frontend et backend, écrire des tests unitaires et d'intégration, et gérer les erreurs de manière professionnelle.**

**Style pédagogique :**
- 🎓 **Cours universitaire** — Définitions académiques
- 👨🏽‍🏫 **Mentor** — Explications concrètes
- 🧠 **Ingénierie SaaS** — Patterns avancés
- 💻 **Code pratique** — Exemples complets
- ⚠️ **Bonnes pratiques** — Conseils d'ingénieur senior

---

## 📋 Table des Matières

1. [Chapitre 1 — Tests Unitaires avec Vitest](#chapitre-1--tests-unitaires-avec-vitest)
2. [Chapitre 2 — Tests d'Intégration API avec Supertest](#chapitre-2--tests-dintégration-api-avec-supertest)
3. [Chapitre 3 — Tests Frontend avec Testing Library](#chapitre-3--tests-frontend-avec-testing-library)
4. [Chapitre 4 — Gestion d'Erreurs Avancée](#chapitre-4--gestion-derreurs-avancée)
5. [Chapitre 5 — Intégration Complète Front/Back](#chapitre-5--intégration-complète-frontback)
6. [Chapitre 6 — Bilan et Préparation du Tome 6](#chapitre-6--bilan-et-préparation-du-tome-6)

---

# Chapitre 1 — Tests Unitaires avec Vitest

## 🎓 Cours Universitaire — Pourquoi Tester ?

### Définition Académique

Les **tests unitaires** vérifient qu'une **fonction isolée** se comporte correctement. Ils sont rapides, déterministes et indépendants.

**Pyramide des Tests :**
```
        /\
       /E2E\         ← Tests End-to-End (lents, chers)
      /──────\
     / Intégration \ ← Tests d'intégration (moyens)
    /──────────────\
   /   Unitaires    \ ← Tests unitaires (rapides, nombreux)
  /──────────────────\
```

**Principe :** Beaucoup de tests unitaires (base), quelques tests d'intégration, très peu de tests E2E.

---

## 💻 Code Pratique — Configuration Vitest

**Fichier : `server/package.json`** (ajouter)
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "vitest": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0"
  }
}
```

**Fichier : `server/vitest.config.ts`**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

**Exemple de Test : `server/src/auth/utils.test.ts`**
```typescript
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, generateToken, verifyToken } from './utils';

describe('Password Hashing', () => {
  it('should hash a password', async () => {
    const hash = await hashPassword('test123');
    expect(hash).toMatch(/^\$2[aby]\$/); // Format bcrypt
  });

  it('should verify a correct password', async () => {
    const hash = await hashPassword('test123');
    const isValid = await verifyPassword('test123', hash);
    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const hash = await hashPassword('test123');
    const isValid = await verifyPassword('wrong', hash);
    expect(isValid).toBe(false);
  });
});

describe('JWT Tokens', () => {
  it('should generate a valid token', () => {
    const token = generateToken({ id: 'user-1', hotel_id: 'hotel-1', role: 'owner' });
    expect(token).toBeDefined();
    expect(token.split('.')).toHaveLength(3); // JWT = 3 parties
  });

  it('should verify a valid token', () => {
    const payload = { id: 'user-1', hotel_id: 'hotel-1', role: 'owner' };
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    
    expect(decoded).toBeTruthy();
    expect(decoded?.id).toBe('user-1');
    expect(decoded?.hotel_id).toBe('hotel-1');
  });

  it('should reject an invalid token', () => {
    const decoded = verifyToken('invalid-token');
    expect(decoded).toBeNull();
  });
});
```

---

# Chapitre 2 — Tests d'Intégration API

**Fichier : `server/src/routes/auth.test.ts`**
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../index'; // Express app

describe('POST /api/auth/register', () => {
  it('should register a new hotel and user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        hotel_name: 'Test Hotel',
        username: 'testowner',
        password: 'test123456',
        email: 'test@hotel.com',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.role).toBe('owner');
  });

  it('should reject duplicate username', async () => {
    // Premier enregistrement
    await request(app).post('/api/auth/register').send({
      hotel_name: 'Hotel 1',
      username: 'duplicate',
      password: 'test123456',
    });

    // Tentative de duplicate
    const res = await request(app).post('/api/auth/register').send({
      hotel_name: 'Hotel 2',
      username: 'duplicate', // Même username
      password: 'test123456',
    });

    expect(res.status).toBe(409);
  });
});
```

---

# Chapitre 3 — Tests Frontend avec Testing Library

## 🎓 Cours Universitaire — Testing Library Philosophy

### Définition Académique

**React Testing Library** est une bibliothèque qui encourage à tester les composants **comme un utilisateur les utiliserait**, plutôt que d'implémenter des détails internes.

**Principes :**
1. **Test behavior, not implementation** : Tester ce que l'utilisateur voit
2. **Query by role/text** : Utiliser `getByRole`, `getByText` plutôt que `getByTestId`
3. **Accessible queries first** : Les queries accessibles sont plus robustes

---

## 💻 Code Pratique — Test d'un Composant

**Installation :**
```bash
cd client
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Fichier : `client/vitest.config.ts`**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

**Fichier : `client/src/test/setup.ts`**
```typescript
import '@testing-library/jest-dom';
```

**Exemple : `client/src/components/room-card.test.tsx`**
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RoomCard } from './room-card';

describe('RoomCard', () => {
  it('should display room information', () => {
    render(
      <RoomCard
        roomNumber="101"
        roomType="Standard Double"
        capacity={2}
        pricePerNight={1500}
        currency="HTG"
        status="available"
      />
    );

    expect(screen.getByText('Room 101')).toBeInTheDocument();
    expect(screen.getByText('Standard Double')).toBeInTheDocument();
    expect(screen.getByText('1500 HTG')).toBeInTheDocument();
  });

  it('should show guest information when occupied', () => {
    render(
      <RoomCard
        roomNumber="205"
        roomType="Deluxe Suite"
        capacity={4}
        pricePerNight={3500}
        currency="HTG"
        status="occupied"
        guestName="Pierre Toussaint"
        checkoutDate="Nov 6, 2025"
      />
    );

    expect(screen.getByText(/Pierre Toussaint/)).toBeInTheDocument();
    expect(screen.getByText(/Nov 6, 2025/)).toBeInTheDocument();
  });
});
```

---

# Chapitre 4 — Gestion d'Erreurs Avancée

## 🎓 Cours Universitaire — Error Handling Patterns

### Types d'Erreurs

1. **Erreurs de validation** : 400 Bad Request (Zod)
2. **Erreurs d'authentification** : 401 Unauthorized
3. **Erreurs d'autorisation** : 403 Forbidden
4. **Erreurs de ressources** : 404 Not Found
5. **Erreurs serveur** : 500 Internal Server Error

---

## 💻 Code Pratique — Error Handler Avancé

**Fichier : `server/src/middleware/errors.ts`**
```typescript
import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { log } from '../vite';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log l'erreur
  log(`ERROR: ${err.message}`, 'error');
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Erreur Zod (validation)
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors,
    });
  }

  // Erreur AppError personnalisée
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Erreur inconnue → 500
  return res.status(500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message,
  });
}
```

**Utilisation :**
```typescript
// Dans une route
if (!room) {
  throw new AppError(404, 'Room not found');
}
```

---

# Chapitre 5 — Intégration Complète Front/Back

## 💻 Code Pratique — Flow Complet

**Scénario : Créer une réservation**

1. **Frontend : Formulaire**
```typescript
// pages/reservations.tsx
const createReservation = useCreateReservation();

const handleSubmit = async (data) => {
  try {
    await createReservation.mutateAsync(data);
    toast({ title: 'Reservation created!' });
  } catch (error) {
    toast({ title: 'Error', variant: 'destructive' });
  }
};
```

2. **Backend : Route**
```typescript
// routes/reservations.ts
app.post('/api/reservations', authenticate, async (req, res) => {
  const validated = insertReservationSchema.parse(req.body);
  const hotelId = req.user.hotel_id!;
  
  // Vérifier disponibilité
  const isAvailable = await checkRoomAvailability(
    validated.room_id,
    validated.check_in,
    validated.check_out
  );
  
  if (!isAvailable) {
    throw new AppError(409, 'Room not available for these dates');
  }
  
  const reservation = await db.insert(reservations).values({
    ...validated,
    hotel_id: hotelId,
  }).returning();
  
  res.status(201).json(reservation[0]);
});
```

---

## ✅ Checkpoint Chapitre 5

**Tests end-to-end :**
1. Créer une réservation depuis le frontend
2. Vérifier qu'elle apparaît dans la liste
3. Vérifier l'isolation multi-tenant (hotel A ne voit pas hotel B)

---

# Chapitre 6 — Bilan et Préparation du Tome 6

## ✅ Résumé du Tome 5

Tu as appris :
- ✅ Tests unitaires avec Vitest
- ✅ Tests d'intégration API avec Supertest
- ✅ Tests frontend avec Testing Library
- ✅ Gestion d'erreurs avancée
- ✅ Intégration complète front/back

**Préparation Tome 6 :** Sécurité, CI/CD, Déploiement 🚀

