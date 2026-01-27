<template>
  <div class="manager-container">
    <!-- Navigation -->
    <nav class="manager-nav">
      <router-link to="/manager/dashboard" class="nav-btn">Dashboard</router-link>
      <router-link to="/manager/signalements" class="nav-btn">Liste Signalements</router-link>
      <router-link to="/manager/carte" class="nav-btn" active-class="active">Carte</router-link>
      <button class="btn-logout" @click="logout">Déconnexion</button>
    </nav>
    
    <!-- Header -->
    <header class="manager-header">
      <h1>Carte des Signalements - Antananarivo</h1>
      <p>Connecté : {{ userEmail }}</p>
    </header>
    
    <!-- Contenu carte -->
    <div class="carte-container">
      <!-- Tableau de récapitulation -->
      <div class="recap-panel">
        <h3>📊 Tableau de récapitulation</h3>
        <div class="recap-stats">
          <div class="recap-item">
            <div class="recap-label">Nombre de signalements</div>
            <div class="recap-value">{{ totalSignalements }}</div>
          </div>
          <div class="recap-item">
            <div class="recap-label">Surface totale (m²)</div>
            <div class="recap-value">{{ totalSurface.toFixed(2) }}</div>
          </div>
          <div class="recap-item">
            <div class="recap-label">Avancement</div>
            <div class="recap-value">{{ avancement }}%</div>
          </div>
          <div class="recap-item">
            <div class="recap-label">Budget total</div>
            <div class="recap-value">{{ totalBudget.toLocaleString() }}€</div>
          </div>
        </div>
        
        <!-- Filtres -->
        <div class="map-filters">
          <h4>Filtres</h4>
          <div class="filter-group">
            <label>
              <input type="checkbox" v-model="showStatut.nouveau" @change="updateMarkers" />
              Nouveau ({{ getCountByStatus('nouveau') }})
            </label>
            <label>
              <input type="checkbox" v-model="showStatut.en_cours" @change="updateMarkers" />
              En cours ({{ getCountByStatus('en_cours') }})
            </label>
            <label>
              <input type="checkbox" v-model="showStatut.termine" @change="updateMarkers" />
              Terminé ({{ getCountByStatus('termine') }})
            </label>
          </div>
        </div>
      </div>
      
      <!-- Carte Leaflet -->
      <div id="map" ref="mapContainer"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const mapContainer = ref(null)
let map = null
const markers = ref([])

const userEmail = computed(() => localStorage.getItem('userEmail') || '')

// État des filtres
const showStatut = ref({
  nouveau: true,
  en_cours: true,
  termine: true
})

// Données mock des signalements avec coordonnées GPS
// TODO: Remplacer par appel API
const signalements = ref([
  {
    id: 1,
    titre: "Nid de poule sur la route principale",
    localisation: "Rue Rainitovo, Antananarivo",
    description: "Grand nid de poule causant des problèmes de circulation",
    statut: "nouveau",
    budget: 1500,
    surface: 12.5,
    entreprise: "Travaux Publics SARL",
    date: "2024-01-15",
    lat: -18.8792,
    lng: 47.5079
  },
  {
    id: 2,
    titre: "Éclairage public défectueux",
    localisation: "Avenue de l'Indépendance",
    description: "Lampe publique hors service",
    statut: "en_cours",
    budget: 800,
    surface: 5.0,
    entreprise: "Électricité Générale",
    date: "2024-01-10",
    lat: -18.8850,
    lng: 47.5150
  },
  {
    id: 3,
    titre: "Graffiti sur mur public",
    localisation: "Place de l'Indépendance",
    description: "Graffiti sur façade de bâtiment municipal",
    statut: "termine",
    budget: 5200,
    surface: 25.0,
    entreprise: "Nettoyage Pro",
    date: "2024-01-05",
    lat: -18.8750,
    lng: 47.5200
  },
  {
    id: 4,
    titre: "Fissures dans le trottoir",
    localisation: "Boulevard Ranavalona III",
    description: "Fissures dangereuses pour les piétons",
    statut: "nouveau",
    budget: 2100,
    surface: 18.3,
    entreprise: "BTP Madagascar",
    date: "2024-01-18",
    lat: -18.8700,
    lng: 47.5100
  },
  {
    id: 5,
    titre: "Panneau de signalisation tombé",
    localisation: "Carrefour Ankorondrano",
    description: "Panneau stop au sol",
    statut: "en_cours",
    budget: 950,
    surface: 3.0,
    entreprise: "Signalisation Routière",
    date: "2024-01-12",
    lat: -18.8900,
    lng: 47.5250
  }
])

// Computed - Statistiques
const totalSignalements = computed(() => signalements.value.length)

const totalSurface = computed(() => {
  return signalements.value.reduce((sum, s) => sum + s.surface, 0)
})

const totalBudget = computed(() => {
  return signalements.value.reduce((sum, s) => sum + s.budget, 0)
})

const avancement = computed(() => {
  const termine = signalements.value.filter(s => s.statut === 'termine').length
  return totalSignalements.value > 0 
    ? Math.round((termine / totalSignalements.value) * 100) 
    : 0
})

const getCountByStatus = (status) => {
  return signalements.value.filter(s => s.statut === status).length
}

const logout = () => {
  localStorage.clear()
  router.push('/')
}

// Initialisation de la carte
onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})

