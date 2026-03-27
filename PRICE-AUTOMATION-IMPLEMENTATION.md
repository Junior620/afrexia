# Implémentation du Système d'Automatisation des Prix - Afrexia

## ✅ Fichiers Créés

### 1. Schéma Sanity
- ✅ `sanity/schemas/commodityPrice.ts` - Schéma pour stocker les prix
- ✅ `sanity/schemas/index.ts` - Mis à jour pour inclure commodityPrice

### 2. Service Backend
- ✅ `lib/sanity/priceService.ts` - Service pour gérer les prix dans Sanity

### 3. Cron Jobs API
- ✅ `app/api/cron/update-coffee-prices/route.ts` - Scraping ONCC (Cheerio)
- ✅ `app/api/cron/update-cocoa-price/route.ts` - Scraping ICE London (Playwright)

### 4. Scripts de Test
- ✅ `scripts/test-coffee-cron.js` - Test scraping café
- ✅ `scripts/test-cocoa-cron.js` - Test scraping cacao

### 5. Configuration
- ✅ `vercel.json` - Ajout des cron jobs (14h00 et 18h30 WAT)
- ✅ `.env.example` - Ajout de CRON_SECRET

## 📋 Prochaines Étapes

### 1. Ajouter CRON_SECRET dans .env.local

```bash
# Générer un secret aléatoire
openssl rand -base64 32

# Ajouter dans .env.local
CRON_SECRET=votre_secret_genere
```

### 2. Tester les Scripts Localement

```bash
# Test café
node scripts/test-coffee-cron.js

# Test cacao
node scripts/test-cocoa-cron.js
```

### 3. Créer les Documents Initiaux dans Sanity Studio

Aller sur https://votre-projet.sanity.studio et créer 3 documents "Prix des Matières Premières" :

1. **Cacao**
   - Produit: Cacao
   - Prix: 2350
   - Unité: FCFA/KG
   - Tendance: stable
   - Variation: 0
   - Source: ICE

2. **Café Arabica**
   - Produit: Café Arabica
   - Prix: 1280
   - Unité: FCFA/KG
   - Tendance: stable
   - Variation: 0
   - Source: ONCC

3. **Café Robusta**
   - Produit: Café Robusta
   - Prix: 950
   - Unité: FCFA/KG
   - Tendance: stable
   - Variation: 0
   - Source: ONCC

### 4. Mettre à Jour le Composant Hero

Le composant `components/sections/Hero.tsx` contient déjà le PriceMarquee avec des prix statiques.
Il faudra le connecter à l'API Sanity pour récupérer les prix dynamiques.

**Option 1 : Créer une API route**
```typescript
// app/api/prices/route.ts
import { PriceServiceServer } from '@/lib/sanity/priceService';

export async function GET() {
  const prices = await PriceServiceServer.getPrices();
  return Response.json(prices);
}
```

**Option 2 : Fetch directement dans le composant Hero (Server Component)**
```typescript
import { PriceServiceServer } from '@/lib/sanity/priceService';

// Dans Hero component
const prices = await PriceServiceServer.getPrices();
```

### 5. Déployer sur Vercel

```bash
git add .
git commit -m "feat: implement automated price scraping system"
git push origin main
```

### 6. Configurer les Variables d'Environnement sur Vercel

Dashboard Vercel → Settings → Environment Variables :
- `CRON_SECRET` : Le secret généré
- `SANITY_API_TOKEN` : Token avec permissions d'écriture

### 7. Vérifier les Cron Jobs

Dashboard Vercel → Cron Jobs :
- Vérifier que les 2 cron jobs sont listés
- Consulter les logs après la première exécution

## 🔧 Configuration des Horaires

- **Café (ONCC)** : 14h00 WAT (13h00 UTC) du lundi au vendredi
- **Cacao (ICE)** : 18h30 WAT (17h30 UTC) du lundi au vendredi

## 🧪 Tests Manuels des Endpoints

```bash
# Test cron café
curl -X GET https://votre-site.com/api/cron/update-coffee-prices \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Test cron cacao
curl -X GET https://votre-site.com/api/cron/update-cocoa-price \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## ⚠️ Notes Importantes

1. **Playwright sur Vercel** : Si Playwright échoue en production, installer `@sparticuz/chromium`
2. **XPath Fragiles** : Les sites peuvent changer leur structure HTML
3. **Rate Limiting** : Respecter les limites des sites sources
4. **Conversion de Devises** : Le prix ICE est en £/T, il faut le convertir en FCFA/KG

## 📊 Monitoring

Surveiller dans les logs Vercel :
- ✅ Succès : "Successfully updated X prices"
- ❌ Erreurs : "Failed to update prices"
- ⚠️ Timeouts : Augmenter `maxDuration` si nécessaire

## 🔄 Maintenance

1. Vérifier régulièrement les XPath/sélecteurs CSS
2. Tester les scripts locaux en cas d'échec
3. Mettre à jour les sélecteurs si les sites changent
4. Consulter les logs Vercel quotidiennement

## 📚 Documentation Complète

Voir `AUTOMATED-PRICE-SCRAPING-GUIDE.md` pour le guide complet.
