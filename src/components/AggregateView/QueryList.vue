<template>
  <div>
    <ul>
      <li v-for="query in queries" :key="query">{{query}}</li>
    </ul>
  </div>
</template>

<script>
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed } from "vue";

export default {
  setup() {
    const store = useGlobalStore()
    const selectedSessions = computed(() => store.getSelectedSessions.value)

    const queries = computed(() => {
      return selectedSessions.value.map(session => session.sequence[0].Query)
    })

    return {
      selectedSessions,
      queries
    }
  }
  
}
</script>
<style scoped>
</style>