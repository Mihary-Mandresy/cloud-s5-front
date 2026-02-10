import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import VisitorCarte from '../views/visitor/Carte.vue'
import Inscription from '@/views/Inscription.vue'
import MainView from '@/views/MainView.vue'
import Manager from '@/views/manager/Manager.vue'
import UserBlock from '@/views/manager/UserBlock.vue'
import ModifSignalement from '@/views/manager/ModifSignalement.vue'

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
      {path: "", name: "manager", component: Manager},
      {path: "userblocked", name: "userblocke", component: UserBlock},
      {path: ":id/modif", component: ModifSignalement}
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
