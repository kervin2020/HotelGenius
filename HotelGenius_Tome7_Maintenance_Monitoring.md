# 🏨 HotelGenius — Tome 7 : Maintenance, Monitoring, Logs et Sauvegardes

> **Formation pratique complète pour maintenir l'application en production : monitoring avec Sentry, logs structurés, sauvegardes automatiques, et gestion des incidents.**

---

## 📋 Table des Matières

1. [Chapitre 1 — Monitoring avec Sentry](#chapitre-1--monitoring-avec-sentry)
2. [Chapitre 2 — Logs Structurés](#chapitre-2--logs-structurés)
3. [Chapitre 3 — Sauvegardes Automatiques](#chapitre-3--sauvegardes-automatiques)
4. [Chapitre 4 — Gestion des Incidents](#chapitre-4--gestion-des-incidents)
5. [Chapitre 5 — Métriques et Alertes](#chapitre-5--métriques-et-alertes)
6. [Chapitre 6 — Bilan et Préparation du Tome 8](#chapitre-6--bilan-et-préparation-du-tome-8)

---

# Chapitre 1 — Monitoring avec Sentry

## 🎓 Cours Universitaire — Qu'est-ce que le Monitoring ?

Le **monitoring** consiste à surveiller l'état de l'application en temps réel pour détecter les problèmes avant qu'ils n'affectent les utilisateurs.

**Types de monitoring :**
- **Error Tracking** : Capture des erreurs (Sentry)
- **Performance Monitoring** : Temps de réponse, latence
- **Uptime Monitoring** : Vérifie que l'app est accessible (UptimeRobot)
- **Logs Aggregation** : Centralise les logs (Logtail, Datadog)

---

## 💻 Code Pratique — Configuration Sentry

**Installation :**
```bash
pnpm add @sentry/node @sentry/react
```

**Fichier : `server/src/index.ts`** (ajouter au début)
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'production',
  tracesSampleRate: 1.0, // 100% des transactions pour debug
});
```

**Fichier : `client/src/main.tsx`**
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

---

# Chapitre 2 — Logs Structurés

## 🎓 Cours Universitaire — Structured Logging

**Logs structurés** = Logs au format JSON plutôt que texte libre.

**Avantages :**
- ✅ Facilement parsable (machines)
- ✅ Recherche facilitée (Logtail, Datadog)
- ✅ Métriques extraites automatiquement

---

## 💻 Code Pratique — Logger Structuré

**Fichier : `server/src/utils/logger.ts`**
```typescript
type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

export function log(level: LogLevel, message: string, context?: Record<string, any>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context && { context }),
  };
  
  // En production : envoyer vers service de logs (Logtail, etc.)
  if (process.env.NODE_ENV === 'production') {
    // fetch('https://logs.example.com', { method: 'POST', body: JSON.stringify(entry) });
  }
  
  console.log(JSON.stringify(entry));
}
```

---

# Chapitre 3 — Sauvegardes Automatiques

## 🎓 Cours Universitaire — Backup Strategy

**Règle 3-2-1 :**
- 3 copies des données
- 2 types de stockage différents
- 1 copie hors-site

**Pour PostgreSQL (Neon) :**
- ✅ Backups automatiques quotidiens (géré par Neon)
- ✅ Point-in-time recovery disponible
- ⚠️ Exporter aussi manuellement pour sécurité supplémentaire

---

## 💻 Code Pratique — Script de Backup

**Fichier : `scripts/backup-db.sh`**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > "backups/hotelgenius_$DATE.sql"
```

**Cron job (quotidien) :**
```bash
0 2 * * * /path/to/backup-db.sh  # 2h du matin chaque jour
```

---

# Chapitre 4 — Gestion des Incidents

## 🧠 Ingénierie SaaS — Runbook

**Runbook** = Procédure étape par étape pour résoudre des incidents.

**Exemple : "Database connection timeout"**

1. Vérifier les logs Railway
2. Vérifier le status Neon Dashboard
3. Redémarrer le service si nécessaire
4. Notifier l'équipe si problème persiste

---

# Chapitre 6 — Bilan et Préparation du Tome 8

## ✅ Résumé du Tome 7

Tu as appris :
- ✅ Monitoring avec Sentry
- ✅ Logs structurés
- ✅ Sauvegardes automatiques
- ✅ Gestion des incidents

**Préparation Tome 8 :** Scalabilité et Optimisation ⚡

