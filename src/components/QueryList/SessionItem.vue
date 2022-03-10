<template>
  <div class="w-auto flex flex-col items-center">
    <!-- The search session item -->
    <div
      :class="[
        'w-full flex flex-wrap justify-between items-center rounded-xl py-1 px-2 cursor-pointer',
        this.interactionState.chosenSessionId === session.id
          ? 'bg-gray-400 hover:bg-gray-400'
          : 'bg-gray-200 hover:bg-gray-300',
        highlights.sessionIds.includes(session.id)
          ? 'border-yellow-500 border-4'
          : 'border-black border',  
      ]"
    >
      <!-- <div class="w-8 flex items-center"
        @click="setFavoriteSession()">
        <favorite-icon v-if="!isClicked"></favorite-icon>
        <favorite-clicked-icon v-else></favorite-clicked-icon>
      </div> -->
      <div class="w-10/12 flex items-center" v-on:click="setChosenSession()">

        <div class="w-5/12 pr-1 h-full flex items-center">
          <!-- The search icon -->
          <search-icon class="min-w-min min-h-min w-8 h-8 mr-2" />
          <!-- What is searched -->
          <medium-title>
            {{ session.sequence[0].Query }}
          </medium-title>
        </div>
        <!-- Action history -->
        <div class="w-7/12 h-full flex items-center justify-start overflow-x-scroll">
          <template
            v-for="(action, i) in session.sequence.slice(1)"
            :key="action"
          >
            <!-- Give the proper icon -->
            <icon-giver
              class="min-w-min min-h-min w-8 h-8"
              v-bind="{ action_item: action.Type }"
            />
            <!-- Add a line in between two consecutive actions -->
            <line-in-the-middle
              v-if="i !== session.sequence.length - 2"
              class="w-4 h-4"
              style="min-width: 16px; min-height: 16px"
            />
          </template>
        </div>
      </div>
      <!-- The triangle, indicating whether the current session is selected -->
      <div class="mx-2  flex justify-center items-center" v-on:click="setChosenSession()">
        <triangle-black
          v-bind="{
            class: [
              'w-5 h-5',
              interactionState.chosenSessionId === session.id &&
                'transform rotate-180',
            ],
          }"
        />
      </div>
      <div class="w-6/12">
        <session-tagger :session-id="session.id"></session-tagger>
      </div>
      <div class="w-6/12 text-right text-xxs">     
        {{session.timestamp.toLocaleString('ko-KR')}}
      </div>
    </div>
    <!-- If this session is clicked, then shows the search history as well -->
    <div
      v-if="interactionState.chosenSessionId === session.id"
      class="w-full px-2 mt-2"
    >
      <div class="bg-gray-200 w-full border border-black rounded-md px-2">
        <!-- Search history for the current session -->
        <search-history
          v-bind="{
            session: session,
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SearchIcon from "@/components/Common/Icons/SearchIcon.vue";
import MediumTitle from "../Common/MediumTitle.vue";
import LineInTheMiddle from "../Common/Icons/LineInTheMiddle.vue";
import TriangleBlack from "../Common/Icons/TriangleBlack.vue";
import SearchHistory from "./SearchHistory.vue";
import IconGiver from "../Common/IconGiver.vue";
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed } from "vue";
// import FavoriteIcon from '../Common/Icons/FavoriteIcon.vue';
// import FavoriteClickedIcon from '../Common/Icons/FavoriteClickedIcon.vue';
import SessionTagger from './SessionTagger.vue'
export default {
  name: "SessionItem",
  components: {
    SearchIcon,
    MediumTitle,
    LineInTheMiddle,
    TriangleBlack,
    SearchHistory,
    IconGiver,
    // FavoriteIcon,
    // FavoriteClickedIcon,
    SessionTagger
  },
  props: ["session"],
  setup() {
    // Inject the methods to manipulate the state of the global store
    const store = useGlobalStore();
    // Current interaction state (which panel is open, which metric is chosen)
    const interactionState = computed(() => store.getInteractionState.value);
    const selectedSessionIds = computed(() => store.getSelectedSessionIds.value);

    // Updates the interaction state
    const setInteractionState = store.setInteractionState;
    const setSelectedSessionIds = store.setSelectedSessionIds;

    const highlights = computed(() => store.getHighlights.value);

    return {
      interactionState,
      setInteractionState,
      selectedSessionIds,
      setSelectedSessionIds,
      highlights
    };
  },
  data() {
    return {
      tags: ['aaa', 'bbb', 'ccc']
    };
  },
  computed: {
    // isClicked() {
    //   return this.selectedSessionIds.includes(this.session.id);
    // },
  },
  methods: {
    setFavoriteSession() {
      const update = this.isClicked
          ? this.selectedSessionIds.filter(
              (id) => id !== this.session.id
            )
          : [...this.selectedSessionIds, this.session.id];
      this.setSelectedSessionIds(update);
    },
    // In case this session is clicked, update the interaction state
    setChosenSession() {
      let update = {
        chosenSessionId: this.session.id,
      };
      // If the previously chosen session was the current session, then we flip the selection
      if (this.interactionState.chosenSessionId === this.session.id) {
        update.chosenSessionId = null;
      }
      // Update the interaction state
      this.setInteractionState(update);
    },
  },
};
</script>

<style scoped>
.text-xxs {
  font-size: 0.5em;
}
</style>
