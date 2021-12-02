<template>
  <div class="flex flex-wrap overflow-y-scroll">
    <div v-for="keywordCluster in keywordClusters" :key="keywordCluster.id" :class="['mx-2 cursor-pointer text-white', interactionState.chosenKeywordClusterId === keywordCluster.id ? 'border border-gray-500' : '']" :style="`background-color: ${getColor(keywordCluster.id)}`" v-on:click="setChosenKeywordCluster(keywordCluster.id)">
        {{ keywordCluster.topKeyword }}
    </div>
  </div>
</template>

<script>
import {useGlobalStore} from "@/stores/globalStoreAgent.js";
import {computed} from "vue";
import * as d3 from "d3";

export default {
  name: "KeywordClustersVisualization",
  components: {
  },
  setup() {
    const store = useGlobalStore();
    const interactionState = computed(() => store.getInteractionState.value);
    const keywordClusters = computed(() => store.getKeywordClusters.value);
    const setInteractionState = store.setInteractionState;
    
    const sortedKeywordClusters = computed(() => {
      const chosenMetric = interactionState.value.chosenMetric;
      return Object.values(keywordClusters.value).sort((a, b) => {
        const aAvgMetricVal = a.metricValues[chosenMetric] / a.subtreeSize;
          const bAvgMetricVal = b.metricValues[chosenMetric] / b.subtreeSize;
          return window.globalVars.IS_METRIC_GOODNESS_DIRECT[chosenMetric]
            ? aAvgMetricVal - bAvgMetricVal
            : bAvgMetricVal - aAvgMetricVal;
        })
    });

    const rankingPercentageById = computed(() => {
      const ranking = {};
      sortedKeywordClusters.value.forEach((keywordCluster, index) => {
        ranking[keywordCluster.id] = 2 * index / sortedKeywordClusters.value.length;
      });
      return ranking;
    });

    return {
      interactionState,
      setInteractionState,
      keywordClusters,
      rankingPercentageById,
    };
  },
  methods: {
      setChosenKeywordCluster(keywordClusterId) {
        let update = {
          chosenKeywordClusterId: keywordClusterId,
        };
        if(this.interactionState.chosenKeywordClusterId === keywordClusterId) {
          update.chosenKeywordClusterId = null;
        }
        this.setInteractionState(update);
      },
      getColor(keywordClusterId) {
        const rankingP = this.rankingPercentageById[keywordClusterId];
        const greenZone = ['#D6E8D8', '#2BD72B'], redZone = ['#F05656', '#ECDBDC'];
        if(rankingP < 1) {
          return d3.interpolate(redZone[0], redZone[1])(rankingP);
        } else {
          return d3.interpolate(greenZone[0], greenZone[1])(rankingP - 1);
        }
      }
  },
};
</script>

<style>
</style>
