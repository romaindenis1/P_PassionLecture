<script setup>
import { ref, onMounted } from 'vue'
import BookCard from '@/components/BookCard.vue'
import BookService from '@/services/BookService.js'

const books = ref(null)

onMounted(() => {
  BookService.getBooks()
    .then((response) => {
      books.value = response.data
    })
    .catch((error) => {
      console.log(error)
    })
})
</script>

<template>
    <h1>Top 5 Books</h1>
    <div v-if="books > 0" class="books">
      <BookCard v-for="book in books" :key="book.id" :book="book" />
    </div>
    <div v-else>
      Loading books...
    </div>
  </template>
  

<style scoped>
.books {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
