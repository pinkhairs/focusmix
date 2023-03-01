<template>
    <div class="tooltip">
        <button @click="store.lightningMode = !store.lightningMode" :class="store.lightningMode ? '' : 'muted'" type="button">
            <img src="@/assets/images/lightning.svg" alt="Lightning Mode" aria-label="Halves the remaining time" />
        </button>
        <span class="tooltiptext">Lightning</span>
    </div>
</template>

<script setup>
import { useStore } from '@/stores'
const store = useStore()
</script>