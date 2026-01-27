<template>
  <div class="manager-container">
    <!-- Navigation -->
    <nav class="manager-nav">
      <router-link to="/manager/dashboard" class="nav-btn" active-class="active">
        Dashboard
      </router-link>
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
      <h1>Dashboard Manager</h1>
      <p>Connecté : {{ userEmail }}</p>
    </header>
    
    <!-- PAGE DASHBOARD MANAGER -->
    <div class="dashboard-page">
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
        
        <!-- Carte de synchronisation Firebase -->
        <div class="dashboard-card sync-card">
          <h3>Synchronisation Firebase</h3>
          <div class="sync-container">
            <div class="sync-info">
              <div class="sync-status">
                <span :class="['sync-status-icon', syncStatus]">
                  <span v-if="syncStatus === 'loading'">⏳</span>
                  <span v-else-if="syncStatus === 'success'">✅</span>
                  <span v-else-if="syncStatus === 'error'">❌</span>
                  <span v-else>🔄</span>
                </span>
                <span class="sync-status-text">{{ getSyncStatusText() }}</span>
              </div>
              <div class="sync-stats" v-if="lastSync">
                <small>Dernière synchro: {{ formatTime(lastSync) }}</small>
              </div>
            </div>
            <button 
              class="btn-sync" 
              @click="startFirebaseSync"
              :disabled="syncStatus === 'loading'"
            >
              <span v-if="syncStatus === 'loading'">Synchronisation...</span>
              <span v-else>Synchroniser</span>
            </button>
            <div class="sync-details" v-if="syncDetails">
              <p class="sync-message" :class="syncStatus">
                {{ syncDetails.message }}
              </p>
              <div class="sync-results" v-if="syncResults">
                <div class="sync-result-item">
                  <span>Récupérés:</span>
                  <span class="sync-count">{{ syncResults.retrieved || 0 }}</span>
                </div>
                <div class="sync-result-item">
                  <span>Mis à jour:</span>
                  <span class="sync-count">{{ syncResults.updated || 0 }}</span>
                </div>
                <div class="sync-result-item">
                  <span>Ajoutés:</span>
                  <span class="sync-count">{{ syncResults.added || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dashboard-card notifications-card">
          <h3>Notifications</h3>
          <div class="notifications-list">
            <div class="notification-item" v-for="notification in notifications" :key="notification.id">
              {{ notification.message }}
            </div>
            <div v-if="syncNotification" class="notification-item sync-notification">
              {{ syncNotification }}
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userEmail = computed(() => localStorage.getItem('userEmail') || '')
const searchQuery = ref('')
const syncStatus = ref('idle')
const syncDetails = ref(null)
const syncResults = ref(null)
const lastSync = ref(null)
const syncNotification = ref('')

// Données de démonstration (TODO: remplacer par appels API)
const signalements = ref([
  {
    id: 1,
    titre: "Nid de poule sur la route principale",
    statut: "nouveau",
    budget: "moyen",
  },
  {
    id: 2,
    titre: "Éclairage public défectueux",
    statut: "en_cours",
    budget: "faible",
  },
  {
    id: 3,
    titre: "Graffiti sur mur public",
    statut: "termine",
    budget: "eleve",
  }
])

const notifications = ref([
  { id: 1, message: "Nouveau signalement reçu #4" },
  { id: 2, message: "Signalement #2 en attente de validation" }
])

const logout = () => {
  localStorage.clear()
  router.push('/')
}

const startFirebaseSync = async () => {
  syncStatus.value = 'loading'
  syncDetails.value = { message: 'Initialisation de la synchronisation...' }
  
  // TODO: Remplacer par un vrai appel API Firebase
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  syncResults.value = { retrieved: 5, added: 2, updated: 1 }
  syncStatus.value = 'success'
  lastSync.value = new Date()
  syncDetails.value = { message: 'Synchronisation réussie !' }
  syncNotification.value = '2 nouveaux signalements synchronisés'
  
  setTimeout(() => {
    syncNotification.value = ''
  }, 5000)
}

const getSyncStatusText = () => {
  switch(syncStatus.value) {
    case 'loading': return 'Synchronisation en cours...'
    case 'success': return 'Synchronisé'
    case 'error': return 'Erreur de synchronisation'
    default: return 'Prêt à synchroniser'
  }
}

const formatTime = (date) => {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const getSignalementsCount = (status) => {
  return signalements.value.filter(s => s.statut === status).length
}

const getBudgetCount = (budget) => {
  return signalements.value.filter(s => s.budget === budget).length
}

const doSearch = () => {
  // TODO: implémenter la recherche
  console.log('Recherche:', searchQuery.value)
}

const filterByStatus = (status) => {
  router.push({ name: 'SignalementsList', query: { status } })
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

.btn-sync:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sync-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.sync-message {
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
}

.sync-message.success {
  background: #d4edda;
  color: #155724;
}

.sync-results {
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
}

.sync-result-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.sync-count {
  font-weight: bold;
  color: #3498db;
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
</style>
