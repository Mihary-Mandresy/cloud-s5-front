<template>
  <div class="manager-container">
    <!-- Navigation -->
    <nav class="manager-nav">
      <router-link to="/manager/dashboard" class="nav-btn">Dashboard</router-link>
      <router-link to="/manager/signalements" class="nav-btn" active-class="active">
        Liste Signalements
      </router-link>
      <router-link to="/manager/carte" class="nav-btn" active-class="active">
        Carte
      </router-link>
      <button class="btn-logout" @click="logout">Déconnexion</button>
    </nav>
    
    <!-- Header -->
    <header class="manager-header">
      <h1>Liste des Signalements</h1>
      <p>Connecté : {{ userEmail }}</p>
    </header>
    
    <!-- PAGE LISTE DES SIGNALEMENTS -->
    <div class="signalements-page">
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
        <button 
          class="view-btn sync-view-btn"
          @click="syncFirebase"
          :disabled="syncStatus === 'loading'"
        >
          🔄 Synchroniser Firebase
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const userEmail = computed(() => localStorage.getItem('userEmail') || '')
const viewMode = ref('table')
const filterText = ref('')
const filterStatus = ref('')
const filterBudget = ref('')
const syncStatus = ref('idle')

// Données de démonstration (TODO: remplacer par appels API)
const signalements = ref([
  {
    id: 1,
    titre: "Nid de poule sur la route principale",
    localisation: "123 Rue Principale, Paris",
    description: "Grand nid de poule causant des problèmes de circulation.",
    statut: "nouveau",
    budget: "moyen",
    date: "2024-01-15",
    newStatus: "nouveau"
  },
  {
    id: 2,
    titre: "Éclairage public défectueux",
    localisation: "Avenue des Champs-Élysées",
    description: "Lampe publique hors service depuis plusieurs jours.",
    statut: "en_cours",
    budget: "faible",
    date: "2024-01-10",
    newStatus: "en_cours"
  },
  {
    id: 3,
    titre: "Graffiti sur mur public",
    localisation: "Place de la République",
    description: "Graffiti sur façade de bâtiment municipal.",
    statut: "termine",
    budget: "eleve",
    date: "2024-01-05",
    newStatus: "termine"
  }
])

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

onMounted(() => {
  // Appliquer les filtres depuis l'URL si présents
  if (route.query.status) {
    filterStatus.value = route.query.status
  }
})

const logout = () => {
  localStorage.clear()
  router.push('/')
}

const syncFirebase = async () => {
  syncStatus.value = 'loading'
  // TODO: Remplacer par un vrai appel API
  await new Promise(resolve => setTimeout(resolve, 1500))
  syncStatus.value = 'success'
}

const applyFilters = () => {
  // Les filtres sont déjà appliqués via computed
  console.log('Filtres appliqués')
}

const resetFilters = () => {
  filterText.value = ''
  filterStatus.value = ''
  filterBudget.value = ''
}

const viewSignalementDetails = (signalement) => {
  router.push({ name: 'SignalementDetails', params: { id: signalement.id } })
}

const updateCardStatus = (signalement) => {
  // TODO: Appel API pour mettre à jour le statut
  signalement.statut = signalement.newStatus
  console.log('Statut mis à jour:', signalement.statut)
}

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
</script>

<style scoped>
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
  text-decoration: none;
  color: #333;
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

.view-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
</style>
