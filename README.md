# 🎬 Pathé Cinéma - Système de Réservation en Ligne

Un système de réservation de places de cinéma moderne et interactif développé avec les technologies web standards.

## 📋 Table des matières

- [Aperçu du projet](#aperçu-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Architecture](#architecture)
- [Composants](#composants)
- [API et données](#api-et-données)
- [Responsive Design](#responsive-design)
- [Déploiement](#déploiement)

## 🎯 Aperçu du projet

Le projet Pathé Cinéma est une application web complète permettant aux utilisateurs de :
- Consulter les films à l'affiche
- Filtrer les séances par genre, salle et langue
- Sélectionner leurs places dans la salle
- Choisir leurs tarifs
- Commander des snacks
- Effectuer le paiement sécurisé
- Récupérer leur billet électronique

## ✨ Fonctionnalités

### 🎭 Gestion des films
- **Catalogue interactif** : Affichage des films avec filtres avancés
- **Bandes-annonces** : Lecture intégrée des trailers YouTube
- **Informations détaillées** : Genre, durée, âge minimum, langues disponibles
- **Technologies de projection** : IMAX, 4K, 4D

### 🪑 Sélection des places
- **Plan de salle dynamique** : 300 places réparties sur 15 rangées
- **Statuts en temps réel** : Places libres, occupées, sélectionnées
- **Interface intuitive** : Sélection/désélection par clic
- **Espacement réaliste** : Allées et rangements conformes

### 🎫 Système de tarification
- **Tarifs multiples** : Adulte (9,90€), Moins de 14 ans (6,50€)
- **Validation intelligente** : Nombre de billets = nombre de places
- **Modification flexible** : Retour possible aux étapes précédentes

### 🍿 Commande de snacks
- **Catalogue complet** : Boissons, snacks sucrés et salés
- **Animations fluides** : Effets visuels d'ajout/suppression
- **Gestion des quantités** : Contrôles intuitifs
- **Récapitulatif détaillé** : Prix et quantités en temps réel

### 💳 Paiement sécurisé
- **Modes multiples** : Carte bancaire, Google Pay
- **Validation en temps réel** : Vérification des données saisies
- **Sécurité** : Formatage automatique et validation des champs
- **Retours utilisateur** : Messages d'erreur contextuels

### 🎟️ Confirmation et billet
- **Billet électronique** : Design professionnel avec QR code
- **Détails complets** : Récapitulatif de la commande
- **Modal d'informations** : Accès aux détails via clic
- **Sécurité** : Accès protégé par token de validation

## 🛠️ Technologies utilisées

### Frontend
- **HTML5** : Sémantique moderne avec ARIA
- **SCSS/Sass** : Architecture modulaire et maintenable
- **JavaScript ES6+** : Classes, modules, async/await
- **CSS Grid & Flexbox** : Layouts responsives

### Outils de développement
- **Sass** : Préprocesseur CSS avec variables et mixins
- **Architecture BEM/SCSS** : Organisation des styles
- **JSON** : Base de données locale pour les films et snacks
- **Git** : Contrôle de version

### Fonctionnalités avancées
- **Animations CSS/JS** : Transitions fluides et effets visuels
- **LocalStorage** : Persistance des données utilisateur
- **URL Parameters** : Navigation avec état persistant
- **Responsive Design** : Compatible mobile, tablette, desktop
- **Accessibilité** : Support lecteurs d'écran et navigation clavier

## 📁 Structure du projet

```
Pathe/
├── 📁 assets/
│   ├── 📁 script/           # Scripts JavaScript
│   │   ├── script-common.js     # Utilitaires partagés
│   │   ├── script-films.js      # Gestion des films
│   │   ├── script-places.js     # Sélection des places
│   │   ├── script-tarifs.js     # Gestion des tarifs
│   │   ├── script-snacks.js     # Commande de snacks
│   │   ├── script-paiement.js   # Processus de paiement
│   │   ├── script-confirmation.js # Page de confirmation
│   │   ├── script-animations.js  # Animations et transitions
│   │   └── script-slider.js     # Carrousel d'images
│   │
│   ├── 📁 abstracts/        # Variables et mixins SCSS
│   │   ├── _variables.scss      # Variables globales
│   │   ├── _colors.scss         # Palette de couleurs
│   │   ├── _functions.scss      # Fonctions
│   │   ├── _typography.scss     # Typographie
│   │   ├── _mixins.scss         # Mixins réutilisables
│   │   └── _index.scss          # Point d'entrée
│   │
│   ├── 📁 base/             # Styles de base
│   │   ├── _reset.scss          # Reset CSS
│   │   ├── _reset-typography.scss # Reset typographique
│   │   └── _global.scss         # Styles globaux
│   │
│   ├── 📁 layout/           # Layouts principaux
│   │   ├── _header.scss         # En-tête
│   │   ├── _side-bar.scss       # Barre latérale
│   │   ├── _total.scss          # Section total
│   │   ├── _filter.scss         # Filtres
│   │   ├── _cinema-hall.scss    # Salle de cinéma
│   │   ├── _tickets-selections.scss # Sélection billets
│   │   ├── _snacks-selections.scss # Sélection de snacks
│   │   └── _paiement-wrapper.scss # Wrapper paiement
│   │
│   ├── 📁 components/       # Composants réutilisables
│   │   ├── 📁 buttons/          # Boutons
│   │   ├── 📁 cards/            # Cartes
│   │   ├── 📁 modals/           # Modales
│   │   ├── _carousel.scss       # Carrousel
│   │   ├── _billet.scss # Recu de fin de réservation
│   │   └── _video-popup.scss    # Popup vidéo
│   │
│   ├── 📁 pages/            # Styles spécifiques aux pages
│   │   ├── _home.scss           # Page d'accueil
│   │   ├── _choisir-seance.scss # Choix de séance
│   │   ├── _vos-places.scss     # Sélection places
│   │   ├── _tarifs.scss         # Page tarifs
│   │   ├── _snacks.scss         # Page snacks
│   │   ├── _paiement.scss       # Page paiement
│   │   └── _confirmation.scss   # Confirmation
│   │
│   ├── 📁 images/           # Assets graphiques
│   │   ├── 📁 films/            # Affiches de films
│   │   ├── 📁 snacks/           # Images des snacks
│   │   ├── 📁 pictos/           # Icônes et pictogrammes
│   │   └── 📁 logo/             # Logos
│   │
│   ├── 📁 json/             # Données JSON
│   │   ├── films.json           # Base de données films
│   │   └── snack.json           # Base de données snacks
│   │
│   └── main.scss            # Point d'entrée SCSS
│
├── 📁 css/                  # CSS compilé
│   └── styles.css
│
├── 📁 fonts/                # Polices personnalisées
│   └── styles.css
│
├── 📁 pages/                # Pages HTML
│   ├── choisir-une-seance.html  # Sélection film/séance
│   ├── vos-places.html          # Sélection places
│   ├── tarifs.html              # Choix tarifs
│   ├── snacks.html              # Commande snacks
│   ├── paiement.html            # Paiement
│   └── confirmation.html        # Confirmation
│
├── index.html               # Page d'accueil
├── favicon.png              # Icône du site
└── README.md               # Documentation
```

## 🚀 Installation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur web local (recommandé pour éviter les restrictions CORS)

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone [url-du-repo]
cd Pathe
```

2. **Serveur local (recommandé)**
```bash
# Avec Python
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server

# Avec PHP
php -S localhost:8000
```

3. **Accéder à l'application**
```
http://localhost:8000
```

## 📱 Utilisation

### Parcours utilisateur complet

1. **Page d'accueil** (`index.html`)
   - Carrousel de films en vedette
   - Bouton d'accès à la réservation

2. **Sélection de film** (`choisir-une-seance.html`)
   - Filtrage par genre, salle, langue
   - Recherche par titre
   - Consultation des bandes-annonces
   - Sélection de la séance

3. **Choix des places** (`vos-places.html`)
   - Plan de salle interactif
   - Sélection multiple des places
   - Visualisation des places disponibles/occupées

4. **Tarification** (`tarifs.html`)
   - Sélection des types de billets
   - Validation du nombre de billets
   - Possibilité de modifier les places

5. **Snacks** (`snacks.html`)
   - Catalogue de produits par catégorie
   - Animations d'ajout/suppression
   - Gestion des quantités

6. **Paiement** (`paiement.html`)
   - Choix du mode de paiement
   - Validation des données bancaires
   - Sécurisation du processus

7. **Confirmation** (`confirmation.html`)
   - Billet électronique avec QR code
   - Récapitulatif complet de la commande
   - Détails de réservation

## 🏗️ Architecture

### Modèle de données

#### Films (`films.json`)
```json
{
  "titre": "string",
  "genre": ["string"],
  "durée_minutes": "number",
  "âge_minimum": "number",
  "image": "string",
  "youtube_id": "string",
  "nouveau": "boolean",
  "mention_frisson": "boolean",
  "avertissement_violence": "boolean",
  "séances": [
    {
      "horaire": "string",
      "fin": "string",
      "salle": "number",
      "libres": "number",
      "vf": "boolean",
      "vost": "boolean",
      "imax": "boolean",
      "4k": "boolean",
      "4D": "boolean",
      "handicap": "boolean"
    }
  ]
}
```

#### Snacks (`snack.json`)
```json
{
  "categorie": [
    {
      "nom": "string",
      "prix": "number",
      "image": "string"
    }
  ]
}
```

### Classes JavaScript principales

#### `ParametresReservation`
Gestion des paramètres de réservation via URL
- Parsing des paramètres URL
- Génération des liens de navigation
- Persistance des données entre les pages

#### `AffichageSeance`
Affichage des informations de séance
- Rendu des détails du film
- Mise à jour de la sidebar
- Formatage des informations techniques

#### `GestionnaireNavigation`
Gestion de la navigation inter-pages
- Mise à jour des liens dynamiques
- Préservation de l'état utilisateur
- Gestion des retours en arrière

#### `RecapitulatifCommande`
Calcul et affichage des totaux
- Calcul des prix billets/snacks
- Génération des récapitulatifs HTML
- Gestion des promotions

#### `ChargeurDonneesFilms`
Chargement des données externes
- Appels API vers les fichiers JSON
- Gestion des erreurs
- Cache des données

## 🎨 Composants

### Boutons
- **Primary** : Actions principales (`_primary.scss`)
- **Secondary** : Actions secondaires (`_secondary.scss`)
- **Icon** : Boutons avec icônes (`_icon.scss`)
- **Continue** : Boutons de progression (`_continue.scss`)
- **Scroller** : Boutons de navigation horizontale (`_scroller.scss`)

### Cartes
- **Film** : Affichage des films avec séances (`_card-film.scss`)
- **Séance** : Détails d'une séance spécifique (`_card-seance.scss`)
- **Snack** : Produits avec contrôles quantité (`_card-snacks.scss`)

### Modales
- **Modal** : Fenêtres contextuelles (`_modal.scss`)
- **Video Popup** : Popup vidéo pour bandes-annonces (`_video-popup.scss`)

### Carrousel
- **Carousel** : Carrousel d'images et films (`_carousel.scss`)

### Layouts
- **Header** : Navigation principale (`_header.scss`)
- **Sidebar** : Informations contextuelles (`_side-bar.scss`)
- **Cinema Hall** : Plan de salle interactif (`_cinema-hall.scss`)
- **Filter** : Filtres de recherche et sélection (`_filter.scss`)
- **Total Section** : Récapitulatif et actions (`_total.scss`)
- **Tickets Selection** : Sélection des billets (`_tickets-selections.scss`)
- **Snacks Selection** : Sélection des snacks (`_snacks-selections.scss`)
- **Paiement Wrapper** : Encapsulation du processus de paiement (`_paiement-wrapper.scss`)
- **Billet** : Affichage du billet électronique (`_billet.scss`)

### Images & Données
- **Images** : Affiches de films, snacks, pictogrammes, logos (`assets/images`)
- **JSON** : Données films et snacks (`assets/json`)


## 📊 API et données

### Structure des données

Les données sont stockées dans des fichiers JSON locaux :
- `films.json` : Catalogue complet des films et séances
- `snack.json` : Inventaire des produits de restauration

### Gestion des états

L'application utilise les paramètres URL pour maintenir l'état :
```javascript
// Exemple d'URL avec état complet
vos-places.html?film=Avatar&horaire=20:30&places=A1,A2&adult=2&child=0
```

### Persistance des données

Les données utilisateur sont transmises via :
- **URL Parameters** : Navigation entre pages
- **SessionStorage** : Données temporaires
- **LocalStorage** : Préférences utilisateur

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 768px
- **Tablette** : 768px - 1300px  
- **Desktop** : > 1300px

### Adaptations par device
- **Mobile** : Navigation simplifiée, plan de salle adapté
- **Tablette** : Layout hybride, optimisation des grilles
- **Desktop** : Expérience complète, sidebar fixe

---

## 📄 Licence

Projet réalisé dans le cadre pédagogique de **Webecom 2025**. Non destiné à un usage commercial.

## 👨‍💻 Auteur

- **Maxime Cornillon** - [MaximeCornillon](https://github.com/maxcorni)
Développé avec ❤️ pour l'examen final du cours de développement web.

---

*Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur le repository.*
