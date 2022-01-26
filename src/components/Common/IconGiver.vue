<template>
  <click-11-plus-icon v-if="action_item === 'Click11+'" />
  <click-11-plus-short-icon v-else-if="action_item === 'Click11+_Short'" />
  <click-15-icon v-else-if="action_item === 'Click1-5'" />
  <click-15-short-icon v-else-if="action_item === 'Click1-5_Short'" />
  <click-610-icon v-else-if="action_item === 'Click6-10'" />
  <click-610-short-icon v-else-if="action_item === 'Click6-10_Short'" />
  <click-quicklink-icon v-else-if="action_item === 'ClickQuickLink'" />
  <empty-icon v-else-if="action_item === 'Empty'" />
  <empty-icon v-else-if="action_item === 'EndSession'" />
  <search-refine-icon v-else-if="action_item === 'RefinedQuery'" />
  <search-refine-short-icon v-else-if="action_item === 'RefinedQuery_Short'" />
  <search-icon v-else-if="action_item === 'NewQuery'" />
  <search-short-icon v-else-if="action_item === 'NewQuery_Short'" />
  <next-page-icon v-else-if="action_item === 'NextPage'"/> 
</template>

<script>

import Click11PlusIcon from "./Icons/Click11PlusIcon.vue";
import Click15Icon from "./Icons/Click15Icon.vue";
import Click610Icon from "./Icons/Click610Icon.vue";
import Click11PlusShortIcon from "./Icons/Click11PlusShortIcon.vue"
import Click15ShortIcon from "./Icons/Click15ShortIcon.vue";
import Click610ShortIcon from "./Icons/Click610ShortIcon.vue";
import EmptyIcon from "./Icons/EmptyIcon.vue";
import SearchRefineIcon from "./Icons/SearchRefineIcon.vue";
import SearchIcon from "./Icons/SearchIcon.vue";
import SearchRefineShortIcon from "./Icons/SearchRefineShortIcon.vue";
import SearchShortIcon from "./Icons/SearchShortIcon.vue";
import NextPageIcon from './Icons/NextPageIcon.vue';
import ClickQuicklinkIcon from './Icons/ClickQuicklinkIcon.vue';

export default {
  name: "IconGiver",
  props: ["action_item"],
  components: {
    Click11PlusIcon,
    Click15Icon,
    Click610Icon,
    Click11PlusShortIcon,
    Click15ShortIcon,
    Click610ShortIcon,
    EmptyIcon,
    SearchRefineIcon,
    SearchIcon,
    SearchRefineShortIcon,
    SearchShortIcon,
    NextPageIcon,
    ClickQuicklinkIcon
  },
};
</script>

<style>
</style>