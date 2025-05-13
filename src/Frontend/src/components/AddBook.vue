<template>
    <form @submit.prevent="soumettreFormulaire" enctype="multipart/form-data">
      <div>
        <label>Image de couverture:</label>
        <input type="file" @change="handleFichier" />
      </div>
  
      <div>
        <label>Titre:</label>
        <input type="text" v-model="livre.titre" />
      </div>
  
      <div>
        <label>Auteur:</label>
        <input type="text" v-model="livre.auteur" />
      </div>
  
      <div>
        <label>Catégorie:</label>
        <input type="text" v-model="livre.categorie" />
      </div>
  
      <div>
        <label>Nombre de pages:</label>
        <input type="number" v-model="livre.nbPage" />
      </div>
  
      <div>
        <label>Résumé:</label>
        <textarea v-model="livre.resume"></textarea>
      </div>
  
      <div>
        <label>Année d’édition:</label>
        <input type="number" v-model="livre.anneeEdition" />
      </div>
  
      <button type="submit">Ajouter</button>
    </form>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'AjouterLivreForm',
    data() {
      return {
        livre: {
          titre: '',
          auteur: '',
          categorie: '',
          nbPage: '',
          resume: '',
          anneeEdition: ''
        },
        image: null
      };
    },
    methods: {
      handleFichier(event) {
        this.image = event.target.files[0];
      },
      async soumettreFormulaire() {
        try {
          const formData = new FormData();
          formData.append('imageCouverture', this.image);
          for (const key in this.livre) {
            formData.append(key, this.livre[key]);
          }
          console.log(formData);
          
          await axios.post('http://localhost:3000/livres/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          });
  
          alert('Livre ajouté avec succès !');
          this.$router.push('/');
        } catch (error) {
          console.error(error);
          alert('Erreur lors de l’ajout du livre.');
        }
      }
    }
  };
  </script>
  