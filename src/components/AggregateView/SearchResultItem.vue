<template>
  <div class="flex flex-row items-stretch w-full">
    <div class="flex-none text-center mx-1">
      Rank 
      <br>
      {{searchResultItem.seq}}
    </div>
    <div class="flex-auto">
      <div class="font-bold">{{searchResultItem.title}}</div>
      <div>{{searchResultItem.context}}</div>
      <div class="text-sm">{{searchResultItem.url}}</div>
    </div>
    <div class="flex-none text-center mx-1">
      {{searchResultItem.count}} 
      <br>
      Clicks
    </div>
  </div>
</template>

<script>
// import { useGlobalStore } from "@/stores/globalStoreAgent.js";
// import { computed } from "vue";
export default {
  props: ['searchResultItem']

}
</script>

<style scoped>

</style>