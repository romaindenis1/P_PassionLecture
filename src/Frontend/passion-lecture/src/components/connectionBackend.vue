<!-- frontend/src/views/HelloFromBackend.vue -->
<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const message = ref('')

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/livres')
    message.value = response.data.message
  } catch (error) {
    message.value = 'Erreur de connexion'
    console.error(error)
  }
})
</script>

<template>
  <div>
    <h2>Message du backend :</h2>
    <p>{{ message }}</p>
  </div>
</template>
