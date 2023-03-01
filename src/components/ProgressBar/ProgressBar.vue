<template>
    <div @click="store.goToNextColor()" style="width: 30px" class="color" :style="{ backgroundColor: store.color }"></div>
        <div class="progress-bar">
          <div class="progress-bar-color" @click="store.goToNextColor()" :style="{width: store.progressBar, backgroundColor: store.color, transitionDuration: store.duration}">
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from '@/stores'

export default {
    setup() {
        const store = useStore()
        store.pause() // to set progress bar width at start
        const time = computed(() => store.time)
        return { store, time }
    },
    unmounted() {
      this.store.pause()
    },
    data() {
        return {
            progressBarWidth: '1px',
        }
    }
}
</script>