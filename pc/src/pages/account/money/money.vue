<template>
  <div class="At_the_bottom money">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>我的资金一览表</span>

        <el-switch
          style="margin-left:5px;"
          @change="hiddeZero"
          v-model="hideCoin"
          active-text="隐藏资金为0的币种"
        ></el-switch>

        <div class="estimate">
          <i>资产估算</i>
          ￥{{balanceDatas|toCNYs|autoNumber}}
        </div>
      </div>

      <div class="text item">
        <el-table
          :data="orderTickers"
          ref="table"
          @expand-change="expandSelect"
          v-loading="loading"
        >
         <template slot="empty">
                  <i class="icon-no-data"></i>
                 <p>暂无数据</p>
                  </template>
          <!--币种-->
          <el-table-column label="币种" sortable prop="coin" min-width="120">
            <template slot-scope="scope">
              <div>
                <img :src="getCoinIcon(scope.row.coin)" class="coin_icon" />
                <div style="display: inline-block">{{scope.row.coin}}</div>
              </div>
            </template>
          </el-table-column>
          <!--可用-->
          <el-table-column label="可用余额" sortable prop="available" width="180">
            <template slot-scope="scope">
              <span>{{(scope.row.available || 0) | autoNumber}}</span>
            </template>
          </el-table-column>
          <!--挂单-->
          <el-table-column label="冻结金额" prop="freeze" sortable min-width="120">
            <template slot-scope="scope">
              <span>{{(scope.row.freeze || 0) | autoNumber}}</span>
            </template>
          </el-table-column>
          <!--总量-->
          <el-table-column label="总量" prop="total" sortable rowspan="2" align="left">
            <template slot-scope="scope">{{scope.row | getDictValue('total',0)}}</template>
          </el-table-column>
          <!--操作-->
          <el-table-column prop="address" label="操作" align="right" width="210px">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                size="mini"
                clearable
                prefix-icon="el-icon-search"
                placeholder="输入币种搜索"
              ></el-input>
            </template>
            <template slot-scope="props" v-if="coins[props.row.coin]">
              <!--转账-->
              <el-button
                size="mini"
                v-if="coins[props.row.coin]['transfer']"
                @click="accTransfer(props.row.coin)"
              >转账</el-button>
              <!--充值-->
              <el-button
                type="success"
                size="mini"
                :loading="props.row.loading"
                v-if="coins[props.row.coin].deposit"
                @click="deposit(props.row)"
              >充值</el-button>
              <!--提现-->
              <el-button
                type="danger"
                size="mini"
                v-if="coins[props.row.coin].withdraw"
                @click="withdraw(props.row.coin)"
              >提现</el-button>
              <!--交易-->
              <el-dropdown @command="goExchange">
                <span class="el-dropdown-link">
                  <el-button type="primary" size="mini" v-if="isTrade(props.row.coin)">交易</el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(v,k) in markets" :key="k"
                    v-if="props.row.coin==v.coin && v.isTrade"
                    :command="v.coin+'_'+v.base"
                  >{{v.coin+'/'+v.base}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- <el-tooltip placement="bottom-end" effect="light">
                <template slot="content">
                  <ul class="tickersList">
                    <li
                      v-for="(v,k) in markets"
                      @click="goExchange(v.coin+'_'+v.base)"
                      :key="k"
                      v-if="props.row.coin==v.coin && v.isTrade"
                    >{{v.coin+'/'+v.base}}</li>
                  </ul>
                </template>
                <el-button type="primary" size="mini" v-if="isTrade(props.row.coin)">交易</el-button>
              </el-tooltip>-->
            </template>
          </el-table-column>
          <!--充值地址-->
          <el-table-column type="expand" width="1">
            <template slot-scope="props">
              <div style="display: flex">
                <div style="width: 60px;flex: none;height: 60px;background-color: rgb(242, 243, 248)"
                >
                  <img :src="urlAction+'?text='+props.row.depositAddress" style="width: 100%;" alt />
                </div>

                <div style="flex: auto;overflow: hidden;padding-left: 10px;">
                  <p style="margin:5px 0;">
                    {{props.row.coin}} 充值地址：
                    <!--提示-->
                    <!-- <small v-if="props.row.coin=='MAYA'" class="font_red">(如果是还未兑换新MAYA请勿充值，要不到不了帐.)</small> -->
                    <!--最小充值-->
                    <span
                      v-if="coins[props.row.coin].depositLimit"
                      class="font_red"
                    >最小充值：{{coins[props.row.coin].depositLimit}} {{props.row.coin}}</span>
                  </p>

                  <span
                    style="font-weight: 500;"
                  >{{props.row | getDictValue('depositAddress')}}</span>
                  <el-button @click="copy(props.row.depositAddress)" size="mini">复制</el-button>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 转账弹出框 -->
    <el-dialog
      :title="info.coin+(info.dialogType=='withdraw'?'提币':'转账')"
      v-if="showDialog"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      @close="closeDialog('info')"
      width="600px"
    >
      <el-form ref="info" :model="info" :rules="rules" label-width="80px">
        <el-form-item label="地址" prop="address">
          <el-input v-model="info.address" placeholder="对方账户"></el-input>
        </el-form-item>

        <el-form-item label="数量" prop="amount">
          <el-input v-model="info.amount" placeholder="请输入数量"></el-input>
        </el-form-item>

        <!--<el-form-item label="实际到账" prop="">-->
        <!--<el-input v-model="info.toUser" disabled></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="disable" @click="showDialog = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="disable"
          @click="submitForm('info', info.dialogType)"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!--提现弹框-->
    <UpDateDialog ref="dateDialog" v-on:upData="setData"></UpDateDialog>
    <!--验证弹框组件-->
    <verify ref="verifyDialog" v-on:code="setCode"></verify>
  </div>
</template>

<script>
import UpDateDialog from "./dialog";
import baseApi from "@/api/base";
import walletApi from "@/api/wallet";
import { mapState } from "vuex";
import config from "@/config";
import _ from "lodash";

export default {
  name: "Account",
  components: {
    UpDateDialog
  },
  data() {
    return {
      resultList: [],
      tickers: [],
      expands: [],
      balanceDatas: {},
      info: {},
      authCode: "",
      withdrawForm: {}, //提现表单
      urlAction: config.baseUrl + "/qrcode",
      loading: false,
      search: "",
      hideCoin: false,
      rules: {
        address: [
          {
            required: true,
            message: "地址不能为空",
            trigger: ["change", "blur"]
          }
        ],
        amount: [
          {
            required: true,
            message: "数量不能为空",
            trigger: ["change", "blur"]
          }
        ]
      },
      showDialog: false,
      disable: false
    };
  },
  computed: {
    ...mapState(["coins", "markets", "c2cInfo"]),
    // 模糊搜索
    orderTickers() {
      let newObj = [];
      for (let item of this.resultList) {
        if (item.coin.indexOf(this.search.toUpperCase().trim()) > -1) {
          if (this.hideCoin) {
            if (item.total && item.total != 0) {
              newObj.push(item);
            }
          } else {
            newObj.push(item);
          }
        }
      }

      return newObj;
    }
  },
  mounted() {
    this.getData();

    this.$nextTick(() => {
      if(localStorage.getItem("isHideZeroBalance") != null){
         this.hideCoin = this.$common.getJsonData(JSON.parse(localStorage.isHideZeroBalance));
      }
    });

    this.tickers = this.$common.getJsonData(localStorage.tickers);
  },
  methods: {
    isTrade(coin) {
      for (let item of this.markets) {
        if (item.coin == coin) {
          return item.isTrade;
        }
      }
    },
    // 隐藏币种
    hiddeZero(type) {
      localStorage.isHideZeroBalance = JSON.stringify(type);
    },
    // 用户转账
    accTransfer(coin) {
      this.showDialog = true;
      this.info = {
        dialogType: "transfer",
        coin: coin
      };
    },
    // 确定操作
    submitForm(formName, type) {
      if (!type) return;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (type == "transfer") {
            //转账
            this.transferConfirm();
          }
          // else if (type == 'withdraw') { //提现
          //     this.withdrawConfirm();
          // }
        } else {
          return false;
        }
      });
    },
    // 确认转账
    async transferConfirm() {
      this.disable = true;
      let data = {
        address: this.info.address,
        amount: this.info.amount,
        coin: this.info.coin,
        authCode: this.authCode,
        memo: this.info.memo //备注
      };
      try {
        let result = await baseApi.accTransfer(data);
        this.showDialog = false;
        this.$notify.success(this.$t("转账成功"));
      } catch (e) {
        this.authCode = "";
        let layer = this.$refs.verifyDialog;
        layer.init(this);
        if (e && e.verify) {
          layer.show({
            authType: e.verify,
            callback: this.transferConfirm
          });
        }
        this.$refs.dateDialog.btnLoading = false;
      }
      this.disable = false;
    },
    // 用户提现
    withdraw(coin) {
      if (!coin) return;
      if (coin == this.c2cInfo["coin"]) {
        return this.$router.push("/OtcTrade");
      }

      let layer = this.$refs.dateDialog;
      layer.show({
        dialogType: "withdraw",
        coin: coin,
        callback: this.withdrawConfirm
      });

      //
      // this.showDialog = true;
      // this.info = {
      //     dialogType: 'withdraw',
      //     coin: coin
      // }
    },
    // 把弹框数据赋值过来
    setData(data) {
      this.withdrawForm = _.cloneDeep(data);
    },
    // 把验证码赋值过来
    setCode(code) {
      this.authCode = code;
    },
    // 确认提现
    async withdrawConfirm() {
      this.$refs.dateDialog.btnLoading = true;
      try {
        let data = {
          coin: this.withdrawForm.coin,
          address: this.withdrawForm.address,
          amount: this.withdrawForm.amount,
          authCode: this.authCode
        };

        let result = await walletApi.actwithdraw(data);

        this.$refs.dateDialog.btnLoading = false;
        this.getData();
        this.$refs.dateDialog.info.amount = 0;
        this.$refs.dateDialog.available -= this.withdrawForm.amount;
        this.$refs.dateDialog.cancel();

        this.$notify.success(this.$t("提交成功"));
      } catch (e) {
        this.authCode = "";
        let layer = this.$refs.verifyDialog;
        layer.init(this);
        if (e && e.verify) {
          layer.show({
            authType: e.verify,
            callback: this.withdrawConfirm
          });
        }
        this.$refs.dateDialog.btnLoading = false;
      }
      this.disable = false;
    },
    // 关闭弹框回调
    closeDialog() {},

    // 获取用户资金
    async getData() {
      this.loading = true;

      try {
        let result = await baseApi.getAccMoney();
        let resList = [];
        this.loading = false;
        let data = result.data;
        this.balanceDatas = {};

        for (let i in data) {
          this.balanceDatas[i] = data[i].available;
          resList.push(data[i]);
        }
        this.resultList = resList;
      } catch (e) {}
    },
    expandSelect(row, expandedRows) {
      if (expandedRows.length > 1) {
        // expandedRows.shift();
      } else {
      }
    },
    // 充值
    async deposit(row) {
      if (!row) return;
      if (row["coin"] == this.c2cInfo["coin"]) {
        return this.$router.push("/OtcTrade");
      }

      const $table = this.$refs.table;

      if (this.expands == row.coin) {
        this.$nextTick(() => {
          $table.toggleRowExpansion(row, false);
        });
        this.expands = null;
        return;
      }

      //    设置按钮loading
      let setLoading = type => {
        for (let i in this.resultList) {
          if (this.resultList[i].coin == row.coin) {
            this.$set(this.resultList[i], "loading", type);
          }
        }
      };

      setLoading(true);

      try {
        let result = await walletApi.getDepositAddress(row.coin);

        for (let i in this.resultList) {
          if (this.resultList[i].coin == row.coin) {
            this.$set(this.resultList[i], "depositAddress", result.data);
            setLoading(false);
          }
        }

        this.$nextTick(() => {
          this.resultList.map(item => {
            if (item.coin != row.coin) {
              $table.toggleRowExpansion(item, false);
            }
          });
          $table.toggleRowExpansion(row);
        });

        if (row.coin) this.expands = row.coin;
      } catch (e) {
        setLoading(false);
        this.expands = null;
      }
    },

    // 去交易
    goExchange(command) {
      if (!command) return;
      this.$router.push("/exchange/" + command);
    }
  }
};
</script>

<style lang="less" scoped>
.estimate {
  float: right;
  padding: 3px 0;
  font-size: 12px;
}

.coin_icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
  margin-right: 3px;
}

.money /deep/ .el-table__expand-column .cell {
  display: none;
}

.money /deep/ .el-table th div {
  padding: 0;
}
.money /deep/ .el-button + .el-button {
  margin-left: 0px;
}

.money {
  /deep/ .el-table__row {
    padding: 0 5px;
  }
  /deep/ .el-table .cell {
    padding: 0 2px;
  }
  /deep/ .has-gutter th.gutter {
    display: inline-block !important;
  }
}

.money /deep/ .el-table__expanded-cell[class*="cell"] {
  padding: 20px !important;
  // background-color: #f2f6fc;
}
</style>
