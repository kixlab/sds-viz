<template>
  <div class="w-1/2 relative">
    <div class="flex">
      <div class="flex flex-1 justify-between rounded-lg shadow-md py-2 pl-3 pr-5">
        <div v-if="selectedBehaviors.length > 0" class="flex flex-1 items-center">
          <template v-for="(b, i) in selectedBehaviors" :key="i">
            <div class="w-6 h-6 relative">
              <icon-giver v-bind="{action_item: b}"></icon-giver>
              <div 
                class="absolute z-10 -top-2 -right-1"
                @click="removeBehavior(i)">
                <MinusCircleIcon class="-mr-1 ml-1 h-4 w-4 text-red-500 bg-white/50" />
              </div>
            </div>
            <line-in-the-middle v-if="i !== selectedBehaviors.length - 1" class="w-4 h-4 min-w-[12] min-h-[12]"></line-in-the-middle>
          </template>
        </div>
        <div class="flex flex-1 items-center text-gray-400" v-else>
          Open the action palette and add behaviors to start searching
        </div>
        <div class="flex flex-none items-center">
          <button @click="showOptions = !showOptions" class="cursor-pointer">
            <ChevronDownIcon v-if="!showOptions" class="-mr-1 ml-1 h-6 w-6" aria-hidden="true" />
            <ChevronUpIcon v-else class="-mr-1 ml-1 h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div class="flex flex-none items-center px-2 py-1 rounded-lg shadow-md bg-green-500 text-white">
        <button @click="setBehaviors()" class="cursor-pointer align-bottom my-auto">
          <SearchIcon class=" h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </div>
    <div 
      class="grid grid-cols-2 absolute z-10 rounded-lg shadow-md w-full bg-white px-2 py-2 overflow-y-auto" 
      v-if="showOptions">
      <behavior-option 
        v-for="b in behaviors" 
        :value="b" 
        :key="b" 
        @click="selectedBehaviors.push(b)"
        class="cursor-pointer">
      </behavior-option>
    </div>
  
    <!-- <Listbox v-model="selectedBehaviors">
      <ListboxButton
        class="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
        <div v-for="(b, i) in selectedBehaviors" :key="b"
          class="w-6 h-6">
          <icon-giver v-bind="{action_item: b}"></icon-giver>
          <line-in-the-middle
              v-if="i !== selectedBehaviors.length - 1"
              class="w-4 h-4"
              style="min-width: 16px; min-height: 16px"
            />
        </div>
      </ListboxButton>
      <ListboxOptions :as="behaviorOptions">
        <ListboxOption v-for="b in behaviors" :key="b" :value="b" :as="behaviorOption">
        </ListboxOption>
      </ListboxOptions>
    </Listbox> -->
  </div>
</template>

<script>

import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue'

import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed } from "vue";
import IconGiver from '../Common/IconGiver.vue'
import SmallTitle from '../Common/SmallTitle.vue'
import LineInTheMiddle from '../Common/Icons/LineInTheMiddle.vue'
import BehaviorOption from './BehaviorOption.vue'
import { ChevronDownIcon, ChevronUpIcon, SearchIcon, MinusCircleIcon } from "@heroicons/vue/solid";


export default {
  /* eslint-disable */
  components: {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    IconGiver,
    SmallTitle,
    LineInTheMiddle,
    BehaviorOption,
    ChevronDownIcon,
    SearchIcon,
    ChevronUpIcon,
    MinusCircleIcon
  },
  setup: function () {
    const behaviors = ['Click1-5', 'Click1-5_Short', 'Click6-10', 'Click6-10_Short', 'Click11+', 'Click11+_Short', 'NewQuery', 'NewQuery_Short', 'RefinedQuery', 'RefinedQuery_Short', 'ClickQuickLink', 'EndSession']
    const store = useGlobalStore();
    // Current interaction state (which panel is open, which metric is chosen)
    const interactionState = computed(() => store.getInteractionState.value);
    // Updates the interaction state
    const setInteractionState = store.setInteractionState;
    const setShorthandBehaviors = store.setShorthandBehaviors

    return {
      interactionState,
      setInteractionState,
      behaviors,
      setShorthandBehaviors
    };
  },
  data: function () {
    return {
      selectedBehaviors: ['NewQuery'],
      showOptions: false
    }
  },
  methods: {
    removeBehavior: function (i) {
      this.selectedBehaviors.splice(i, 1)
    },
    setBehaviors: function () {
      console.log('setBehaviors')
      this.setShorthandBehaviors(this.shorthandSelectedBehaviors)
    }
  },
  computed: {
    shorthandSelectedBehaviors: function () {
      const shorthand_behaviors_dict = window.globalVars.SHORTHAND_ACTIONS
      return this.selectedBehaviors.map(b => shorthand_behaviors_dict[b]).join('')
    }
  }
}
</script>

<style>

</style>