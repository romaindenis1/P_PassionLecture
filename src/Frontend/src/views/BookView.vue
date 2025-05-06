<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../services/api'
import BookCard from '../components/BookCard.vue'
import { useRoute, useRouter } from 'vue-router'
import Comment from '@/components/Comment.vue'

const livre = ref([])
const comments = ref([])
const loading = ref(true)
const error = ref('')
const commentInput = ref('')

const route = useRoute()
const router = useRouter()
const id = route.params.id

onMounted(async () => {
  try {
    const bookResponse = await api.get(`/livres/${id}`)
    livre.value = bookResponse.data.data

    const commentsResponse = await api.get(`/livres/${id}/comments`)
    comments.value = commentsResponse.data.comments
  } catch (err) {
    error.value = 'Erreur lors du chargement des livres'
    console.error('Loading error:', err)
  } finally {
    loading.value = false
  }
})

const submitComment = async () => {
  if (!commentInput.value.trim()) {
    error.value = 'Le commentaire ne peut pas être vide'
    return
  }

  try {
    const response = await api.post(`/livres/${id}/comments`, {
      content: commentInput.value,
    })

    comments.value.push(response.data.comment)
    commentInput.value = ''
    error.value = ''
  } catch (err) {
    console.error('Submit comment error:', err.response || err)
    if (err.response?.status === 401) {
      error.value = 'Vous devez être connecté pour commenter.'
      router.push('/login')
    } else {
      error.value = "Erreur lors de l'envoi du commentaire"
    }
  }
}
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
    <p v-if="error" class="error">{{ error }}</p>
    <div v-if="!loading && livre">
      <BookCard :livre="livre" />
    </div>
    <p v-if="!loading && !livre">Aucun livre trouvé.</p>

    <div class="comment-form">
      <input
        v-model="commentInput"
        type="text"
        placeholder="Ajouter un commentaire..."
        @keyup.enter="submitComment"
      />
      <button @click="submitComment">Envoyer</button>
    </div>

    <div v-for="comment in comments" :key="comment.id">
      <Comment :comment="comment" />
    </div>
  </div>
</template>
