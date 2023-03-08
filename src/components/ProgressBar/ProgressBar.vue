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
  }
}
</script>

<style>
.color, .progress-bar, .progress-bar-color {
  position: fixed;
  height: 100vh;
  top: 0;
  z-index: -2;
}
.progress-bar {
  left: 30px;
}
.progress-bar-color {
  transition-property: width;
  transition-timing-function: linear;
  transition-duration: 60s;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 30px;
  width: 0;
  max-width: calc(100vw - 30px)
}
.color {
  left: 0;
  min-width: 30px;
  z-index: -1;
}
</style>