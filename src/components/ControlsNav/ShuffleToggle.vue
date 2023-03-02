<template>
  <div class="tooltip">
    <button @click="store.shuffle = !store.shuffle" :class="store.shuffle ? '' : 'muted'" type="button">
      <img src="@/assets/images/shuffle.svg" alt="Shuffle" aria-label="Shuffle tasks" />
    </button>
    <span class="tooltiptext">Shuffle</span>
  </div>
</template>

<script setup>
import { useStore } from '@/stores'
const store = useStore()
</script>