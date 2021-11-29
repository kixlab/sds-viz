<template>
  <div class="flex flex-col bg-white px-2 py-2 rounded-md border border-black">
    <div class="flex items-center">
      <click-11-plus-icon class="w-9 h-9 mr-2"/>
      <medium-title class="flex-grow text-center"> Clicked the 11+th search result</medium-title>
    </div>
    <div class="flex">
      <div class="w-9 h-9 mr-2">
      </div>
      <div class="flex flex-col flex-grow items-center mt-2">
      Search Results
      <div class="w-3/4 h-36 bg-gray-800 my-2">

      </div>
    </div>
    </div>
  </div>
</template>

<script>
import Click11PlusIcon from '../../Common/Icons/Click11PlusIcon.vue';
import MediumTitle from '../../Common/MediumTitle.vue';

export default {
  name: "Click11PlusItem",
  components: {
    MediumTitle,
    Click11PlusIcon,
  },
};
</script>

<style>
</style>
