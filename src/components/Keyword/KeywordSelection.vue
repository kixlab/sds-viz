<template>
  <div class="flex flex-col">
    <section-title> Keyword selection </section-title>
    <div class="mx-2 my-4 overflow-y-scroll flex-grow">
      <keyword-cluster-item class="mt-2"/>
      <keyword-cluster-item class="mt-2"/>
      <keyword-cluster-item class="mt-2"/>
      <keyword-cluster-item class="mt-2"/>
      <keyword-cluster-item class="mt-2"/>
      <keyword-cluster-item class="mt-2"/>
    </div>
  </div>
</template>

<script>
import SectionTitle from "@/components/Common/SectionTitle.vue";
import KeywordClusterItem from '@/components/Keyword/KeywordClusterItem.vue';

export default {
  name: "KeywordSelection",
  components: {
    SectionTitle,
    KeywordClusterItem,
  },
};
</script>

<style>
</style>
