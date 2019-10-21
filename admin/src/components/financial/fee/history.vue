<template>
  <div class="info">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务管理</el-breadcrumb-item>
        <el-breadcrumb-item to="/finance/fee">手续费账户</el-breadcrumb-item>
        <el-breadcrumb-item>划转详细</el-breadcrumb-item>
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
    <div class="container">
      <el-table border :data="resultList" v-loading="loading" style="width: 100%">
        <el-table-column label="时间" prop="create">
          <template slot-scope="scope">{{scope.row.create | toTimeStr}}</template>
        </el-table-column>
        <el-table-column label="账户" prop="uid">
          <template slot-scope="scope">{{scope.row | getDictValue('uid')}}</template>
        </el-table-column>
        <el-table-column label="余额" prop="id">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.coins" style="width: 100%">
                <el-table-column label="币种">
                  <template slot-scope="scope">{{scope.row.coin}}</template>
                </el-table-column>
                <el-table-column label="数量">
                  <template slot-scope="scope">{{scope.row.amount}}</template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table-column>
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
import baseApi from "@/api/admin";

export default {
  data() {
    return {
      loading: true,
      totalItems: 0,
      currentPage: 1,
      resultList: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    async getData() {
      this.loading = true;
      try {
        let result = await baseApi.feeTransferHistory({
            p:this.currentPage
        });
        let data = result.data || [];

        for (let item of data) {
          let coins = [];
          for (let i in item["coins"]) {
            coins.push({
              coin: i,
              amount: item["coins"][i]
            });
          }
          item["coins"] = coins;
        }
        this.loading = false;
        this.resultList = data;
        this.totalItems = result.count;
      } catch (e) {}
    }
  }
};
</script>
<style scoped>
</style>
