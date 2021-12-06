<template>
  <div class="flex flex-col">
    <section-title> Behavior Pattern Selection </section-title>
    <div class="flex justify-between items-center flex-grow mx-8 my-4 overflow-y-hidden">
      <behavior-legend></behavior-legend>
      <div
        class="
          flex
          justify-around
          flex-grow
          h-full
          rounded-md
        "
      >
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
</template>

<script>
import SectionTitle from "@/components/Common/SectionTitle.vue";
import BehaviorCluster from "./BehaviorCluster.vue";
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import BehaviorLegend from './BehaviorLegend.vue'
import { computed } from "vue";
// import GoLeft from '../Common/Icons/GoLeft.vue';
// import GoRight from '../Common/Icons/GoRight.vue';
export default {
  name: "PatternSelection",
  components: {
    SectionTitle,
    BehaviorCluster,
    BehaviorLegend,
  },
  setup() {
    const store = useGlobalStore();
    const interactionState = computed(() => store.getInteractionState.value);
    const setInteractionState = store.setInteractionState;
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
