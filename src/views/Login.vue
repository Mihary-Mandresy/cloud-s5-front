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

        <form @submit.prevent="" class="form">
          <div class="form-group">
            <span class="libelle">Email</span>
            <label for="mail">
              <Icon width="20" icon="mdi:email" />
            </label>
            <input type="mail" id="mail">
          </div>
          <div class="form-group">
            <span class="libelle">Mot de passe</span>
            <label for="pwd">
              <Icon width="20" icon="mdi:password" />
            </label>
            <input type="mail" id="pwd">
          </div>

          <div class="error">
            <p class="text-center  text-red-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae similique ipsum consequuntur impedit sed?
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

          <button class="btn bg-gray-200 view">
            <Icon icon="mdi:eye" />
            En tant que Visiteur
          </button>
        </form>
      </div>
    </div>
  </div>

</template>

<script setup>
import { Icon } from '@iconify/vue'
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
