<template>
  <div class="flex flex-col">
    <div class="flex justify-between">
      <section-title> Query Clusters & Search Engine Performance Metrics </section-title>
      <div :class="[isBorderHighlighted && 'glow', 'flex w-1/3']">
        <div class="bg-white flex-1 rounded-lg shadow-md cursor-default focus:outline-none px-2">
          <input v-model="keyword" class="w-full" placeholder="Search sessions with user query" @keydown.enter="setKeyword()" type="text">
        </div>
        <div :class="['flex-none items-center px-1 rounded-lg shadow-md bg-blue-800 text-white']">
          <button @click="setKeyword()" class="cursor-pointer my-auto">
            <SearchIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-col flex-grow w-auto mx-4 my-4">
      <!-- Performance Metric Selection -->
      <div class="flex flex-col bg-gray-100 rounded-md border border-black">
        <!-- Title and question mark -->
        <div class="flex justify-between content-center items-center">
          <in-section-title class="bg-gray-100 mt-1 mx-2">
            Performance Metric Selection
          </in-section-title>
          <button class="w-6 h-6 mr-2" @click="onTooltipOpen()" @mouseenter="onTooltipHover()" @mouseleave="onTooltipHoverLeave()">
            <question-mark />
          </button>
        </div>
        <!-- Tooltip -->
        <div class="relative">
          <div v-if="showTooltip || tooltipClicked" class="absolute z-20
            right-6            cursor-pointer
            bg-white
            drop-shadow-sm
            rounded-md
            border-gray-500 border
            px-2
            py-2" @click="onTooltipClose()">
            <ul>
              <li><span class="font-bold">CTR@5</span>: Ratio of queries with clicks on documents ranked 1-5</li>
              <li><span class="font-bold">MeanRR</span>: Mean of average reciprocal ranks for all queries </li>
              <li><span class="font-bold">Abandonment rate</span>: Ratio of queries without any clicks</li>
              <li><span class="font-bold">Reformulation rate</span>: Ratio of reformulated query among all queries</li>
              <li><span class="font-bold">mAP</span>: Mean Average Precision</li>
              <li><span class="font-bold">NDCG</span>: Normalized Discounted Cumulative Gain</li>
            </ul>
          </div>
        </div>
        <!-- List of buttons for metrics in the UI -->
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
      <!-- User Query Clusters -->
      <div
        class="
          flex flex-col flex-grow
          mt-4
          bg-gray-100
          border border-black
          rounded-md
          overflow-y-hidden
        "
      >
        <in-section-title class="bg-gray-100 mt-1 mx-2">
          User Query Clusters
        </in-section-title>
        <!-- The visualization of the keyword clusters -->
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
import { computed, inject } from "vue";
import QuestionMark from '../Common/Icons/QuestionMark.vue'
import { SearchIcon } from "@heroicons/vue/solid";


export default {
  name: "FilterAndKeywordPanel",
  components: {
    SectionTitle,
    SmallTitle,
    KeywordClustersVisualization,
    InSectionTitle,
    QuestionMark,
    SearchIcon,
  },
  setup() {
    // Inject the methods to manipulate the state of the global store
    const store = useGlobalStore();
    // Current interaction state (which panel is open, which metric is chosen)
    const interactionState = computed(() => store.getInteractionState.value);
    // Updates the interaction state
    const setInteractionState = store.setInteractionState;
    const setQuery = store.setQuery;
    const createLog = inject('createLog')
    const highlights = computed(() => store.getHighlights.value)
    return {
      interactionState,
      setInteractionState,
      setQuery,
      createLog,
      highlights
    };
  },
  data() {
    return {
      // List of metrics
      metricsData: window.globalVars.METRICS.map((e, i) => {
        return {
          metric: e,
          label: window.globalVars.METRIC_LABELS[i],
        };
      }),
      showTooltip: false,
      tooltipClicked: false,
      keyword: '',
      isBorderHighlighted: false
    };
  },
  methods: {
    // Updates the metric chosen
    setMetric(metric) {
      // Set the metric chosen and the threshold for highlighting
      let updateState = {
        chosenMetric: metric,
        chosenThreshold: 0.0,
      };
      this.createLog('setMetric', {
        chosenMetric: metric
      })
      // If the currently chosen metric is the same as the one chosen, then we cancel selection
      if (this.interactionState.chosenMetric === metric) {
        updateState.chosenMetric = null;
      }
      // Update the interaction state
      this.setInteractionState(updateState);
    },
    setKeyword: function () {
      this.createLog('setKeywordFromKeywordSearchBox', {
        keyword: this.keyword
        //TODO: search results
      })
      this.setQuery(this.keyword);
    },
    onTooltipHover: function () {
      this.createLog('hoverMetricTooltip')
      this.showTooltip = true;
    },
    onTooltipHoverLeave: function () {
      this.createLog('hoverLeaveMetricTooltip')
      this.showTooltip = false;
    },
    onTooltipOpen: function () {
      this.createLog('openMetricTooltip')
      this.tooltipClicked = true;
      this.showTooltip = false
    },
    onTooltipClose: function () {
      this.createLog('closeMetricTooltip')
      this.tooltipClicked = false;
    }
  },
  watch: {
    highlights: {
      handler: function (newVal) {
        console.log('watch')
        if (newVal.source === 'KeywordSearchBox') {
          this.isBorderHighlighted = true
        } else {
          this.isBorderHighlighted = false
          this.keywords = []
        }
      },
      deep: true
    }
  }
};
</script>

<style>
.glow {
  box-shadow: 10px 5px 20px rgb(255 208 0 / 90%);  /* stroke: black;
  stroke-width: 2; */
}
</style>
