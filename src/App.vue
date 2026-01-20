<script setup>
import { ref } from 'vue'

const selectedRole = ref('') // 'user' ou 'manager'
</script>

<template>
  <div class="login-container">
    <h1>Projet Cloud S5</h1>
    
    <!-- Sélection du rôle -->
    <div v-if="!selectedRole" class="role-selection">
      <h2>Choisissez votre rôle</h2>
      
      <div class="role-buttons">
        <button @click="selectedRole = 'user'" class="role-btn user-btn">
          👤 Utilisateur
        </button>
        
        <button @click="selectedRole = 'manager'" class="role-btn manager-btn">
          ⚙️ Manager
        </button>
      </div>
      
      <p class="hint">Sélectionnez votre type de compte pour vous connecter</p>
    </div>
    
    <!-- Formulaire de connexion -->
    <div v-else class="login-form">
      <h2 v-if="selectedRole === 'user'">Connexion Utilisateur</h2>
      <h2 v-else>Connexion Manager</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input type="email" placeholder="email@exemple.com" required />
        </div>
        
        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" placeholder="Votre mot de passe" required />
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn-login">
            {{ selectedRole === 'user' ? 'Se connecter' : 'Connexion Manager' }}
          </button>
          
          <button type="button" @click="selectedRole = ''" class="btn-back">
            ← Retour
          </button>
        </div>
        
        <div v-if="selectedRole === 'user'" class="register-link">
          Pas de compte ? <a href="#">S'inscrire</a>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
}

.role-selection h2 {
  margin-bottom: 30px;
}

.role-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.role-btn {
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.role-btn:hover {
  transform: translateY(-2px);
}

.user-btn {
  background-color: #3498db;
  color: white;
}

.manager-btn {
  background-color: #2c3e50;
  color: white;
}

.hint {
  color: #666;
  font-size: 14px;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin: 25px 0;
}

.btn-login {
  flex: 1;
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.btn-back {
  padding: 12px 20px;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}

.register-link a {
  color: #3498db;
  text-decoration: none;
}
</style>