<script setup>
import { onMounted, ref } from 'vue'
import { api, getAuthorIdByName, createAuthor } from '../services/api'
import Header from '@/components/Header.vue'
import BookCard from '@/components/BookCard.vue'
import router from '@/router'
import Footer from '@/components/Footer.vue'

// Récupération de la prop contenant l'ID du livre à modifier
const props = defineProps(['livre_id'])

const livre = ref(null)
const loading = ref(true)
const error = ref('')
const successMessage = ref('')
const categories = ref([])

const id = props.livre_id

// Chargement des données du livre + des catégories disponibles
onMounted(async () => {
  try {
    const [bookResponse, categoriesResponse] = await Promise.all([
      api.get(`/livres/${id}`),
      api.get('/categories'),
    ])
    livre.value = bookResponse.data.data
    categories.value = categoriesResponse.data.categories
  } catch (err) {
    error.value = 'Erreur lors du chargement des données.'
    console.error('Loading error:', err)
  } finally {
    loading.value = false
  }
})

// Soumission du formulaire de modification
const modifierLivre = async () => {
  error.value = ''
  successMessage.value = ''

  try {
    // Vérifie que le nom de l'auteur est renseigné
    if (!livre.value.auteur || !livre.value.auteur.nom) {
      error.value = "Le nom de l'auteur est requis."
      return
    }

    // Vérifie l'existence de l'auteur ou le crée
    let auteurId
    try {
      const response = await getAuthorIdByName(livre.value.auteur.nom)
      auteurId = response.data.auteur_id
    } catch (err) {
      if (err.response?.status === 404) {
        const createResponse = await createAuthor(livre.value.auteur.nom)
        auteurId = createResponse.data.data.auteur_id
      } else {
        throw err
      }
    }

    // Préparation des données à envoyer
    const data = {
      titre: livre.value.titre,
      resume: livre.value.resume,
      nbPage: livre.value.nbPage,
      anneeEdition: livre.value.anneeEdition,
      categorie_fk: livre.value.categorie.categorie_id,
      auteur_fk: auteurId,
    }

    // Requête PUT pour enregistrer les modifications
    await api.put(`/livres/${id}`, data)

    successMessage.value = 'Livre modifié avec succès. Retour en arrière...'

    // Redirection après 1,5 seconde
    setTimeout(() => {
      successMessage.value = ''
      window.history.length > 1 ? router.back() : (location.href = '/')
    }, 1500)
  } catch (err) {
    error.value = 'Erreur lors de la modification du livre.'
    console.error('Update error:', err)
  }
}
</script>

<template>
  <Header></Header> />
  <h1>Modifier un livre</h1>

  <!-- Messages système -->
  <p v-if="loading">Chargement...</p>
  <p v-if="error" class="error">{{ error }}</p>
  <p v-if="successMessage" class="success">{{ successMessage }}</p>

  <!-- Affichage du livre actuel (existant) -->
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
      <textarea id="description" v-model="livre.resume" required rows="4"></textarea>
    </div>

    <div class="modif">
      <label for="auteur">Auteur :</label>
      <input id="auteur" v-model="livre.auteur.nom" type="text" required />
    </div>

    <div class="modif">
      <label for="categorie">Catégorie :</label>
      <select id="categorie" v-model="livre.categorie.categorie_id" required>
        <option disabled value="">Sélectionnez une catégorie</option>
        <option v-for="cat in categories" :key="cat.categorie_id" :value="cat.categorie_id">
          {{ cat.libelle }}
        </option>
      </select>
    </div>

    <div class="modif">
      <label for="pages">Pages :</label>
      <input id="pages" v-model.number="livre.nbPage" type="number" required min="1" />
    </div>

    <div class="modif">
      <label for="annee">Année d'édition :</label>
      <input id="annee" v-model.number="livre.anneeEdition" type="number" required min="0" />
    </div>

    <button type="submit">Enregistrer les modifications</button>
  </form>

  <p v-if="!loading && !livre">Aucun livre trouvé.</p>

  <Footer></Footer>
</template>

<style scoped>
/* Style du conteneur principal de la page d'administration */
img {
  height: 350px;
}

/* Style du conteneur principal de la page d'administration */
.form-modif {
  padding: 2rem;
  margin: 2rem auto;
  max-width: 800px;
  color: white;
}

/* Style du conteneur principal de la page d'administration */
.form-modif h2 {
  margin-bottom: 1rem;
  color: #ffffff;
  text-align: center;
}

/* Style du conteneur principal de la page d'administration */
.modif {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}

/* Style des champs de saisie */
.modif label {
  margin-bottom: 0.3rem;
  font-weight: bold;
}

/* Style des champs de saisie */
.modif input,
.modif textarea,
.modif select {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

/* Style du bouton de soumission */
button {
  padding: 0.7rem 1.2rem;
  background-color: #242424;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Effet au survol (pour les périphériques compatibles) */
button:hover {
  background-color: #522c2c;
}

/* Style du conteneur principal de la page d'administration */
.error {
  color: red;
  font-weight: bold;
  text-align: center;
}

/* Style pour les messages d'erreur */
.success {
  color: green;
  font-weight: bold;
  text-align: center;
}

/* Style pour les messages de succès */
.note {
  display: none;
}
</style>
