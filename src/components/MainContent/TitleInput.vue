<template>
    <input ref="titleRef" @change="updateTitle($refs.titleRef.value)" type="text" :value="title" class="task-title" placeholder="Name your task" />
    <input type="hidden" />
</template>

<script>
import { computed } from 'vue'
import { useStore } from '@/stores'

export default {
    setup() {
        const store = useStore()
        const updateTitle = (newTitle) => {
            store.updateTitle(newTitle)
        }
        const title = computed(() => store.title)
        return { store, updateTitle, title }
    }
}
</script>
