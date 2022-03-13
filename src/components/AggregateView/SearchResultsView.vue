<template>
  <div class="flex flex-col">
    <div class="grow-0">
      <section-title> Search Results comparison</section-title>
    </div>
    <div class="w-full flex-auto flex flex-row flex-nowrap overflow-x-scroll">
      <div v-for="(result, idx) in searchResults" :key="`${result.query}-${idx}`" class="w-1/3 flex-none h-full flex flex-col">
        <div class="flex-none">
          Query: {{result.query}}
        </div>
        <div class="flex-auto divide-y overflow-y-auto">
          <search-result-item v-for="item in result.results" :key="`${item.title}-${idx}`" :search-result-item="item">
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
import { computed } from "vue";
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

    const searchResults = computed(() => {
      return selectedSessions.value.map(session => {
        return session.allClickedItems;
      }).flat()
    })

    // const allClickedItems = computed(() => selectedSessions.map(s => s.allClickedItems))

    return {
      selectedSessions,
      searchResults
      // allClickedItems
    }
  },
}
</script>