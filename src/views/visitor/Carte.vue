<template>
  <div class="visitor-container">
    <!-- Navigation -->
    <nav class="visitor-nav">
      <router-link to="/" class="nav-btn">Accueil</router-link>
      <h2 class="nav-title">Carte des Signalements</h2>
    </nav>
    
    <!-- Header -->
    <header class="visitor-header">
      <h1>Carte des Signalements - Antananarivo</h1>
      <p>Vue publique des signalements routiers</p>
    </header>
    
    <!-- Contenu carte -->
    <div class="carte-container">
      <!-- Panneau latéral -->
      <div class="side-panel">
        <h3>📊 Statistiques</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">Signalements</div>
            <div class="stat-value">{{ totalSignalements }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Surface totale</div>
            <div class="stat-value">{{ totalSurface.toFixed(2) }} m²</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Avancement</div>
            <div class="stat-value">{{ avancement }}%</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Budget total</div>
            <div class="stat-value">{{ totalBudget.toLocaleString() }}€</div>
          </div>
        </div>
        
        <!-- Filtres -->
        <div class="filters-section">
          <h4>Filtres</h4>
          <div class="filter-group">
            <label class="filter-checkbox nouveau">
              <input type="checkbox" v-model="showStatut.nouveau" @change="updateMarkers" />
              <span class="checkbox-label">Nouveau ({{ getCountByStatus('nouveau') }})</span>
            </label>
            <label class="filter-checkbox en-cours">
              <input type="checkbox" v-model="showStatut.en_cours" @change="updateMarkers" />
              <span class="checkbox-label">En cours ({{ getCountByStatus('en_cours') }})</span>
            </label>
            <label class="filter-checkbox termine">
              <input type="checkbox" v-model="showStatut.termine" @change="updateMarkers" />
              <span class="checkbox-label">Terminé ({{ getCountByStatus('termine') }})</span>
            </label>
          </div>
        </div>
        
        <!-- Légende -->
        <div class="legend">
          <h4>Légende</h4>
          <div class="legend-item">
            <span class="legend-marker nouveau">●</span>
            <span>Nouveau</span>
          </div>
          <div class="legend-item">
            <span class="legend-marker en-cours">●</span>
            <span>En cours</span>
          </div>
          <div class="legend-item">
            <span class="legend-marker termine">●</span>
            <span>Terminé</span>
          </div>
        </div>
      </div>
      
      <!-- Carte -->
      <div class="map-wrapper">
        <div id="map" class="map"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Données
const signalements = ref([
  {
    id: 1,
    latitude: -18.9148,
    longitude: 47.5317,
    adresse: 'Avenue de l\'Indépendance',
    statut: 'nouveau',
    surface: 15.5,
    budget: 2500,
    description: 'Nid de poule important'
  },
  {
    id: 2,
    latitude: -18.9088,
    longitude: 47.5239,
    adresse: 'Route Digue',
    statut: 'en_cours',
    surface: 8.2,
    budget: 1800,
    description: 'Fissures sur la chaussée'
  },
  {
    id: 3,
    latitude: -18.9228,
    longitude: 47.5364,
    adresse: 'Boulevard de l\'Europe',
    statut: 'termine',
    surface: 12.0,
    budget: 2200,
    description: 'Affaissement de la route'
  }
])

let map = null
let markersLayer = null

const showStatut = ref({
  nouveau: true,
  en_cours: true,
  termine: true
})

// Computed
const totalSignalements = computed(() => signalements.value.length)
const totalSurface = computed(() => 
  signalements.value.reduce((sum, s) => sum + s.surface, 0)
)
const totalBudget = computed(() => 
  signalements.value.reduce((sum, s) => sum + s.budget, 0)
)
const avancement = computed(() => {
  const termine = signalements.value.filter(s => s.statut === 'termine').length
  return totalSignalements.value > 0 
    ? Math.round((termine / totalSignalements.value) * 100) 
    : 0
})

const getCountByStatus = (status) => {
  return signalements.value.filter(s => s.statut === status).length
}

const getMarkerColor = (statut) => {
  switch(statut) {
    case 'nouveau': return '#e74c3c'
    case 'en_cours': return '#f39c12'
    case 'termine': return '#27ae60'
    default: return '#95a5a6'
  }
}

const updateMarkers = () => {
  if (!markersLayer) return
  
  markersLayer.clearLayers()
  
  signalements.value.forEach(signalement => {
    if (showStatut.value[signalement.statut]) {
      const marker = L.circleMarker([signalement.latitude, signalement.longitude], {
        radius: 10,
        fillColor: getMarkerColor(signalement.statut),
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      })
      
      const popupContent = `
        <div class="popup-content">
          <h4>Signalement #${signalement.id}</h4>
          <p><strong>Adresse:</strong> ${signalement.adresse}</p>
          <p><strong>Description:</strong> ${signalement.description}</p>
          <p><strong>Surface:</strong> ${signalement.surface} m²</p>
          <p><strong>Budget:</strong> ${signalement.budget}€</p>
          <p><strong>Statut:</strong> <span class="status-badge ${signalement.statut}">${getStatusLabel(signalement.statut)}</span></p>
        </div>
      `
      
      marker.bindPopup(popupContent)
      markersLayer.addLayer(marker)
    }
  })
}

const getStatusLabel = (statut) => {
  switch(statut) {
    case 'nouveau': return 'Nouveau'
    case 'en_cours': return 'En cours'
    case 'termine': return 'Terminé'
    default: return statut
  }
}

onMounted(() => {
  // Initialiser la carte
  map = L.map('map').setView([-18.9148, 47.5317], 13)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map)
  
  markersLayer = L.layerGroup().addTo(map)
  
  updateMarkers()
})
</script>

