<script setup>
// Déclaration de la prop "livre" reçue depuis le composant parent
defineProps({
  livre: Object,
})
</script>

<template>
  <!-- Lien vers la page de détails du livre -->
  <router-link :to="`/livres/${livre.livre_id}`" class="livre-card">
    <!-- Image de couverture -->
    <img
      :src="`http://localhost:3000${livre.imageCouverturePath}`"
      alt="Couverture"
      class="livre-cover"
    />

    <!-- Informations du livre -->
    <div class="livre-details">
      <h2>{{ livre.titre }}</h2>
      <p>Auteur : {{ livre.auteur?.nom || 'Inconnu' }}</p>
      <p>Catégorie : {{ livre.categorie?.libelle || 'Non classé' }}</p>

      <p>
        <router-link
          v-if="livre.utilisateur"
          :to="`/users/${livre.utilisateur.utilisateur_id}/livres`"
        >
          Ajouté par : {{ livre.utilisateur.username }}
        </router-link>
        <span v-else>Ajouté par : Inconnu</span>
      </p>
    </div>
  </router-link>
</template>

<style scoped>
/* Style du conteneur principal de la carte du livre */
.livre-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin: 3% 0 3% 3%;
  border-radius: 3%;
  margin-bottom: 2rem; /* Ajoute un espace vertical entre les livres */
}

/* Image de couverture */
.livre-cover {
  width: 250px;
  height: 350px;
  object-fit: cover;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 0;
}

/* Détails du livre */
.livre-details {
  flex: 1;
}

/* Grille possible (non utilisée ici directement) */
.livre-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
</style>
