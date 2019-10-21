<template>
  <div class="dice At_the_bottom">
    <v-loading v-if="form.loading" :showNum="showNum"></v-loading>

    <div class="container">
      <!-- 资金信息 -->
      <v-top :money="money"></v-top>
      <!-- 游戏主体 -->
      <div class="game-dice">
        <div class="game-main">
          <div class="game-main-top">
            <el-card class="box-card" shadow="never">
              <!-- <div slot="header" class="clearfix"></div> -->
              <div>
                <el-form ref="form" :rules="rules" :model="form">
                  <el-form-item label="当前币种">
                    <el-input
                      :value="'余额: '+form.balance+' '+form.coin"
                      disabled
                      class="input-with-select balance"
                    >
                      <div slot="prepend">
                        <img class="childElements_left" :src="getCoinIcon(form.coin)" alt="coin" />
                        <el-select style="width:200px;" @change="selectCoin" v-model="form.coin">
                          <el-option
                            v-for="(v,k) in coins"
                            :key="k"
                            :label="v.coin"
                            :value="v.coin"
                          ></el-option>
                        </el-select>
                      </div>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="amount" label="投注金额">
                    <el-row :gutter="10">
                      <el-col :span="14" class="parentElement">
                        <img
                          class="childElements_left"
                          style="left:15px;"
                          :src="getCoinIcon(form.coin)"
                          alt
                        />
                        <el-input ref="amountInput" v-model="form.amount"></el-input>
                        <span
                          class="childElements_right"
                          style="right:15px;color:white;"
                        >{{form.coin}}</span>
                      </el-col>
                      <el-col :span="10">
                        <div class="btn_group">
                          <el-button @click="getHalfBets">1/2</el-button>
                          <el-button @click="getDoubleBets">2X</el-button>
                          <el-button @click="getMaxBets">MAX</el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="赢取金额" class="parentElement">
                    <img class="childElements_left" :src="getCoinIcon(form.coin)" alt />
                    <el-input disabled v-model="form.winAmount"></el-input>
                    <span class="childElements_right" style="right:15px;color:white;">{{form.coin}}</span>
                  </el-form-item>
                  <el-form-item label>
                    <div class="slider-block">
                      <el-slider
                        v-model="form.rangeValue"
                        :min="1"
                        :max="100"
                        @input="onRangeChange"
                        :show-tooltip="false"
                        range
                        :marks="marks"
                      ></el-slider>
                    </div>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      class="btn-block"
                      type="primary"
                      :loading="form.loading"
                      @click="goBets('form')"
                    >投骰子</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </div>
          <div class="game-main-bottom">
            <ul class="returns">
              <li>
                <h3>获胜</h3>
                <span>{{form['rangeValue'][0]}} <=点数< {{form['rangeValue'][1]}}</span>
              </li>
              <li>
                <h3>赔率</h3>
                <span>{{getOdd}}X</span>
              </li>
              <li>
                <h3>中奖概率</h3>
                <span>{{odd}}%</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="history">
          <el-card class="box-card" shadow="never">
            <!-- <div slot="header" class="clearfix">
              <span>卡片名称</span>
            </div>-->
            <v-history :recordList="recordList" :myRecord="myRecordList"></v-history>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import vHead from "./header";
import diceApi from "@/api/dice";
import baseApi from "@/api/base";
import vHistory from "./history";
import vLoading from "./loading";
import vTop from "./top";
import config from "@/config";
import { mapState } from "vuex";
import socketinit from "@/common/socket.js";