<style scoped>
.visitor-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ecf0f1;
}

.visitor-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3498db;
  padding: 15px 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-title {
  color: white;
  margin: 0;
  font-size: 20px;
}

.nav-btn {
  background-color: white;
  color: #3498db;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 500;
  transition: all 0.3s;
}

.nav-btn:hover {
  background-color: #2980b9;
  color: white;
}

.visitor-header {
  background-color: white;
  padding: 20px 30px;
  border-bottom: 1px solid #ddd;
}

.visitor-header h1 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 24px;
}

.visitor-header p {
  margin: 0;
  color: #7f8c8d;
}

.carte-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.side-panel {
  width: 340px;
  background-color: white;
  padding: 20px;
  overflow-y: auto;
  border-right: 1px solid #ddd;
}

.side-panel h3 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
}

.side-panel h4 {
  color: #34495e;
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.stat-item {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.stat-label {
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
}

.filters-section {
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-checkbox:hover {
  background-color: #f8f9fa;
}

.filter-checkbox input[type="checkbox"] {
  margin-right: 10px;
  cursor: pointer;
}

.checkbox-label {
  font-size: 14px;
  color: #2c3e50;
}

.filter-checkbox.nouveau input:checked ~ .checkbox-label {
  color: #e74c3c;
  font-weight: 500;
}

.filter-checkbox.en-cours input:checked ~ .checkbox-label {
  color: #f39c12;
  font-weight: 500;
}

.filter-checkbox.termine input:checked ~ .checkbox-label {
  color: #27ae60;
  font-weight: 500;
}

.legend {
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #2c3e50;
}

.legend-marker {
  font-size: 24px;
  margin-right: 10px;
  line-height: 1;
}

.legend-marker.nouveau {
  color: #e74c3c;
}

.legend-marker.en-cours {
  color: #f39c12;
}

.legend-marker.termine {
  color: #27ae60;
}

.map-wrapper {
  flex: 1;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

/* Styles pour les popups */
:deep(.leaflet-popup-content) {
  margin: 0;
  width: auto !important;
}

.popup-content {
  padding: 10px;
  min-width: 250px;
}

.popup-content h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 16px;
}

.popup-content p {
  margin: 5px 0;
  font-size: 13px;
  color: #34495e;
}

.status-badge {
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  color: white;
}

.status-badge.nouveau {
  background-color: #e74c3c;
}

.status-badge.en_cours {
  background-color: #f39c12;
}

.status-badge.termine {
  background-color: #27ae60;
}
</style>
