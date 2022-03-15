<template>
  <div :class="[searchResultItem.count > 0 ? 'bg-gray-300' : '', 'flex flex-row items-stretch w-full']">
    <div class="flex-none text-center mx-1">
      Rank 
      <br>
      {{searchResultItem.seq}}
    </div>
    <div class="flex-auto cursor-pointer break-all" @click="showWholeContextToggle">
      <div class="font-bold">{{searchResultItem.title}}</div>
      <div>{{truncatedContext}}</div>
      <div class="text-sm">{{searchResultItem.url}}</div>
    </div>
    <div class="flex-none text-center mx-1">
      {{searchResultItem.count}} 
      <br>
      Clicks
    </div>
  </div>
</template>

<script>
// import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed, ref, inject} from "vue";
export default {
  props: ['searchResultItem', 'query'],
  setup: function (props) {
    const showWholeContext = ref(false)
    const createLog = inject('createLog')
    const showWholeContextToggle = function () {
      if (showWholeContext.value) {
        createLog('showWholeContextFromSearchResultItem', {
          query: props.query,
          title: props.searchResultItem.title,
          url: props.searchResultItem.url,
          context: props.searchResultItem.context,
          seq: props.searchResultItem.seq,
          clicks: props.searchResultItem.count
        })
      } else {
        createLog('hideWholeContextFromSearchResultItem', {
          query: props.query,
          title: props.searchResultItem.title,
          url: props.searchResultItem.url,
          context: props.searchResultItem.context,
          seq: props.searchResultItem.seq,
          clicks: props.searchResultItem.count
        })
      }
      showWholeContext.value = !showWholeContext.value
    }

    const truncatedContext = computed(() => {
      if (showWholeContext.value) {
        return props.searchResultItem.context
      } else {
        return props.searchResultItem.context.substring(0, 30)
      }
    })

    return {
      showWholeContext,
      showWholeContextToggle,
      truncatedContext
    }
  }

}
</script>

<style scoped>

</style>