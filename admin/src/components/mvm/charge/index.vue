<template>
  <div class="PaymentRecords">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>币值管理</el-breadcrumb-item>
        <el-breadcrumb-item>充提统计</el-breadcrumb-item>
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
          <el-form-item prop="coin" label="请选择币种">
            <el-select v-model="form.coin" @change="selectChange" placeholder="请选择币种">
              <el-option :label="v" v-for="(v,k) in issuerCoins.coins" :key="k" :value="v"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="起始时间">
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              value-format="timestamp"
              placeholder="选择起始日期时间"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="结束时间">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              value-format="timestamp"
              placeholder="选择结束日期时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="15" style="margin-top: 15px">
          <el-col :span="12">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>充值数量</span>
              </div>
              <div class="text item">
                <p>
                  <el-tag>{{sumData | getDictValue('deposit')}}</el-tag>
                </p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>提现数量</span>
              </div>
              <div class="text item">
                <p>
                  <el-tag>{{sumData | getDictValue('withdraw')}}</el-tag>
                </p>
              </div>
            </el-card>
          </el-col>
        </el-row>
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
              @hide="userInfo = {loading:true}"
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
        <el-table-column label="币种">
          <template slot-scope="scope">{{scope.row | getDictValue('coin')}}</template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type==1">充值</el-tag>
            <el-tag v-if="scope.row.type==-1" type="danger">提现</el-tag>
          </template>
        </el-table-column>
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
      userInfo: {},
      delVisible: false,
      loading: false,
      form: {
        startTime: new Date(
          new Date(new Date().toLocaleDateString()).getTime()
        ),
        endTime: new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            24 * 60 * 60 * 1000 -
            1
        )
      },
      sumData: {}
    };
  },
  mounted() {
    this.$store.commit("issuerGet");
  },
  computed: {
    ...mapState(["issuerCoins"])
  },
  methods: {
    // 通过uid获取当前的信息
    currentUserInfo(uid) {
      this.$set(this.userInfo, "loading", true);
      this.getUserInfo(this, uid, item => {
        this.userInfo = item;
        this.$set(this.userInfo, "loading", false);
      });
    },
    selectChange(news) {
      this.currentPage = 1;
      this.totalItems = 0;
    },
    // 搜索
    search() {
      this.getData();
    },
    // 分页导航
    handleCurrentChange(val) {
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
      if (!this.form.coin) return;
      this.loading = true;
      try {
        let result = await mvmApi.depositAndWithdrawStat({
          startDate: this.form.startTime / 1000,
          endDate: this.form.endTime / 1000,
          coin: this.form.coin,
          p: this.currentPage
        });
        this.resultList = result.results;
        this.sumData = result.data;
        this.totalItems = result.count;
        this.loading = false;
      } catch (e) {}
    }
  }
};
</script>

<style scoped>
</style>
