<template>
  <main class="container">
    <title-input />
    <time-selector />
    <the-editor />
  </main>
</template>

<script>
import TitleInput from './TitleInput.vue'
import TimeSelector from './TimeSelector.vue'
import TheEditor from './TheEditor.vue'

export default {
  components: {
    TitleInput,
    TimeSelector,
    TheEditor
  }
}
</script>

<style scoped>
@media (min-width: 1024px) {
  .container {
    margin: 0 auto;
    width: 650px;
    padding-top: 80px;
  }
}
.container {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
@media (min-width: 0px) and (max-width: 1023px) {
  .container {
    padding-top: 10px;
    width: 100%;
    padding: 20px;
  }
}
</style>
