<template>
  <div class="exchange">
    <div class="trade_main">
      <!-- 深度 -->
      <div class="depth-main">
        <div class="depth">
          <div class="depth-head">
            <el-button size="mini" @click="setDepthType('depth')">
              <img src="/static/assets/ico/depth.svg" alt />
            </el-button>
            <el-button size="mini" @click="setDepthType('buy')">
              <img src="/static/assets/ico/bid.svg" alt />
            </el-button>
            <el-button size="mini" @click="setDepthType('sell')">
              <img src="/static/assets/ico/selling.svg" alt />
            </el-button>
          </div>
          <div class="trade_dataTitle">
            <el-row>
              <el-col :span="8">价格({{pair|getCoin}})</el-col>
              <el-col :span="8">数量</el-col>
              <el-col :span="8">成交量({{pair|getBaseCoin}})</el-col>
            </el-row>
          </div>
          <div class="list">
            <div class="list_content" v-loading="!depthList">
              <!--sell-->
              <div class="myapp-plain-table" :class="sellShowHide" scroll="no" id="buyList">
                <el-scrollbar style="height: 100%" ref="buyList">
                  <ul>
                    <li
                      :key="k"
                      v-for="(v,k) in depthList.asks"
                      @click="toValue(v.price, v.amount)"
                      class="container-fluid"
                    >
                      <!-- :gutter="5" -->
                      <el-row>
                        <el-col class="font_red" :span="8">
                          <i class="fromlogo">
                            <img v-if="v.from" :src="getCoinIcon(v.from)" alt />
                          </i>
                          {{v | getDictValue('price')}}
                        </el-col>
                        <el-col :span="8">{{v.amount | autoNumber}}</el-col>
                        <el-col :span="8" class="font-gray">
                          {{v.vol | autoNumber}}
                          <!--{{(v.price * v.amount) | autoNumber}}-->
                        </el-col>
                      </el-row>
                      <div class="depthBg sellBg" :style="{width:(v.width+'%')}"></div>
                    </li>
                  </ul>
                </el-scrollbar>
              </div>
              <!--最新价-->
              <div class="news_price" :class="tickersColor(tickers[pair]?tickers[pair].last:0)">
                {{tickers[pair]?tickers[pair].last:0}}
                <small
                  class="font-gray"
                >≈ {{pair | toCNY(tickers[pair]?tickers[pair].last:0)}} CNY</small>
                <i :class="tickersColor(tickers[pair]?tickers[pair].last:0,'icon')"></i>
              </div>
              <!--buy-->
              <div class="myapp-plain-table" :class="buyShowHide">
                <el-scrollbar style="height: 100%">
                  <ul>
                    <li
                      :key="k"
                      v-for="(v,k) in depthList.bids"
                      @click="toValue(v.price, v.amount)"
                      class="container-fluid"
                    >
                      <el-row>
                        <el-col class="font_green" :span="8">
                          <i class="fromlogo">
                            <img v-if="v.from" :src="getCoinIcon(v.from)" alt />
                          </i>
                          {{v|getDictValue('price')}}
                        </el-col>
                        <el-col :span="8">{{v.amount | autoNumber}}</el-col>
                        <el-col :span="8" class="font-gray">{{v.vol | autoNumber}}</el-col>
                      </el-row>
                      <div class="depthBg buyBg" :style="{width:(v.width+'%')}"></div>
                    </li>
                  </ul>
                </el-scrollbar>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 交易 -->
      <div class="exchange_main">
        <div class="trading">
          <div class="trading-chart">
            <dl class="exchange-ticker">
              <dt class="select-market">
                <span style="white-space: nowrap;">
                  <img :src="getCoinIcon($common.getCoin(pair))" alt />
                  <strong style="font-size:20px;">{{pair | getCoin}}</strong>
                  <small>/ {{pair | getBaseCoin}}</small>
                  <i class="el-icon-arrow-down select_icon"></i>
                </span>

                <!-- tickers -->
                <div class="market_ticker">
                  <v-sidebar @tickers="tickers" :pair="pair"></v-sidebar>
                </div>
              </dt>
              <dd class="first">
                <strong
                  :class="tickersColor(tickers[pair]?tickers[pair].change:0)"
                >{{tickers[pair]?tickers[pair].last:0 }}</strong>
                <span :class="tickersColor(tickers[pair]?tickers[pair].change:0)">
                  {{(tickers[pair]?tickers[pair].change:0) | toFixedEx(2)}}%
                  <i
                    class="fa caret"
                    :class="dnArrow(tickers[pair])"
                  ></i>
                </span>
              </dd>
              <dd>
                <p>{{tickers[pair]?tickers[pair].low:0}}</p>
                <span>最低</span>
              </dd>
              <dd>
                <p>{{tickers[pair]?tickers[pair].hight:0}}</p>
                <span>最高</span>
              </dd>
              <dd>
                <p>{{tickers[pair]?tickers[pair].vol:0 | autoNumber}}</p>
                <span>24H量({{pair|getCoin}})</span>
              </dd>
              <dd class="hidden-sm-and-down">
                <p>{{tickers[pair]?tickers[pair].baseVol:0|autoNumber}}</p>
                <span>24H额({{pair|getBaseCoin}})</span>
              </dd>
              <dd class="book-icon">
                <el-tooltip class="item" effect="light" placement="bottom">
                  <div slot="content" style="width:600px;height:500px;overflow-y:auto;">
                    <v-information :pair="pair"></v-information>
                  </div>
                  <i class="icon-book"></i>
                </el-tooltip>
              </dd>
            </dl>

            <!--k线-->
            <div class="k_line">
              <trading-view v-show="pair" :depthList="depthList" :pair="pair"></trading-view>
              <!--:update="upDate"-->
              <!--<echart :market="pair"></echart>-->
            </div>
          </div>
          <!--买卖-->
          <div class="trade-form">
            <div style="display:flex;align-items:center" class="trade_card">
              <div
                class="trade_form"
                style="-webkit-box-flex: 1;-ms-flex: 1;flex:1"
                :key="v.index"
                v-for="(v,k) in tradeType"
              >
                <div class="trade-form-head">
                  <strong>{{v.title}} {{pair | getCoin}}</strong>
                  <!--余额-->
                  <h3 class="font_green" v-if="v.index=='buy'">
                    可用：{{buyBalance | toFixedEx}}
                    {{pair | getBaseCoin}}
                  </h3>
                  <h3 class="font_red" v-if="v.index=='sell'">
                    可用：{{sellBalance | toFixedEx}}
                    {{pair | getCoin}}
                  </h3>
                </div>
                <!--买卖-->
                <el-form
                  :model="tradeForm"
                  :rules="tradeRules"
                  ref="tradeForm"
                  label-position="left"
                  label-width="0"
                  class="demo-ruleForm tradeForm"
                >
                  <!--价格-->
                  <el-form-item prop="price" class="parentElement">
                    <el-input
                      type="number"
                      v-model="tradeForm[v.index].price"
                      auto-complete="off"
                      placeholder="价格"
                      @input="changePrice(v.index)"
                      required
                    ></el-input>
                    <span class="childElements_left" style="left: 10px;">价格</span>
                  </el-form-item>
                  <!--数量-->
                  <el-form-item prop="amount" class="parentElement">
                    <el-input
                      type="text"
                      @input="changeAmount(v.index)"
                      v-model="tradeForm[v.index].amount"
                      auto-complete="off"
                      placeholder="数量"
                    ></el-input>
                    <span class="childElements_left" style="left: 10px;">数量</span>
                  </el-form-item>
                  <!--总额-->
                  <el-form-item prop="total" class="parentElement">
                    <el-input
                      type="text"
                      disabled
                      :value="getTotal(v.index)"
                      auto-complete="off"
                      placeholder="总额"
                    ></el-input>
                    <span class="childElements_left" style="left: 10px;">总额</span>
                  </el-form-item>
                  <!--滑块-->
                  <el-form-item prop="progress">
                    <el-slider
                      v-model="tradeForm[v.index].progress"
                      @input="rangeSell(v.index)"
                      :step="10"
                      show-stops
                      :disabled="!isLogin()"
                      style="padding: 0 5px"
                    ></el-slider>
                  </el-form-item>
                  <!--费率-->
                  <el-form-item prop="value3">
                    <!--<el-switch v-model="value3" active-text="ALL抵5折手续费"></el-switch>-->
                    <div class="pull-right">
                      <!-- 费率&nbsp;
                      <span
                        v-for="(v,k) in markets"
                        :key="k"
                        v-if="v.coin==pair.split('_')[0] && v.base==pair.split('_')[1]"
                      >{{v.fee*100 |noData}}%</span>-->
                      <el-tooltip effect="dark" content="成交才收，撤单退回。以实际成交的扣除为准" placement="right">
                        <div style="cursor: help;">
                          <span>挂单</span>
                          <i class="font_red">{{tradeFee('takerFee')}}</i>
                          <span style="padding: 0 5px">/</span>
                          <span>吃单</span>
                          <i class="font_red">{{tradeFee('makerFee')}}</i>
                        </div>
                      </el-tooltip>
                    </div>
                  </el-form-item>
                  <!--买卖按钮-->
                  <el-form-item>
                    <el-button
                      :type="v.index=='buy'?'primary':'danger'"
                      :class="v.index=='buy'?'buy':'sell'"
                      @click="trade(v.index)"
                      class="btn-block trade-form-btn"
                    >
                      <span v-if="isLogin()">{{v.title}} {{pair|getCoin}}</span>
                      <span v-else>登录</span>
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
              <!--登录遮罩层-->
              <!-- <div class="shape_content" v-if="!isLogin()">
                                <div class="shape_wrap">

                                </div>
                                <el-button class="shape_btn" type="primary" size="medium"
                                           @click="$router.push('/login')">立即登录
                                </el-button>
              </div>-->
            </div>
          </div>
        </div>
      </div>
      <!-- 最新成交 -->
      <div class="last-price-main">
        <!--最新成交-->
        <v-dealhistory :dealHistory="dealHistory"></v-dealhistory>
      </div>
    </div>

    <!--挂单记录-->
    <div class="exchange-orders">
      <el-tabs v-model="tabOrderAct" @tab-click="tabOrders" header-row-class-name="abcd">
        <!--我的挂单-->
        <el-tab-pane label="我的挂单" name="myOrders">
          <div class="myOrders">
            <el-table :data="myOrders" v-loading="ordersLoading">
              <template slot="empty">
                <i class="icon-no-data"></i>
                <p>暂无数据</p>
              </template>
              <el-table-column prop="create" label="时间" width="180">
                <template slot-scope="scope">
                  <span>{{scope.row.create|toTimeStr}}</span>
                </template>
              </el-table-column>
              <el-table-column label="类型" width="80">
                <template slot-scope="scope">
                  <span class="font_green" v-if="scope.row && scope.row.type===1">买入</span>
                  <span class="font_red" v-else>卖出</span>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="价格"></el-table-column>
              <el-table-column prop="amount" label="数量"></el-table-column>
              <el-table-column prop="address" label="成交量">
                <template slot-scope="scope">
                  <span>{{scope.row.price*scope.row.amount | autoNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column width="80" prop="cancel" label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" @click="cancelOrder(scope.row.id)">取消</el-button>
                </template>
              </el-table-column>
              <!--<p slot="append" style="text-align:center; line-height:50px;"><a href="javascript:;" class="blue01">查看更多</a></p>-->
            </el-table>
          </div>
        </el-tab-pane>
        <!--我的成交-->
        <el-tab-pane label="我的成交" name="myOrderHistory">
          <div class="myOrderHistory">
            <el-table :data="myOrderHistory" v-loading="ordersLoading">
              <template slot="empty">
                <i class="icon-no-data"></i>
                <p>暂无数据</p>
              </template>
              <el-table-column prop="date" label="时间" width="180">
                <template slot-scope="scope">
                  <span>{{scope.row.create | toTimeStr}}</span>
                </template>
              </el-table-column>
              <el-table-column label="类型" width="80">
                <template slot-scope="scope">
                  <span class="font_green" v-if="scope.row && scope.row.type==1">买入</span>
                  <span class="font_red" v-else>卖出</span>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="价格"></el-table-column>
              <el-table-column prop="amount" label="数量"></el-table-column>
              <el-table-column label="成交额">
                <template slot-scope="scope">
                  <span>{{scope.row.price*scope.row.amount | autoNumber}}</span>
                </template>
              </el-table-column>
              <!--<p slot="append" style="text-align:center; line-height:50px;"><a href="javascript:;" class="blue01">更多</a></p>-->
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
// import io from "socket.io-client";
import config from "@/config";
import exchangeApi from "@/api/exchange";
import baseApi from "@/api/base";
import tradingView from "./tradingView";
import vSidebar from "./sidebar.vue";
import vInformation from "./information.vue";
import socketinit from "@/common/socket.js";
import vDealhistory from "./dealhistory.vue";
// import echart from './echart';

import { mapState } from "vuex";
import { setTimeout } from "timers";

export default {
  name: "exchange",
  props: ["pair"],
  components: {
    tradingView,
    vSidebar,
    vInformation,
    vDealhistory
    // echart
  },
  data() {
    return {
      upDate: [],
      tradeAction: "exchange", //默认打开买
      tabOrderAct: "myOrders",
      value3: false, //all抵五折
      socket: null,
      balances: {}, //余额
      lastPrice: 0,
      dealHistory: [], //交易历史
      myOrders: [], //获取用户挂单
      myOrderHistory: [], //获取用户成交记录
      websock: null,
      ordersLoading: false, //挂单的loading
      tickers: {},
      depthList: {
        asks: [],
        bids: []
      },
      sellShowHide: null,
      buyShowHide: null,
      activitsDepth: "depth",
      // pair: '',
      tradeForm: {
        buy: {
          progress: 0 //滑块
        },
        sell: {
          progress: 0 //滑块
        }
      },
      tradeRules: {
        // price: [
        //     {required: true, message: '价格必填', trigger: ['change', 'blur']},
        // ],
        // amount: [
        //     {required: true, message: '数量必填', trigger: ['change', 'blur']},
        // ]
      },
      tradeType: [
        {
          title: "买入",
          index: "buy"
        },
        {
          title: "卖出",
          index: "sell"
        }
      ],
      // isConnect: false,
      isLoading: true
    };
  },
  computed: {
    ...mapState([
      "baseCoinList",
      "isLogin",
      "coins",
      "markets",
      "tickersList",
      "webTitle",
      "favicon",
      "discount"
    ]),

    // 计算可用余额
    buyBalance() {
      let coins = this.$common.getBaseCoin(this.pair),
        balance = this.balances[coins] ? this.balances[coins].available : 0; //币种数量
      return balance || 0;
    },
    sellBalance() {
      let coins = this.$common.getCoin(this.pair),
        balance = this.balances[coins] ? this.balances[coins].available : 0; //币种数量
      return balance || 0;
    }
  },
  created() {
    this.creatResultList(this.depthList);
  },
  destroyed() {
    // this.isConnect = false;
    if (this.websock) {
      this.websock.close(); //离开路由之后断开websocket连接
    }
  },

  watch: {
    pair(newVal, oldVal) {
      this.$nextTick(() => {
        //  this.tickers[this.pair]&&this.tickers[this.pair].last +" " +
        this.$route.meta.title = this.$common.toString(this.pair) + " 交易";
        try {
          let setHeight = this.$refs["buyList"].wrap.scrollHeight;
          this.$refs["buyList"].wrap.scrollTop = setHeight;
        } catch (e) {}
      });
      // 默认设置深度滚动条至底部
      this.$nextTick(() => {
        setTimeout(() => {
          let setHeight = this.$refs["buyList"].wrap.scrollHeight;

          this.$refs["buyList"].wrap.scrollTop = setHeight;

          var div = document.getElementById("buyList");
          div.scrollTop = div.scrollHeight;
        }, 300);
      });

      if (newVal && !oldVal) {
        this.initSocket();
      } else {
        this.websock.send({
          type: "unsubscibe:market",
          data: oldVal
        });

        this.websock.send({
          type: "subscibe:market",
          data: newVal
        });
      }
      this.depthList = this.$common.getJsonData(
        localStorage.getItem("depthList" + this.pair)
      ) || { asks: [], bids: [] };
      this.dealHistory =
        this.$common.getJsonData(localStorage.getItem("history" + this.pair)) ||
        [];
      this.tickers = this.$common.getJsonData(localStorage.tickers || "{}");
      this.creatResultList(this.depthList, "cache");
      //  var timer = setInterval(async()=>{
      //     let amount = Math.random();
      //     let price = Math.ceil(Math.random()*20)+10;
      //     let type = Math.round(Math.random())==0?1:-1;
      //     console.log(this.pair, price, amount, type)
      //     try{
      //         let result = await exchangeApi.marketOrder(amount, this.pair, price, type);
      //     }catch(e){
      //         console.error(e)
      //     }
      // }, 1000)
    }
  },
  mounted() {
    if (this.pair) {
      this.initSocket();
    }
  },
  methods: {
    tradeFee(type) {
      if (!type) return;
      let pair = this.pair;
      if (!this.markets || this.markets.length == 0) return "--%";
      for (let item of this.markets) {
        if (
          item.coin == this.$common.getCoin(pair) &&
          item.base == this.$common.getBaseCoin(pair)
        ) {
          if (!item[type] && item[type] != 0) return "--%";

          if (this.discount) {
            let discount = String(this.discount);
            let fee = String(item[type]);

            if (discount.indexOf("%") != -1) {
              discount = Number(discount.split("%")[0]) / 100;
            } else {
              discount = Number(discount);
            }

            if (fee.indexOf("%") != -1) {
              fee = Number(fee.split("%")[0]) / 100;
            } else {
              fee = Number(fee);
            }
            if (!isNaN(discount) && !isNaN(fee)) {
              return this.$common.autoFixed(fee * discount * 100) + "%";
            } else {
              return item[type];
            }
          } else {
            return item[type];
          }
        }
      }
    },
    setDepthType(type) {
      this.activitsDepth = type;
      if (type == "buy") {
        this.sellShowHide = "hideHieght";
        this.buyShowHide = "showSell";
      } else if (type == "sell") {
        this.sellShowHide = "showSell";
        this.buyShowHide = "hideHieght";
      } else if (type == "depth") {
        this.sellShowHide = null;
        this.buyShowHide = null;
      }
      this.$nextTick(() => {
        setTimeout(() => {
          let setHeight = this.$refs["buyList"].wrap.scrollHeight;
          this.$refs["buyList"].wrap.scrollTop = setHeight;
        }, 300);
      });
    },
    getTotal(index) {
      let total = (
        this.tradeForm[index].price * this.tradeForm[index].amount
      ).toFixed(8);
      if (isNaN(total)) total = 0;
      return total;
    },
    creatResultList(data, type) {
      this.depthList = {};

      for (let item in data) {
        this.depthList[item] = [];
        let dataArr = {};
        dataArr[item] = data[item];

        let listArr = [];
        // let listNumber = (dataArr.length > 5) ? dataArr.length : 5;
        let listNumber = 40;
        // console.log(dataArr)
        for (let i = 0; i < listNumber; i++) {
          if (dataArr[item][i]) {
            let vol = dataArr[item][i].price * dataArr[item][i].amount;
            let from = "";
            if (dataArr[item][i].from) {
              from = dataArr[item][i].from;
            } else if (!dataArr[item][i].from && !type) {
              from = "favicon";
            }
            listArr.push({
              amount: dataArr[item][i].amount,
              price: dataArr[item][i].price,
              vol: isNaN(vol) ? "--" : vol,
              width: dataArr[item][i].width,
              from: from
            });
          } else {
            listArr.push({
              amount: "--",
              price: "--",
              vol: "--",
              width: 1,
              from: ""
            });
          }
        }
        this.depthList[item] = listArr;
      }
      if (this.depthList["asks"] && !type) {
        this.depthList["asks"].reverse();
      }
    },
    initSocket() {
      this.websock = new socketinit.Socket(
        config.socketUrl,
        e => {
          this.websock.send({
            type: "subscibe:market",
            data: this.pair
          });
        },
        e => {
          let data = JSON.parse(e.data);

          switch (data.type) {
            //余额
            case "market:balances":
              this.balances = data.data;
              break;
            //tickers
            case "market:tickers":
              this.tickers = data.data;
              this.$store.commit("setTickers", data.data);
              this.$nextTick(() => {
                document.title =
                  this.tickers[this.pair] &&
                  this.tickers[this.pair].last +
                    " " +
                    this.$common.toString(this.pair) +
                    " 交易-" +
                    this.webTitle;
              });
              localStorage.setItem("tickers", JSON.stringify(this.tickers));
              break;
            //market:ticker:update
            case "market:ticker:update":
              let info = data.data;
              info.class = true;
              for (let i in this.tickers) {
                this.tickers[i].class = null;
                if (i == info.market) {
                  this.$set(this.tickers, i, info);
                  this.tickers[i] = info;
                }
              }
              setTimeout(() => {
                this.tickers[info.market].class = false;
                this.$store.commit("setTickers", this.tickers);
              }, 2000);

              // this.tickers = data.data;
              this.$nextTick(() => {
                document.title =
                  this.tickers[this.pair] &&
                  this.tickers[this.pair].last +
                    " " +
                    this.$common.toString(this.pair) +
                    " 交易-" +
                    this.webTitle;
              });
              this.$store.commit("setTickers", this.tickers);
              localStorage.setItem("tickers", JSON.stringify(this.tickers));
              // this.$common.setPrices();
              break;
            //深度数据
            case "market:depth":
              let type = false,
                height = "",
                scrollHeight = "",
                Top = "";
              // 数据更改前获取高度
              try {
                height = this.$refs["buyList"].wrap.clientHeight;
                scrollHeight = this.$refs["buyList"].wrap.scrollHeight;
                Top = this.$refs["buyList"].wrap.scrollTop;

                if (Math.abs(scrollHeight - height - Top) <= 1) {
                  type = true;
                } else {
                  type = false;
                }
              } catch (e) {}

              this.depthList.bids = data.data.bids || [];
              this.depthList.asks = data.data.asks || [];
              this.tt(this.depthList.asks, this.depthList.bids);
              this.creatResultList(this.depthList);

              localStorage.setItem(
                "depthList" + this.pair,
                JSON.stringify(this.depthList)
              );
              try {
                console.log(type);
                // 设置滚动条到底部
                if (type) {
                  setTimeout(() => {
                    height = this.$refs["buyList"].wrap.scrollHeight;
                    this.$refs["buyList"].wrap.scrollTop = height;
                    var div = document.getElementById("buyList");
                    div.scrollTop = div.scrollHeight;
                    // console.log('height' + this.$refs['buyList'].wrap.scrollTop)
                  }, 0);
                }
              } catch (e) {}

              break;

            //最新成交
            case "market:orderHistory":
              this.dealHistory = data.data;
              localStorage.setItem(
                "history" + this.pair,
                JSON.stringify(this.dealHistory)
              );
              break;
            //最新成交更新单条
            case "market:history:add":
              try {
                this.dealHistory.unshift(data.data);
              } catch (e) {
                console.log(e);
              }

              localStorage.setItem(
                "history" + this.pair,
                JSON.stringify(this.dealHistory)
              );
              break;
            //我的挂单
            case "market:myOrders":
              this.myOrders = data.data;
              break;
            //我的成交记录
            case "market:myOrderHistory":
              this.myOrderHistory = data.data || [];
              break;
          }
        }
      );
    },
    // 箭头
    dnArrow(item) {
      if (item && item.class) {
        if (item.change >= 0) {
          return " el-icon-caret-top dnArrow ";
        } else {
          return " el-icon-caret-bottom dnArrow ";
        }
      }
    },
    addTdClass(row, column) {
      return "last-order-row";
    },
    changePrice(e) {
      // try {
      let coin = this.$common.getCoin(this.pair);
      let length = 8;
      let price = parseFloat(this.tradeForm[e].price);

      if (this.coins[coin] && this.coins[coin].length) {
        length = this.coins[coin].length;
      }

      let x = String(price).indexOf(".") + 1; //小数点的位置
      let y = String(price).length - x; //小数的位数

      if (String(price).indexOf(".") != -1) {
        if (y > length) {
          setTimeout(() => {
            this.$set(this.tradeForm[e], "price", price.toFixed(length));
          }, 200);
        }
        console.log("num有" + x, y + "位小数");
      }
    },
    changeAmount(i) {
      let coin = this.$common.getCoin(this.pair);
      let length = 8;
      let price = parseFloat(this.tradeForm[i].amount);

      if (price.toString().split(".")[1]) {
        console.log(price.toString().split(".")[1].length);
      }

      // if()
    },
    // 获取币余额
    async getBalances() {
      try {
        let result = await baseApi.getAccMoney();
        this.balances = result.data;
      } catch (e) {}
    },
    // 滑块
    rangeSell(type) {
      if (type === "buy") {
        if (!this.tradeForm[type].price)
          return this.$set(this.tradeForm[type], "amount", 0);
        this.$set(
          this.tradeForm[type],
          "amount",
          (
            ((this.buyBalance * this.tradeForm[type].progress) / 100).toFixed(
              8
            ) / this.tradeForm[type].price
          ).toFixed(8)
        );
      } else {
        this.$set(
          this.tradeForm[type],
          "amount",
          ((this.sellBalance * this.tradeForm[type].progress) / 100).toFixed(8)
        );
      }
    },
    //排序方法
    compare(property) {
      return function(a, b) {
        let value1 = a[property];
        let value2 = b[property];
        return value2 - value1;
      };
    },
    // 点击传值
    toValue(price, amount) {
      console.log(price, amount);
      for (let item of this.tradeType) {
        this.$set(
          this.tradeForm[item.index],
          "price",
          this.$common.toNumber(price)
        );
        this.$set(
          this.tradeForm[item.index],
          "amount",
          this.$common.toNumber(amount)
        );
      }
    },
    // 切换挂单以及成交记录
    tabOrders(tab, event) {
      // if (tab.name == 'myOrders') {
      //     this.marketMyOrders();//用户挂单
      // } else {
      //     this.getmyOrderHistory();//获取用户交易历史
      // }
    },
    // 切换买卖窗口
    handleClick(tab, event) {
      // this.tradeForm.progress = 0
    },
    //买卖
    trade(type) {
      // 操作前，若未登录跳转去登录
      if (!this.$store.state.isLogin()) {
        this.$router.push({
          path: "/login"
        });
        return;
      }
      if (!this.tradeForm[type].price || !this.tradeForm[type].amount) return;

      //提交的数据
      let data = {
        pair: this.pair,
        price: this.tradeForm[type].price,
        count: this.tradeForm[type].amount
      };
      // 读取手续费
      for (let item of this.markets) {
        let base = this.$common.getBaseCoin(this.pair);
        let coin = this.$common.getCoin(this.pair);
        if (item.coin == coin && item.base == base) {
          data.fee = item.fee || "";
        }
      }

      let Tips = "",
        num = 1,
        fee = "",
        pair = "";
      if (type == "buy") {
        Tips = "买入";
        num = 1;
        fee = data.count * data.fee;
        pair = this.$common.getCoin(data.pair);
      } else {
        num = -1;
        Tips = "卖出";
        fee = data.price * data.count * data.fee;
        pair = this.$common.getBaseCoin(data.pair);
      }
      // <p>手续费：${fee} ${pair}</p>
      let confirmHtml = `<div>
                    <p>${Tips}价格：${data.price} ${this.$common.getBaseCoin(
        data.pair
      )}</p>
                    <p>${Tips}数量：${data.count} ${this.$common.getCoin(
        data.pair
      )}</p>
                    <p>${Tips}资金：${this.$common.autoFixed(
        data.price * data.count
      )} ${this.$common.getBaseCoin(data.pair)}</p>
                  
                    <p class="font_red">警告：当前为 ${this.$common.getBaseCoin(
                      data.pair
                    )}交易对，挂错价格，成功后将无法取消。</p>
                </div>`;

      this.$confirm(confirmHtml, "确定" + Tips + "订单?", {
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          this.trades(data, num);
        })
        .catch(_ => {});
    },
    // 确认买入\卖出操作 /* typeNum = -1  卖出  / 1买入 */
    async trades(data, typeNum) {
      let type = typeNum,
        amount = data.count,
        price = data.price,
        market = this.pair;
      try {
        let result = await exchangeApi.marketOrder(amount, market, price, type);
        let data = {};
        data = result.data;

        // 成功之后将数据插入记录中
        if (data && data.pedding) {
          //挂单记录
          this.marketMyOrders();
          //
          // data.pedding.id = data.id;
          // this.myOrders.unshift(data.pedding);
        } else if (data && data.history) {
          //成交记录
          this.getmyOrderHistory();
          // for (let i of data.history) {
          //     this.myOrderHistory.unshift(i)
          // }
        }
        // 提交之后刷新余额
        this.getBalances();

        this.$notify.success(this.$t("提交成功"));
      } catch (e) {}
    },
    // 取消挂单
    async cancelOrder(id) {
      // this.$confirm('你确定取消吗？').then(async () => {
      try {
        let result = await exchangeApi.marketCancel(id);
        this.marketMyOrders();
        this.getBalances(); //取消之后获取余额
        this.$notify.success("取消成功");
      } catch (e) {}
      // }).catch(() => {

      // })
    },
    // // 获取用户挂单
    async marketMyOrders() {
      this.ordersLoading = true;
      let data = {
        market: this.pair
      };
      try {
        let result = await exchangeApi.marketMyOrders(data);
        this.ordersLoading = false;
        this.myOrders = result.data;
      } catch (e) {}
    },
    // 获取用户交易历史
    async getmyOrderHistory() {
      this.ordersLoading = true;
      let data = {
        market: this.pair
      };
      try {
        let result = await exchangeApi.myOrderHistory(data);
        this.ordersLoading = false;
        this.myOrderHistory = result.data;
      } catch (e) {}
    },
    //交易量背景
    tt(e, t) {
      //组合排序
      let sort = function(a) {
        a.sort(function(e, t) {
          return e.amount - t.amount;
        });
        return a;
      };
      let medianUnit = function(e) {
        if (e.length == 0) return 1;
        let t = Math.floor((e.length / 3) * 2);
        return e[t].amount < 1 ? 1 : e[t].amount;
      };
      let width = function(e, t) {
        if (t == 0) return 1;
        let n = Math.round(Number(e) / t);
        if (isNaN(n)) n = 0;
        return n <= 0 ? 1 : n > 160 ? 160 : n;
      };

      let i = e.concat(t);
      let s = medianUnit(sort(i)) / 48;
      e.forEach(e => {
        e.width = width(e.amount, s);
      });
      t.forEach(function(t) {
        t.width = width(t.amount, s);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.exchange {
  position: relative;
  /deep/ .el-table::before {
    display: none;
  }
  // overflow: hidden;
  .trade_main {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    justify-content: space-between;
    height: 800px;
    .depth-main {
      width: 300px;
      flex: none;
      // background-color: #ddd;
      overflow: hidden;
      border-radius: 4px;
      -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04),
        0 5px 10px 0 rgba(54, 54, 77, 0.1);
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04),
        0 5px 10px 0 rgba(54, 54, 77, 0.1);
      .depth {
        height: 100%;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        .list {
          overflow: hidden;
          padding: 0;
          flex: auto;
          height: 100%;
          //   position:relative;
          .list_content {
            // width:100%;
            // position:absolute;
            height: 100%;
            overflow: hidden;
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-flex-direction: column;
            -ms-flex-direction: column;
            flex-direction: column;
            -webkit-box-pack: justify;
            -webkit-justify-content: space-between;
            -ms-flex-pack: justify;
            justify-content: space-between;
          }
        }
        .depth-head {
          padding-left: 10px;
          height: 45px;
          // background-color: $light-blue;
          // border-bottom: 1px solid #ebeef5;
          line-height: 45px;
          flex: none;
          button {
            margin-left: 0px;
          }
        }
        .showSell {
          height: 100%;
          flex: auto;
          transition: all 0.5s 0s;
          // overflow: hidden;
        }
        .hideHieght {
          height: 0;
          display: none;
          transition: all 0.5s 0s;
        }
      }
    }

    .exchange_main {
      /*background-color: #fff;*/
      /*padding: 0 10px;*/
      flex: auto;
      margin: 0 8px;
      min-width: 620px;
      .trading {
        height: 100%;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .trading-chart {
          // background-color: #fff;
          -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04),
            0 5px 10px 0 rgba(54, 54, 77, 0.1);
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04),
            0 5px 10px 0 rgba(54, 54, 77, 0.1);
          // overflow: hidden;
          border-radius: 4px;
          .exchange-ticker {
            height: 45px;
            // background-color: $light-blue;
            padding-left: 10px;
            // border-bottom: 1px solid #ebeef5;
            // overflow: hidden;
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            flex-direction: row;
            align-content: center;
            flex-wrap: nowrap;
            align-items: center;
            position: relative;
            dt.select-market {
              cursor: pointer;
              span {
                font-weight: bold;
                font-size: 16px;
                margin-right: 15px;
                vertical-align: middle;
                padding-right: 10px;
                display: inline-block;
                // border-right: 1px solid #ddd;
                img {
                  padding-right: 5px;
                  vertical-align: text-bottom;
                  width: 20px;
                  height: 20px;
                }
              }
              .market_ticker {
                position: absolute;
                left: 0;
                top: 46px;
                width: 100%;
                height: 0;
                overflow-y: hidden;
                padding-bottom: 15px;
                //  height: calc(100% - 46px);
                // background-color: #fff;
                // border: 1px solid #ebeef5;
                display: block;
                visibility: hidden;
                transition: all 0.3s;
                z-index: 999;
              }
            }
            .select-market:hover {
              .market_ticker {
                height: 500px;
                -webkit-box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.16),
                  0 2px 8px 0 rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.08);
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.16),
                  0 2px 8px 0 rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.08);
                visibility: visible;
              }
              .select_icon {
                transform: rotate(180deg);
              }
            }

            dd {
              margin-right: 20px;
              span {
                display: block;
                font-size: 12px;
                // color: $text-gray;
              }
              p {
                // font-family: Roboto, sans-serif;
                font-size: 14px;
                display: inline;
                // color: #333;
              }
            }
            @media screen and (max-width: 1400px) {
              dd {
                margin-right: 10px;
                p {
                  font-size: 12px !important;
                }
              }
              dd.first strong {
                font-size: 20px !important;
              }
              dt.select-market {
                span {
                  margin-right: 10px !important;
                }
              }
            }

            dd.first {
              line-height: 1;
              margin-right: 10px;
            }

            dd.first strong {
              font-size: 26px;
              font-weight: 700;
            }

            dd.first span {
              display: inline-block;
              font-size: 14px;
              vertical-align: 2px;
            }
            dd.book-icon {
              position: absolute;
              right: 0;
            }
          }
        }
        .trade-form {
          margin-top: 8px;
          flex: auto;
          // background-color: #fff;
          height: 100%;
          overflow: hidden;
          border-radius: 4px;
          -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04),
            0 5px 10px 0 rgba(54, 54, 77, 0.1);
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04),
            0 5px 10px 0 rgba(54, 54, 77, 0.1);
          .trade_form {
            .trade-form-head {
              h3 {
                font-size: 12px;
                padding: 5px 0;
              }
            }
            .trade-form-btn {
              font-size: 16px;
              font-weight: bold;
            }
            .childElements_left {
              // color: #555;
            }
          }
        }
      }
    }
    .last-price-main {
      width: 300px;
      flex: none;
      background-color: #fff;
      overflow: hidden;
      border-radius: 4px;
      -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04),
        0 5px 10px 0 rgba(54, 54, 77, 0.1);
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04),
        0 5px 10px 0 rgba(54, 54, 77, 0.1);
    }
  }
  .exchange-orders {
    // background-color: #fff;
    margin-top: 10px;
    padding: 10px;
    overflow: hidden;
    border-radius: 4px;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04),
      0 5px 10px 0 rgba(54, 54, 77, 0.1);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04),
      0 5px 10px 0 rgba(54, 54, 77, 0.1);
  }
}

