<script setup>
import { ref, onMounted } from 'vue'
import StarRating from './StartRating.vue'
import { api } from '../services/api'

const props = defineProps({
  livre: Object,
})

// ⚠️ Simulation utilisateur connecté (à adapter)
const utilisateur_id = 1

const userRating = ref(0)
const averageRating = ref(0)
const error = ref('')

// Charger la moyenne + la note de l'utilisateur
onMounted(async () => {
  try {
    const avg = await api.get(`/livres/${props.livre.livre_id}/notes`)
    const notes = avg.data.ratings || []
    const moyenne = notes.reduce((acc, r) => acc + r.note, 0) / (notes.length || 1)
    averageRating.value = moyenne

    const userRes = await api.get(`/livres/${props.livre.livre_id}/notes/${utilisateur_id}`)
    if (userRes.data.note) {
      userRating.value = userRes.data.note
    }
  } catch (err) {
    console.error('Erreur chargement notes', err)
  }
})

const submitRating = async () => {
  try {
    await api.post(`/livres/${props.livre.livre_id}/notes`, {
      note: userRating.value,
      livre_id: props.livre.livre_id,
      utilisateur_id,
    })
    alert('Note enregistrée !')
  } catch (err) {
    console.error('Erreur note', err)
    error.value = "Impossible d'enregistrer la note."
  }
}
</script>

<template>
  <div class="book-card">
    <div class="book-image">
      <img :src="`http://localhost:3000${livre.imageCouverturePath}`" alt="Couverture" />
    </div>
    <div class="book-details">
      <h2>{{ livre.titre }}</h2>
      <p>Auteur : {{ livre.auteur?.nom || 'Inconnu' }}</p>
      <p>Catégorie : {{ livre.categorie?.libelle || 'Non classé' }}</p>
      <p>{{ livre.resume }}</p>
      <p>Pages : {{ livre.nbPage }} | Année édition : {{ livre.anneeEdition }}</p>

      <p v-if="livre.utilisateur">
        Ajouté par :
        <router-link :to="`/users/${livre.utilisateur.utilisateur_id}/livres`">
          {{ livre.utilisateur.username }}
        </router-link>
      </p>
      <p v-else>Ajouté par : Inconnu</p>

      <div class="note">
        <h3>Notez ce livre :</h3>
        <StarRating v-model="userRating" />
        <button @click="submitRating">Soumettre</button>
        <p class="note-moyenne">Note moyenne : {{ averageRating.toFixed(1) }} / 5</p>
        <p v-if="error" class="note-error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-card {
  display: flex;
  background: hsla(0, 100%, 36%, 0.2);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  overflow: hidden;
  align-items: flex-start;
}

.book-image {
  flex: 0 0 180px;
  max-width: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.book-image img {
  width: 100%;
  height: auto;
  border-radius: 6px;
  object-fit: cover;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
}

.book-details {
  flex: 1;
  padding: 1.5rem;
}

.book-details h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: whitesmoke;
}

.book-details p {
  margin: 0.3rem 0;
  color: whitesmoke;
}

.note {
  margin-top: 1.5rem;
}

.note-moyenne {
  margin-top: 10px;
  color: whitesmoke;
}

.note-error {
  color: whitesmoke;
  margin-top: 0.5rem;
}

h3 {
  color: whitesmoke;
  margin-bottom: 0.5rem;
}
</style>
