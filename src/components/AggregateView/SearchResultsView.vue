<template>
  <div class="flex flex-col">
    <div class="grow-0">
      <section-title> Search Results comparison</section-title>
    </div>
    <div class="w-full flex-auto flex flex-row flex-nowrap overflow-x-auto">
      <div v-for="(result, idx) in searchResults" :key="`${result.query}-${result.sessionId}-${idx}`" class="lg:w-1/2 xl:w-1/3 flex-none h-full flex flex-col mx-1 border">
        <div class="flex-none cursor-pointer" @click="highlightSessions(result)">
          Query: {{result.query}} 
          <br> 
          {{result.clickCounts}} clicks total.
        </div>
        <div class="flex-auto divide-y overflow-y-auto">
          <search-result-item v-for="item in result.results" :key="`${result.query}-${result.sessionId}-${item.title}-${idx}`" :query="result.query" :search-result-item="item">
          </search-result-item>
        </div>
        <!-- <div v-for="item in result.results" :key="`${item.title}-${idx}`">
          {{item.title}}
          {{item.url}}
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed, inject } from "vue";
import SearchResultItem from "./SearchResultItem.vue";
import SectionTitle from "../Common/SectionTitle.vue";

export default {
  components: {
    SearchResultItem,
    SectionTitle
  },
  setup() {
    const store = useGlobalStore();
    const selectedSessions = computed(() => store.getSelectedSessions.value);
    const createLog = inject('createLog')
    const searchResults = computed(() => {
      return selectedSessions.value.map(session => {
        return session.allClickedItems.map(item => {
          return {
            ...item,
            sessionId: session.id
          }
        })
      }).flat().sort((a, b) => b.clickCounts - a.clickCounts);
    })

    const setHighlights = store.setHighlights

    // const allClickedItems = computed(() => selectedSessions.map(s => s.allClickedItems))
    const highlightSessions = function (result) {
      const highlightedSessions = selectedSessions.value.filter(session => {
        return session.allQueryPairs.flat().includes(`${result.query}|${result.expandedQuery}`)
      }).map(session => session.id)
      createLog('highlightSessionsFromSearchResults', {
        highlightedSessions,
        result
      })
      setHighlights({
        behaviorClusters: new Set(),
        keywordClusters: new Set(),
        sessionIds: highlightedSessions,
        source: 'SearchResultsView'
      })
    }

    return {
      selectedSessions,
      searchResults,
      highlightSessions
      // allClickedItems
    }
  },
}
</script>