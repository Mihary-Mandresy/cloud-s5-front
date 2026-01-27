<template>
  <div class="role-selection">
    <h1>Projet Cloud S5</h1>
    <p class="subtitle">Application de signalement routier</p>
    <h2>Choisissez votre rôle</h2>
    <div class="role-buttons">
      <button class="btn-user" @click="selectUser">Utilisateur</button>
      <button class="btn-manager" @click="selectManager">Manager</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const selectUser = () => {
  router.push({ name: 'Login', query: { role: 'user' } })
}

const selectManager = () => {
  router.push({ name: 'Login', query: { role: 'manager' } })
}
</script>

<style scoped>
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
</style>
