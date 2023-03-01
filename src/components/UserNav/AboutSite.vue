<template>
    <li>
        <button @click="store.modal = 'about'" type="button" target="_blank">
            <img src="@/assets/images/dots.svg" alt="More" aria-label="About this site">
        </button>
    </li>
</template>

<script setup>
import { useStore } from '@/stores'
const store = useStore()
</script>