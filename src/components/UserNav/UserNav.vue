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

<style>
.site-nav button {
  position: relative;
  z-index: 60;
}
.site-nav {
  z-index: 60;
  text-align: right;
  display: inline-block;
  position: relative;
}
@media (min-width: 0px) and (max-width: 1023px) {
  .site-nav {
    position: relative;
    float: right;
  }
}
@media (min-width: 1024px) {
  .site-nav {
    position: fixed;
    top: 0;
    right: 0;
  }
}
.site-nav ul {
  list-style: none;
  margin: 10px 10px 0 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
</style>