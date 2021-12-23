<template>
  <div
    class="flex items-center bg-white px-2 py-2 rounded-md border border-black"
  >
    <!-- Next page icon -->
    <next-page-icon class="w-9 h-9 mr-2" />
    <!-- Switched to next page -->
    <medium-title class="flex-grow text-center"
      >Switched to next page</medium-title
    >
  </div>
</template>

<script>
import MediumTitle from "../../Common/MediumTitle.vue";
import NextPageIcon from "../../Common/Icons/NextPageIcon.vue";

export default {
  name: "NextPageItem",
  // 'action' prop used to store the query information
  props: ["action"],
  components: {
    MediumTitle,
    NextPageIcon,
  },
};
</script>

<style>
</style>
