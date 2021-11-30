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
            <click-11-plus-icon v-if="action_item === 'Click11+'" />
            <click-15-icon v-else-if="action_item === 'Click1-5'" />
            <click-610-icon v-else-if="action_item === 'Click6-10'" />
            <empty-icon v-else-if="action_item === 'Empty'" />
            <search-refine-icon v-else-if="action_item === 'RefinedQuery'" />
            <search-icon v-else-if="action_item === 'NewQuery'" />
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
import Click15Icon from "../Common/Icons/Click15Icon.vue";
import Click610Icon from "../Common/Icons/Click610Icon.vue";
import SearchRefineIcon from "../Common/Icons/SearchRefineIcon.vue";
import Click11PlusIcon from "../Common/Icons/Click11PlusIcon.vue";
import SearchIcon from "../Common/Icons/SearchIcon.vue";
import LineInTheMiddle from "../Common/Icons/LineInTheMiddle.vue";
import EmptyIcon from "../Common/Icons/EmptyIcon.vue";
import SmallTitle from "../Common/SmallTitle.vue";
export default {
  name: "BehaviorCluster",
  components: {
    Click15Icon,
    Click610Icon,
    SearchRefineIcon,
    Click11PlusIcon,
    SearchIcon,
    LineInTheMiddle,
    EmptyIcon,
    SmallTitle,
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
