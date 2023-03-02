<template>
  <div class="mark-complete">
    <button @click="toggleComplete" type="button">
      <img v-if="store.completed" src="@/assets/images/checkmark-done.svg" alt="Yay!" aria-label="All done!" />
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

<style>
@media (min-width: 0px) and (max-width: 1023px) {
  .mark-complete {
    position: relative;
    left: 10px;
  }
  .mark-complete img {
    width: 50px;
  }
}
@media (min-width: 1024px) {
  .mark-complete {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
.mark-complete {
  flex: 1;
}
</style>