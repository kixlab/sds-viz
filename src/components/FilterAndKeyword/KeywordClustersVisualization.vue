<template>
  <div class="flex flex-wrap">
    <div v-for="keywordCluster in keywordClusters" :key="keywordCluster.id" :class="['mx-2 cursor-pointer', interactionState.chosenKeywordClusterId === keywordCluster.id ? 'hover-bg-gray-400 bg-gray-400' : 'hover:bg-gray-300 bg-gray-200']" v-on:click="setChosenKeywordCluster(keywordCluster.id)">
        {{ keywordCluster.topKeyword }}
    </div>
  </div>
</template>

<script>
import {useGlobalStore} from "@/stores/globalStoreAgent.js";
import {computed} from "vue";
export default {
  name: "KeywordClustersVisualization",
  components: {
  },
  setup() {
    const store = useGlobalStore();
    const interactionState = computed(() => store.getInteractionState.value);
    const keywordClusters = computed(() => store.getKeywordClusters.value);
    const setInteractionState = store.setInteractionState;

    return {
      interactionState,
      setInteractionState,
      keywordClusters,
    };
  },
  methods: {
      setChosenKeywordCluster(keywordClusterId) {
        this.setInteractionState({
          chosenKeywordClusterId: keywordClusterId,
        });
      },
  },
};
</script>

<style>
</style>
