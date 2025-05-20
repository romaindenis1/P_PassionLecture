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
  <div>
    <img :src="`http://localhost:3000${livre.imageCouverturePath}`" alt="Couverture" />
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

    <div style="margin-top: 20px">
      <h3>Notez ce livre :</h3>
      <StarRating v-model="userRating" />
      <button @click="submitRating">Soumettre</button>
      <p style="margin-top: 10px">Note moyenne : {{ averageRating.toFixed(1) }} / 5</p>
      <p v-if="error" style="color: red">{{ error }}</p>
    </div>
  </div>
</template>
