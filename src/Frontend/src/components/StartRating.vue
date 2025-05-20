<script setup>
import { defineProps, defineEmits, ref } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  readOnly: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const hoverValue = ref(0)

const setRating = (value) => {
  if (!props.readOnly) {
    emit('update:modelValue', value)
  }
}
</script>

<template>
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
