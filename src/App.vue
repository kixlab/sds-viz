<template>
  <div class="w-full h-full flex">
    <information class="w-1/3 h-full bg-red-300"/>
    <visualization class="w-2/3 h-full bg-gray-400"/>
  </div>
</template>

<script>

import Visualization from './components/Visualization.vue';
import Information from './components/Information.vue';

export default {
  name: 'App',
  components: {
    Visualization,
    Information,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
