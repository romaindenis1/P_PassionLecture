<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../services/api'
import { useRoute } from 'vue-router'
import Comment from '@/components/Comment.vue'
import Header from '@/components/Header.vue'
import BookCard from '@/components/BookCard.vue'

const livre = ref(null)
const comments = ref([])
const loading = ref(true)
const error = ref('')
const successMessage = ref('')
const categories = ref([])

const route = useRoute()
const id = route.params.livre_id

onMounted(async () => {
  try {
    const [bookResponse, categoriesResponse] = await Promise.all([
      api.get(`/livres/${id}`),
      api.get('/categories'),
    ])

    livre.value = bookResponse.data.data
    categories.value = categoriesResponse.data.categories // ← Adapter au format réel
  } catch (err) {
    error.value = 'Erreur lors du chargement des données.'
    console.error('Loading error:', err)
  } finally {
    loading.value = false
  }
})

const modifierLivre = async () => {
  try {
    await api.put(`/livres/${id}`, livre.value)
    successMessage.value = 'Livre modifié avec succès.'
    setTimeout(() => (successMessage.value = ''), 3000)
  } catch (err) {
    error.value = 'Erreur lors de la modification du livre.'
    console.error('Update error:', err)
  }
}
</script>

<template>
  <Header />
  <h1>Modifier un livre</h1>

  <p v-if="loading">Chargement...</p>
  <p v-if="error" class="error">{{ error }}</p>
  <p v-if="successMessage" class="success">{{ successMessage }}</p>

  <!-- Affichage visuel du livre -->
  <div v-if="!loading && livre">
    <BookCard :livre="livre" />
  </div>

  <!-- Formulaire de modification -->
  <form v-if="!loading && livre" class="form-modif" @submit.prevent="modifierLivre">
    <h2>Modifier les informations du livre</h2>

    <div class="modif">
      <label for="titre">Titre :</label>
      <input id="titre" v-model="livre.titre" type="text" required />
    </div>

    <div class="modif">
      <label for="description">Description :</label>
      <textarea id="description" v-model="livre.description" required rows="4"></textarea>
    </div>

    <div class="modif">
      <label for="auteur">Auteur :</label>
      <input id="auteur" v-model="livre.auteur" type="text" required />
    </div>

    <div class="modif">
      <label for="categorie">Catégorie :</label>
      <select id="categorie" v-model="livre.categorie" required>
        <option disabled value="">Sélectionnez une catégorie</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.nom">
          {{ cat.nom }}
        </option>
      </select>
    </div>

    <div class="modif">
      <label for="pages">Pages :</label>
      <input id="pages" v-model.number="livre.pages" type="number" required min="1" />
    </div>

    <div class="modif">
      <label for="annee">Année d'édition :</label>
      <input id="annee" v-model.number="livre.annee_edition" type="number" required min="0" />
    </div>

    <button type="submit">Enregistrer les modifications</button>
  </form>

  <p v-if="!loading && !livre">Aucun livre trouvé.</p>
</template>

<style scoped>
.form-modif {
  background-color: rgb(107, 0, 0);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  border-radius: 10px;
  color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.form-modif h2 {
  margin-bottom: 1rem;
  color: #ffffff;
  text-align: center;
}
.modif {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}
.modif label {
  margin-bottom: 0.3rem;
  font-weight: bold;
}
.modif input,
.modif textarea,
.modif select {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}
button {
  padding: 0.7rem 1.2rem;
  background-color: #242424;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #522c2c;
}
.error {
  color: red;
  font-weight: bold;
  text-align: center;
}
.success {
  color: green;
  font-weight: bold;
  text-align: center;
}
</style>
