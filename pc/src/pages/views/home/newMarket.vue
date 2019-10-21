<template>
  <section>
    <div class="home-new-market">
      <el-card
        shadow="always"
        ref="marketCard"
        :body-style="{padding:'0'}"
        class="item"
        v-for="(v,k) in creatResultList"
        :key="k"
      >
        <ul class="markrt-card-main" @click="goExchange(v)">
          <li class="flex-box">
            <span class="market-card">
              <i class="market-coin">
                <img :src="getCoinIcon($common.getCoin(v.market))" alt="coin">
              </i>
              {{v.market | toString}}
            </span>
            <span class="color-rose" :class="tickersColor(v.change || 0)">{{v.change}}%</span>
          </li>
          <li>
            <p class="market-price">{{v.last}}</p>
            <p class="market-vol">¥ {{v.market | toCNY(v.last || 0)}}</p>
          </li>
        </ul>
        <div
          class="home-new-market-chart"
          v-if="v.market && v.market != '--_--'"
          :id="'chart_'+(k+1)"
        ></div>
      </el-card>
    </div>
  </section>
</template>

<script>
import exchangeApi from "@/api/exchange";
import { mapState } from "vuex";
import config from "@/config";
import _ from "lodash";
import { createChart } from "lightweight-charts";

export default {
  name: "newMarket",
  props: ["hotMarkets"],
  components: {},
  data() {
    return {
      loading: false,
      changeList: [],
      charts: [],
      listNumber: 5
    };
  },
  // 计算属性
  computed: {
    ...mapState([]),
    creatResultList() {
      // console.log(this.hotMarkets,'cchh')
      let dataArr = this.hotMarkets;
      let listArr = [];
      // let listNumber = 5;

      for (let i = 0; i < this.listNumber; i++) {
        if (dataArr[i]) {
          listArr.push({
            baseVol: dataArr[i].baseVol,
            change: dataArr[i].change,
            hight: dataArr[i].hight,
            last: dataArr[i].last,
            low: dataArr[i].low,
            market: dataArr[i].market,
            vol: dataArr[i].vol
          });
        } else {
          listArr.push({
            baseVol: "--",
            change: "--",
            hight: "--",
            last: "--",
            low: "--",
            market: "--_--",
            vol: "--"
          });
        }
      }
      // // 初始化k线
      this.$nextTick(() => {
        let array = [];
        for (let item of listArr) {
          array.push(item.market);
        }
        // console.log(array);
        if (array.join("") != this.changeList.join("")) {
          this.changeList = array;
          this.getTrendLine();
        }
      });

      return listArr;
    }
  },
  // 默认加载
  mounted() {
    // this.creatResultList(this.hotMarkets);
  },
  destroyed() {},
  created() {
    // this.tickers = this.$common.getJsonData(localStorage.tickers || "{}");
  },
  methods: {
    
    async getTrendLine() {
      this.initMarketChart()
      let n = 1;
      for (let market of this.changeList) {
        if (!market || market == "--_--") return;

        try {
          let result = await exchangeApi.getTrendLine({
            market,
            interval: 1440
          });

          this.updateMarketData(n, result);
          n++;
        } catch (e) {}
      }
    },
    // 初始化k线
    async initMarketChart() {
      if (this.charts.length > 0) return;
      for (let i = 1; i <= this.listNumber; i++) {
        // 当热门交易对更新的时候删除掉原先的chart

      let homeChart = document.getElementById("chart_" + i);

      var chart = createChart(homeChart, {
        width: 225,
        height: 90,
        layout: {
          textColor: "#d1d4dc",
          backgroundColor: "rgba(0,0,0,0)"
        },
        priceScale: {
          position: "none",
          borderVisible: false,
          mode: 2, //设置价格比例模式
          autoScale: true,
          scaleMargins: {
            //比例利润率
            top: 0,
            left: 0,
            bottom: 0
          }
        },
        crosshair: {
          vertLine: {
            width: 5,
            color: "rgba(224, 227, 235, 0.1)",
            style: 0,
            visible: false
          },
          horzLine: {
            visible: false,
            labelVisible: false
          }
        },
        grid: {
          vertLines: {
            color: "rgba(42, 46, 57, 0)",
            visible: false
          },
          horzLines: {
            color: "rgba(42, 46, 57, 0)",
            visible: false
          }
        },

        timeScale: {
          //时间轴

          // rightOffset: 13, //设置图表右侧的条形空间
          barSpacing: 12, //以像素为单位设置条形之间的间距
          fixLeftEdge: false, //如果为true，则阻止滚动到第一个历史栏的左侧
          // lockVisibleTimeRangeOnResize: false, //	如果为true，则在图表大小调整期间阻止更改可见时区
          rightBarStaysOnScroll: true, //如果为false，则滚动时悬停的栏保持在同一位置
          // borderVisible: false, //如果为true，则可以看到时间刻度边框
          // borderColor: '#fff000',  //时间刻度边框颜色
          visible: false //如果为true，则时间刻度显示在图表上
          // timeVisible: false,  //如果为true，则时间刻度和十字准线垂直标签上显示时间
        },
        handleScroll: {
          //滚动选项
          mouseWheel: false, //如果启用了具有水平鼠标滚轮的真系列滚动-->
          pressedMouseMove: false //如果允许按下鼠标左键进行真正的系列滚动-->
        },
        handleScale: {
          //缩放选项-->
          axisPressedMouseMove: false, //如果允许按下鼠标左键进行真正的轴缩放-->
          mouseWheel: false, //如果启用了使用鼠标whee的真正系列缩放-->
          pinch: false //如果启用了具有捏合/缩放手势的真实系列缩放（触摸设备支持此选项）-->
        }
      });

      var areaSeries = chart.addAreaSeries({
        topColor: "rgba(179,216,255,0.4)",
        bottomColor: "rgba(179,216,255,0.02)",
        lineColor: "rgba(179,216,255,1)",
        lineWidth: 2,
        crossHairMarkerVisible: false
      });
       this.charts[i] = areaSeries;
      areaSeries.applyOptions({
        priceLineVisible: false, //如果为true，则会在图表上显示一系列的价格线
        // priceLineWidth: 2, //价格线的宽度（以像素为单位）
        // priceLineColor: '#4682B4', //价格线的颜色
        // priceLineStyle: 3, //价格线的风格    // LineStyle.Solid LineStyle.Dotted  LineStyle.Dashed LineStyle.LargeDashed LineStyle.SparseDotted
        lastValueVisible: false, //如果为true，则在价格标尺上显示具有当前价格值的标签
        baseLineVisible: false //	如果为true，则在图表上显示系列的基线
        // baseLineColor: '#ff0000', //基线的颜色
        // baseLineWidth: 3, //基线的宽度（以像素为单位）
        // baseLineStyle: 1, //基线的风格
        // priceFormat: {
        //     type: 'price',  // price| volume|percent 设置按系列显示的价格类型
        //     precision: 3, //指定用于显示价格值的小数位数 默认2
        //     minMove: 0.05, //设置价格值移动的最小步长
        // },
      });
      }
    },
    updateMarketData(n, res) {
      let datas = [];
      for (let item of res) {
        datas.push({
          time: this.$tools.date.toString(item[0]),
          value: item[1]
        });
      }
      // console.log(n, this.charts[n], datas)
      this.charts[n].setData(datas);
    },
    // 去交易中心
    goExchange(row, column, event) {
      if (!row) return;
      this.$router.push({
        path: `/exchange/${row.market}`
      });
    }
  }
};
</script>

<style scoped lang="less">
// 热门币种
.home-new-market {
  display: flex;
  height: 50px;
  // overflow: hidden;
  margin-top: 20px;
  height: 120px;
  // align-items: center;
  justify-content: space-between;
  .item {
    flex: 1;
    max-width: 222px;

    height: 100%;
    cursor: pointer;
    position: relative;
    // background-color: #02aff1;
    //    border: 1px solid #EBEEF5;
    //     background-color: #FFF;
    //     color: #303133;
    //     transition: .3s;
    .markrt-card-main {
      position: relative;
      z-index: 99;
      padding: 10px;
      
      .flex-box {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .market-card {
          color: #909399;
        }
        .market-coin {
          width: 18px;
          height: 18px;
          display: inline-block;
          vertical-align: top;
          overflow: hidden;
        }
      }
      .market-price {
        font-size: 18px;
        padding: 5px 0;
      }
      .market-vol {
        font-size: 12px;
        // color: #606266;
      }
    }
    .home-new-market-chart {
      position: absolute;
      // top: 0;
      right: 0;
      left: 0;
      bottom: 0;
    }
  }
  .item:hover {
    background-color: #f2f6fc;
  }
  .item:not(:first-child) {
    margin-left: 15px;
  }
}
</style>
