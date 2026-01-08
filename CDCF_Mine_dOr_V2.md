# CAHIER DES CHARGES TECHNIQUE ET FONCTIONNEL
## Mine d'Or V2 - Dashboard de Gestion Minière
### Version 2.0.0 | Document Définitif

---

**Client :** Mine d'Or Congo - Site Kolwezi  
**Destinataire :** Équipe Antigravity (Développement Frontend)  
**Date :** Janvier 2026  
**Statut :** DOCUMENT DE RÉFÉRENCE - IMPÉRATIF  

---

## TABLE DES MATIÈRES

1. [Architecture Visuelle & Design System](#1-architecture-visuelle--design-system)
2. [Structure de l'Application](#2-structure-de-lapplication)
3. [Spécifications Détaillées par Vue](#3-spécifications-détaillées-par-vue)
4. [Composants UI & Interactivité](#4-composants-ui--interactivité)
5. [Modèle de Données](#5-modèle-de-données)
6. [Annexes Techniques](#6-annexes-techniques)

---

# 1. ARCHITECTURE VISUELLE & DESIGN SYSTEM

## 1.1 PRINCIPES FONDAMENTAUX (NON-NÉGOCIABLES)

### 1.1.1 Philosophie de Design

L'application DOIT reproduire fidèlement l'esthétique **Premium iOS / Apple** caractérisée par :

| Principe | Application |
|----------|-------------|
| **Bento Grid** | Disposition en grille modulaire avec cartes de tailles variables |
| **Glassmorphism léger** | Backgrounds semi-transparents avec blur subtil sur overlays |
| **Ombres douces** | Shadow spread minimal, blur élevé |
| **Coins arrondis** | Radius généreux (16-24px) |
| **Typographie SF Pro** | Police système Apple comme référence |
| **Densité contrôlée** | Espacement généreux, respiration visuelle |

### 1.1.2 Interdictions Formelles

Les éléments suivants sont **STRICTEMENT INTERDITS** :

- **EMOJIS** : Aucun emoji natif (🔥, ⚠️, 📊, etc.)
- **Icônes colorées intégrées** : Pas de FontAwesome coloré, pas d'emojis déguisés
- **Gradients agressifs** : Pas de dégradés saturés multi-couleurs
- **Ombres dures** : Pas de box-shadow avec spread > 2px
- **Bordures épaisses** : Pas de border-width > 1px (sauf cas spécifique documenté)
- **Animations excessives** : Pas d'animations de durée > 400ms

---

## 1.2 GRID SYSTEM (GRILLE PRINCIPALE)

### 1.2.1 Structure Desktop (≥1280px)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SIDEBAR (240px fixe)  │            MAIN CONTENT (flex-1)              │
│                        │                                                │
│  - Logo               │  ┌──────────────────────────────────────────┐ │
│  - Site Selector      │  │             12-COLUMN GRID               │ │
│  - Navigation         │  │  gap: 16px | padding: 24px               │ │
│  - User Profile       │  │                                          │ │
│                        │  │  Column width: (100% - 11*16px) / 12    │ │
│                        │  └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2.2 Breakpoints Responsives

| Breakpoint | Largeur | Colonnes | Sidebar | Gap |
|------------|---------|----------|---------|-----|
| **Desktop XL** | ≥1536px | 12 | 240px visible | 20px |
| **Desktop** | ≥1280px | 12 | 240px visible | 16px |
| **Tablet** | ≥768px | 8 | Drawer (overlay) | 16px |
| **Mobile** | ≥375px | 4 | Drawer (overlay) | 12px |
| **Mobile S** | <375px | 4 | Drawer (overlay) | 8px |

### 1.2.3 Hauteur des Lignes Dashboard

Le dashboard principal est structuré en **4 lignes horizontales** de hauteur définie :

| Ligne | Contenu | Hauteur Min | Hauteur Max |
|-------|---------|-------------|-------------|
| **Ligne 1** | KPI Cards (4 cartes) | 100px | 120px |
| **Ligne 2** | Charts principaux + Analytics | 320px | 400px |
| **Ligne 3** | Opérations (Machines, Galerie, Alertes) | 280px | 360px |
| **Ligne 4** | Synthèse (Calendrier + Prévisions) | 300px | auto |

---

## 1.3 DESIGN TOKENS

### 1.3.1 Palette de Couleurs

#### Couleurs de Base

| Token | Valeur HEX | Usage |
|-------|-----------|-------|
| `--background-primary` | `#F8F9FA` | Fond principal de l'application |
| `--background-secondary` | `#FFFFFF` | Fond des cartes et composants |
| `--background-tertiary` | `#F1F3F5` | Fond des éléments secondaires |

#### Couleurs de Texte

| Token | Valeur HEX | Usage |
|-------|-----------|-------|
| `--text-primary` | `#1A1A1A` | Titres, valeurs importantes |
| `--text-secondary` | `#6B7280` | Labels, descriptions |
| `--text-tertiary` | `#9CA3AF` | Métadonnées, hints |

#### Couleurs d'Accent

| Token | Valeur HEX | RGB | Usage |
|-------|-----------|-----|-------|
| `--accent-blue` | `#3B82F6` | rgb(59, 130, 246) | Actions primaires, liens |
| `--accent-gold` | `#F59E0B` | rgb(245, 158, 11) | Éléments or/production |
| `--accent-green` | `#10B981` | rgb(16, 185, 129) | Succès, positif |
| `--accent-red` | `#EF4444` | rgb(239, 68, 68) | Erreurs, alertes critiques |
| `--accent-orange` | `#F97316` | rgb(249, 115, 22) | Avertissements |
| `--accent-purple` | `#8B5CF6` | rgb(139, 92, 246) | Éléments spéciaux |

#### Couleurs des KPI Icons (Backgrounds dégradés)

| KPI | Dégradé | CSS |
|-----|---------|-----|
| Production (Mois) | Jaune/Or | `linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)` |
| Production (Semaine) | Rose/Corail | `linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)` |
| Heures Travaillées | Bleu clair | `linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)` |
| Incidents | Rouge clair | `linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)` |

### 1.3.2 Ombres (Box Shadows)

| Token | Valeur CSS | Usage |
|-------|-----------|-------|
| `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Hover léger |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)` | Cartes au repos |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)` | Cartes hover, dropdowns |
| `--shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05)` | Modals |

### 1.3.3 Border Radius

| Token | Valeur | Usage |
|-------|--------|-------|
| `--radius-sm` | `8px` | Boutons secondaires, badges |
| `--radius-md` | `12px` | Inputs, petits composants |
| `--radius-lg` | `16px` | Cartes standards |
| `--radius-xl` | `20px` | Cartes principales, modals |
| `--radius-2xl` | `24px` | Grands conteneurs |
| `--radius-full` | `9999px` | Avatars, pills |

### 1.3.4 Typographie

#### Police Principale

```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 
             'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

#### Échelle Typographique

| Token | Taille | Poids | Line Height | Usage |
|-------|--------|-------|-------------|-------|
| `--text-xs` | 11px | 400 | 1.4 | Badges, métadonnées |
| `--text-sm` | 13px | 400 | 1.5 | Labels secondaires |
| `--text-base` | 14px | 400 | 1.5 | Texte courant |
| `--text-md` | 15px | 500 | 1.4 | Labels principaux |
| `--text-lg` | 17px | 600 | 1.3 | Sous-titres |
| `--text-xl` | 20px | 600 | 1.2 | Titres de section |
| `--text-2xl` | 24px | 700 | 1.2 | Titres de page |
| `--text-3xl` | 32px | 700 | 1.1 | Valeurs KPI |
| `--text-4xl` | 48px | 700 | 1.0 | Valeurs héroïques |

### 1.3.5 Espacements

Utiliser exclusivement un **système de grille à 4px** :

| Token | Valeur | Usage courant |
|-------|--------|---------------|
| `--space-1` | 4px | Micro-espacement |
| `--space-2` | 8px | Espacement interne serré |
| `--space-3` | 12px | Espacement interne standard |
| `--space-4` | 16px | Gap grille, padding cartes |
| `--space-5` | 20px | Séparation sections |
| `--space-6` | 24px | Padding conteneurs |
| `--space-8` | 32px | Grandes séparations |
| `--space-10` | 40px | Marges principales |

---

## 1.4 ICONOGRAPHIE - LUCIDE REACT

### 1.4.1 Configuration Obligatoire

**Librairie unique autorisée :** `lucide-react`

```jsx
// Installation
npm install lucide-react

// Import et utilisation STANDARD
import { Activity, AlertTriangle, Calendar } from 'lucide-react';

<Activity 
  size={20}           // Taille en px
  strokeWidth={1.5}   // OBLIGATOIRE: 1.5
  className="text-slate-600"  // Couleur via Tailwind
/>
```

### 1.4.2 Règles de Style Icônes

| Propriété | Valeur Obligatoire | Alternative |
|-----------|-------------------|-------------|
| `strokeWidth` | `1.5` | Jamais autre valeur |
| `size` | `20` (défaut) | `16` (compact), `24` (emphasis) |
| Couleur | Monochrome via `className` | Jamais de fill coloré |

### 1.4.3 Mapping des Icônes par Fonction

| Fonction | Icône Lucide | Nom |
|----------|-------------|-----|
| Dashboard | `LayoutDashboard` | Tableau de bord |
| Pointage | `Clock` | Horloge |
| Production | `Gem` | Diamant/Gemme |
| Personnel | `Users` | Utilisateurs |
| Inventaire | `Package` | Colis |
| Analytiques | `BarChart3` | Graphique barres |
| Rapports | `FileText` | Document texte |
| Achats | `CreditCard` | Carte crédit |
| Dépenses | `Receipt` | Reçu |
| Paramètres | `Settings` | Engrenage |
| Mon Compte | `User` | Utilisateur |
| Localisation | `MapPin` | Épingle carte |
| Alerte | `AlertTriangle` | Triangle alerte |
| Succès | `CheckCircle` | Cercle check |
| Production Or | `Coins` | Pièces |
| Maintenance | `Wrench` | Clé |
| Transport | `Truck` | Camion |
| Énergie/Carburant | `Fuel` | Pompe |
| Chevron | `ChevronDown` | Flèche bas |
| Menu | `Menu` | Hamburger |
| Fermer | `X` | Croix |
| Plus | `Plus` | Plus |
| Recherche | `Search` | Loupe |
| Calendrier | `Calendar` | Calendrier |
| Télécharger | `Download` | Téléchargement |
| Rafraîchir | `RefreshCw` | Rotation |

---

# 2. STRUCTURE DE L'APPLICATION

## 2.1 ARCHITECTURE TECHNIQUE

### 2.1.1 Stack Technologique Requis

| Couche | Technologie | Version Min | Notes |
|--------|-------------|-------------|-------|
| **Framework** | React | 18.2+ | Avec Hooks |
| **Routing** | React Router | 6.x | SPA routing |
| **Styling** | Tailwind CSS | 3.4+ | JIT mode |
| **Icônes** | lucide-react | 0.300+ | Unique source |
| **Charts** | Recharts | 2.10+ | Obligatoire |
| **State** | React Context | Native | Pour état global |
| **Animations** | Framer Motion | 10.x | Optionnel mais recommandé |
| **Dates** | date-fns | 3.x | Pour formatage |

### 2.1.2 Structure des Dossiers

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── MobileDrawer.tsx
│   │   └── MainLayout.tsx
│   ├── ui/
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   ├── Input.tsx
│   │   ├── Avatar.tsx
│   │   └── ProgressBar.tsx
│   ├── charts/
│   │   ├── AreaChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── PieChart.tsx
│   │   ├── Heatmap.tsx
│   │   └── ChartWrapper.tsx
│   ├── kpi/
│   │   ├── KpiCard.tsx
│   │   └── KpiGrid.tsx
│   ├── alerts/
│   │   ├── AlertList.tsx
│   │   └── AlertItem.tsx
│   ├── gallery/
│   │   ├── GalleryGrid.tsx
│   │   └── Lightbox.tsx
│   └── forecast/
│       ├── ForecastCard.tsx
│       └── ForecastGrid.tsx
├── views/
│   ├── Dashboard.tsx
│   ├── Pointage.tsx
│   ├── Production.tsx
│   ├── Personnel.tsx
│   ├── Inventaire.tsx
│   ├── Analytiques.tsx
│   ├── Rapports.tsx
│   ├── Achats.tsx
│   ├── Depenses.tsx
│   └── Parametres.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useSite.ts
│   └── useModal.ts
├── context/
│   ├── AuthContext.tsx
│   └── SiteContext.tsx
├── data/
│   └── mockData.ts
├── types/
│   └── index.ts
├── utils/
│   ├── formatters.ts
│   └── helpers.ts
└── App.tsx
```

---

## 2.2 ROUTING & NAVIGATION

### 2.2.1 Configuration des Routes

```typescript
// Routes principales
const routes = [
  { path: '/', element: <Dashboard />, label: 'Tableau de bord', icon: LayoutDashboard },
  { path: '/pointage', element: <Pointage />, label: 'Pointage', icon: Clock },
  { path: '/production', element: <Production />, label: 'Production', icon: Gem },
  { path: '/personnel', element: <Personnel />, label: 'Personnel', icon: Users },
  { path: '/inventaire', element: <Inventaire />, label: 'Inventaire', icon: Package },
  { path: '/analytiques', element: <Analytiques />, label: 'Analytiques', icon: BarChart3 },
  { path: '/rapports', element: <Rapports />, label: 'Rapports', icon: FileText },
  { path: '/achats', element: <Achats />, label: 'Achats', icon: CreditCard },
  { path: '/depenses', element: <Depenses />, label: 'Dépenses', icon: Receipt },
  { path: '/parametres', element: <Parametres />, label: 'Paramètres', icon: Settings },
];
```

### 2.2.2 Structure de Navigation (Sidebar)

La sidebar est organisée en **sections thématiques** :

| Section | Items | Icône associée |
|---------|-------|---------------|
| **Principal** | Tableau de bord | `LayoutDashboard` |
| **Opérationnel** | Pointage, Production, Personnel | `Clock`, `Gem`, `Users` |
| **Gestion** | Inventaire, Analytiques, Rapports | `Package`, `BarChart3`, `FileText` |
| **Finances** | Achats, Dépenses | `CreditCard`, `Receipt` |
| **Administration** | Paramètres, Mon Compte | `Settings`, `User` |

---

## 2.3 TEMPLATE DE VUE SECONDAIRE

Chaque vue secondaire (hors Dashboard) DOIT suivre ce template :

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Titre Vue              [Bouton Action] [Bouton Secondaire] ││
│  │ Sous-titre / Date                                          ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  KPI STRIP (optionnel - 3-4 mini-cards)                        │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                   │
│  │ KPI 1  │ │ KPI 2  │ │ KPI 3  │ │ KPI 4  │                   │
│  └────────┘ └────────┘ └────────┘ └────────┘                   │
├─────────────────────────────────────────────────────────────────┤
│  CONTENU PRINCIPAL                                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  [Chart / Table / List / Form]                              ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  FOOTER ACTIONS (optionnel)                                    │
│  [Bouton Flottant "+"]                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

# 3. SPÉCIFICATIONS DÉTAILLÉES PAR VUE

## 3.A DASHBOARD (VUE PRINCIPALE - "BENTO BOX")

### 3.A.1 Structure Générale

Le Dashboard est organisé en **4 zones horizontales principales** + **2 colonnes latérales droites** :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ LIGNE 1 : KPI CARDS (4 cartes égales)                                       │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│ │ Production  │ │ Production  │ │   Heures    │ │  Incidents  │            │
│ │   (Mois)    │ │  (Semaine)  │ │ Travaillées │ │   (Mois)    │            │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘            │
├────────────────────────────────────────────────────┬────────────────────────┤
│ LIGNE 2 : ANALYSES                                 │ COLONNE DROITE A      │
│ ┌────────────────────────────────────────────────┐ │ ┌──────────────────┐  │
│ │ Production Totale Mensuelle (AreaChart)        │ │ │ Tendances        │  │
│ └────────────────────────────────────────────────┘ │ │ Dépenses         │  │
│ ┌────────────────────────┐ ┌────────────────────┐ │ │ (AreaChart mini) │  │
│ │ Taux Remplissage       │ │ Pureté Moyenne Or  │ │ └──────────────────┘  │
│ │ (ProgressBar)          │ │ (Valeur circulaire)│ │ ┌──────────────────┐  │
│ └────────────────────────┘ └────────────────────┘ │ │ Dépenses Opérat. │  │
│                                                    │ │ (DonutChart)     │  │
│                                                    │ └──────────────────┘  │
├────────────────────────────────────────────────────┼────────────────────────┤
│ LIGNE 3 : OPÉRATIONS                               │ COLONNE DROITE B      │
│ ┌────────────────────────────────────────────────┐ │ ┌──────────────────┐  │
│ │ Production par Équipe (BarChart)               │ │ │ Flux Activités   │  │
│ └────────────────────────────────────────────────┘ │ │ Récentes         │  │
│ ┌──────────────────┐ ┌───────────────────────────┐ │ │ (Timeline)       │  │
│ │ Performance      │ │ Alertes Récentes          │ │ │                  │  │
│ │ Machine          │ │ (List)                    │ │ │                  │  │
│ │ (BarChart H)     │ └───────────────────────────┘ │ │                  │  │
│ └──────────────────┘ ┌───────────────────────────┐ │ │                  │  │
│                      │ Galerie Chantier (2x3)    │ │ │                  │  │
│                      └───────────────────────────┘ │ └──────────────────┘  │
├────────────────────────────────────────────────────┴────────────────────────┤
│ LIGNE 4 : SYNTHÈSE                                                          │
│ ┌────────────────────────────────┐ ┌────────────────────────────────────┐  │
│ │ Calendrier Production          │ │ Prévisions vs Réalité              │  │
│ │ (Heatmap - Janvier 2026)       │ │ (4 cartes comparatives)            │  │
│ └────────────────────────────────┘ └────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.A.2 Composant : KPI Card

**Position :** Ligne 1
**Quantité :** 4 cartes
**Layout :** Grid 4 colonnes égales

#### Structure d'une KPI Card

```
┌────────────────────────────────────┐
│ [Label]                [Badge +%] │  <- Header
│                                    │
│        [ICON]                      │  <- Icône avec fond dégradé
│                                    │
│       [VALEUR]                     │  <- Valeur principale (grand)
│       [Sous-label]                 │  <- Contexte temporel
└────────────────────────────────────┘
```

#### Spécifications Techniques

| Propriété | Valeur |
|-----------|--------|
| Largeur | `25% - gap` (flex: 1 1 0) |
| Hauteur min | `100px` |
| Padding | `16px` |
| Background | `#FFFFFF` |
| Border-radius | `20px` |
| Shadow | `--shadow-md` |
| Shadow hover | `--shadow-lg` |
| Transition | `all 200ms ease-out` |

#### Données des 4 KPI

| # | Label | Valeur | Badge | Icône | Fond Icône |
|---|-------|--------|-------|-------|-----------|
| 1 | Production Totale (Mois) | `222 g` | `▲ 69%` (vert) | `Coins` | Jaune/Or |
| 2 | Production Semaine | `1.94 kg` | `▲ 10.9%` (vert) | `Calendar` | Rose |
| 3 | Heures Travaillées Totales | `144h` | `▲ 19.9%` (vert) | `Clock` | Bleu |
| 4 | Incidents (Mois) | `6` | - | `AlertTriangle` | Rouge |

### 3.A.3 Composant : Production Totale Mensuelle (AreaChart)

**Position :** Ligne 2, Grande carte principale
**Type :** AreaChart avec Recharts

#### Spécifications

| Propriété | Valeur |
|-----------|--------|
| Largeur | `span 8 colonnes` (Desktop) |
| Hauteur | `320px` |
| Type graphique | `AreaChart` (courbe remplie avec gradient) |
| Période tabs | `[Hier] [Semaine] [Mois]` |
| Axe X | Mois (Jan - Déc) |
| Axe Y | Production en grammes (0 - 3500) |

#### Configuration Recharts

```jsx
<AreaChart data={monthlyProduction}>
  <defs>
    <linearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
    </linearGradient>
  </defs>
  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
  <YAxis stroke="#9CA3AF" fontSize={12} />
  <Tooltip />
  <Area 
    type="monotone" 
    dataKey="value" 
    stroke="#3B82F6" 
    strokeWidth={2}
    fill="url(#productionGradient)" 
  />
</AreaChart>
```

### 3.A.4 Composant : Taux de Remplissage Objectif

**Position :** Ligne 2, sous le graphique principal
**Type :** ProgressBar avec label

#### Structure

```
┌────────────────────────────────────────┐
│ Taux de remplissage de l'objectif      │
│ mensuel                                │
│                                        │
│ [████████░░░░░░░░░░░░░░░] 37%         │
│                                        │
│ De l'objectif mensuel atteint          │
└────────────────────────────────────────┘
```

#### Spécifications ProgressBar

| Propriété | Valeur |
|-----------|--------|
| Hauteur barre | `8px` |
| Border-radius | `4px` (full) |
| Background track | `#E5E7EB` |
| Fill color | `linear-gradient(90deg, #3B82F6, #60A5FA)` |
| Animation | `width 600ms ease-out` |

### 3.A.5 Composant : Pureté Moyenne de l'Or

**Position :** Ligne 2, à côté du taux de remplissage
**Type :** Valeur circulaire avec état

#### Structure

```
┌────────────────────────────────┐
│ Pureté Moyenne de l'Or (Mois)  │
│                                │
│      [Icon 3D Gold]            │
│         92%                    │
│      Excellente                │
└────────────────────────────────┘
```

| Propriété | Valeur |
|-----------|--------|
| Valeur | `92%` (font-size: 48px, font-weight: 700) |
| État | `Excellente` (couleur: `#10B981`) |
| Icône | Asset 3D ou illustration stylisée |

### 3.A.6 Composant : Production par Équipe (BarChart)

**Position :** Ligne 3
**Type :** Grouped BarChart

#### Spécifications

| Propriété | Valeur |
|-----------|--------|
| Type | `BarChart` groupé (2 séries) |
| Période tabs | `[Hier] [Semaine] [Mois]` |
| Axe X | Mois (Jan - Déc) |
| Séries | `Équipe A` (bleu), `Équipe B` (orange) |
| Bar width | `12px` |
| Bar radius | `4px` (top) |
| Gap entre barres | `4px` |

#### Couleurs Séries

| Série | Couleur |
|-------|---------|
| Équipe A | `#3B82F6` |
| Équipe B | `#F97316` |

### 3.A.7 Composant : Performance par Machine

**Position :** Ligne 3, compact
**Type :** Horizontal BarChart simple

#### Structure

```
┌──────────────────────────────┐
│ Performance par Machine      │
│                              │
│  Machine A   ████████ 80h   │
│  Machine B   ██████░░ 64h   │
└──────────────────────────────┘
```

### 3.A.8 Composant : Alertes Récentes

**Position :** Ligne 3, liste compacte
**Type :** Liste avec icônes colorées

#### Structure par Alerte

```
┌──────────────────────────────────────────┐
│ Alertes Récentes                         │
├──────────────────────────────────────────┤
│ [🔶] Carburant & Énergie                 │
│      Stock critique (1200L)...           │
├──────────────────────────────────────────┤
│ [🔧] Équipement & Maintenance            │
│      Révision foreuse À planifier...     │
├──────────────────────────────────────────┤
│ [🚚] Transport & Logistique              │
│      Livraison équipement confirmée...   │
└──────────────────────────────────────────┘
```

#### Configuration Alertes

| Type | Icône | Couleur fond |
|------|-------|--------------|
| Carburant | `Fuel` | `#FEF3C7` |
| Maintenance | `Wrench` | `#DBEAFE` |
| Transport | `Truck` | `#D1FAE5` |

### 3.A.9 Composant : Galerie de Chantier

**Position :** Ligne 3
**Type :** Grid d'images 2x3

#### Spécifications

| Propriété | Valeur |
|-----------|--------|
| Layout | Grid 3 colonnes x 2 lignes |
| Gap | `8px` |
| Image aspect-ratio | `1:1` (carré) |
| Image border-radius | `12px` |
| Image object-fit | `cover` |
| Hover | `scale(1.05)`, `shadow-lg` |

### 3.A.10 Composant : Calendrier Production (Heatmap)

**Position :** Ligne 4, gauche
**Type :** Heatmap calendrier mensuel

#### Structure

```
┌─────────────────────────────────────────┐
│ Calendrier Production    Janvier 2026   │
├─────────────────────────────────────────┤
│   L   M   M   J   V   S   D            │
│  [1] [2] [3] [4]  5   6   7            │
│   8   9  10  11  12  13  14            │
│  15  16  17 [18] 19  20  21            │
│  22  23  24  25  26  27  28            │
│  29  30  31                            │
├─────────────────────────────────────────┤
│ [●Faible] [●Moyen] [●Bon] [●Élevé]     │
└─────────────────────────────────────────┘
```

#### Échelle de Couleurs

| Niveau | Couleur | Condition |
|--------|---------|-----------|
| Faible | `#F5F5F7` | < 100g |
| Moyen | `#FED7AA` | 100-200g |
| Bon | `#86EFAC` | 200-300g |
| Élevé | `#22C55E` | > 300g |

### 3.A.11 Composant : Prévisions vs Réalité

**Position :** Ligne 4, droite
**Type :** Grid 2x2 de cartes comparatives

#### Les 4 Cartes

| # | Métrique | Prévu | Réalisé | Écart | Couleur écart |
|---|----------|-------|---------|-------|---------------|
| 1 | Production (kg) | 2.50 kg | 1.62 kg | -35.2% | Rouge |
| 2 | Charges Totales ($) | $4,000 | $4,400 | +10% | Rouge |
| 3 | Marge Brute ($) | $8,500 | $5,200 | -38.8% | Rouge |
| 4 | Coût/kg ($) | $1,600 | $2,716 | +69.8% | Rouge |

#### Structure Carte Prévision

```
┌─────────────────────────────────┐
│ PRODUCTION (KG)                 │
├─────────────────────────────────┤
│ Prévu                    2.50kg │
│ [████████████░░░░] 65%  1.62 kg │
│ Écart: -35.2% ↓                 │
└─────────────────────────────────┘
```

### 3.A.12 Composant : Tendances des Dépenses (Colonne Droite)

**Position :** Colonne droite, haut
**Type :** Mini AreaChart

#### Spécifications

| Propriété | Valeur |
|-----------|--------|
| Hauteur | `160px` |
| Période tabs | `[Hier] [Semaine] [Mois]` |
| Stroke color | `#8B5CF6` |
| Fill | Gradient violet léger |

### 3.A.13 Composant : Dépenses Opérationnelles (DonutChart)

**Position :** Colonne droite
**Type :** DonutChart avec légende

#### Catégories

| Catégorie | Montant | Couleur |
|-----------|---------|---------|
| Carburant & Énergie | $450 | `#3B82F6` |
| Équipement & Maintenance | $220 | `#8B5CF6` |
| Matériaux & Fournitures | $180 | `#10B981` |
| Transport & Logistique | $150 | `#F97316` |
| Autres Frais | $100 | `#6B7280` |
| **Total** | **$1,200** | - |

### 3.A.14 Composant : Flux d'Activités Récentes (Timeline)

**Position :** Colonne droite, bas
**Type :** Timeline verticale

#### Structure

```
┌──────────────────────────────────────┐
│ Flux d'Activités Récentes            │
├──────────────────────────────────────┤
│ ● Production : 2028                  │
│   Extraction de 23g complétée        │
│                                      │
│ ● Pointage n: 2025                   │
│   3 heures de travail enregistrées   │
│                                      │
│ ● Maintenance 1290                   │
│   Maintenance complète des équip...  │
│                                      │
│ ● Objectifs 2389                     │
│   Objectif mensuel de janvier att... │
│                                      │
│ ● Maintenance 2038                   │
│   Rappel : maintenance de l'extr...  │
└──────────────────────────────────────┘
```

---

## 3.B ÉCRAN POINTAGE

### 3.B.1 Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
│ Pointage                        [Exporter] [+ Ajouter]     │
│ Mercredi 7 janvier 2026                                     │
├─────────────────────────────────────────────────────────────┤
│ HORLOGE CENTRALE                                            │
│ ┌─────────────────────────────────────────────────────────┐│
│ │                                                         ││
│ │                    14:32:45                            ││
│ │              Mercredi 7 janvier 2026                   ││
│ │                                                         ││
│ └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│ KPI STRIP                                                   │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │Présents  │ │En retard │ │Absents   │ │Total     │        │
│ │    3     │ │    0     │ │    0     │ │    3     │        │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
├─────────────────────────────────────────────────────────────┤
│ ACTIONS POINTAGE                                            │
│ ┌───────────────────────┐ ┌───────────────────────┐        │
│ │   POINTER ARRIVÉE     │ │   POINTER DÉPART      │        │
│ │        [Icon]         │ │        [Icon]         │        │
│ └───────────────────────┘ └───────────────────────┘        │
├─────────────────────────────────────────────────────────────┤
│ LISTE PRÉSENCES DU JOUR                                     │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Avatar] Jean Kabongo      Arrivée: 06:30  [● Présent] ││
│ │          Chef d'équipe     Départ: En cours            ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ [Avatar] Marie Mutombo     Arrivée: 06:45  [● Présent] ││
│ │          Opératrice        Départ: En cours            ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ [Avatar] Pierre Kasongo    Arrivée: 07:00  [● Présent] ││
│ │          Technicien        Départ: En cours            ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 3.B.2 Composant : Horloge Centrale

| Propriété | Valeur |
|-----------|--------|
| Font-size heure | `72px` |
| Font-weight | `700` |
| Font-family | `SF Pro Display, monospace` |
| Mise à jour | Chaque seconde (live) |
| Format | `HH:mm:ss` |

### 3.B.3 Boutons d'Action

| Propriété | Pointer Arrivée | Pointer Départ |
|-----------|-----------------|----------------|
| Background | `#10B981` | `#EF4444` |
| Hover | `#059669` | `#DC2626` |
| Hauteur | `80px` |
| Border-radius | `16px` |
| Icône | `LogIn` | `LogOut` |
| Min tap target | `44px` |

---

## 3.C ÉCRAN PRODUCTION

### 3.C.1 Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
│ Production - Suivi                    [Exporter] [Filtrer] │
│ Total mois: 1.62 kg                                         │
├─────────────────────────────────────────────────────────────┤
│ KPI STRIP                                                   │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │Aujourd'hui│ │Semaine   │ │Ce mois   │ │Moyenne/j │        │
│ │   222g    │ │  1.94kg  │ │  1.62kg  │ │   135g   │        │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
├─────────────────────────────────────────────────────────────┤
│ GRAPHIQUE PRODUCTION                                        │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Jour] [Semaine] [Mois]                                 ││
│ │                                                         ││
│ │            [AreaChart - Courbe production]              ││
│ │                                                         ││
│ └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│ TABLEAU DES ENTRÉES                                         │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Date        │ Quantité │ Équipe │ Quart  │ Statut      ││
│ ├─────────────┼──────────┼────────┼────────┼─────────────┤│
│ │ 7 Jan 2026  │ 222g     │ A      │ Matin  │ ✓ Validé   ││
│ │ 6 Jan 2026  │ 185g     │ B      │ Jour   │ ✓ Validé   ││
│ │ 5 Jan 2026  │ 165g     │ A      │ Soir   │ ✓ Validé   ││
│ └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│ [+ Nouvelle entrée]  <- Bouton flottant FAB                │
└─────────────────────────────────────────────────────────────┘
```

### 3.C.2 Modal : Nouvelle Entrée Production

```
┌─────────────────────────────────────────┐
│ Nouvelle entrée production          [X] │
├─────────────────────────────────────────┤
│                                         │
│ Date                                    │
│ [Sélecteur date]                        │
│                                         │
│ Équipe                                  │
│ [Dropdown: Équipe A / Équipe B]         │
│                                         │
│ Quart de travail                        │
│ [Dropdown: Matin / Jour / Soir]         │
│                                         │
│ Quantité (grammes)                      │
│ [Input numérique]                       │
│                                         │
│ Pureté (%)                              │
│ [Input numérique: 0-100]                │
│                                         │
│ Notes                                   │
│ [Textarea]                              │
│                                         │
├─────────────────────────────────────────┤
│        [Annuler]    [Enregistrer]       │
└─────────────────────────────────────────┘
```

---

## 3.D ÉCRAN PERSONNEL

### 3.D.1 Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
│ Personnel                              [Rechercher] [+ Add] │
│ Gestion des équipes                                         │
├─────────────────────────────────────────────────────────────┤
│ FILTRES                                                     │
│ [Tous] [Équipe A] [Équipe B] [Actifs] [Congé]              │
├─────────────────────────────────────────────────────────────┤
│ STATISTIQUES                                                │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │ Total    │ │ Actifs   │ │ En congé │ │ Absents  │        │
│ │    3     │ │    3     │ │    0     │ │    0     │        │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
├─────────────────────────────────────────────────────────────┤
│ LISTE PERSONNEL                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ [Avatar] Jean Kabongo                              │ ││
│ │ │ Chef d'équipe · Équipe A            [● Actif]     │ ││
│ │ │ +243 812 345 678                                   │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ [Avatar] Marie Mutombo                             │ ││
│ │ │ Opératrice · Équipe A               [● Actif]     │ ││
│ │ │ +243 812 456 789                                   │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ [Avatar] Pierre Kasongo                            │ ││
│ │ │ Technicien · Équipe B               [● Actif]     │ ││
│ │ │ +243 812 567 890                                   │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 3.D.2 Badges de Statut

| Statut | Couleur fond | Couleur texte | Dot |
|--------|--------------|---------------|-----|
| Actif | `#D1FAE5` | `#065F46` | `#10B981` |
| Congé | `#FEF3C7` | `#92400E` | `#F59E0B` |
| Absent | `#FEE2E2` | `#991B1B` | `#EF4444` |

---

# 4. COMPOSANTS UI & INTERACTIVITÉ

## 4.1 MODALS

### 4.1.1 Configuration Standard

| Propriété | Valeur |
|-----------|--------|
| Backdrop | `rgba(0, 0, 0, 0.5)` avec `backdrop-filter: blur(4px)` |
| Positionnement | Centré vertical et horizontal |
| Max-width | `480px` (form), `640px` (detail), `90vw` (mobile) |
| Max-height | `90vh` |
| Border-radius | `24px` |
| Padding | `24px` |
| Shadow | `--shadow-xl` |

### 4.1.2 Animations

```css
/* Animation d'ouverture */
@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-enter {
  animation: modalSlideUp 200ms ease-out;
}

/* Animation de fermeture */
.modal-exit {
  animation: modalSlideUp 150ms ease-in reverse;
}
```

### 4.1.3 Comportement

- Fermeture via : bouton X, touche Escape, clic sur backdrop
- Focus trap actif (accessibilité)
- Scroll interne si contenu dépasse max-height

---

## 4.2 SIDEBAR

### 4.2.1 Desktop (≥768px)

| Propriété | Valeur |
|-----------|--------|
| Largeur | `240px` fixe |
| Position | `fixed left-0 top-0 bottom-0` |
| Background | `#FFFFFF` |
| Border-right | `1px solid #E5E7EB` |
| Z-index | `40` |

### 4.2.2 Mobile (<768px) - Drawer

| Propriété | Valeur |
|-----------|--------|
| Comportement | Slide-over depuis la gauche |
| Largeur | `280px` |
| Animation | `transform 300ms ease-out` |
| Overlay | `rgba(0, 0, 0, 0.5)` |
| Trigger | Bouton hamburger dans header mobile |

### 4.2.3 Navigation Item States

| État | Background | Text color | Border-left |
|------|------------|------------|-------------|
| Default | `transparent` | `#6B7280` | `none` |
| Hover | `#F3F4F6` | `#374151` | `none` |
| Active | `#EFF6FF` | `#2563EB` | `3px solid #3B82F6` |

---

## 4.3 TRANSITIONS DE PAGE

```css
/* Transition entre vues */
.page-enter {
  opacity: 0;
}

.page-enter-active {
  opacity: 1;
  transition: opacity 150ms ease-out;
}

.page-exit {
  opacity: 1;
}

.page-exit-active {
  opacity: 0;
  transition: opacity 100ms ease-in;
}
```

---

## 4.4 TOOLTIPS

| Propriété | Valeur |
|-----------|--------|
| Background | `#1F2937` |
| Text color | `#FFFFFF` |
| Font-size | `12px` |
| Padding | `6px 10px` |
| Border-radius | `6px` |
| Max-width | `200px` |
| Delay apparition | `300ms` |
| Animation | `fade-in 150ms` |

---

## 4.5 BOUTONS

### 4.5.1 Variantes

| Variante | Background | Text | Border | Usage |
|----------|------------|------|--------|-------|
| **Primary** | `#3B82F6` | `#FFFFFF` | none | Actions principales |
| **Secondary** | `#F3F4F6` | `#374151` | none | Actions secondaires |
| **Outline** | `transparent` | `#3B82F6` | `1px #3B82F6` | Actions tertiaires |
| **Ghost** | `transparent` | `#6B7280` | none | Actions subtiles |
| **Danger** | `#EF4444` | `#FFFFFF` | none | Actions destructives |
| **Success** | `#10B981` | `#FFFFFF` | none | Actions positives |

### 4.5.2 Tailles

| Taille | Height | Padding X | Font-size | Border-radius |
|--------|--------|-----------|-----------|---------------|
| **sm** | `32px` | `12px` | `13px` | `8px` |
| **md** | `40px` | `16px` | `14px` | `10px` |
| **lg** | `48px` | `20px` | `15px` | `12px` |
| **xl** | `56px` | `24px` | `16px` | `14px` |

---

# 5. MODÈLE DE DONNÉES (MOCK DATA)

## 5.1 Structure des Entités

### 5.1.1 Employee (Travailleur)

```typescript
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  role: 'chef_equipe' | 'operateur' | 'technicien' | 'conducteur' | 'gardien';
  team: 'A' | 'B';
  status: 'actif' | 'conge' | 'absent';
  phone: string;
  email?: string;
  avatar?: string;
  hireDate: string; // ISO date
  dailyRate: number; // USD
}
```

### 5.1.2 ProductionEntry (Entrée Production)

```typescript
interface ProductionEntry {
  id: string;
  date: string; // ISO date
  team: 'A' | 'B';
  shift: 'matin' | 'jour' | 'soir';
  quantity: number; // grammes
  purity: number; // pourcentage 0-100
  operatorId: string;
  machineId?: string;
  notes?: string;
  status: 'brouillon' | 'valide' | 'annule';
  createdAt: string;
  updatedAt: string;
}
```

### 5.1.3 Alert (Alerte)

```typescript
interface Alert {
  id: string;
  type: 'carburant' | 'maintenance' | 'transport' | 'securite' | 'personnel';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  actionRequired?: string;
  dueDate?: string;
  status: 'ouverte' | 'en_cours' | 'resolue';
  createdAt: string;
  resolvedAt?: string;
}
```

### 5.1.4 TimeEntry (Pointage)

```typescript
interface TimeEntry {
  id: string;
  employeeId: string;
  date: string; // ISO date
  arrivalTime?: string; // HH:mm
  departureTime?: string; // HH:mm
  status: 'present' | 'retard' | 'absent' | 'conge';
  notes?: string;
}
```

### 5.1.5 Expense (Dépense)

```typescript
interface Expense {
  id: string;
  category: 'carburant' | 'equipement' | 'materiaux' | 'transport' | 'salaires' | 'autres';
  amount: number; // USD
  description: string;
  date: string;
  supplierId?: string;
  receipt?: string; // URL
  status: 'en_attente' | 'approuve' | 'rejete';
}
```

### 5.1.6 GalleryImage (Image Galerie)

```typescript
interface GalleryImage {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  description?: string;
  location: string;
  capturedAt: string;
  uploadedBy: string;
  tags: string[];
}
```

### 5.1.7 Machine (Équipement)

```typescript
interface Machine {
  id: string;
  name: string;
  type: 'foreuse' | 'concasseur' | 'generateur' | 'pompe' | 'vehicule';
  status: 'operationnel' | 'maintenance' | 'panne';
  totalHours: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  location: string;
}
```

---

## 5.2 MOCK DATA RÉALISTES

### 5.2.1 Employees

```javascript
const employees = [
  {
    id: "emp-001",
    firstName: "Jean",
    lastName: "Kabongo",
    role: "chef_equipe",
    team: "A",
    status: "actif",
    phone: "+243 812 345 678",
    email: "j.kabongo@minedor.cd",
    hireDate: "2022-03-15",
    dailyRate: 45
  },
  {
    id: "emp-002",
    firstName: "Marie",
    lastName: "Mutombo",
    role: "operateur",
    team: "A",
    status: "actif",
    phone: "+243 812 456 789",
    hireDate: "2023-01-10",
    dailyRate: 35
  },
  {
    id: "emp-003",
    firstName: "Pierre",
    lastName: "Kasongo",
    role: "technicien",
    team: "B",
    status: "actif",
    phone: "+243 812 567 890",
    hireDate: "2023-06-22",
    dailyRate: 40
  },
  {
    id: "emp-004",
    firstName: "André",
    lastName: "Mwamba",
    role: "conducteur",
    team: "B",
    status: "actif",
    phone: "+243 812 678 901",
    hireDate: "2024-02-01",
    dailyRate: 38
  },
  {
    id: "emp-005",
    firstName: "Joseph",
    lastName: "Tshisekedi",
    role: "gardien",
    team: "A",
    status: "actif",
    phone: "+243 812 789 012",
    hireDate: "2022-11-05",
    dailyRate: 25
  }
];
```

### 5.2.2 Monthly Production Data

```javascript
const monthlyProduction = [
  { month: "Jan", value: 722, teamA: 350, teamB: 372 },
  { month: "Fév", value: 1988, teamA: 980, teamB: 1008 },
  { month: "Mar", value: 660, teamA: 320, teamB: 340 },
  { month: "Avr", value: 1186, teamA: 600, teamB: 586 },
  { month: "Mai", value: 1999, teamA: 1050, teamB: 949 },
  { month: "Juin", value: 1453, teamA: 700, teamB: 753 },
  { month: "Juil", value: 2274, teamA: 1100, teamB: 1174 },
  { month: "Août", value: 2189, teamA: 1050, teamB: 1139 },
  { month: "Sept", value: 2320, teamA: 1200, teamB: 1120 },
  { month: "Oct", value: 2100, teamA: 1000, teamB: 1100 },
  { month: "Nov", value: 2450, teamA: 1250, teamB: 1200 },
  { month: "Déc", value: 3194, teamA: 1600, teamB: 1594 }
];
```

### 5.2.3 Alerts

```javascript
const alerts = [
  {
    id: "alert-001",
    type: "carburant",
    severity: "warning",
    title: "Carburant & Énergie",
    description: "Stock critique (1200L). Approvisionnement nécessaire avant lundi.",
    actionRequired: "Commander 2000L de diesel",
    dueDate: "2026-01-10",
    status: "ouverte",
    createdAt: "2026-01-05T08:00:00Z"
  },
  {
    id: "alert-002",
    type: "maintenance",
    severity: "info",
    title: "Équipement & Maintenance",
    description: "Révision foreuse À planifier pour jeudi 9 janvier.",
    actionRequired: "Confirmer avec technicien",
    dueDate: "2026-01-09",
    status: "ouverte",
    createdAt: "2026-01-04T14:30:00Z"
  },
  {
    id: "alert-003",
    type: "transport",
    severity: "info",
    title: "Transport & Logistique",
    description: "Livraison équipement confirmée pour le 15 janvier.",
    status: "ouverte",
    createdAt: "2026-01-06T10:15:00Z"
  }
];
```

### 5.2.4 Expenses

```javascript
const expenses = [
  { id: "exp-001", category: "carburant", amount: 450, description: "Diesel générateur", date: "2026-01-05" },
  { id: "exp-002", category: "equipement", amount: 220, description: "Pièces foreuse A", date: "2026-01-04" },
  { id: "exp-003", category: "materiaux", amount: 180, description: "Explosifs extraction", date: "2026-01-03" },
  { id: "exp-004", category: "transport", amount: 150, description: "Évacuation minerai", date: "2026-01-02" },
  { id: "exp-005", category: "autres", amount: 100, description: "Fournitures bureau", date: "2026-01-01" }
];
```

### 5.2.5 Gallery Images

```javascript
const galleryImages = [
  {
    id: "img-001",
    url: "/images/chantier-01.jpg",
    thumbnail: "/images/chantier-01-thumb.jpg",
    title: "Zone d'extraction principale",
    location: "Secteur Nord",
    capturedAt: "2026-01-06T09:30:00Z",
    uploadedBy: "emp-001",
    tags: ["extraction", "zone-nord"]
  },
  {
    id: "img-002",
    url: "/images/chantier-02.jpg",
    thumbnail: "/images/chantier-02-thumb.jpg",
    title: "Foreuse en opération",
    location: "Puits 3",
    capturedAt: "2026-01-05T14:15:00Z",
    uploadedBy: "emp-003",
    tags: ["equipement", "foreuse"]
  },
  {
    id: "img-003",
    url: "/images/chantier-03.jpg",
    thumbnail: "/images/chantier-03-thumb.jpg",
    title: "Équipe du matin",
    location: "Base camp",
    capturedAt: "2026-01-04T06:45:00Z",
    uploadedBy: "emp-001",
    tags: ["equipe", "personnel"]
  },
  {
    id: "img-004",
    url: "/images/chantier-04.jpg",
    thumbnail: "/images/chantier-04-thumb.jpg",
    title: "Minerai extrait",
    location: "Zone de stockage",
    capturedAt: "2026-01-03T16:00:00Z",
    uploadedBy: "emp-002",
    tags: ["production", "minerai"]
  },
  {
    id: "img-005",
    url: "/images/chantier-05.jpg",
    thumbnail: "/images/chantier-05-thumb.jpg",
    title: "Vue aérienne site",
    location: "Site Kolwezi",
    capturedAt: "2026-01-02T11:30:00Z",
    uploadedBy: "emp-001",
    tags: ["aerien", "vue-generale"]
  },
  {
    id: "img-006",
    url: "/images/chantier-06.jpg",
    thumbnail: "/images/chantier-06-thumb.jpg",
    title: "Générateur principal",
    location: "Zone énergie",
    capturedAt: "2026-01-01T08:00:00Z",
    uploadedBy: "emp-003",
    tags: ["equipement", "energie"]
  }
];
```

### 5.2.6 Recent Activities

```javascript
const recentActivities = [
  {
    id: "act-001",
    type: "production",
    title: "Production : 2028",
    description: "Extraction de 23g complétée",
    timestamp: "2026-01-07T14:30:00Z",
    icon: "Gem",
    color: "green"
  },
  {
    id: "act-002",
    type: "pointage",
    title: "Pointage n: 2025",
    description: "3 heures de travail enregistrées",
    timestamp: "2026-01-07T12:00:00Z",
    icon: "Clock",
    color: "blue"
  },
  {
    id: "act-003",
    type: "maintenance",
    title: "Maintenance 1290",
    description: "Maintenance complète des équipements terminée",
    timestamp: "2026-01-07T10:15:00Z",
    icon: "Wrench",
    color: "orange"
  },
  {
    id: "act-004",
    type: "objectif",
    title: "Objectifs 2389",
    description: "Objectif mensuel de janvier atteint",
    timestamp: "2026-01-06T18:00:00Z",
    icon: "Target",
    color: "purple"
  },
  {
    id: "act-005",
    type: "maintenance",
    title: "Maintenance 2038",
    description: "Rappel : maintenance de l'extracteur prévue de 60j",
    timestamp: "2026-01-06T09:00:00Z",
    icon: "AlertCircle",
    color: "red"
  }
];
```

### 5.2.7 Calendar Heatmap Data (Janvier 2026)

```javascript
const calendarData = [
  { date: "2026-01-01", value: 180, level: "moyen" },
  { date: "2026-01-02", value: 250, level: "bon" },
  { date: "2026-01-03", value: 320, level: "eleve" },
  { date: "2026-01-04", value: 280, level: "bon" },
  { date: "2026-01-05", value: 50, level: "faible" },
  { date: "2026-01-06", value: 75, level: "faible" },
  { date: "2026-01-07", value: 222, level: "bon" },
  // ... rest of January
  { date: "2026-01-18", value: 310, level: "eleve" }
];
```

### 5.2.8 Forecast vs Reality

```javascript
const forecasts = [
  {
    id: "forecast-production",
    metric: "Production (kg)",
    planned: 2.50,
    actual: 1.62,
    unit: "kg",
    variance: -35.2,
    status: "warning"
  },
  {
    id: "forecast-charges",
    metric: "Charges Totales ($)",
    planned: 4000,
    actual: 4400,
    unit: "$",
    variance: 10,
    status: "warning"
  },
  {
    id: "forecast-marge",
    metric: "Marge Brute ($)",
    planned: 8500,
    actual: 5200,
    unit: "$",
    variance: -38.8,
    status: "critical"
  },
  {
    id: "forecast-cout",
    metric: "Coût/kg ($)",
    planned: 1600,
    actual: 2716,
    unit: "$/kg",
    variance: 69.8,
    status: "critical"
  }
];
```

---

# 6. ANNEXES TECHNIQUES

## 6.1 CHECKLIST DE VALIDATION

### 6.1.1 Design System

- [ ] Aucun emoji dans l'interface
- [ ] Toutes les icônes proviennent de lucide-react
- [ ] strokeWidth des icônes = 1.5
- [ ] Couleurs conformes aux tokens définis
- [ ] Border-radius conformes (16-24px pour les cartes)
- [ ] Ombres douces (shadow-md par défaut)
- [ ] Typographie SF Pro ou système Apple

### 6.1.2 Responsive

- [ ] Sidebar drawer fonctionnel sur mobile
- [ ] Grille 4 colonnes sur mobile, 12 sur desktop
- [ ] Tous les tap targets ≥ 44px
- [ ] Pas de scroll horizontal

### 6.1.3 Interactions

- [ ] Modals avec backdrop blur
- [ ] Transitions de page fluides (150-200ms)
- [ ] Hover states sur toutes les cartes cliquables
- [ ] Focus states pour accessibilité

### 6.1.4 Données

- [ ] Mock data réalistes (pas de Lorem Ipsum)
- [ ] Terminologie minière correcte
- [ ] Formats de données cohérents (ISO dates, USD)

---

## 6.2 RÉFÉRENCES DESIGN

### 6.2.1 Inspirations

- Apple iOS 17 Design Guidelines
- Linear App Dashboard
- Vercel Dashboard
- Raycast UI

### 6.2.2 Ressources

- Icônes : https://lucide.dev/icons
- Couleurs : https://tailwindcss.com/docs/customizing-colors
- Charts : https://recharts.org/en-US

---

## 6.3 GLOSSAIRE TECHNIQUE MINIER

| Terme | Définition |
|-------|------------|
| **Pureté** | Pourcentage d'or pur dans le minerai extrait |
| **Quart** | Période de travail (Matin: 6h-14h, Jour: 14h-22h, Soir: 22h-6h) |
| **Foreuse** | Équipement de forage pour extraction |
| **Concasseur** | Machine broyant le minerai |
| **Évacuation** | Transport du minerai vers la zone de traitement |
| **Secteur** | Zone géographique délimitée du site minier |

---

## 6.4 CONTACT & SUPPORT

**Document rédigé par :** Direction Produit Mine d'Or V2  
**Destinataire :** Équipe Antigravity  
**Version :** 2.0.0 - Document Définitif  
**Date de création :** Janvier 2026  

---

*Ce document constitue la référence absolue pour le développement de Mine d'Or V2. Toute déviation doit être validée par le Product Owner avant implémentation.*
