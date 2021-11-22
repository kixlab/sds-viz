<template>
  <div class="flex flex-col">
    <section-title> Filter panel </section-title>
    <div class="flex justify-around flex-wrap my-4 mx-2 overflow-y-scroll">
      <filter-chart class="mt-2 mx-2"> Example Filter 1</filter-chart>
      <filter-chart class="mt-2 mx-2"> Example Filter 2</filter-chart>
      <filter-chart class="mt-2 mx-2"> Example Filter 3</filter-chart>
      <filter-chart class="mt-2 mx-2"> Example Filter 4</filter-chart>
      <filter-chart class="mt-2 mx-2"> Example Filter 5</filter-chart>
    </div>
  </div>
</template>

<script>
import SectionTitle from "@/components/Common/SectionTitle.vue";
import FilterChart from '@/components/Filter/FilterChart.vue';

export default {
  name: "FilterPanel",
  components: {
    SectionTitle,
    FilterChart
  },
};
</script>

<style>
</style>
