<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const props = defineProps({
    id: {
        type: Number,
        required: true
    }
)

const message = ref('')

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/categories/:id/livres')
    message.value = response.data.message
  } catch (error) {
    message.value = 'Erreur de connexion'
    console.error(error)
  }
})
</script>

<template>
    <RouterLink :to="{ name : CategoryBooks, params: {id : Category.id}}">
        <div>
            <h2>Message du backend :</h2>
            <p>{{ message }}</p>
        </div>
    </RouterLink>
</template>
