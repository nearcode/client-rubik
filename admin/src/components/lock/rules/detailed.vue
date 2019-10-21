<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>锁仓管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path:'/lock/rules'}">锁仓规则</el-breadcrumb-item>
        <el-breadcrumb-item>锁仓详细</el-breadcrumb-item>
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
    <div class="container" style="padding:10px;">
      <!--操作与搜索-->
      <div class="plugins-tips"></div>
      <!--列表-->
      <el-table :data="resultList" border v-loading="loading" class="table">
        <el-table-column prop="times" label="时间">
          <template slot-scope="scope">
            <span>{{scope.row.create | toTimeStr}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="coin" label="币种" sortable></el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <el-tag>{{types[scope.row.type]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="数量"></el-table-column>
        
        <el-table-column prop="status" label="账户">
          <template slot-scope="scope">
            <span>{{scope.row | getDictValue('uid')}}</span>
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
import lockApi from "@/api/lock";
import config from "@/config";
import _ from "lodash";
import { mapState } from "vuex";

export default {
  name: "accountHistory",
  data() {
    return {
      id: this.$route.params.id,
      resultList: [],
      loading: false,
      currentPage: 1,
      totalItems: 0,
      types: { 1: "锁仓", 2: "升级" },
      form: {}
    };
  },

  computed: {
    ...mapState(["webTitle", "uid"])
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
      if (!this.id) return;
      this.loading = true;
      try {
        let result = await lockApi.lockUserHistory({
          ruleId: this.id,
          p: this.currentPage
        });
        this.loading = false;
        this.resultList = result.data;
        this.totalItems = result.count;
      } catch (e) {}
    }
  },
  watch: {
    $route() {
      this.id = this.$route.params.id;
      console.log(this.id);
    },
    id() {
      if (this.id) {
        this.replyList = [];
        this.totalItems = 0;
        this.getData();
      }
    }
  }
};
</script>

<style scoped>
</style>
