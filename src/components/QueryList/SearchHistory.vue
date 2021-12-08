<template>
  <div class="flex flex-col py-2 px-2">
    <large-title> User Search History </large-title>
    <div class="flex flex-col items-center my-4">
      <template v-for="(action,i) in session.sequence" :key="action" >
      <item-giver v-bind="{action}" class="w-full"/>
      <line-in-the-middle-vertical class="w-4 h-4" v-if="i !== session.sequence.length - 1" />
      </template>
    </div>
  </div>
</template>

<script>
import LargeTitle from '../Common/LargeTitle.vue';
import ItemGiver from './ItemGiver.vue';
import LineInTheMiddleVertical from '../Common/Icons/LineInTheMiddleVertical.vue';

export default {
  name: "SearchHistory",
  components: {
    LargeTitle,
    ItemGiver,
    LineInTheMiddleVertical
  },
  props: ['session'],
  data() {
  }
};
</script>

<style>
</style>
