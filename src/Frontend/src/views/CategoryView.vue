<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../services/api'
import LivreCard from '../components/LivreCard.vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import CategorieFiltre from '../components/CategorieFiltre.vue'

// États réactifs pour les livres, le chargement, les erreurs, et les messages
const livres = ref([])
const loading = ref(true)
const error = ref('')
const success = ref('')

const route = useRoute()
const router = useRouter()
const id = route.params.id // ID de la catégorie actuelle

// Chargement des livres de la catégorie sélectionnée
onMounted(async () => {
  try {
    const response = await api.get(`/categories/${id}/livres`)
    livres.value = response.data.books || []
  } catch (err) {
    error.value = 'Erreur lors du chargement des livres'
    console.error(err)
  } finally {
    loading.value = false
  }
})

// Filtrage par une nouvelle catégorie, avec retour après succès
const filterBooksByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/categories/${categoryId}/livres`)
    livres.value = response.data.books || []
    success.value = 'Livres filtrés avec succès ✅'

    // Retour automatique à la page précédente après un court délai
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
      <Header></Header> />

      <CategorieFiltre @filterBooks="filterBooksByCategory" />

      <h1>Liste des Livres</h1>

      <!-- Messages système -->
      <p v-if="loading">Chargement...</p>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>

      <!-- Grille des livres -->
      <div v-if="!loading && livres.length" class="livres-grid">
        <LivreCard v-for="livre in livres" :key="livre.livre_id" :livre="livre" />
      </div>

      <!-- Aucun résultat -->
      <p v-if="!loading && livres.length === 0">Aucun livre trouvé.</p>

      <Footer></Footer>/>
    </div>
  </div>
</template>

<style scoped>
/* Conteneur principal */
.livres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

/* Conteneur fixe pour le header et le footer */
.error {
  color: red;
  margin-top: 1rem;
}

/* Message d'erreur */
.success {
  color: green;
  margin-top: 1rem;
}
</style>
