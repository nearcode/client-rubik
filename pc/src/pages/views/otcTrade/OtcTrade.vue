<template>
  <div class="container otc_trade At_the_bottom">
    <!--订单信息对话框-->
    <el-dialog :visible.sync="dialogVisible" @close="dialogClose" width="600px">
      <div style="font-weight: bold" slot="title">
        {{Payment.type==1?'汇款订单':'服务商信息'}}
        <small v-if="Payment.type==1">(请按提示信息向该卖家汇款)</small>
      </div>
      <div>
        <table cellspacing="0" cellpadding="0" class="table table-bordered">
          <tbody>
            <!--户名-->
            <tr>
              <td class="td_left" width="200">{{Payment.type==1?'收款方':'服务商'}}户名</td>
              <td class="td_right">{{Payment.merchants.truename | noData}}</td>
            </tr>
            <tr v-if="Payment.type==1">
              <td class="td_left">{{Payment.type==1?'收款方':'服务商'}}开户行</td>
              <td class="td_right">{{Payment.merchants.name | noData}} <small>{{Payment.merchants | getDictValue('branch')}}</small> </td>
            </tr>
            <tr v-if="Payment.type==1">
              <td class="td_left">
                {{Payment.type==1?'收款方':'服务商'}}账号
                <small class="font_red">（禁止使用支付宝和微信）</small>
              </td>
              <td class="td_right">{{Payment.merchants.number | noData}}</td>
            </tr>
            <tr>
              <td class="td_left">{{Payment.type==1?'收款方':'服务商'}}手机号</td>
              <td class="td_right">{{Payment.merchants.mobile | noData}}</td>
            </tr>
            <tr>
              <td class="td_left">转账金额</td>
              <td class="td_right">{{Payment.amount | noData}}</td>
            </tr>
            <tr v-if="Payment.type==1">
              <td class="td_left font_red">
                转账备注
                <small>(必填)</small>
              </td>
              <td class="td_right font_red">{{Payment.id | noData}}</td>
            </tr>
            <tr>
              <td class="td_left">状态</td>
              <td class="td_right">
                <span
                  v-for="(v, k) in resultStatus"
                  :class="v.color"
                  :key="k"
                  v-if="Payment.result==v.result"
                >{{Payment.result==-1&&Payment.type==1?'待转账':v.text}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="btn-block"
          type="primary"
          v-if="Payment.type!=1"
          @click="dialogVisible = false"
        >关闭</el-button>
        <el-button
          type="warning"
          v-if="Payment.type==1 && Payment.result==-1"
          :disabled="(nowTime-Payment.create*1000)<(1000*60*5)"
          @click="userCancel(Payment._id)"
        >取消订单</el-button>
        <el-button
          type="primary"
          v-if="Payment.type==1 && Payment.result==-1"
          @click="buyConfirm(Payment._id)"
        >已转账</el-button>
      </span>
    </el-dialog>
    <!--end-->
    <el-card class="box-card panel">
      <div slot="header" class="clearfix">
        <span>C2C交易</span>
        <span class="pull-right">{{info | getDictValue('coin')}}：{{(balance || 0) |autoFixed}}</span>
      </div>
      <!--交易表单-->
      <div class="text item container-fluid otcTrade" style="min-height: 205px;">
        <el-row :gutter="20">
          <!--买入-->
          <el-col :span="12">
            <el-form
              :model="buyForm"
              :rules="buyRules"
              ref="buyForm"
              class="demo-ruleForm"
              size="medium"
            >
              <!--价格-->
              <el-form-item class="parentElement">
                <el-input
                  type="number"
                  placeholder="价格"
                  disabled
                  :value="info | getDictValue('buyPrice')"
                  dir="rtl"
                  autocomplete="off"
                ></el-input>
                <span class="childElements_left" style="padding: 0 15px;">价格 (￥)：</span>
              </el-form-item>
              <!--数量-->
              <el-form-item class="parentElement" prop="amount">
                <el-input
                  type="number"
                  v-model="buyForm.amount"
                  placeholder="数量"
                  autocomplete="off"
                ></el-input>
                <span class="childElements_left" style="padding: 0 15px;">数量 ：</span>
              </el-form-item>
              <!--预计-->
              <el-form-item>
                <span>需要:{{(buyForm.amount || 0)| autoFixed}} {{info | getDictValue('coin')}}</span>
              </el-form-item>
              <!--买入-->
              <el-form-item>
                <el-button
                  type="success"
                  class="btn-block buy"
                  :loading="buyForm.loading"
                  @click="buyAndSell('buyForm',1)"
                >买入</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <!--卖出-->
          <el-col :span="12">
            <el-form
              :model="sellForm"
              :rules="sellRules"
              ref="sellForm"
              class="demo-ruleForm"
              size="medium"
            >
              <!--价格-->
              <el-form-item class="parentElement">
                <el-input
                  type="number"
                  placeholder="价格"
                  disabled
                  :value="info | getDictValue('sellPrice')"
                  autocomplete="off"
                ></el-input>
                <span class="childElements_left" style="padding: 0 15px;">价格 (￥)：</span>
              </el-form-item>
              <!--数量-->
              <el-form-item class="parentElement" prop="amount">
                <el-input
                  type="number"
                  v-model="sellForm.amount"
                  placeholder="数量"
                  autocomplete="off"
                ></el-input>
                <span class="childElements_left" style="padding: 0 15px;">数量 ：</span>
              </el-form-item>
              <!--预计-->
              <el-form-item>
                <span>可得:{{(sellForm.amount*info['sellPrice'] ||0)|autoFixed}} {{info | getDictValue('coin')}}</span>
              </el-form-item>
              <!--卖出-->
              <el-form-item>
                <el-button
                  type="danger"
                  class="btn-block sell"
                  :loading="sellForm.loading"
                  @click="buyAndSell('sellForm',-1)"
                >卖出</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <!--提示-->
      <el-alert type="warning" :closable="false">
        <div slot="title">
          <span style="font-size: 14px;font-weight: bold">提示</span>
          <div style="font-size: 14px;line-height: 2">
            1. 买卖商户均为实地考察认证商户，并提供价值100万的USDT保证金，您每次兑换会冻结商户资产，商户资产不够时，不能接单，可放心兑换；
            <br />2. 买卖商户均为实名认证商户，并提供保证金，可放心兑换；
            <br />3. 请使用本人绑定的银行卡进行汇款，其他任何方式汇款都会退款。（禁止微信和支付宝）
            <br />4. 商家处理时间9:00 - 21:00非处理时间的订单会在第二天9:00开始处理，一般接单后24小时内会完成打款。
            <br />5. 单天最多只能发起5笔未处理充值订单。
          </div>
        </div>
      </el-alert>
      <!-- <div class="el-alert el-alert--warning">
        <div class="el-alert__content">
          <span class="el-alert__title" style="font-size: 14px;font-weight: bold">提示</span>
          <div class="el-alert__description" style="font-size: 14px;line-height: 2">
            1. 买卖商户均为实地考察认证商户，并提供价值100万的USDT保证金，您每次兑换会冻结商户资产，商户资产不够时，不能接单，可放心兑换；
            <br />2. 买卖商户均为实名认证商户，并提供保证金，可放心兑换；
            <br />3. 请使用本人绑定的银行卡进行汇款，其他任何方式汇款都会退款。（禁止微信和支付宝）
            <br />4. 商家处理时间9:00 - 21:00非处理时间的订单会在第二天9:00开始处理，一般接单后24小时内会完成打款。
            <br />5. 单天最多只能发起5笔未处理充值订单。
          </div>
        </div>
      </div>-->
    </el-card>
    <!--充提记录-->
    <el-card class="box-card panel">
      <div slot="header" class="clearfix">
        <span>兑换记录</span>
      </div>
      <div class="text item">
        <el-table :data="resultList" v-loading="loading">
           <template slot="empty">
                  <i class="icon-no-data"></i>
                 <p>暂无数据</p>
                  </template>
          <!--时间-->
          <el-table-column label="日期" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{ scope.row.create | toTimeStr }}</span>
            </template>
          </el-table-column>
          <!--订单号-->
          <el-table-column label="订单号" align="center">
            <template slot-scope="scope">
              <!--<el-popover trigger="hover" placement="top">-->
              <span>{{ scope.row.id | noData}}</span>
              <!--</el-popover>-->
            </template>
          </el-table-column>
          <!--类型-->
          <el-table-column label="类型" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.type==1">买入</el-tag>
              <el-tag type="danger" v-if="scope.row.type==-1">卖出</el-tag>
            </template>
          </el-table-column>
          <!--数量-->
          <el-table-column label="数量" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.amount }}</span>
            </template>
          </el-table-column>
          <!--状态-->
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag
                v-for="(v, k) in resultStatus"
                :type="v.color"
                :key="k"
                v-if="scope.row.result==v.result"
              >{{scope.row.result==-1&&scope.row.type==1?'待转账':v.text}}</el-tag>
            </template>
          </el-table-column>
          <!--操作-->
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="opnePayment(scope.row)">订单信息</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div class="pagination" v-if="totalItems>1">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :page-size="20"
          layout="prev, pager, next"
          :total="totalItems"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import c2cApi from "@/api/c2c";
