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

// Création du routeur avec historique HTML5 (mode SPA)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // Redirection par défaut vers la page d'accueil des livres
      path: '/',
      redirect: '/livres',
    },
    {
      // Affiche la liste des livres
      path: '/livres',
      name: 'accueil',
      component: AccueilView,
    },
    {
      // Page pour ajouter un nouveau livre (réservée aux utilisateurs connectés)
      path: '/add',
      name: 'add',
      component: AjouterLivre,
      meta: { requiresAuth: true },
    },
    {
      // Affiche les livres par catégorie
      path: '/categories/:id/livres',
      name: 'CategoryBooks',
      component: CategoryView,
      props: true,
    },
    {
      // Page de connexion
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      // Page d'inscription
      path: '/signup',
      name: 'signup',
      component: RegisterView,
    },
    {
      // Détail d’un livre (réservé aux utilisateurs connectés)
      path: '/livres/:id',
      name: 'livre',
      component: BookView,
      meta: { requiresAuth: true },
    },
    {
      // Espace personnel d’un utilisateur (réservé à lui-même ou à un admin)
      path: '/users/:id/livres',
      name: 'usersLivres',
      component: UserView,
      meta: { requiresAuth: true },
    },
    {
      // Espace d’administration (réservé aux administrateurs)
      path: '/admin',
      name: 'AdminPage',
      component: AdminView,
      meta: { requiresAuth: true, isAdmin: true },
    },
    {
      // Modification d’un livre (réservée aux utilisateurs connectés)
      path: '/modify-book/:livre_id',
      name: 'modifyBook',
      component: ModifyBookView,
      props: true,
      meta: { requiresAuth: true },
    },
  ],
})

// Guard global : contrôle d'accès avant chaque navigation
router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem('auth') === 'true'
  const currentUserId = sessionStorage.getItem('userId')
  const isAdmin = sessionStorage.getItem('isAdmin') === '1'

  // Redirige vers /login si la route nécessite une authentification et que l'utilisateur n'est pas connecté
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  // Si l'utilisateur tente d'accéder à un autre profil que le sien, sans être admin → redirection
  if (to.name === 'usersLivres') {
    const routeUserId = to.params.id
    if (routeUserId !== currentUserId && !isAdmin) {
      return next('/livres')
    }
  }

  // Si la route est réservée aux admins et que l'utilisateur ne l'est pas → redirection
  if (to.meta.isAdmin && !isAdmin) {
    return next('/livres')
  }

  // Sinon, navigation autorisée
  next()
})

export default router
