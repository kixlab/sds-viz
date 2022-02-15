<template>
  <div class="w-full h-screen flex flex-col">
    <div class="w-full h-8 grow-0 flex justify-between">
      <div> Search Engine Log Inspection Tool</div>
      <button>Next</button>
    </div>
    <div class="w-full h-full flex flex-wrap">
      <div class="w-3/5 h-full">
        <!-- Query Clusters & Search Engine Performance Metrics -->
        <filter-and-keyword-panel class="main-component w-full h-2/3 flex"/>
        <!-- Behavior Pattern Clusters -->
        <pattern-selection class="main-component w-full h-1/3"/>
      </div>
      <!-- Individual Search Sessions -->
      <query-selection class="main-component w-2/5 h-full"/>
    </div>
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
    // Initializa the global store, so that its methods that manipulates the state, could be
    // injectible in every subcomponent of this component.
    initGlobalStore();
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
