<script setup>
defineProps({
  livre: Object,
})
</script>

<template>
  <div>
    <img :src="`http://localhost:3000${livre.imageCouverturePath}`" alt="Couverture" />
    <p>Image URL: {{ `http://localhost:3000${livre.imageCouverturePath}` }}</p>
    <!-- Debugging -->
    <div>
      <h2>{{ livre.titre }}</h2>
      <p>Auteur : {{ livre.auteur?.nom || 'Inconnu' }}</p>
      <p>Catégorie : {{ livre.categorie?.libelle || 'Non classé' }}</p>
      <p>{{ livre.resume }}</p>
      <p>Pages : {{ livre.nbPage }} | Année édition : {{ livre.anneeEdition }}</p>
    </div>
  </div>
</template>
