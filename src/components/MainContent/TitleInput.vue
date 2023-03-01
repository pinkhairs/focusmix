<template>
    <input type="text" v-model="title" @change="updateTitle(title)" class="task-title" placeholder="Name your task" />
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '@/stores'

const store = useStore()
const title = computed(() => store.title)
const updateTitle = (newTitle) => {
    store.updateTitle(newTitle)
}
</script>
