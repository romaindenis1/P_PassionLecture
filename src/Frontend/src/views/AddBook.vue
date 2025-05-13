<template>
  <!-- Inclusion du composant d'en-tête -->
  <Header></Header>
  <div>
    <!-- Titre de la page pour indiquer l'action actuelle -->
    <h2>Ajouter un livre</h2>
    <!-- Composant pour le formulaire d'ajout de livre -->
    <AjouterLivreForm />
    <!-- Lien pour retourner à la page d'accueil avec un bouton -->
    <router-link to="/">
      <button>Retour</button>
    </router-link>
  </div>
  <!-- Inclusion du composant de pied de page -->
  <Footer></Footer>
</template>

<script>
// Importation du composant pour le formulaire d'ajout de livre
import AjouterLivreForm from '@/components/AjouterLivreForm.vue'

export default {
  // Nom du composant pour identifier cette vue
  name: 'AjouterLivre',
  // Déclaration des composants utilisés dans cette vue
  components: {
    AjouterLivreForm,
    // Les composants Footer et Header sont directement utilisés dans le template
  },
}
</script>
