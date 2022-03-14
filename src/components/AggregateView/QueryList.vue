<template>
  <div class="flex flex-col">
    <section-title class="flex-0">Query Comparison</section-title>
    <div class="flex-1 overflow-y-auto">
      <table class="table-auto w-full">
        <thead>
          <tr>
            <th>User query</th>
            <th>Expanded query</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(qc, idx) in queriesCount" :key="qc.query" :class="idx % 2 == 1 ? 'bg-white' : 'bg-gray-300'">
            <th @click="highlightSessions(qc.query, qc.expandedQuery)" class="cursor-pointer">{{qc.query}}</th>
            <th @click="highlightSessions(qc.query, qc.expandedQuery)" class="cursor-pointer">{{qc.expandedQuery}}</th>
            <th @click="highlightSessions(qc.query, qc.expandedQuery)" class="cursor-pointer">{{qc.count}}</th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed, inject } from "vue";
import SectionTitle from '../Common/SectionTitle.vue';

export default {
  components: {
    SectionTitle
  },
  setup() {
    const store = useGlobalStore()
    const selectedSessions = computed(() => store.getSelectedSessions.value)
    const setHighlights = store.setHighlights

    const queries = computed(() => {
      return selectedSessions.value.map(session => session.allQueryPairs.flat()).flat()
    })

    const queriesSet = computed(() => Array.from(new Set(queries.value)))
    const createLog = inject('createLog')

    const queriesCount = computed(() => {
      return queriesSet.value.map(query => {
        console.log(query)
        const [userQuery , expandedQuery] = query.split('|')
        return {
          query: userQuery,
          expandedQuery: expandedQuery,
          count: queries.value.filter(q => q === query).length
        }
      }).sort((a, b) => b.count - a.count)
    })

    const highlightSessions = function (query, expandedQuery) {
      const highlightedSessions = selectedSessions.value.filter(session => {
        return session.allQueryPairs.flat().includes(`${query}|${expandedQuery}`)
      }).map(session => session.id)
      createLog('highlightSessionsFromQueryList', {
        query,
        expandedQuery,
        highlightedSessions
      })
      setHighlights({
        behaviorClusters: new Set(),
        keywordClusters: new Set(),
        sessionIds: highlightedSessions
      })
    }
    return {
      selectedSessions,
      queries,
      queriesCount,
      highlightSessions
    }
  }
  
}
</script>
<style scoped>
</style>