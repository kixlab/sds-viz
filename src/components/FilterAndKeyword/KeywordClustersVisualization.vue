<template>
  <!-- The visualization of the clusters -->
  <!-- It is constructed by the 'render' method in the methods -->
  <div class="w-full h-full relative" id="keyword-viz">
    <!-- Keyword cluster tooltip -->
    <div
      id="keyword-tooltip"
      class="
        absolute
        z-20
        bg-white
        rounded-md
        border-gray-500 border
        px-2
        py-2
        divide-y-2
      "
      v-show="isTooltipVisible"
    >
    <!-- Title of tooltip -->
      <div>
        <p class="font-bold w-full flex justify-center mb-2 relative">
          {{ tooltipTitle }}
        </p>
      </div>
      <!-- List of Metrics -->
      <div>
        <div v-for="metric in metrics" :key="metric" class="flex items-center">
          <div
            class="h-3 w-3 mr-1"
            :style="`background-color: ${metricColor[metric]}`"
          ></div>
          <p class="font-bold text-sm mr-1">{{ metric }}:</p>
          <p class="text-sm">{{ metricVal[metric] }}</p>
        </div>
      </div>
      <!-- Information at the bottom -->
      <div class="flex justify-end items-center space-x-2">
        <div>
          <p v-if="isOutlier" class="text-sm flex justify-end mt-2">
            Outlier cluster
          </p>
        </div>
        <div>
          <p class="font-bold text-sm flex justify-end mt-2">
            Number of sessions: {{ totalCountTooltip }}
          </p>
        </div>
      </div>
    </div>
    <!-- <div
      class="absolute -top-6 left-20 flex">
      <div class="">
        <input v-model="keyword" type="text">
      </div>
      <div class="flex-none items-center px-1 rounded-lg shadow-md bg-green-500 text-white">
        <button @click="setKeyword()" class="cursor-pointer my-auto">
          <SearchIcon class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div> -->
    <!-- Visualization for the threshold filtering -->
    <!-- 'getColor' method is binded to calculate the color for the bar chart column -->
    <filter-visualization
      class="absolute top-0 right-2 transform -translate-y-6"
      v-bind="{ getColor }"
    />
  </div>
</template>

<script>
import { useGlobalStore } from "@/stores/globalStoreAgent.js";
import { computed, provide, inject } from "vue";
import * as d3 from "d3";
import $ from "jquery";
import FilterVisualization from "./FilterVisualization.vue";
// import { SearchIcon } from "@heroicons/vue/solid";

