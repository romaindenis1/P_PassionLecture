<script setup>
// Importation des modules nécessaires
import { onMounted, ref } from 'vue'
import { api } from '../services/api'
import LivreCard from '../components/LivreCard.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import CategorieFiltre from '../components/CategorieFiltre.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { watch } from 'vue'

// Déclaration des variables réactives
const livres = ref([]) // Liste des livres
const loading = ref(true) // Indicateur de chargement
const error = ref('') // Message d'erreur
const isAuthenticated = ref(false) // Indicateur d'authentification
const route = useRoute() // Récupération des paramètres de la route
const user = ref(null) // Informations de l'utilisateur

// Calcul pour vérifier si l'utilisateur actuel est le propriétaire
const currentUserId = computed(() => sessionStorage.getItem('userId'))
const isOwner = computed(() => currentUserId.value === route.params.id)

// Chargement des données lors du montage du composant
onMounted(async () => {
  const userId = route.params.id || sessionStorage.getItem('userId')
  isAuthenticated.value = sessionStorage.getItem('auth') === 'true'

  if (!userId) {
    error.value = 'Utilisateur non connecté'
    loading.value = false
    return
  }

  try {
    // Récupération des données utilisateur et des livres associés
    const [userRes, livreRes] = await Promise.all([
      api.get(`/users/${userId}`),
      api.get(`/users/${userId}/livres`),
    ])

    user.value = userRes.data.data
    livres.value = livreRes.data.data
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.message || 'Erreur de chargement'
    livres.value = []
  } finally {
    loading.value = false
  }
})

// Surveillance des changements de l'ID utilisateur dans la route
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

// Fonction pour filtrer les livres par catégorie
const filterBooksByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/categories/${categoryId}/livres`)
    livres.value = response.data.data
  } catch (err) {
    error.value = 'Erreur lors du filtrage des livres'
    console.error(err)
  }
}

// Fonction pour supprimer un livre
const supprimerLivre = async (livreId) => {
  if (!confirm('Voulez-vous vraiment supprimer ce livre ?')) return

  try {
    await api.delete(`/livres/${livreId}`)
    livres.value = livres.value.filter((livre) => livre.livre_id !== livreId)
  } catch (err) {
    console.error('Erreur suppression livre :', err)
    error.value = 'Impossible de supprimer le livre.'
  }
}
</script>

<template>
  <Header></Header>

  <!-- Composant pour filtrer les livres par catégorie -->

  <h1>Liste des Livres</h1>
  <div v-if="user" class="user-info">
    <!-- Affichage des informations utilisateur -->
    <h2>Livres ajoutés par {{ user.username }}</h2>
    <p>Total : {{ livres.length }} livre(s)</p>
  </div>

  <!-- Gestion des états de chargement et des erreurs -->
  <p v-if="loading">Chargement...</p>
  <p v-if="error">{{ error }}</p>

  <!-- Affichage des livres -->
  <div v-if="!loading && livres.length">
    <div v-for="livre in livres" :key="livre.livre_id" class="livre-card-wrapper">
      <LivreCard :livre="livre" />

      <!-- Actions disponibles si l'utilisateur est le propriétaire -->
      <div class="actions" v-if="isOwner">
        <router-link :to="`/livres/${livre.livre_id}/edit`">
          <button>Modifier</button>
        </router-link>
        <button @click="supprimerLivre(livre.livre_id)">Supprimer</button>
      </div>

      <div class="modify-book-button">
        <router-link :to="`/modify-book/${livre.livre_id}`">
          <button>Modifier le Livre</button>
        </router-link>
      </div>
    </div>
  </div>

  <!-- Message si aucun livre n'est trouvé -->
  <p v-if="!loading && livres.length === 0 && !error">Aucun livre trouvé.</p>

  <!-- Lien pour ajouter un nouveau livre -->
  <router-link to="/add"><button>Ajouter un livre</button></router-link>

  <Footer></Footer>
</template>

<style scoped>
.livre-card-wrapper {
  margin-bottom: 2rem;
}
.actions {
  margin-top: 0.5rem;
  display: flex;
  gap: 10px;
}
.modify-book-button {
  margin-top: 0.5rem;
}
.user-info {
  margin-bottom: 1.5rem;
}
</style>
