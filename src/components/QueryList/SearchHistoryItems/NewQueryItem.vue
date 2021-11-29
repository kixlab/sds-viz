<template>
  <div class="flex items-center bg-white px-2 py-2 rounded-md border border-black">
    <search-icon class="w-9 h-9 mr-2" />
    <medium-title class="flex-grow text-center"> Searched: Mailing List of *** Department</medium-title>
  </div>
</template>

<script>
import SearchIcon from '@/components/Common/Icons/SearchIcon.vue';
import MediumTitle from '../../Common/MediumTitle.vue';

export default {
  name: "NewQueryItem",
  components: {
    SearchIcon,
    MediumTitle,
  },
};
</script>

<style>
</style>
