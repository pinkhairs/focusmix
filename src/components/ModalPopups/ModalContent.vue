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

<style>
.modal {
  background: #fff;
  width: 355px;
  padding: 0 30px;
  margin: 0 auto;
  z-index: 102;
  border-radius: 4px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: left;
}
.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(222, 222, 222, .5);
  z-index: 101;
  display: grid;
  place-items: center;
}
</style>