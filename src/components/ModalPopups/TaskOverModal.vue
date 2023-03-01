<template>
  <div @click="store.modal = false" class="overlay" v-if="store.modal"></div>
  <div class="modal" v-if="store.modal === 'more-time'" style="font-size: 18px; padding-bottom: 25px;">
      <button @click="store.modal = false" type="button" class="close-button">&times;</button>
      <h2>Time over</h2>
      <p>Would you like to add more time or mark this task complete?</p>
      <div style="display: flex; gap: 5px">
        <button @click="store.startOver(); store.modal = false" class="submit" type="button">More time</button>
        <button @click="store.toggleComplete(); store.modal = false" class="submit" type="button">Complete task</button>
      </div>
  </div>
</template>

<script setup>
import { useStore } from '@/stores'
const store = useStore()
</script>