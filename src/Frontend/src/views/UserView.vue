<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../services/api'
import LivreCard from '../components/LivreCard.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import CategorieFiltre from '../components/CategorieFiltre.vue'

// États réactifs
const livres = ref([])
const loading = ref(true)
const error = ref('')
const isAuthenticated = ref(false)
const user = ref(null)

const route = useRoute()
const currentUserId = computed(() => sessionStorage.getItem('userId'))
const isOwner = computed(() => currentUserId.value === route.params.id)

// Chargement des livres et de l’utilisateur
onMounted(async () => {
  const userId = route.params.id || sessionStorage.getItem('userId')
  isAuthenticated.value = sessionStorage.getItem('auth') === 'true'

  if (!userId) {
    error.value = 'Utilisateur non connecté'
    loading.value = false
    return
  }

  try {
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

// Mise à jour si on change d'utilisateur dans l'URL
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

const isAdmin = computed(() => sessionStorage.getItem('isAdmin') === '1')

// Suppression d’un livre
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
  <Header></Header> />

  <h1>Liste des Livres</h1>

  <!-- Informations sur l'utilisateur -->
  <div v-if="user" class="user-info">
    <h2>Livres ajoutés par {{ user.username }}</h2>
    <p>Total : {{ livres.length }} livre(s)</p>
  </div>

  <!-- Messages -->
  <p v-if="loading">Chargement...</p>
  <p v-if="error">{{ error }}</p>

  <!-- Liste des livres -->
  <div v-if="!loading && livres.length">
    <div v-for="livre in livres" :key="livre.livre_id" class="livre-card-wrapper">
      <LivreCard :livre="livre" />

      <!-- Boutons de modification/suppression si propriétaire -->
      <!-- Dans le template -->
      <div class="actions" v-if="isOwner || isAdmin">
        <router-link :to="`/modify-book/${livre.livre_id}`">
          <button>Modifier</button>
        </router-link>
        <button @click="supprimerLivre(livre.livre_id)">Supprimer</button>
      </div>
    </div>
  </div>

  <!-- Aucun livre trouvé -->
  <p v-if="!loading && livres.length === 0 && !error">Aucun livre trouvé.</p>

  <!-- Ajouter un livre -->
  <router-link to="/add"><button>Ajouter un livre</button></router-link>

  <Footer></Footer>/>
</template>

<style scoped>
/* Styles globaux */
.livre-card-wrapper {
  margin-bottom: 2rem;
}

/* Boutons de modification/suppression */
.actions {
  margin-top: 0.5rem;
  display: flex;
  gap: 10px;
}

/* Informations sur l'utilisateur */
.user-info {
  margin-bottom: 1.5rem;
}
</style>
