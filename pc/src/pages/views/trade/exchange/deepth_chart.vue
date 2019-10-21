<template>
  <div>
    <div id="myEcharts" v-bind:style="styleObject" class="echart-box"></div>
  </div>
</template>
<script>
import _ from "lodash";
// 引入基本模板
var echarts = require("@/common/echarts.min.js").echarts;
export default {
  name: "chartsDepth",
  props: ["depthList", "pair"],
  data() {
    return {
      isshowLoading: true,
      myEcharts: null,
      buysArr: [],
      asksArr: [],
      minval: null,
      maxval: null,
      styleObject: {
        height: "400px"
      }
    };
  },
  computed: {
    getDepthList() {
      let data = _.cloneDeep(this.depthList);

      let depth = {
        asks: [],
        bids: []
      };

      for (let item of data.asks) {
        let arr = [];
        if (item.amount != "--") {
          arr[1] = item.amount;
          arr[0] = item.price;
          depth["asks"].push(arr);
        }
      }
      for (let item of data.bids) {
        let arr = [];
        if (item.amount != "--") {
          arr[1] = item.amount;
          arr[0] = item.price;
          depth["bids"].push(arr);
        }
      }
      return depth;
    }
  },
  mounted() {
    let self = this;
    this.initEachart();

    window.onresize = function() {
      // 重置容器宽
      self.myEcharts.resize();
    };
  },
  watch: {
    depthList(val) {
      console.log("更新");
      this.upDataKline(this.getDepthList);
    },
    pair(newValue) {
      if (newValue) {
        this.initEachart();
      }
    }
  },

  methods: {
    initEachart() {
      // 基于准备好的dom，初始化echarts实例
      this.myEcharts = echarts.init(document.getElementById("myEcharts"));
      // 绘制图表
      this.myEcharts.showLoading({
        // text: "loading",
        color: "#4cbbff",
        textColor: "#4cbbff",
        maskColor: "rgba(0, 0, 0, 0.2"
      });
      this.myEcharts.setOption(
        {
          legend: {
            right: 0
          },

          tooltip: {
            trigger: "axis",
            confine: true,
            showContent: false,
            axisPointer: {
              lineStyle: {
                color: "rgba(0, 0, 0, 0)"
              }
            }
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            axisLabel: {
              showMinLabel: false,
              formatter: function(val) {
                return val;
              },
              textStyle: {
                color: "#839fbe"
              }
            },
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#839fbe" //左边线的颜色
                // width: "1" //坐标线的宽度
              }
            }
          },
          yAxis: [
            {
              type: "value",
              position: "right",
              splitNumber: 4,
              axisTick: {
                inside: true
              },
              axisLine: {
                lineStyle: {
                  type: "solid",
                  color: "#839fbe" //左边线的颜色
                  // width: "1" //坐标线的宽度
                }
              },
              axisLabel: {
                inside: true,
                showMinLabel: false,
                textStyle: {
                  color: "#839fbe"
                }
              },
              splitLine: {
                show: false
              }
            }
          ],
          series: [
            {
              data: this.getDepthList.bids,
              type: "line",
              symbol: "circle",
              showSymbol: false,
              symbolSize: 5,
              itemStyle: {
                color: "#2dbd83",
                borderColor: "rgba(19,184,135,0.15)",
                borderWidth: 10,
                shadowColor: "rgba(0, 0, 0, 0.2)",
                shadowBlur: 10
              },
              label: {
                show: true,
                position: "right",
                distance: 10,
                padding: 10,
                fontSize: 12,
                color: "#fff",
                backgroundColor: "rgba(0, 0, 0, .6)",
                formatter: function(params) {
                  return [
                    `委托价 ：{a|${params.data[0]}}`,
                    `总量 ：{a|${Math.round(params.data[1])}}`
                  ].join("\n");
                },
                rich: {
                  a: {
                    color: "#fff",
                    fontSize: "12",
                    fontWeight: "bold",
                    lineHeight: "20"
                  }
                }
              },
              lineStyle: {
                color: "#2dbd83"
              },
              areaStyle: {
                color: "#2dbd83",
                opacity: 0.2
              }
            },
            {
              data: this.getDepthList.asks,
              type: "line",
              symbol: "circle",
              showSymbol: false,
              symbolSize: 5,
              itemStyle: {
                color: "#eb4d5c",
                borderColor: "rgba(235,77,92,0.15)",
                borderWidth: 10,
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10
              },
              label: {
                show: true,
                position: "left",
                distance: 10,
                padding: 10,
                fontSize: 12,
                color: "#fff",
                backgroundColor: "rgba(0, 0, 0, .6)",
                formatter: function(params) {
                  return [
                    `委托价 ：{a|${params.data[0]}}`,
                    `总量 ：{a|${Math.round(params.data[1])}}`
                  ].join("\n");
                },
                rich: {
                  a: {
                    color: "#fff",
                    fontSize: "12",
                    fontWeight: "bold",
                    lineHeight: "20"
                  }
                }
              },
              lineStyle: {
                color: "#eb4d5c"
              },
              areaStyle: {
                color: "#eb4d5c",
                opacity: 0.2
              }
            }
          ],
          grid: {
            x: 0,
            y: 50,
            x2: 5,
            y2: 26
            //    containLabel: true
          }
        },
        true
      );
      this.myEcharts.hideLoading();
      // this.upDataKline(this.getDepthList);
    },
    upDataKline(data) {
      var option = this.myEcharts.getOption();

      option.series = [
        {
          data: data.bids
        },
        {
          data: data.asks
        }
      ];

      this.myEcharts.setOption(option);

      // let option ={
      //   series: [
      //     {
      //       data: data.bids
      //     },
      //     {
      //       data: data.asks
      //     }
      //   ]
      // }
      // this.myEcharts.setOption(option);
    }
  }
};
</script>





