<script setup>
import { ref } from 'vue'

// Déclaration des props pour gérer la note et l'état lecture seule
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  readOnly: { type: Boolean, default: false },
})

// Déclaration de l’événement émis à la mise à jour de la note
const emit = defineEmits(['update:modelValue'])

// État temporaire pour survol (hover)
const hoverValue = ref(0)

// Met à jour la note si non en lecture seule
const setRating = (value) => {
  if (!props.readOnly) {
    emit('update:modelValue', value)
  }
}
</script>

<template>
  <!-- Composant de notation en étoiles -->
  <div style="display: flex; gap: 5px; cursor: pointer">
    <span
      v-for="i in 5"
      :key="i"
      @click="setRating(i)"
      @mouseover="hoverValue = i"
      @mouseleave="hoverValue = 0"
      :style="{
        color: hoverValue >= i || (!hoverValue && modelValue >= i) ? 'gold' : 'lightgray',
        fontSize: '24px',
      }"
    >
      ★
    </span>
  </div>
</template>
