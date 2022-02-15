<template>
  <div>
    <div class="inline-block w-6 h-6 text-align-left">
      <icon-giver v-bind="{action_item: value}"></icon-giver>
    </div>
    {{value}}
  </div>
</template>

<script>
import IconGiver from '../Common/IconGiver.vue'
export default {
  components: { IconGiver },
  name: 'BehaviorOption',
  props: {
    value: {
      type: String,
      required: true,
    },
  }
  
}
</script>
