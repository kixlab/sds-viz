<template>
  <div class="mx-1 my-1">
    <div>
      <span class="font-bold">Item Number {{idx + 1}}</span>
    </div>
    <div>
      {{actionItem.targetType === 'session' ? 'Session ' : 'Group '}}:
      <span v-if="actionItem.targetType === 'session'" class="px-3 py-1 mx-2 cursor-pointer rounded-lg" @click="navigateSession">
        {{actionItem.targetSession.name}}
      </span>
      <span v-else-if="actionItem.targetType === 'tag'" class="bg-blue-500 px-3 py-1 mx-2 text-white cursor-pointer rounded-lg" @click="navigateGroup">
        {{actionItem.targetTag}}
      </span>
    </div>
    <div v-if="isEditing">
      <textarea v-model="internalNote" placeholder="이 세션에서 사용자의 검색 의도는 무엇이었나요? " class="w-full"></textarea>
    </div>
    <div v-else>
      <span v-if="actionItem.note.length > 0">
        {{actionItem.note}}
      </span>
      <span v-else class="text-gray-500">
        이 세션에서 사용자의 검색 의도는 무엇이었나요?
       </span>
    </div>
    <div class="buttons flex justify-between">
      <button v-if="isEditing" @click="save" class="bg-blue-500 rounded-md px-1 py-1 text-white">
        Save
      </button>
      <button v-else @click="toggleEditing" class="bg-blue-500 rounded-md px-1 py-1 text-white">
        Edit
      </button>
      <button @click="removeActionItem" class="bg-orange-500 rounded-md px-1 py-1 text-white">
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
    // const navigateToSessions = inject('navigateToSessions')
    const createLog = inject('createLog')

    const navigateGroup = function () {
      const update = {
        chosenTag: props.actionItem.targetTag,
        chosenSessionId: null,
      }

      createLog('navigateToGroupFromActionItem', {
        actionItem: props.actionItem
      })

      setInteractionState(update);

      navigateToGroups();
    }
  
    const navigateSession = function () {
      const selectedTag = interactionState.value['chosenTag']
      const targetSessionId = props.actionItem.targetSessionId
      const selectedSessionIds = store.getSelectedSessionIds.value
      let tag = null

      console.log(selectedTag, selectedSessionIds[selectedTag])

      if (selectedTag && selectedSessionIds[selectedTag].includes(targetSessionId)) {
        tag = selectedTag
      } else {
        tag = Object.keys(selectedSessionIds).find(tag => selectedSessionIds[tag].includes(targetSessionId))
      } 
      const update = {
        chosenSessionId: props.actionItem.targetSessionId,
        chosenTag: tag,
        // chosenBehaviorCluster: props.actionItem.targetSession.behaviorClusterId,
        // chosenKeywordCluster: props.actionItem.targetSession.keywordClusterId
      }

      createLog('navigateToSessionFromActionItem', {
        actionItem: props.actionItem,
        ...update,
        // TODO: include session?
      })

      // navigateToSessions();

      setInteractionState(update);
    }

  return {
      interactionState,
      navigateGroup,
      navigateSession,
      createLog
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
      this.createLog('startEditActionItem', {
        actionItem: this.actionItem,
      })
      this.isEditing = !this.isEditing;
    },
    save: function () {
      this.isEditing = false;
      this.$emit('updateNote', this.idx, this.internalNote);
      this.createLog('saveActionItem', {
        actionItem: this.actionItem,
        newNote: this.internalNote
      })
    },
    removeActionItem: function () {
      this.createLog('removeActionItem', {
        actionItem: this.actionItem,
      })
      this.$emit('remove', this.idx);
    }
  }
}
</script>

<style scoped>
</style>
