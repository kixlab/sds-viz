<template>
  <div class="flex flex-col">
    <section-title> Query Clusters & Search Engine Performance Metrics </section-title>
    <div class="flex flex-col flex-grow w-auto mx-4 my-4">
      <div class="flex flex-col bg-gray-200 rounded-md border border-black">
        <in-section-title class="bg-gray-200 mt-1 mx-2">
          Performance Metric Selection
        </in-section-title>
        <div class="w-full flex h-16 items-center justify-around">
          <div
            v-for="metricInfo in metricsData"
            :key="metricInfo.label"
            :class="[
              'w-24 h-10 mx-2 border border-black rounded-md px-2 flex justify-center items-center flex-wrap cursor-pointer',
              metricInfo.metric === interactionState.chosenMetric
                ? 'bg-gray-400 hover:bg-gray-400'
                : 'bg-gray-200 hover:bg-gray-300',
            ]"
            v-on:click="setMetric(metricInfo.metric)"
          >
            <small-title
              v-for="part in metricInfo.label.split(' ')"
              :key="part"
              class="font-bold"
            >
              {{ part }}
            </small-title>
          </div>
        </div>
      </div>
      <div
        class="
          flex flex-col flex-grow
          mt-4
          bg-gray-200
          border border-black
          rounded-md
          overflow-y-hidden
        "
      >
        <in-section-title class="bg-gray-200 mt-1 mx-2">
          User Query Clusters
        </in-section-title>
        <keyword-clusters-visualization
          v-if="interactionState.chosenMetric !== null"
          class="w-full flex-grow"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SectionTitle from "@/components/Common/SectionTitle.vue";
import InSectionTitle from "@/components/Common/InSectionTitle.vue";
import SmallTitle from "../Common/SmallTitle.vue";
import KeywordClustersVisualization from "./KeywordClustersVisualization.vue";
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed } from "vue";

export default {
  name: "FilterAndKeywordPanel",
  components: {
    SectionTitle,
    SmallTitle,
    KeywordClustersVisualization,
    InSectionTitle,
  },
  setup() {
    const store = useGlobalStore();
    const interactionState = computed(() => store.getInteractionState.value);
    const setInteractionState = store.setInteractionState;

    return {
      interactionState,
      setInteractionState,
    };
  },
  data() {
    return {
      metricsData: window.globalVars.METRICS.map((e, i) => {
        return {
          metric: e,
          label: window.globalVars.METRIC_LABELS[i],
        };
      }),
    };
  },
  methods: {
    setMetric(metric) {
      let updateState = {
        chosenMetric: metric,
        chosenThreshold: 0.0,
      };
      if (this.interactionState.chosenMetric === metric) {
        updateState.chosenMetric = null;
      }
      this.setInteractionState(updateState);
    },
  },
};
</script>

<style>
</style>