import baseApi from "@/api/base";
import { mapState } from "vuex";

export default {
  name: "OtcTrade",
  data() {
    const validateAmount = (rule, value, callback) => {
      // 估计这里内部使用了 parseInt() / parseFloat()
      if (value > this.balance) {
        callback(new Error("数量不能大于余额"));
      } else {
        callback();
      }
    };

    return {
      loading: false,
      currentPage: 1,
      totalItems: 0,
      dialogVisible: false, //对话框
      balance: null, //base余额
      buyForm: {
        loading: false
      }, //买入表单
      sellForm: {
        loading: false
      }, //卖出表单
      info: {
        //c2c配置信息
        coin: ""
      },
      nowTime: new Date().getTime(),
      Payment: {
        merchants: {}
      }, //弹框数据
      resultList: [], //充提记录
      buyRules: {
        amount: [
          {
            required: true,
            message: "数量不能为空",
            trigger: ["change", "blur"]
          }
        ]
      },
      sellRules: {
        amount: [
          {
            required: true,
            message: "数量不能为空",
            trigger: ["change", "blur"]
          },
          { validator: validateAmount }
        ]
      },
      resultStatus: [
        { result: 0, text: "未完成", color: "warning" },
        { result: 1, text: "成功", color: "success" },
        { result: 2, text: "已取消", color: "danger" },
        { result: -1, text: "待确认", color: "info" }
      ]
    };
  },
  computed: {
    ...mapState(["isLogin"])
  },
  mounted() {
    this.getC2c();
    this.getHistory();
  },
  methods: {
    // 获取c2c配置信息
    async getC2c() {
      try {
        this.$store.commit("getC2C", result => {
          this.info = result;
          this.getBalance();
        });
      } catch (e) {}
    },
    // 获取用户充提记录
    async getHistory() {
      if (!this.isLogin()) return;
      this.loading = true;
      let p = this.currentPage;
      try {
        let result = await c2cApi.history(p);
        this.loading = false;
        this.resultList = result.data;
        this.totalItems = result.count;
      } catch (e) {}
    },
    // 获取单个币种余额
    async getBalance() {
      if (!this.isLogin() || !this.info.coin) return;
      try {
        let result = await baseApi.getBalance(this.info.coin);
        this.balance = result.data.available;
      } catch (e) {}
    },
    // 下买单和卖单
    async buyAndSell(formName, type) {
      if (!this.isLogin()) return this.$router.push("/login");

      this.$refs[formName].validate(async valid => {
        if (valid) {
          type === 1
            ? (this.buyForm.loading = true)
            : (this.sellForm.loading = true);
          let data = {
            amount: type === 1 ? this.buyForm.amount : this.sellForm.amount,
            coin: this.info.coin,
            price: type === 1 ? this.info.buyPrice : this.info.sellPrice,
            type: type
          };
          try {
            let result = await c2cApi.buyAndSell(data);
            this.getHistory();
            this.getBalance();

            if (type === 1) {
              this.opnePayment(result.data);
              this.buyForm.loading = false;
            } else {
              this.$notify.success(this.$t("提交成功"));
              this.sellForm.loading = false;
            }
          } catch (e) {
            type === 1
              ? (this.buyForm.loading = false)
              : (this.sellForm.loading = false);
          }
        }
      });
    },
    // 确认买单
    async buyConfirm(id) {
      if (!id) return;
      try {
        let result = await c2cApi.buyConfirm(id);
        this.getHistory();
        this.$notify.success(this.$t("提交成功"));
        this.dialogVisible = false;
      } catch (e) {}
    },
    // 取消订单
    async userCancel(id) {
      if (!id) return;
      try {
        let result = await c2cApi.userCancel(id);
        this.$notify.success(this.$t("取消成功"));
        this.Payment.result = 2;
        this.getHistory();
      } catch (e) {}
    },
    // 付款信息
    opnePayment(item) {
      if (!item) return;
      this.nowTime = new Date().getTime();
      this.Payment = item;
      this.dialogVisible = true;
    },
    // 弹框关闭后回调
    dialogClose() {
      this.Payment = { merchants: {} };
    },
    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getHistory();
    }
  }
};
</script>

<style lang="less" scoped>
.table-bordered {
  width: 100%;
  border: 1px solid #ddd;
  border-collapse: collapse;
  tr {
    padding: 10px;
    td {
      border: 1px solid #f2e3b2;
      padding: 10px;
    }
    .td_left {
      background-color: #fffbef;
      border-color: #f2e3b2;
    }
    .td_right {
      border-color: #f2e3b2;
      text-align: left;
    }
  }
}

.otcTrade {
  .parentElement {
    /deep/ input[type="number"] {
      text-align: right;
    }

    /deep/ .el-form-item__error {
      right: 0;
      left: auto;
    }
  }
}

.el-form-item {
  margin-bottom: 15px !important;
}
</style>
