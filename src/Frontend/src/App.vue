<script setup>
// Aucun script spécifique n'est nécessaire ici car ce composant sert de conteneur principal
</script>

<template>
  <!-- Le composant <router-view> rend dynamiquement le composant correspondant à la route actuelle -->
  <!-- La clé est définie sur le chemin complet de la route pour forcer le rechargement du composant si nécessaire -->
  <router-view :key="$route.fullPath"></router-view>
</template>
