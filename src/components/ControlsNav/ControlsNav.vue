<template>
  <footer class="controls">
    <queue-list />
    <div class="action">
      <play-pause />
    </div>
    <mark-complete />
  </footer>
</template>

<script>
import QueueList from './QueueList.vue'
import PlayPause from './PlayPause.vue'
import MarkComplete from './MarkComplete.vue'

export default {
  components: {
    QueueList,
    PlayPause,
    MarkComplete
  }
}
</script>

<style scoped>
@media (min-width: 0px) and (max-width: 1023px) {
  .controls {
    width: 100%;
    padding: 20px;
  }
}
@media (min-width: 1024px) {
  .controls {
    margin: 0 auto;
  }
}

.controls {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 10px 10px 30px;
  background: rgba(255,255,255,.95);
  z-index: 100;
  display: grid;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
}
@media (min-width: 0px) and (max-width: 1023px) {
  .controls {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    align-items: center;
    padding: 10px 10px;
  }
}
@media (min-width: 1024px) {
  .controls {
    border-radius: 100px;
    bottom: 20px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
.action {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 30px;
}
@media (max-width: 1023px) {
  .action {
    justify-content: center;
  }
}
</style>