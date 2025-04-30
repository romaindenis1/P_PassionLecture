<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../services/api'
import BookCard from '../components/BookCard.vue'
import { useRoute } from 'vue-router'
import Comment from '@/components/Comment.vue'

const livre = ref([])
const comments = ref([])
const loading = ref(true)
const error = ref('')


const route = useRoute()
const id = route.params.id

onMounted(async () => {
  try {
    const bookResponse = await api.get(`/livres/${id}`)
    livre.value = bookResponse.data.data 

    const commentsResponse = await api.get(`/livres/${id}/comments`)
    comments.value = commentsResponse.data.comments
    console.log(commentsResponse.data.data)
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
    <div v-if="!loading && livre">
        <BookCard :livre="livre" />
    </div>
    <p v-if="!loading && !livre">Aucun livre trouvé.</p>

    <div v-for="comment in comments" :key="comment.id" >
        <Comment :comment="comment" />
    </div>
</div>
</template>
