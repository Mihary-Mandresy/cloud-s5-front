import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import ManagerDashboard from '../views/manager/Dashboard.vue'
import SignalementsList from '../views/manager/SignalementsList.vue'
import SignalementDetails from '../views/manager/SignalementDetails.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/manager',
    name: 'Manager',
    redirect: '/manager/dashboard',
    meta: { requiresAuth: true, role: 'manager' }
  },
  {
    path: '/manager/dashboard',
    name: 'ManagerDashboard',
    component: ManagerDashboard,
    meta: { requiresAuth: true, role: 'manager' }
  },
  {
    path: '/manager/signalements',
    name: 'SignalementsList',
    component: SignalementsList,
    meta: { requiresAuth: true, role: 'manager' }
  },
  {
    path: '/manager/signalements/:id',
    name: 'SignalementDetails',
    component: SignalementDetails,
    meta: { requiresAuth: true, role: 'manager' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navigation pour vérifier l'authentification
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')
  
  if (to.meta.requiresAuth) {
    if (!token) {
      next('/login')
    } else if (to.meta.role && to.meta.role !== userRole) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
