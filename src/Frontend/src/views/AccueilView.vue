<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../services/api'

// Composants de la page
import LivreCard from '../components/LivreCard.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import CategorieFiltre from '../components/CategorieFiltre.vue'

// Données réactives
const livres = ref([]) // Liste des livres affichés
const loading = ref(true) // État de chargement
const error = ref('') // Message d'erreur éventuel
const isAuthenticated = ref(false) // Présence d'un token dans le localStorage

// Chargement initial des livres
onMounted(async () => {
  isAuthenticated.value = !!localStorage.getItem('token')

  try {
    const response = await api.get('/livres')
    livres.value = response.data.data
  } catch (err) {
    error.value = 'Erreur lors du chargement des livres'
    console.error(err)
  } finally {
    loading.value = false
  }
})

// Filtrage des livres par ID de catégorie
const filterBooksByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/categories/${categoryId}/livres`)
    livres.value = response.data
  } catch (err) {
    error.value = 'Erreur lors du filtrage des livres'
    console.error(err)
  }
}
</script>

<template>
  <Header></Header> />

  <!-- Filtre par catégorie -->
  <CategorieFiltre @filterBooks="filterBooksByCategory" />

  <h1>Liste des Livres</h1>

  <!-- État de chargement -->
  <p v-if="loading">Chargement...</p>

  <!-- Message d'erreur -->
  <p v-if="error">{{ error }}</p>

  <!-- Affichage des livres -->
  <div v-if="!loading && livres.length" class="livres-grid">
    <LivreCard v-for="livre in livres" :key="livre.livre_id" :livre="livre" />
  </div>

  <!-- Aucun livre trouvé -->
  <p v-if="!loading && livres.length === 0">Aucun livre trouvé.</p>

  <Footer></Footer> />
</template>

<style scoped></style>
