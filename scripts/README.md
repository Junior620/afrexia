# Sanity Data Import Scripts

Scripts pour importer automatiquement les données de base dans Sanity CMS.

## Prérequis

1. **Token Sanity avec permissions d'écriture**
   - Va sur https://www.sanity.io/manage
   - Sélectionne ton projet
   - Va dans "API" → "Tokens"
   - Crée un nouveau token avec permissions "Editor" ou "Administrator"
   - Copie le token

2. **Ajoute le token dans `.env.local`**
   ```bash
   SANITY_API_TOKEN=skXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

## Scripts disponibles

### 1. Importer tout (Recommandé)

Importe catégories + origines en une seule commande :

```bash
npm run sanity:import-all
```

### 2. Importer uniquement les catégories

```bash
npm run sanity:import-categories
```

Importe 5 catégories de produits :
- 🍫 Cacao / Cocoa
- ☕ Café / Coffee
- 🌶️ Poivre / Pepper
- 🪵 Bois / Wood
- 🌽 Maïs / Corn

### 3. Importer uniquement les origines

```bash
npm run sanity:import-origins
```

Importe 15 pays africains :
- 🇨🇲 Cameroun / Cameroon
- 🇨🇮 Côte d'Ivoire / Ivory Coast
- 🇬🇭 Ghana
- 🇳🇬 Nigéria / Nigeria
- 🇪🇹 Éthiopie / Ethiopia
- 🇰🇪 Kenya
- 🇺🇬 Ouganda / Uganda
- 🇹🇿 Tanzanie / Tanzania
- 🇷🇼 Rwanda
- 🇧🇮 Burundi
- 🇹🇬 Togo
- 🇧🇯 Bénin / Benin
- 🇸🇳 Sénégal / Senegal
- 🇲🇬 Madagascar
- 🇨🇩 Congo (RDC) / Congo (DRC)

## Utilisation

### Étape 1 : Importer les données

```bash
npm run sanity:import-all
```

Tu devrais voir :
```
🚀 Starting complete data import...

📦 Step 1/2: Importing categories...
✅ Successfully imported 5 product categories!

🌍 Step 2/2: Importing origins...
✅ Successfully imported 15 origin countries!

✅ All data imported successfully!
```

### Étape 2 : Vérifier dans Sanity Studio

1. Ouvre Sanity Studio : `http://localhost:3333`
2. Va dans "Categories" → tu devrais voir 5 catégories
3. Va dans "Origin Country" → tu devrais voir 15 pays
4. Maintenant tu peux créer des produits et les lier à ces catégories/origines !

## Données importées

### Catégories (5)

Chaque catégorie contient :
- **Name** : Nom multilingue (FR, EN, ES, DE, RU)
- **Slug** : URL-friendly slug multilingue
- **Description** : Description multilingue
- **Sort Order** : Ordre d'affichage

### Origines (15)

Chaque origine contient :
- **Name** : Nom du pays multilingue (FR, EN, ES, DE, RU)
- **Code** : Code ISO 3166-1 alpha-2 (ex: CM, CI, GH)
- **Flag** : Emoji drapeau (ex: 🇨🇲)
- **Description** : Description multilingue
- **Sort Order** : Ordre d'affichage

## Gestion des doublons

Les scripts vérifient automatiquement si des données existent déjà :

- ✅ **Si aucune donnée** : Import complet
- ⚠️ **Si données existantes** : Skip automatique pour éviter les doublons

Pour forcer un réimport :
1. Va dans Sanity Studio
2. Supprime manuellement les documents existants
3. Relance le script

## Troubleshooting

### Erreur : `SANITY_API_TOKEN not found`

**Solution** : Ajoute le token dans `.env.local` :
```bash
SANITY_API_TOKEN=skXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Erreur : `Insufficient permissions`

**Solution** : Ton token n'a pas les permissions d'écriture. Crée un nouveau token avec permissions "Editor" ou "Administrator".

### Erreur : `Project not found`

**Solution** : Vérifie que `NEXT_PUBLIC_SANITY_PROJECT_ID` et `NEXT_PUBLIC_SANITY_DATASET` sont bien configurés dans `.env.local`.

### Les données n'apparaissent pas dans Sanity Studio

**Solution** : 
1. Rafraîchis la page Sanity Studio (Ctrl+R / Cmd+R)
2. Vérifie que tu es sur le bon dataset (production vs development)
3. Vérifie les logs du script pour voir si l'import a réussi

## Ajouter d'autres pays

Pour ajouter d'autres pays d'origine, édite `scripts/import-origins.ts` et ajoute :

```typescript
{
  _type: 'origin',
  name: {
    fr: 'Brésil',
    en: 'Brazil',
    es: 'Brasil',
    de: 'Brasilien',
    ru: 'Бразилия',
  },
  code: 'BR',
  flag: '🇧🇷',
  description: {
    fr: 'Grand producteur de café arabica',
    en: 'Major arabica coffee producer',
    // ...
  },
  sortOrder: 15,
}
```

Puis relance : `npm run sanity:import-origins`

## Support

Si tu rencontres des problèmes :
1. Vérifie les logs du script
2. Vérifie ta configuration `.env.local`
3. Vérifie les permissions de ton token Sanity
4. Consulte la documentation Sanity : https://www.sanity.io/docs
