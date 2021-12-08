<template>
  <div class="w-64 h-24 float-right">
    <div class="w-full h-full relative" id="metric-viz"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import $ from 'jquery'
import { computed } from "vue";
import { useGlobalStore } from "@/stores/globalStoreAgent.js";

export default {
  name: 'FilterVisualization',
  setup() {
    const store = useGlobalStore()
    const keywordClusters = computed(() => store.getKeywordClusters.value);
    const interactionState = computed(() => store.getInteractionState.value);
    const chosenMetric = computed(() => store.getInteractionState.value.chosenMetric);

    return {
      keywordClusters,
      interactionState,
      chosenMetric
    }
  },
  mounted: function () {
    this.render()
  },
  methods: {
    render() {
    // ripped off from https://www.d3-graph-gallery.com/graph/histogram_basic.html
   
    const margin = {top: 10, right: 10, bottom: 10, left: 10}
    const width = $(`#metric-viz`).width() - margin.left - margin.right;
    const height = $(`#metric-viz`).height() - margin.top - margin.bottom;

    d3.select("#metric-viz").selectAll("svg").remove();
    const svg = d3
      .select("#metric-viz")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .append("g")
    
    var x = d3.scaleLinear()
      .domain([0, 1])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value((k) => { 
          return (k.config.metric_values[this.chosenMetric] / k.subtreeSize) 
        })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(10)); // then the numbers of bins

    console.log(histogram)

    // And apply this function to data to get the bins
    var bins = histogram(Object.values(this.keywordClusters));

    // Y axis: scale and draw:
    var y = d3.scaleLinear()
        .range([height, 0]);
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    svg.append("g")
        .call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
          .attr("x", 1)
          .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
          .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", "#69b3a2")
    },
  },
  watch: {
    chosenMetric: {
      handler(newVal, oldVal) {
        if (newVal !== null && newVal !== oldVal) {
          this.render();
        }
      },
    },
  }
}
</script>