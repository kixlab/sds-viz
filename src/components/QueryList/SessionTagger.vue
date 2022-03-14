<template>
  <div class="tag-input mt-1 w-full border border-black bg-white relative flex flex-wrap rounded-lg">
    <div v-for="(tag, index) in tags" :key="tag" class="bg-blue-500 text-sm text-white px-1 py-1 mx-1 my-1 rounded-lg">
      <span class="cursor-pointer text-sm opacity-75" @click="removeTag(index)">x</span>
      {{tag}}
    </div>
    <input
      type="text"
      class="tag-input__input bg-none border-none outline-none"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
      @keydown.,="addTag"
      @keydown.delete="removeLastTag"
      @keydown.esc="closeAutocomplete"
      v-model="newTag"
      @input="onChange"
      placeholder="Enter a tag" />
    <div v-show="isAutocompleteEnabled"
      class="absolute bg-white shadow-md flex flex-col w-full flex-wrap rounded-md divide-y z-10 top-6">
      <div v-for="(t, idx) in filteredTags" :key="t" 
        :class="[arrowCounter === idx ? 'bg-blue-500 text-white' : 'bg-white text-blue-500', 'text-sm  px-1 py-1 mx-1 my-1 rounded-lg cursor-pointer border border-blue-500']"
        @click="setNewTag(t)">
        {{t}}
      </div>
    </div>
  </div>
  
</template>

<script>
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed, ref, inject } from "vue";

export default {
  setup(props) {
    // console.log(context)
    const store = useGlobalStore();
    // Current interaction state (which panel is open, which metric is chosen)
    // const interactionState = computed(() => store.getInteractionState.value);
    const arrowCounter = ref(-1)
    const newTag = ref('')
    const selectedSessionIds = computed(() => store.getSelectedSessionIds.value); 
    const tags = ref(Object.entries(selectedSessionIds.value).filter(([, value]) => {
      return value.includes(props.sessionId);
    }).map(([key, ]) => {
      return key;
    }));
    const allTags = computed(() => {
      return Object.keys(selectedSessionIds.value)
    })
    const setSelectedSessionIds = store.setSelectedSessionIds;

    const createLog = inject('createLog')

    const isAutocompleteEnabled = ref(false)

    const filteredTags = computed(() => {
      return allTags.value.filter(tag => {
        return tag.toLowerCase().includes(newTag.value.toLowerCase())
      })
    })

    const onArrowDown = function () {
      if (arrowCounter.value < filteredTags.value.length) {
        arrowCounter.value += 1;
      }
    }

    const onArrowUp = function () {
      if (arrowCounter.value > 0) {
        arrowCounter.value -= 1;
      }
    }

    const closeAutocomplete = function () {
      isAutocompleteEnabled.value = false;
      arrowCounter.value = -1
    }

    const addTag = function (e) {
      if (newTag.value === '' ) {
        return
      } else if (tags.value.includes(newTag.value)) {
        e.preventDefault();
        createLog('addExistingTagToSession', {
          sessionId: props.sessionId,
          tag: newTag.value,
          sesssion: props.session
        })
        e.target.value = ''
        newTag.value = ''
        closeAutocomplete()
        return
      }
      // this.tags.push(this.newTag)
      e.preventDefault();
      setSelectedSessionIds(newTag.value, props.sessionId, 'add')
      tags.value.push(newTag.value)
      createLog('addTagToSession', {
        sessionId: props.sessionId,
        tag: newTag.value,
        sesssion: props.session,
        from: 'tagInput'
      })
      newTag.value = ''
      e.target.value = '';
      closeAutocomplete()
    }

    const setNewTag = function (t) {
      setSelectedSessionIds(t, props.sessionId, 'add')
      tags.value.push(t)
      createLog('addTagToSession', {
        sessionId: props.sessionId,
        tag: newTag.value,
        sesssion: props.session,
        from: 'autocomplete'
      })
      newTag.value = ''
      closeAutocomplete()
    }

    const onChange = function (e) {
      console.log(e.target.value)
      if (e.target.value === '') {
        isAutocompleteEnabled.value = false
      }
      isAutocompleteEnabled.value = true
    }

    const onEnter = function (e) {
      if (arrowCounter.value > -1) {
        setNewTag(filteredTags.value[arrowCounter.value])
      } else {
        addTag(e)
      }
    }

    return {
      selectedSessionIds,
      tags,
      setSelectedSessionIds,
      allTags,
      newTag,
      isAutocompleteEnabled,
      filteredTags,
      onChange,
      onArrowDown,
      onArrowUp,
      onEnter,
      arrowCounter,
      addTag,
      setNewTag,
      closeAutocomplete
    }
  },
  props: ["sessionId"],
  // data: function () {
  //   return {
  //     // tags: ['hello', 'world'],
  //     newTag: ''
  //   }
  // },
  methods: {
    // addTag: function (e) {
    //   if (this.newTag === '' ) {
    //     return
    //   } else if (this.tags.includes(this.newTag)) {
    //     e.preventDefault();
    //     e.target.value = ''
    //     this.newTag = ''
    //     return
    //   }
    //   // this.tags.push(this.newTag)
    //   e.preventDefault();
    //   this.setSelectedSessionIds(this.newTag, this.sessionId, 'add')
    //   this.tags.push(this.newTag)
    //   this.newTag = ''
    //   e.target.value = '';
    //   this.isAutocompleteEnabled = false
    // },
    removeTag: function (idx) {
      this.setSelectedSessionIds(this.tags[idx], this.sessionId, 'remove')
      this.tags.splice(idx, 1)
      this.createLog('removeTagFromSession', {
        sessionId: this.sessionId,
        tag: this.tags[idx],
        sesssion: this.session
      })
    },
    removeLastTag: function (e) {
      if (e.target.value.length === 0) {
        this.removeTag(this.tags.length - 1)
        this.isAutocompleteEnabled = false

      }
    },
    // setNewTag: function (t) {
    //   this.setSelectedSessionIds(t, this.sessionId, 'add')
    //   this.tags.push(t)
    //   this.newTag = ''
    //   this.isAutocompleteEnabled = false
    // }
  }
}
</script>