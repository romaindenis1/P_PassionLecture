<script setup>
defineProps({
  livre: Object,
})
</script>

<template>
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
</template>

<style scoped>
.livre-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.livre-cover {
  width: 250px;
  height: 350px;
  object-fit: cover;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 3%;
}

.livre-details {
  flex: 1;
}
</style>
