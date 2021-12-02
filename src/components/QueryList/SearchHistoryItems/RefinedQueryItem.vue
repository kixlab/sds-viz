<template>
  <div class="flex items-center bg-white px-2 py-2 rounded-md border border-black">
    <search-refine-icon class="w-9 h-9 mr-2" />
    <medium-title class="flex-grow text-center">Refined to: {{ action.Query }} </medium-title>
  </div>
</template>

<script>
import MediumTitle from '../../Common/MediumTitle.vue';
import SearchRefineIcon from '../../Common/Icons/SearchRefineIcon.vue';

export default {
  name: "RefinedQueryItem",
  props: ['action'],
  components: {
    MediumTitle,
    SearchRefineIcon,
  },
};
</script>

<style>
</style>
