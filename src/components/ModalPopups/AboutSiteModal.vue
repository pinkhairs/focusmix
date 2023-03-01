<template>
    <div @click="store.modal = false" class="overlay" v-if="store.modal"></div>
    <div class="modal" v-if="store.modal === 'about'" style="font-size: 18px">
        <button @click="store.modal = false" type="button" class="close-button">&times;</button>
        <h2>Hey, I’m Diana ✌🏼</h2>
        <p>I’m a <a href="https://pixelswithin.com" target="_blank">freelance web designer and developer</a> based in New Mexico. I built Focusmix with Vue.js, Pinia, and Editor.js.</p>
        <p>Focusmix is in <strong>BETA</strong>: It only saves information to your own computer.</p>
        <p>Need support? Email <a href="mailto:me@diana.nu">me@diana.nu</a>.</p>
        <form>
            <p style="padding-bottom: 10px; line-height: 2; font-size: 15px; display: inline-flex; gap: 10px"><button @click="store.modal = false" type="submit">OK</button></p>
        </form>
    </div>
</template>

<script setup>
import { useStore } from '@/stores'
const store = useStore()
</script>