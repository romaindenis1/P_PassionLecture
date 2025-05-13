<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../services/api'
import LivreCard from '../components/LivreCard.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import CategorieFiltre from '../components/CategorieFiltre.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { watch } from 'vue'

const livres = ref([])
const loading = ref(true)
const error = ref('')
const isAuthenticated = ref(false)
const route = useRoute()

const currentUserId = computed(() => sessionStorage.getItem('userId'))
const isOwner = computed(() => currentUserId.value === route.params.id)

onMounted(async () => {
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
    livres.value = []
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
    livres.value = response.data.data
  } catch (err) {
    error.value = 'Erreur lors du filtrage des livres'
    console.error(err)
  }
}

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

  <CategorieFiltre @filterBooks="filterBooksByCategory" />

  <h1>Liste des Livres</h1>

  <p v-if="loading">Chargement...</p>
  <p v-if="error">{{ error }}</p>

  <div v-if="!loading && livres.length">
    <div v-for="livre in livres" :key="livre.livre_id" class="livre-card-wrapper">
      <LivreCard :livre="livre" />

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

  <p v-if="!loading && livres.length === 0 && !error">Aucun livre trouvé.</p>

  <router-link to="/ROMAINDENIS"><button>Ajouter un livre</button></router-link>

  <Footer></Footer>
</template>
