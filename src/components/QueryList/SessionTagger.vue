<template>
  <div class="tag-input">
    <div v-for="(tag, index) in tags" :key="tag" class="tag-input__tag inline">
      <span @click="removeTag(index)">x</span>
      {{tag}}
    </div>
    <input 
      type="text"
      class="tag-input__input"
      @keydown.enter="addTag"
      @keydown.,="addTag"
      @keydown.delete="removeLastTag"
      placeholder="Enter a tag" />
  </div>
  
</template>

<script>
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed } from "vue";

export default {
  setup(props) {
    const store = useGlobalStore();
    // Current interaction state (which panel is open, which metric is chosen)
    // const interactionState = computed(() => store.getInteractionState.value);
    const selectedSessionIds = computed(() => store.getSelectedSessionIds.value); 
    const tags = computed(() => Object.entries(selectedSessionIds.value).filter(([, value]) => {
      return value.includes(props.sessionId);
    }).map(([key, ]) => {
      return key;
    }));
    const setSelectedSessionIds = store.setSelectedSessionIds;
    return {
      selectedSessionIds,
      tags,
      setSelectedSessionIds
    }
  },
  props: ["sessionId"],
  data: function () {
    return {
      // tags: ['hello', 'world'],
      newTag: ''
    }
  },
  methods: {
    addTag: function (e) {
      // this.tags.push(this.newTag)
      e.preventDefault();
      this.setSelectedSessionIds(e.target.value.trim(), this.sessionId, 'add')
      e.target.value = '';
    },
    removeTag: function (idx) {
      this.setSelectedSessionIds(this.tags[idx], this.sessionId, 'remove')
    },
    removeLastTag: function (e) {
      if (e.target.value.length === 0) {
        this.removeTag(this.tags.length - 1)
      }
    }
  }
}
</script>