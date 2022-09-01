<template>
  <div :class="['w-2/3 relative']">
    <div class="flex">
      <div class="flex items-center justify-center">
        <label 
          for="toogleA"
          class="flex items-center cursor-pointer"
        >
          <!-- toggle -->
          <div class="relative">
            <!-- input -->
            <input id="toogleA" type="checkbox" class="sr-only" 
            :checked="isExactMatchEnabled"
            @click="updateExactMatch" />
            <!-- line -->
            <div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
            <!-- dot -->
            <div class="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
          </div>
          <!-- label -->
          <div class="ml-3 text-gray-700 font-medium">
            Exact Match
          </div>
        </label>
      </div>
      <div :class="[isBorderHighlighted && 'glow','flex flex-1 justify-between rounded-lg shadow-md py-2 pl-3 pr-5 cursor-pointer']" @click.self="seeBehaviorPanel()">
        <div v-if="selectedBehaviors.length > 0" class="flex flex-1 items-center">
          <template v-for="(b, i) in selectedBehaviors" :key="i">
            <div class="w-6 h-6 relative cursor-pointer" @click="removeBehavior(i)">
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
        <div class="flex flex-1 items-center text-gray-400" @click="seeBehaviorPanel()" v-else>
          Click to open the action palette and add behaviors to start searching
        </div>
        <div class="flex flex-none items-center">
          <button @click="seeBehaviorPanel()" class="cursor-pointer">
            <ChevronDownIcon v-if="!showOptions" class="-mr-1 ml-1 h-6 w-6" aria-hidden="true" />
            <ChevronUpIcon v-else class="-mr-1 ml-1 h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div class="flex flex-none items-center px-2 py-1 rounded-lg shadow-md bg-blue-800 text-white">
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
        :explanation="explanations[b]"
        @click="pushBehavior(b)"
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
import { computed, inject, ref } from "vue";
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
    const behaviors = ['Click1-5', 'Click1-5_Short', 'Click6-10', 'Click6-10_Short', 'Click11+', 'Click11+_Short', 'NewQuery', 'NewQuery_Short', 'RefinedQuery', 'RefinedQuery_Short', 'ClickQuickLink', 'EndSession', 'NextPage']
    const store = useGlobalStore();
    // Current interaction state (which panel is open, which metric is chosen)
    const interactionState = computed(() => store.getInteractionState.value);
    // Updates the interaction state
    const setInteractionState = store.setInteractionState;
    const setShorthandBehaviors = store.setShorthandBehaviors

    const createLog = inject('createLog')
    const isExactMatchEnabled = computed(() => store.getExactMatchEnabled.value)
    const isBorderHighlighted = ref(false)
    const highlights = computed(() => store.getHighlights.value)

    const explanations = {
        'Click1-5': `Click rank 1-5`,
        'Click6-10': 'Click rank 6-10',
        'Click11+': 'Click rank ≥ 11',
        'Click1-5_Short': `Click rank 1-5, dwell time < 30s`,
        'Click6-10_Short': 'Click rank 6-10, dwell time < 30s',
        'Click11+_Short': 'Click rank ≥ 11, dwell time < 30s',
        // 'ClickQuickLink': 'Click on a quick link',
        'NextPage': 'Next page',
        'NewQuery': 'New query',
        'RefinedQuery': 'Query refined',
        'NewQuery_Short': 'New query, dwell time < 30s',
        'RefinedQuery_Short': 'Query refined, dwell time < 30s',
        'EndSession': 'Session ended'
      }
    // watch(() => highlights, (newVal, oldVal) => {
    //   console.log('watch')
    //   if (newVal.value.source === 'BehaviorSearchBox') {
    //     isBorderHighlighted.value = true
    //   } else {
    //     isBorderHighlighted.value = false
    //   }
    // }, {
    //   deep: true
    // })
    return {
      interactionState,
      setInteractionState,
      behaviors,
      setShorthandBehaviors, 
      createLog,
      isExactMatchEnabled,
      setExactMatchEnabled: store.setExactMatchEnabled,
      isBorderHighlighted,
      highlights,
      explanations
    };
  },
  data: function () {
    return {
      selectedBehaviors: [],
      showOptions: false
    }
  },
  methods: {
    removeBehavior: function (i) {
      this.createLog('removeActionFromBehaviorSearchBox', {
        action: this.selectedBehaviors[i],
        behaviors: this.selectedBehaviors
      })
      this.selectedBehaviors.splice(i, 1)
    },
    setBehaviors: function () {
      console.log('setBehaviors')
      this.createLog('setBehaviorFromBehaviorSearchBox', {
        behaviors: this.selectedBehaviors
        //TODO: search results?
      })
      this.setShorthandBehaviors(this.shorthandSelectedBehaviors)
      this.showOptions = false
    },
    seeBehaviorPanel() {
      if (this.showOptions) {
        this.createLog('closeBehaviorPanel', {
          behaviors: this.selectedBehaviors
        })
      } else {
        this.createLog('openBehaviorPanel', {
          behaviors: this.selectedBehaviors
        })
      }
      this.showOptions = !this.showOptions
    },
    pushBehavior: function (b) {
      this.createLog('addActionToBehaviorSearchBox', {
        action: b,
        behaviors: this.selectedBehaviors
      })
      this.selectedBehaviors.push(b)
    },
    updateExactMatch: function () {
      if (this.isExactMatchEnabled === true) {
        this.createLog('exactMatchBehaviorDisabled', {
          behaviors: this.selectedBehaviors
        })
      } else {
        this.createLog('exactMatchBehaviorsEnabled', {
          behaviors: this.selectedBehaviors
        })
      }
      this.setExactMatchEnabled(!this.isExactMatchEnabled)
    }
  },
  computed: {
    shorthandSelectedBehaviors: function () {
      const shorthand_behaviors_dict = window.globalVars.SHORTHAND_ACTIONS
      return this.selectedBehaviors.map(b => shorthand_behaviors_dict[b]).join('')
    }
  },
  watch: {
    highlights: {
      handler: function (newVal, oldVal) {
        console.log('watch')
        if (newVal.source === 'BehaviorSearchBox') {
          this.isBorderHighlighted = true
        } else {
          this.isBorderHighlighted = false
          this.selectedBehaviors = []
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
input:checked ~ .dot {
  transform: translateX(100%);
  background-color: #48bb78;
}
.glow {
  box-shadow: 10px 5px 20px rgb(255 208 0 / 90%);  /* stroke: black;
  stroke-width: 2; */
}
</style>