<script setup>
// Importation des modules nécessaires
import { onMounted, ref } from 'vue'
import { api } from '../services/api'
import LivreCard from '../components/LivreCard.vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import CategorieFiltre from '../components/CategorieFiltre.vue'

// Déclaration des variables réactives
const livres = ref([]) // Liste des livres
const loading = ref(true) // Indicateur de chargement
const error = ref('') // Message d'erreur
const success = ref('') // Message de confirmation

const route = useRoute() // Récupération des paramètres de la route
const router = useRouter() // Pour revenir en arrière
const id = route.params.id // ID de la catégorie

// Chargement des livres de la catégorie lors du montage du composant
onMounted(async () => {
  try {
    const response = await api.get(`/categories/${id}/livres`)
    livres.value = response.data.books || [] // Récupération des livres
  } catch (err) {
    error.value = 'Erreur lors du chargement des livres'
    console.error(err)
  } finally {
    loading.value = false
  }
})

// Fonction pour filtrer les livres par catégorie
const filterBooksByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/categories/${categoryId}/livres`)
    livres.value = response.data.books || []
    success.value = 'Livres filtrés avec succès ✅'

    // Attendre 1.5 seconde puis revenir à la page précédente
    setTimeout(() => {
      router.back()
    }, 1500)
  } catch (err) {
    error.value = 'Erreur lors du filtrage des livres'
    console.error(err)
  }
}
</script>

<template>
  <div id="page">
    <div class="fixed-container">
      <Header />

      <!-- Composant pour filtrer les livres par catégorie -->
      <CategorieFiltre @filterBooks="filterBooksByCategory" />

      <h1>Liste des Livres</h1>

      <!-- Messages -->
      <p v-if="loading">Chargement...</p>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>

      <!-- Affichage des livres -->
      <div v-if="!loading && livres.length" class="livres-grid">
        <LivreCard v-for="livre in livres" :key="livre.livre_id" :livre="livre" />
      </div>

      <!-- Message si aucun livre n'est trouvé -->
      <p v-if="!loading && livres.length === 0">Aucun livre trouvé.</p>

      <Footer />
    </div>
  </div>
</template>

<style scoped>
.livres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.error {
  color: red;
  margin-top: 1rem;
}

.success {
  color: green;
  margin-top: 1rem;
}
</style>
