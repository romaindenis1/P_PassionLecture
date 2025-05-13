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

    <!-- Bouton pour soumettre le formulaire -->
    <button type="submit">Ajouter</button>
  </form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AjouterLivreForm',
  data() {
    return {
      // Données du livre à ajouter
      livre: {
        titre: '',
        auteur: '',
        categorie: '',
        nbPage: '',
        resume: '',
        anneeEdition: '',
      },
      // Fichier image sélectionné
      image: null,
    }
  },
  methods: {
    // Gestion du fichier sélectionné
    handleFichier(event) {
      this.image = event.target.files[0]
    },
    // Soumission du formulaire
    async soumettreFormulaire() {
      try {
        const formData = new FormData()
        formData.append('imageCouverture', this.image)
        for (const key in this.livre) {
          formData.append(key, this.livre[key])
        }
        console.log(formData)

        // Envoi des données à l'API
        await axios.post('http://localhost:3000/livres/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
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
