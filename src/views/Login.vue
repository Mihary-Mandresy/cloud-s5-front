<template>
  <div class="login-container">
    <h2>Login {{ roleText }}</h2>
    <div class="form-group">
      <label>Email :</label>
      <input v-model="email" type="email" @keyup.enter="login" />
    </div>
    <div class="form-group">
      <label>Mot de passe :</label>
      <input v-model="password" type="password" @keyup.enter="login" />
    </div>
    <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
    <div class="form-actions">
      <button class="btn-login" @click="login">Se connecter</button>
      <button class="btn-back" @click="goBack">Retour</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const selectedRole = ref('user')

const roleText = computed(() => {
  return selectedRole.value === 'manager' ? 'Manager' : 'Utilisateur'
})

onMounted(() => {
  selectedRole.value = route.query.role || 'user'
  // Pré-remplir pour la démo (à retirer en production)
  if (selectedRole.value === 'manager') {
    email.value = 'admin@example.com'
    password.value = 'admin123'
  } else {
    email.value = 'user@example.com'
    password.value = 'user123'
  }
})

const login = async () => {
  errorMessage.value = ''
  
  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    return
  }

  // TODO: Remplacer par un vrai appel API
  // const response = await fetch('/api/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email: email.value, password: password.value })
  // })
  
  // Simulation pour l'instant
  try {
    // Mock authentication
    const mockToken = 'mock-jwt-token-' + Date.now()
    localStorage.setItem('token', mockToken)
    localStorage.setItem('userEmail', email.value)
    localStorage.setItem('userRole', selectedRole.value)
    localStorage.setItem('tokenExpiration', Date.now() + 3600000) // 1 heure
    
    // Redirection selon le rôle
    if (selectedRole.value === 'manager') {
      router.push('/manager/dashboard')
    } else {
      router.push('/') // TODO: route utilisateur
    }
  } catch (error) {
    errorMessage.value = 'Erreur de connexion'
  }
}

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
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

.error-message {
  color: #e74c3c;
  margin-bottom: 15px;
  padding: 10px;
  background: #fde8e8;
  border-radius: 5px;
  text-align: center;
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

.btn-login:hover {
  background: #27ae60;
}

.btn-back:hover {
  background: #7f8c8d;
}
</style>
