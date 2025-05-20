<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'

// Déclaration d'une liste réactive pour stocker les catégories
const categories = ref([])
// Utilisation du routeur pour naviguer entre les pages
const router = useRouter()

// Chargement des catégories depuis l'API au montage du composant
onMounted(async () => {
  try {
    const response = await api.get('/categories')
    categories.value = response.data.categories
  } catch (err) {
    console.error('Erreur lors du chargement des catégories', err)
  }
})

// Fonction pour filtrer les livres par catégorie
const filterBooks = (categorieId) => {
  router.push(`/categories/${categorieId}/livres`)
}
</script>

<template>
  <div>
    <!-- Titre de la section -->
    <h2>Filtrer par catégorie</h2>
    <!-- Liste des catégories sous forme de boutons -->
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
/* Style pour la barre de navigation des catégories */
.navBar {
  top: 0%;
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
}

/* Style pour les boutons des catégories */
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

/* Style pour le survol des boutons */
@media (hover: hover) {
  button:hover {
    background-color: hsla(0, 100%, 36%, 0.2);
    border-radius: 8px;
    transform: scale(1.05);
  }
}
</style>
