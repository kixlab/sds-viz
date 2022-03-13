<template>
  <div>
    <section-title>Query Comparison</section-title>
    <table class="table-auto w-full">
      <thead>
        <tr>
          <th>User query</th>
          <th>Expanded query</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="qc in queriesCount" :key="qc.query">
          <th>{{qc.query}}</th>
          <th>{{qc.expandedQuery}}</th>
          <th>{{qc.count}}</th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed } from "vue";
import SectionTitle from '../Common/SectionTitle.vue';

export default {
  components: {
    SectionTitle
  },
  setup() {
    const store = useGlobalStore()
    const selectedSessions = computed(() => store.getSelectedSessions.value)

    const queries = computed(() => {
      return selectedSessions.value.map(session => session.allQueryPairs.flat()).flat()
    })

    const queriesSet = computed(() => Array.from(new Set(queries.value)))

    const queriesCount = computed(() => {
      return queriesSet.value.map(query => {
        console.log(query)
        const [userQuery , expandedQuery] = query.split('|')
        return {
          query: userQuery,
          expandedQuery: expandedQuery,
          count: queries.value.filter(q => q === query).length
        }
      })
    })
    return {
      selectedSessions,
      queries,
      queriesCount
    }
  }
  
}
</script>
<style scoped>
</style>