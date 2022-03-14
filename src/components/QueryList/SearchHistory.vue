<template>
  <div class="flex flex-col py-2 px-2">
    <!-- The title -->
    <large-title> User Search History </large-title>
    <!-- List of the action items in the search history -->
    <div class="flex flex-col items-center my-4">
      <template v-for="(action, i) in session.sequence" :key="action">
        <!-- Give the corresponding action item -->
        <item-giver v-bind="{ action }" class="w-full" />
        <!-- Render the line in the middle (but vertical) -->
        <line-in-the-middle-vertical
          class="w-4 h-4"
          v-if="i !== session.sequence.length - 1"
        />
      </template>
    </div>
  </div>
</template>

<script>
import LargeTitle from "../Common/LargeTitle.vue";
import ItemGiver from "./ItemGiver.vue";
import LineInTheMiddleVertical from "../Common/Icons/LineInTheMiddleVertical.vue";
import { provide } from 'vue'
export default {
  name: "SearchHistory",
  components: {
    LargeTitle,
    ItemGiver,
    LineInTheMiddleVertical,
  },
  setup(props) {
    provide('session', props.session)
  },
  // Prop from the parent (which is the session information)
  props: ["session"],
  data() {
    return {
      
    }
  },
};
</script>

<style>
</style>
