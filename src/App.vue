<template>
  <div class="w-full h-screen flex flex-col">
    <div class="w-full h-auto grow-0 flex justify-start items-center relative">
      <div class="grow-0 py-2 px-4">
        <button 
          v-show="page === 2" 
          @click="page = 1"
          class="bg-red-500 text-white rounded-md px-2 py-1">Prev</button>
      </div>
      <div class="flex-1 grow"> 
        <span class="text-xl font-bold">Search Engine Performance Diagnosis</span>
      </div>
      <div class="grow-0 py-2 px-4">
        <button 
          @click="toggleActionItems()"
          class="bg-blue-500 text-white rounded-md px-2 py-1">Action Items</button>
      </div>
      <div class="grow-0 py-2 px-4">
        <button 
          v-show="page === 1" 
          @click="page = 2"
          class="bg-blue-500 text-white rounded-md px-2 py-1">Next</button>
      </div>
    </div>
    <div v-if="page === 1" class="w-full h-full flex flex-wrap">
      <div class="w-3/5 h-full">
        <!-- Behavior Pattern Clusters -->
        <pattern-selection class="main-component w-full h-1/3"/>
        <!-- Query Clusters & Search Engine Performance Metrics -->
        <filter-and-keyword-panel class="main-component w-full h-2/3 flex"/>
      </div>
      <!-- Individual Search Sessions -->
      <query-selection class="main-component w-2/5 h-full"/>
    </div>
    <div v-else-if="page === 2" class="w-full h-full flex">
      <selected-sessions class="main-component w-2/5 h-full"/>

      <div class="w-3/5 h-full">
      </div>

    </div>

    <div v-show="showActionItems" class="absolute z-10 top-10 right-1/4 shadow-md rounded-md w-1/5 h-1/5 bg-white">
      List of Action Items
      <action-items class="w-full h-full"/>
    </div>

  </div>
</template>

<script>

import PatternSelection from './components/Behavior/PatternSelection.vue';
import QuerySelection from './components/QueryList/QuerySelection.vue';
import { initGlobalStore } from "@/stores/globalStoreAgent.js";
import FilterAndKeywordPanel from './components/FilterAndKeyword/FilterAndKeywordPanel.vue';
import SelectedSessions from './components/QueryList/SelectedSessions.vue';
import ActionItems from './components/ActionItems/ActionItems.vue';
// import {computed} from "vue";

export default {
  name: 'App',
  components: {
    PatternSelection,
    QuerySelection,
    FilterAndKeywordPanel,
    SelectedSessions,
    ActionItems
  },
  setup() {
    // Initializa the global store, so that its methods that manipulates the state, could be
    // injectible in every subcomponent of this component.
    initGlobalStore();
  },
  data: function() {
    return {
      page: 1,
      showActionItems: false
    }
  },
  methods: {
    toggleActionItems() {
      this.showActionItems = !this.showActionItems;
    }
  }
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
