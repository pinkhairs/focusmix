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