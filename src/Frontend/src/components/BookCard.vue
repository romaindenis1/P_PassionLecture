<script setup>
// Définition des propriétés passées au composant, ici un objet "livre"
defineProps({
  livre: Object,
})
</script>

<template>
  <!-- Affichage de l'image de couverture du livre -->
  <img :src="`http://localhost:3000${livre.imageCouverturePath}`" alt="Couverture" />

  <!-- Affichage des détails du livre -->
  <h2>{{ livre.titre }}</h2>
  <p>Auteur : {{ livre.auteur?.nom || 'Inconnu' }}</p>
  <p>Catégorie : {{ livre.categorie?.libelle || 'Non classé' }}</p>
  <p>{{ livre.resume }}</p>
  <p>Pages : {{ livre.nbPage }} | Année édition : {{ livre.anneeEdition }}</p>
  <p>
    <!-- Affichage de l'utilisateur ayant ajouté le livre -->
    <span v-if="livre.utilisateur">
      Ajouté par :
      <router-link :to="`/users/${livre.utilisateur.utilisateur_id}/livres`">
        {{ livre.utilisateur.username }}
      </router-link>
    </span>
    <span v-else>Ajouté par : Inconnu</span>
  </p>
</template>
