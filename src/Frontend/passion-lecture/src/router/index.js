import { createRouter, createWebHistory } from 'vue-router'
import BookListView from '../views/BookListView.vue'
//import BookDetailsView from '../views/BookDetailsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'book-list',
      component: BookListView,
    },
 /*   {
      path: '/book/:id',
      name: 'book-details',
      props: true,
      component: BookDetailsView,
    },*/
  ],
})

export default router
