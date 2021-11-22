<template>
  <div class="w-full h-full flex">
    <div class="w-3/5 h-full">
      <div class="w-full h-9/20 flex">
        <filter-panel class="main-component w-1/2 h-full"/>
        <keyword-selection class="main-component w-1/2 h-full"/>
      </div>
      <pattern-selection class="main-component w-full h-11/20"/>
    </div>
    <query-selection class="main-component w-2/5 h-full"/>
  </div>
</template>

<script>

import FilterPanel from './components/Filter/FilterPanel.vue';
import KeywordSelection from './components/Keyword/KeywordSelection.vue';
import PatternSelection from './components/Behavior/PatternSelection.vue';
import QuerySelection from './components/QueryList/QuerySelection.vue';

export default {
  name: 'App',
  components: {
    FilterPanel,
    KeywordSelection,
    PatternSelection,
    QuerySelection
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
