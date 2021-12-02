<template>
  <new-query-item v-if="action.Type === 'NewQuery'" v-bind="{ action }" />
  <refined-query-item v-else-if="action.Type === 'RefinedQuery'" v-bind="{ action }" />
  <next-page-item v-else-if="action.Type === 'NextPage'" v-bind="{ action }" />
  <click-item v-else-if="['Click6-10', 'Click1-5', 'Click11+'].includes(action.Type)" v-bind="{ action }"/>
  <div v-else>todo</div>
</template>

<script>
import NewQueryItem from "./SearchHistoryItems/NewQueryItem.vue";
import ClickItem from './SearchHistoryItems/ClickItem.vue';
import RefinedQueryItem from './SearchHistoryItems/RefinedQueryItem.vue';
import NextPageItem from './SearchHistoryItems/NextPageItem.vue';

export default {
  name: "ItemGiver",
  props: ["action"],
  components: {
    NewQueryItem,
    ClickItem,
    RefinedQueryItem,
    NextPageItem
  },
};
</script>

<style>
</style>