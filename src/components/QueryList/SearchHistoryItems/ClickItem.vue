<template>
  <div class="flex flex-col bg-white px-2 py-2 rounded-md border border-black">
    <div class="flex items-center">
      <icon-giver class="w-9 h-9 mr-2" v-bind="{action_item: action.Type}"/>
      <div class="flex-grow text-center flex flex-col">
        <medium-title>
          Clicked the {{ action.Rank }}th search result</medium-title
        >
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
    <div class="flex mt-2">
      <div class="flex flex-col flex-grow items-center mt-2 pb-4">
        <div class="iframe-wrapper px-4 pt-2">
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
import IconGiver from '../../Common/IconGiver.vue';
import MediumTitle from "../../Common/MediumTitle.vue";

export default {
  name: "ClickItem",
  props: ["action"],
  components: {
    MediumTitle,
    IconGiver,
  },
};
</script>

<style>
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
