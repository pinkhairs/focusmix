<template>
  <li class="muted">
    <button @click="blink = true" type="button">
      <img :class="blink ? 'blink' : ''" src="@/assets/images/cloud.svg" alt="Autosave" aria-label="Autosaving" />
    </button>
  </li>
</template>

<script>
export default {
  data() {
    return {
      blink: false
    }
  },
  mounted() {
    setInterval(() => {
      this.blink = true
      setTimeout(() => {
        this.blink = false
      }, 1000)
    }, 5000)
  }
}
</script>

<style>
.blink {
  animation: blink-animation 1s infinite;
  -webkit-animation: blink-animation 1s infinite;
}
@keyframes blink-animation {
  0% {
    opacity: .5
  }
  25% {
    opacity: 1
  }
  50% {
    opacity: .5
  }
}
</style>