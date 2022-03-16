<template>
  <!-- Search refinement action -->
  <div class="flex flex-col bg-white px-2 py-2 rounded-md border border-black">
    <div class="flex items-center">
      <!-- Search refine icon -->
      <search-refine-icon v-if="action.Type === 'RefinedQuery'" class="w-9 h-9 mr-2" />
      <search-refine-short-icon v-if="action.Type === 'RefinedQuery_Short'" class="w-9 h-9 mr-2" />
      <!-- Refined to .... -->
      <medium-title class="flex-grow text-center"
        >Searched: {{ action.Query }}
      </medium-title>
      <medium-title class="flex-grow text-center"
        >Processed as: {{ action.ExtendedQuery }}
      </medium-title>
    </div>
    <!-- i-frame to show the search results -->
    <div class="flex mt-2">
      <div class="flex flex-col flex-grow items-center mt-2 pb-4">
        <div :class="['flex justify-center items-center h-6 w-full border border-black rounded-md cursor-pointer', seeSearchResults ? 'bg-gray-400' : 'bg-gray-200']" v-on:click="seeSearchResults = !seeSearchResults">
          {{ seeSearchResults ? 'Close query results' : 'See query results' }}
        </div>
        <div v-if="seeSearchResults" class="w-2/3">
          <div v-for="item in action.QueryResults" :key="item.id" class="search-results mt-2 border-t-4 text-justify">
            <div class="justify-between flex items-end">
              <div class="text-lg font-medium underline cursor-pointer"><a :href="item.url"> {{item.title}} </a> </div>
              <div class="text-sm">Score: {{item.score}}</div>
            </div>
            <p>{{item.context}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="text-sm text-right">
      Total dwell time: {{action.Summary.total_stay_sec}} s
    </div>
  </div>
</template>

<script>
import MediumTitle from "../../Common/MediumTitle.vue";
import SearchRefineIcon from "../../Common/Icons/SearchRefineIcon.vue";
import { inject, ref } from 'vue'
export default {
  name: "RefinedQueryItem",
  props: ["action"],
  components: {
    MediumTitle,
    SearchRefineIcon,
  },
  setup(props) {
    const createLog = inject('createLog')
    const session = inject('session')
    const seeSearchResults = ref(false)
    const toggleSearchResults = function () {
      if (seeSearchResults.value) {
        createLog('closeSearchResultsFromRefinedQuery', {
          query: props.action.Query,
          session: session
        })
        seeSearchResults.value = false
      } else {
        createLog('showSearchResultsFromRefinedQuery', {
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
</style>
