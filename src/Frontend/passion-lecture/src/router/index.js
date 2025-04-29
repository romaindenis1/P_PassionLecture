import { createRouter, createWebHistory } from 'vue-router'
import ConnectionBackend from '@/components/connectionBackend.vue'
import AccueilView from '@/views/AccueilView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/test', name: 'test', component: ConnectionBackend },
    {
      path: '/livres',
      name: 'accueil',
      component: AccueilView,
    },
  ],
})

export default router
