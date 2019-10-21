<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>账户信息</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group class="pull-right" style="margin-top: -21px">
        <el-tooltip class="item" effect="dark" content="导出表格" placement="top">
          <el-button icon="el-icon-download">导出</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
          <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
        </el-tooltip>
      </el-button-group>
    </div>
    <!--信息栏-->
    <el-row :gutter="15">
      <!--<el-col :xs="24" :sm="16" :md="8" >-->
      <!--<el-card class="box-card" shadow="hover" v-if="resultList.users" style="margin-bottom: 20px">-->
      <el-col :span="8">
        <el-card class="box-card" shadow="hover" style="margin-bottom: 20px">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <div class="text item">
            用户名：
            <span>{{resultList.user|getDictValue('username')}}({{resultList.user|getDictValue('id')}})</span>
          </div>
          <div class="text item">
            姓名：
            <span>{{resultList.user|getDictValue('truename')}}</span>
          </div>
          <div class="text item">邮箱：{{resultList.user|getDictValue('email')}}</div>
          <div class="text item">手机号：{{resultList.user|getDictValue('mobile')}}</div>
          <div class="text item" v-if="false">
            状态：
            <div class="status">
              <el-tag>交易正常</el-tag>
              <el-tag>提现正常</el-tag>
              <el-tag>登录正常</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8" v-if="false">
        <el-card class="box-card" shadow="hover" style="margin-bottom: 20px">
          <div slot="header" class="clearfix">
            <span>资产信息</span>
          </div>

          <div class="text item">
            总资产：
            <span style="color: #409EFF;">--</span>BTC
          </div>
          <div class="text item">
            净资产：
            <span style="color: #409EFF;">--</span>BTC
          </div>
          <div class="text item">
            资产估算：
            <span style="color: #409EFF;">--</span>CNY
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--主要内容-列表-->
    <div class="container">
      <!--<el-tabs type="card" v-model="activeName" class="tabs-nopadding" @tab-click="handleClick">-->
      <!--<el-tab-pane v-for="item in options" :label="item.label" :name="item.name">-->
      <!--<span v-html="item.html"></span>-->
      <!--</el-tab-pane>-->
      <!--</el-tabs>-->

      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!--用户资产-->
        <el-tab-pane label="用户资产" name="first">
          <!--<el-form :inline="true" :model="form" class="demo-form-inline">-->
          <!--<el-form-item label="币种">-->
          <!--<el-select v-model="form.selectCoin" placeholder="请选择">-->
          <!--<el-option :label="k" v-for="(v,k) in $store.state.coins" :value="k"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item>-->
          <!--<el-button type="primary" @click="onSubmit">查询</el-button>-->
          <!--</el-form-item>-->
          <!--</el-form>-->

          <el-table :data="resultList.balances" border max-height="800" class="table" v-loading="loading">
            <el-table-column fixed label="币种">
              <template slot-scope="scope">{{scope.row.coin}}</template>
            </el-table-column>

            <el-table-column label="可用">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('available') | autoNumber}}</span>
              </template>
            </el-table-column>

            <el-table-column label="冻结">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('freeze') | autoNumber}}</span>
              </template>
            </el-table-column>

            <el-table-column label="赠送">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('give') | autoNumber}}</span>
              </template>
            </el-table-column>

            <el-table-column label="糖果">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('candy') | autoNumber}}</span>
              </template>
            </el-table-column>

            <el-table-column label="充值">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('deposit') | autoNumber}}</span>
              </template>
            </el-table-column>

            <el-table-column label="买入">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('buy') | autoNumber}}</span>
              </template>
            </el-table-column>

            <el-table-column label="C2C买入">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('c2cBuy') | autoNumber}}</span>
              </template>
            </el-table-column>

            <el-table-column label="转入">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('transferIn') | autoNumber}}</span>
              </template>
            </el-table-column>

            <el-table-column label="提现">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('withdraw') | autoNumber}}</span>
              </template>
            </el-table-column>

            <el-table-column label="卖出">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('sell') | autoNumber}}</span>
              </template>
            </el-table-column>

            <el-table-column label="转出">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('transferOut') | autoNumber}}</span>
              </template>
            </el-table-column>

            <el-table-column label="C2C卖出">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('c2cSell') | autoNumber}}</span>
              </template>
            </el-table-column>

            <el-table-column label="赢">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('gameWin') | autoNumber}}</span>
              </template>
            </el-table-column>
            <el-table-column label="输">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('gameLose') | autoNumber}}</span>
              </template>
            </el-table-column>

             <el-table-column label="做庄">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('banker') | autoNumber}}</span>
              </template>
            </el-table-column>

            <el-table-column label="投资">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('invest') | autoNumber}}</span>
              </template>
            </el-table-column>
            <el-table-column label="撤资">
              <template slot-scope="scope">
                <span>{{scope.row| getDictValue('divest') | autoNumber}}</span>
              </template>
            </el-table-column>

            <el-table-column label="平账">
              <template slot-scope="scope">
                <span>{{scope.row | getDictValue('flat') | autoNumber}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--充值信息-->
        <el-tab-pane label="充值信息" name="deposit">
          <el-table
            :data="resultList.deposits"
            border
            class="table"
            v-loading="loading"
            ref="multipleTable"
          >
            <el-table-column label="充值时间">
              <template slot-scope="scope">{{scope.row.date | toTimeStr}}</template>
            </el-table-column>
            <el-table-column label="充值币种">
              <template slot-scope="scope">
                <span v-text="scope.row.coin"></span>
              </template>
            </el-table-column>
            <el-table-column label="充值数量">
              <template slot-scope="scope">
                <span v-text="scope.row.amount"></span>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 15px;">
            统计：
            <el-button v-for="(v,k) in depositTotal" :key="k">{{k}}: {{v}}</el-button>
          </div>
        </el-tab-pane>
        <!--提现信息-->
        <el-tab-pane label="提现信息" name="withdrawalHistory">
          <el-table
            :data="withdrawalHistory"
            border
            class="table"
            v-loading="loading"
            ref="multipleTable"
          >
            <el-table-column label="提现时间">
              <template slot-scope="scope">{{scope.row.date | toTimeStr}}</template>
            </el-table-column>
            <el-table-column label="提现币种">
              <template slot-scope="scope">
                <span v-text="scope.row.coin"></span>
              </template>
            </el-table-column>
            <el-table-column label="提现数量">
              <template slot-scope="scope">
                <span v-text="scope.row.amount"></span>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.result==1">成功</span>
                <span v-if="scope.row.result==2">取消</span>
                <span v-if="scope.row.result==-1">待审核</span>
                <span v-if="scope.row.result==0">待处理</span>
                <span v-if="scope.row.result==4">处理中</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 15px;">
            统计：
            <el-button v-for="(v,k) in withdrawalTotal" :key="k">{{k}}: {{v | autoNumber}}</el-button>
          </div>
        </el-tab-pane>
        <!--本地交易记录-->
        <el-tab-pane label="本地交易记录" name="getOrderHistory">
          <el-table
            :data="orderHistory"
            border
            class="table"
            v-loading="loading"
            ref="multipleTable"
          >
            <el-table-column label="交易时间">
              <template slot-scope="scope">{{scope.row.date | toTimeStr}}</template>
            </el-table-column>
            <el-table-column label="交易币种">
              <template slot-scope="scope">
                <span v-text="scope.row.pair"></span>
              </template>
            </el-table-column>
            <el-table-column label="交易数量">
              <template slot-scope="scope">
                <span v-text="scope.row.amount"></span>
              </template>
            </el-table-column>
            <el-table-column label="类型">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.type==1">买入</el-tag>
                <el-tag type="danger" v-if="scope.row.type==-1">卖出</el-tag>
                <el-tag v-if="scope.row.type==0">买卖</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="价格">
              <template slot-scope="scope">
                <span v-text="scope.row.price"></span>
              </template>
            </el-table-column>
            <el-table-column label="金额">
              <template slot-scope="scope">
                <span>{{(scope.row.amount*scope.row.price) }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 15px;">
            统计：
            <el-button v-for="(v,k) in orderBalance" :key="k">{{k}}: {{v | autoNumber}}</el-button>
          </div>
          <div class="pagination" v-if="totalItems>1">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :page-size="20"
              layout="prev, pager, next"
              :total="totalItems"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!--C2C-->
        <el-tab-pane label="C2C记录" name="c2c">
          <el-table
            :data="orderHistory"
            border
            class="table"
            v-loading="loading"
            ref="multipleTable"
          >
            <el-table-column label="交易时间">
              <template slot-scope="scope">{{scope.row.date | toTimeStr}}</template>
            </el-table-column>
            <el-table-column label="交易币种">
              <template slot-scope="scope">
                <span v-text="scope.row.pair"></span>
              </template>
            </el-table-column>
            <el-table-column label="交易数量">
              <template slot-scope="scope">
                <span v-text="scope.row.amount"></span>
              </template>
            </el-table-column>
            <el-table-column label="类型">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.type==1">买入</el-tag>
                <el-tag type="danger" v-if="scope.row.type==-1">卖出</el-tag>
                <el-tag v-if="scope.row.type==0">买卖</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="价格">
              <template slot-scope="scope">
                <span v-text="scope.row.price"></span>
              </template>
            </el-table-column>
            <el-table-column label="金额">
              <template slot-scope="scope">
                <span>{{(scope.row.amount*scope.row.price) }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 15px;">
            统计：
            <el-button v-for="(v,k) in orderBalance" :key="k">{{k}}: {{v | autoNumber}}</el-button>
          </div>
          <div class="pagination" v-if="totalItems>1">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :page-size="20"
              layout="prev, pager, next"
              :total="totalItems"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!--转账-->
        <el-tab-pane label="转账记录" name="transfer">
          <el-table
            :data="orderHistory"
            border
            class="table"
            v-loading="loading"
            ref="multipleTable"
          >
            <el-table-column label="交易时间">
              <template slot-scope="scope">{{scope.row.date | toTimeStr}}</template>
            </el-table-column>
            <el-table-column label="交易币种">
              <template slot-scope="scope">
                <span v-text="scope.row.pair"></span>
              </template>
            </el-table-column>
            <el-table-column label="交易数量">
              <template slot-scope="scope">
                <span v-text="scope.row.amount"></span>
              </template>
            </el-table-column>
            <el-table-column label="类型">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.type==1">买入</el-tag>
                <el-tag type="danger" v-if="scope.row.type==-1">卖出</el-tag>
                <el-tag v-if="scope.row.type==0">买卖</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="价格">
              <template slot-scope="scope">
                <span v-text="scope.row.price"></span>
              </template>
            </el-table-column>
            <el-table-column label="金额">
              <template slot-scope="scope">
                <span>{{(scope.row.amount*scope.row.price) }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 15px;">
            统计：
            <el-button v-for="(v,k) in orderBalance" :key="k">{{k}}: {{v | autoNumber}}</el-button>
          </div>
          <div class="pagination" v-if="totalItems>1">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :page-size="20"
              layout="prev, pager, next"
              :total="totalItems"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!--<keep-alive>-->
      <!--<router-view></router-view>-->
      <!--</keep-alive>-->
    </div>
  </div>
</template>

<script>
import UserAssets from "./accountHistory/UserAssets.vue";
import adminApi from "@/api/admin";
import _ from "lodash";

export default {
  name: "accountHistory",
  components: {
    UserAssets
  },
  data() {
    return {
      id: this.$route.params.uid,
      resultList: [
        {
          users: {}
        }
      ],
      depositHistory: [],
      depositTotal: [],
      withdrawalHistory: [],
      withdrawalTotal: [],
      orderHistory: [], //本地交易记录
      orderBalance: [], //交易统计
      loading: true,
      activeName: "first",
      currentPage: 1,
      totalItems: 0,
      form: {},
      options: [
        { label: "用户资产", name: "first" },
        { label: "对账信息", name: "/" },
        { label: "交易信息", name: "/" },
        { label: "安全信息", name: "/" },
        { label: "充值信息", name: "/" },
        { label: "提现信息", name: "/" },
        { label: "充值地址", name: "/" },
        { label: "操作日志", name: "/" }
      ]
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrderHistory();
    },
    async getData() {
      if (!this.id) return;
      try {
        let result = await adminApi.userFinance(this.id);
        this.resultList = result.data;

        // 把获取到的余额转换成数组
        let balances = [];
        for (let i in this.resultList.balances) {
          this.resultList.balances[i].coin = i;
          balances.push(this.resultList.balances[i]);
        }
        this.resultList.balances = balances;

        // this.orderBalance = result.data.orders;
        // this.resultList = result.data;
        // this.depositHistory = result.data.deposits;
        // this.withdrawalHistory = result.data.withdrawals;
        //
        // let balances = {};
        // this.depositHistory.forEach(function (item) {
        //     if (_.isUndefined(balances[item.coin])) balances[item.coin] = 0;
        //     balances[item.coin] += item.amount;
        // });
        // this.depositTotal = balances;
        //
        // balances = {};
        // this.withdrawalHistory.forEach(function (item) {
        //     if (item.result == 2) return;
        //     if (_.isUndefined(balances[item.coin])) balances[item.coin] = 0;
        //     balances[item.coin] += item.amount;
        // });
        // this.withdrawalTotal = balances;

        this.loading = false;
      } catch (e) {}
    },
    getOrderHistory() {
      // this.$axios({
      //     method: 'get',
      //     url: '/admin/getUserOrderHistory',
      //     params: {
      //         limit: 20,
      //         id: this.id,
      //         p: this.currentPage
      //     }
      // }).then(result => {
      //     this.orderHistory=result.data.resultList;
      //     this.totalItems=result.data.totalItems;
      // }).catch(error => {
      //     if (error && error.message) {
      //         this.$message.error(error.message)
      //     }
      // })
    },
    formatter(value, row, column) {
      for (let i in row.balances) {
      }
    },
    handleClick(tab, event) {
      if (this.activeName == "getOrderHistory") {
        this.getOrderHistory();
      }

      console.log(this.activeName);
      console.log(tab, event);
    },
    onSubmit() {}
  },
  watch: {
    $route() {
      this.id = this.$route.params.uid;
    },
    id() {
      if (this.id) this.getData();
    }
  }
};
</script>

<style scoped>
.box-card {
  height: 230px;
}

.status {
  display: inline-block;
}

.status .el-tag {
  margin-right: 5px;
}

.item {
  font-size: 14px;
  margin-bottom: 5px;
}
</style>
