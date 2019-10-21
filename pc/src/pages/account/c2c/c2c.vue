<template>
  <div class="At_the_bottom">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>代理充值</span>
        <div style="float: right; padding: 3px 0;font-size: 12px" type="text">
          {{coin | noData}}:{{balance || 0}}
          <!--<span class="font_red">提现</span>-->
        </div>
      </div>

      <!--订单信息对话框-->
      <el-dialog :visible.sync="dialogVisible" @close="dialogClose" width="600px">
        <div style="font-weight: bold" slot="title">
          {{Payment.type==1?'收款订单':'付款订单'}}
          <small v-if="Payment.type==-1">(请按提示信息向该卖家汇款)</small>
        </div>
        <div>
          <table cellspacing="0" cellpadding="0" class="table table-bordered">
            <tbody>
              <!--户名-->
              <tr>
                <td class="td_left" width="200">{{Payment.type==1?'收款方':'付款方'}}户名</td>
                <td class="td_right">{{Payment.bankcard| getDictValue('truename')}}</td>
              </tr>
              <tr>
                <td class="td_left">{{Payment.type==1?'收款方':'付款方'}}开户行</td>
                <td class="td_right">{{Payment.bankcard| getDictValue('name')}}</td>
              </tr>
              <tr>
                <td class="td_left">
                  {{Payment.type==1?'收款方':'付款方'}}账号
                  <small class="font_red">（禁止使用支付宝和微信）</small>
                </td>
                <td class="td_right">{{Payment.bankcard| getDictValue('number')}}</td>
              </tr>
              <tr>
                <td class="td_left">{{Payment.type==1?'收款方':'付款方'}}手机号</td>
                <td class="td_right">{{Payment.bankcard| getDictValue('mobile')}}</td>
              </tr>
              <tr>
                <td class="td_left">转账金额</td>
                <td class="td_right">{{Payment| getDictValue('amount')}}</td>
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
            v-if="Payment.result==1"
            @click="dialogVisible = false"
          >关闭</el-button>
          <el-button
            class="btn-block"
            type="primary"
            v-if="Payment.result==0"
            @click="PaymentConfirm(Payment._id)"
          >打款</el-button>
        </span>
      </el-dialog>
      <div class="text item">
        <!--代理商规则-->
        <el-alert title="代理商规则：帮用户充值手续费为0，帮用户提现可收取1%的手续费。" type="warning" :closable="false"></el-alert>
        <!--代理商设置-->
        <el-card shadow="never" style="margin: 10px 0;">
          <span class="demo-input-suffix">
            处理范围：
            <el-tooltip content="最小值" placement="top">
              <el-input style="width: 180px;" placeholder="最小值" v-model="c2cInfo.min"></el-input>
            </el-tooltip>

            <el-tooltip content="最大值" placement="top">
              <el-input style="width: 180px;" placeholder="最大值" v-model="c2cInfo.max"></el-input>
            </el-tooltip>
          </span>
          <el-switch v-model="c2cInfo.isOpenDeposit" active-text="充值"></el-switch>
          <el-switch v-model="c2cInfo.isOpenWithdraw" active-text="提现"></el-switch>
          <el-button @click="merchantSetting" type="primary" plain>保存</el-button>
        </el-card>
        <div style>
          <el-input placeholder="可搜索真实姓名/订单号" v-model="info.s" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <!--充提切换-->
        <el-tabs v-model="activeName" style="margin:20px 0;" @tab-click="handleClick" stretch>
          <!--充值列表-->
          <el-tab-pane label="代充值列表" name="1">
            <el-table :data="depositList" v-loading="loading" border ref="depositable">
                 <template slot="empty">
                  <i class="icon-no-data"></i>
                 <p>暂无数据</p>
                  </template>
              <el-table-column label="订单号" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row| getDictValue('id')}}</span>
                </template>
              </el-table-column>

              <el-table-column label="时间" width="180">
                <template slot-scope="scope">
                  <span>{{scope.row.create | toTimeStr}}</span>
                </template>
              </el-table-column>

              <el-table-column label="用户">
                <template slot-scope="scope">
                  <span>{{scope.row| getDictValue('uid')}}</span>
                </template>
              </el-table-column>

              <el-table-column label="数量">
                <template slot-scope="scope">
                  <span>{{scope.row| getDictValue('amount')}}</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" v-if="scope.row.result==1">成功</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="openInfo(scope.row,1)"
                    v-if="scope.row.result==0"
                  >查看</el-button>
                  <!--<el-button type="primary" size="mini" v-if="scope.row.result==1">过期</el-button>-->
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <!--提现列表-->
          <el-tab-pane label="提现列表" name="-1">
            <el-table :data="withdrawList" v-loading="loading" border ref="withdrawTable">
                 <template slot="empty">
                  <i class="icon-no-data"></i>
                 <p>暂无数据</p>
                  </template>
              <el-table-column label="订单号" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.id | noData}}</span>
                </template>
              </el-table-column>

              <el-table-column label="时间" width="180">
                <template slot-scope="scope">
                  <span>{{scope.row.create | toTimeStr}}</span>
                </template>
              </el-table-column>

              <el-table-column label="用户">
                <template slot-scope="scope">
                  <span>{{scope.row| getDictValue('uid')}}</span>
                </template>
              </el-table-column>

              <el-table-column label="数量">
                <template slot-scope="scope">
                  <span>{{scope.row| getDictValue('amount')}}</span>
                </template>
              </el-table-column>
              <el-table-column label="手续费">
                <template slot-scope="scope">
                  <span>{{scope.row.fee*100 |noData}}%</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="260px">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    v-if="scope.row.result==0"
                    @click="openInfo(scope.row,1)"
                  >待处理</el-button>
                  <el-tag type="success" size="mini" v-if="scope.row.result==1">成功</el-tag>
                  <el-tag type="info" size="mini" v-if="scope.row.result==2">取消</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <!--分页-->
        <div class="pagination" v-if="totalItems>1">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            align="center"
            :page-size="20"
            layout="prev, pager, next"
            :total="totalItems"
          ></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import c2cApi from "@/api/c2c";
