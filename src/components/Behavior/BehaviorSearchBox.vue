<template>
  <div class="w-1/2 relative">
    <div class="flex justify-between rounded-lg shadow-md py-2 pl-3 pr-5">
      <div class="flex items-center">
        <template v-for="(b, i) in selectedBehaviors" :key="i">
          <div class="w-6 h-6 relative">
            <icon-giver v-bind="{action_item: b}"></icon-giver>
            <div 
              class="absolute z-10 -top-3 -right-1.5"
              @click="removeBehavior(i)">
              X
            </div>
          </div>
          <line-in-the-middle v-if="i !== selectedBehaviors.length - 1" class="w-4 h-4 min-w-[12] min-h-[12]"></line-in-the-middle>
        </template>
      </div>
      <div>
        <button @click="showOptions = !showOptions">
          <ChevronDownIcon class="-mr-1 ml-1 h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
    <div 
      class="grid grid-cols-2 absolute z-10 rounded-lg shadow-md w-full bg-white px-2 py-2 overflow-y-scroll" 
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

import IconGiver from '../Common/IconGiver.vue'
import SmallTitle from '../Common/SmallTitle.vue'
import LineInTheMiddle from '../Common/Icons/LineInTheMiddle.vue'
import BehaviorOption from './BehaviorOption.vue'
import { ChevronDownIcon } from "@heroicons/vue/solid";


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
    ChevronDownIcon
  },
  setup: function () {
    const behaviors = ['Click1-5', 'Click6-10', 'Click11+', 'ClickQuickLink', 'NewQuery', 'RefinedQuery', 'EndSession']
    return {
      behaviors
    }
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
    }
  }
}
</script>

<style>

</style>