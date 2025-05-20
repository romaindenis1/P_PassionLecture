<script setup>
import { onMounted, ref } from 'vue' // Importation des fonctions et références de Vue
import { api } from '../services/api' // Importation du service API pour les requêtes HTTP
import LivreCard from '../components/LivreCard.vue' // Composant pour afficher un livre
import Header from '../components/Header.vue' // Composant pour l'en-tête
import Footer from '../components/Footer.vue' // Composant pour le pied de page
import CategorieFiltre from '../components/CategorieFiltre.vue' // Composant pour filtrer par catégorie

// Déclaration des variables réactives
const livres = ref([]) // Liste des livres
const loading = ref(true) // Indicateur de chargement
const error = ref('') // Message d'erreur
const isAuthenticated = ref(false) // Indicateur d'authentification

// Fonction exécutée au montage du composant
onMounted(async () => {
  // Vérification si l'utilisateur est authentifié via un token dans le localStorage
  isAuthenticated.value = !!localStorage.getItem('token')

  try {
    // Requête pour récupérer la liste des livres
    const response = await api.get('/livres')
    livres.value = response.data.data // Mise à jour de la liste des livres
  } catch (err) {
    // Gestion des erreurs lors de la requête
    error.value = 'Erreur lors du chargement des livres'
    console.error(err)
  } finally {
    // Fin du chargement
    loading.value = false
  }
})

// Fonction pour filtrer les livres par catégorie
const filterBooksByCategory = async (categoryId) => {
  try {
    // Requête pour récupérer les livres d'une catégorie spécifique
    const response = await api.get(`/categories/${categoryId}/livres`)
    livres.value = response.data // Mise à jour de la liste des livres
  } catch (err) {
    // Gestion des erreurs lors du filtrage
    error.value = 'Erreur lors du filtrage des livres'
    console.error(err)
  }
}
</script>

<template>
  <!-- Inclusion de l'en-tête -->
  <Header></Header>

  <!-- Composant pour filtrer les livres par catégorie -->
  <CategorieFiltre @filterBooks="filterBooksByCategory" />

  <!-- Titre principal de la page -->
  <h1>Liste des Livres</h1>

  <!-- Message de chargement -->
  <p v-if="loading">Chargement...</p>
  <!-- Affichage des erreurs -->
  <p v-if="error">{{ error }}</p>

  <!-- Grille des livres si le chargement est terminé et qu'il y a des livres -->
  <div v-if="!loading && livres.length" class="livres-grid">
    <LivreCard v-for="livre in livres" :key="livre.livre_id" :livre="livre" />
  </div>

  <!-- Message si aucun livre n'est trouvé -->
  <p v-if="!loading && livres.length === 0">Aucun livre trouvé.</p>

  <!-- Inclusion du pied de page -->
  <Footer></Footer>
</template>
