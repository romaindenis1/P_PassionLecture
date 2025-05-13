<script setup>
// Définition des propriétés passées au composant, ici un objet "comment"
defineProps({
  comment: Object,
})
</script>

<template>
  <!-- Affichage du commentaire -->
  <div>
    <!-- Affichage du nom d'utilisateur de l'auteur du commentaire -->
    <h3 style="font-weight: bold">{{ comment.t_utilisateur.username }}</h3>
    <!-- Affichage du contenu du commentaire -->
    <p>{{ comment.contenu }}</p>
  </div>
</template>
