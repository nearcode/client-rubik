<template>
  <div class="banker dice At_the_bottom">
    <div class="container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
            <el-page-header @back="goBack" content="我要做庄"></el-page-header>
        </div>
        <div>
          <ul class="total_group">
            <li>
              <h3>奖金池</h3>
              <span>{{divestInfo | getDictValue('bank',0)}} {{currentCoin}}</span>
            </li>
            <li>
              <h3>当前投资</h3>
              <span>{{divestInfo | getDictValue('investment',0)}} {{currentCoin}}</span>
            </li>
            <li>
              <h3>投注占比</h3>
              <span>{{divestInfo | getDictValue('rate',0)}}%</span>
            </li>
          </ul>
          <div style="width:800px;margin:50px auto;">
            <el-form ref="form" :rules="rules" :model="form">
              <!-- 投入币种 -->
              <el-form-item prop="invest" label="投入币种">
                <el-row :gutter="10">
                  <el-col :span="18" class="parentElement">
                    <el-input type="number" v-model="form.invest" class="input-with-select balance">
                      <div slot="prepend">
                        <img class="childElements_left" :src="getCoinIcon(currentCoin)" alt="coin" />
                        <el-select style="width:200px;" @change="selectCoin" v-model="currentCoin">
                          <el-option
                            v-for="(v,k) in coins"
                            :key="k"
                            :label="v.coin"
                            :value="v.coin"
                          ></el-option>
                        </el-select>
                      </div>
                    </el-input>
                  </el-col>
                  <el-col :span="6">
                    <div class="btn_group">
                      <el-button :disabled="!form.invest || form.invest==0" @click="invest">投入</el-button>
                      <el-button @click="getMaxBets('invest')">MAX</el-button>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <!-- 撤出币种 -->
              <el-form-item prop="divest" label="撤出币种">
                <el-row :gutter="10">
                  <el-col :span="18" class="parentElement">
                    <el-input type="number" v-model="form.divest" class="input-with-select balance">
                      <div slot="prepend">
                        <img class="childElements_left" :src="getCoinIcon(currentCoin)" alt="coin" />
                        <el-select style="width:200px;" @change="selectCoin" v-model="currentCoin">
                          <el-option
                            v-for="(v,k) in coins"
                            :key="k"
                            :label="v.coin"
                            :value="v.coin"
                          ></el-option>
                        </el-select>
                      </div>
                    </el-input>
                  </el-col>
                  <el-col :span="6">
                    <div class="btn_group">
                      <el-button :disabled="!form.divest || form.divest==0" @click="divest">撤出</el-button>
                      <el-button @click="getMaxBets('divest')">MAX</el-button>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import diceApi from "@/api/dice";

export default {
  data() {
    let validCaptcha = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("数量不能为空"));
      }
      let balance = 0;
      balance = this.divestInfo.balance;

      if (value > balance) {
        callback(new Error("数量不能大于余额:" + balance));
      } else {
        callback();
      }
    };
    return {
      form: {
        invest: "0", //投资
        divest: "0" //撤资
      },
      currentCoin: "",
      coins: [],
      divestInfo: {},
      rules: {
        invest: [{ validator: validCaptcha, trigger: ["change", "blur"] }]
        // divest: [{ validator: validCaptcha, trigger: ["change", "blur"] }]
      }
    };
  },
  mounted() {
    this.getCoins();
  },
  methods: {
     goBack() {
       this.$router.push('/games/dice');
      },
    selectCoin(item) {
      this.getInvestor();
    },
    // 获取游戏币种
    async getCoins() {
      try {
        let result = await diceApi.getCoins();
        this.coins = result.data;
        if (this.coins[0] && !this.currentCoin) {
          this.currentCoin = this.coins[0].coin;
        }
        this.getInvestor();
      } catch (e) {}
    },
    // 设置最大
    getMaxBets(type) {
      if (type == "invest") {
        this.$set(this.form, "invest", this.divestInfo.balance);
      } else {
        this.$set(this.form, "divest", this.divestInfo.investment);
      }
    },
    // 获取投资信息
    async getInvestor() {
      if (!this.currentCoin) return;
      try {
        let result = await diceApi.investor({
          coin: this.currentCoin
        });
        this.divestInfo = result.data;
      } catch (e) {}
    },
    //   投资
    async invest() {
      try {
        let result = await diceApi.invest({
          amount: this.form.invest,
          coin: this.currentCoin
        });
        this.$message.success("投资成功");
        this.getInvestor();
      } catch (e) {}
    },
    // 撤资
    async divest() {
      try {
        let result = await diceApi.divest({
          amount: this.form.divest,
          coin: this.currentCoin
        });
        this.$message.success("撤资成功");
        this.getInvestor();
      } catch (e) {}
    }
  }
};
</script>

<style lang="scss" scoped>
$bg-color: transparent;
$primary-color: #ffbc06; //主要颜色

.parentElement {
  /*按钮定位到某个上面*/
  position: relative;
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

.total_group {
  display: flex;
  //   height: 100px;
  justify-content: space-between;
  li {
    text-align: center;
    flex: 1;
    padding: 15px;
    h3 {
      margin-bottom: 10px;
    }
    span {
      color: $primary-color;
      font-size: 16px;
    }
  }
  li:not(:first-child) {
    border-left: 1px solid #ddd;
  }
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
//dice
.dice {
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
  }
  /deep/ .balance {
    .el-input__inner {
      color: $primary-color !important;
      font-size: 16px;
    }
  }

  // margin-top: 30px;
  /deep/ .el-form-item__label {
    float: none;
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
  /deep/ .el-input-group__prepend div.el-select .el-input__inner {
    padding-left: 50px;
  }
  /deep/ .el-slider__runway {
    background-color: #eb4d5c;
  }
  /deep/ .el-slider__bar {
    background-color: #00e403;
  }
  /deep/ .el-slider__button {
    border-color: #fff;
    box-shadow: 0 0 3px 2px rgba(227, 229, 241, 0.5);
  }
}

.btn_group {
  display: flex;
  height: 50px;
  justify-content: space-between;
  /deep/ .el-button {
    flex: auto;
    font-size: 16px;
  }
}
</style>