<template>
  <div>
    <!-- Écran 1 : Choix du rôle -->
    <div class="role-selection" v-if="!selectedRole && !isLoggedIn">
      <h1>Projet Cloud S5</h1>
      <p class="subtitle">Application de signalement routier</p>
      <h2>Choisissez votre rôle</h2>
      <div class="role-buttons">
        <button class="btn-user" @click="selectUser">Utilisateur</button>
        <button class="btn-manager" @click="selectManager">Manager</button>
      </div>
    </div>
    
    <!-- Écran 2 : Login Utilisateur -->
    <div class="login-container" v-if="selectedRole === 'user' && !isLoggedIn">
      <h2>Login Utilisateur</h2>
      <div class="form-group">
        <label>Email :</label>
        <input v-model="userEmail" type="text" />
      </div>
      <div class="form-group">
        <label>Mot de passe :</label>
        <input v-model="userPassword" type="password" />
      </div>
      <div class="form-actions">
        <button class="btn-login" @click="loginUser">Se connecter</button>
        <button class="btn-back" @click="goBack">Retour</button>
      </div>
    </div>
    
    <!-- Écran 3 : Login Manager -->
    <div class="login-container" v-if="selectedRole === 'manager' && !isLoggedIn">
      <h2>Login Manager</h2>
      <div class="form-group">
        <label>Email :</label>
        <input v-model="managerEmail" type="text" />
      </div>
      <div class="form-group">
        <label>Mot de passe :</label>
        <input v-model="managerPassword" type="password" />
      </div>
      <div class="form-actions">
        <button class="btn-login" @click="loginManager">Se connecter</button>
        <button class="btn-back" @click="goBack">Retour</button>
      </div>
    </div>
    
    <!-- Écran 4 : Manager connecté -->
    <div class="manager-container" v-if="isLoggedIn && userRole === 'manager'">
      <!-- Navigation -->
      <nav class="manager-nav">
        <button 
          class="nav-btn" 
          :class="{ active: currentManagerPage === 'dashboard' }" 
          @click="currentManagerPage = 'dashboard'"
        >
          Dashboard
        </button>
        <button 
          class="nav-btn" 
          :class="{ active: currentManagerPage === 'signalements' }" 
          @click="currentManagerPage = 'signalements'"
        >
          Liste Signalements
        </button>
        <button 
          class="nav-btn" 
          v-if="currentManagerPage === 'details'"
          :class="{ active: currentManagerPage === 'details' }"
        >
          Détails
        </button>
        <button class="btn-logout" @click="logout">Déconnexion</button>
      </nav>
      
      <!-- Header -->
      <header class="manager-header">
        <h1 v-if="currentManagerPage === 'dashboard'">Dashboard Manager</h1>
        <h1 v-else-if="currentManagerPage === 'signalements'">Liste des Signalements</h1>
        <h1 v-else-if="currentManagerPage === 'details' && currentSignalement">
          Détails du Signalement #{{ currentSignalement.id }}
        </h1>
        <p>Connecté : {{ managerEmail }}</p>
      </header>
      
      <!-- PAGE DASHBOARD MANAGER -->
      <div class="dashboard-page" v-if="currentManagerPage === 'dashboard'">
        <div class="dashboard-grid">
          <div class="dashboard-card">
            <h3>Résumé des signalements</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">Nouveau</div>
                <div class="stat-value">{{ getSignalementsCount('nouveau') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">En cours</div>
                <div class="stat-value">{{ getSignalementsCount('en_cours') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Terminé</div>
                <div class="stat-value">{{ getSignalementsCount('termine') }}</div>
              </div>
            </div>
          </div>
          
          <div class="dashboard-card">
            <h3>Par budget</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">0-1000€</div>
                <div class="stat-value">{{ getBudgetCount('faible') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">1001-5000€</div>
                <div class="stat-value">{{ getBudgetCount('moyen') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">5000€+</div>
                <div class="stat-value">{{ getBudgetCount('eleve') }}</div>
              </div>
            </div>
          </div>
          
          <div class="dashboard-card sync-card">
            <h3>Synchronisation Firebase</h3>
            <button class="btn-sync" @click="syncFirebase">Synchroniser</button>
          </div>
          
          <div class="dashboard-card notifications-card">
            <h3>Notifications</h3>
            <div class="notifications-list">
              <div class="notification-item" v-for="notification in notifications" :key="notification.id">
                {{ notification.message }}
              </div>
            </div>
          </div>
          
          <div class="dashboard-card search-card">
            <h3>Accès rapide</h3>
            <div class="search-box">
              <input class="search-input" placeholder="Rechercher..." v-model="searchQuery" />
              <button class="btn-search" @click="doSearch">Rechercher</button>
            </div>
            <div class="quick-filters">
              <button class="filter-btn" @click="filterByStatus('nouveau')">Nouveau</button>
              <button class="filter-btn" @click="filterByStatus('en_cours')">En cours</button>
              <button class="filter-btn" @click="filterByStatus('termine')">Terminé</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- PAGE LISTE DES SIGNALEMENTS -->
      <div class="signalements-page" v-if="currentManagerPage === 'signalements'">
        <!-- Mode d'affichage -->
        <div class="view-toggle">
          <button 
            class="view-btn" 
            :class="{ active: viewMode === 'table' }" 
            @click="viewMode = 'table'"
          >
            Tableau
          </button>
          <button 
            class="view-btn" 
            :class="{ active: viewMode === 'cards' }" 
            @click="viewMode = 'cards'"
          >
            Cartes
          </button>
        </div>
        
        <!-- Filtres -->
        <div class="filters-section">
          <div class="filter-group">
            <input class="filter-input" v-model="filterText" placeholder="Rechercher..." />
          </div>
          <div class="filter-group">
            <select class="filter-select" v-model="filterStatus">
              <option value="">Tous les statuts</option>
              <option value="nouveau">Nouveau</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
          </div>
          <div class="filter-group">
            <select class="filter-select" v-model="filterBudget">
              <option value="">Tous les budgets</option>
              <option value="faible">0-1000€</option>
              <option value="moyen">1001-5000€</option>
              <option value="eleve">5000€+</option>
            </select>
          </div>
          <div class="filter-actions">
            <button class="btn-apply" @click="applyFilters">Appliquer</button>
            <button class="btn-reset" @click="resetFilters">Réinitialiser</button>
          </div>
        </div>
        
        <!-- Tableau -->
        <div class="table-section" v-if="viewMode === 'table'">
          <div class="table-container">
            <table class="signalements-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titre</th>
                  <th>Localisation</th>
                  <th>Statut</th>
                  <th>Budget</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="signalement in filteredSignalements" :key="signalement.id">
                  <td>{{ signalement.id }}</td>
                  <td>{{ signalement.titre }}</td>
                  <td>{{ signalement.localisation }}</td>
                  <td>
                    <span :class="['status-badge', signalement.statut]">
                      {{ getStatusText(signalement.statut) }}
                    </span>
                  </td>
                  <td>
                    <span :class="['budget-badge', signalement.budget]">
                      {{ getBudgetText(signalement.budget) }}
                    </span>
                  </td>
                  <td>{{ formatDate(signalement.date) }}</td>
                  <td>
                    <button class="btn-view-details" @click="viewSignalementDetails(signalement)">
                      Voir détails
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Cartes -->
        <div class="cards-section" v-if="viewMode === 'cards'">
          <div class="cards-grid">
            <div class="signalement-card" v-for="signalement in filteredSignalements" :key="signalement.id">
              <div class="card-header">
                <div class="card-id">ID: {{ signalement.id }}</div>
                <div class="card-status">
                  <span :class="['status-badge', signalement.statut]">
                    {{ getStatusText(signalement.statut) }}
                  </span>
                </div>
              </div>
              <div class="card-content">
                <h4 class="card-title">{{ signalement.titre }}</h4>
                <p class="card-location">{{ signalement.localisation }}</p>
                <p class="card-budget">
                  <span :class="['budget-badge', signalement.budget]">
                    {{ getBudgetText(signalement.budget) }}
                  </span>
                </p>
                <p class="card-date">{{ formatDate(signalement.date) }}</p>
              </div>
              <div class="card-actions">
                <select v-model="signalement.newStatus" @change="updateCardStatus(signalement)">
                  <option value="nouveau">Nouveau</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                </select>
                <button class="btn-view-details" @click="viewSignalementDetails(signalement)">
                  Voir détails
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="pagination-section">
          <div class="pagination-links">
            <button class="pagination-btn" disabled>&laquo;</button>
            <button class="pagination-btn active">1</button>
            <button class="pagination-btn">2</button>
            <button class="pagination-btn">3</button>
            <button class="pagination-btn" disabled>&raquo;</button>
          </div>
        </div>
        
        <!-- Modification de statut -->
        <div class="status-update-section">
          <h3>Modification de statut</h3>
          <div class="status-update-form">
            <select class="status-select" v-model="selectedStatusForUpdate">
              <option value="nouveau">Nouveau</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
            <button class="btn-update-status" @click="updateSelectedStatus">Mettre à jour</button>
          </div>
        </div>
      </div>
      
      <!-- PAGE DÉTAILS D'UN SIGNALEMENT -->
      <div class="details-page" v-if="currentManagerPage === 'details' && currentSignalement">
        <!-- Bouton retour -->
        <div class="details-header-actions">
          <button class="btn-back" @click="goBackToList">
            ← Retour à la liste
          </button>
          <button class="btn-sync" @click="syncCurrentSignalement">
            🔄 Synchroniser
          </button>
        </div>
        
        <div class="details-container">
          <!-- Colonne gauche - Informations principales -->
          <div class="details-left-column">
            <!-- Informations générales -->
            <div class="details-card">
              <h3>Informations générales</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>Titre</label>
                  <p class="info-value">{{ currentSignalement.titre }}</p>
                </div>
                <div class="info-item">
                  <label>Description</label>
                  <p class="info-value description">{{ currentSignalement.description }}</p>
                </div>
                <div class="info-item">
                  <label>Localisation</label>
                  <p class="info-value">{{ currentSignalement.localisation }}</p>
                </div>
                <div class="info-item">
                  <label>Date de création</label>
                  <p class="info-value">{{ formatDate(currentSignalement.date) }}</p>
                </div>
                <div class="info-item">
                  <label>Dernière mise à jour</label>
                  <p class="info-value">{{ formatDate(currentSignalement.updatedAt) }}</p>
                </div>
                <div class="info-item">
                  <label>Statut actuel</label>
                  <div class="status-action">
                    <span :class="['status-badge', currentSignalement.statut]">
                      {{ getStatusText(currentSignalement.statut) }}
                    </span>
                    <select v-model="currentSignalement.newStatus" @change="updateSignalementStatus">
                      <option value="nouveau">Nouveau</option>
                      <option value="en_cours">En cours</option>
                      <option value="termine">Terminé</option>
                    </select>
                    <button class="btn-update-status" @click="updateSignalementStatus">
                      Mettre à jour
                    </button>
                  </div>
                </div>
                <div class="info-item">
                  <label>Budget</label>
                  <span :class="['budget-badge', currentSignalement.budget]">
                    {{ getBudgetText(currentSignalement.budget) }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Historique et suivi -->
            <div class="details-card">
              <h3>Historique et suivi</h3>
              <div class="timeline">
                <div v-for="(event, index) in currentSignalement.historique" :key="index" class="timeline-item">
                  <div class="timeline-date">{{ formatDate(event.date) }}</div>
                  <div class="timeline-content">
                    <h4>{{ event.action }}</h4>
                    <p v-if="event.description">{{ event.description }}</p>
                    <div v-if="event.utilisateur">
                      <small>Par: {{ event.utilisateur }}</small>
                    </div>
                  </div>
                </div>
                <div v-if="!currentSignalement.historique || currentSignalement.historique.length === 0">
                  <p class="no-history">Aucun historique disponible</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Colonne droite - Pièces jointes et actions -->
          <div class="details-right-column">
            <!-- Pièces jointes -->
            <div class="details-card">
              <h3>Pièces jointes</h3>
              <div class="attachments-list">
                <div v-for="(file, index) in currentSignalement.piecesJointes" :key="index" class="attachment-item">
                  <div class="file-icon">📎</div>
                  <div class="file-info">
                    <div class="file-name">{{ file.nom }}</div>
                    <div class="file-size">{{ file.taille }}</div>
                  </div>
                  <button class="btn-download" @click="downloadFile(file)">
                    Télécharger
                  </button>
                </div>
                <div v-if="!currentSignalement.piecesJointes || currentSignalement.piecesJointes.length === 0">
                  <p class="no-attachments">Aucune pièce jointe</p>
                </div>
              </div>
            </div>
            
            <!-- Actions possibles -->
            <div class="details-card actions-card">
              <h3>Actions</h3>
              <div class="action-buttons">
                <button class="btn-action" @click="editSignalement">
                  ✏️ Modifier le signalement
                </button>
                <button class="btn-action" @click="assignSignalement">
                  👤 Assigner à un agent
                </button>
                <button class="btn-action" @click="addComment">
                  💬 Ajouter un commentaire
                </button>
                <button class="btn-action" @click="exportSignalement">
                  📤 Exporter en PDF
                </button>
                <button class="btn-action delete" @click="deleteSignalement">
                  🗑️ Supprimer le signalement
                </button>
              </div>
            </div>
            
            <!-- Statuts rapides -->
            <div class="details-card quick-status">
              <h3>Changer rapidement le statut</h3>
              <div class="quick-status-buttons">
                <button 
                  :class="['btn-quick-status', 'nouveau', { active: currentSignalement.statut === 'nouveau' }]"
                  @click="setQuickStatus('nouveau')"
                >
                  Nouveau
                </button>
                <button 
                  :class="['btn-quick-status', 'en_cours', { active: currentSignalement.statut === 'en_cours' }]"
                  @click="setQuickStatus('en_cours')"
                >
                  En cours
                </button>
                <button 
                  :class="['btn-quick-status', 'termine', { active: currentSignalement.statut === 'termine' }]"
                  @click="setQuickStatus('termine')"
                >
                  Terminé
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Écran 5 : Dashboard Utilisateur -->
    <div class="user-dashboard" v-if="isLoggedIn && userRole === 'user'">
      <h2>Bienvenue Utilisateur !</h2>
      <p>Email connecté : {{ userEmail }}</p>
      <button class="btn-logout" @click="logout">Déconnexion</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// État de l'authentification
const selectedRole = ref('')
const userEmail = ref('')
const userPassword = ref('')
const managerEmail = ref('')
const managerPassword = ref('')
const isLoggedIn = ref(false)
const userRole = ref('')
const currentManagerPage = ref('dashboard')

// Dashboard et liste
const searchQuery = ref('')
const viewMode = ref('table')
const filterText = ref('')
const filterStatus = ref('')
const filterBudget = ref('')
const selectedStatusForUpdate = ref('nouveau')
const selectedSignalementId = ref(null)
const currentSignalement = ref(null)

// Données de démonstration
const signalements = ref([
  {
    id: 1,
    titre: "Nid de poule sur la route principale",
    localisation: "123 Rue Principale, Paris",
    description: "Grand nid de poule causant des problèmes de circulation. Nécessite une réparation urgente.",
    statut: "nouveau",
    budget: "moyen",
    date: "2024-01-15",
    updatedAt: "2024-01-20",
    newStatus: "nouveau",
    historique: [
      {
        date: "2024-01-15",
        action: "Signalement créé",
        utilisateur: "admin@example.com",
        description: "Signalement soumis via l'application mobile"
      },
      {
        date: "2024-01-18",
        action: "Inspection programmée",
        utilisateur: "technicien@ville.fr",
        description: "Visite technique prévue pour le 22/01/2024"
      }
    ],
    piecesJointes: [
      { nom: "photo_nid_poule.jpg", taille: "2.4 MB" },
      { nom: "localisation_gps.kml", taille: "0.8 MB" }
    ]
  },
  {
    id: 2,
    titre: "Éclairage public défectueux",
    localisation: "Avenue des Champs-Élysées",
    description: "Lampe publique hors service depuis plusieurs jours.",
    statut: "en_cours",
    budget: "faible",
    date: "2024-01-10",
    updatedAt: "2024-01-19",
    newStatus: "en_cours",
    historique: [
      {
        date: "2024-01-10",
        action: "Signalement créé",
        utilisateur: "citoyen@mail.com"
      },
      {
        date: "2024-01-12",
        action: "Prise en charge",
        utilisateur: "service-technique",
        description: "Intervention programmée"
      }
    ],
    piecesJointes: [
      { nom: "photo_lampadaire.jpg", taille: "1.9 MB" }
    ]
  },
  {
    id: 3,
    titre: "Graffiti sur mur public",
    localisation: "Place de la République",
    description: "Graffiti sur façade de bâtiment municipal.",
    statut: "termine",
    budget: "eleve",
    date: "2024-01-05",
    updatedAt: "2024-01-17",
    newStatus: "termine",
    historique: [
      {
        date: "2024-01-05",
        action: "Signalement créé",
        utilisateur: "agent_municipal"
      },
      {
        date: "2024-01-15",
        action: "Nettoyage effectué",
        utilisateur: "equipe_proprete",
        description: "Graffiti retiré avec produit spécialisé"
      }
    ],
    piecesJointes: [
      { nom: "avant_nettoyage.jpg", taille: "3.2 MB" },
      { nom: "apres_nettoyage.jpg", taille: "3.5 MB" }
    ]
  }
])

const notifications = ref([
  { id: 1, message: "Nouveau signalement reçu #4" },
  { id: 2, message: "Signalement #2 en attente de validation" }
])

// Computed properties
const filteredSignalements = computed(() => {
  return signalements.value.filter(s => {
    const matchesText = !filterText.value || 
      s.titre.toLowerCase().includes(filterText.value.toLowerCase()) ||
      s.localisation.toLowerCase().includes(filterText.value.toLowerCase())
    
    const matchesStatus = !filterStatus.value || s.statut === filterStatus.value
    const matchesBudget = !filterBudget.value || s.budget === filterBudget.value
    
    return matchesText && matchesStatus && matchesBudget
  })
})

// Méthodes de sélection et authentification
const selectUser = () => {
  selectedRole.value = 'user'
  userEmail.value = 'user@example.com'
  userPassword.value = 'user123'
}

const selectManager = () => {
  selectedRole.value = 'manager'
  managerEmail.value = 'admin@example.com'
  managerPassword.value = 'admin123'
}

const goBack = () => {
  selectedRole.value = ''
}

const loginUser = () => {
  isLoggedIn.value = true
  userRole.value = 'user'
}

const loginManager = () => {
  isLoggedIn.value = true
  userRole.value = 'manager'
  currentManagerPage.value = 'dashboard'
}

const logout = () => {
  isLoggedIn.value = false
  userRole.value = ''
  selectedRole.value = ''
  currentManagerPage.value = 'dashboard'
  currentSignalement.value = null
}

// Méthodes dashboard
const syncFirebase = () => {
  console.log('Synchronisation Firebase')
}

const doSearch = () => {
  console.log('Recherche:', searchQuery.value)
}

const filterByStatus = (status) => {
  filterStatus.value = status
  currentManagerPage.value = 'signalements'
}

// Méthodes liste signalements
const applyFilters = () => {
  console.log('Filtres appliqués')
}

const resetFilters = () => {
  filterText.value = ''
  filterStatus.value = ''
  filterBudget.value = ''
}

const updateSelectedStatus = () => {
  if (selectedSignalementId.value) {
    console.log('Mise à jour statut')
  } else {
    console.log('Aucun signalement sélectionné')
  }
}

// Méthodes détails signalement
const viewSignalementDetails = (signalement) => {
  currentSignalement.value = { ...signalement, newStatus: signalement.statut }
  currentManagerPage.value = 'details'
}

const goBackToList = () => {
  currentManagerPage.value = 'signalements'
  currentSignalement.value = null
}

const syncCurrentSignalement = () => {
  console.log('Synchronisation du signalement', currentSignalement.value.id)
}

const updateSignalementStatus = () => {
  if (currentSignalement.value && currentSignalement.value.newStatus !== currentSignalement.value.statut) {
    // Ajouter à l'historique
    currentSignalement.value.historique.push({
      date: new Date().toISOString().split('T')[0],
      action: 'Statut modifié',
      utilisateur: managerEmail.value,
      description: `Changement de ${getStatusText(currentSignalement.value.statut)} à ${getStatusText(currentSignalement.value.newStatus)}`
    })
    
    // Mettre à jour le statut
    currentSignalement.value.statut = currentSignalement.value.newStatus
    currentSignalement.value.updatedAt = new Date().toISOString().split('T')[0]
    
    // Mettre à jour dans la liste principale
    const index = signalements.value.findIndex(s => s.id === currentSignalement.value.id)
    if (index !== -1) {
      signalements.value[index].statut = currentSignalement.value.newStatus
      signalements.value[index].updatedAt = currentSignalement.value.updatedAt
    }
    
    console.log('Statut mis à jour:', currentSignalement.value.statut)
  }
}

const updateCardStatus = (signalement) => {
  if (signalement.newStatus !== signalement.statut) {
    // Ajouter à l'historique
    signalement.historique.push({
      date: new Date().toISOString().split('T')[0],
      action: 'Statut modifié',
      utilisateur: managerEmail.value,
      description: `Changement de ${getStatusText(signalement.statut)} à ${getStatusText(signalement.newStatus)}`
    })
    
    // Mettre à jour le statut
    signalement.statut = signalement.newStatus
    signalement.updatedAt = new Date().toISOString().split('T')[0]
    
    console.log('Statut mis à jour:', signalement.statut)
  }
}

const setQuickStatus = (status) => {
  if (currentSignalement.value) {
    currentSignalement.value.newStatus = status
    updateSignalementStatus()
  }
}

const downloadFile = (file) => {
  console.log('Téléchargement:', file.nom)
}

const editSignalement = () => {
  console.log('Modification du signalement')
}

const assignSignalement = () => {
  console.log('Assignation à un agent')
}

const addComment = () => {
  const comment = prompt('Ajouter un commentaire:')
  if (comment && currentSignalement.value) {
    currentSignalement.value.historique.push({
      date: new Date().toISOString().split('T')[0],
      action: 'Commentaire ajouté',
      utilisateur: managerEmail.value,
      description: comment
    })
    currentSignalement.value.updatedAt = new Date().toISOString().split('T')[0]
  }
}

const exportSignalement = () => {
  console.log('Export PDF')
}

const deleteSignalement = () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce signalement ?')) {
    const index = signalements.value.findIndex(s => s.id === currentSignalement.value.id)
    if (index !== -1) {
      signalements.value.splice(index, 1)
      goBackToList()
      console.log('Signalement supprimé')
    }
  }
}

// Méthodes utilitaires
const getStatusText = (status) => {
  const statusMap = {
    'nouveau': 'Nouveau',
    'en_cours': 'En cours',
    'termine': 'Terminé'
  }
  return statusMap[status] || status
}

const getBudgetText = (budget) => {
  const budgetMap = {
    'faible': '0-1000€',
    'moyen': '1001-5000€',
    'eleve': '5000€+'
  }
  return budgetMap[budget] || budget
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}

const getSignalementsCount = (status) => {
  return signalements.value.filter(s => s.statut === status).length
}

const getBudgetCount = (budget) => {
  return signalements.value.filter(s => s.budget === budget).length
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.role-selection {
  max-width: 600px;
  margin: 50px auto;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.role-selection h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  color: #7f8c8d;
  margin-bottom: 30px;
}

.role-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;
}

.btn-user, .btn-manager {
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-user:hover, .btn-manager:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.btn-user {
  background-color: #3498db;
  color: white;
}

.btn-manager {
  background-color: #2c3e50;
  color: white;
}

.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 25px;
}

.btn-login {
  flex: 1;
  padding: 12px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.btn-back {
  padding: 12px 20px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.manager-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.manager-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
}

.nav-btn {
  padding: 10px 20px;
  background: #ecf0f1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-btn:hover {
  background: #bdc3c7;
}

.nav-btn.active {
  background: #3498db;
  color: white;
}

.btn-logout {
  margin-left: auto;
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.manager-header {
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.manager-header h1 {
  color: #2c3e50;
  margin-bottom: 5px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.dashboard-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.dashboard-card h3 {
  margin-bottom: 15px;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
}

.stat-label {
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.btn-sync {
  width: 100%;
  padding: 15px;
  background: #9b59b6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification-item {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
  border-left: 4px solid #3498db;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.btn-search {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.quick-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 15px;
  background: #ecf0f1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.signalements-page {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.view-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.view-btn {
  padding: 10px 20px;
  background: #ecf0f1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.view-btn.active {
  background: #3498db;
  color: white;
}

.filters-section {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 5px;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-input, .filter-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.filter-actions {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.btn-apply {
  padding: 10px 20px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-reset {
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.table-container {
  overflow-x: auto;
}

.signalements-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.signalements-table th {
  background: #2c3e50;
  color: white;
  padding: 12px;
  text-align: left;
}

.signalements-table td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

.signalements-table tr:hover {
  background: #f8f9fa;
}

/* Badges */
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.status-badge.nouveau {
  background-color: #ffeb3b;
  color: #333;
}

.status-badge.en_cours {
  background-color: #2196f3;
  color: white;
}

.status-badge.termine {
  background-color: #4caf50;
  color: white;
}

.budget-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.budget-badge.faible {
  background-color: #4caf50;
  color: white;
}

.budget-badge.moyen {
  background-color: #ff9800;
  color: white;
}

.budget-badge.eleve {
  background-color: #f44336;
  color: white;
}

.btn-view-details {
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.signalement-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.card-title {
  color: #2c3e50;
  margin-bottom: 10px;
}

.card-content p {
  margin-bottom: 8px;
  color: #7f8c8d;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.card-actions select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.pagination-section {
  margin: 30px 0;
  text-align: center;
}

.pagination-links {
  display: inline-flex;
  gap: 5px;
}

.pagination-btn {
  padding: 8px 15px;
  background: #ecf0f1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination-btn.active {
  background: #3498db;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-update-section {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  margin-top: 30px;
}

.status-update-form {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-update-status {
  padding: 10px 20px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Page Détails */
.details-page {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.details-header-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.details-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.details-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.details-card h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-item {
  margin-bottom: 20px;
}

.info-item label {
  display: block;
  font-weight: 600;
  color: #7f8c8d;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-value {
  color: #2c3e50;
  font-size: 16px;
}

.info-value.description {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
  grid-column: span 2;
}

.status-action {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.timeline {
  position: relative;
  padding-left: 25px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e9ecef;
}

.timeline-item {
  position: relative;
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #f1f3f5;
}

.timeline-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -31px;
  top: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3498db;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #3498db;
  z-index: 1;
}

.timeline-date {
  color: #6c757d;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 5px;
}

.timeline-content h4 {
  color: #2c3e50;
  font-size: 15px;
  margin-bottom: 8px;
}

.timeline-content p {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 5px;
}

.no-history, .no-attachments {
  text-align: center;
  padding: 30px;
  color: #95a5a6;
  font-style: italic;
  background: #f8f9fa;
  border-radius: 8px;
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: transform 0.2s;
}

.attachment-item:hover {
  transform: translateX(5px);
  background: #e9ecef;
}

.file-icon {
  font-size: 24px;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 3px;
}

.file-size {
  color: #6c757d;
  font-size: 12px;
}

.btn-download {
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-action {
  padding: 14px 20px;
  background: #ecf0f1;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
}

.btn-action:hover {
  background: #bdc3c7;
}

.btn-action.delete {
  background: #e74c3c;
  color: white;
}

.btn-action.delete:hover {
  background: #c0392b;
}

.quick-status-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.btn-quick-status {
  padding: 12px 10px;
  border: 2px solid #dee2e6;
  background: white;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-quick-status:hover {
  transform: translateY(-2px);
}

.btn-quick-status.nouveau.active {
  background-color: #ffeb3b;
  border-color: #ffc107;
}

.btn-quick-status.en_cours.active {
  background-color: #2196f3;
  border-color: #0b7dda;
  color: white;
}

.btn-quick-status.termine.active {
  background-color: #4caf50;
  border-color: #388e3c;
  color: white;
}

.user-dashboard {
  max-width: 600px;
  margin: 50px auto;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

/* Responsive */
@media (max-width: 1024px) {
  .details-container {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-value.description {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .manager-nav {
    flex-direction: column;
  }
  
  .details-header-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .status-action {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .quick-status-buttons {
    grid-template-columns: 1fr;
  }
}
</style>