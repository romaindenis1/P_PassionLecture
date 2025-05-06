<script setup>
defineProps({
  livre: Object,
})
</script>

<template>
  <router-link :to="`/livres/${livre.livre_id}`" class="livre-card">
    <div class="livre-card">
      <img
        :src="`http://localhost:3000${livre.imageCouverturePath}`"
        alt="Couverture"
        class="livre-cover"
      />
      <div class="livre-details">
        <h2>{{ livre.titre }}</h2>
        <p>Auteur : {{ livre.auteur?.nom || 'Inconnu' }}</p>
        <p>Catégorie : {{ livre.categorie?.libelle || 'Non classé' }}</p>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.livre-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-top: 3%;
  margin-bottom: 3%;
  margin-left: 3%;
  border-radius: 3%;
}

.livre-cover {
  width: 250px;
  height: 350px;
  object-fit: cover;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 0%;
}

.livre-details {
  flex: 1;
}

/* Ajout d'une grille pour afficher 2 livres par ligne */
.livre-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
</style>
