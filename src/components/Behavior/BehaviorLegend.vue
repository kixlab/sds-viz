<template>
  <div class="flex flex-col justify-self-center w-25 h-full border border-black mx-auto justify-between">
    <template 
      v-for="i in iconOrder" 
      :key="i">
      <div class="justify-center mx-auto text-center">
        <div class="w-8 h-8 mx-auto" :class="color[i]">
          <icon-giver 
            v-bind="{action_item: i}">
          </icon-giver>
        </div>
        <span class="text-sm">{{i}}</span>
      </div>
    </template>
  </div>
</template>

<script>
import IconGiver from '../Common/IconGiver.vue';

export default {
  name: 'BehaviorLegend',
  components: {
    IconGiver
  },
  data: function () {
    return {
      iconOrder: ['NewQuery', 'RefinedQuery', 'Click1-5', 'Click6-10', 'Click11+', 'NextPage'],
      color: {
        'NewQuery': 'bg-red-600',
        'RefinedQuery': 'bg-red-400',
        'Click1-5': 'bg-green-600',
        'Click6-10': 'bg-green-400',
        'Click11+': 'bg-green-200',
        'NextPage': 'bg-blue-400'
      }
    }
  }
  
}
</script>
<style scoped>

</style>

