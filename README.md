# Ma Bibliothèque - Application de Suivi de Lecture

Application web full-stack permettant aux utilisateurs de gérer leur collection de livres personnelle, suivre leur progression de lecture et noter leurs ouvrages.

## Fonctionnalités

### Authentification
- Inscription avec email, nom d'utilisateur et mot de passe
- Connexion sécurisée avec JWT
- Déconnexion
- Persistance de session (token stocké en localStorage)
- Déconnexion automatique si le token expire

### Gestion des livres (CRUD complet)
- Ajouter un livre (titre, auteur, description, image, tags)
- Voir tous ses livres
- Voir le détail d'un livre
- Modifier un livre
- Supprimer un livre

### Fonctionnalités de suivi
- Changer le statut de lecture (À lire / En cours / Terminé)
- Noter un livre (1 à 5 étoiles)
- Filtrer par statut
- Tags personnalisés

## Stack Technique

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par token
- **Bcrypt** - Hashage des mots de passe
- **Joi** - Validation des données
- **CORS** - Gestion des requêtes cross-origin

### Frontend
- **React 18** - Bibliothèque UI
- **Vite** - Build tool
- **React Router DOM** - Routage
- **Zustand** - Gestion d'état global
- **Axios** - Client HTTP

## Structure du Projet
```
bibliotheque-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Connexion MongoDB
│   │   ├── controllers/
│   │   │   ├── auth.controller.js   # Controller authentification
│   │   │   └── item.controller.js   # Controller items
│   │   ├── dtos/
│   │   │   ├── user.dto.js          # Validation Joi users
│   │   │   └── item.dto.js          # Validation Joi items
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js   # Vérification JWT
│   │   │   └── validation.middleware.js  # Validation générique
│   │   ├── models/
│   │   │   ├── user.model.js        # Schéma Mongoose User
│   │   │   └── item.model.js        # Schéma Mongoose Item
│   │   ├── routes/
│   │   │   ├── auth.routes.js       # Routes authentification
│   │   │   └── item.routes.js       # Routes items
│   │   ├── services/
│   │   │   ├── auth.service.js      # Logique métier auth
│   │   │   └── item.service.js      # Logique métier items
│   │   └── utils/
│   │       ├── jwt.utils.js         # Génération/vérification JWT
│   │       └── password.utils.js    # Hashage bcrypt
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── FilterBar.jsx        # Filtres par statut
    │   │   ├── ItemCard.jsx         # Card d'un livre
    │   │   ├── ItemForm.jsx         # Formulaire livre
    │   │   ├── Navbar.jsx           # Navigation
    │   │   ├── ProtectedRoute.jsx   # Protection des routes
    │   │   └── StarRating.jsx       # Notation étoiles
    │   ├── pages/
    │   │   ├── Home.jsx             # Liste des livres
    │   │   ├── ItemCreate.jsx       # Création livre
    │   │   ├── ItemDetail.jsx       # Détail livre
    │   │   ├── ItemEdit.jsx         # Modification livre
    │   │   ├── Login.jsx            # Connexion
    │   │   └── Register.jsx         # Inscription
    │   ├── services/
    │   │   └── api.js               # Client HTTP centralisé
    │   ├── stores/
    │   │   ├── authStore.js         # État authentification
    │   │   └── itemStore.js         # État items
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

## Installation

### Prérequis
- Node.js (v18+)
- npm
- MongoDB (local ou Atlas)

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd bibliotheque-app
```

### 2. Installer les dépendances backend
```bash
cd backend
npm install
```

### 3. Configurer les variables d'environnement backend
Créer un fichier `backend/.env` :
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/bibliotheque
JWT_SECRET=votre_cle_secrete_super_longue
SALT_ROUNDS=10
```

### 4. Installer les dépendances frontend
```bash
cd ../frontend
npm install
```

### 5. Configurer les variables d'environnement frontend
Créer un fichier `frontend/.env` :
```env
VITE_API_URL=http://localhost:5000
```

## Lancer l'application

### Terminal 1 - Backend
```bash
cd backend
node server.js
```
Le serveur démarre sur `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
L'application démarre sur `http://localhost:5173`

## 📡 API Endpoints

### Authentification

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/auth/signup` | Inscription | ❌ |
| POST | `/auth/signin` | Connexion | ❌ |

### Items (Livres)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/items` | Récupérer tous ses livres | ✅ |
| GET | `/items?status=reading` | Filtrer par statut | ✅ |
| GET | `/items/:id` | Récupérer un livre | ✅ |
| POST | `/items` | Créer un livre | ✅ |
| PATCH | `/items/:id` | Modifier un livre | ✅ |
| DELETE | `/items/:id` | Supprimer un livre | ✅ |

### Format de réponse standardisé
```json
{
    "error": false,
    "message": "Message de succès ou d'erreur",
    "statusCode": 200,
    "data": { }
}
```

## Modèles de données

### User
```javascript
{
    email: String,      // unique
    username: String,
    password: String,   // hashé avec bcrypt
    createdAt: Date,
    updatedAt: Date
}
```

### Item
```javascript
{
    title: String,
    author: String,
    imageUrl: String,
    description: String,
    status: String,     // "to_read" | "reading" | "finished"
    rating: Number,     // 1-5 ou null
    tags: [String],     // tableau de tags
    userId: ObjectId,   // référence vers User
    createdAt: Date,
    updatedAt: Date
}
```

## Sécurité

- **Mots de passe** : hashés avec bcrypt (10 salt rounds)
- **Authentification** : JWT avec expiration de 24h
- **Routes protégées** : middleware vérifie le token avant accès
- **Isolation des données** : chaque utilisateur ne voit que ses propres livres
- **Variables sensibles** : stockées dans `.env` (non versionnées)
- **CORS** : configuré pour autoriser les requêtes du frontend

## Équipe

| Membre | Rôle |
|--------|------|
| [Florent Ngor] | Authentification (backend + frontend) |
| [Frederick Toufik] | Gestion des items (backend + frontend) |

## Scripts disponibles

### Backend
```bash
node server.js     # Lancer le serveur
```

### Frontend
```bash
npm run dev        # Lancer en développement
npm run build      # Build de production
npm run preview    # Prévisualiser le build
```

## Améliorations futures

- [ ] Recherche par titre/auteur
- [ ] Wishlist de livres
- [ ] Statistiques de lecture
- [ ] Export de la collection
- [ ] Mode sombre
- [ ] Application mobile

## Licence

Projet réalisé dans le cadre du TP MERN - IPSSI

---

Formateur : Bastien Flanquart
