<template>
  <div
    class="w-64 h-32 px-1 pt-1 pb-4 bg-gray-200 border border-gray-500 rounded-sm"
  >
    <div class="w-full h-full relative" id="metric-viz"></div>
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
  props: [
    'getColor',
  ],
  setup(context, props) {
    console.log(context, props)
    const store = useGlobalStore();
    const keywordClusters = computed(() => store.getKeywordClusters.value);
    const interactionState = computed(() => store.getInteractionState.value);
    const chosenMetric = computed(
      () => store.getInteractionState.value.chosenMetric
    );
    const setInteractionState = store.setInteractionState;
    const chosenThreshold = computed(
      () => store.getInteractionState.value.chosenThreshold
    );

    return {
      keywordClusters,
      interactionState,
      chosenMetric,
      rankingPercentageById: inject("rankingPercentageById"),
      setInteractionState,
      chosenThreshold
    };
  },
  mounted() {
    this.render();
  },
  methods: {
    render() {
      // ripped off from https://www.d3-graph-gallery.com/graph/histogram_basic.html

      d3.select("#metric-viz").selectAll("svg").remove();
      const margin = { top: 10, right: 10, bottom: 10, left: 10 };
      const width = $(`#metric-viz`).width() - margin.left - margin.right;
      const height = $(`#metric-viz`).height() - margin.top - margin.bottom;

      const svg = d3
        .select("#metric-viz")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      let rangeX = [0, width];
      if(!window.globalVars.IS_METRIC_GOODNESS_DIRECT[this.chosenMetric]) {
        rangeX.reverse();
      }
      var x = d3
        .scaleLinear()
        .domain([0, 1]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range(rangeX);
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
    updateThreshold() {
      const threshold = $("#metric-threshold").val() / 10;
      this.setInteractionState({'chosenThreshold': threshold});
    },
  },
  watch: {
    chosenMetric: {
      handler(newVal, oldVal) {
        if (newVal !== null && newVal !== oldVal) {
          $("#metric-threshold").val(0);
          this.render();
        }
      },
    },
    chosenThreshold: {
      handler(newVal, oldVal) {
        if (newVal !== null && newVal !== oldVal) {
          this.render();
        }
      },
    },
  },
};
</script>