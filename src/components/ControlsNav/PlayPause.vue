<template>
    <div class="play-pause">
        <button v-if="store.inProgress" @click="pause()" type="button">
            <img src="@/assets/images/pause.svg" alt="Pause" aria-label="Pause task" />
        </button>
        <button v-else @click="play()" type="button">
            <img src="@/assets/images/play.svg" alt="Play" aria-label="Pause task" />
        </button>
    </div>
</template>

<script>
import { useStore } from '@/stores'
export default {
    setup() {
        const store = useStore()
        const play = () => store.play()
        const pause = () => store.pause()
        return { store, play, pause }
    }
}
</script>