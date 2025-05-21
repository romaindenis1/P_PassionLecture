<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'

// Liste réactive contenant les catégories chargées depuis l’API
const categories = ref([])

// Instance du routeur pour gérer la navigation
const router = useRouter()

// Récupération des catégories au chargement du composant
onMounted(async () => {
  try {
    const response = await api.get('/categories')
    categories.value = response.data.categories
  } catch (err) {
    console.error('Erreur lors du chargement des catégories', err)
  }
})

// Redirige vers la page des livres de la catégorie sélectionnée
const filterBooks = (categorieId) => {
  router.push(`/categories/${categorieId}/livres`)
}
</script>

<template>
  <div>
    <!-- Titre de la section -->
    <h2>Filtrer par catégorie</h2>

    <!-- Affichage des boutons pour chaque catégorie -->
    <div class="navBar">
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

<style scoped>
/* Conteneur des boutons de catégorie */
.navBar {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
}

/* Style des boutons */
.navBar button {
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
  width: 150px;
  height: 50px;
  text-align: center;
}

/* Effet au survol (pour les périphériques compatibles) */
@media (hover: hover) {
  button:hover {
    background-color: hsla(0, 100%, 36%, 0.2);
    border-radius: 8px;
    transform: scale(1.05);
  }
}
</style>
