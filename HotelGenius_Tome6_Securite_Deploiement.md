# 🏨 HotelGenius — Tome 6 : Sécurité Avancée, CI/CD et Déploiement

> **Formation pratique complète pour durcir la sécurité, configurer CI/CD avec GitHub Actions, et déployer l'application en production sur Railway, Vercel et Neon.**

**Style pédagogique :**
- 🎓 **Cours universitaire** — Définitions académiques
- 👨🏽‍🏫 **Mentor** — Explications concrètes
- 🧠 **Ingénierie SaaS** — Patterns avancés
- 💻 **Code pratique** — Exemples complets
- ⚠️ **Bonnes pratiques** — Conseils d'ingénieur senior

---

## 📋 Table des Matières

1. [Chapitre 1 — Sécurité Avancée (Helmet, Rate Limiting, CORS)](#chapitre-1--sécurité-avancée-helmet-rate-limiting-cors)
2. [Chapitre 2 — Configuration CI/CD avec GitHub Actions](#chapitre-2--configuration-cicd-avec-github-actions)
3. [Chapitre 3 — Déploiement Backend sur Railway](#chapitre-3--déploiement-backend-sur-railway)
4. [Chapitre 4 — Déploiement Frontend sur Vercel](#chapitre-4--déploiement-frontend-sur-vercel)
5. [Chapitre 5 — Configuration Variables d'Environnement Production](#chapitre-5--configuration-variables-denvironnement-production)
6. [Chapitre 6 — Bilan et Préparation du Tome 7](#chapitre-6--bilan-et-préparation-du-tome-7)

---

# Chapitre 1 — Sécurité Avancée

## 🎓 Cours Universitaire — Principes de Sécurité Web

### OWASP Top 10

L'**OWASP Top 10** liste les 10 vulnérabilités web les plus critiques :

1. **Injection** : SQL injection, NoSQL injection
2. **Broken Authentication** : Failles dans l'authentification
3. **Sensitive Data Exposure** : Exposition de données sensibles
4. **XML External Entities** : Attaques XXE
5. **Broken Access Control** : Contrôle d'accès défaillant
6. **Security Misconfiguration** : Mauvaise configuration
7. **XSS** : Cross-Site Scripting
8. **Insecure Deserialization** : Désérialisation non sécurisée
9. **Using Components with Known Vulnerabilities** : Dépendances vulnérables
10. **Insufficient Logging** : Logging insuffisant

**Pour HotelGenius, focus sur :**
- ✅ Validation stricte (prévenir injection)
- ✅ JWT sécurisé (broken authentication)
- ✅ Multi-tenant isolation (broken access control)
- ✅ Rate limiting (protection DoS)

---

## 💻 Code Pratique — Sécurisation Express

**Installation :**
```bash
pnpm add helmet express-rate-limit cors
```

**Fichier : `server/src/middleware/security.ts`**
```typescript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

// Helmet : Sécurise les headers HTTP
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
    },
  },
});

// Rate Limiting : Limite les requêtes par IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  message: 'Too many requests from this IP, please try again later.',
});

// CORS : Configure les origines autorisées
export const corsConfig = cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
});
```

**Dans `server/src/index.ts` :**
```typescript
import { securityHeaders, apiLimiter, corsConfig } from './middleware/security';

app.use(corsConfig);
app.use(securityHeaders);
app.use('/api/', apiLimiter);
```

---

# Chapitre 2 — CI/CD avec GitHub Actions

**Fichier : `.github/workflows/ci.yml`**
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm type-check
      - run: pnpm test
      - run: pnpm build
```

---

# Chapitre 3 — Déploiement

## Railway (Backend + Database)

1. Créer un compte sur [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Variables d'environnement :
   - `DATABASE_URL` (auto-généré si Railway PostgreSQL)
   - `JWT_SECRET` (générer un secret fort)
   - `PORT` (Railway définit automatiquement)

## Vercel (Frontend)

1. Créer un compte sur [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Build settings :
   - Framework: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist/public`

---

# Chapitre 3 — Déploiement Backend sur Railway

## 🎓 Cours Universitaire — Platform as a Service (PaaS)

**PaaS** = Plateforme qui gère l'infrastructure, le déploiement, et la scalabilité automatiquement.

**Avantages :**
- ✅ Pas besoin de gérer serveurs
- ✅ Scalabilité automatique
- ✅ HTTPS inclus
- ✅ Variables d'environnement sécurisées

---

## 👨🏽‍🏫 Mentor — Railway vs Alternatives

**Railway** : Simple, excellent pour débuter
**Render** : Alternative similaire
**Heroku** : Plus cher, mais très mature
**AWS/GCP** : Plus complexe, plus de contrôle

**Pour HotelGenius :** Railway est parfait pour commencer.

---

## 💻 Code Pratique — Déploiement Railway

**Étapes :**

1. **Créer `railway.json`** (optionnel, pour config)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "pnpm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. **Variables d'environnement dans Railway Dashboard :**
   - `DATABASE_URL` (auto si Railway PostgreSQL)
   - `JWT_SECRET` (générer : `openssl rand -base64 32`)
   - `NODE_ENV=production`
   - `PORT` (auto-défini par Railway)

3. **Build Command :**
```bash
pnpm install && pnpm build
```

4. **Start Command :**
```bash
pnpm start
```

---

# Chapitre 4 — Déploiement Frontend sur Vercel

## 💻 Code Pratique — Configuration Vercel

**Fichier : `vercel.json` (racine)**
```json
{
  "buildCommand": "cd client && pnpm build",
  "outputDirectory": "dist/public",
  "framework": "vite",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev:client"
}
```

**Variables d'environnement Vercel :**
- `VITE_API_URL` : URL du backend Railway
- `VITE_SENTRY_DSN` : (optionnel) Sentry pour monitoring frontend

---

# Chapitre 5 — Configuration Variables d'Environnement Production

## ⚠️ Bonnes Pratiques — Secrets Management

**Jamais commiter :**
- JWT secrets
- Database passwords
- API keys (Stripe, etc.)

**Utiliser :**
- Variables d'environnement dans Railway/Vercel
- `.env.production` (non commité)
- Secrets managers pour production (AWS Secrets Manager, etc.)

---

## ✅ Checkpoint Chapitre 6

**Vérifications :**
1. Application déployée et accessible
2. HTTPS fonctionnel
3. Variables d'environnement configurées
4. Tests passent en CI/CD

---

# Chapitre 6 — Bilan et Préparation du Tome 7

## ✅ Résumé du Tome 6

Tu as appris :
- ✅ Sécurité avancée (Helmet, Rate Limiting)
- ✅ CI/CD avec GitHub Actions
- ✅ Déploiement Railway + Vercel
- ✅ Configuration production

**Préparation Tome 7 :** Maintenance, Monitoring, Logs 🔍

