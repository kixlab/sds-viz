<template>
  <div class="flex flex-col">
    <!-- Title: 'Individual Search Sessions' -->
    <section-title> Selected Search Sessions </section-title>
    <div>Tags</div>
    <div class="flex flex-wrap">
      <div v-for="tag in tags" :key="tag" :class="[selectedTag === tag ? 'bg-blue-500 text-white' : 'text-blue', 'px-3 py-1 mx-2 cursor-pointer rounded-lg shadow-md']" @click="selectTag(tag)">
        {{tag}}
      </div>
    </div>
    <div>Sessions</div>
    <div class="flex flex-col my-4 mx-2 overflow-y-hidden">
      <!-- The dropdown -->
      <!-- <div class="flex justify-end items-center">
        <div v-if="sessions !== null" class="flex items-center m-1">
          <div class="mx-2 relative">
            <medium-title class="relative">
              Sort By (worst to best):
            </medium-title>
          </div>
          <sort-by-dropdown />
        </div>
      </div> -->
      <!-- The query list -->
      <div class="flex flex-col overflow-y-auto mt-4">
        <session-item
          v-for="session in selectedSessions"
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
// import MediumTitle from "../Common/MediumTitle.vue";
// import SortByDropdown from "@/components/QueryList/SortByDropdown.vue";
import SessionItem from "@/components/QueryList/SessionItem.vue";
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed, provide, ref, inject } from "vue";
// import MediumTitle from '../Common/SmallTitle.vue';

export default {
  name: "SelectedSessions",
  components: {
    SectionTitle,
    // MediumTitle,
    // SortByDropdown,
    SessionItem,
    // MediumTitle,
  },
  setup() {
    // The currently active sortByOption
    const sortByOption = ref(window.globalVars.METRICS[0]);
    // Inject the methods to manipulate the state of the global store
    const store = useGlobalStore();
    // Current interaction state (which panel is open, which metric is chosen)
    const interactionState = computed(() => store.getInteractionState.value);
    // Updates the interaction state
    const setInteractionState = store.setInteractionState;
    // List of sessions, sorted by the current sortByOption from worst to best
    // const selectedSessions = computed(() => store.getSelectedSessions.value)

    // Whole object for the selected sessions
    const selectedSessionIds = computed(() => store.getSelectedSessionIds.value);
    const selectedSessions = computed(() => store.getSelectedSessions.value)
    const selectedTag = computed(() => store.getInteractionState.value['chosenTag'])

    // Tags
    const tags = computed(() => Object.entries(store.getSelectedSessionIds.value).filter(([, value]) => value.length > 0).map(([key, ]) => key));

    // computed(() => {
    //   const sessions = store.getSessions.value;
    //   console.log(sessions);
    //   const selectedSessionIds = interactionState.value.savedSessions;
    //   console.log(selectedSessionIds)

    //   const selectedSessions = sessions
    //   // .filter(session => {
    //   //   return selectedSessionIds.includes(session.id)
    //   // });

    //   // if (sessions !== null) {
    //   //   return Object.values(sessions).sort((a, b) => {
    //   //     const aMetricVal = a.metricValues[sortByOption.value];
    //   //     const bMetricVal = b.metricValues[sortByOption.value];
    //   //     // sort bad to good
    //   //     return window.globalVars.IS_METRIC_GOODNESS_DIRECT[sortByOption.value]
    //   //       ? aMetricVal - bMetricVal
    //   //       : bMetricVal - aMetricVal;
    //   //   });
    //   // }
    //   return selectedSessions;
    // });
    // When the sortByOption changes
    const onSortByOptionChange = (option) => {
      sortByOption.value = option;
    };

    // Provide 'parentCallFunction', 'mainOption' and 'allOptions' to the dropdown component
    // It actually provides those to all the children components, but they are used only in the dropdown 
    provide("parentCallFunction", onSortByOptionChange);
    provide("mainOption", sortByOption);
    provide("allOptions", window.globalVars.METRICS);

    const createLog = inject('createLog')

    return {
      interactionState,
      setInteractionState,
      selectedSessionIds,
      tags,
      selectedSessions,
      selectedTag,
      createLog
    };
  },
  methods: {
    selectTag: function (tag) {
      if (this.selectedTag === tag) {
        this.createLog('deselectTag', { tag: tag })
        this.setInteractionState({
          chosenTag: ''
        })
      } else {
        this.createLog('selectTag', {tag: tag})
        this.setInteractionState({
          chosenTag: tag
        })
      }
    }
  },
};
</script>

<style>
</style>
