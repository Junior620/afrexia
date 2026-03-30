# Guide de Déploiement V1 — SEO Programmatique Afrexia

Ce document couvre la checklist de déploiement V1, la stratégie de rollback, et le monitoring post-déploiement.

---

## Table des Matières

1. [Prérequis](#prérequis)
2. [Checklist de Déploiement V1](#checklist-de-déploiement-v1)
3. [Stratégie de Rollback](#stratégie-de-rollback)
4. [Monitoring Post-Déploiement](#monitoring-post-déploiement)
5. [Variables d'Environnement](#variables-denvironnement)
6. [Commandes Utiles](#commandes-utiles)

---

## Prérequis

Avant de démarrer le déploiement V1, vérifier que les éléments suivants sont en place :

- [ ] Accès Vercel avec droits de déploiement sur le projet
- [ ] Accès Sanity Studio avec droits d'édition sur le dataset `production`
- [ ] Variables d'environnement production configurées (voir [Variables d'Environnement](#variables-denvironnement))
- [ ] Sentry configuré et DSN disponible
- [ ] Tous les tests passent en local (`npx vitest run`)

---

## Checklist de Déploiement V1

### Étape 1 — Validation des données Sanity

- [ ] Les 5 pays d'export sont créés dans Sanity (`exportCountry`) :
  - Pays-Bas (NL) — `dataCompleteness >= 70`, `approvedForSEO = true`
  - Belgique (BE) — `dataCompleteness >= 70`, `approvedForSEO = true`
  - Allemagne (DE) — `dataCompleteness >= 70`, `approvedForSEO = true`
  - France (FR) — `dataCompleteness >= 70`, `approvedForSEO = true`
  - Chine (CN) — `dataCompleteness >= 70`, `approvedForSEO = true`
- [ ] Les 15 combinaisons produit × pays approuvées sont validées (voir `scripts/BUSINESS-COMBINATIONS.md`)
- [ ] Exécuter le script de validation des combinaisons :
  ```bash
  npx tsx scripts/validate-business-combinations.ts
  ```
- [ ] Les données de prix sont présentes pour les 4 produits (Cacao, Café Arabica, Café Robusta, Cajou)
- [ ] L'historique de prix sur 30 jours est disponible pour chaque produit

### Étape 2 — Validation des tests

- [ ] Tous les tests unitaires passent :
  ```bash
  npx vitest run __tests__/unit
  ```
- [ ] Tous les tests d'intégration passent :
  ```bash
  npx vitest run __tests__/integration
  ```
- [ ] Tous les tests property-based passent (minimum 100 runs chacun) :
  ```bash
  npx vitest run __tests__/properties
  ```
- [ ] Couverture de code ≥ 80% :
  ```bash
  npx vitest run --coverage
  ```

### Étape 3 — Déploiement en staging

- [ ] Déployer la branche de développement sur Vercel (preview deployment) :
  ```bash
  vercel --env NEXT_PUBLIC_SANITY_DATASET=production
  ```
- [ ] Vérifier que le build Vercel se termine sans erreur
- [ ] Vérifier que `generateStaticParams()` génère bien les ~30 pages V1 (15 produit×pays × locales + prix + comparaisons)

### Étape 4 — Validation manuelle en staging

**Pages Produit × Pays (15 combinaisons × 5 locales)**
- [ ] Vérifier une page produit × pays en français : `/fr/produits/cacao/export-netherlands`
- [ ] Vérifier la même page en anglais : `/en/produits/cacao/export-netherlands`
- [ ] Vérifier que le contenu fait ≥ 500 mots
- [ ] Vérifier que les FAQ sont présentes (3–5 questions)
- [ ] Vérifier que les disclaimers sont présents sur les données estimées
- [ ] Vérifier que le breadcrumb est correct
- [ ] Vérifier que la section "Pages connexes" contient 4–6 liens

**Pages Prix (4 produits × 5 locales)**
- [ ] Vérifier une page prix : `/fr/prix/cacao-cameroun`
- [ ] Vérifier que le prix actuel est affiché avec la date de mise à jour
- [ ] Vérifier que l'historique 30 jours est présent
- [ ] Vérifier que la tendance (hausse/baisse/stable) est calculée
- [ ] Vérifier que le disclaimer de prix est présent

**Pages Comparaison (guides)**
- [ ] Vérifier une page comparaison : `/fr/guide/cacao-vs-cafe-arabica`
- [ ] Vérifier que le tableau comparatif est généré
- [ ] Vérifier que les recommandations sont présentes

**SEO & Métadonnées**
- [ ] Vérifier les balises `<title>` (50–60 caractères) via les DevTools
- [ ] Vérifier les meta descriptions (150–160 caractères)
- [ ] Vérifier les balises hreflang (5 locales + x-default) dans le `<head>`
- [ ] Vérifier les données structurées schema.org via [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Vérifier les balises Open Graph et Twitter Card

**Sitemap**
- [ ] Accéder à `/sitemap.xml` et vérifier que le XML est valide
- [ ] Vérifier que les ~30 pages V1 indexables sont présentes
- [ ] Vérifier qu'aucune page `noindex` n'apparaît dans le sitemap
- [ ] Vérifier que les 5 variantes de locale sont présentes pour chaque page
- [ ] Vérifier les `changefreq` : `daily` pour les pages prix, `weekly` pour les autres

**Indexabilité**
- [ ] Vérifier que les pages avec données insuffisantes ont `<meta name="robots" content="noindex, follow">`
- [ ] Vérifier que les pages de qualité suffisante ont `<meta name="robots" content="index, follow">`

**Performances**
- [ ] Exécuter Lighthouse sur une page produit × pays → score ≥ 90
- [ ] Vérifier TTFB < 2 secondes sur les pages principales
- [ ] Vérifier les headers de cache HTTP : `Cache-Control`, `ETag`

**Erreurs**
- [ ] Accéder à une route invalide (ex: `/fr/produits/cacao/export-inexistant`) → vérifier 404 personnalisée
- [ ] Vérifier que la page 404 contient des suggestions, un formulaire de recherche, et des liens populaires

**Middleware**
- [ ] Tester la redirection d'une locale non supportée (ex: `/zh/produits/...`) → doit rediriger vers `/fr/...` (301)

### Étape 5 — Déploiement en production

- [ ] Merger la branche vers `main`
- [ ] Le déploiement automatique Vercel se déclenche
- [ ] Vérifier que le build de production se termine sans erreur dans le dashboard Vercel
- [ ] Vérifier que les pages sont accessibles sur `https://afrexia.com`
- [ ] Soumettre le sitemap à Google Search Console : `https://afrexia.com/sitemap.xml`
- [ ] Vérifier que Sentry reçoit bien les événements (tester une erreur volontaire en dev)

---

## Stratégie de Rollback

### Rollback Vercel (recommandé)

Vercel conserve l'historique de tous les déploiements. En cas de problème critique :

1. Aller dans le dashboard Vercel → onglet **Deployments**
2. Identifier le dernier déploiement stable
3. Cliquer sur **Promote to Production**

Le rollback est instantané (< 30 secondes) et ne nécessite pas de rebuild.

### Rollback Git

Si le rollback Vercel n'est pas suffisant (ex: problème de données Sanity) :

```bash
# Identifier le commit stable
git log --oneline -10

# Créer une branche de hotfix depuis le commit stable
git checkout -b hotfix/rollback <commit-sha>

# Déployer manuellement
vercel --prod
```

### Rollback Sanity

Si des données Sanity incorrectes ont été publiées :

1. Ouvrir Sanity Studio → document concerné
2. Utiliser l'historique des révisions (icône horloge) pour restaurer une version précédente
3. Republier le document

Pour un rollback massif de données, utiliser l'API Sanity :
```bash
# Exporter le dataset avant toute modification importante
npx sanity dataset export production backup-$(date +%Y%m%d).tar.gz
```

### Décisions de Rollback

| Sévérité | Symptôme | Action |
|----------|----------|--------|
| Critique | Build cassé, site inaccessible | Rollback Vercel immédiat |
| Haute | Pages 500 sur les routes SEO | Rollback Vercel + investigation |
| Moyenne | Contenu incorrect sur quelques pages | Correction Sanity + revalidation ISR |
| Basse | Métadonnées incorrectes | Correction code + redéploiement |

### Forcer la Revalidation ISR

Si des pages en cache servent du contenu obsolète après une correction :

```bash
# Via l'API de revalidation (si configurée)
curl -X POST https://afrexia.com/api/revalidate \
  -H "Authorization: Bearer $REVALIDATION_SECRET" \
  -d '{"path": "/fr/produits/cacao/export-netherlands"}'
```

Ou déclencher un redéploiement Vercel pour régénérer toutes les pages statiques.

---

## Monitoring Post-Déploiement

### Surveillance immédiate (J+0, premières 24h)

- [ ] **Sentry** : Surveiller le tableau de bord pour toute nouvelle erreur ISR (`ISRErrorType`)
  - Erreurs `DATA_FETCH_ERROR` → problème de connexion Sanity
  - Erreurs `CONTENT_GENERATION_ERROR` → problème de génération de contenu
  - Erreurs `VALIDATION_ERROR` → données insuffisantes pour une combinaison
- [ ] **Vercel Analytics** : Vérifier les métriques Core Web Vitals (LCP, FID, CLS)
- [ ] **Vercel Logs** : Surveiller les logs de build et de runtime pour les erreurs 500
- [ ] Vérifier que les pages prix se régénèrent correctement toutes les 24h (ISR)

### Surveillance hebdomadaire (J+7)

- [ ] **Google Search Console** : Vérifier l'indexation des nouvelles pages
  - Aller dans **Coverage** → vérifier que les pages V1 sont indexées
  - Vérifier l'absence d'erreurs de crawl
- [ ] **Sitemap** : Vérifier que Google a bien traité le sitemap soumis
- [ ] **Sentry** : Analyser les erreurs de la semaine, identifier les patterns récurrents
- [ ] **Logs ISR** : Vérifier les logs de régénération dans Vercel pour détecter des échecs silencieux

### Métriques à surveiller

| Métrique | Seuil d'alerte | Outil |
|----------|---------------|-------|
| TTFB | > 2 secondes | Vercel Analytics |
| Taux d'erreur 5xx | > 0.1% | Sentry / Vercel |
| Score Lighthouse Performance | < 90 | Lighthouse CI |
| Pages indexées | < 80% des pages V1 | Google Search Console |
| Erreurs ISR | > 5 par heure | Sentry |
| Données périmées (> 90 jours) | Toute occurrence | Logs applicatifs |

### Alertes Sentry recommandées

Configurer les alertes suivantes dans Sentry :

```
Règle 1 : ISR Data Fetch Error
  Condition : event.type = "ISRError" AND event.data.type = "DATA_FETCH_ERROR"
  Fréquence : > 3 occurrences en 1 heure
  Action : Notification Slack + email

Règle 2 : Taux d'erreur élevé
  Condition : error rate > 1% sur 5 minutes
  Action : Notification Slack immédiate

Règle 3 : Nouvelle erreur critique
  Condition : first_seen AND level = "fatal"
  Action : Notification email immédiate
```

### Vérification de la fraîcheur des données

Le système alerte automatiquement si des données ont plus de 90 jours sans mise à jour (Requirement 1.10.7). Surveiller les logs applicatifs pour les messages :

```
[DataFreshness] WARNING: Data for "cacao" is 95 days old (threshold: 90 days)
```

Si une telle alerte apparaît, mettre à jour les données dans Sanity Studio.

---

## Variables d'Environnement

Toutes les variables requises sont documentées dans `.env.production.template`. Les variables critiques pour le SEO programmatique :

| Variable | Description | Requis |
|----------|-------------|--------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ID du projet Sanity | ✅ |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset Sanity (`production`) | ✅ |
| `SANITY_API_TOKEN` | Token API Sanity (lecture) | ✅ |
| `NEXT_PUBLIC_SITE_URL` | URL de base du site (`https://afrexia.com`) | ✅ |
| `NEXT_PUBLIC_SENTRY_DSN` | DSN Sentry pour le monitoring des erreurs ISR | ✅ |
| `SENTRY_AUTH_TOKEN` | Token Sentry pour le source mapping | ✅ |
| `SANITY_WEBHOOK_SECRET` | Secret pour les webhooks de revalidation | Recommandé |

Configurer ces variables dans le dashboard Vercel : **Settings → Environment Variables**.

---

## Commandes Utiles

```bash
# Lancer tous les tests avant déploiement
npx vitest run

# Lancer les tests avec couverture
npx vitest run --coverage

# Valider les combinaisons métier dans Sanity
npx tsx scripts/validate-business-combinations.ts

# Build local pour vérifier les erreurs de compilation
npm run build

# Exporter un backup Sanity avant modifications importantes
npx sanity dataset export production backup-$(date +%Y%m%d).tar.gz

# Déployer en preview (staging)
vercel

# Déployer en production
vercel --prod
```

---

## Références

- [Architecture V1](ARCHITECTURE.md)
- [Guide des Tests](TESTING.md)
- [Combinaisons Métier](scripts/BUSINESS-COMBINATIONS.md)
- [Stratégie ISR](lib/seo/ISR_STRATEGY.md)
- [Variables d'Environnement](.env.production.template)
- [Documentation Vercel ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
