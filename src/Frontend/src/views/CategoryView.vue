<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../services/api'
import LivreCard from '../components/LivreCard.vue'
import { useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const livres = ref([])
const loading = ref(true)
const error = ref('')

const route = useRoute()
const id = route.params.id
console.log('Route param ID:', id)
onMounted(async () => {
  try {
    const response = await api.get(`/categories/${id}/livres`)
    livres.value = response.data.books || [] //Books par ce que c'est le nom du tableau qui return les livres dans le backend
    console.log('Livres:', livres.value)
  } catch (err) {
    error.value = 'Erreur lors du chargement des livres'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <Header></Header>
    <h1>Liste des Livres</h1>

    <p v-if="loading">Chargement...</p>
    <p v-if="error">{{ error }}</p>

    <div v-if="!loading && livres.length">
      <LivreCard v-for="livre in livres" :key="livre.livre_id" :livre="livre" />
    </div>

    <p v-if="!loading && livres.length === 0">Aucun livre trouvé.</p>
    <Footer></Footer>
  </div>
</template>