export default {
  data() {
    let validCaptcha = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("金额不能为空"));
      }
      //限制金额
      let msg = "";
      if (this.initData.maxBet > this.form.balance) {
        if (this.form.amount > this.form.balance) {
          msg =
            "不能超出余额:" + this.$tools.util.toFixed(this.form.balance, 4);
        }
      } else {
        if (this.form.amount > this.initData.maxBet) {
          msg =
            "不能大于最大投注:" +
            this.$tools.util.toFixed(this.initData.maxBet, 4);
        } else if (this.form.amount < this.initData.minBet) {
          msg =
            "不能小于最小投注:" +
            this.$tools.util.toFixed(this.initData.minBet, 4);
        }
      }
      if (msg) {
        callback(new Error(msg));
      } else {
        callback();
      }
    };

    return {
      form: {
        rangeValue: [1, 50],
        amount: 0,
        balance: 0
      },
      timeer: null,
      initData: {},
      socket: null,
      showNum: "",
      recordList: [], //所有投注
      myRecordList: [], //我的投注
      money: [{}, {}],
      coins: {}, //币种列表
      resultList: [],
      rules: {
        amount: [{ validator: validCaptcha, trigger: ["change"] }]
      }
    };
  },
  components: {
    vTop,
    vHistory,
    vLoading
  },
  computed: {
    ...mapState(["uid"]),
    marks() {
      let a = {
        min: 1
      };
      for (let item of this.form.rangeValue) {
        a[item] = String(item);
      }
      return a;
    },
    //赔率
    getOdd() {
      let odd = this.$tools.util.toFixed(
        99 / parseFloat(this.form.rangeValue[1] - this.form.rangeValue[0]),
        2
      );
      // 赢取金额
      this.$set(
        this.form,
        "winAmount",
        this.$tools.util.toFixed(this.form.amount * odd, 8)
      );
      return odd;
    },
    odd() {
      //中奖概率
      return this.form.rangeValue[1] - this.form.rangeValue[0];
    }
  },
  watch: {
    "form.coin"(newVal, oldVal) {
      if (newVal && !oldVal) {
        // this.initSocket();
      } else if (newVal && oldVal) {
        this.socket.send({
          type: "leave",
          data: oldVal
        });

        this.socket.send({
          type: "init",
          data: this.form.coin
        });
      }
    }
  },
  mounted() {
    this.getCoins();
    this.$set(this.form, "coin", localStorage.getItem("diceCoin") || "");
    this.initSocket();
    this.$nextTick(() => {
      this.$refs.amountInput.focus();
    });
  },
  methods: {
    // 初始化socket
    initSocket() {
      this.socket = new socketinit.Socket(
        config.wsdiceUrl,
        e => {
          this.socket.send({
            type: "init",
            data: this.form.coin
          });
        },
        e => {
          let res = JSON.parse(e.data);
          switch (res.type) {
            // case "open":
            // 	uni.sendSocketMessage({data:JSON.stringify({type:"init", data:this.currentCoin})});
            // 	break;
            case "init":
              this.initData = res.data;
              // this.amount = this.initData["minBet"];
              this.form.amount = this.initData["minBet"];
              let datas = res.data;
              datas["type"] = "网站";
              this.$set(this.money, 0, datas);
              break;
            case "my":
              this.$set(this.form, "balance", res.data.balance || 0);
              let data = res.data;
              data["type"] = "我的";
              // this.money[1] = data;
              this.$set(this.money, 1, data);
              break;
            case "result":
              this.recordList = res.data;
              break;
            case "roll":
              this.recordList.unshift(res.data);

              if (res.data && res.data["uid"] == this.uid) {
                this.myRecordList = res.data;
              }
              break;
          }
        }
      );
    },

    selectCoin(item) {
      localStorage.setItem("diceCoin", item);
      this.getBalance(item);
    },
    async getCoins() {
      try {
        let result = await diceApi.getCoins();
        this.coins = result.data;
        if (this.coins[0] && !this.form["coin"]) {
          this.$set(this.form, "coin", this.coins[0].coin);
        }
        this.getBalance(this.form.coin);
      } catch (e) {}
    },

    //双向滑动
    onRangeChange(e) {
      let maxValue = e[1];
      let minValue = e[0];
      if (maxValue - minValue < 2) {
        if (maxValue + 2 > 100) {
          minValue = parseFloat(minValue) - 2;
        } else {
          maxValue = parseFloat(maxValue) + 2;
        }
      } else if (maxValue - minValue == 99) {
        maxValue = parseFloat(maxValue) - 1;
      }
      this.$set(this.form, "rangeValue", [minValue, maxValue]);
    },
    //获取1/2投注额
    getHalfBets() {
      this.$set(
        this.form,
        "amount",
        this.$tools.util.toFixed(this.form.amount / 2, 4)
      );
    },
    //获取最大投注额 余额大于最大投注额,取最大投注额,反之取余额
    getMaxBets() {
      let amount =
        this.form.balance > this.initData.maxBet
          ? this.$tools.util.toFixed(this.initData.maxBet, 4)
          : this.$tools.util.toFixed(this.form.balance, 4);
      this.$set(this.form, "amount", amount);
    },
    //获取2倍投注额
    getDoubleBets() {
      if (this.form.amount * 2 > this.form.balance) {
        //2倍如果大于余额
        if (this.form.amount * 2 > this.initData.maxBet) {
          //2倍大于最大投注额，取最大投注额
          this.form.amount = this.$tools.util.toFixed(this.initData.maxBet, 4);
        } else {
          //2倍小于最大投注额，取余额
          this.form.amount = this.$tools.util.toFixed(this.form.balance, 4);
        }
      } else {
        this.form.amount = this.$tools.util.toFixed(this.form.amount * 2, 4);
        // 如果大于最大，则取最大
        if (this.form.amount > this.form.balance) {
          this.form.amount = this.$tools.util.toFixed(this.form.balance, 4);
        }
      }
    },
    //动画
    getRandom(m, n) {
      if (this.timeer) clearInterval(this.timeer);
      this.timeer = setInterval(() => {
        this.showNum = Math.floor(Math.random() * (m - n) + n);
      }, 100);
    },
    async getBalance(coin) {
      if (coin) {
        let balance = 0;
        this.$set(this.form, "balance", balance);
        try {
          let res = await baseApi.getBalance(coin);
          balance = (res.data && res.data["available"]) || 0;
          this.$set(this.form, "balance", balance);
        } catch (e) {}
      }
    },
    // 投骰子
    async goBets(formName) {
      this.$refs[formName].validate(async valid => {
        //验证通过就执行登录
        if (valid) {
          this.$set(this.form, "loading", true);
          this.getRandom(1, 100);
          try {
            let data = await diceApi.roll({
              coin: this.form.coin,
              amount: this.form.amount,
              max: this.form.rangeValue[1],
              min: this.form.rangeValue[0]
            });
            clearInterval(this.timeer);
            data = data.data;
            this.$set(this.form, "balance", data.balance);
            //显示最后一个结果
            this.showNum = parseInt(data.lucky);
            setTimeout(() => {
              this.$set(this.form, "loading", false);
              if (data.isWin) {
                this.$message.success(
                  "赢 " + data.profit + " " + this.form.coin
                );
              } else {
                this.$message.error("输 " + data.bet + " " + this.form.coin);
              }
            }, 300);
          } catch (e) {
            clearInterval(this.timeer);
            this.$set(this.form, "loading", false);
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$bg-color: transparent;
$primary-color: #ffbc06; //主要颜色

.dice.At_the_bottom {
  overflow: inherit !important;
}
.parentElement {
  /*按钮定位到某个上面*/
  position: relative;
}
.el-button--text {
  color: $primary-color !important;
}
.parentElement .childElements_right {
  position: absolute;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.parentElement .childElements_left {
  position: absolute;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

// 定位币种图片
.parentElement /deep/ .el-input__inner {
  padding-left: 50px;
  padding-right: 60px;
}

.childElements_left {
  position: absolute;
  width: 30px;
  z-index: 99;
  left: 10px;
}
// 滑块
.slider-block {
  text-align: left;
  border-radius: 50px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.2);
}
//dice
.dice {
  /deep/ .el-form-item__error {
    color: #ff2247 !important;
    font-size: 16px;
  }
  /deep/ .is-disabled .el-select {
    .el-input__icon {
      cursor: pointer;
    }
    .el-input__inner {
      cursor: pointer;
    }
  }

  /deep/ .is-disabled .el-input__inner {
    cursor: auto;
    color: #c0c4cc !important;
  }
  /deep/ .balance {
    .el-input__inner {
      color: $primary-color !important;
      font-size: 16px;
    }
  }

  // margin-top: 30px;
  /deep/ .el-form-item__label {
    color: #fff;
    float: none;
  }
  /deep/ .el-card {
    background-color: transparent;
    border: none;
    .el-card__header {
      color: #fff;
      border: none;
    }
  }
  /deep/ .el-slider__marks-text {
    color: #fff;
  }
  /deep/ .el-table th,
  /deep/ .el-table tr {
    background-color: transparent;
    color: #fff;
  }
  /deep/ .el-table__empty-text {
    color: #fff;
    opacity: 0.5;
  }
  /deep/ .el-tabs__item {
    color: #fff;
  }
  /deep/ .el-tabs__item.is-active {
    color: $primary-color;
  }
  /deep/ .el-tabs__active-bar {
    background-color: $primary-color;
  }
  /deep/ .el-input__inner {
    background-color: rgba(255, 255, 255, 0.25) !important;
    border: none !important;
    color: #fff;
    height: 50px !important;
    text-align: center;
    font-size: 16px;
  }
  /deep/ .el-table,
  /deep/ .el-table__expanded-cell {
    background-color: transparent;
  }
  /deep/ .el-table td,
  /deep/ .el-table th.is-leaf {
    border: none;
  }
  /deep/ .el-table::before {
    background-color: transparent;
  }
  /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: transparent;
  }
  /deep/ .el-input-group__append,
  /deep/ .el-input-group__prepend {
    background-color: transparent;
    border: none;
    color: #fff;
  }
  /deep/ .el-input-group__prepend div.el-select .el-input__inner {
    padding-left: 50px;
  }
  /deep/ .el-select .el-input .el-select__caret {
    color: #fff;
  }
  /deep/ .el-slider__runway {
    background-color: #eb4d5c;
  }
  /deep/ .el-slider__bar {
    background-color: #00e403;
  }
  /deep/ .el-slider__button {
    border-color: #fff !important;
    background-color: #fff !important;
    box-shadow: 0 0 3px 2px rgba(227, 229, 241, 0.5);
  }
}
.dice {
  .game-dice {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 650px;
    .game-main {
      flex: auto;
      height: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .game-main-top {
        border-radius: 4px;
        box-shadow: -8px 8px 50px 0 rgba(0, 0, 0, 0.2);
        background-color: $bg-color;
        /deep/ .el-card__header {
          padding: 0;
        }
        // background-color:rgba(255,255,255,.12);
        .btn-block {
          display: block;
          width: 100%;
          height: 50px;
          margin-top: 20px;
          background-color: $primary-color;
          border-color: $primary-color;
          color: #fff;
          font-size: 20px;
        }
      }
      .game-main-bottom {
        flex: auto;
        margin-top: 15px;
        .returns {
          height: 100%;
          display: flex;
          justify-content: space-between;
          li {
            flex: 1;
            box-shadow: -8px 8px 50px 0 rgba(0, 0, 0, 0.2);
            text-align: center;
            //   background-color:rgba(255,255,255,.12);
            background-color: $bg-color;
            h3 {
              margin-bottom: 10px;
              margin-top: 30px;
              font-family: "San Francisco Display Thin";
              font-weight: 200;
              font-size: 18px;
              color: #fff;
            }
            span {
              display: block;
              line-height: 50px;
              color: $primary-color;
              font-family: "Tex Gyre Cursor";
              font-weight: 200;
              font-size: 30px;
            }
          }
          li:not(:first-child) {
            margin-left: 15px;
          }
        }
      }
    }
    .history {
      flex: none;
      width: 350px;
      background-color: $bg-color;
      // background-color: #192136;
      box-shadow: -8px 8px 50px 0 rgba(0, 0, 0, 0.2);
      margin-left: 15px;
      height: 100%;
      // background-color: rgba(250,250,252,.18);
      border-radius: 4px;
      /deep/ .el-card__body {
        padding: 10px;
      }
      /deep/ .el-table .cell {
        padding-left: 5px;
        padding-right: 5px;
      }
    }
  }
}

.btn_group {
  display: flex;
  height: 50px;

  justify-content: space-between;
  /deep/ .el-button {
    background-color: rgba(255, 255, 255, 0.25);
    border: none;
    color: #fff;
    flex: auto;
    font-size: 16px;
  }
}
</style>