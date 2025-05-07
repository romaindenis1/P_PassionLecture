<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../services/api'
import LivreCard from '../components/LivreCard.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import CategorieFiltre from '../components/CategorieFiltre.vue'
import { useRoute } from 'vue-router'

import { watch } from 'vue'

const livres = ref([])
const loading = ref(true)
const error = ref('')
const isAuthenticated = ref(false)
const route = useRoute()

onMounted(async () => {
  const route = useRoute()
  const userId = route.params.id || sessionStorage.getItem('userId')
  isAuthenticated.value = sessionStorage.getItem('auth') === 'true'

  if (!userId) {
    error.value = 'Utilisateur non connecté'
    loading.value = false
    return
  }

  try {
    const response = await api.get(`/users/${userId}/livres`)
    livres.value = response.data.data
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.message || 'Erreur de chargement'
    livres.value = [] // Met à vide en cas d’erreur gérée
  } finally {
    loading.value = false
  }
})

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      loading.value = true
      try {
        const response = await api.get(`/users/${newId}/livres`)
        livres.value = response.data.data
        error.value = ''
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur de chargement'
        livres.value = []
      } finally {
        loading.value = false
      }
    }
  },
)

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
  <div>
    <Header></Header>

    <CategorieFiltre @filterBooks="filterBooksByCategory" />

    <h1>Liste des Livres</h1>

    <p v-if="loading">Chargement...</p>
    <p v-if="error">{{ error }}</p>

    <div v-if="!loading && livres.length">
      <LivreCard v-for="livre in livres" :key="livre.livre_id" :livre="livre" />
    </div>

    <p v-if="error">{{ error }}</p>
    <p v-if="!loading && livres.length === 0 && !error">Aucun livre trouvé.</p>

    <router-link to="/ROMAINDENIS"><button>Ajouter un livre</button></router-link>

    <Footer></Footer>
  </div>
</template>
