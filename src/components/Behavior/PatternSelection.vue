<template>
  <!-- Behavior Pattern Clusters -->
  <div class="flex flex-col">
    <!-- The title -->
    <div class="flex justify-between">
      <section-title> Behavior Pattern Clusters </section-title>
      <behavior-search-box></behavior-search-box>
    </div>
    <div class="flex w-full flex-grow overflow-y-hidden p-4">
      <!-- Behavior Legend -->
      <behavior-legend class="min-w-max mr-4" />
      <div
        class="flex justify-between items-center flex-grow overflow-y-hidden"
      >
        <div class="flex justify-around flex-grow h-full">
          <!-- List of behavior clusters -->
          <behavior-cluster
            v-for="behaviorCluster in behaviorClusters"
            :key="behaviorCluster.id"
            v-bind="{
              behaviorCluster: behaviorCluster,
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SectionTitle from "@/components/Common/SectionTitle.vue";
import BehaviorCluster from "./BehaviorCluster.vue";
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import BehaviorLegend from "./BehaviorLegend.vue";
import { computed } from "vue";
import BehaviorSearchBox from './BehaviorSearchBox.vue';

export default {
  name: "PatternSelection",
  components: {
    SectionTitle,
    BehaviorCluster,
    BehaviorLegend,
    BehaviorSearchBox,
  },
  setup() {
    // Inject the methods to manipulate the state of the global store
    const store = useGlobalStore();
    // Current interaction state (which panel is open, which metric is chosen)
    const interactionState = computed(() => store.getInteractionState.value);
    // Updates the interaction state
    const setInteractionState = store.setInteractionState;
    // List of behavior clusters associated with the chosen keyword cluster
    const behaviorClusters = computed(() => store.getBehaviorClusters.value);

    return {
      interactionState,
      setInteractionState,
      behaviorClusters,
    };
  },
};
</script>

<style>
</style>
