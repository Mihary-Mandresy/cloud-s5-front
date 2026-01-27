<template>
  <div class="manager-container">
    <!-- Navigation -->
    <nav class="manager-nav">
      <router-link to="/manager/dashboard" class="nav-btn">Dashboard</router-link>
      <router-link to="/manager/signalements" class="nav-btn">Liste Signalements</router-link>
      <router-link to="/manager/carte" class="nav-btn">Carte</router-link>
      <span class="nav-btn active">Détails</span>
      <button class="btn-logout" @click="logout">Déconnexion</button>
    </nav>
    
    <!-- Header -->
    <header class="manager-header">
      <h1 v-if="signalement">Détails du Signalement #{{ signalement.id }}</h1>
      <p>Connecté : {{ userEmail }}</p>
    </header>
    
    <!-- PAGE DÉTAILS -->
    <div class="details-page" v-if="signalement">
      <!-- Bouton retour -->
      <div class="details-header-actions">
        <button class="btn-back" @click="goBackToList">
          ← Retour à la liste
        </button>
        <div class="details-sync-section">
          <button 
            class="btn-sync" 
            @click="syncCurrentSignalement"
            :disabled="syncStatus === 'loading'"
          >
            <span v-if="syncStatus === 'loading'">⏳ Synchronisation...</span>
            <span v-else>🔄 Synchroniser ce signalement</span>
          </button>
          <div class="sync-feedback" v-if="syncFeedback">
            <span :class="['sync-feedback-text', syncStatus]">
              {{ syncFeedback }}
            </span>
          </div>
        </div>
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
                <p class="info-value">{{ signalement.titre }}</p>
              </div>
              <div class="info-item">
                <label>Description</label>
                <p class="info-value description">{{ signalement.description }}</p>
              </div>
              <div class="info-item">
                <label>Localisation</label>
                <p class="info-value">{{ signalement.localisation }}</p>
              </div>
              <div class="info-item">
                <label>Date de création</label>
                <p class="info-value">{{ formatDate(signalement.date) }}</p>
              </div>
              <div class="info-item">
                <label>Dernière mise à jour</label>
                <p class="info-value">{{ formatDate(signalement.updatedAt) }}</p>
              </div>
              <div class="info-item">
                <label>Statut actuel</label>
                <div class="status-action">
                  <span :class="['status-badge', signalement.statut]">
                    {{ getStatusText(signalement.statut) }}
                  </span>
                  <select v-model="newStatus">
                    <option value="nouveau">Nouveau</option>
                    <option value="en_cours">En cours</option>
                    <option value="termine">Terminé</option>
                  </select>
                  <button class="btn-update-status" @click="updateStatus">
                    Mettre à jour
                  </button>
                </div>
              </div>
              <div class="info-item">
                <label>Budget</label>
                <span :class="['budget-badge', signalement.budget]">
                  {{ getBudgetText(signalement.budget) }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Historique et suivi -->
          <div class="details-card">
            <h3>Historique et suivi</h3>
            <div class="timeline">
              <div v-for="(event, index) in signalement.historique" :key="index" class="timeline-item">
                <div class="timeline-date">{{ formatDate(event.date) }}</div>
                <div class="timeline-content">
                  <h4>{{ event.action }}</h4>
                  <p v-if="event.description">{{ event.description }}</p>
                  <div v-if="event.utilisateur">
                    <small>Par: {{ event.utilisateur }}</small>
                  </div>
                </div>
              </div>
              <div v-if="!signalement.historique || signalement.historique.length === 0">
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
              <div v-for="(file, index) in signalement.piecesJointes" :key="index" class="attachment-item">
                <div class="file-icon">📎</div>
                <div class="file-info">
                  <div class="file-name">{{ file.nom }}</div>
                  <div class="file-size">{{ file.taille }}</div>
                </div>
                <button class="btn-download" @click="downloadFile(file)">
                  Télécharger
                </button>
              </div>
              <div v-if="!signalement.piecesJointes || signalement.piecesJointes.length === 0">
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
                class="btn-quick-status nouveau" 
                :class="{ active: signalement.statut === 'nouveau' }"
                @click="setQuickStatus('nouveau')"
              >
                Nouveau
              </button>
              <button 
                class="btn-quick-status en_cours" 
                :class="{ active: signalement.statut === 'en_cours' }"
                @click="setQuickStatus('en_cours')"
              >
                En cours
              </button>
              <button 
                class="btn-quick-status termine" 
                :class="{ active: signalement.statut === 'termine' }"
                @click="setQuickStatus('termine')"
              >
                Terminé
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="loading">
      <p>Chargement du signalement...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const userEmail = computed(() => localStorage.getItem('userEmail') || '')
const signalement = ref(null)
const newStatus = ref('')
const syncStatus = ref('idle')
const syncFeedback = ref('')

// Données mock (TODO: remplacer par API)
const mockSignalements = [
  {
    id: 1,
    titre: "Nid de poule sur la route principale",
    localisation: "123 Rue Principale, Paris",
    description: "Grand nid de poule causant des problèmes de circulation. Nécessite une réparation urgente.",
    statut: "nouveau",
    budget: "moyen",
    date: "2024-01-15",
    updatedAt: "2024-01-20",
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
]

onMounted(() => {
  loadSignalement()
})

const loadSignalement = () => {
  const id = parseInt(route.params.id)
  // TODO: Remplacer par appel API
  signalement.value = mockSignalements.find(s => s.id === id)
  if (signalement.value) {
    newStatus.value = signalement.value.statut
  }
}

const logout = () => {
  localStorage.clear()
  router.push('/')
}

const goBackToList = () => {
  router.push('/manager/signalements')
}

const syncCurrentSignalement = async () => {
  syncStatus.value = 'loading'
  syncFeedback.value = 'Synchronisation avec Firebase...'
  
  // TODO: Remplacer par vrai appel API
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  syncStatus.value = 'success'
  syncFeedback.value = 'Signalement synchronisé avec succès!'
  
  setTimeout(() => {
    syncStatus.value = 'idle'
    syncFeedback.value = ''
  }, 3000)
}

const updateStatus = () => {
  if (newStatus.value !== signalement.value.statut) {
    // TODO: Appel API
    signalement.value.historique.push({
      date: new Date().toISOString().split('T')[0],
      action: 'Statut modifié',
      utilisateur: userEmail.value,
      description: `Changement de ${getStatusText(signalement.value.statut)} à ${getStatusText(newStatus.value)}`
    })
    
    signalement.value.statut = newStatus.value
    signalement.value.updatedAt = new Date().toISOString().split('T')[0]
  }
}

const setQuickStatus = (status) => {
  newStatus.value = status
  updateStatus()
}

const downloadFile = (file) => {
  console.log('Téléchargement:', file.nom)
  // TODO: implémenter le téléchargement
}

const editSignalement = () => {
  console.log('Modification du signalement')
  // TODO: ouvrir un modal ou rediriger vers formulaire d'édition
}

const assignSignalement = () => {
  console.log('Assignation à un agent')
  // TODO: ouvrir un modal de sélection d'agent
}

const addComment = () => {
  const comment = prompt('Ajouter un commentaire:')
  if (comment) {
    signalement.value.historique.push({
      date: new Date().toISOString().split('T')[0],
      action: 'Commentaire ajouté',
      utilisateur: userEmail.value,
      description: comment
    })
    signalement.value.updatedAt = new Date().toISOString().split('T')[0]
  }
}

const exportSignalement = () => {
  console.log('Export PDF')
  // TODO: générer et télécharger le PDF
}

const deleteSignalement = () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce signalement ?')) {
    // TODO: appel API de suppression
    router.push('/manager/signalements')
  }
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
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.btn-back {
  padding: 12px 20px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-sync {
  padding: 12px 20px;
  background: #9b59b6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-sync:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sync-feedback {
  margin-top: 10px;
}

.sync-feedback-text.success {
  color: #27ae60;
  font-weight: bold;
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

.status-action select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.btn-update-status {
  padding: 8px 16px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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

.loading {
  text-align: center;
  padding: 50px;
  color: #7f8c8d;
}

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
  .details-header-actions {
    flex-direction: column;
    align-items: stretch;
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
