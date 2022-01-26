<template>
  <div class="flex flex-col bg-white px-2 py-2 rounded-md border border-black">
    <div class="flex items-center">
      <search-icon class="w-9 h-9 mr-2" />
      <medium-title class="flex-grow text-center">Searched:  {{ action.Query }} </medium-title>
    </div>
    <div class="flex mt-2">
      <div class="flex flex-col flex-grow items-center mt-2 pb-4">
        <div :class="['flex justify-center items-center h-6 w-full border border-black rounded-md cursor-pointer', seeSearchResults ? 'bg-gray-400' : 'bg-gray-200']" v-on:click="seeSearchResults = !seeSearchResults">
          {{ seeSearchResults ? 'Close query results' : 'See query results' }}
        </div>
        <div v-if="seeSearchResults" class="xl:w-full 2xl:w-1/2">
          <div v-for="item in action.QueryResults" :key="item.id" class="search-results mt-2 border-t-4 text-justify">
            <div class="justify-between flex items-end">
              <div class="text-lg font-medium underline cursor-pointer"><a :href="item.url"> {{item.title}} </a> </div>
              <div class="text-sm">Score: {{item.score}}</div>
            </div>
            <p>{{item.context}}</p>
          </div>
        </div>
        <!-- <div v-if="seeSearchResults" class="iframe-wrapper px-4 pt-2">
         <iframe
            class="scaled-iframe"
            :src="`https://www.google.com/search?igu=1&q=${action.Query}&sourceid=chrome-mobile`"
          ></iframe> 
        </div> -->
      </div>
    </div>
    <div class="text-sm text-right">
      Total dwell time: {{action.Summary.total_stay_sec}} s
    </div>
  </div>
</template>

<script>
import SearchIcon from '@/components/Common/Icons/SearchIcon.vue';
import MediumTitle from '../../Common/MediumTitle.vue';
// import SmallTitle from '../../Common/SmallTitle.vue';

export default {
  name: "NewQueryItem",
  props: ['action'],
  components: {
    SearchIcon,
    MediumTitle,
    // SmallTitle,
  },
  data() {
    return {
      'seeSearchResults': false,
    }
  },
};
</script>

<style>

.search-results {
  margin-top: 10px;
}

.search-results .title {
  font-weight: bold;
}
</style>
