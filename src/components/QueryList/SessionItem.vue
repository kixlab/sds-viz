<template>
  <div class="w-auto flex flex-col items-center">
    <div class="w-full flex justify-between items-center bg-gray-200 rounded-xl border border-black py-2 px-2 cursor-pointer hover:bg-gray-300" v-on:click="active = !active">
      <div class="w-11/12 flex items-center overflow-x-scroll">
          <div class="w-5/12 flex items-center">
            <search-icon class="w-9 h-9 mr-2"/>
            <medium-title>
            mailing list of *** department
            </medium-title>
          </div>
          <div class="w-7/12 flex items-center overflow-x-scroll">
            <click-11-plus-icon class="w-9 h-9"/>
            <line-in-the-middle class="w-4 h-9"/>
            <click-15-icon class="w-9 h-9"/>
            <line-in-the-middle class="w-4 h-9"/>
            <click-610-icon class="w-9 h-9"/>
            <line-in-the-middle class="w-4 h-9"/>
            <click-11-plus-icon class="w-9 h-9"/>
            <line-in-the-middle class="w-4 h-9"/>
            <click-15-icon class="w-9 h-9"/>
            <line-in-the-middle class="w-4 h-9"/>
            <click-11-plus-icon class="w-9 h-9"/>
            <line-in-the-middle class="w-4 h-9"/>
            <click-15-icon class="w-9 h-9"/>
            <line-in-the-middle class="w-4 h-9"/>
          </div>
      </div>
      <div class="mx-2">
        <triangle-black v-bind="{class: ['w-5 h-5', active && 'transform rotate-180']}"/>
      </div>
    </div>
    <div v-if="active" class="w-full px-2 mt-2">
      <div class="bg-gray-200 w-full border border-black rounded-md px-2">
        <search-history/>
      </div>
    </div>
  </div>
</template>

<script>
import SearchIcon from '@/components/Common/Icons/SearchIcon.vue';
import Click11PlusIcon from '@/components/Common/Icons/Click11PlusIcon.vue';
import MediumTitle from '../Common/MediumTitle.vue';
import Click15Icon from '../Common/Icons/Click15Icon.vue';
import Click610Icon from '../Common/Icons/Click610Icon.vue';
import LineInTheMiddle from '../Common/Icons/LineInTheMiddle.vue';
import TriangleBlack from '../Common/Icons/TriangleBlack.vue';
import SearchHistory from './SearchHistory.vue';

export default {
  name: "QuerySelection",
  components: {
    SearchIcon,
    MediumTitle,
    Click11PlusIcon,
    Click15Icon,
    Click610Icon,
    LineInTheMiddle,
    TriangleBlack,
    SearchHistory,
  },
  data() {
    return {
      'active': false,
    }
  }
};
</script>

<style>
</style>
