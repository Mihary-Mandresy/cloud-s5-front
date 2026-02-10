<template>
    <div class="login flex min-h-screen">
        <div class="img w-1/2"></div>
        <div class="form-parent grid place-items-center w-1/2">
            <div class="form-card p-4 rounded-2xl">
                <div class="title">
                    <h1 class="text-5xl text-center">Inscription</h1>
                </div>

                <form @submit.prevent="register" class="form">

                    <div class="form-group">
                        <span class="libelle">Nom</span>
                        <label for="nom">
                            <Icon width="20" icon="mdi:account-circle" />
                        </label>
                        <input v-model="nom"  type="text" id="nom" >
                    </div>
                    <div class="form-group">
                        <span class="libelle">Email</span>
                        <label for="dtn">
                            <Icon width="20" icon="mdi:email" />
                        </label>
                        <input v-model="email" type="email" id="dtn">
                    </div>
                    <div class="form-group">
                        <span class="libelle">Mot de passe</span>
                        <label for="pwd">
                            <Icon width="20" icon="mdi:password" />
                        </label>
                        <input v-model="mot_de_passe" placeholder="6 characteres au mois" type="text" id="pwd">
                    </div>
                    
                    <div class="error" v-if="errorMessage">
                        <p class="text-center  text-red-500">
                            {{ errorMessage }}
                        </p>
                    </div>

                    <button class="bg-amber-600 btn btn-log">S'inscrire</button>

                    <div class="meta">
                        <span class="text-center ins">Avez vous déjà
                            un compte? <RouterLink to="/">Se connecter</RouterLink></span>
                        <div class="ou">
                            <hr>
                            <span>ou</span>
                        </div>

                        <div class="social grid grid-cols-4 place-items-center">
                            <RouterLink>
                                <Icon width="20" icon="mdi:google" />
                            </RouterLink>
                            <RouterLink>
                                <Icon width="20" icon="mdi:whatsapp" />
                            </RouterLink>
                            <RouterLink>
                                <Icon width="20" icon="mdi:facebook" />
                            </RouterLink>
                            <RouterLink>
                                <Icon width="20" icon="mdi:instagram" />
                            </RouterLink>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>


<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { host } from '../config.js'

const router = useRouter()

// Données du formulaire
const nom = ref('')
const email = ref('')
const mot_de_passe = ref('')

// États
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const fieldErrors = ref({})
const passwordError = ref('')

// Calculer la date maximale (au moins 18 ans)
const maxDate = computed(() => {
  const today = new Date()
  const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  return minAgeDate.toISOString().split('T')[0]
})

// Validation des mots de passe
const validatePasswords = () => {
  if (mot_de_passe.value !== password_confirmation.value) {
    passwordError.value = 'Les mots de passe ne correspondent pas'
    return false
  }
  
  if (mot_de_passe.value.length < 6) {
    passwordError.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return false
  }
  
  passwordError.value = ''
  return true
}

// Fonction d'inscription
const register = async () => {
  // Réinitialiser les messages
  errorMessage.value = ''
  successMessage.value = ''
  fieldErrors.value = {}
  

  
  loading.value = true
  
  try {
    // Préparer les données pour l'API
    const formData = {
      email: email.value,
      mot_de_passe: mot_de_passe.value,
      nom: nom.value,
    }
    
    const response = await fetch(host.url.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    
    const data = await response.json()
    
    if (data.success) {
      // Succès de l'inscription
      successMessage.value = data.message || 'Inscription réussie !'
      
      // Stocker le token et les informations utilisateur
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('login_time', Date.now())
        sessionStorage.setItem('auth_token', data.token)
      }
      
      // Redirection après un court délai
      setTimeout(() => {
          router.push('/manager')
        
      }, 1500)
      
    } else {
      // Gestion des erreurs de validation
      if (data.errors) {
        fieldErrors.value = data.errors
        errorMessage.value = 'Veuillez corriger les erreurs dans le formulaire'
      } else if (data.message) {
        errorMessage.value = data.message
      } else {
        errorMessage.value = 'Une erreur est survenue lors de l\'inscription'
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    errorMessage.value = 'Erreur de connexion au serveur. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>