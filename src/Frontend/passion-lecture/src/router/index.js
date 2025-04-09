import { createRouter, createWebHistory } from 'vue-router'
import BookListView from '../views/BookListView.vue'
import UserView from '../views/UserView.vue'
//import BookDetailsView from '../views/BookDetailsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'book-list',
      component: BookListView,
    },
    {
      path: '/UserBookList',
      name: 'user-list',
      component: UserView,
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
