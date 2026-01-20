<template>
  <div>
    <h1>Projet Cloud S5</h1>
    <p>Application de signalement routier</p>
    
    <!-- Écran 1 : Choix du rôle -->
    <div v-if="!selectedRole">
      <h2>Choisissez votre rôle</h2>
      <button @click="selectUser">Utilisateur</button>
      <button @click="selectManager">Manager</button>
    </div>
    
    <!-- Écran 2 : Login Utilisateur -->
    <div v-if="selectedRole === 'user'">
      <h2>Login Utilisateur</h2>
      <div>
        <div>
          <label>Email :</label>
          <input v-model="userEmail" type="text" />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input v-model="userPassword" type="password" />
        </div>
        <button @click="loginUser">Se connecter</button>
        <button @click="goBack">Retour</button>
      </div>
    </div>
    
    <!-- Écran 3 : Login Manager -->
    <div v-if="selectedRole === 'manager'">
      <h2>Login Manager</h2>
      <div>
        <div>
          <label>Email :</label>
          <input v-model="managerEmail" type="text" />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input v-model="managerPassword" type="password" />
        </div>
        <button @click="loginManager">Se connecter</button>
        <button @click="goBack">Retour</button>
      </div>
    </div>
    
    <!-- Écran 4 : Dashboard Manager (après connexion) -->
    <div v-if="isLoggedIn && userRole === 'manager'">
      <h2>Bienvenue Manager !</h2>
      <p>Email connecté : {{ managerEmail }}</p>
      <p>Mot de passe saisi : {{ managerPassword }}</p>
      <button @click="logout">Déconnexion</button>
    </div>
    
    <!-- Écran 5 : Dashboard Utilisateur (après connexion) -->
    <div v-if="isLoggedIn && userRole === 'user'">
      <h2>Bienvenue Utilisateur !</h2>
      <p>Email connecté : {{ userEmail }}</p>
      <p>Mot de passe saisi : {{ userPassword }}</p>
      <button @click="logout">Déconnexion</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Variables pour le choix du rôle
const selectedRole = ref('')

// Variables pour les identifiants Utilisateur
const userEmail = ref('')
const userPassword = ref('')

// Variables pour les identifiants Manager
const managerEmail = ref('')
const managerPassword = ref('')

// Variables pour l'état de connexion
const isLoggedIn = ref(false)
const userRole = ref('')

// Méthodes
const selectUser = () => {
  selectedRole.value = 'user'
  // Pré-remplir avec des identifiants de test
  userEmail.value = 'user@example.com'
  userPassword.value = 'user123'
}

const selectManager = () => {
  selectedRole.value = 'manager'
  // Pré-remplir avec des identifiants de test
  managerEmail.value = 'admin@example.com'
  managerPassword.value = 'admin123'
}

const goBack = () => {
  selectedRole.value = ''
  userEmail.value = ''
  userPassword.value = ''
  managerEmail.value = ''
  managerPassword.value = ''
}

const loginUser = () => {
  // Ici, tu récupères les valeurs
  console.log('Email utilisateur:', userEmail.value)
  console.log('Mot de passe utilisateur:', userPassword.value)
  
  // Pour l'instant, on simule une connexion réussie
  isLoggedIn.value = true
  userRole.value = 'user'
  
  // Dans la vraie app, tu enverrais ces données à ton API Laravel
  alert(`Connexion utilisateur réussie!\nEmail: ${userEmail.value}\nMot de passe: ${userPassword.value}`)
}

const loginManager = () => {
  // Ici, tu récupères les valeurs
  console.log('Email manager:', managerEmail.value)
  console.log('Mot de passe manager:', managerPassword.value)
  
  // Pour l'instant, on simule une connexion réussie
  isLoggedIn.value = true
  userRole.value = 'manager'
  
  // Dans la vraie app, tu enverrais ces données à ton API Laravel
  alert(`Connexion manager réussie!\nEmail: ${managerEmail.value}\nMot de passe: ${managerPassword.value}`)
}

const logout = () => {
  isLoggedIn.value = false
  userRole.value = ''
  selectedRole.value = ''
  userEmail.value = ''
  userPassword.value = ''
  managerEmail.value = ''
  managerPassword.value = ''
}
</script>

<style>
/* Toujours pas de CSS */
</style>