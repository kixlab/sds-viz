<template>
  <div class="flex flex-col bg-white px-2 py-2 rounded-md border border-black">
    <div class="flex items-center">
      <!-- The search icon -->
      <search-icon class="w-9 h-9 mr-2" />
      <!-- Searched ... -->
      <medium-title class="flex-grow text-center">Searched:  {{ action.Query }} </medium-title>
    </div>
    <!-- i-frame component to show the search results -->
    <div class="flex mt-2">
      <div class="flex flex-col flex-grow items-center mt-2 pb-4">
        <div :class="['flex justify-center items-center h-6 w-full border border-black rounded-md cursor-pointer', seeSearchResults ? 'bg-gray-400' : 'bg-gray-200']" v-on:click="seeSearchResults = !seeSearchResults">
          {{ seeSearchResults ? 'Close search results' : 'See search results (of Google)' }}
        </div>
        <div v-if="seeSearchResults" class="iframe-wrapper px-4 pt-2">
          <iframe
            class="scaled-iframe"
            :src="`https://www.google.com/search?igu=1&q=${action.Query}&sourceid=chrome-mobile`"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchIcon from '@/components/Common/Icons/SearchIcon.vue';
import MediumTitle from '../../Common/MediumTitle.vue';

export default {
  name: "NewQueryItem",
  // 'action' prop used to store the query information
  props: ['action'],
  components: {
    SearchIcon,
    MediumTitle,
  },
  data() {
    return {
      // Whether to show the search results
      'seeSearchResults': false,
    }
  },
};
</script>

<style>
</style>
