<template>
  <!-- <div class="login-container">
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
  </div> -->

  <div class="login flex min-h-screen">
    <div class="img w-1/2"></div>
    <div class="form-parent grid place-items-center w-1/2">
      <div class="form-card p-4 rounded-2xl">
        <div class="title">
          <h1 class="text-5xl text-center">Connexion</h1>
        </div>

        <form @submit.prevent="login" class="form">
          <div class="form-group">
            <span class="libelle">Email</span>
            <label for="mail">
              <Icon width="20" icon="mdi:email" />
            </label>
            <input v-model="email" type="mail" id="mail" >
          </div>
          <div class="form-group">
            <span class="libelle">Mot de passe</span>
            <label for="pwd">
              <Icon width="20" icon="mdi:password" />
            </label>
            <input v-model="password"  type="mail" id="pwd" @keyup.enter="login">
          </div>

          <div v-if="errorMessage" class="error">
            <p class="text-center  text-red-500">
             {{ errorMessage }}
            </p>
          </div>


          <button class="bg-amber-600 btn btn-log">Se connecter</button>

          <div class="meta">
            <span class="text-center ins">Avez vous déjà
              un compte? <RouterLink to="/inscription">S'inscrire</RouterLink></span>
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

          <RouterLink to="/visiteur" class="btn bg-gray-200 view">
            <Icon icon="mdi:eye" />
            En tant que Visiteur
          </RouterLink>
        </form>
      </div>
    </div>
  </div>

</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { host } from '../config.js' // Assurez-vous que le chemin est correct

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

onMounted(() => {
  // Optionnel: Pré-remplir pour les tests (à retirer en production)
  // email.value = 'test@example.com'
  // password.value = 'password123'
})

const login = async () => {
  errorMessage.value = ''
  
  // Validation des champs
  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    return
  }

  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Veuillez entrer un email valide'
    return
  }

  loading.value = true

  try {
    const response = await fetch(host.url.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (data.success) {
      // Stockage du token et des informations utilisateur
      localStorage.setItem('token', data.token)
      localStorage.setItem('token_type', data.token_type)
      localStorage.setItem('token_expires_in', data.expires_in)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('login_time', Date.now())
      
      // Stockage du token pour les futures requêtes API
      sessionStorage.setItem('auth_token', data.token)
      
      // Redirection vers la page d'accueil
      router.push('/manager')
    } else {
      errorMessage.value = data.message || 'Identifiants incorrects'
    }
  } catch (error) {
    console.error('Erreur de connexion:', error)
    errorMessage.value = 'Erreur de connexion au serveur. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}

const goToHome = () => {
  router.push('/home')
}
</script>

<style lang="scss">
.login {


  .img {
    background-image: url("/images/trakter.jpg");
    background-repeat: no-repeat;
    background-position: -350px 0px;
    background-size: 150%;
  }

  .form {

    display: flex;
    align-items: stretch;
    flex-direction: column;
    gap: 24px;

    .error {
      font-size: 15px;
    }

    .btn {
      align-self: center;
      min-width: 200px;
      width: 200px;


      &-log {
        color: white;
      }

      &.view {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 18px;
        min-width: 300px;
        width: 300px;
      }

    }

    .meta {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 16px;

      span.ins {
        font-size: 13px;

        a {
          color: royalblue;
          text-decoration: underline;
        }
      }

      .ou {
        display: inherit;
        position: relative;
        padding: 20px 0;

        hr {
          width: 100%;
        }

        span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          padding: 0 10px;
        }

      }
    }

    &-card {
      padding: 20px;
      max-width: 500px;

      .title {
        padding: 40px 0;
      }

    }

    &-group {
      position: relative;
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 15px 10px;
      border: 1px solid;
      border-radius: 10px;

      .libelle {
        position: absolute;
        top: 0;
        transform: translateY(-50%);
        background-color: white;
        padding: 0 10px;
        font-size: 14px;
      }

      input {
        border: 0px;
        outline: none;
        padding: 0 20px;
        min-width: 400px;
        padding-bottom: 4px;
        border-bottom: 1px solid black;
        margin-top: 10px;

        // &[type="date"] {

        // }
      }
    }
  }
}
</style>
