<template>
  <div class="flex flex-col">
    <section-title> Query Clusters & Search Engine Performance Metrics </section-title>
    <div class="flex flex-col flex-grow w-auto mx-4 my-4">
      <div class="flex flex-col bg-gray-200 rounded-md border border-black">
        <div class="flex justify-between content-center items-center">
          <in-section-title class="bg-gray-200 mt-1 mx-2">
            Performance Metric Selection
          </in-section-title>
          <button class="w-6 h-6 mr-2" @click="tooltipClicked = true" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
            <question-mark />
          </button>
        </div>
        <div class="relative">
          <div v-if="showTooltip || tooltipClicked" class="absolute z-20
            right-6            cursor-pointer
            bg-white
            drop-shadow-sm
            rounded-md
            border-gray-500 border
            px-2
            py-2" @click="tooltipClicked = false">
            <ul>
              <li><span class="font-bold">pSkip</span>: Fraction of documents viewed but not clicked</li>
              <li><span class="font-bold">Click@1-5</span>: Fraction of queries with clicks on documents ranked 1-5</li>
              <li><span class="font-bold">MaxRR</span>: Mean of maximum reciprocal ranks for all queries</li>
              <li><span class="font-bold">MeanRR</span>: Mean of average reciprocal ranks for all queries </li>
              <li><span class="font-bold">Abandonment rate</span>: Ratio of queries without any clicks</li>
              <li><span class="font-bold">Reformulation rate</span>: Fraction of reformulated query among all queries</li>
              <li><span class="font-bold">NDCG</span>: Normalized discounted Cumulative Gain</li>
            </ul>
          </div>
        </div>
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
import QuestionMark from '../Common/Icons/QuestionMark.vue'

export default {
  name: "FilterAndKeywordPanel",
  components: {
    SectionTitle,
    SmallTitle,
    KeywordClustersVisualization,
    InSectionTitle,
    QuestionMark
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
      showTooltip: false,
      tooltipClicked: false
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
