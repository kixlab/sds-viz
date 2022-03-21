<template>
  <div class="flex items-center bg-white px-2 py-2 rounded-md border border-black">
    <div class="w-9 h-9 mr-2">
      <icon-giver :action_item="action.Type"></icon-giver>
    </div>
    <!-- <next-page-icon class="w-9 h-9 mr-2" /> -->
    <medium-title class="flex-grow text-center">Session ended by {{action.by}}</medium-title>
  </div>
</template>

<script>
import MediumTitle from '../../Common/MediumTitle.vue';
// import NextPageIcon from '../../Common/Icons/NextPageIcon.vue';
import IconGiver from '../../Common/IconGiver.vue';

export default {
  name: "EndSessionItem",
  props: ['action'],
  components: {
    MediumTitle,
    // NextPageIcon,
    IconGiver,
  },
};
</script>

<style>
</style>
