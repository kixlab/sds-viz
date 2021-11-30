<template>
  <div class="flex flex-col">
    <section-title> Query Selection </section-title>
    <div class="flex flex-col my-4 mx-2 overflow-y-hidden">
      <div class="flex justify-end items-center">
        <!-- <medium-title> Total Count: 203 </medium-title> -->
        <div class="flex items-center">
          <medium-title class="mx-2"> Sort By: </medium-title>
          <sort-by-dropdown />
        </div>
      </div>
      <div class="flex flex-col overflow-y-scroll mt-4">
        <session-item v-for="session in sessions" :key="session.id" class="my-2" v-bind="{
          session: session
        }"/>
      </div>
    </div>
  </div>
</template>

<script>
import SectionTitle from "@/components/Common/SectionTitle.vue";
import MediumTitle from "../Common/MediumTitle.vue";
import SortByDropdown from "@/components/QueryList/SortByDropdown.vue";
import SessionItem from "@/components/QueryList/SessionItem.vue";
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed } from "vue";
export default {
  name: "QuerySelection",
  components: {
    SectionTitle,
    MediumTitle,
    SortByDropdown,
    SessionItem,
  },
  setup() {
    const store = useGlobalStore();
    const interactionState = computed(() => store.getInteractionState.value);
    const setInteractionState = store.setInteractionState;
    const sessions = computed(() => store.getSessions.value);
    return {
      interactionState,
      setInteractionState,
      sessions,
    }
  },
};
</script>

<style>
</style>