const initMap = () => {
  // Créer la carte centrée sur Antananarivo
  map = L.map(mapContainer.value).setView([-18.8792, 47.5079], 13)
  
  // Essayer le serveur local d'abord, fallback sur OpenStreetMap
  const localTileUrl = 'http://localhost:3000/tiles/{z}/{x}/{y}.png'
  const fallbackTileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
  
  // Ajouter les tuiles
  const tileLayer = L.tileLayer(localTileUrl, {
    attribution: '© OpenStreetMap contributors | Tuiles locales Antananarivo',
    maxZoom: 18,
    minZoom: 10,
    crossOrigin: true
  })
  
  // Si les tuiles locales ne chargent pas, utiliser OpenStreetMap public
  tileLayer.on('tileerror', () => {
    console.warn('❌ Tuiles locales indisponibles, fallback sur OpenStreetMap')
    map.removeLayer(tileLayer)
    L.tileLayer(fallbackTileUrl, {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 1
    }).addTo(map)
  })
  
  tileLayer.addTo(map)
  
  console.log('✓ Carte initialisée avec URL:', localTileUrl)
  
  // Ajouter les marqueurs
  addMarkers()
}

const addMarkers = () => {
  signalements.value.forEach(signalement => {
    addMarker(signalement)
  })
}

const addMarker = (signalement) => {
  // Icône personnalisée selon le statut
  const icon = L.divIcon({
    className: `custom-marker ${signalement.statut}`,
    html: `<div class="marker-pin ${signalement.statut}">
             <span>${getMarkerIcon(signalement.statut)}</span>
           </div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42]
  })
  
  const marker = L.marker([signalement.lat, signalement.lng], { icon })
    .addTo(map)
  
  // Popup avec infos détaillées
  const popupContent = `
    <div class="marker-popup">
      <h4>${signalement.titre}</h4>
      <p><strong>📍</strong> ${signalement.localisation}</p>
      <p><strong>📅</strong> ${formatDate(signalement.date)}</p>
      <p><strong>📊</strong> Statut: <span class="status-badge ${signalement.statut}">${getStatusText(signalement.statut)}</span></p>
      <p><strong>📐</strong> Surface: ${signalement.surface} m²</p>
      <p><strong>💰</strong> Budget: ${signalement.budget.toLocaleString()}€</p>
      <p><strong>🏢</strong> ${signalement.entreprise}</p>
      <button class="btn-details" onclick="window.location.href='#/manager/signalements/${signalement.id}'">
        Voir détails
      </button>
    </div>
  `
  
  marker.bindPopup(popupContent)
  marker.signalementData = signalement
  markers.value.push(marker)
}

const updateMarkers = () => {
  markers.value.forEach(marker => {
    const signalement = marker.signalementData
    const shouldShow = showStatut.value[signalement.statut]
    
    if (shouldShow) {
      if (!map.hasLayer(marker)) {
        marker.addTo(map)
      }
    } else {
      map.removeLayer(marker)
    }
  })
}

const getMarkerIcon = (statut) => {
  const icons = {
    'nouveau': '🆕',
    'en_cours': '🔧',
    'termine': '✅'
  }
  return icons[statut] || '📍'
}

const getStatusText = (status) => {
  const statusMap = {
    'nouveau': 'Nouveau',
    'en_cours': 'En cours',
    'termine': 'Terminé'
  }
  return statusMap[status] || status
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}
</script>

<style scoped>
.manager-container {
  max-width: 1600px;
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
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.manager-header h1 {
  color: #2c3e50;
  margin-bottom: 5px;
}

.carte-container {
  position: relative;
  height: calc(100vh - 250px);
  display: flex;
  gap: 20px;
}

.recap-panel {
  width: 350px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow-y: auto;
}

.recap-panel h3 {
  margin-bottom: 20px;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

.recap-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.recap-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.recap-label {
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 5px;
}

.recap-value {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.map-filters h4 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 5px;
  transition: background 0.2s;
}

.filter-group label:hover {
  background: #f8f9fa;
}

.filter-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

#map {
  flex: 1;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1;
}

/* Styles pour les marqueurs personnalisés */
:deep(.custom-marker) {
  background: transparent;
  border: none;
}

:deep(.marker-pin) {
  width: 30px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

:deep(.marker-pin.nouveau) {
  filter: drop-shadow(0 2px 4px rgba(255, 193, 7, 0.5));
}

:deep(.marker-pin.en_cours) {
  filter: drop-shadow(0 2px 4px rgba(33, 150, 243, 0.5));
}

:deep(.marker-pin.termine) {
  filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.5));
}

/* Styles pour les popups */
:deep(.marker-popup) {
  min-width: 280px;
}

:deep(.marker-popup h4) {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 16px;
}

:deep(.marker-popup p) {
  margin: 8px 0;
  font-size: 14px;
  color: #555;
}

:deep(.status-badge) {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
}

:deep(.status-badge.nouveau) {
  background-color: #ffeb3b;
  color: #333;
}

:deep(.status-badge.en_cours) {
  background-color: #2196f3;
  color: white;
}

:deep(.status-badge.termine) {
  background-color: #4caf50;
  color: white;
}

:deep(.btn-details) {
  width: 100%;
  margin-top: 12px;
  padding: 10px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

:deep(.btn-details:hover) {
  background: #2980b9;
}

/* Responsive */
@media (max-width: 1024px) {
  .carte-container {
    flex-direction: column;
    height: auto;
  }
  
  .recap-panel {
    width: 100%;
  }
  
  #map {
    height: 500px;
  }
}
</style>
