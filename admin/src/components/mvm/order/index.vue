<template>
  <div class="PaymentRecords">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>币值管理</el-breadcrumb-item>
        <el-breadcrumb-item>挂单统计</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group class="pull-right" style="margin-top: -21px">
        <!--<el-tooltip class="item" effect="dark" content="导出表格" placement="top">-->
        <!--<el-button icon="el-icon-download">导出</el-button>-->
        <!--</el-tooltip>-->
        <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
          <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
        </el-tooltip>
      </el-button-group>
    </div>
    <div class="container">
      <!--操作与搜索-->
      <div class="plugins-tips">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="选择交易对">
            <el-select v-model="form.market" @change="selectChange" placeholder="选择交易对">
              <el-option v-for="(v,k) in issuerMarkets" :label="v.coin+'/'+v.base" :value="v.coin+'_'+v.base"
                                       :key="k"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="resultList"
        border
        class="table"
        v-loading="loading"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="uid" label="账户">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              @hide="userInfo =  {loading:true}"
              @show="currentUserInfo(scope.row.uid)"
            >
              <div v-loading="userInfo.loading">
                <p>真实姓名：{{userInfo |getDictValue('truename')}}</p>
                <p>手机号：{{userInfo |getDictValue('mobile')}}</p>
                <p>邮箱：{{userInfo |getDictValue('email')}}</p>
              </div>
              <el-tag slot="reference">{{scope.row | getDictValue('uid')}}</el-tag>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="时间">
          <template slot-scope="scope">{{scope.row.create | toTimeStr}}</template>
        </el-table-column>
        <el-table-column label="交易对">
          <template slot-scope="scope">{{scope.row.market | toString}}</template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type==1">买入</el-tag>
            <el-tag v-if="scope.row.type==-1" type="danger">卖出</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="价格" prop="price" align="center"></el-table-column>
        <el-table-column label="数量" prop="amount" align="center"></el-table-column>
      </el-table>
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
    </div>
  </div>
</template>


<script>
import mvmApi from "@/api/mvm";
import { mapState } from "vuex";

export default {
  name: "records",
  data() {
    return {
      resultList: [],
      currentPage: 1,
      multipleSelection: [],
      merchantList: [],
      totalItems: 0,
      delVisible: false,
      loading: false,
      userInfo:{},
      form: {},
      sumData: {}
    };
  },
  mounted() {
     this.$store.commit('getMarkets');
    this.$store.commit('issuerGet');
  },
  computed: {
    ...mapState(["markets",'issuerCoins']),
    issuerMarkets(){
        let coins = this.issuerCoins.coins;
        let markets = this.markets;
        let result = [];

        for(let item of markets){
            for(let key of coins){
              if(item.coin == key){
                result.push(item);
              }
            }
        }
        
        return result;
    }
  },
  methods: {
     currentUserInfo(uid) {
      this.$set(this.userInfo, "loading", true);
      this.getUserInfo(this, uid, item => {
        this.userInfo = item;
        this.$set(this.userInfo, "loading", false);
      });
    },
    selectChange(news){
      this.currentPage = 1;
      this.totalItems=0
    },
    // 搜索
    search() {
      this.getData();
    },
    // 分页导航
    handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val;
      this.getData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // this.$refs.multipleTable.toggleRowSelection(row);
      console.log(JSON.stringify(this.multipleSelection));
    },
    // 获取数据
    async getData() {
      if(!this.form.market) return;
      this.loading = true;
      try {
        let result = await mvmApi.orderingStat({
          // startTime: this.form.startTime /1000,
          // endTime: this.form.endTime / 1000,
          market: this.form.market,
          p: this.currentPage
        });
        this.resultList = result.results;
        this.sumData = result.data;
        this.totalItems = result.count;
        this.loading = false;
      } catch (e) {}
    },
    // 获取代理商列表
    getMerchant() {
      this.$axios({
        method: "get",
        url: "/admin/c2c/merchantList"
      })
        .then(result => {
          this.merchantList = result.data.list;
        })
        .catch(error => {
          this.$message.error(this.$t(error.data.message));
        });
    }
  }
};
</script>

<style scoped>
</style>
