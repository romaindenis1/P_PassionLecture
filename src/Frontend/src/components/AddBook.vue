<template>
  <!-- Formulaire pour ajouter un livre -->
  <form @submit.prevent="soumettreFormulaire" enctype="multipart/form-data">
    <!-- Champ pour l'image de couverture -->
    <div>
      <label>Image de couverture:</label>
      <input type="file" @change="handleFichier" />
    </div>

    <!-- Champ pour le titre -->
    <div>
      <label>Titre:</label>
      <input type="text" v-model="livre.titre" />
    </div>

    <!-- Champ pour l'auteur -->
    <div>
      <label>Auteur:</label>
      <input type="text" v-model="livre.auteur" />
    </div>

    <!-- Champ pour la catégorie -->
    <div>
      <label>Catégorie:</label>
      <input type="text" v-model="livre.categorie" />
    </div>

    <!-- Champ pour le nombre de pages -->
    <div>
      <label>Nombre de pages:</label>
      <input type="number" v-model="livre.nbPage" />
    </div>

    <!-- Champ pour le résumé -->
    <div>
      <label>Résumé:</label>
      <textarea v-model="livre.resume"></textarea>
    </div>

    <!-- Champ pour l'année d'édition -->
    <div>
      <label>Année d’édition:</label>
      <input type="number" v-model="livre.anneeEdition" />
    </div>

    <!-- Bouton de soumission -->
    <button type="submit">Ajouter</button>
  </form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AjouterLivreForm',
  data() {
    return {
      // Données du livre saisies par l'utilisateur
      livre: {
        titre: '',
        auteur: '',
        categorie: '',
        nbPage: '',
        resume: '',
        anneeEdition: '',
      },
      // Fichier image de couverture sélectionné
      image: null,
    }
  },
  methods: {
    // Enregistre le fichier sélectionné dans la propriété "image"
    handleFichier(event) {
      this.image = event.target.files[0]
    },
    // Envoie le formulaire avec les données du livre et l'image à l'API
    async soumettreFormulaire() {
      try {
        const formData = new FormData()
        formData.append('imageCouverture', this.image)

        // Ajoute chaque champ du livre au FormData
        for (const key in this.livre) {
          formData.append(key, this.livre[key])
        }

        // Envoie les données à l'API backend
        await axios.post('http://localhost:3000/livres/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, // pour inclure les cookies (si nécessaire pour l’authentification)
        })

        alert('Livre ajouté avec succès !')
        this.$router.push('/')
      } catch (error) {
        console.error(error)
        alert('Erreur lors de l’ajout du livre.')
      }
    },
  },
}
</script>

<style scoped>
form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem;
  border-radius: 8px;
  background: hsla(0, 100%, 36%, 0.2);
}

div {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #fff;
}

input[type='text'],
input[type='number'],
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #bbb;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  color: #bbb;
}

button[type='submit'] {
  background: #b80000;
  color: #fff;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

button[type='submit']:hover {
  background: hsla(0, 100%, 36%, 0.2);
}
</style>
