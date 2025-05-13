<script setup>
defineProps({
  livre: Object,
})
</script>

<template>
  <img :src="`http://localhost:3000${livre.imageCouverturePath}`" alt="Couverture" />

  <h2>{{ livre.titre }}</h2>
  <p>Auteur : {{ livre.auteur?.nom || 'Inconnu' }}</p>
  <p>Catégorie : {{ livre.categorie?.libelle || 'Non classé' }}</p>
  <p>{{ livre.resume }}</p>
  <p>Pages : {{ livre.nbPage }} | Année édition : {{ livre.anneeEdition }}</p>
  <p>
    <span v-if="livre.utilisateur">
      Ajouté par :
      <router-link :to="`/users/${livre.utilisateur.utilisateur_id}/livres`">
        {{ livre.utilisateur.username }}
      </router-link>
    </span>
    <span v-else>Ajouté par : Inconnu</span>
  </p>
</template>
