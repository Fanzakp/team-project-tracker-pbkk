// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '../components/Home.vue'
import Dashboard from '../components/Dashboard.vue'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import About from '../components/About.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/register', component: Register, meta: { hideSidebar: true } },
  { path: '/login', component: Login, meta: { hideSidebar: true } },
  { path: '/about', component: About, meta: { hideSidebar: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(to => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }
})

export default router
