import { createRouter, createWebHistory } from 'vue-router'

import AccueilView from '@/views/AccueilView.vue'
import CategoryView from '@/views/CategoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/livres',
      name: 'accueil',
      component: AccueilView,
    },
    {
      path: '/categories/:id/livres',
      name: 'CategoryBooks',
      component: CategoryView,
      props: true,
    },
  ],
})

export default router
