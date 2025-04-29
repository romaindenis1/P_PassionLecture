<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../services/api'
import LivreCard from '../components/LivreCard.vue'

const livres = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const response = await api.get('/livres')
    livres.value = response.data.data
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
    <header>
      <div>
        <h1>Passion Lecture</h1>
      </div>
      <div>
        <input type="text" placeholder="Rechercher un livre..." />
      </div>
      <div>
        <button>Se connecter</button>
        <button>Créer un compte</button>
      </div>
    </header>
    <h1>Liste des Livres</h1>

    <p v-if="loading">Chargement...</p>
    <p v-if="error">{{ error }}</p>

    <div v-if="!loading && livres.length">
      <LivreCard v-for="livre in livres" :key="livre.livre_id" :livre="livre" />
    </div>

    <p v-if="!loading && livres.length === 0">Aucun livre trouvé.</p>
  </div>
</template>
