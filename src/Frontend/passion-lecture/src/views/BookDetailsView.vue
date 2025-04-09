<script setup>
import { ref, onMounted } from 'vue'
import BookService from '@/services/BookService.js'

const props = defineProps({
  id: {
    required: true,
  },
})

const book = ref([])

onMounted(() => {
  BookService.getBooks(props.id)
  console.log('BookListView mounted')
    .then((response) => {
        console.log('Response data:', response.data)
      book.value = response.data
    })
    .catch((error) => {
      console.log(error)
    })
})
</script>

<template>
  <div v-if="book">
    <h1>{{ book.titre }}</h1>
    <p>{{ book.resume }} </p>
  </div>
</template>
