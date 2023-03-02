<template>
  <div class="time-selector">
    <img src="@/assets/images/time.svg" alt="" />
    <v-select v-model="defaultTime" :options="times" style="width: 50%; border: 0"></v-select>
  </div>
  <progress-bar />
</template>

<script>
import { toRaw, computed } from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import ProgressBar from '@/components/ProgressBar'
import { useStore } from '@/stores'

export default {
  components: {
    vSelect,
    ProgressBar
  },
  methods: {
    syncTime() {
      this.defaultTime = this.times.find((entry) => {
        return toRaw(entry.value) === this.time
      })
    }
  },
  watch: {
    defaultTime(newTime, oldTime) {
      if (oldTime !== newTime) {
        this.updateTime(newTime.value)
      }
    },
    time(newTime, oldTime) {
      if (oldTime !== newTime) {
        this.syncTime()
      }
    }
  },
  setup() {
    const store = useStore()
    const time = computed(() => store.time)
    const updateTime = (newTime) => {
      store.updateTime(newTime)
    }
    return { store, time, updateTime }
  },
  mounted() {
    this.syncTime()
  },
  data() {
    return {
      defaultTime: {
        label: "30 seconds",
        value: 30
      },
      times: [{
        label: "30 seconds",
        value: 30
      },
      {
        label: "1 minute",
        value: 60
      },
      {
        label: "2 minutes",
        value: 120
      },
      {
        label: "3 minutes",
        value: 180
      },
      {
        label: "4 minutes",
        value: 240
      },
      {
        label: "5 minutes",
        value: 300
      },
      {
        label: "6 minutes",
        value: 360
      },
      {
        label: "7 minutes",
        value: 420
      },
      {
        label: "8 minutes",
        value: 480
      },
      {
        label: "9 minutes",
        value: 540
      },
      {
        label: "10 minutes",
        value: 600
      },
      {
        label: "15 minutes",
        value: 900
      },
      {
        label: "20 minutes",
        value: 1200
      },
      {
        label: "25 minutes",
        value: 1500
      },
      {
        label: "30 minutes",
        value: 1800
      },
      {
        label: "45 minutes",
        value: 2700
      },
      {
        label: "1 hour",
        value: 3600
      },
      {
        label: "1 hour and 15 minutes",
        value: 4500
      },
      {
        label: "1 hour and 30 minutes",
        value: 5400
      },
      {
        label: "1 hour and 45 minutes",
        value: 6300
      },
      {
        label: "2 hours",
        value: 7200
      },
      {
        label: "2 hour and 15 minutes",
        value: 8100
      },
      {
        label: "2 hour and 30 minutes",
        value: 9000
      },
      {
        label: "2 hour and 45 minutes",
        value: 9900
      },
      {
        label: "3 hours",
        value: 10800
      },
      {
        label: "3 hour and 15 minutes",
        value: 11700
      },
      {
        label: "3 hour and 30 minutes",
        value: 12600
      },
      {
        label: "3 hour and 45 minutes",
        value: 13500
      },
      {
        label: "4 hours",
        value: 14400
      },
      {
        label: "4 hour and 15 minutes",
        value: 15300
      },
      {
        label: "4 hour and 30 minutes",
        value: 16200
      },
      {
        label: "4 hour and 45 minutes",
        value: 17100
      },
      {
        label: "5 hours",
        value: 18000
      },
      {
        label: "5 hour and 15 minutes",
        value: 18900
      },
      {
        label: "5 hour and 30 minutes",
        value: 19800
      },
      {
        label: "5 hour and 45 minutes",
        value: 20700
      },
      {
        label: "6 hours",
        value: 21600
      },
      {
        label: "6 hour and 15 minutes",
        value: 22500
      },
      {
        label: "6 hour and 30 minutes",
        value: 23400
      },
      {
        label: "6 hour and 45 minutes",
        value: 24300
      },
      {
        label: "7 hours",
        value: 25200
      },
      {
        label: "7 hour and 15 minutes",
        value: 26100
      },
      {
        label: "7 hour and 30 minutes",
        value: 27000
      },
      {
        label: "7 hour and 45 minutes",
        value: 27900
      },
      {
        label: "8 hours",
        value: 28800
      }]
    }
  }
}
</script>

<style scoped>
.time-selector {
  display: flex;
  gap: 10px;
}
.vs__actions {
  display: none !important
}
.vs__dropdown-toggle {
  border: 0 !important;
}
</style>