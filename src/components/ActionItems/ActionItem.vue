<template>
  <div class="mx-1 my-1">
    <div>
      {{actionItem.targetType === 'session' ? 'Session ' : 'Group '}}:
      <span v-if="actionItem.targetType === 'session'" class="px-3 py-1 mx-2 cursor-pointer rounded-lg" @click="navigateSession">
        {{actionItem.targetSession.name}}
      </span>
      <span v-else-if="actionItem.targetType === 'tag'" class="bg-blue-500 px-3 py-1 mx-2 cursor-pointer rounded-lg" @click="navigateGroup">
        {{actionItem.targetTag}}
      </span>
    </div>
    <div v-if="isEditing">
      <textarea v-model="internalNote" class="w-full"></textarea>
    </div>
    <div v-else>
      <span v-if="actionItem.note.length > 0">
        {{actionItem.note}}
      </span>
      <span v-else class="text-gray-500">
        Please write how you would improve the search engine. 
      </span>
    </div>
    <div class="buttons flex justify-between">
      <button v-if="isEditing" @click="save" class="bg-blue-500 rounded-md px-1 py-1 text-white">
        Save
      </button>
      <button v-else @click="toggleEditing" class="bg-blue-500 rounded-md px-1 py-1 text-white">
        Edit
      </button>
      <button @click="removeActionItem" class="bg-red-500 rounded-md px-1 py-1 text-white">
        Remove
      </button>
    </div>
  </div>
</template>

<script>
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed, inject } from "vue";

export default {
  setup(props) {
    const store = useGlobalStore();
    const interactionState = computed(() => store.getInteractionState.value);
    const setInteractionState = store.setInteractionState

    // const sessions = computed(() => store.getSessions.value);
    // const targetSession = computed(() => {
    //   if (props.actionItem.targetType === 'session') {
    //     return sessions.value.find(session => session.id === props.actionItem.targetSession);
    //   } else {
    //     return null;
    //   }
    // });

    // const targetSessionName = computed(() => {
    //   if (targetSession.value) {
    //     return `${targetSession.value.sequence[0].Query} @ ${targetSession.value.timestamp}`;
    //   } else {
    //     return '';
    //   }
    // })

    const navigateToGroups = inject('navigateToGroups')
    const navigateToSessions = inject('navigateToSessions')

    const navigateGroup = function () {
      const update = {
        chosenTag: props.actionItem.targetTag,
        chosenSessionId: null,
      }

      setInteractionState(update);

      navigateToGroups();
    }
  
    const navigateSession = function () {
      const update = {
        chosenSessionId: props.actionItem.targetSessionId,
        chosenBehaviorCluster: props.actionItem.targetSession.behaviorClusterId,
        chosenKeywordCluster: props.actionItem.targetSession.keywordClusterId
      }

      navigateToSessions();

      setInteractionState(update);
    }

  return {
      interactionState,
      navigateGroup,
      navigateSession
      // targetSession,
      // targetSessionName
    }
  },
  props: ['actionItem', 'idx'],
  data: function () {
    return {
      isEditing: false,
      internalNote: this.actionItem.note
    }
  },
  methods: {
    toggleEditing: function () {
      this.isEditing = !this.isEditing;
    },
    save: function () {
      this.isEditing = false;
      this.$emit('updateNote', this.idx, this.internalNote);
      // Todo: implement this.actionItem.note = this.internalNote;
    },
    removeActionItem: function () {
      this.$emit('remove', this.idx);
    }
  }
}
</script>

<style scoped>
</style>