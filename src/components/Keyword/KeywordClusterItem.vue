<template>
  <div class="w-auto mh-16 bg-gray-200 border border-black rounded-md flex justify-between">
    <div class="flex flex-col mx-2 my-1">
      <large-title>Example Keyword</large-title>
      <small-title>
        Example Queries: Project Management, Project Idea,
      </small-title>
    </div>
    <div class="bg-blue-200 rounded-xl flex justify-center items-center mx-2 my-4 px-1">
      320
    </div>
  </div>
</template>

<script>
import LargeTitle from "@/components/Common/LargeTitle.vue";
import SmallTitle from '@/components/Common/SmallTitle.vue';

export default {
  name: "KeywordClusterItem",  
  components: {
    LargeTitle,
    SmallTitle
  },
}
</script>

<style>
</style>