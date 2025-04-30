import { createRouter, createWebHistory } from 'vue-router'

import AccueilView from '@/views/AccueilView.vue'
import CategoryView from '@/views/CategoryView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/livres',
      name: 'accueil',
      component: AccueilView,
      meta: { requiresAuth: true },
    },
    {
      path: '/categories/:id/livres',
      name: 'CategoryBooks',
      component: CategoryView,
      props: true,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: RegisterView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
