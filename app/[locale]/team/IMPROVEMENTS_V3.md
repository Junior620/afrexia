# Page Équipe - Améliorations V3

## Améliorations Implémentées

### ✅ 1. Phrase "preuve" sous le titre
- Ajouté: "Équipe terrain + export : sourcing, QA, conformité RDUE et logistique, de la ferme au port."
- Badges micro: "Basés à Douala", "Réseau producteurs/coops", "Documentation audit-ready"

### ✅ 2. Section "Notre Organisation"
- 3 départements avec icônes et descriptions:
  - Export & Négociation (TrendingUp icon)
  - Qualité & Conformité (Shield icon)
  - Logistique & Terrain (Package icon)

### ✅ 3. Cartes membres améliorées
- Photos avec aspect ratio cohérent (3:4 pour leadership, 1:1 pour team)
- Tooltips sur les icônes de contact (Email, Phone, WhatsApp, LinkedIn)
- Liens cliquables: mailto, tel, WhatsApp, LinkedIn
- Espace pour bio (2 lignes) dans les cartes leadership

### ✅ 4. CTA Business Focus
- "Parlons de votre besoin"
- Sous-titre: "Volumes, spécifications, destination, niveau de preuve documentaire"
- 2 boutons: "Demander un Devis" + "Télécharger notre Profil"
- Note recrutement: "Nous recrutons des agents terrain et partenaires logistiques"

## À Faire (Nécessite Sanity CMS)

### 📝 Ajouter dans Sanity pour chaque membre:
1. **Champ `bio`** (texte court, 2-3 lignes):
   - Expertise (ex: "Export Afrique centrale → Europe / MENA")
   - Spécialité (QA, compliance, négociation, logistique)
   - Langues (FR/EN)

2. **Champ `badges`** (array de strings):
   - Options: "QA", "Conformité RDUE", "Logistique", "Trading", "Documentation"
   - Afficher 2-3 badges par personne

3. **Champ `expertise`** (array):
   - Domaines d'expertise spécifiques

### 📝 Photos terrain (optionnel):
- Ajouter une section "Notre équipe sur le terrain"
- 2-3 photos d'inspection/entrepôt/terrain

## Prochaines Étapes

1. Mettre à jour le schéma Sanity `teamMember` avec les nouveaux champs
2. Ajouter les bios et badges pour chaque membre
3. Optionnel: Ajouter des photos terrain
4. Tester l'affichage sur mobile/desktop
