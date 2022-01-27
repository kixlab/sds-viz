<template>
  <!-- Choose the right action rendering component based on the action -->

  <new-query-item v-if="action.Type === 'NewQuery' || action.Type === 'NewQuery_Short'" v-bind="{ action }" />
  <refined-query-item v-else-if="action.Type === 'RefinedQuery'  || action.Type === 'RefinedQuery_Short'" v-bind="{ action }" />
  <next-page-item v-else-if="action.Type === 'NextPage'" v-bind="{ action }" />
  <click-quicklink-item v-else-if="action.Type === 'ClickQuickLink'" v-bind="{ action }" />
  <click-item v-else-if="['Click6-10', 'Click1-5', 'Click11+', 'Click6-10_Short', 'Click1-5_Short', 'Click11+_Short'].includes(action.Type)" v-bind="{ action }"/>
  <end-session v-else-if="action.Type === 'EndSession'" v-bind="{ action }" />
  <div v-else>todo</div>
</template>

<script>
import NewQueryItem from "./SearchHistoryItems/NewQueryItem.vue";
import ClickItem from "./SearchHistoryItems/ClickItem.vue";
import RefinedQueryItem from "./SearchHistoryItems/RefinedQueryItem.vue";
import NextPageItem from "./SearchHistoryItems/NextPageItem.vue";
import EndSession from "./SearchHistoryItems/EndSession.vue";

export default {
  name: "ItemGiver",
  // 'action' is provided from the parent component
  props: ["action"],
  components: {
    NewQueryItem,
    ClickItem,
    RefinedQueryItem,
    NextPageItem,
    EndSession
  },
};
</script>

<style>
</style>