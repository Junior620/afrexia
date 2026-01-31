# Guide de Nommage des Images - Services Afrexia

## Convention de Nommage

Toutes les images doivent suivre cette convention :
```
[service-id].jpg
```

## Images Requises pour la Section Services (Page Solutions)

### 1. Logistique & Transport
**Nom du fichier** : `logistique.jpg`
**Contenu suggéré** : 
- Camions de transport
- Conteneurs d'export
- Route/logistique en action
- Gestion de flotte
**Dimensions recommandées** : 800x600px minimum
**Format** : JPG optimisé (qualité 80)

### 2. Entreposage & Stockage
**Nom du fichier** : `entreposage.jpg`
**Contenu suggéré** :
- Entrepôt avec sacs de produits
- Zone de stockage organisée
- Palettes de marchandises
- Système de gestion d'inventaire
**Dimensions recommandées** : 800x600px minimum
**Format** : JPG optimisé (qualité 80)

### 3. Transformation & Conditionnement
**Nom du fichier** : `transformation.jpg`
**Contenu suggéré** :
- Unité de transformation locale
- Machines de tri/séchage
- Conditionnement de produits
- Ligne de production
**Dimensions recommandées** : 800x600px minimum
**Format** : JPG optimisé (qualité 80)

### 4. Traçabilité & Conformité
**Nom du fichier** : `traceabilite.jpg`
**Contenu suggéré** :
- Tablette/smartphone avec app de traçabilité
- QR codes sur produits
- Carte GPS avec parcelles
- Documentation EUDR
**Dimensions recommandées** : 800x600px minimum
**Format** : JPG optimisé (qualité 80)

### 5. Assurance Qualité
**Nom du fichier** : `qualite.jpg`
**Contenu suggéré** :
- Contrôle qualité en laboratoire
- Inspection de produits
- Tests et analyses
- Certification qualité
**Dimensions recommandées** : 800x600px minimum
**Format** : JPG optimisé (qualité 80)

### 6. Conseil Commercial
**Nom du fichier** : `conseil.jpg`
**Contenu suggéré** :
- Réunion d'affaires
- Consultation commerciale
- Présentation de stratégie
- Négociation professionnelle
**Dimensions recommandées** : 800x600px minimum
**Format** : JPG optimisé (qualité 80)

## Images Requises pour la Section Services (Homepage)

### 1. Négoce & Import-Export
**Nom du fichier** : `negoce.jpg`
**Contenu suggéré** : 
- Poignée de main professionnelle
- Sacs de cacao/café en arrière-plan
- Scène de négociation commerciale
- Documents de contrat
**Dimensions recommandées** : 800x600px minimum
**Format** : JPG optimisé (qualité 80)

### 2. Logistique & Entrepôt
**Nom du fichier** : `logistique.jpg` (même que ci-dessus)

### 3. Transformation & Impact Local
**Nom du fichier** : `transformation.jpg` (même que ci-dessus)

### 4. Digitalisation & Traçabilité
**Nom du fichier** : `traceabilite.jpg` (même que ci-dessus)

## Emplacement des Fichiers

```
public/
└── assets/
    └── services/
        ├── negoce.jpg (homepage uniquement)
        ├── logistique.jpg (homepage + solutions)
        ├── entreposage.jpg (solutions uniquement)
        ├── transformation.jpg (homepage + solutions)
        ├── traceabilite.jpg (homepage + solutions)
        ├── qualite.jpg (solutions uniquement)
        └── conseil.jpg (solutions uniquement)
```

## Résumé des Fichiers Requis

**Total : 7 images uniques**

1. `negoce.jpg` - Négoce (homepage)
2. `logistique.jpg` - Logistique (homepage + solutions)
3. `entreposage.jpg` - Entreposage (solutions)
4. `transformation.jpg` - Transformation (homepage + solutions)
5. `traceabilite.jpg` - Traçabilité (homepage + solutions)
6. `qualite.jpg` - Assurance Qualité (solutions)
7. `conseil.jpg` - Conseil Commercial (solutions)

## Optimisation des Images

### Avant Upload
1. **Redimensionner** : 800x600px ou 1200x900px pour haute résolution
2. **Compresser** : Utiliser TinyPNG ou ImageOptim
3. **Format** : JPG pour photos, PNG pour logos/icônes
4. **Qualité** : 80% pour JPG (bon compromis taille/qualité)

### Outils Recommandés
- **TinyPNG** : https://tinypng.com/
- **Squoosh** : https://squoosh.app/
- **ImageOptim** (Mac) : https://imageoptim.com/

### Commande CLI (si ImageMagick installé)
```bash
# Redimensionner et optimiser
convert input.jpg -resize 800x600^ -gravity center -extent 800x600 -quality 80 logistique.jpg
```

## Checklist Avant Upload

- [ ] Nom de fichier correct (ex: `logistique.jpg`)
- [ ] Dimensions appropriées (800x600px minimum)
- [ ] Fichier optimisé (< 200KB idéalement)
- [ ] Qualité visuelle acceptable
- [ ] Contenu pertinent au service
- [ ] Pas de watermark/logo externe
- [ ] Droits d'utilisation vérifiés

## Images Alternatives (Fallback)

Si vous n'avez pas encore les images finales, vous pouvez utiliser :
- **Unsplash** : https://unsplash.com/
- **Pexels** : https://www.pexels.com/

### Mots-clés de Recherche
- Négoce : "business handshake", "coffee beans trade", "cocoa negotiation"
- Logistique : "truck transport", "logistics africa", "shipping"
- Entreposage : "warehouse storage", "inventory management"
- Transformation : "coffee roasting", "cocoa processing", "local workers"
- Traçabilité : "digital traceability", "QR code agriculture", "GPS farming"
- Qualité : "quality control", "laboratory testing", "inspection"
- Conseil : "business meeting", "commercial consulting", "strategy"

## Notes Importantes

1. **Cohérence visuelle** : Toutes les images doivent avoir un style similaire (couleurs, luminosité, composition)
2. **Orientation** : Privilégier le format paysage (landscape) 4:3 ou 16:9
3. **Qualité** : Images nettes, bien éclairées, professionnelles
4. **Contexte africain** : Privilégier des images montrant le contexte africain/camerounais si possible
5. **Personnes** : Si des personnes sont visibles, s'assurer d'avoir les droits d'image

## Mise à Jour

Pour mettre à jour une image :
1. Optimiser la nouvelle image
2. Renommer avec le bon nom (ex: `logistique.jpg`)
3. Remplacer le fichier dans `public/assets/services/`
4. Vider le cache du navigateur (Ctrl+Shift+R)
5. Vérifier l'affichage sur le site

---

**Dernière mise à jour** : 2026-01-31
**Contact** : Pour questions sur les images, contacter l'équipe design
