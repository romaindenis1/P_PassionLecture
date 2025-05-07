<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../services/api'
import LivreCard from '../components/LivreCard.vue'
import { useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import CategorieFiltre from '../components/CategorieFiltre.vue'

const livres = ref([])
const loading = ref(true)
const error = ref('')

const route = useRoute()
const id = route.params.id

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

const filterBooksByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/categories/${categoryId}/livres`)
    livres.value = response.data.books || []
  } catch (err) {
    error.value = 'Erreur lors du filtrage des livres'
    console.error(err)
  }
}
</script>

<template>
  <div id="page">
    <div class="fixed-container">
      <Header></Header>
      <CategorieFiltre @filterBooks="filterBooksByCategory" />

      <h1>Liste des Livres</h1>

      <p v-if="loading">Chargement...</p>
      <p v-if="error">{{ error }}</p>

      <div v-if="!loading && livres.length" class="livres-grid">
        <LivreCard v-for="livre in livres" :key="livre.livre_id" :livre="livre" />
      </div>

      <p v-if="!loading && livres.length === 0">Aucun livre trouvé.</p>
      <Footer></Footer>
    </div>
  </div>
</template>
