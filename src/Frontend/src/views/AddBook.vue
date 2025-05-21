<template>
  <Header></Header> />

  <div>
    <h2>Ajouter un livre</h2>

    <!-- Formulaire d’ajout de livre -->
    <AjouterLivreForm />

    <!-- Lien de retour à la page d’accueil -->
    <router-link to="/">
      <button>Retour</button>
    </router-link>
  </div>

  <Footer></Footer> />
</template>

<script>
import AjouterLivreForm from '@/components/AjouterLivreForm.vue'

export default {
  name: 'AjouterLivre',
  components: {
    AjouterLivreForm,
  },
}
</script>

<style scoped>
/* Aucun style spécifique pour cette page */
</style>
