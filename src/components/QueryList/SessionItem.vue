<template>
  <div class="w-auto flex flex-col items-center">
    <div
      :class="[
        'w-full flex justify-between items-center rounded-xl border border-black py-2 px-2 cursor-pointer',
        this.interactionState.chosenSessionId === session.id
          ? 'bg-gray-400 hover:bg-gray-400'
          : 'bg-gray-200 hover:bg-gray-300',
      ]"
      v-on:click="setChosenSession()"
    >
      <div class="w-11/12 h-full flex items-center">
        <div class="w-5/12 pr-1 h-full flex items-center">
          <search-icon class="min-w-min min-h-min w-8 h-8 mr-2" />
          <medium-title>
            {{ session.sequence[0].Query }}
          </medium-title>
        </div>
        <div class="w-7/12 h-full flex items-center overflow-scroll">
          <template
            v-for="(action, i) in session.sequence.slice(1)"
            :key="action"
          >
            <icon-giver class="min-w-min min-h-min w-8 h-8" v-bind="{ action_item: action.Type }" />
            <line-in-the-middle
              v-if="i !== session.sequence.length - 2"
              class="w-4 h-4"
              style="min-width: 16px; min-height: 16px;"
            />
          </template>
        </div>
      </div>
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
    <div
      v-if="interactionState.chosenSessionId === session.id"
      class="w-full px-2 mt-2"
    >
      <div class="bg-gray-200 w-full border border-black rounded-md px-2">
        <search-history v-bind="{
          session: session,
        }"/>
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

export default {
  name: "QuerySelection",
  components: {
    SearchIcon,
    MediumTitle,
    LineInTheMiddle,
    TriangleBlack,
    SearchHistory,
    IconGiver,
  },
  props: ["session"],
  setup() {
    const store = useGlobalStore();
    const interactionState = computed(() => store.getInteractionState.value);
    const setInteractionState = store.setInteractionState;

    return {
      interactionState,
      setInteractionState,
    };
  },
  data() {
    return {};
  },
  methods: {
    setChosenSession() {
      let update = {
        chosenSessionId: this.session.id,
      };
      if (this.interactionState.chosenSessionId === this.session.id) {
        update.chosenSessionId = null;
      }
      this.setInteractionState(update);
    },
  },
};
</script>

<style>
</style>
