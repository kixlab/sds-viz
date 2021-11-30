<template>
  <div
    :class="[
      'flex flex-col justify-between w-40 h-full border border-black rounded-md mx-2 cursor-pointer',
      interactionState.chosenBehaviorClusterId === behaviorCluster.id
        ? 'bg-gray-400 hover:bg-gray-400'
        : 'bg-gray-200 hover:bg-gray-300',
    ]"
    v-on:click="setChosenBehaviorCluster()"
  >
    <div class="flex-grow overflow-y-scroll">
      <div
        v-for="distinguishingFeature in behaviorCluster.distinguishingFeatures"
        :key="distinguishingFeature"
        class="flex my-3 mx-3"
      >
        <template
          v-for="(action_item, i) in distinguishingFeature.action_items"
          :key="action_item"
        >
          <div class="w-8 h-8">
            <icon-giver v-bind="{action_item}"/>
          </div>

          <line-in-the-middle
            v-if="i !== distinguishingFeature.action_items.length - 1"
            class="w-4 h-8"
          />
        </template>
      </div>
    </div>
    <div class="flex justify-end mx-2 my-1">
      <small-title class="font-bold">
        Total Count: {{ behaviorCluster.subtreeSize }}
      </small-title>
    </div>
  </div>
</template>

<script>
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed } from "vue";

import IconGiver from '../Common/IconGiver.vue';
export default {
  name: "BehaviorCluster",
  components: {
    IconGiver,
  },
  props: ["behaviorCluster"],
  setup() {
    const store = useGlobalStore();
    const interactionState = computed(() => store.getInteractionState.value);
    const setInteractionState = store.setInteractionState;

    return {
      interactionState,
      setInteractionState,
    };
  },
  methods: {
    setChosenBehaviorCluster() {
      let update = {
        chosenBehaviorClusterId: this.behaviorCluster.id,
      };
      if (
        this.interactionState.chosenBehaviorClusterId ===
        this.behaviorCluster.id
      ) {
        update.chosenBehaviorClusterId = null;
      }
      this.setInteractionState(update);
    },
  },
};
</script>

<style>
</style>
