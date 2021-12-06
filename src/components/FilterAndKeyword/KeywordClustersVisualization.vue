<template>
  <div class="w-full h-full relative" id="keyword-viz">
    <div
      id="keyword-tooltip"
      class="absolute z-20 bg-white rounded-md border-gray-500 border px-2 py-2"
      style="visibility: hidden"
    >
      <p class="font-bold w-full flex justify-center mb-2 relative">
        {{ tooltipTitle }}
      </p>
      <div v-for="metric in metrics" :key="metric" class="flex items-center">
        <div
          class="h-3 w-3 mr-1"
          :style="`background-color: ${metricColor[metric]}`"
        ></div>
        <p class="font-bold text-sm mr-1">{{ metric }}:</p>
        <p class="text-sm">{{ metricVal[metric] }}</p>
      </div>
      <p class="font-bold text-sm flex justify-end mt-2">
        Total Count: {{ totalCountTooltip }}
      </p>
    </div>
  </div>
</template>

<script>
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed } from "vue";
import * as d3 from "d3";
import $ from "jquery";
export default {
  name: "KeywordClustersVisualization",
  components: {},
  setup() {
    const store = useGlobalStore();
    const interactionState = computed(() => store.getInteractionState.value);
    const keywordClusters = computed(() => store.getKeywordClusters.value);
    const setInteractionState = store.setInteractionState;
    const sortedKeywordClusters = computed(() => {
      const chosenMetric = interactionState.value.chosenMetric;
      return Object.values(keywordClusters.value).sort((a, b) => {
        const aAvgMetricVal = a.metricValues[chosenMetric] / a.subtreeSize;
        const bAvgMetricVal = b.metricValues[chosenMetric] / b.subtreeSize;
        return window.globalVars.IS_METRIC_GOODNESS_DIRECT[chosenMetric]
          ? aAvgMetricVal - bAvgMetricVal
          : bAvgMetricVal - aAvgMetricVal;
      });
    });
    const rankingPercentageById = computed(() => {
      const ranking = {};
      sortedKeywordClusters.value.forEach((keywordCluster, index) => {
        ranking[keywordCluster.id] =
          (2 * index) / sortedKeywordClusters.value.length;
      });
      return ranking;
    });
    const chosenMetric = computed(() => interactionState.value.chosenMetric);
    const metrics = window.globalVars.METRICS;
    return {
      interactionState,
      setInteractionState,
      keywordClusters,
      rankingPercentageById,
      chosenMetric,
      metrics,
    };
  },
  data() {
    return {
      keywordRenderData: this.randomShuffle(
        Object.values(this.keywordClusters)
      ),
      metricVal: window.globalVars.METRICS.reduce((acc, metric) => {
        acc[metric] = 0;
        return acc;
      }, {}),
      metricColor: window.globalVars.METRICS.reduce((acc, metric) => {
        acc[metric] = "none";
        return acc;
      }, {}),
      tooltipTitle: "",
      totalCountTooltip: 0,
    };
  },
  methods: {
    flipColorOfKeywordCluster(id) {
      if (id === null) return;
      const curColor = $(`#text-${id}`).css("fill");
      const newColor =
        curColor === "rgb(0, 0, 0)" ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)";
      $(`#text-${id}`).css("fill", newColor);
    },
    setChosenKeywordCluster(keywordClusterId) {
      const previouslyChosenKeywordClusterId =
        this.interactionState.chosenKeywordClusterId;
      this.flipColorOfKeywordCluster(previouslyChosenKeywordClusterId);

      let update = {
        chosenKeywordClusterId: keywordClusterId,
      };
      if (this.interactionState.chosenKeywordClusterId === keywordClusterId) {
        update.chosenKeywordClusterId = null;
      }
      this.setInteractionState(update);

      const currentlyChosenKeywordClusterId =
        this.interactionState.chosenKeywordClusterId;
      this.flipColorOfKeywordCluster(currentlyChosenKeywordClusterId);
    },
    getColor(rankingP) {
      const greenZone = ["#D6E8D8", "#2BD72B"],
        redZone = ["#F05656", "#ECDBDC"];
      if (rankingP < 1) {
        return d3.interpolate(redZone[0], redZone[1])(rankingP);
      } else {
        return d3.interpolate(greenZone[0], greenZone[1])(rankingP - 1);
      }
    },
    randomShuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    render() {
      d3.select("#keyword-viz").selectAll("svg").remove();
      var margin = { top: 20, right: 20, bottom: 20, left: 20 };
      const width = $("#keyword-viz").width() - margin.left - margin.right;
      const height = $("#keyword-viz").height() - margin.top - margin.bottom;
      const lr_x = [0, 10],
        lr_y = [0, 10];
      var SVG = d3
        .select("#keyword-viz")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      SVG.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#E4E7EB");
      var zoom = d3
        .zoom()
        .scaleExtent([0.5, 20]) // This control how much you can unzoom (x0.5) and zoom (x20)
        .extent([
          [0, 0],
          [width, height],
        ])
        .on("zoom", updateChart);
      SVG.call(zoom);
      const G_N = 9,
        G_M = 6;
      const data = this.keywordRenderData;
      var positions = data.map(() => [0, 0]);
      var x = d3.scaleLinear().domain(lr_x).range([0, width]);
      var y = d3.scaleLinear().domain(lr_y).range([height, 0]);
      /* eslint-disable */
      var clip = SVG.append("defs")
        .append("SVG:clipPath")
        .attr("id", "clip")
        .append("SVG:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);
      /* eslint-enable */
      var scatter = SVG.append("g").attr("clip-path", "url(#clip)");
      const paddingXRect = 4,
        paddingYRect = 2;
      scatter
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("fill", (d) => this.getColor(this.rankingPercentageById[d.id]))
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("class", "keyword-cluster-rect")
        .style("cursor", "pointer");
      var tooltip = d3.select("#keyword-tooltip");
      const centerOfGravity = [
        (lr_x[1] - lr_x[0]) / 2,
        (lr_y[1] - lr_y[0]) / 2,
      ];
      scatter
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .style("font-size", (d) => {
          return Math.sqrt(d.subtreeSize) * 2; // TODO, Subject to Change
        })
        .attr("x", function (_, i) {
          positions[i][0] = (parseInt(i % G_M) * lr_x[1]) / G_M;
          positions[i][0] +=
            d3.randomUniform(0, 0.25)() * (centerOfGravity[0] - positions[i][0]);
          return x(positions[i][0]);
        })
        .attr("y", function (_, i) {
          positions[i][1] = (parseInt(i / G_M) * lr_y[1]) / G_N;
          positions[i][1] += 
            d3.randomUniform(0, 0.25)() * (centerOfGravity[1] - positions[i][1]);
          return y(positions[i][1]);
        })
        .style("fill", "rgb(255, 255, 255)")
        .style("cursor", "pointer")
        .text((d) => d.topKeyword)
        .attr("id", (d) => `text-${d.id}`)
        .on("click", (e, d) => {
          this.setChosenKeywordCluster(d.id);
        })
        .on("mouseover", (e, d) => {
          if (e.layerY / height > 0.5) {
            tooltip.style("bottom", `${height - e.layerY + 40}px`);
            tooltip.style("top", null);
          } else {
            tooltip.style("top", `${e.layerY}px`);
            tooltip.style("bottom", null);
          }
          if ((e.layerX + 15) / width > 0.5) {
            tooltip.style("right", `${width - e.layerX + 55}px`);
            tooltip.style("left", null);
          } else {
            tooltip.style("left", `${e.layerX + 15}px`);
            tooltip.style("right", null);
          }
          const f = d3.format(".3f");
          const metricVal = this.metricVal;
          window.globalVars.METRICS.forEach((metric) => {
            metricVal[metric] = f(d.metricValues[metric] / d.subtreeSize);
            const ranking = Object.values(this.keywordClusters)
              .sort((a, b) => {
                const aAvgMetricVal = a.metricValues[metric] / a.subtreeSize;
                const bAvgMetricVal = b.metricValues[metric] / b.subtreeSize;
                return window.globalVars.IS_METRIC_GOODNESS_DIRECT[metric]
                  ? aAvgMetricVal - bAvgMetricVal
                  : bAvgMetricVal - aAvgMetricVal;
              })
              .indexOf(d);
            const rankingP =
              (2 * ranking) / Object.values(this.keywordClusters).length;
            const color = this.getColor(rankingP);
            this.metricColor[metric] = color;
          });
          this.tooltipTitle = d.topKeyword;
          this.totalCountTooltip = d.subtreeSize;
          tooltip.style("visibility", "visible");
        })
        .on("mouseout", function () {
          tooltip.style("visibility", "hidden");
        });
      scatter
        .selectAll("rect")
        .attr("width", (d) => {
          return (
            d3.select(`#text-${d.id}`).node().getBBox().width + 2 * paddingXRect
          );
        })
        .attr("height", (d) => {
          return (
            d3.select(`#text-${d.id}`).node().getBBox().height +
            2 * paddingYRect
          );
        })
        .attr("y", (d) => {
          return d3.select(`#text-${d.id}`).node().getBBox().y - paddingYRect;
        })
        .attr("x", (d) => {
          return d3.select(`#text-${d.id}`).node().getBBox().x - paddingXRect;
        });
      function updateChart(e) {
        var newX = e.transform.rescaleX(x);
        var newY = e.transform.rescaleY(y);
        scatter
          .selectAll("text")
          .attr("x", function (_, i) {
            return newX(positions[i][0]);
          })
          .attr("y", function (_, i) {
            return newY(positions[i][1]);
          });
        scatter
          .selectAll("rect")
          .attr("width", (d) => {
            return (
              d3.select(`#text-${d.id}`).node().getBBox().width +
              2 * paddingXRect
            );
          })
          .attr("height", (d) => {
            return (
              d3.select(`#text-${d.id}`).node().getBBox().height +
              2 * paddingYRect
            );
          })
          .attr("y", (d) => {
            return d3.select(`#text-${d.id}`).node().getBBox().y - paddingYRect;
          })
          .attr("x", (d) => {
            return d3.select(`#text-${d.id}`).node().getBBox().x - paddingXRect;
          });
      }
    },
  },
  mounted() {
    this.render();
  },
  watch: {
    chosenMetric: {
      handler(newVal, oldVal) {
        if (newVal !== null && newVal !== oldVal) {
          this.render();
        }
      },
    },
  },
};
</script>

<style>
</style>