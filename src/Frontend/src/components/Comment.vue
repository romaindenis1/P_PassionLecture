<script setup>
// Définition des propriétés passées au composant, ici un objet "comment"
defineProps({
  comment: Object,
})
</script>

<template>
  <!-- Affichage du commentaire -->
  <div class="comment-container">
    <!-- Affichage du nom d'utilisateur de l'auteur du commentaire -->
    <h3 class="comment-author" style="font-weight: bold">{{ comment.t_utilisateur.username }}</h3>
    <!-- Affichage du contenu du commentaire -->
    <p class="comment-content">{{ comment.contenu }}</p>
  </div>
</template>

<style scoped>
.comment-container {
  background: hsla(0, 100%, 36%, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.comment-author {
  font-weight: bold;
  color: whitesmoke;
  margin-bottom: 0.5rem;
}

.comment-content {
  color: whitesmoke;
  font-size: 1rem;
}
</style>