.exchange .trade-form {
  /deep/ .el-tabs__nav {
    height: 50px;
  }
  /deep/ .el-tabs__header {
    margin-bottom: 0 !important;
  }
  /deep/ .trade_card {
    height: 100%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    /*background-color: rgba(125, 138, 164, .1);*/
    position: relative;
  }
  /deep/ .el-tabs__item.is-active {
    font-weight: bold;
  }
}

/*箭头*/
.caret {
  display: inline-block;
  width: 15px;
  height: 15px;
  font-size: 20px;
  opacity: 0;
  -webkit-transition: opacity 0.5s;
  -moz-transition: opacity 0.5s;
  transition: opacity 0.5s;
}

.caret.dnArrow {
  opacity: 1 !important;
}

.trade_form {
  // max-width: 500px;
  margin: auto;
  padding: 0 10px;
  position: relative;
  /deep/ .el-form-item__error {
    right: 0;
    left: auto;
  }
  /deep/ .el-form-item {
    margin-bottom: 10px !important;
  }
}

.trade_form:first-child:after {
  content: "";
  // height: 100%;
  // border-right: 1px #d2d9dc dashed;
  position: absolute;
  top: 0;
  right: 0;
  margin: 50px 0;
  height: calc(100% - 100px);
}

.exchange /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}

