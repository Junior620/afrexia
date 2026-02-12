# Afrexia - Documentation Complète du Projet

## 📋 Vue d'ensemble

**Afrexia** est un site web B2B pour l'exportation de commodités agricoles africaines premium (cacao, café, poivre, bois, maïs, riz, sucre raffiné, huile de palme, fruits tropicaux, produits pétroliers).

### Technologies principales
- **Framework**: Next.js 15.5.9 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Design System personnalisé
- **CMS**: Sanity.io
- **Déploiement**: Vercel
- **Email**: Resend
- **Monitoring**: Sentry
- **Analytics**: Plausible

---

## 🎨 Design System - Dark Green Premium

### Palette de couleurs
```css
/* Mode Clair */
--primary: #194424 (vert foncé)
--secondary: #337A49 (vert moyen)
--accent: #655E2C (or/bronze)

/* Mode Sombre (par défaut) */
--dark-bg-primary: #0A1410 (fond principal)
--dark-bg-secondary: #1A2820 (fond secondaire)
--dark-primary: #4A9A62 (vert accent)
--dark-text-primary: #E8F5E9 (texte principal)
```

### Animations
Toutes les animations sont définies dans `tailwind.config.ts`:
- `fadeIn`, `slideInLeft`, `slideInRight`, `scaleIn`
- `shimmer`, `glow`, `pulse`, `ripple`
- `bounce`, `float`, `slideInFromTop`

---

## 📁 Structure du Projet

```
afrexia/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Routes multilingues (fr, en, es, de, ru)
│   │   ├── page.tsx             # Page d'accueil
│   │   ├── products/            # Catalogue produits
│   │   ├── contact/             # Page contact
│   │   ├── rfq/                 # Request for Quote
│   │   └── ...
│   ├── api/                     # API Routes
│   │   ├── contact/            # Endpoint formulaire contact
│   │   ├── rfq/                # Endpoint RFQ
│   │   └── catalog-download/   # Téléchargement catalogue
│   └── globals.css             # Styles globaux
│
├── components/                   # Composants React
│   ├── layout/                  # Header, Footer, Navigation
│   ├── sections/                # Sections de page (Hero, Statistics, etc.)
│   ├── catalog/                 # Composants catalogue produits
│   ├── forms/                   # Formulaires (Contact, RFQ)
│   ├── ui/                      # Composants UI réutilisables
│   └── providers/               # Context providers (Theme, Analytics)
│
├── lib/                         # Utilitaires et logique métier
│   ├── sanity/                 # Queries Sanity CMS
│   ├── i18n/                   # Internationalisation
│   ├── seo/                    # SEO et métadonnées
│   ├── analytics/              # Tracking analytics
│   └── content/                # Contenu statique
│
├── sanity/                      # Configuration Sanity CMS
│   ├── schemas/                # Schémas de données
│   └── sample-data/            # Données d'exemple
│
├── public/                      # Assets statiques
│   ├── assets/                 # Images
│   └── locales/                # Fichiers de traduction
│
└── .kiro/specs/                # Spécifications techniques
    ├── afrexia-website-redesign/
    ├── dark-mode-implementation/
    ├── multilingual-expansion/
    └── ...
```

---

## 🌍 Internationalisation (i18n)

### Langues supportées
- **Français (fr)** - Langue par défaut
- **Anglais (en)**
- **Espagnol (es)**
- **Allemand (de)**
- **Russe (ru)**

### Configuration
- Fichiers de traduction: `public/locales/{locale}.json`
- Utilitaires: `lib/i18n/translations.ts`
- Routing: `middleware.ts` gère la redirection locale

### Utilisation
```typescript
import { getTranslation } from '@/lib/i18n/translations';

const text = getTranslation(locale, 'navigation.home');
```

---

## 🎯 Fonctionnalités Principales

