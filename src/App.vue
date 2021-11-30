<template>
  <div class="w-full h-full flex">
    <div class="w-3/5 h-full">
      <filter-and-keyword-panel class="main-component w-full h-2/3 flex"/>
      <pattern-selection class="main-component w-full h-1/3"/>
    </div>
    <query-selection class="main-component w-2/5 h-full"/>
  </div>
</template>

<script>

import PatternSelection from './components/Behavior/PatternSelection.vue';
import QuerySelection from './components/QueryList/QuerySelection.vue';
import { initGlobalStore } from "@/stores/globalStoreAgent.js";
import FilterAndKeywordPanel from './components/FilterAndKeyword/FilterAndKeywordPanel.vue';
// import {computed} from "vue";

export default {
  name: 'App',
  components: {
    PatternSelection,
    QuerySelection,
    FilterAndKeywordPanel
  },
  setup() {
    const necessaryMethods = initGlobalStore();
    necessaryMethods;
    return {  
      
    }
  },
}
</script>

<style>
.main-component {
  padding: 8px;
  border-width: 1px;
  border-color: gray;
  border-style: solid;
  border-radius: 5px;
}
</style>
