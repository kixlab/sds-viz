<template>
  <div class="flex flex-col py-2 px-2">
    <large-title> Search History </large-title>
    <div class="flex flex-col my-4">
      <item-giver v-for="action in session.sequence" :key="action" v-bind="{action}" class="my-2"/>
    </div>
  </div>
</template>

<script>
import LargeTitle from '../Common/LargeTitle.vue';
import ItemGiver from './ItemGiver.vue';

export default {
  name: "SearchHistory",
  components: {
    LargeTitle,
    ItemGiver
  },
  props: ['session'],
  data() {
  }
};
</script>

<style>
</style>
