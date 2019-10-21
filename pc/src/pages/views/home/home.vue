<template>
  <section class="At_the_bottom clearfix home" style="margin-top: -20px">
    <el-container>
      <el-main>
        <!--轮播图-->
        <section class="carousel">
          <v-carousel></v-carousel>
        </section>

        <!-- <div style="height:50px;background: -webkit-gradient(linear,left top,left bottom,from(#eff2f8),to(#fff));"></div> -->
        <div class="container">
          <!-- 热门币种 -->
          <new-markets :hotMarkets="hotMarkets"></new-markets>
          <!-- 行情 -->
          <div class="home_main">
            <el-main class="parentElement">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-for="(v,k) in getMarkets" :key="k" :label="v+'交易区'" :name="v">
                  <span v-if="v=='next'" slot="label">创业区</span>
                  <span v-if="v=='optional'" slot="label">
                    <i class="icon-star_empty"></i>自选区
                  </span>
                </el-tab-pane>
              </el-tabs>

              <div class="childElements_right hidden-sm-and-down">
                <div class="custom">
                  <!-- 模式币 -->
                  <div class="custom-main" v-if="mainSite">
                    <el-dropdown
                      @command="handleCommand"
                      :hide-on-click="false"
                      v-if="customTags.isCustom"
                      class="custom-menu"
                    >
                      <span class="el-dropdown-link">
                        分类
                        <i class="el-icon-caret-bottom el-icon--right"></i>
                      </span>
                      <!-- 标签列表 -->
                      <el-dropdown-menu slot="dropdown">
                        <el-checkbox-group v-model="customTags.selectTags">
                          <el-dropdown-item v-for="(v,k) in coinTags" :key="k" :command="v.name">
                            <el-checkbox
                              @change="coinsTagsChange"
                              :label="v.name"
                              :key="k"
                            >{{v.name}}</el-checkbox>
                            <!-- <el-badge class="mark" :value="v.coins.length+'币种'" type="info" /> -->
                            <small
                              style="color:#909399;margin-left:10px;text-align:center"
                            >({{v.coins.length+'币种'}})</small>
                          </el-dropdown-item>
                        </el-checkbox-group>
                      </el-dropdown-menu>
                    </el-dropdown>

                    <!-- 分类开关 -->
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="开启之后可以选择币种分类,关闭即可恢复默认列表"
                      placement="top"
                    >
                      <el-switch @change="coinsTagsChange" v-model="customTags.isCustom"></el-switch>
                    </el-tooltip>
                  </div>
                  <!-- 搜索交易区 -->
                  <el-input
                    size="mini"
                    v-model="search"
                    :placeholder="'搜索'+(activeName==='optional'?'自选区':activeName+'交易区')"
                    clearable
                    prefix-icon="el-icon-search"
                  ></el-input>
                </div>
              </div>

              <el-table
                v-loading="loading"
                @row-click="goExchange"
                @cell-click="handle"
                ref="tickersTable"
                :data="orderTickers"
                :default-sort="{prop:'baseVol',order:'descending'}"
                style="width: 100%"
                row-class-name="cell_style"
              >
                <template slot="empty">
                  <i class="icon-no-data"></i>
                  <p>暂无数据</p>
                </template>

                <el-table-column width="30">
                  <template slot="header" slot-scope="scope">
                    <i class="icon-star_empty"></i>
                  </template>
                  <template slot-scope="scope">
                    <i
                      class="fa fa-fw"
                      :class="scope.row.star?'icon-star':'icon-star_empty'"
                      style="width: 100%;cursor:pointer"
                      @click.stop="setfavorites(scope.row.pair)"
                    ></i>
                  </template>
                </el-table-column>

                <el-table-column prop="pair" label="币种" width="180" sortable>
                  <template slot-scope="scope">
                    <div style="white-space: nowrap;">
                      <i class="iconCoin">
                        <img
                          :src="getCoinIcon($common.getCoin(scope.row.pair))"
                          :alt="scope.row.pair"
                        />
                      </i>
                      <span style="display: inline-block;vertical-align: middle;line-height:1.2">
                        <p>{{scope.row.pair | toString}}</p>
                        <small style="white-space: nowrap;color:#909399">
                          {{coins[$common.getCoin(scope.row.pair)] | getDictValue('chineseName')}}
                          <el-tag
                            v-if="scope.row.tags && mainSite"
                            v-for="(v,k) in scope.row.tags"
                            :key="k"
                            style="margin-left:3px;height:auto;padding:2px;line-height:1;"
                            effect="plain"
                            size="mini"
                          >{{v}}</el-tag>
                        </small>
                      </span>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column prop="last" label="价格" sortable>
                  <template slot-scope="scope">
                    <span style="line-height:1">
                      <span
                        :class="tickersColor(scope.row.change ||0)"
                      >{{(scope.row.last || 0) | autoNumber}}</span>
                      <i :class="tickersColor(scope.row.change ||0,'icon')"></i>
                      <p
                        class="cn_name"
                        style="font-size:12px;color:#C0C4CC"
                      >≈ ￥{{scope.row.market | toCNY(scope.row.last) | autoNumber}}</p>
                    </span>
                  </template>
                </el-table-column>

                <el-table-column prop="change" label="涨跌幅" sortable>
                  <template slot-scope="scope">
                    <el-tag
                      :type="scope.row.change>=0?'success':'danger'"
                      style="width:80px;text-align:center;border:none;"
                    >
                      <span
                        :class="tickersColor(scope.row.change ||0)"
                      >{{(scope.row.change || 0) | toFixedEx(2)}}%</span>
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="low" label="最低价" sortable>
                  <template slot-scope="scope">
                    <span>{{(scope.row.low || 0) |autoNumber}}</span>
                  </template>
                </el-table-column>

                <el-table-column prop="hight" label="最高价" sortable>
                  <template slot-scope="scope">
                    <span v-text="scope.row.hight || 0"></span>
                  </template>
                </el-table-column>

                <el-table-column prop="vol" label="成交量" sortable>
                  <template slot-scope="scope">
                    <span>{{(scope.row.vol|| 0) |autoNumber}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="baseVol" label="成交额" sortable>
                  <template slot-scope="scope">
                    <span>{{(scope.row.baseVol|| 0) |autoNumber}}</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="操作" width="100" align="center">
                  <template template slot-scope="scope">
                    <el-button size="mini">交易</el-button>
                  </template>
                </el-table-column>-->
              </el-table>
            </el-main>
          </div>
        </div>

        <!-- app下载 -->
        <div class="home-download" id="home-download" v-cloak>
          <div class="container">
            <h1 class="home-download-title">APP下载</h1>
            <div class="home-download-main">
              <!-- left -->
              <div class="download-left download">
                <div class="download-left-main">
                  <div>
                    <span class="download-icon"></span>
                    <h2 class="download-app-title">交易所APP</h2>
                    <p class="download-content">快速便捷的全网交易平台</p>
                  </div>
                  <div class="download-btn-group">
                    <span v-for="(v,k) in exDownload" :key="k">
                      <el-popover
                        placement="top-end"
                        :disabled="coinApp"
                        @show="show('exQrcode',v.url)"
                        width="150"
                        trigger="hover"
                      >
                        <div class="popover-content" v-if="v.url">
                          <div id="exQrcode" style="height:150px"></div>
                          <!-- <el-image class="img" :src="urlAction+'?text='+v.url" alt="app"></el-image> -->
                        </div>
                        <div v-else style="text-align:center;">暂未开放</div>
                        <el-button
                          type="primary"
                          :icon="v.icon"
                          @click="show('exQrcode',v.url)"
                          slot="reference"
                          plain
                        >{{v.name}}</el-button>
                      </el-popover>
                    </span>
                  </div>
                </div>
                <div class="exchange-pc" v-if="!mainSite">
                  <img style="width:100%" src="/static/assets/pc-bg.png" alt />
                  <img
                    :class="[animation?'animation_up':'',' ']"
                    style="position: absolute; bottom: -45px; width: 208px;right: -45px;"
                    src="/static/assets/exchange.png"
                    alt
                  />
                </div>

                <div :class="[animation?'animation_down':'','img ']">
                  <img src="/static/assets/exchange.png" alt />
                </div>
              </div>
              <!-- right -->
              <div class="download-right download" v-if="mainSite">
                <div class="download-right-main">
                  <div>
                    <span class="download-icon"></span>
                    <h2 class="download-app-title">币付宝APP</h2>
                    <p class="download-content">支付、游戏、应用等一体化钱包</p>
                  </div>
                  <div class="download-btn-group">
                    <span v-for="(v,k ) in payDownload" :key="k">
                      <el-popover
                        placement="top"
                        :disabled="coinApp"
                        @show="show('bipayQrcode',v.url)"
                        width="150"
                        :trigger="coinApp?'click':'hover'"
                      >
                        <div class="popover-content" v-if="v.url">
                          <div id="bipayQrcode" style="height:150px"></div>
                          <!-- <el-image class="img" :src="urlAction+'?text='+v.url" alt="app"></el-image> -->
                        </div>
                        <div v-else style="text-align:center;">暂未开放</div>
                        <el-button
                          type="primary"
                          :icon="v.icon"
                          @click="show('bipayQrcode',v.url)"
                          slot="reference"
                          plain
                        >{{v.name}}</el-button>
                      </el-popover>
                    </span>
                  </div>
                </div>

                <div :class="[animation?'animation_up':'','img ']">
                  <img src="/static/assets/wallet.png" alt />
                </div>
              </div>
            </div>
          </div>
          <!-- <img width="200" src="/static/assets/pc-bg.png" alt=""> -->
        </div>
      </el-main>
    </el-container>

    <!-- app下载 -->
    <!-- <transition name="el-zoom-in-bottom">
      <div class="coin-app" v-if="coinApp">
        <div class="app-info pull-left">
          <span class="logo">
            <img :src="appLogo" class="app-logo" alt="APP">
          </span>
          <p>
            {{webTitle}} APP
            <br>浏览行情 酣畅交易 指尖掌握
          </p>
        </div>
        <div class="app-btn pull-right">
          <el-button type="primary" @click="goApp">立即下载</el-button>
        </div>
        <div class="app-close" @click="coinApp=false">
          <span class="fa fa-close"></span>
        </div>
      </div>
    </transition>-->
    <!-- <v-classify></v-classify> -->
  </section>
</template>

<script>
import exchangeApi from "@/api/exchange";
import vCarousel from "./carousel";
import newMarkets from "./newMarket";
import { mapState } from "vuex";
import config from "@/config";
import _ from "lodash";
import QRCode from "qrcodejs2"; // 引入qrcode
import vClassify from "./classify";
import baseApi from "@/api/base";
import { stat } from "fs";

export default {
  name: "home",
  components: {
    vCarousel,
    newMarkets,
    vClassify
  },
  data() {
    return {
      customTags: {
        //自定义显示交易对
        isCustom: false,
        selectTags: []
      },
      search: "",
      loading: false,
      tabs: [],
      tickers: null,
      activeName: null,
      favorites: [], //自选币种
      isLoadFavorites: false, //是否加载了自选
      tickerTimer: null,
      coinApp: false, //当到手机屏幕大小的时候显示下载
      animation: false, //动画
      hotMarkets: [], //热门币种
      mainSite: config.mainSite,
      urlAction: config.baseUrl + "/qrcode",
      exDownload: [
        {
          name: "下载地址",
          url: ""
        }

        // {
        //   name:'H5',
        // icon:'fa fa-css3 fa-fw'
        // },

        // {
        //   name:'IOS',
        //   url:'',
        // }
      ],
      payDownload: [
        {
          name: "下载地址",
          url: ""
        }
      ]
    };
  },
  // 计算属性
  computed: {
    ...mapState([
      "coins",
      "isLogin",
      "markets",
      "webTitle",
      "appLogo",
      "appVersion",
      "coinsTags"
    ]),
    // 获取base币种
    getMarkets() {
      let markets = _.clone(this.tabs);
      let baseCoinList =
        this.markets.length > 0
          ? this.markets
          : this.$common.getJsonData(localStorage.baseCoinList || "[]");

      for (let item of baseCoinList) {
        if (markets.indexOf(item.base) == -1 && !item.type) {
          markets.push(item.base);
        }
      }
      for (let item of ["next", "optional"]) {
        markets.push(item);
      }
      // 默认选中
      this.$nextTick(() => {
        if (markets[0]) {
          this.activeName = markets[0];
        } else {
          this.activeName = "optional";
        }
      });

      return markets;
    },
    //所有标签 重构一下标签数据
    coinTags() {
      let coins = this.coins;
      let coinsTags = this.coinsTags;
      let data = [];

      for (let item of coinsTags) {
        data.push({
          name: item,
          coins: []
        });
      }
      for (let item in coins) {
        // 循坏用户选择的模式
        for (let i of data) {
          if (coins[item].tags && coins[item].tags.indexOf(i.name) != -1) {
            i.coins.push(item);
          }
        }
      }
      return data;
    },
    // 从币种里面读取出对应的标签
    getTagsCoin() {
      let coins = this.coins;
      let data = [];

      for (let coin in coins) {
        // 循坏用户选择的模式
        for (let item of this.customTags.selectTags) {
          if (coins[coin].tags && coins[coin].tags.indexOf(item) != -1) {
            //判断当币种不存在的时候才添加
            if (data.indexOf(coins[coin].coin) == -1) {
              data.push(coin);
            }
          }
        }
      }
      return data;
    },

    tickerList() {
      let _tagsCoin = this.getTagsCoin; //选择的模式币种
      let _coins = this.coins;

      let list = [];
      let hotMarkets = [];
      let favorites = this.favorites
        ? this.favorites
        : this.$common.getJsonData(localStorage.favorites || "[]");

      for (let pair in this.tickers) {
        this.tickers[pair].star = null;
      }
      // 自选币种
      favorites.forEach(pair => {
        if (this.tickers[pair]) {
          this.tickers[pair].star = 1;
        }
      });
      // 处理交易对
      for (let pair in this.tickers) {
        // 提取热门交易对
        hotMarkets.push(this.tickers[pair]);

        // 将字符串数据转换成数字,方便排序
        for (let key in this.tickers[pair]) {
          if (!isNaN(Number(this.tickers[pair][key]))) {
            this.tickers[pair][key] = Number(this.tickers[pair][key]);
          }
        }

        if (
          this.activeName &&
          this.activeName != "optional" &&
          this.activeName == pair.split("_")[1]
        ) {
          // 将币种标签提取到行情列表里面
          for (let coin in _coins) {
            if (_coins[coin].tags && coin == this.$common.getCoin(pair)) {
              this.tickers[pair]["tags"] = _coins[coin].tags;
            }
          }

          // 如果是主站就执行模式币筛选
          if (this.mainSite && this.customTags.isCustom) {
            for (let item of _tagsCoin) {
              let info = this.getExchangeInfo(pair);
              if (item == info.coin && !info.type) {
                list.push(this.tickers[pair]);
              }
            }
          } else {
            let info = this.getExchangeInfo(pair);
            if (info && !info.type) {
              list.push(this.tickers[pair]);
            }
          }
          // console.log(list)
        }
        // 自选区
        else if (
          this.activeName == "optional" &&
          favorites.indexOf(pair) != -1
        ) {
          list.push(this.tickers[pair]);
        }
        //创业区
        else if (this.activeName == "next") {
          // list
          for (let item of this.markets) {
            let market = item.coin + "_" + item.base;
            if (item.type == 1 && market == pair) {
              list.push(this.tickers[pair]);
            }
          }
        }
      }
      // 热门币种排序
      hotMarkets.sort(function(a, b) {
        return b.baseVol - a.baseVol;
      });

      this.hotMarkets = hotMarkets;
      // .slice(0,5)
      return list;
    },
    // 模糊搜索
    orderTickers() {
      let newObj = [];
      for (let item of this.tickerList) {
        try {
          if (
            item.pair &&
            this.$common
              .getCoin(item.pair)
              .indexOf(this.search.toUpperCase().trim()) > -1
          ) {
            newObj.push(item);
          }
        } catch (e) {}
      }

      return newObj;
    }
  },
  // 默认加载
  mounted() {
    // setInterval(()=>{
    //  this.$nextTick(()=>{
    //    this.tickers["MAYA_C2C"] = this.tickers["EOS_C2C"];
    // })
    // }, 3000)
    console.log(this.$store.state.color);

    this.$store.commit("getCoinsTags");
    this.$store.commit("getAppList", res => {
      if (!res) return;
      this.exDownload = [
        {
          name: "下载地址",
          url: res["EXCHANGE"].downUrl
        }
      ];
      this.payDownload = [
        {
          name: "下载地址",
          url: res["BIPAY"].downUrl
        }
      ];
    });

    this.tickers = this.$common.getJsonData(localStorage.tickers) || {};

    try {
      if (Object.keys(this.tickers).length <= 0) {
        this.loading = true;
      }
    } catch (e) {}

    //获取行情
    this.getTickers();
    this.tickerTimer = setInterval(async () => {
      await this.getTickers();
    }, 1000 * 5);

    // 监听浏览器滚动事件
    window.addEventListener("scroll", this.handleScroll);
    // this.$nextTick(() => {
    //     // // 默认选中
    //     if (this.getMarkets[0]) {
    //         this.activeName = this.getMarkets[0];
    //     } else {
    //         this.activeName = 'optional';
    //     }
    // });

    // 判断手机还是pc
    function isPc() {
      var userAgentInfo = navigator.userAgent;
      var Agents = new Array(
        "Android",
        "iPhone",
        "SymbianOS",
        "Windows Phone",
        "iPad",
        "iPod"
      );
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    }

    this.coinApp = !isPc();
  },
  destroyed() {
    //清除定时器
    clearInterval(this.tickerTimer);
    window.removeEventListener("scroll", this.handleScroll);
  },
  created() {
    if (localStorage.getItem("customTags") != null) {
      this.customTags = JSON.parse(localStorage.getItem("customTags")) || {};
    }
  },
  methods: {
    coinsTagsChange(state, item) {
      let data = {
        isCustom: this.customTags.isCustom,
        selectTags: this.customTags.selectTags || []
      };
      localStorage.setItem("customTags", JSON.stringify(data));
    },
    handleCommand(command) {
      // this.selectTags=command;
    },
    show(id, text) {
      if (!id || !text) return;
      if (this.coinApp) {
        return window.open(text, "_blank");
      }
      this.$nextTick(() => {
        this.qrcode(id, text);
      });
    },
    // 生成二维码
    qrcode(id, text) {
      if (document.getElementById(id))
        document.getElementById(id).innerHTML = "";

      let qrcode = new QRCode(id, {
        width: 150,
        height: 150,
        text, // 二维码地址
        colorDark: "#000",
        colorLight: "#fff"
      });
    },
    handleScroll() {
      // 实现当滚动到指定位置，触发动画
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      //变量windowHeight是可视区的高度
      var windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;

      let element = document.getElementById("home-download");

      var eTop = element.offsetTop; //橙色容器距离整个页面顶部的距离
      var wTop = windowHeight; //绿色框可视区域的高度

      if (wTop + scrollTop - 200 > eTop) {
        this.animation = true;
      }
    },
    goApp() {
      let routeData = this.$router.resolve({
        path: "/appDownload"
      });
      window.open(routeData.href, "_blank");
    },
    // 获取数据
    async getTickers() {
      // this.tickers = this.$common.getJsonData(localStorage.tickers || "{}");
      let tickers = await exchangeApi.getTickers();
      this.loading = false;
      for (let item in tickers) {
        tickers[item].pair = item;
      }
      this.tickers = tickers;

      localStorage.setItem("tickers", JSON.stringify(this.tickers));
    },
    // 设置自选币种
    async setfavorites(pair) {
      if (!pair) return;
      if (!this.isLogin()) return this.$router.push("/login");
      let favorites = this.favorites;
      if (this.favorites.indexOf(pair) != -1) {
        //  _.pull(favorites, pair);
        let n = 0;
        for (let item of this.favorites) {
          if (item == pair) {
            this.favorites.splice(n, 1);
          }
          n++;
        }
      } else favorites.push(pair);
      try {
        let result = await exchangeApi.setfavorites(favorites);
        this.$notify.success(this.$t("设置成功"));
      } catch (e) {}
    },
    // 获取自选
    async getFavorites() {
      if (!this.isLogin()) return;
      let result = await exchangeApi.getFavorites();
      this.favorites = result;
      this.isLoadFavorites = true;
      // if (this.favorites.length) {
      //   this.activeName = "optional";
      // }
      localStorage.favorites = JSON.stringify(result);
    },
    // 去交易中心
    goExchange(row, column, event) {
      if (!row) return;
      this.$router.push({
        path: `/exchange/${row.pair}`
      });
    },
    // 切换交易区
    handleClick(tab, event) {
      this.activeName = tab.name;
      if (tab.name == "optional" && !this.isLoadFavorites) {
        this.getFavorites(); //获取自选币种
      }
      // console.log(tab.name=="optional")
      // this.getFavorites(); //获取自选币种
    },
    // 单元格点击
    handle(row, column, event, cell) {
      console.log(row, column, event, cell);
    },
    //获取交易对配置信息
    getExchangeInfo(market) {
      for (let item of this.markets) {
        if (market == item.coin + "_" + item.base) {
          return item;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
// 自定义模式
.custom {
  display: flex;
  align-items: center;

  .custom-main {
    margin-right: 5px;
    display: flex;
    align-items: center;
    white-space: nowrap;

    .custom-menu {
      margin-right: 5px;
    }
  }
}

.el-tag.el-tag--success {
  background-color: rgba(19, 184, 135, 0.15);
}

.el-tag.el-tag--danger {
  background-color: rgba(235, 77, 92, 0.15);
}

.exchange-pc {
  position: relative;
  width: 600px;
  margin-right: 40px;
}

@keyframes slideup {
  0% {
    -webkit-transform: translateY(20%);
    transform: translateY(20%);
  }

  to {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
}

@keyframes slidedown {
  0% {
    -webkit-transform: translateY(-20%);
    transform: translateY(-20%);
  }

  to {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
}

.home-download .img {
  width: 260px;
}

.animation_up {
  transition: all 0.8s ease-out 0.3s;
  animation: ease slideup 1s;
}

.animation_down {
  transition: all 0.8s ease-out 0.3s;
  animation: ease slidedown 1s;
}

// 首页下载
.home-download {
  background-color: #f5f7fb;
  height: 500px;
  overflow: hidden;

  // height: 700px;
  .home-download-title {
    text-align: center;
    font-size: 45px;
    font-weight: bold;
    margin: 10px 0;
  }

  .home-download-main {
    display: flex;
    margin-top: 30px;
    min-height: 400px;

    .download {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .download-left-main {
        flex: 1;

        .download-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #02aff1;
          display: inline-block;
        }

        .download-app-title {
          font-size: 30px;
          display: inline-block;
        }

        .download-content {
          font-size: 20px;
          margin: 20px 0 30px 23px;
        }

        .download-btn-group {
          button {
            width: 130px;
            margin: 10px;
            height: 40px;
            // background: transparent;
          }
        }
      }

      .download-right-main {
        flex: 1;

        .download-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #02aff1;
          display: inline-block;
        }

        .download-app-title {
          font-size: 30px;
          display: inline-block;
        }

        .download-content {
          font-size: 20px;
          margin: 20px 0 30px 23px;
        }

        .download-btn-group {
          button {
            width: 130px;
            margin: 10px;
            height: 40px;
            // background: transparent;
          }
        }
      }
    }

    .download.download-right {
      flex-direction: row-reverse;
    }

    .download-right {
      flex: 1;
      // background-color: bule;
      height: 100%;
    }
  }
}

.home_main {
  box-shadow: 0 0 42px 0 rgba(9, 30, 55, 0.06);
  padding: 20px 10px;
  margin-bottom: 30px;
  margin-top: 30px;
  min-height: 300px;
  /*min-width: 1080px;*/
  /*white-space: nowrap;*/
  /*overflow: hidden;*/

  /deep/ .el-table .cell {
    padding: 0 5px;
  }

  /deep/ tr.cell_style {
    cursor: pointer !important;
  }
}

.iconCoin {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: sub;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}

.At_the_bottom {
  // background-color: #fff !important;
}

.carousel {
  background: #101929 linear-gradient(336deg, #142547 0, #101929 100%);
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.coin-app {
  background-color: rgba(13, 14, 14, 0.75);
  padding: 10px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.app-info p {
  margin: 0;
  padding: 4px 0;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-info {
  line-height: 1.5;
  color: #fff;
  font-size: 14px;
  text-align: left;
}

.app-btn {
  margin-top: 20px;
}

.app-close {
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 50%;
  background-color: #409eff;
  text-align: center;
  color: #fff;
  position: absolute;
  top: -12px;
  right: 15px;
  z-index: 1000;
  cursor: pointer;
}

.app-info .logo {
  width: 50px;
  height: 50px;
  padding: 5px;
  // background: url("/images/mobile/mobileBg.png")center center no-repeat;
  background-size: 100%;
  overflow: hidden;
  float: left;
  border-radius: 10px;
  box-shadow: 0 5px 5px #333;
  margin-right: 10px;
  background: linear-gradient(180deg, #02aff1, #0268fd);

  .app-logo {
    width: 100%;
    height: 100%;
    display: inline-block;
  }
}
</style>