.shape_btn {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 99999;
  top: 50%;
  left: 50%;
}

.shape_wrap {
  position: absolute;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  opacity: 0.4;
}

.tradeForm /deep/ input {
  text-align: right;
  /*direction: rtl !important;*/
}

/*.myOrders , .myOrderHistory {*/
/*max-height: 500px;*/
/*overflow-y: auto*/
/*}*/

.depthBg {
  position: absolute;
  right: 0;
  top: 0;
  width: 0;
  /*height: 100%;*/
  height: 22px;
  opacity: 0.1;
  transition: width 0.5s linear;
  -moz-transition: width 0.5s linear; /* Firefox 4 */
  -webkit-transition: width 0.5s linear; /* Safari and Chrome */
  -o-transition: width 0.5s linear; /* Opera */
}

.sellBg {
  background-color: &text-red;
}

.buyBg {
  background-color: &text-green;
}

.box-card .el-card__body {
  padding: 15px !important;
}

.el-card__header {
  padding: 15px !important;
}

.el-tabs__active-bar .el-tabs__item {
  font-weight: bold !important;
}

.el-tabs--border-card {
  box-shadow: 1px 1px 1px #e5e5e5;
}

.trade_main {
  /*min-height: 100vh;*/
}

.exchange_top {
  padding: 15px 0;
}

