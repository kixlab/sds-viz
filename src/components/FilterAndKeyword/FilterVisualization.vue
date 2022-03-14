<template>
  <div
    class="w-64 h-32 px-1 pt-1 pb-4 bg-gray-200 border border-gray-500 rounded-sm"
  >
    <!-- This div contains the filter threshold visualization -->
    <div class="w-full h-full relative" id="metric-viz"></div>
      <!-- Slider here -->
      <input
        type="range"
        min="0"
        max="10"
        value="0"
        step="1"
        class="w-60 h-1 mt-1 absolute bottom-2 right-2"
        id="metric-threshold"
        v-on:change="updateThreshold()"
      />
  </div>
</template>

<script>
import * as d3 from "d3";
import $ from "jquery";
import { computed, inject } from "vue";
import { useGlobalStore } from "@/stores/globalStoreAgent.js";

export default {
  name: "FilterVisualization",
  // We utilize 'getColor' method from the parent component
  props: [
    'getColor',
  ],
  setup() {
    // Inject the functions to manipulate the interaction state
    const store = useGlobalStore();
    // The list of keyword clusters
    const keywordClusters = computed(() => store.getKeywordClusters.value);
    // Current interaction state (which panel is open, which metric is chosen, ...)
    const interactionState = computed(() => store.getInteractionState.value);
    // The chosen performance metric
    const chosenMetric = computed(
      () => store.getInteractionState.value.chosenMetric
    );
    // Updates the interaction state
    const setInteractionState = store.setInteractionState;
    // The information of what threshold for the filtering is chosen
    const chosenThreshold = computed(
      () => store.getInteractionState.value.chosenThreshold
    );

    return {
      keywordClusters,
      interactionState,
      chosenMetric,
      // Inject the 'rankingPercentageById' dictionary from the parent component, and utilize it
      // One good aspect of using inject instead of prop, is that we can utilize reactivity. However, props are probably not reactive
      rankingPercentageById: inject("rankingPercentageById"),
      setInteractionState,
      chosenThreshold,
      createLog: inject('createLog')
    };
  },
  mounted() {
    // When this component is mounted for the first time, render the visualization
    this.render();
  },
  methods: {
    // This method creates an svg element, renders the filtering visualization in it, and appends it to the 
    // div with id: 'metric-viz'
    render() {
      // ripped off from https://www.d3-graph-gallery.com/graph/histogram_basic.html
      d3.select("#metric-viz").selectAll("svg").remove();
      // Set the margins
      const margin = { top: 10, right: 10, bottom: 10, left: 10 };
      // Size of the component
      const width = $(`#metric-viz`).width() - margin.left - margin.right;
      const height = $(`#metric-viz`).height() - margin.top - margin.bottom;
      
      // Create the svg element 
      const svg = d3
        .select("#metric-viz")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // X range for the column bars
      let rangeX = [0, width];
      // If the metric is inversely proportional with its goodness, then reverse the mapping of the range.
      // Namely, since we show the worst results first, we adjust the rendering order based on the proportionality 
      // of the metric with its goodness
      if(!window.globalVars.IS_METRIC_GOODNESS_DIRECT[this.chosenMetric]) {
        rangeX.reverse();
      }
      // x location mapper
      var x = d3
        .scaleLinear()
        .domain([0, 1]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range(rangeX);
      // append the bottom of the x-axis 
      svg
        .append("g")
        .attr("transform", "translate(0," + (height - 10) + ")")
        .call(d3.axisBottom(x)).attr('stroke-width', 1.25);

      // set the parameters for the histogram
      var histogram = d3
        .histogram()
        .value((k) => {
          return k.metricValues[this.chosenMetric] / k.subtreeSize;
        }) // I need to give the vector of value
        .domain(x.domain()) // then the domain of the graphic
        .thresholds(x.ticks(10)); // then the numbers of bins

      // And apply this function to data to get the bins
      var bins = histogram(Object.values(this.keywordClusters));

      // Y axis: scale and draw:
      var y = d3.scaleLinear().range([height - 10, 0]);
      y.domain([
        0,
        d3.max(bins, function (d) {
          return d.length;
        }),
      ]); // d3.hist has to be called before the Y axis obviously
      // svg.append("g").call(d3.axisLeft(y));

      // append the bar rectangles to the svg element
      svg
        .selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function (d) {
          return "translate(" + Math.min(x(d.x0), x(d.x1)) + "," + y(d.length) + ")";
        })
        .attr("width", function (d) {
          return Math.abs(x(d.x1) - x(d.x0)) - 1;
        })
        .attr("height", function (d) {
          return height - y(d.length) - 10;
        })
        // Find the color of the bar by finding the cluster with the closest metric value
        .style("fill", (d) => {
          const keywordClusterList = Object.values(this.keywordClusters);
          const closest = keywordClusterList.reduce(
            (curClosest, keywordCluster) => {
              const metricVal =
                keywordCluster.metricValues[this.chosenMetric] /
                keywordCluster.subtreeSize;
              const curClosestMetricVal =
                curClosest.metricValues[this.chosenMetric] /
                curClosest.subtreeSize;
              const midPoint = (d.x0 + d.x1) / 2;

              if (
                Math.abs(metricVal - midPoint) <
                Math.abs(curClosestMetricVal - midPoint)
              ) {
                return keywordCluster;
              }
              return curClosest;
            },
            keywordClusterList[0]
          );
          const ranking = this.rankingPercentageById[closest.id];
          return this.getColor(ranking);
        });
      
      // Calculate the percentage of the total number of keywords that are highlighted by the
      // chosen threshold
      const getPercentage = () => {
        const threshold = this.chosenThreshold;
        const keywordClustersList = Object.values(this.keywordClusters);
        const isCorrelated = window.globalVars.IS_METRIC_GOODNESS_DIRECT[this.chosenMetric];
        const count = keywordClustersList.reduce((cnt, keywordCluster) => {
          if(isCorrelated) {
            return cnt + (keywordCluster.metricValues[this.chosenMetric] / keywordCluster.subtreeSize < threshold ? 1 : 0);
          } else {
            return cnt + (keywordCluster.metricValues[this.chosenMetric] / keywordCluster.subtreeSize > 1 - threshold ? 1 : 0);
          }
        }, 0);
        const percentage = parseInt(count / keywordClustersList.length * 100);
        return percentage;
      }

      // if the chosen threshold is larger than 0, then show the percentage of keywords that are highlighted
      if(this.chosenThreshold > 0.0) {

        const textX = d3.scaleLinear().domain([0, 1]).range([0, width]);
        const shX = d3.scaleLinear().domain([0, 1]).range([14, 11]);

        svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', textX(this.chosenThreshold))
        .attr('height', height - 10)
        .attr('fill', 'rgba(0, 0, 0, 0.15)')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)

        svg.append("text")
        .attr('id', 'threshold-text')
        .attr("x", textX(this.chosenThreshold) / 2 - shX(this.chosenThreshold))
        .attr("y", height / 2)
        .text(`${getPercentage()}%`)
        .style('font-size', '1rem')
        .style('font-weight', 'bold')
      
      }
    },
    // Update the threshold value when the slider is moved
    updateThreshold() {
      // Get the slider value
      this.createLog('updateThreshold', {
        chosenThreshold: this.chosenThreshold,
        chosenMetric: this.chosenMetric,
        keywordClusters: this.keywordClusters
      })
      console.log(this.keywordClusters)
      const threshold = $("#metric-threshold").val() / 10;
      // Update the interaction state that stores the chosen threshold as well, in the global store
      this.setInteractionState({'chosenThreshold': threshold});
    },
  },
  // Watch the states of some variables, and act according to the changes
  watch: {
    chosenMetric: {
      // If the chosenMetric is changed
      handler(newVal, oldVal) {
        // If we choose a new metric, then re-render this component (also, update the slider as well)
        if (newVal !== null && newVal !== oldVal) {
          $("#metric-threshold").val(0);
          this.render();
        }
      },
    },
    chosenThreshold: {
      // If the chosen threshold is changed
      handler(newVal, oldVal) {
        // If we choose a new threshold, then re-render this component
        if (newVal !== null && newVal !== oldVal) {
          this.render();
        }
      },
    },
  },
};
</script>