### 1. Mode Sombre par Défaut
- **Thème**: Dark Green Premium activé par défaut
- **Toggle**: Bouton dans le header pour basculer light/dark
- **Persistance**: Sauvegardé dans localStorage
- **Fichiers**: 
  - `components/providers/ThemeProvider.tsx`
  - `app/layout.tsx` (script d'initialisation)

### 2. Catalogue Produits
- **CMS**: Géré via Sanity Studio
- **Catégories**: cocoa, coffee, corn, pepper, wood, rice, refined-sugar, petroleum-products, palm-oil, tropical-fruits
- **Filtres**: Par catégorie, disponibilité, certifications
- **Composants**:
  - `components/catalog/ProductCard.tsx`
  - `components/catalog/CatalogFilters.tsx`
  - `app/[locale]/products/page.tsx`

### 3. Formulaires
#### Contact Form
- **Endpoint**: `/api/contact`
- **Validation**: Zod schema (`lib/forms/contact-schema.ts`)
- **Email**: Envoi via Resend
- **Composant**: `components/forms/ContactForm.tsx`

#### RFQ (Request for Quote)
- **Endpoint**: `/api/rfq`
- **Validation**: Zod schema (`lib/forms/rfq-schema.ts`)
- **Features**: Multi-produits, upload fichiers
- **Composant**: `components/forms/RFQForm.tsx`

### 4. Navigation Responsive
- **Desktop**: Menu horizontal avec dropdowns
- **Mobile**: Hamburger menu avec slide-in drawer
- **Portal**: Menu mobile rendu via Portal pour éviter les conflits de z-index
- **Composants**:
  - `components/layout/Header.tsx`
  - `components/layout/Navigation.tsx`
  - `components/layout/MobileNav.tsx`
  - `components/Portal.tsx`

### 5. Animations
- **Hero Section**: Particules animées, cercles flottants, fade-in
- **Product Cards**: Hover effects, scale, glow
- **Buttons**: Shimmer, border glow
- **Scroll Reveal**: Animations au scroll
- **Configuration**: `tailwind.config.ts`

---

## 🔧 Configuration Environnement

### Variables d'environnement (.env.local)
```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token

# Email (Resend)
RESEND_API_KEY=your_api_key
RESEND_FROM_EMAIL=noreply@afrexia.com
RESEND_TO_EMAIL=kemajoujulien@afrexiacmr.com
SALES_EMAIL=kemajoujulien@afrexiacmr.com
CONTACT_EMAIL=kemajoujulien@afrexiacmr.com

# reCAPTCHA v3
RECAPTCHA_SECRET_KEY=your_secret_key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_auth_token

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=afrexia.com
```

---

## 📦 Sanity CMS

### Schémas de données

#### Product
```typescript
{
  name: { fr, en, es, de, ru },
  slug: { fr, en, es, de, ru },
  subtitle: { fr, en, es, de, ru },
  category: 'cocoa' | 'coffee' | 'rice' | ...,
  heroImage: image,
  description: blockContent,
  availability: 'in-stock' | 'limited' | 'pre-order' | 'out-of-stock',
  moq: { value, unit },
  certifications: reference[],
  origins: reference[],
  // ... autres champs
}
```

#### Certification
```typescript
{
  name: { fr, en, es, de, ru },
  slug: { fr, en, es, de, ru },
  logo: image,
  description: { fr, en, es, de, ru }
}
```

#### Origin
```typescript
{
  country: { fr, en, es, de, ru },
  slug: { fr, en, es, de, ru },
  flag: image,
  coordinates: geopoint
}
```

### Accès Sanity Studio
- **URL**: `http://localhost:3000/studio` (dev)
- **Production**: `https://afrexia.com/studio`

---

## 🚀 Commandes Utiles

```bash
# Développement
npm run dev              # Démarre le serveur de dev (port 3000)

# Build
npm run build           # Build production
npm run start           # Démarre le serveur production

# Tests
npm run test            # Lance les tests
npm run test:e2e        # Tests end-to-end (Playwright)

# Linting
npm run lint            # ESLint
npm run lint:fix        # Fix automatique

# Sanity
npm run sanity:dev      # Sanity Studio en dev
npm run sanity:deploy   # Déploie Sanity Studio
```

---

## 📞 Informations de Contact

### Coordonnées Afrexia
- **Email**: kemajoujulien@afrexiacmr.com
- **Téléphone Cameroun**: +237 658 112 510
- **Téléphone France**: +33 753 195 242
- **WhatsApp**: +237 658 112 510
- **Adresse**: Douala, Cameroun

### Partenaire Stratégique
- **SCPB SARL**: https://ste-scpb.com
- Collecte, stockage et préparation export
- Réseau de +2000 producteurs
- Capacité annuelle: 20,000 tonnes

---

## 🎨 Pages Principales

### 1. Page d'Accueil (`/`)
- Hero avec animations
- Statistics (chiffres clés)
- Trust Bar (certifications)
- Products Showcase (3 produits)
- Journey Section
- Services Section
- Partner Sections (SCPB SARL, SEPACAM)

### 2. Catalogue Produits (`/products`)
- Header avec animations
- Filtres (catégorie, disponibilité)
- Grille de produits
- RFQ Drawer
- Quick View Modal

### 3. Page Produit (`/products/[slug]`)
- Galerie d'images
- Informations détaillées
- Spécifications techniques
- Certifications
- Origine et traçabilité
- CTA (RFQ, Download Catalog)

### 4. Contact (`/contact`)
- Formulaire de contact
- Informations de contact
- Carte interactive (Mapbox)
- Horaires d'ouverture

### 5. RFQ (`/rfq`)
- Formulaire multi-étapes
- Sélection de produits
- Upload de fichiers
- Informations entreprise

---

## 🔐 Sécurité

### Protection des formulaires
- **reCAPTCHA v3**: Validation côté serveur
- **Rate Limiting**: Limite de requêtes par IP
- **Validation**: Zod schemas pour tous les inputs
- **Sanitization**: Nettoyage des données utilisateur

### Headers de sécurité
Configurés dans `next.config.ts`:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

---

## 📊 Analytics & Monitoring

### Plausible Analytics
- **Tracking**: Pages vues, événements
- **Privacy-friendly**: Pas de cookies
- **Configuration**: `components/providers/AnalyticsProvider.tsx`

### Sentry
- **Error Tracking**: Erreurs frontend et backend
- **Performance**: Monitoring des performances
- **Configuration**: `sentry.*.config.ts`

---

## 🎯 SEO

### Métadonnées
- **Générées dynamiquement**: `lib/seo/metadata.ts`
- **Structured Data**: JSON-LD schemas
- **Sitemap**: Généré automatiquement
- **Robots.txt**: Configuration dans `app/robots.ts`

### Open Graph
- Images optimisées (1200x630)
- Descriptions localisées
- URLs canoniques

---

## 🐛 Debugging & Troubleshooting

### Problèmes courants

#### 1. Menu mobile ne s'affiche pas
- **Cause**: Conflits de z-index ou transform
- **Solution**: Utiliser le composant `Portal` pour rendre hors du contexte parent

#### 2. Erreur "Cannot read properties of null"
- **Cause**: Données manquantes dans Sanity
- **Solution**: Ajouter des vérifications de sécurité (`?.` operator)

#### 3. Hydration mismatch
- **Cause**: Différence entre SSR et client
- **Solution**: Utiliser `suppressHydrationWarning` ou `useEffect`

#### 4. Images ne se chargent pas
- **Cause**: Configuration Next.js images
- **Solution**: Vérifier `next.config.ts` > `images.domains` et `images.qualities`

---

## 📝 Conventions de Code

### Naming
- **Composants**: PascalCase (`ProductCard.tsx`)
- **Fichiers**: kebab-case (`product-card.tsx`)
- **Variables**: camelCase (`productList`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`)

### Structure des composants
```typescript
// 1. Imports
import { useState } from 'react';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Composant
export function MyComponent({ title }: Props) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Render
  return <div>{title}</div>;
}
```

### Commits
Format: `type: description`
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `update`: Mise à jour de contenu
- `refactor`: Refactoring
- `docs`: Documentation
- `style`: Styling

---

## 🔄 Workflow de Développement

### 1. Créer une branche
```bash
git checkout -b feature/nom-feature
```

### 2. Développer
- Suivre les conventions de code
- Tester localement
- Vérifier les erreurs TypeScript

### 3. Commit & Push
```bash
git add -A
git commit -m "feat: description"
git push origin feature/nom-feature
```

### 4. Déploiement
- **Automatique**: Push sur `main` déclenche le déploiement Vercel
- **Preview**: Chaque PR génère une preview URL

---

## 📚 Ressources Utiles

### Documentation
- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Sanity](https://www.sanity.io/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

### Outils
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Sanity Studio](https://afrexia.sanity.studio)
- [Sentry Dashboard](https://sentry.io)
- [Plausible Analytics](https://plausible.io)

---

## 🎓 Pour les Nouveaux Agents AI

### Contexte Important
1. **Mode sombre par défaut**: Le site utilise le thème Dark Green Premium
2. **Multilingue**: Toujours penser aux 5 langues (fr, en, es, de, ru)
3. **B2B**: Le ton est professionnel, orienté business
4. **Animations**: Utiliser les animations définies dans `tailwind.config.ts`
5. **Sanity CMS**: Les produits et contenus sont gérés via Sanity

### Fichiers Clés à Connaître
- `tailwind.config.ts`: Configuration design system
- `lib/i18n/translations.ts`: Traductions
- `lib/sanity/queries.ts`: Requêtes CMS
- `components/providers/ThemeProvider.tsx`: Gestion du thème
- `.env.local`: Variables d'environnement

### Commandes Rapides
```bash
# Démarrer le projet
npm run dev

# Voir les logs
npm run dev | grep -i error

# Rebuild après changements
npm run build

# Push sur GitHub
git add -A && git commit -m "message" && git push
```

---

## ✅ Checklist Avant Déploiement

- [ ] Tests passent (`npm run test`)
- [ ] Build réussit (`npm run build`)
- [ ] Pas d'erreurs TypeScript
- [ ] Variables d'environnement configurées
- [ ] Images optimisées
- [ ] SEO vérifié (métadonnées, sitemap)
- [ ] Responsive testé (mobile, tablet, desktop)
- [ ] Accessibilité vérifiée (WCAG)
- [ ] Performance acceptable (Lighthouse > 90)

---

**Dernière mise à jour**: Février 2025
**Version**: 1.0.0
**Maintenu par**: Équipe Afrexia
