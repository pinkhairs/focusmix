<template>
    <div class="mark-complete">
        <button @click="toggleComplete" type="button">
            <img v-if="completed" src="@/assets/images/checkmark-done.svg" alt="Yay!" aria-label="All done!" />
            <img v-else src="@/assets/images/mark-complete.svg" alt="Mark Complete" />
        </button>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from '@/stores'

export default {
    data() {
        return {
            completed: false
        }
    },
    setup() {
        const store = useStore()
        const toggleComplete = () => store.toggleComplete()
        return { store, toggleComplete }
    },
    mounted() {
        this.completed = computed(() => this.store.completed)
    }
}
</script>