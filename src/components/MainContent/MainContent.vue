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
.container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
</style>