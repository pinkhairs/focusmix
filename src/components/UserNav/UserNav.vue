<template>
    <nav class="site-nav">
        <ul>
          <auto-save-indicator />
          <about-site />
        </ul>
    </nav>
</template>

<script>
import AutoSaveIndicator from './AutoSaveIndicator.vue'
import AboutSite from './AboutSite.vue'

export default {
    components: {
        AutoSaveIndicator,
        AboutSite
    }
}
</script>