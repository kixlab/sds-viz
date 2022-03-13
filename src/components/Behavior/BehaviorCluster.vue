<template>
  <!-- Behavior cluster -->
  <div
    :class="[
      'flex flex-col justify-between w-40 h-full rounded-md mx-2 cursor-pointer',
      interactionState.chosenBehaviorClusterId === behaviorCluster.id
        ? 'bg-gray-400 hover:bg-gray-400'
        : 'bg-gray-200 hover:bg-gray-300',
      highlights.behaviorClusters.has(behaviorCluster.id)
        ? 'border-yellow-500 border-4'
        : 'border-black border',
    ]"
    v-on:click="setChosenBehaviorCluster()"
  >
    <!-- Behavior k-grams are listed here -->
    <div class="flex-grow overflow-y-auto">
      <div
        v-for="distinguishingFeature in behaviorCluster.distinguishingFeatures"
        :key="distinguishingFeature"
        class="flex my-2 mx-2 items-center"
      >
        <!-- List the actions in the current k-gram -->
        <template
          v-for="(action_item, i) in distinguishingFeature.action_items"
          :key="action_item"
        >
          <div class="w-8 h-8">
            <icon-giver v-bind="{ action_item }" />
          </div>
          <!-- Line in the middle is useful for the visualization between two actions -->
          <line-in-the-middle
            v-if="i !== distinguishingFeature.action_items.length - 1"
            class="w-4 h-4"
          />
        </template>
      </div>
    </div>
    <!-- No of sessions inside this behavior cluster -->
    <div class="flex justify-end mx-2 my-1">
      <small-title class="font-bold">
        {{ behaviorCluster.subtreeSize }} sessions
      </small-title>
    </div>
  </div>
</template>

<script>
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed } from "vue";
import LineInTheMiddle from "@/components/Common/Icons/LineInTheMiddle.vue";
import IconGiver from '../Common/IconGiver.vue';
import SmallTitle from '../Common/SmallTitle.vue';
export default {
  name: "BehaviorCluster",
  components: {
    IconGiver,
    LineInTheMiddle,
    SmallTitle
  },
  // This prop is passed from the parent component (PatternSelection.vue)
  // It contains the info about which behavior cluster this is
  props: ["behaviorCluster"],
  setup() {
    // Inject the methods to manipulate the state of the global store
    const store = useGlobalStore();
    // Current interaction state (which panel is open, which metric is chosen)
    const interactionState = computed(() => store.getInteractionState.value);
    // Updates the interaction state
    const setInteractionState = store.setInteractionState;
    const highlights = computed(() => store.getHighlights.value);
    return {
      interactionState,
      setInteractionState,
      highlights
    };
  },
  methods: {
    // When a behavior cluster is clicked
    setChosenBehaviorCluster() {
      // The update dictionary
      let update = {
        chosenBehaviorClusterId: this.behaviorCluster.id,
      };
      // If the chosen behavior cluster is already the one clicked, then reset the chosen behavior cluster
      if (
        this.interactionState.chosenBehaviorClusterId ===
        this.behaviorCluster.id
      ) {
        update.chosenBehaviorClusterId = null;
      }
      // Update the interaction state
      this.setInteractionState(update);
    },
  },
};
</script>

<style>
</style>
