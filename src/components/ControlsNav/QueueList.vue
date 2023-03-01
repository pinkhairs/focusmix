<template>
    <div class="queue">
        <button @click="store.modal = 'queue'" type="button">
            <img src="@/assets/images/queue.svg" alt="List" />
        </button>
    </div>
</template>

<script setup>
import { useStore } from '@/stores'
const store = useStore()
</script>