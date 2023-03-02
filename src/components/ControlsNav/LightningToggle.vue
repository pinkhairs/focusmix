<template>
  <div class="tooltip">
    <button @click="store.lightningMode = !store.lightningMode" :class="store.lightningMode ? '' : 'muted'" type="button">
      <img src="@/assets/images/lightning.svg" alt="Lightning Mode" aria-label="Halves the remaining time" />
    </button>
    <span class="tooltiptext">Lightning</span>
  </div>
</template>

<script setup>
import { useStore } from '@/stores'
const store = useStore()
</script>

<style>

.tooltip {
  position: relative;
  display: block;
}
.tooltiptext {
  display: none;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  min-width: 80px !important;
  position: absolute;
  z-index: 1;
  font-size: 14px;
}
.tooltip:hover .tooltiptext {
  display: block;
}
.tooltiptext {
  width: 120px;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
}
.tooltiptext {
  width: 120px;
  bottom: -100%;
  left: 50%;
  transform: translateX(-50%);
}
</style>