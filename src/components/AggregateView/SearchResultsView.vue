<template>
  <div class="flex">
    <div v-for="(result, idx) in searchResults" :key="`${result.query}-${idx}`">
      {{result.query}}
      <div v-for="item in result.results" :key="`${item.title}-${idx}`">
        {{item.title}}
        {{item.url}}
      </div>
    </div>
  </div>
</template>
<script>
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed } from "vue";

export default {
  setup() {
    const store = useGlobalStore();
    const selectedSessions = computed(() => store.getSelectedSessions.value);

    const searchResults = computed(() => {
      return selectedSessions.value.map(session => {
        return {
          query: session.sequence[0].Query,
          results: session.sequence[0].QueryResults
        }
      })
    })

    return {
      selectedSessions,
      searchResults
    }
  },
}
</script>