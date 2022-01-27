<template>
  <div class="flex flex-col bg-white px-2 py-2 rounded-md border border-black">
    <div class="flex items-center">
      <!-- The icon corresponding to the click -->
      <icon-giver class="w-9 h-9 mr-2" v-bind="{ action_item: action.Type }" />
      <!-- The texts -->
      <div class="flex-grow text-center flex flex-col">
        <!-- Clicked .... -->
        <medium-title>
          Clicked the {{ produceRank(action.Rank) }} search result</medium-title
        >
        <medium-title class="mt-2">{{action.ClickedTitle}}</medium-title>
        <medium-title class="mt-2"
          >URL:<a
            :href="action.ClickedURL"
            class="ml-1 underline text-blue-500"
          >
            {{ action.ClickedURL }}
          </a></medium-title
        >
      </div>
    </div>
    <!-- I-frame to show the search results -->
    <div class="flex mt-2">
      <div class="flex flex-col flex-grow items-center mt-2 pb-4">
        <div :class="['flex justify-center items-center h-6 w-full border border-black rounded-md cursor-pointer', seeSearchResults ? 'bg-gray-400' : 'bg-gray-200']" v-on:click="seeSearchResults = !seeSearchResults">
          {{ seeSearchResults ? 'Close document content' : 'See document content' }}
        </div>
        <div v-if="seeSearchResults" class="xl:w-full 2xl:w-1/2">
          <div class="mt-2 border-4 text-justify">
            <!-- <p>{{action.ClickedContext}}</p> -->
            <p v-html="highlightedContext"></p>
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
      Dwell time: {{action.DwellTime}} s
    </div>
  </div>
</template>

<script>
import IconGiver from "../../Common/IconGiver.vue";
import MediumTitle from "../../Common/MediumTitle.vue";

export default {
  name: "ClickItem",
  props: ["action"],
  components: {
    MediumTitle,
    IconGiver,
  },
  computed: {
    highlightedContext: function () {
      // const regex = new RegExp(`(${this.action.Query})`, "gi");
      const c = this.action.ClickedContext.replaceAll(this.action.Query, '<span class="text-blue-500">$&</span>');
      return c
    }
  },
  data() {
    return {
      // Stores whether to see the search results or not
      seeSearchResults: false,
    };
  },
  methods: {
    // Naming of the rankings (e.g. "1st", "2nd", "3rd", ...)
    produceRank: function (rank) {
      const target = rank % 100;
      let suffix = "th";
      if (target === 11 || target === 12 || target === 13) {
        suffix = "th";
      } else if (target % 10 === 1) {
        suffix = "st";
      } else if (target % 10 === 2) {
        suffix = "nd";
      } else if (target % 10 === 3) {
        suffix = "rd";
      }
      return `${rank}${suffix}`;
    },
  },
};
</script>

<style>
/* Style elements corresponding to the i-frame element */
:root {
  --scale-val: 0.5;
  --wrap-width: 100%;
  --wrap-height: 450px;
}
.iframe-wrapper {
  width: var(--wrap-width);
  height: var(--wrap-height);
  padding: 0;
  overflow: hidden;
}
.scaled-iframe {
  width: calc(1 / var(--scale-val) * var(--wrap-width));
  height: calc(1 / var(--scale-val) * var(--wrap-height));
  border-radius: 6px;
  zoom: (var(--scale-val));
  -moz-transform: scale(var(--scale-val));
  -moz-transform-origin: 0 0;
  -o-transform: scale(var(--scale-val));
  -o-transform-origin: 0 0;
  -webkit-transform: scale(var(--scale-val));
  -webkit-transform-origin: 0 0;
}
</style>
