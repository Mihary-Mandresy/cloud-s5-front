import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import VisitorCarte from '../views/visitor/Carte.vue'
import Inscription from '@/views/Inscription.vue'
import MainView from '@/views/MainView.vue'
import Manager from '@/views/manager/Manager.vue'

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
    path: '/inscription',
    name: 'Inscription',
    component: Inscription
  },
  {
    path: '/visiteur',
    component: MainView,
    redirect: "/visiteur/carte",
    children: [
      { path : "carte", name: 'VisitorCarte', component: VisitorCarte }
    ]
  },
  {
    path: "/manager",
    component: MainView,
    children: [
      {path: "", name: "manager", component: Manager}
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