import baseApi from "@/api/base";

export default {
  name: "c2c",
  data() {
    return {
      info: {},
      c2cInfo: {
        max: null,
        min: null,
        isOpenDeposit: null,
        isOpenWithdraw: null
      },
      coin: "",
      dialogVisible: false,
      activeName: "1",
      balance: null,
      currentPage: 1,
      totalItems: 0,
      loading: true,
      withdrawList: [], //提现列表
      depositList: [], //充值列表
      Payment: { user: {} },
      tickerTimer: null,
      resultStatus: [
        { result: 0, text: "待处理", color: "warning" },
        { result: 1, text: "成功", color: "success" },
        { result: 2, text: "已取消", color: "danger" },
        { result: -1, text: "待确认", color: "info" }
      ]
    };
  },
  mounted() {
    this.getData();
    this.getC2c();
    this.getMerchant();
    this.tickerTimer = setInterval(async () => {
      await this.getData();
    }, 1000 * 5);
  },
  // watch:{
  //     activeName(val){
  //         this.tickerTimer = setInterval(async () => {
  //             console.log('执行2')
  //             await this.getData();
  //         }, 1000 * 5);
  //     }
  // },
  destroyed() {
    //清除定时器
    clearInterval(this.tickerTimer);
  },
  methods: {
    // 获取c2c配置信息
    async getC2c() {
      try {
        let result = await c2cApi.getC2C();
        this.coin = result.data.coin;
        this.getBalance();
      } catch (e) {}
    },

    // 获取代理商信息
    async getMerchant() {
      try {
        let result = await c2cApi.getMerchant();
        this.c2cInfo = result.data;
      } catch (e) {}
    },
    // 设置代理商
    async merchantSetting() {
      let data = {
        max: this.c2cInfo.max,
        min: this.c2cInfo.min,
        isOpenDeposit: this.c2cInfo.isOpenDeposit,
        isOpenWithdraw: this.c2cInfo.isOpenWithdraw
      };
      try {
        let result = await c2cApi.merchantSetting(data);
        this.getMerchant();
        this.$notify.success(this.$t("设置成功"));
      } catch (e) {}
    },
    // 获取充提记录
    async getData() {
      try {
        let result = await c2cApi.merchantTradeList(this.activeName, "all");

        this.loading = false;
        if (this.activeName == 1) {
          this.depositList = result.data || [];
          this.totalItems = result.count;
        } else if (this.activeName == -1) {
          this.withdrawList = result.data || [];
          this.totalItems = result.count;
        }
      } catch (e) {}
    },
    // 获取单个币种余额
    async getBalance() {
      if (!this.coin) return;
      try {
        let result = await baseApi.getBalance(this.coin);
        this.balance = result.data.available;
      } catch (e) {}
    },
    // 查看订单
    openInfo(item, type) {
      if (!item) return;
      this.Payment = item;
      this.dialogVisible = true;
    },
    PaymentConfirm(id) {
      if (!id) return;
      let type = this.Payment.type;
      this.$confirm("你确定打款吗？")
        .then(() => {
          if (type == 1) {
            this.buyConfirm(id);
          } else if (type == -1) {
            this.sellConfirm(id);
          }
        })
        .catch(() => {});
    },
    // 服务商确认买单
    async buyConfirm(id) {
      if (!id) return;
      try {
        let result = await c2cApi.merchantBuyConfirm(id);
        this.$set(this.Payment, "result", 1);
        this.getData();
        this.getBalance();
        this.$notify.success(this.$t("打款成功"));
      } catch (e) {}
    },
    // 服务商确认卖单
    async sellConfirm(id) {
      if (!id) return;
      try {
        let result = await c2cApi.merchantSellConfirm(id);
        this.$set(this.Payment, "result", 1);
        this.getData();
        this.getBalance();
        this.$notify.success(this.$t("打款成功"));
      } catch (e) {}
    },
    // 弹框关闭回调
    dialogClose() {
      this.Payment = { user: {} };
    },
    // 切换充提记录
    handleClick(tab, event) {
      this.loading = true;
      this.currentPage = 1;
      this.totalItems = 0;
      this.activeName = tab.name;
      this.depositList = [];
      this.withdrawList = [];
      this.getData();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
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
</style>