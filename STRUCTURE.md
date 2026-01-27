# Structure de l'application Manager - Vue Router

## Architecture

L'application a été restructurée avec **Vue Router** pour une navigation claire et maintenable.

### Structure des fichiers

```
src/
├── App.vue                          # Conteneur principal (router-view)
├── main.js                          # Point d'entrée avec Vue Router
├── router/
│   └── index.js                     # Configuration des routes
└── views/
    ├── Home.vue                     # Page d'accueil (choix rôle)
    ├── Login.vue                    # Page de connexion
    └── manager/
        ├── Dashboard.vue            # Dashboard manager
        ├── SignalementsList.vue     # Liste des signalements
        └── SignalementDetails.vue   # Détails d'un signalement
```

## Routes

| Route                           | Composant              | Protection | Description                    |
|---------------------------------|------------------------|------------|--------------------------------|
| `/`                             | Home.vue               | Non        | Sélection rôle utilisateur/manager |
| `/login`                        | Login.vue              | Non        | Connexion (avec query ?role=)  |
| `/manager/dashboard`            | Dashboard.vue          | Oui        | Tableau de bord manager        |
| `/manager/signalements`         | SignalementsList.vue   | Oui        | Liste des signalements         |
| `/manager/signalements/:id`     | SignalementDetails.vue | Oui        | Détails d'un signalement       |

## Protection des routes

Le guard de navigation dans `router/index.js` vérifie :
- Présence du token JWT (`localStorage.getItem('token')`)
- Rôle de l'utilisateur (`localStorage.getItem('userRole')`)
- Redirection vers `/login` si non authentifié

## État actuel (Mock)

### Données statiques
Toutes les pages utilisent actuellement des **données mock** :
- Signalements codés en dur
- Pas d'appels API réels
- Pas d'intégration Firebase

### Authentification simulée
Le login stocke dans localStorage :
- `token` : JWT simulé
- `userEmail` : email de l'utilisateur
- `userRole` : 'user' ou 'manager'
- `tokenExpiration` : timestamp d'expiration

## À faire (TODO)

### 1. Intégration API
- [ ] Installer Axios
- [ ] Créer un service API (`src/services/api.js`)
- [ ] Remplacer les appels mock par de vrais appels
- [ ] Endpoints à implémenter :
  - POST `/api/login`
  - GET `/api/signalements`
  - GET `/api/signalements/:id`
  - PATCH `/api/signalements/:id`
  - POST `/api/sync-firebase`

### 2. Gestion JWT
- [ ] Intercepteur Axios pour ajouter le token
- [ ] Intercepteur 401/403 pour déconnexion auto
- [ ] Vérification expiration côté client
- [ ] Refresh token si nécessaire

### 3. Intégration Firebase
- [ ] Installer Firebase SDK
- [ ] Configuration Firebase
- [ ] Sync réelle (pull/push)
- [ ] Auth Firebase optionnelle

### 4. Intégration Leaflet
- [ ] Installer vue-leaflet
- [ ] Connecter au serveur de tuiles (cloud-s5-map)
- [ ] Afficher la carte Antananarivo
- [ ] Ajouter les marqueurs de signalements
- [ ] Tooltips avec infos (statut, budget, etc.)

### 5. Fonctionnalités manquantes
- [ ] Page déblocage utilisateur (manager)
- [ ] Gestion des pièces jointes (upload/download)
- [ ] Export PDF
- [ ] Pagination réelle
- [ ] Filtres avancés

## Démarrage

```bash
# Installation des dépendances
npm install

# Développement
npm run dev

# Build production
npm run build
```

## Accès

- **Local**: http://localhost:5173/
- **Identifiants demo** :
  - Manager: admin@example.com / admin123
  - User: user@example.com / user123

## Notes

- Les données mock sont dans chaque composant (à centraliser dans un store Pinia si besoin)
- Pas de gestion d'état global pour l'instant (envisager Pinia)
- Les styles sont en `scoped` dans chaque composant
- Compatible Vue 3 + Vite
