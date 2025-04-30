<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router' // Importer useRouter
import { api } from '../services/api' // Importer l'instance API

const categories = ref([])
const router = useRouter() // Créer une instance de router

onMounted(async () => {
  try {
    const response = await api.get('/categories')
    categories.value = response.data.categories
  } catch (err) {
    console.error('Erreur lors du chargement des catégories', err)
  }
})

const filterBooks = (categorieId) => {
  // Rediriger vers la route de la catégorie
  router.push(`/categories/${categorieId}/livres`) // Rediriger vers la page des livres de la catégorie
}
</script>

<template>
  <div>
    <h2>Filtrer par catégorie</h2>
    <div>
      <button
        v-for="categorie in categories"
        :key="categorie.categorie_id"
        @click="filterBooks(categorie.categorie_id)"
      >
        {{ categorie.libelle }}
      </button>
    </div>
  </div>
</template>
