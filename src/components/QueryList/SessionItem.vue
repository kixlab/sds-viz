<template>
  <div class="w-auto flex flex-col items-center">
    <!-- The search session item -->
    <div
      :class="[
        'w-full flex justify-between items-center rounded-xl border border-black py-2 px-2 cursor-pointer',
        this.interactionState.chosenSessionId === session.id
          ? 'bg-gray-400 hover:bg-gray-400'
          : 'bg-gray-200 hover:bg-gray-300',
      ]"
    >
      <div class="w-8 flex items-center"
        @click="setFavoriteSession()">
        <favorite-icon v-if="!isClicked"></favorite-icon>
        <favorite-clicked-icon v-else></favorite-clicked-icon>
      </div>
      <div class="w-10/12 h-full flex items-center" v-on:click="setChosenSession()">

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
      <div class="mx-2 h-full flex justify-center items-center">
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
import FavoriteIcon from '../Common/Icons/FavoriteIcon.vue';
import FavoriteClickedIcon from '../Common/Icons/FavoriteClickedIcon.vue';

export default {
  name: "SessionItem",
  components: {
    SearchIcon,
    MediumTitle,
    LineInTheMiddle,
    TriangleBlack,
    SearchHistory,
    IconGiver,
    FavoriteIcon,
    FavoriteClickedIcon,
  },
  props: ["session"],
  setup() {
    // Inject the methods to manipulate the state of the global store
    const store = useGlobalStore();
    // Current interaction state (which panel is open, which metric is chosen)
    const interactionState = computed(() => store.getInteractionState.value);
    // Updates the interaction state
    const setInteractionState = store.setInteractionState;

    return {
      interactionState,
      setInteractionState,
    };
  },
  data() {
    return {};
  },
  computed: {
    isClicked() {
      return this.interactionState.savedSessions.includes(this.session.id);
    },
  },
  methods: {
    setFavoriteSession() {
      const update = {
        savedSessions: this.isClicked
          ? this.interactionState.savedSessions.filter(
              (id) => id !== this.session.id
            )
          : [...this.interactionState.savedSessions, this.session.id],
      };
      this.setInteractionState(update);
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

<style>
</style>
