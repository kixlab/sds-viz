<template>
  <div class="flex flex-col">
    <large-title class="text-center">
      <slot> </slot>
    </large-title>
    <filter-chart-vis/>
  </div>
</template>

<script>
import LargeTitle from "@/components/Common/LargeTitle.vue";
import FilterChartVis from "@/components/Filter/FilterChartVis.vue";
export default {
  name: "FilterChart",
  components: {
    LargeTitle,
    FilterChartVis
  },
};
</script>

<style>
</style>
