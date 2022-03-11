<template>
  <div>
    <div>
      Target: {{actionItem.targetType === 'session' ? actionItem.targetSession : actionItem.targetTag }}
    </div>
    <div v-if="isEditing">
      <textarea v-model="internalNote"></textarea>
    </div>
    <div v-else>
      {{actionItem.note}}
    </div>
    <div class="buttons">
      <button v-if="isEditing" @click="save">
        Save
      </button>
      <button v-else @click="toggleEditing">
        Edit
      </button>
      <button @click="removeActionItem">
        Remove
      </button>
    </div>
  </div>
</template>

<script>
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed } from "vue";

export default {
  setup() {
    const store = useGlobalStore();
    const interactionState = computed(() => store.getInteractionState.value);

  return {
      interactionState
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