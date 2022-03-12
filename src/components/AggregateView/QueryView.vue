<template>
  <div class="flex">
    <query-list class="w-6/12">
    </query-list>
  </div>
</template>

<script>
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed } from "vue";
import QueryList from './QueryList.vue'
export default {
  components: {
    QueryList
  },
  setup() {
    const store = useGlobalStore();
    const selectedSessions = computed(() => store.getSelectedSessions.value);

    return {
      selectedSessions
    }
  }
}
</script>
