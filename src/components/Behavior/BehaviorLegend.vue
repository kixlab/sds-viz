<template>
  <div class="grid grid-cols-2 grid-rows-3 h-full px-1 border w-40 border-black">
    <template 
      v-for="i in iconOrder" 
      :key="i">
      <div class="flex flex-col items-center my-2 mx-1">
        <div class="w-8 h-8">
          <icon-giver 
            v-bind="{action_item: i}">
          </icon-giver>
        </div>
        <small-title class="mt-1"> {{explanation[i]}}</small-title>
      </div>
    </template>
  </div>
</template>

<script>
import IconGiver from '../Common/IconGiver.vue';
import SmallTitle from '../Common/SmallTitle.vue';
export default {
  name: 'BehaviorLegend',
  components: {
    IconGiver,
    SmallTitle,
  },
  data: function () {
    return {
      iconOrder: ['Click1-5', 'Click6-10', 'NextPage', 'Click11+', 'NewQuery', 'RefinedQuery'],
      explanation: {
        'Click1-5': `Click rank 1-5`,
        'Click6-10': 'Click rank 6-10',
        'Click11+': 'Click rank ≥ 11',
        'NextPage': 'Next page',
        'NewQuery': 'New query',
        'RefinedQuery': 'Query refined'
      }
    }
  }
  
}
</script>
<style scoped>

</style>

