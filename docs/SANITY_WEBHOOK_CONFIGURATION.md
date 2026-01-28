# Configuration du Webhook Sanity pour la Revalidation Automatique

Ce guide explique comment configurer le webhook Sanity pour que les modifications de contenu soient automatiquement reflétées sur le site en production.

## Prérequis

- Accès au dashboard Sanity (https://www.sanity.io/manage)
- URL de production du site (ex: https://afrexia.com)
- Variable d'environnement `SANITY_WEBHOOK_SECRET` configurée

## Étape 1 : Générer un Secret pour le Webhook

1. Générez un secret aléatoire sécurisé :
```bash
openssl rand -base64 32
```

2. Ajoutez ce secret dans vos variables d'environnement :
   - **Vercel** : Settings → Environment Variables
   - Variable : `SANITY_WEBHOOK_SECRET`
   - Value : Le secret généré
   - Environnements : Production, Preview, Development

## Étape 2 : Configurer le Webhook dans Sanity

1. Allez sur https://www.sanity.io/manage
2. Sélectionnez votre projet Afrexia
3. Allez dans **API** → **Webhooks**
4. Cliquez sur **Create webhook**

### Configuration du Webhook

**Name:** `Production Revalidation`

**URL:** `https://votre-domaine.com/api/revalidate`
- Remplacez `votre-domaine.com` par votre URL de production
- Exemple : `https://afrexia.com/api/revalidate`

**Dataset:** `production`

**Trigger on:**
- ✅ Create
- ✅ Update
- ✅ Delete

**Filter (optionnel):**
```groq
_type in ["product", "blogPost", "certification", "resource", "teamMember", "page", "blogCategory"]
```

**Projection (optionnel):**
```groq
{
  _type,
  _id,
  "slug": slug.en.current,
  i18nId
}
```

**HTTP method:** `POST`

**HTTP Headers:**
Laissez vide (le header `sanity-webhook-signature` est ajouté automatiquement)

**Secret:** 
Collez le même secret que vous avez ajouté dans `SANITY_WEBHOOK_SECRET`

**API version:** `v2021-10-21` (ou la dernière version)

**Include drafts:** ❌ Non (seulement les documents publiés)

5. Cliquez sur **Save**

## Étape 3 : Tester le Webhook

### Test depuis Sanity Studio

1. Dans Sanity Studio, modifiez un produit ou un article de blog
2. Publiez les modifications
3. Vérifiez les logs du webhook dans Sanity :
   - API → Webhooks → Cliquez sur votre webhook
   - Onglet **Deliveries**
   - Vous devriez voir un statut `200 OK`

### Test manuel avec curl

```bash
curl -X POST https://votre-domaine.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "sanity-webhook-signature: sha256=$(echo -n '{"_type":"product","_id":"test"}' | openssl dgst -sha256 -hmac 'VOTRE_SECRET' | cut -d' ' -f2)" \
  -d '{"_type":"product","_id":"test","slug":{"current":"test-product"}}'
```

## Étape 4 : Vérifier la Revalidation

Après une modification de contenu :

1. **Vérification immédiate** :
   - Ouvrez la page modifiée en navigation privée
   - Vous devriez voir les nouvelles modifications

2. **Vérification des logs** :
   - Vercel : Functions → Logs
   - Recherchez `/api/revalidate`
   - Vérifiez les paths revalidés

## Types de Contenu Supportés

Le webhook revalide automatiquement les pages suivantes selon le type de contenu modifié :

| Type de Contenu | Pages Revalidées |
|-----------------|------------------|
| `product` | - Page produit : `/[locale]/products/[slug]`<br>- Liste produits : `/[locale]/products`<br>- Homepage : `/[locale]` |
| `blogPost` | - Article : `/[locale]/blog/[slug]`<br>- Liste blog : `/[locale]/blog`<br>- Homepage : `/[locale]` |
| `certification` | - Page qualité : `/[locale]/quality`<br>- Homepage : `/[locale]` |
| `resource` | - Page ressources : `/[locale]/resources`<br>- Homepage : `/[locale]` |
| `teamMember` | - Page à propos : `/[locale]/about`<br>- Homepage : `/[locale]` |
| `page` | - Page custom : `/[locale]/[slug]`<br>- Homepage : `/[locale]` |

**Note** : Toutes les pages sont revalidées pour les 5 langues supportées (fr, en, es, de, ru).

## Langues Supportées

Le webhook revalide automatiquement les pages dans toutes les langues :
- 🇫🇷 Français (fr)
- 🇬🇧 Anglais (en)
- 🇪🇸 Espagnol (es)
- 🇩🇪 Allemand (de)
- 🇷🇺 Russe (ru)

## Sécurité

### Vérification de Signature

L'API vérifie la signature HMAC-SHA256 de chaque requête :
- Header : `sanity-webhook-signature`
- Format : `sha256=<hash>`
- Secret : `SANITY_WEBHOOK_SECRET`

### Protection contre les Attaques

- ✅ Vérification de signature avec timing-safe comparison
- ✅ Validation du payload JSON
- ✅ Validation des champs requis (_type, _id)
- ✅ Logging avec Sentry pour monitoring

## Dépannage

### Le webhook retourne 401 Unauthorized

**Cause** : Signature invalide

**Solutions** :
1. Vérifiez que `SANITY_WEBHOOK_SECRET` est identique dans Sanity et Vercel
2. Vérifiez qu'il n'y a pas d'espaces avant/après le secret
3. Régénérez un nouveau secret et mettez à jour les deux côtés

### Le webhook retourne 400 Bad Request

**Cause** : Payload invalide

**Solutions** :
1. Vérifiez que le payload contient `_type` et `_id`
2. Vérifiez que le JSON est valide
3. Consultez les logs Vercel pour plus de détails

### Les modifications ne s'affichent pas

**Causes possibles** :
1. Cache du navigateur → Testez en navigation privée
2. CDN cache → Attendez quelques secondes
3. Webhook non déclenché → Vérifiez les deliveries dans Sanity

**Solutions** :
1. Videz le cache du navigateur (Ctrl+Shift+R)
2. Vérifiez les logs du webhook dans Sanity
3. Vérifiez les logs de l'API dans Vercel
4. Testez manuellement avec curl

### Le webhook est lent

**Optimisations** :
- Le webhook revalide uniquement les pages nécessaires
- La revalidation est asynchrone (ne bloque pas Sanity)
- Les pages sont revalidées en arrière-plan

## Monitoring

### Logs Sanity

1. Allez dans API → Webhooks
2. Cliquez sur votre webhook
3. Onglet **Deliveries** pour voir l'historique

### Logs Vercel

1. Allez dans votre projet Vercel
2. Functions → Logs
3. Filtrez par `/api/revalidate`

### Alertes Sentry

Les erreurs sont automatiquement envoyées à Sentry :
- Erreurs de signature
- Erreurs de revalidation
- Erreurs de parsing JSON

## Webhooks Multiples (Optionnel)

Vous pouvez créer plusieurs webhooks pour différents environnements :

### Preview/Staging
- **Name:** `Preview Revalidation`
- **URL:** `https://preview.afrexia.com/api/revalidate`
- **Dataset:** `production`
- **Include drafts:** ✅ Oui

### Development
- **Name:** `Development Revalidation`
- **URL:** `https://dev.afrexia.com/api/revalidate`
- **Dataset:** `development`
- **Include drafts:** ✅ Oui

## Ressources

- [Documentation Sanity Webhooks](https://www.sanity.io/docs/webhooks)
- [Next.js On-Demand Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Support

En cas de problème :
1. Consultez les logs Sanity et Vercel
2. Vérifiez la configuration du secret
3. Testez avec curl pour isoler le problème
4. Consultez les alertes Sentry
