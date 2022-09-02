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
import _ from 'lodash'

export default {
  setup(props) {
    // console.log(context)
    const store = useGlobalStore();
    // Current interaction state (which panel is open, which metric is chosen)
    const interactionState = store.getInteractionState.value;
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

    const addTag = function (e) { // creating a new tag
      console.log(props)
      if (newTag.value === '' ) {
        return
      } else if (tags.value.includes(newTag.value)) {
        e.preventDefault();
        createLog('addExistingTagToSession', {
          sessionId: props.sessionId,
          tag: newTag.value,
          session: props.session
        })
        e.target.value = ''
        newTag.value = ''
        closeAutocomplete()
        return
      }
      // this.tags.push(this.newTag)
      e.preventDefault();
      setSelectedSessionIds(newTag.value, props.sessionId, 'add')

      if (tags.value.length === 0) {
        const newActionItem = {
          note: '',
          targetType: 'session',
          targetSessionId: props.session.id,
          targetSession: {
            name: `${props.session.sequence[0].Query} @ ${props.session.timestamp.toLocaleString('ko-KR')}`,
            keywordCluster: interactionState.chosenKeywordClusterId,
            behaviorCluster: interactionState.chosenBehaviorClusterId,
            metric: interactionState.chosenMetric
          },
          targetTag: null
        }
        store.addActionItem(newActionItem)
      }

      tags.value.push(newTag.value)
      createLog('addTagToSession', {
        sessionId: props.sessionId,
        tag: newTag.value,
        session: props.session,
        from: 'tagInput'
      })

      newTag.value = ''
      e.target.value = '';
      closeAutocomplete()
    }

    const setNewTag = function (t) { // selecting an existing tag
      setSelectedSessionIds(t, props.sessionId, 'add')
      console.log(props)
      if (tags.value.length === 0) {
        const newActionItem = {
          note: '',
          targetType: 'session',
          targetSessionId: props.session.id,
          targetSession: {
            name: `${props.session.sequence[0].Query} @ ${props.session.timestamp.toLocaleString('ko-KR')}`,
            keywordCluster: interactionState.chosenKeywordClusterId,
            behaviorCluster: interactionState.chosenBehaviorClusterId,
            metric: interactionState.chosenMetric
          },
          targetTag: null
        }
        store.addActionItem(newActionItem)
      }

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

    const _onChange = function (e) {
      console.log(e.target.value)
      if (e.target.value === '') {
        isAutocompleteEnabled.value = false
      }
      isAutocompleteEnabled.value = true
    }

    const onChange = _.debounce(_onChange, 500)

    const onEnter = function (e) {
      if (arrowCounter.value > -1) {
        setNewTag(filteredTags.value[arrowCounter.value])
      } else {
        addTag(e)
      }
    }

    const removeTag = function (idx) {
      setSelectedSessionIds(tags.value[idx], props.sessionId, 'remove')
      tags.value.splice(idx, 1)
      if (tags.value.length === 0) {
        // const targetSession = props.session
        const targetActionItemIdx = store.getActionItems.value.findIndex(actionItem => {
          return actionItem.targetSessionId === props.session.id
        })
        store.removeActionItem(targetActionItemIdx)
      }
      createLog('removeTagFromSession', {
        sessionId: props.sessionId,
        tag: tags.value[idx],
        session: props.session
      })
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
      closeAutocomplete,
      removeTag
    }
  },
  props: ["session", "sessionId"],
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
    // removeTag: function (idx) {
      
    // },
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