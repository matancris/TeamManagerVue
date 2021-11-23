<template>
  <div id="app">
    <app-header />
    <router-view />
  </div>
</template>

<script>
import AppHeader from '../src/cmps/AppHeader.vue'
export default {
  components: {
    AppHeader
  }
}
</script>