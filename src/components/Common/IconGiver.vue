<template>
  <!-- Check the action item, and give the right icon -->
  <click-11-plus-icon v-if="action_item === 'Click11+'" />
  <click-15-icon v-else-if="action_item === 'Click1-5'" />
  <click-610-icon v-else-if="action_item === 'Click6-10'" />
  <empty-icon v-else-if="action_item === 'Empty'" />
  <search-refine-icon v-else-if="action_item === 'RefinedQuery'" />
  <search-icon v-else-if="action_item === 'NewQuery'" />
    <next-page-icon v-else-if="action_item === 'NextPage'"/> 
</template>

<script>

import Click11PlusIcon from "./Icons/Click11PlusIcon.vue";
import Click15Icon from "./Icons/Click15Icon.vue";
import Click610Icon from "./Icons/Click610Icon.vue";
import EmptyIcon from "./Icons/EmptyIcon.vue";
import SearchRefineIcon from "./Icons/SearchRefineIcon.vue";
import SearchIcon from "./Icons/SearchIcon.vue";
import NextPageIcon from './Icons/NextPageIcon.vue';

export default {
  name: "IconGiver",
  props: ["action_item"],
  components: {
    Click11PlusIcon,
    Click15Icon,
    Click610Icon,
    EmptyIcon,
    SearchRefineIcon,
    SearchIcon,
    NextPageIcon,
  },
};
</script>

<style>
</style>