<template>
  <div class="flex flex-col">
    <section-title> Query Selection </section-title>
    <div class="flex flex-col my-4 mx-2 overflow-y-hidden">
      <div class="flex justify-end items-center">
        <!-- <medium-title> Total Count: 203 </medium-title> -->
        <div class="flex items-center m-1">
          <medium-title class="mx-2"> Sort By: </medium-title>
          <sort-by-dropdown />
        </div>
      </div>
      <div class="flex flex-col overflow-y-scroll mt-4">
        <session-item
          v-for="session in sessions"
          :key="session.id"
          class="my-2"
          v-bind="{
            session: session,
          }"
        />
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
import { computed, provide, ref } from "vue";
export default {
  name: "QuerySelection",
  components: {
    SectionTitle,
    MediumTitle,
    SortByDropdown,
    SessionItem,
  },
  setup() {
    const sortByOption = ref(window.globalVars.METRICS[0]);
    const store = useGlobalStore();
    const interactionState = computed(() => store.getInteractionState.value);
    const setInteractionState = store.setInteractionState;
    const sessions = computed(() => {
      const sessions = store.getSessions.value;
      if (sessions !== null) {
        return Object.values(sessions).sort((a, b) => {
          const aMetricVal = a.metricValues[sortByOption.value];
          const bMetricVal = b.metricValues[sortByOption.value];
          return window.globalVars.IS_METRIC_GOODNESS_DIRECT[sortByOption.value]
            ? bMetricVal - aMetricVal
            : aMetricVal - bMetricVal;
        })
      }
      return null;
    });
    const onSortByOptionChange = (option) => {
      sortByOption.value = option;
    };

    provide("parentCallFunction", onSortByOptionChange);
    provide("mainOption", sortByOption);
    provide("allOptions", window.globalVars.METRICS);

    return {
      interactionState,
      setInteractionState,
      sessions,
    };
  },
  methods: {},
};
</script>

<style>
</style>
