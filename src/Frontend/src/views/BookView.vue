<script setup>
// Importation des modules nécessaires
import { onMounted, ref } from 'vue'
import { api } from '../services/api'
import BookCard from '../components/BookCard.vue'
import { useRoute, useRouter } from 'vue-router'
import Comment from '@/components/Comment.vue'
import Header from '@/components/Header.vue'

// Déclaration des variables réactives
const livre = ref([]) // Détails du livre
const comments = ref([]) // Liste des commentaires
const loading = ref(true) // Indicateur de chargement
const error = ref('') // Message d'erreur
const commentInput = ref('') // Champ de saisie pour les commentaires

const route = useRoute() // Récupération des paramètres de la route
const router = useRouter() // Utilisation du routeur pour naviguer
const id = route.params.id // ID du livre

// Chargement des données du livre et des commentaires lors du montage du composant
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

// Fonction pour soumettre un commentaire
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
  <!-- Gestion des états de chargement et des erreurs -->
  <p v-if="loading">Chargement...</p>
  <p v-if="error" class="error">{{ error }}</p>
  <!-- Affichage des détails du livre -->
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

  <!-- Commentaires -->
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

  <!-- Liste des commentaires -->
  <div v-for="comment in comments" :key="comment.id">
    <Comment :comment="comment" />
  </div>
</template>
