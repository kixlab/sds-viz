<template>
  <div class="tag-input mt-1 w-full border border-black bg-white flex flex-wrap rounded-lg">
    <div v-for="(tag, index) in tags" :key="tag" class="bg-blue-500 text-sm text-white px-1 py-1 mx-1 my-1 rounded-lg">
      <span class="cursor-pointer text-sm opacity-75" @click="removeTag(index)">x</span>
      {{tag}}
    </div>
    <input
      type="text"
      class="tag-input__input bg-none border-none outline-none"
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