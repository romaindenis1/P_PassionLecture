<script setup>
defineProps({
  comment: Object,
})
</script>

<template>
  <div>
      <h3 style="font-weight: bold;">{{ comment.t_utilisateur.username }}</h3>
      <p>{{ comment.contenu }}</p>
  </div>
</template>
