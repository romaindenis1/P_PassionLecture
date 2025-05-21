<script setup>
// Déclaration de la prop "comment" reçue depuis le parent
defineProps({
  comment: Object,
})
</script>

<template>
  <div class="comment-container">
    <!-- Nom de l'utilisateur ayant écrit le commentaire -->
    <h3 class="comment-author">{{ comment.t_utilisateur.username }}</h3>

    <!-- Contenu du commentaire -->
    <p class="comment-content">{{ comment.contenu }}</p>
  </div>
</template>

<style scoped>
/* Conteneur principal du commentaire */
.comment-container {
  background: hsla(0, 100%, 36%, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* Style du nom de l'auteur */
.comment-author {
  font-weight: bold;
  color: whitesmoke;
  margin-bottom: 0.5rem;
}

/* Style du contenu du commentaire */
.comment-content {
  color: whitesmoke;
  font-size: 1rem;
}
</style>
