<template>
  <div class="w-full h-screen flex flex-col">
    <div class="w-full h-auto grow-0 flex justify-start items-center relative">
      <div class="flex-1 grow px-4"> 
        <span class="text-xl font-bold">Search Engine Performance Diagnosis</span>
      </div>
      <div class="grow-0 py-2 px-4 rounded-md border">
        <input v-model="tempUsername" :disabled="isUsernameSet" placeholder="Your name here">
        <button :disabled="isUsernameSet" @click="setName" :class="[isUsernameSet ? 'bg-blueGray-500' : 'bg-red-500', 'text-white rounded-md px-2 py-1']">Set name</button>
      </div>
      <div class="grow-0 py-2 px-4">
        <button 
          :disabled="page === 1"
          @click="changePage(1)"
          :class="[page !== 1 ? 'bg-blueGray-700' : 'bg-blue-500', 'text-white rounded-md px-2 py-1']">Browse sessions</button>
      </div>
      <div class="grow-0 py-2 px-4">
        <button 
          :disabled="page === 2"
          @click="changePage(2)"
          :class="[page !== 2 ? 'bg-blueGray-700' : 'bg-blue-500', 'text-white rounded-md px-2 py-1']">Inspect sessions</button>
      </div>
      <div class="grow-0 py-2 px-4">
        <button 
          @click="toggleActionItems()"
          class="bg-blueGray-300 text-black rounded-md px-2 py-1">Action Items</button>
      </div>
    </div>
    <div v-if="page === 1" class="w-full h-full flex flex-wrap">
      <div class="w-3/5 h-full flex-col">
        <!-- Behavior Pattern Clusters -->
        <pattern-selection class="main-component w-full h-1/3 flex-auto"/>
        <!-- Query Clusters & Search Engine Performance Metrics -->
        <filter-and-keyword-panel class="main-component w-full h-2/3 flex flex-auto"/>
      </div>
      <!-- Individual Search Sessions -->
      <query-selection class="main-component w-2/5 h-full"/>
    </div>
    <div v-else-if="page === 2" class="w-full h-full flex">
      <selected-sessions class="main-component w-2/5 h-full"/>

      <div class="w-3/5 h-full flex flex-col">
        <query-list class="h-1/3 main-component flex-auto"></query-list>
        <search-results-view class="h-2/3 main-component flex-auto"></search-results-view>
      </div>

    </div>

    <action-items v-if="showActionItems" class="absolute z-10 top-10 right-3 shadow-md rounded-md w-1/3 h-1/2 bg-white" @close="showActionItems = false"/>

  </div>
</template>

<script>

import PatternSelection from './components/Behavior/PatternSelection.vue';
import QuerySelection from './components/QueryList/QuerySelection.vue';
import { initGlobalStore } from "@/stores/globalStoreAgent.js";
import FilterAndKeywordPanel from './components/FilterAndKeyword/FilterAndKeywordPanel.vue';
import SelectedSessions from './components/AggregateView/SelectedSessions.vue';
import ActionItems from './components/ActionItems/ActionItems.vue';
import { ref, provide } from 'vue';
import SearchResultsView from './components/AggregateView/SearchResultsView.vue'
import QueryList from './components/AggregateView/QueryList.vue'
import {computed} from "vue";

export default {
  name: 'App',
  components: {
    PatternSelection,
    QuerySelection,
    FilterAndKeywordPanel,
    SelectedSessions,
    ActionItems,
    SearchResultsView,
    QueryList
  },
  setup() {
    // Initializa the global store, so that its methods that manipulates the state, could be
    // injectible in every subcomponent of this component.
    const { setInteractionState, getUsername, setUsername } = initGlobalStore();

    const createLog = function(eventName, payload) {
      const API_URL = 'http://70.70.10.73:5006';
      fetch(`${API_URL}/log/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          log_user: getUsername.value,
          event_name: eventName,
          event_payload: JSON.stringify(payload),
          client_timestamp: new Date().toISOString()
        })
      });
    }
    const isUsernameSet = computed(() => getUsername.value !== '')
    const tempUsername = ref(getUsername.value)
    const page = ref(1);
    const showActionItems = ref(false);

    const toggleActionItems = function () {
      showActionItems.value = !showActionItems.value;
      createLog('toggleActionItem', '')
    };

    const setName = function () {
      setUsername(tempUsername.value);
    }
    
    const changePage = function (newPage) {
      page.value = newPage;
      setInteractionState({
        chosenTag: '',
        chosenSessionId: null
      });

    };

    provide('navigateToGroups', () => changePage(2));
    provide('navigateToSessions', () => changePage(1));

    provide('createLog', createLog);
    provide('currentPage', page)

    return {
      page,
      showActionItems,
      changePage,
      toggleActionItems,
      setName,
      isUsernameSet,
      tempUsername
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

.bg-slate-50 {
  background-color: '#f8fafc';
}

.bg-slate-100 {
  background-color: '#f1f5f9';
}

.bg-slate-200 {
  background-color: '#e2e8f0';
}

.bg-slate-300 {
  background-color: '#cbd5e1';
}

.bg-slate-400 {
  background-color: '#94a3b8';
}

.bg-slate-500 {
  background-color: '#64748b';
}

.bg-slate-600 {
  background-color: '#475569';
}

.bg-slate-700 {
  background-color: '#334155';
}

.bg-slate-800 {
  background-color: '#1e293b';
}

.bg-slate-900 {
  background-color: '#0f172a';
}

</style>
