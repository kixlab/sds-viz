<template>
  <div>
    <action-item v-for="(item, idx) in actionItems" :actionItem="item" :key="item.text" :idx="idx" @update-note="updateNote" @remove="remove"></action-item>
    <button @click="createEmptyActionItem">
      Add new action item
    </button>
  </div>
</template>


<script>
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed } from "vue";
import ActionItem from './ActionItem.vue';


export default {
  components: { ActionItem },
  setup() {
    const store = useGlobalStore();
    const interactionState = store.getInteractionState.value;
    console.log(store.getActionItems)
    const actionItems = computed(() => store.getActionItems.value);

    function updateNote(idx, note) {
      const newActionItem = {
        ...actionItems.value[idx],
        note
      };
      store.updateActionItem(idx, newActionItem);
    }

    function createEmptyActionItem() {
      const newActionItem = {
        note: '',
        targetType: interactionState.chosenTag === '' ? 'session' : 'tag',
        targetSession: interactionState.chosenTag === '' ? interactionState.chosenSessionId : null,
        targetTag: interactionState.chosenTag === '' ? null : interactionState.chosenTag
      }

      store.addActionItem(newActionItem);
    }

    function remove(idx) {
      store.removeActionItem(idx);
    }



    return {
      actionItems,
      updateNote,
      createEmptyActionItem,
      remove
    }
  }
}
</script>

<style scoped>

</style>