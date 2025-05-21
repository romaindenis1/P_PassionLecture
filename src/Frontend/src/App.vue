<script setup>
// Aucun script requis : ce composant agit uniquement comme conteneur pour le router
</script>

<template>
  <!-- Affiche dynamiquement le composant correspondant à la route actuelle -->
  <!-- La clé force le rechargement du composant si le chemin change -->
  <router-view :key="$route.fullPath" />
</template>
