<template>
  <div class="flex flex-col">
    <section-title> Filter and Keyword </section-title>
    <div class="w-auto flex-grow mx-4 my-4 flex flex-col">
      <div
        class="
          w-full
          flex
          bg-gray-200
          h-16
          items-center
          justify-around
          rounded-md
          border border-black
        "
      >
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
      <div class="mt-4 bg-gray-200 border border-black rounded-md flex-grow">
        <keyword-clusters-visualization v-if="interactionState.chosenMetric !== null" class="w-full h-full" />
      </div>
    </div>
  </div>
</template>

<script>
import SectionTitle from "@/components/Common/SectionTitle.vue";
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
