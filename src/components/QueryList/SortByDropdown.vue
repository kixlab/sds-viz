<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="
          flex
          items-center
          justify-between
          w-full
          rounded-md
          border border-gray-300
          shadow-sm
          px-2
          py-1
          bg-white
          text-xs text-gray-700
          hover:bg-gray-50
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          focus:ring-offset-gray-100
          focus:ring-indigo-500
        "
      >
        <up-icon
          class="h-4 w-4 mr-1"
          v-if="isMetricGoodnessDirect[mainOption] === true"
        />
        <down-icon class="h-4 w-4 mr-1" v-else />
        {{ mainOption }}
        <ChevronDownIcon class="-mr-1 ml-1 h-4 w-4" aria-hidden="true" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="
          origin-top-right
          absolute
          right-0
          mt-1
          w-40
          rounded-md
          shadow-lg
          bg-white
          ring-1 ring-black ring-opacity-5
          focus:outline-none
          z-50
        "
      >
        <div class="py-1">
          <MenuItem
            v-slot="{ active }"
            v-for="option in allOptions"
            :key="option"
          >
            <div
              v-bind:class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'px-2 py-1 text-xs cursor-pointer flex items-center',
              ]"
              v-on:click="pickOption(option)"
            >
              <up-icon
                class="h-4 w-4 mr-2"
                v-if="isMetricGoodnessDirect[option] === true"
              />
              <down-icon class="h-4 w-4 mr-2" v-else />
              {{ option }}
            </div>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { inject } from "vue";
import UpIcon from "../Common/Icons/UpIcon.vue";
import DownIcon from "../Common/Icons/DownIcon.vue";
import { ChevronDownIcon } from "@heroicons/vue/solid";
export default {
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    UpIcon,
    DownIcon,
    ChevronDownIcon,
  },
  setup() {
    // Inject the properties from the parent component
    const parentCallFunction = inject("parentCallFunction");
    const allOptions = inject("allOptions");
    const mainOption = inject("mainOption");
    // Whether the metric goodness is directly proportionate with the value of the metric
    // whether, the higher is the better
    const isMetricGoodnessDirect = window.globalVars.IS_METRIC_GOODNESS_DIRECT;
    const createLog = inject('createLog')
    return {
      parentCallFunction,
      allOptions,
      mainOption,
      isMetricGoodnessDirect,
      createLog
    };
  },
  data() {
    return {};
  },
  methods: {
    // When an option is picked, the parentCallFunction is called with this option
    // Then, the parent component will set the dropdown option
    pickOption: function (option) {
      this.createLog('pickDropdownOption', {
        option: option
      })
      this.parentCallFunction(option);
    },
  },
};
</script>