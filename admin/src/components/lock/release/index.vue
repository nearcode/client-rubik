<template>
  <div class="link">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>锁仓管理</el-breadcrumb-item>
        <el-breadcrumb-item>释放记录</el-breadcrumb-item>
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
      <!-- <div class="plugins-tips"> -->
        <!-- <el-button @click="addCoinToLocked" :disabled="getPerms('lock:cents:cents')">分币</el-button> -->
      <!-- </div> -->
      <!--列表-->
      <el-table :data="resultList" border v-loading="loading" class="table">
        <el-table-column prop="times" label="时间">
          <template slot-scope="scope">
            <span>{{scope.row.create | toTimeStr}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ruleName" label="项目名称"></el-table-column>

        <el-table-column prop="total" label="数量"></el-table-column>
     
        <el-table-column prop="times" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="viewDetailed(scope.row.ruleId)">详细</el-button>
          </template>
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
import _ from "lodash";
import lockApi from "@/api/lock";

export default {
  name: "share",
  data() {
    return {
      currentPage: 1,
      resultList: [],
      totalItems: 0,
      loading: false,
      editBtnLoad: false,
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
    // 获取数据
    async getData() {
      try {
        let result = await lockApi.unlockHistory({
          p:this.currentPage
        });
        this.resultList = result.data;
        this.totalItems = result.count;
      } catch (e) {}
    },
    viewDetailed(ruleId) {
       this.$router.push(`/lock/release/${ruleId}`);
    },
  }
};
</script>

<style scoped>
</style>
