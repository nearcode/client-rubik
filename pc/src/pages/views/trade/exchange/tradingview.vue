<template>
  <div class="trading-view">
    <div class="k_line clearfix">
      <!--<div id="trade_main" style="width: 100%;height: 100%;"></div>-->
      <div id="klineMode">
        <el-button size="mini" @click="tabChart('trade')" :type="chartActive('trade')">行情图</el-button>
        <el-button size="mini" @click="tabChart('depth')" :type="chartActive('depth')">深度图</el-button>
      </div>
      <div id="trade_main" v-show="chartEd=='trade'" class="candle-container"></div>
      <div id="depth"  v-if="chartEd=='depth'">
        <deepth-chart :depthList="depthList" :pair="pair"></deepth-chart>
      </div>
    </div>
  </div>
</template>

<script>
// import io from "socket.io-client";
// import chart from '@/common/tradingview/charting_library.min.js'
// let chart = require('@/common/tradingview/charting_library.min');
let chart = require("@/common/tradingview/charting_library/charting_library.min");
// console.log(chart2)
import datafeed from "@/common/tradingview/datafeed2.js";
import deepthChart from "./deepth_chart";
// import exchangeApi from '@/api/exchange'
import config from "@/config";
import { mapState } from "vuex";

export default {
  name: "TradingView",
  props: ["pair","depthList"],
  data() {
    return {
      chartEd:"trade"
    };
  },
  components: {
    deepthChart
  },
  created() {},
  computed: {
    ...mapState(["theme"]),
   
    getTheme() {
      let a = {};
      if (this.theme == "white") {
        a = this.$store.state.color.KlineColor.white;
      } else if (this.theme == "black") {
        a = this.$store.state.color.KlineColor.black;
      }
      return a;
    }
  },
  watch: {
    pair(newValue) {
      if (newValue) {
        this.showTradingView();
      }
    },
    theme(newValue) {
      datafeed.resetTheme(this.getTheme);
    }
  },
  mounted() {
    // console.log(chart)
    if (this.pair) {
      // this.showTradingView();
    }
  },
  methods: {
     chartActive(state){
      if(this.chartEd == state){
        return "primary"
      }else{
         return ""
      }
    },
    tabChart(state){
      console.log(state)
      this.chartEd = state;
    },
    showTradingView() {
      window.TradingView = chart.TradingView;
      let pair = this.$common.toString(this.pair);
      let ticker = this.$common.getTicker(this.pair, {});
      let lastPrice = (this.price = ticker.last);
      let length = this.$common.getAutoNumber(lastPrice);
      /**
                 下列代码为k线图代码
                 **/
      // 定义datas数据
      let datas = {};
      datas.symbol = pair;
      datas.market = this.pair;
      datas.restAPIURL = config.exchangeUrl + "/kline";
      // datas.symbol = datas.market = "C2C_ETH";

      datas.wsURL = { url: "wss://localhost", protocol: "beta" };
      datas.mode = "desktop";
      datas.theme = "dark";
      datas.timezone = "Asia/Shanghai";
      datas.symbolInfo = {
        name: datas.symbol,
        description: datas.symbol,
        exchange: pair, //标题
        volume_precision: 8,
        session: "24x7",
        has_intraday: true,
        has_daily: true,
        has_empty_bars: true,
        fractional: true,
        pricescale: Math.pow(10, length),
        minmov: 1,
        timezone: datas.timezone
      };
      // k线颜色配置
      let exports = {
        defaultThemes: {
          sum_day: {
            url: "sum-day.css",
            up: "#03c087", //横虚线
            vert: "#7d7d7d",
            down: "#ff657b",
            wickUp: "",
            wickDown: "",
            borderUp: "#00c6b0",
            borderDown: "#7d7d7d",
            bg: "#fff", //背景色
            grid: "#f7f8fa",
            cross: "#f0f0f0",
            border: "#7d7d7d",
            text: "#fff",
            line: "#7d7d7d",
            backgroundColor: "#7d7d7d"
          },
          night: {
            url: "dark.css",
            up: "#00c6b0",
            vert: "#607591",
            down: "#ae4e54",
            wickUp: "#00c6b0",
            wickDown: "#ff657b",
            borderUp: "#00c6b0",
            borderDown: "#ff657b",
            bg: "#374a62",
            grid: "#1f2943",
            cross: "#9194A3",
            border: "#4e5b85",
            text: "#ced6e0",
            line: "#607591",
            backgroundColor: "#4b617b"
          },
          white: {
            up: "#03c087",
            down: "#ef5555",
            bg: "#fbfbfb",
            grid: "#f7f8fa",
            cross: "#23283D",
            border: "#9194a4",
            text: "#9194a4",
            areatop: "rgba(71, 78, 112, 0.1)",
            areadown: "rgba(71, 78, 112, 0.02)",
            line: "#737375",
            toolbar_bg: "#161e31"
          }
        }
      };
      // console.log(this.$store.state.color.KlineColor.new_theme_black)
      window.marketKlineColor = {};
      window.marketKlineColor = this.getTheme;

      datafeed.init(datas, window.marketKlineColor);
    }
  }
};
</script>

<style lang="less" scoped>
.k_line {
  position: relative;
  #klineMode {
    position: absolute;
    right: 10px;
    top: 0;
    z-index: 8;
    display: flex;
    align-items: center;
    height: 26px;
    box-sizing: border-box;
    .el-button--mini{
      padding: 3px 5px!important;
    }
    .el-button+.el-button{
      margin-left:5px;
    }
  }
}
</style>