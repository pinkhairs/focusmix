<template>
    <div class="mark-complete">
        <button @click="toggleComplete" type="button">
            <img v-if="store.complete" src="@/assets/images/checkmark-done.svg" alt="Yay!" aria-label="All done!" />
            <img v-else src="@/assets/images/mark-complete.svg" alt="Mark Complete" />
        </button>
    </div>
</template>

<script setup>
import { useStore } from '@/stores'
const store = useStore()
const toggleComplete = () => store.toggleComplete()
</script>