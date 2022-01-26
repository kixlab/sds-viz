<template>
  <div class="flex items-center bg-white px-2 py-2 rounded-md border border-black">
    <click-quicklink-icon class="w-9 h-9 mr-2" />
    <div class="flex-grow text-center flex flex-col">
      <medium-title>
        Clicked the {{ produceRank(action.req) }} quick link</medium-title
      >
      <medium-title class="mt-2">{{action.title}}</medium-title>
      <medium-title class="mt-2"
        >URL:<a
          :href="action.source"
          class="ml-1 underline text-blue-500"
        >
          {{ action.source }}
        </a></medium-title
      >
    </div>
  </div>
</template>

<script>
import MediumTitle from '../../Common/MediumTitle.vue';
import ClickQuicklinkIcon from '../../Common/Icons/ClickQuicklinkIcon.vue';

export default {
  name: "ClickQuicklinkItem",
  props: ['action'],
  components: {
    MediumTitle,
    ClickQuicklinkIcon,
  },
  methods: {
    produceRank: function (rank) {
      const target = rank % 100
      let suffix = 'th'
      if (target === 11 || target === 12 || target === 13) {
        suffix = 'th'
      } else if (target % 10 === 1) {
        suffix = 'st'
      } else if (target % 10 === 2) {
        suffix = 'nd'
      } else if (target % 10 === 3) {
        suffix = 'rd'
      }
      return `${rank}${suffix}`
    }
  }
};
</script>

<style>
</style>
