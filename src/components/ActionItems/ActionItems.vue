<template>
  <div>
    <action-item v-for="item in actionItems" :actionItem="item" :key="item.text"></action-item>
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
    console.log(store.getActionItems)
    const actionItems = computed(() => store.getActionItems.value);

    return {
      actionItems
    }
  }
}
</script>

<style scoped>

</style>