.trade_data > div {
  border: 1px solid #ebeef5;
  padding: 15px 0;
  text-align: center;
  height: 66px;
  white-space: normal;
}

.k_line {
  /*min-height: 360px;*/
  height: 400px;
  /*background-color: #f6f6f6;*/
  /*margin-top: 10px;*/
}

.trade_dataTitle {
  color: #909399;
  padding: 10px 15px 0;
  height: 20px;
  overflow: hidden;
  line-height: 20px;
  font-size: 12px;
  flex: none;
  // border-bottom: 1px solid #ebeef5;
}

.trade-form .el-card {
  border-radius: 0 !important;
}

.margin {
  margin: 15px 0;
}

.myapp-plain-table {
  display: block;
  //   min-height:336px;
  overflow-y: auto;
  transition: all 0.5s 0s;
  // border-bottom: 1px solid #ebeef5;
}

.myapp-plain-table ul li {
  font-family: Roboto, sans-serif;
  font-size: 12px;
  line-height: 21px;
  height: 21px;
  position: relative;
  padding: 0;
  white-space: nowrap;
  /*color: #909399;*/
  cursor: pointer;
  i.fromlogo {
    width: 14px;
    height: 14px;
    padding: 0 1px 0 3px;
    display: inline-block;
    vertical-align: sub;
  }
  i.fromlogo > img {
    width: 100%;
  }
  // img.fromlogo::after{
  //   background-color:transparent;
  // }
}

// .myapp-plain-table ul li:hover {
//   background-color: #f2f3f8;
// }

.news_price {
  height: 50px;
  box-shadow: 0 0 42px 0 rgba(9, 30, 55, 0.06);
  text-align: center;
  line-height: 50px;
  font-size: 16px;
  flex: none;
  // small {
  //   color: #909399;
  // }
  // font-weight: bold;
  /*background-color: #Eee;*/
}
</style>
