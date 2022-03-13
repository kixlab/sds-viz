<template>
  <div class="px-2 py-2">
    <div class="flex flex-row justify-between">
      <section-title>List of Action Items</section-title>
      <div class="bg-red-500 rounded-md text-white cursor-pointer w-6 h-6">
        <button @click="close">
          <XIcon class="w-full h-full"/>
        </button>
      </div>
    </div>
    <div class="overflow-y-auto h-4/5 divide-y border">
      <action-item v-for="(item, idx) in actionItems" :actionItem="item" :key="item.text" :idx="idx" @update-note="updateNote" @remove="remove"></action-item>
    </div>
    <div class="bg-green-500 rounded-md text-white cursor-pointer text-center">
      <button @click="createEmptyActionItem">
        <PlusCircleIcon class="w-6 h-6 inline"></PlusCircleIcon>
        Add new action item
      </button>
    </div>
  </div>
</template>


<script>
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed } from "vue";
import ActionItem from './ActionItem.vue';
import SectionTitle from '../Common/SectionTitle.vue';
import { XIcon, PlusCircleIcon } from "@heroicons/vue/solid";


export default {
  components: { 
    ActionItem, 
    SectionTitle,
    XIcon,
    PlusCircleIcon
  },
  emits: ['close'],
  setup(props, ctx) {
    const store = useGlobalStore();
    const interactionState = store.getInteractionState.value;
    console.log(store.getActionItems)
    const actionItems = computed(() => store.getActionItems.value);

    const targetSession = computed(() => store.getSession.value)

    function updateNote(idx, note) {
      const newActionItem = {
        ...actionItems.value[idx],
        note
      };
      store.updateActionItem(idx, newActionItem);
    }

    function createEmptyActionItem() {
      if (interactionState.chosenTag === '' && interactionState.chosenSessionId === null) {
        alert('Please select a session or group before creating an action item.');
        return
      }
      const newActionItem = {
        note: '',
        targetType: interactionState.chosenSessionId !== null ? 'session' : 'tag',
        targetSessionId: interactionState.chosenSessionId !== null ? interactionState.chosenSessionId : null,
        targetSession: interactionState.chosenSessionId !== null ? {
          name: `${targetSession.value.sequence[0].Query} @ ${targetSession.value.timestamp.toLocaleString('ko-KR')}`,
          keywordCluster: interactionState.chosenKeywordClusterId,
          behaviorCluster: interactionState.chosenBehaviorClusterId,
          metric: interactionState.chosenMetric
        } : null,
        targetTag: interactionState.chosenSessionId !== null ? null : interactionState.chosenTag
      }

      store.addActionItem(newActionItem);
    }

    function remove(idx) {
      store.removeActionItem(idx);
    }

    function close() {
      ctx.emit('close');
    }



    return {
      actionItems,
      updateNote,
      createEmptyActionItem,
      remove,
      close,
      targetSession
    }
  }
}
</script>

<style scoped>

</style>