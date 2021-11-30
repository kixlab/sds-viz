<template>
    <click-11-plus-item v-if="action.Type === 'Click11+'" />
    <new-query-item v-else-if="action.Type === 'NewQuery'" />
    <div v-else>
        todo
    </div>
</template>

<script>
import Click11PlusItem from './SearchHistoryItems/Click11PlusItem.vue';
import NewQueryItem from './SearchHistoryItems/NewQueryItem.vue';

export default {
  name: "ItemGiver",
  props: ["action"],
  components: {
    Click11PlusItem,
    NewQueryItem
  },
};
</script>

<style>
</style>