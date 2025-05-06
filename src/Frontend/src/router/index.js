import { createRouter, createWebHistory } from 'vue-router'

import AccueilView from '@/views/AccueilView.vue'
import CategoryView from '@/views/CategoryView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import BookView from '@/views/BookView.vue'
import UserView from '@/views/UserView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/livres',
    },
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
    {
      path: '/livres/:id',
      name: 'livre',
      component: BookView,
    },
    {
      path: '/users/:id/livres',
      name: 'usersLivres',
      props: true,
      component: BookView,
    },
  ],
})

export default router
