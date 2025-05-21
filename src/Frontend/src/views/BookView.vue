<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../services/api'
import BookCard from '../components/BookCard.vue'
import { useRoute, useRouter } from 'vue-router'
import Comment from '@/components/Comment.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

// Données réactives
const livre = ref([]) // Détails du livre
const comments = ref([]) // Liste des commentaires
const loading = ref(true) // Indicateur de chargement
const error = ref('') // Message d'erreur
const commentInput = ref('') // Contenu du champ de commentaire

// Accès aux informations de la route
const route = useRoute()
const router = useRouter()
const id = route.params.id // ID du livre depuis l'URL

// Chargement des données du livre et des commentaires au montage
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

// Envoi d’un nouveau commentaire
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
  <Header></Header>

  <h1>Liste des Livres</h1>

  <!-- État de chargement ou erreur -->
  <p v-if="loading">Chargement...</p>
  <p v-if="error" class="error">{{ error }}</p>

  <!-- Affichage du livre -->
  <div v-if="!loading && livre">
    <BookCard :livre="livre" />
  </div>
  <p v-if="!loading && !livre">Aucun livre trouvé.</p>

  <!-- Formulaire pour ajouter un commentaire -->
  <div v-if="!loading" class="comment-form">
    <input
      v-model="commentInput"
      type="text"
      placeholder="Ajouter un commentaire..."
      @keyup.enter="submitComment"
    />
    <button @click="submitComment">Envoyer</button>
  </div>

  <!-- Section des commentaires -->
  <div v-if="!loading">
    <h2>Commentaires</h2>

    <div v-if="comments.length === 0">
      <p>Aucun commentaire pour ce livre.</p>
    </div>

    <div v-else>
      <div v-for="comment in comments" :key="comment.id">
        <Comment :comment="comment" />
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>
