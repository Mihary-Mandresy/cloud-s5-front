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
        <button class="btn-logout" @click="logout">Déconnexion</button>
      </nav>
      
      <!-- Header -->
      <header class="manager-header">
        <h1>{{ currentManagerPage === 'dashboard' ? 'Dashboard Manager' : 'Liste des Signalements' }}</h1>
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
                <div class="stat-value">-</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">En cours</div>
                <div class="stat-value">-</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Terminé</div>
                <div class="stat-value">-</div>
              </div>
            </div>
          </div>
          
          <div class="dashboard-card">
            <h3>Par budget</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">0-1000€</div>
                <div class="stat-value">-</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">1001-5000€</div>
                <div class="stat-value">-</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">5000€+</div>
                <div class="stat-value">-</div>
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
              <div class="notification-item">-</div>
              <div class="notification-item">-</div>
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
                <tr>
                  <td colspan="7" class="empty-table">Les données viendront de l'API</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Cartes -->
        <div class="cards-section" v-if="viewMode === 'cards'">
          <div class="cards-grid">
            <div class="signalement-card">
              <div class="card-header">
                <div class="card-id">ID: -</div>
                <div class="card-status">Statut: -</div>
              </div>
              <div class="card-content">
                <h4 class="card-title">Titre</h4>
                <p class="card-location">Localisation</p>
                <p class="card-budget">Budget: - €</p>
                <p class="card-date">Date: -</p>
              </div>
              <div class="card-actions">
                <select class="status-select">
                  <option>Nouveau</option>
                  <option>En cours</option>
                  <option>Terminé</option>
                </select>
                <button class="btn-update">Mettre à jour</button>
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
import { ref } from 'vue'

const selectedRole = ref('')
const userEmail = ref('')
const userPassword = ref('')
const managerEmail = ref('')
const managerPassword = ref('')
const isLoggedIn = ref(false)
const userRole = ref('')
const currentManagerPage = ref('dashboard')
const searchQuery = ref('')
const viewMode = ref('table')
const filterText = ref('')
const filterStatus = ref('')
const filterBudget = ref('')
const selectedStatusForUpdate = ref('nouveau')
const selectedSignalementId = ref(null)

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
  userEmail.value = ''
  userPassword.value = ''
  managerEmail.value = ''
  managerPassword.value = ''
  currentManagerPage.value = 'dashboard'
}

const syncFirebase = () => {
  console.log('Synchronisation Firebase')
}

const doSearch = () => {
  console.log('Recherche:', searchQuery.value)
}

const filterByStatus = (status) => {
  console.log('Filtre statut:', status)
}

const filterByBudget = (budget) => {
  console.log('Filtre budget:', budget)
}

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
  max-width: 1200px;
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

.empty-table {
  text-align: center;
  color: #7f8c8d;
  padding: 40px !important;
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

.status-select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.btn-update {
  padding: 8px 15px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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

.user-dashboard {
  max-width: 600px;
  margin: 50px auto;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}
</style>