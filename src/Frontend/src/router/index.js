// Importation des modules nécessaires pour créer un routeur Vue
import { createRouter, createWebHistory } from 'vue-router'

// Importation des composants Vue utilisés comme vues pour les routes
import AccueilView from '@/views/AccueilView.vue'
import CategoryView from '@/views/CategoryView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import BookView from '@/views/BookView.vue'
import UserView from '@/views/UserView.vue'
import AjouterLivre from '@/components/AddBook.vue'
import AdminView from '@/views/AdminView.vue'

// Création du routeur avec un historique basé sur le Web
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Utilisation de l'historique HTML5
  routes: [
    {
      path: '/', // Chemin racine
      redirect: '/livres', // Redirection vers la route '/livres'
    },
    {
      path: '/livres', // Route pour afficher la liste des livres
      name: 'accueil', // Nom de la route
      component: AccueilView, // Composant associé
      meta: { requiresAuth: true }, // Métadonnée indiquant que l'authentification est requise
    },
    {
      path: '/add', // Route pour ajouter un livre
      name: 'add', // Nom de la route
      component: AjouterLivre, // Composant associé
    },
    {
      path: '/categories/:id/livres', // Route pour afficher les livres d'une catégorie spécifique
      name: 'CategoryBooks', // Nom de la route
      component: CategoryView, // Composant associé
      props: true, // Les paramètres de la route sont passés comme props au composant
    },
    {
      path: '/login', // Route pour la page de connexion
      name: 'login', // Nom de la route
      component: LoginView, // Composant associé
    },
    {
      path: '/signup', // Route pour la page d'inscription
      name: 'signup', // Nom de la route
      component: RegisterView, // Composant associé
    },
    {
      path: '/livres/:id', // Route pour afficher les détails d'un livre spécifique
      name: 'livre', // Nom de la route
      component: BookView, // Composant associé
    },
    {
      path: '/users/:id/livres', // Route pour afficher les livres d'un utilisateur spécifique
      name: 'usersLivres', // Nom de la route
      component: UserView, // Composant associé
    },
    {
      path: '/admin',
      name: 'AdminPage', // Nom de la route
      component: AdminView, // Chargement dynamique du composant pour la page admin
      meta: { requiresAuth: true, isAdmin: true }, // Métadonnées indiquant que l'authentification et les droits d'administrateur sont requis
    },
  ],
})

// Exportation du routeur pour l'utiliser dans l'application Vue
export default router
