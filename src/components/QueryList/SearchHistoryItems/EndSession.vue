<template>
  <div class="flex items-center bg-white px-2 py-2 rounded-md border border-black">
    <next-page-icon class="w-9 h-9 mr-2" />
    <medium-title class="flex-grow text-center">Session ended by {{action.by}}</medium-title>
  </div>
</template>

<script>
import MediumTitle from '../../Common/MediumTitle.vue';
import NextPageIcon from '../../Common/Icons/NextPageIcon.vue';

export default {
  name: "EndSessionItem",
  props: ['action'],
  components: {
    MediumTitle,
    NextPageIcon,
  },
};
</script>

<style>
</style>