export default {
  name: "KeywordClustersVisualization",
  components: {
    FilterVisualization,
    // SearchIcon
  },
  setup() {
    // Inject the functions to manipulate the interaction state
    const store = useGlobalStore();
    // Current interaction state (which panel is open, which metric is chosen, ...)
    const interactionState = computed(() => store.getInteractionState.value);
    // Updates the interaction state
    const setInteractionState = store.setInteractionState;
    // The list of keyword clusters
    const keywordClusters = computed(() => {
      const keywordClusters = store.getKeywordClusters.value;
      return Object.values(keywordClusters).filter(c => c.subtreeSize > 0)
    });
    // const allKeywordClusters = computed(() => {
    //   const keywordClusters = store.getKeywordClusters.value;
    //   return keywordClusters
    // });
    // Sort the keyword clusters with respect to how good it is performing under the chosen performance metric
    const sortedKeywordClusters = computed(() => {
      const chosenMetric = interactionState.value.chosenMetric;
      return Object.values(keywordClusters.value).filter(c => c.subtreeSize > 0).sort((a, b) => {
        const aAvgMetricVal = a.metricValues[chosenMetric] / a.subtreeSize;
        const bAvgMetricVal = b.metricValues[chosenMetric] / b.subtreeSize;
        return window.globalVars.IS_METRIC_GOODNESS_DIRECT[chosenMetric]
          ? aAvgMetricVal - bAvgMetricVal
          : bAvgMetricVal - aAvgMetricVal;
      });
    });
    const createLog = inject('createLog')
    const highlights = computed(() => store.getHighlights.value);
    // Retrieve the dictionary of keyword clusters that maps their ids to the percentage ranking 
    // with respect to the chosen performance metric
    // percentage ranking: gives the percentile (e.g. 1st in 50 data points would be 0.02 in percentage ranking)
    const rankingPercentageById = computed(() => {
      const ranking = {};
      sortedKeywordClusters.value.forEach((keywordCluster, index) => {
        ranking[keywordCluster.id] =
          index / sortedKeywordClusters.value.length;
      });
      return ranking;
    });
    // The chosen performance metric
    const chosenMetric = computed(() => interactionState.value.chosenMetric);
    // const chosenBehaviorClusterId = computed(() => interactionState.value.chosenBehaviorClusterId);

    // All the metrics
    const metrics = window.globalVars.METRICS;
    // The chosen threshold for the filtering
    const chosenThreshold = computed(
      () => store.getInteractionState.value.chosenThreshold
    );

    const flowInitiator = computed(() => interactionState.value.flowInitiator)

    const setQuery = store.setQuery;

    const randomShuffle = function (array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    const keywordRenderData = computed(() => randomShuffle(keywordClusters.value))
    const chosenKeywordClusterId = computed(() => interactionState.value.chosenKeywordClusterId)
    // const totalSessions = computed(() => store.getTotalSessions.value)

    // Provide the 'rankingPercentageById' computed property to the sub components 
    // so that they can reactively refer to the percentage ranking of a keyword cluster
    provide("rankingPercentageById", rankingPercentageById);

    return {
      interactionState,
      setInteractionState,
      keywordClusters,
      rankingPercentageById,
      chosenMetric,
      metrics,
      chosenThreshold,
      highlights,
      setQuery,
      // chosenBehaviorClusterId,
      keywordRenderData,
      flowInitiator,
      createLog,
      chosenKeywordClusterId
      // allKeywordClusters,
      // totalSessions
    };
  },
  data() {
    return {
      // Order of the keywords to render
      // keywordRenderData: this.randomShuffle(
      //   Object.values(this.keywordClusters)
      // ),
      // Tooltip data (metric values of a keyword cluster)
      metricVal: window.globalVars.METRICS.reduce((acc, metric) => {
        acc[metric] = 0;
        return acc;
      }, {}),
      // Tooltip data (metric colors of a keyword cluster)
      metricColor: window.globalVars.METRICS.reduce((acc, metric) => {
        acc[metric] = "none";
        return acc;
      }, {}),
      tooltipTitle: "",
      totalCountTooltip: 0,
      // Outlier cluster indicator (Tooltip data)
      // Outlier cluster is the cluster that did not have a proper clustering result
      // it basically contains keywords that were not clustered meaningfully (they are leftovers)
      isOutlier: false,
      isTooltipVisible: false,
      keyword: ''
    };
  },
  methods: {
    // Flip the color of the keyword cluster text (happens after click)
    flipColorOfKeywordCluster(id) {
      if (id === null) return;
      const curColor = $(`#text-${id}`).css("fill");
      const newColor =
        curColor === "rgb(0, 0, 0)" ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)";
      $(`#text-${id}`).css("fill", newColor);
    },
    // Update the chosen keyword cluster, by updating the interaction state
    setChosenKeywordCluster(keywordClusterId, keywordCluster) {
      console.log(keywordCluster)
      // const previouslyChosenKeywordClusterId =
      //   this.interactionState.chosenKeywordClusterId;
      // // Flip the color of previously chosen keyword cluster
      // // this.flipColorOfKeywordCluster(previouslyChosenKeywordClusterId);
      // this.se


      // Update to be applied onto the interaction state
      let update = {
        chosenKeywordClusterId: keywordClusterId,
      };
      // If the chosen keyword cluster is the same as the previously chosen keyword cluster,
      // then set the chosen keyword cluster to null
      if (keywordClusterId !== null && this.interactionState.chosenKeywordClusterId === keywordClusterId) {
        update.chosenKeywordClusterId = null;
        this.createLog('unchooseKeywordCluster', {
          keywordClusterId: keywordClusterId,
          keywordCluster: keywordCluster.topFiveKeywords.join(' / '),
          subtreeSize: keywordCluster.subtreeSize,
          metrics: keywordCluster.metricsValue
          // behaviorCluster: this.behaviorCluster
        })
      } else if (keywordClusterId !== null) {
        this.createLog('chooseKeywordCluster', {
          keywordClusterId: keywordClusterId,
          keywordCluster: keywordCluster.topFiveKeywords.join(' / '),
          subtreeSize: keywordCluster.subtreeSize,
          metrics: keywordCluster.metricsValue
          // behaviorCluster: this.behaviorCluster
        })
      }

     
      // Update the interaction state
      this.setInteractionState(update);
      // Flip the color of the newly chosen keyword cluster
      // const currentlyChosenKeywordClusterId =
      //   this.interactionState.chosenKeywordClusterId;
      // this.flipColorOfKeywordCluster(currentlyChosenKeywordClusterId);
    },
    // Obtain the color for a given ranking percentage
    getColor(rankingP) {
      // const greenZone = ["#D6E8D8", "#2BD72B"],
      //   redZone = ["#F05656", "#ECDBDC"];
      const redZone=["#f59e0b", "#fcd34d"], // orange
        greenZone = ["#3B82F6", "#3B82F6"] // blue
      // If it is in top 50% --> it is good then --> green color
      // Else, --> it is bad --> red color
      if (rankingP < 0.5) {
        return d3.interpolate(redZone[0], redZone[1])(rankingP * 2);
      } else {
        return d3.interpolate(greenZone[0], greenZone[1])(rankingP * 2 - 1);
      }
    },
    // Utility function
    // Update the tooltip data (e.g. title, metric values, total count of sessions)
    updateTooltip(tooltipTitle, metricVal, totalCountTooltip) {
      this.tooltipTitle = tooltipTitle;
      this.metricVal = metricVal;
      this.totalCountTooltip = totalCountTooltip;
    },
    // Render the visualization by creating a svg element and appending it to the DOM
    render() {
      // Margins for the visualization
      var margin = { top: 15, right: 15, bottom: 15, left: 15 };
      // Obtain the width and height of the visualization panel
      const width = $("#keyword-viz").width() - margin.left - margin.right;
      const height = $("#keyword-viz").height() - margin.top - margin.bottom;
      // Construct 10x10 grid to place the keyword clusters (TODO)
      const lr_x = [0, 10], lr_y = [0, 10];
      // Final svg element that shows the visualization
      var SVG;
      // If there is no svg inside the div, then create a new one
      if (d3.select("#svg-keyword-viz").empty()) {
        SVG = d3
          .select("#keyword-viz")
          .append("svg")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("id", "svg-keyword-viz");
      } 
      // Else, choose the one inside the div
      else {
        SVG = d3.select("#svg-keyword-viz");
      }

      // Clear the interior of the svg element
      SVG.selectAll("*").remove();

      // Append a graphic element to the svg, and translate it by the margins
      SVG = SVG.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("cursor", "move");

      // Append a rectangle that makes the background of the visualization
      SVG.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#E4E7EB");
      
      // D3 zoom object that enables zooming in and out of the visualization
      var zoom = d3
        .zoom()
        .scaleExtent([0.5, 20]) // This control how much you can unzoom (x0.5) and zoom (x20)
        .extent([
          [0, 0],
          [width, height],
        ])
        .on("zoom", updateChart);
      SVG.call(zoom);

      // Construct a grid to display the keyword clusters
      const G_N = 9, G_M = 6;
      // Keyword cluster data
      const data = this.keywordRenderData;
      // Stores the positions of the keyword cluster in the display (initialized to (0, 0) at the beginning)
      var positions = data.map(() => [0, 0]);
      // x and y coordinates mappers. For a given location in the range 
      // x: [0, 10], y: [0, 10]  (which are lr_x, lr_y); maps to the width/height
      var x = d3.scaleLinear().domain(lr_x).range([0, width]);
      var y = d3.scaleLinear().domain(lr_y).range([height, 0]);
      // Actually, I do not know what it does, but this was used when I migrated an example code
      // from d3.js website. Probably, it handles the exceeding portion of the visualization.
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
      // Append the clip to the svg by encapsulating it inside a graphic object
      var scatter = SVG.append("g").attr("clip-path", "url(#clip)");
      // Padding for the keyword clusters
      const paddingXRect = 4, paddingYRect = 2;
      // Based on the threshold filtering, determine whether the keyword cluster should be highlighted
      // with black shadow
      const checkHighlight = (d) => {
        const threshold = this.chosenThreshold;
        if (!window.globalVars.IS_METRIC_GOODNESS_DIRECT[this.chosenMetric]) {
          return (
            d.metricValues[this.chosenMetric] / d.subtreeSize > 1 - threshold
          );
        }
        return d.metricValues[this.chosenMetric] / d.subtreeSize < threshold;
      };      

      // Draw the background rectangles for the keyword clusters
      // They are drawn temporarily. Based on the keyword string's location/size etc. Will be updated
      scatter
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("fill", (d) => this.getColor(this.rankingPercentageById[d.id]))
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("class", `keyword-cluster-rect`)
        .style("cursor", "pointer")
        .style(
          "filter",
          (d) =>
            `${
              checkHighlight(d) &&
              "drop-shadow(2px 4px 10px rgba(0, 0, 0, 0.8))"
            }`
        )
        .style("stroke", (d) => `${d.id === -1 ? "black" : (this.highlights.keywordClusters.has(d.id) ? "rgb(185, 28, 28)" : "none")}`)
        .style("stroke-width", (d) => `${d.id === -1 ? "1" : (this.highlights.keywordClusters.has(d.id) ? "4" : "none")}`)
        .style("stroke-dasharray", (d) => `${d.id === -1 && "5,5"}`)
        .style()
      
      // Tooltip shown when hovered over a keyword cluster
      var tooltip = d3.select("#keyword-tooltip");

      // Update the tooltip content
      const updateTooltip = (e, d) => {
        // Dynamic placement over the grid (e.g. if the keyword cluster is on top right, put the tooltip on bottom left)
        if (e.layerY / height > 0.5) {
          tooltip.style("bottom", `${height - e.layerY}px`);
          tooltip.style("top", null);
        } else {
          tooltip.style("top", `${e.layerY - 40}px`);
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
        // Render all the metric values in the tooltip
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
        // Show the representative keywords for the hovered keyword cluster
        this.tooltipTitle = `${d.topFiveKeywords.join(" / ")}`;
        // Subtree size --> number of sessions belonging to that keyword cluster
        this.totalCountTooltip = d.subtreeSize;
        // Set visibility to true
        this.isTooltipVisible = true
        // Check whether it is an outlier keyword cluster
        this.isOutlier = d.id === -1;
      };

      // Center of gravity, which is the center of the grid.
      const centerOfGravity = [
        (lr_x[1] - lr_x[0]) / 2,
        (lr_y[1] - lr_y[0]) / 2,
      ];

      // Draw the text of the keyword clusters
      scatter
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        // Font size is proportional to the sqrt(# of sessions in the subtree)
        .style("font-size", (d) => {
          return Math.max(3 * Math.sqrt(d.subtreeSize), 12); 
        })
        // Find the x coordinate of the text
        .attr("x", function (_, i) {
          // Map the x coordinate to the range represented by lr_x.
          // Since we render like a grid, and store G_M objects in the horizontal axis,
          // we use the variable G_M
          positions[i][0] = (parseInt(i % G_M) * lr_x[1]) / G_M;
          // Add a bit of randomization to the x coordinate by shifting the object 
          // toward the center of gravity
          positions[i][0] +=
            d3.randomUniform(0, 0.25)() *
            (centerOfGravity[0] - positions[i][0]);
          // Determine whether to make the location symmetrical wrt the center of gravity
          positions[i][0] +=
            d3.randomUniform(0, 1) > 0.5
              ? d3.randomUniform(1, 1.25)() *
                (centerOfGravity[0] - positions[i][0])
              : 0;
          // Find the x coordinate mapping of the text (namely, map to the range [0, width])
          return x(positions[i][0]);
        })
        // Very similar logic to the x coordinate case
        .attr("y", function (_, i) {
          positions[i][1] = (parseInt(i / G_M) * lr_y[1]) / G_N;
          positions[i][1] +=
            d3.randomUniform(0, 0.25)() *
            (centerOfGravity[1] - positions[i][1]);
          positions[i][1] +=
            d3.randomUniform(0, 1) > 0.5
              ? d3.randomUniform(1, 1.25)() *
                (centerOfGravity[1] - positions[i][1])
              : 0;
          return y(positions[i][1]);
        })
        // Text color
        .style("fill", (d) => {
          return this.chosenKeywordClusterId === d.id ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)"
        })
        .style("cursor", "pointer")
        // Show the top keyword of the keyword cluster
        .text((d) => d.topKeyword)
        .attr("id", (d) => `text-${d.id}`)
        // When clicked, update the chosen keyword cluster with the current one
        // also, anchor the tooltip to the screen
        .on("click", (e, d) => {
          // updateTooltip(e, d);
          this.setChosenKeywordCluster(d.id, d);
        })
        // When hovered, show the tooltip
        .on("mouseover", (e, d) => {
          // if (
          //   this.interactionState.chosenKeywordClusterId !== null &&
          //   this.interactionState.chosenKeywordClusterId !== d.id
          // )
          //   return;
          this.createLog('hoverKeywordClusterInfo', {
            keywordClusterId: d.id,
            keywordCluster: d.topFiveKeywords.join(' / '),
            subtreeSize: d.subtreeSize,
            metrics: d.metricsValue
            // behaviorCluster: this.behaviorCluster
          })
          updateTooltip(e, d);
        })
        // When the hovering is over, hide the tooltip
        .on("mouseout", (e, d) => {
          this.createLog('hoverLeaveKeywordClusterInfo', {
            keywordClusterId: d.id,
            keywordCluster: d.topFiveKeywords.join(' / '),
            subtreeSize: d.subtreeSize,
            metrics: d.metricsValue
            // behaviorCluster: this.behaviorCluster
          })
          // if (this.interactionState.chosenKeywordClusterId !== null) return;
          this.isTooltipVisible = false
        });

      // Update the height/width of the background rectangles for the keyword cluster texts
      // We do it in the later stage because:
      // 1) We do not know the size of the keyword cluster texts beforehand
      // 2) The bakcground rectangles should be in the background without blocking the textual content
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
      
      // When zoomed in/out, update the chart
      function updateChart(e) {
        // Find the new x, y mapping
        var newX = e.transform.rescaleX(x);
        var newY = e.transform.rescaleY(y);
        // Change the x, y location of the text content
        scatter
          .selectAll("text")
          .attr("x", function (_, i) {
            return newX(positions[i][0]);
          })
          .attr("y", function (_, i) {
            return newY(positions[i][1]);
          });
        // For the rectangles, update their x, y locations as well.
        // Also, update the height/width information
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
    // When this compenent is mounted for the first time, since the template code is ready
    // we call the render function to create the svg containing the visualization
    // and update the template
    this.render();
  },
  // Watch any changes in those metrics, and accordingly, update something
  watch: {
    // If the chosen metric is changes
    chosenMetric: {
      handler(newVal, oldVal) {
        // If the new metric is not null, and is not equal to the old one
        // --> the chosen keyword cluster is set to null (resetted) and the tooltip is hidden (if visible)
        // We also, re-render the visualiation of keyword clusters for the chosen metric 
        // since the colors etc. also change
        if (newVal !== null && newVal !== oldVal) {
          this.setChosenKeywordCluster(null, null)
          this.isTooltipVisible = false
          this.render();
        } 
        // But, if we only set the new metric to null, we do not need to re-render the visualization (it should be empty)
        else if (newVal === null) {
          this.setChosenKeywordCluster(null, null)
          this.isTooltipVisible = false
        }
      },
    },
    chosenKeywordClusterId: {
      handler(newVal, oldVal) {
        console.log('newVal', newVal)
        console.log('oldVal', oldVal)
        if (newVal !== null) {
          $(`#text-${newVal}`).css("fill", "rgb(0, 0, 0)");
        }

        if (oldVal !== null) {
          $(`#text-${oldVal}`).css("fill", "rgb(255, 255, 255)");
        }
        // const curColor = $(`#text-${id}`).css("fill");
        // const newColor =
        //   curColor === "rgb(0, 0, 0)" ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)";
        // $(`#text-${id}`).css("fill", newColor);
      }
    },
    // If the chosenThreshold is changed
    chosenThreshold: {
      handler(newVal, oldVal) {
        // If the new threshold is not null, and is not equal to the old one
        // --> re-render the visualization
        if (newVal !== null && newVal !== oldVal) {
          this.render();
        }
      },
    },
    highlights: {
      handler() {
        console.log('fired')
        this.render()
        // if (newVal.keywordClusters) {
        //   this.render();
        // }
      }, 
      deep: true
    },

    // chosenBehaviorClusterId: {
    //   handler(newVal, oldVal) {
    //     // If the new behavior cluster is not equal to the old one
    //     // --> re-render the visualization
    //     console.log('fired?')

    //     if (this.flowInitiator !== 'keyword' && newVal !== oldVal) {
    //       console.log('fired')
    //       this.render();
    //     }
    //   },
    // },
  },
};
</script>

<style scoped>
/* Style of the highlighted keyword cluster */
.highlight--worst {
  filter: drop-shadow(2px 4px 10px rgba(255, 0, 0, 0.8));
  stroke: black;
  stroke-width: 2;
}
</style>