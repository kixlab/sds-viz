<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="
          inline-flex
          justify-center
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
          w-36
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
                'block px-4 py-1 text-xs cursor-pointer',
              ]"
              v-on:click="pickOption(option)"
            >
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
import { ChevronDownIcon } from "@heroicons/vue/solid";
import { inject } from "vue";
export default {
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    ChevronDownIcon,
  },
  setup() {
    // local store
    const parentCallFunction = inject("parentCallFunction");
    const allOptions = inject("allOptions");
    const mainOption = inject("mainOption");
    return {
      parentCallFunction,
      allOptions,
      mainOption,
    };
  },
  data() {
    return {};
  },
  methods: {
    pickOption: function (option) {
      this.parentCallFunction(option);
    },
  },
};
</script>