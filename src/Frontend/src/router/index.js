// Importation des outils de routage de Vue
import { createRouter, createWebHistory } from 'vue-router'

// Importation des vues utilisées dans les routes
import AccueilView from '@/views/AccueilView.vue'
import CategoryView from '@/views/CategoryView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import BookView from '@/views/BookView.vue'
import UserView from '@/views/UserView.vue'
import ModifyBookView from '@/views/ModifyView.vue'
import AjouterLivre from '@/components/AddBook.vue'
import AdminView from '@/views/AdminView.vue'

// Création du routeur avec historique HTML5
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // Route par défaut
      path: '/',
      redirect: '/livres',
    },
    {
      // Route pour la page d'accueil
      path: '/livres',
      name: 'accueil',
      component: AccueilView,
      meta: { requiresAuth: true },
    },
    {
      // Route pour la page d'ajout de livre
      path: '/add',
      name: 'add',
      component: AjouterLivre,
    },
    {
      // Route pour la page de catégorie
      path: '/categories/:id/livres',
      name: 'CategoryBooks',
      component: CategoryView,
      props: true,
    },
    {
      // Route pour la page de connexion
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      // Route pour la page d'inscription
      path: '/signup',
      name: 'signup',
      component: RegisterView,
    },
    {
      // Route pour la page de détails d'un livre
      path: '/livres/:id',
      name: 'livre',
      component: BookView,
    },
    {
      // Route pour la page de détails d'un utilisateur
      path: '/users/:id/livres',
      name: 'usersLivres',
      component: UserView,
    },
    {
      // Route pour la page d'administration
      path: '/admin',
      name: 'AdminPage',
      component: AdminView,
      meta: { requiresAuth: true, isAdmin: true },
    },
    {
      // Route pour la page de modification d'un livre
      path: '/modify-book/:livre_id',
      name: 'modifyBook',
      component: ModifyBookView,
      props: true,
    },
  ],
})

export default router
