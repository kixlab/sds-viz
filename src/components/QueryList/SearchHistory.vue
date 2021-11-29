<template>
  <div class="flex flex-col py-2 px-2">
    <large-title> Search History </large-title>
    <div class="flex flex-col my-4">
      <new-query-item/>
      <click-11-plus-item class="mt-2"/>
    </div>
  </div>
</template>

<script>
import LargeTitle from '../Common/LargeTitle.vue';
import Click11PlusItem from './SearchHistoryItems/Click11PlusItem.vue';
import NewQueryItem from './SearchHistoryItems/NewQueryItem.vue';

export default {
  name: "SearchHistory",
  components: {
    LargeTitle,
    NewQueryItem,
    Click11PlusItem
  },
};
</script>

<style>
</style>
