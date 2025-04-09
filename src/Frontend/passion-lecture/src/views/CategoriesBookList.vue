<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Toutes les catégories</h1>
    <ul>
      <li v-for="category in categories" :key="category.id" class="mb-2">
        <router-link :to="`/categories/${category.id}`" class="text-blue-600 hover:underline">
          {{ category.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCategories } from '@/services/BookService'

const categories = ref([])

onMounted(async () => {
  categories.value = await getCategories()
})
</script>
