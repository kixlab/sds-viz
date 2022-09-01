<template>
  <div class="flex flex-col bg-white px-2 py-2 rounded-md border border-black">
    <div class="flex items-center">
      <!-- The search icon -->
      <div class="w-9 h-9 mr-2 flex-none">
        <search-icon v-if="action.Type === 'NewQuery'" />
        <search-short-icon v-else-if="action.Type === 'NewQuery_Short'" />
      </div>
      <!-- Searched ... -->
      <medium-title class="flex-grow text-center">Searched:  {{ action.Query }} </medium-title>
      <!-- <medium-title class="flex-grow text-center">Expanded as:  {{ action.ExtendedQuery }} </medium-title> -->
    </div>
    <!-- i-frame component to show the search results -->
    <!-- <div class="flex mt-2">
      <div class="flex flex-col flex-grow items-center mt-2 pb-4">
        <div :class="['flex justify-center items-center h-6 w-full border border-black rounded-md cursor-pointer', seeSearchResults ? 'bg-gray-400' : 'bg-gray-200']" v-on:click="toggleSearchResults">
          {{ seeSearchResults ? 'Close query results' : 'See query results' }}
        </div>
        <div v-if="seeSearchResults" class="w-2/3">
          <div v-for="item in action.QueryResults" :key="item.id" class="search-results break-all mt-2 border-t-4 text-justify">
            <div class="justify-between flex items-end">
              <div class="text-lg font-medium underline cursor-pointer break-all"><a :href="item.url" target="_blank"> {{item.title}} </a> </div>
            </div>
            <p>{{item.context}}</p>
            <div class="flex justify-between">
              <div class="text-sm">Board: {{item.board}} </div>
              <div class="text-sm">Score: {{item.score}}</div>
            </div>
          </div>
        </div>
        <div v-if="seeSearchResults" class="iframe-wrapper px-4 pt-2">
         <iframe
            class="scaled-iframe"
            :src="`https://www.google.com/search?igu=1&q=${action.Query}&sourceid=chrome-mobile`"
          ></iframe> 
        </div>
      </div>
    </div> -->
    <div class="text-sm text-right">
      Total dwell time: {{action.Summary.total_stay_sec}} s
    </div>
  </div>
</template>

<script>
import SearchIcon from '@/components/Common/Icons/SearchIcon.vue';
import SearchShortIcon from '@/components/Common/Icons/SearchShortIcon.vue';

import MediumTitle from '../../Common/MediumTitle.vue';
// import SmallTitle from '../../Common/SmallTitle.vue';
import { inject, ref } from 'vue'

export default {
  name: "NewQueryItem",
  // 'action' prop used to store the query information
  props: ['action'],
  components: {
    SearchIcon,
    SearchShortIcon,
    MediumTitle,
    // SmallTitle,
  },
  setup(props) {
    const createLog = inject('createLog')
    const session = inject('session')
    const seeSearchResults = ref(false)
    const toggleSearchResults = function () {
      if (seeSearchResults.value) {
        createLog('closeSearchResultsFromNewQuery', {
          query: props.action.Query,
          session: session
        })
        seeSearchResults.value = false
      } else {
        createLog('showSearchResultsFromNewQuery', {
          query: props.action.Query,
          session: session
        })
        seeSearchResults.value = true
      }
    }
    return {
      createLog,
      seeSearchResults,
      toggleSearchResults
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
