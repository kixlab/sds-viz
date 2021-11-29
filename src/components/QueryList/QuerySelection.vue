<template>
  <div class="flex flex-col">
    <section-title> Query Selection </section-title>
    <div class="flex flex-col my-4 mx-2 overflow-y-hidden">
      <div class="flex justify-between items-center">
        <medium-title> Total Count: 203 </medium-title>
        <div class="flex items-center">
          <medium-title class="mx-2"> Sort By: </medium-title>
          <sort-by-dropdown />
        </div>
      </div>
      <div class="flex flex-col overflow-y-scroll mt-4">
        <session-item class="my-2"/>
        <session-item class="my-2"/>
        <session-item class="my-2"/>
        <session-item class="my-2"/>
        <session-item class="my-2"/>
        <session-item class="my-2"/>
        <session-item class="my-2"/>
      </div>
    </div>
  </div>
</template>

<script>
import SectionTitle from "@/components/Common/SectionTitle.vue";
import MediumTitle from "../Common/MediumTitle.vue";
import SortByDropdown from "@/components/QueryList/SortByDropdown.vue";
import SessionItem from "@/components/QueryList/SessionItem.vue";
export default {
  name: "QuerySelection",
  components: {
    SectionTitle,
    MediumTitle,
    SortByDropdown,
    SessionItem,
  },
};
</script>

<style>
</style>
