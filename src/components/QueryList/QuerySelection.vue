<template>
  <div class="flex flex-col overflow-y-hidden">
    <!-- Title: 'Individual Search Sessions' -->
    <section-title> Individual Search Sessions </section-title>
    <div class="flex flex-col my-4 mx-2 overflow-y-hidden">
      <!-- The dropdown -->
      <div class="flex flex-none flex-row-reverse justify-between items-center">
        <div v-if="sessions !== null" class="flex items-center m-1">
          <div class="mx-2 relative">
            <medium-title class="relative">
              Sort By (worst to best):
            </medium-title>
          </div>
          <sort-by-dropdown />
        </div>
        <div v-if="sessions !== null">
          <div>{{sessions.length}} sessions presented. </div>
          <div v-if="currentKeywordCluster !== null">
            Current query cluster: {{currentKeywordCluster.topFiveKeywords.join(" / ")}}
          </div>
        </div>
      </div>
      <!-- The query list -->
      <div class="h-full overflow-y-auto flex flex-auto flex-col mt-4">
        <session-item
          v-for="session in sessions"
          :key="session.id"
          class="my-2"
          v-bind="{
            session: session,
          }"
        />
      </div>
      <div v-if="sessions === null" class="text-center">
        <medium-title>
          Start by selecting a cluster from the left. 
        </medium-title>
      </div>
      <div v-else-if="sessions.length === 0" class="text-center">
        <medium-title>
          No sessions found. Try different clusters.
        </medium-title>
      </div>
    </div>
  </div>
</template>

<script>
import SectionTitle from "@/components/Common/SectionTitle.vue";
import MediumTitle from "../Common/MediumTitle.vue";
import SortByDropdown from "@/components/QueryList/SortByDropdown.vue";
import SessionItem from "@/components/QueryList/SessionItem.vue";
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed, provide, ref } from "vue";

export default {
  name: "QuerySelection",
  components: {
    SectionTitle,
    MediumTitle,
    SortByDropdown,
    SessionItem,
  },
  setup() {
    // The currently active sortByOption
    const sortByOption = ref(window.globalVars.METRICS[0]);
    // Inject the methods to manipulate the state of the global store
    const store = useGlobalStore();
    // Current interaction state (which panel is open, which metric is chosen)
    const interactionState = computed(() => store.getInteractionState.value);
    // Updates the interaction state
    const setInteractionState = store.setInteractionState;
    // List of sessions, sorted by the current sortByOption from worst to best
    const sessions = computed(() => {
      const sessions = store.getSessions.value;
      if (sessions !== null) {
        return Object.values(sessions).sort((a, b) => {
          const aMetricVal = a.metricValues[sortByOption.value];
          const bMetricVal = b.metricValues[sortByOption.value];
          // sort bad to good
          return window.globalVars.IS_METRIC_GOODNESS_DIRECT[sortByOption.value]
            ? aMetricVal - bMetricVal
            : bMetricVal - aMetricVal;
        });
      }
      return null;
    });
    // When the sortByOption changes
    const onSortByOptionChange = (option) => {
      sortByOption.value = option;
    };

    const keywordClusters = computed(() => store.getKeywordClusters.value)

    const currentKeywordCluster = computed(() => {
      const currentKeywordClusterId = interactionState.value.chosenKeywordClusterId
      if (currentKeywordClusterId === null) {
        return null
      }
      const currentCluster = Object.values(keywordClusters.value).find(k => k.id === currentKeywordClusterId)
      return currentCluster
    })

    // Provide 'parentCallFunction', 'mainOption' and 'allOptions' to the dropdown component
    // It actually provides those to all the children components, but they are used only in the dropdown 
    provide("parentCallFunction", onSortByOptionChange);
    provide("mainOption", sortByOption);
    provide("allOptions", window.globalVars.METRICS);

    return {
      interactionState,
      setInteractionState,
      sessions,
      currentKeywordCluster,
      keywordClusters
    };
  },
  methods: {},
};
</script>

<style>
</style>
