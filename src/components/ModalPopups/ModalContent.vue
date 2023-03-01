<template>
  <about-site-modal />
  <queue-modal />
  <task-over-modal />
</template>

<script>
import AboutSiteModal from './AboutSiteModal.vue'
import QueueModal from './QueueModal.vue'
import TaskOverModal from './TaskOverModal.vue'

export default {
  components: {
    AboutSiteModal,
    QueueModal,
    TaskOverModal
  }
}
</script>