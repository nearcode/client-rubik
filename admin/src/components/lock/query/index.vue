<template>
  <div class="Administrator">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>锁仓管理</el-breadcrumb-item>
        <el-breadcrumb-item>锁仓查询</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group class="pull-right" style="margin-top: -21px">
        <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
          <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
        </el-tooltip>
      </el-button-group>
    </div>
    <div class="container">
      <!--操作与搜索-->
      <div class="plugins-tips">
        <!--<div class="handle-box">-->
        <el-form
          :inline="true"
          :model="formInline"
          @keyup.enter.native="getData"
          onsubmit="return false"
          class="demo-form-inline"
        >
          <el-form-item label>
            <el-input placeholder="请输入账户ID" v-model="formInline.uid"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData" :disabled="!formInline.uid">查询</el-button>
          </el-form-item>
        </el-form>
        <!--</div>-->
      </div>
      <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable">
        <el-table-column label="时间" width="180" prop="create">
          <template slot-scope="scope">
            <span>{{scope.row.create | toTimeStr}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="ruleName" label="项目名称">
          <template slot-scope="scope">
            <span>{{scope.row | getDictValue('ruleName')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="coin" label="币种">
          <template slot-scope="scope">
            <span>{{scope.row | getDictValue('coin')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="数量">
          <template slot-scope="scope">
            <span>{{scope.row | getDictValue('balance')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="profit" label="收益">
          <template slot-scope="scope">
            <span>{{scope.row | getDictValue('profit')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="状态">
          <template slot-scope="scope">
            <el-tag
              :type="results[scope.row.result]['type']"
            >{{results[scope.row.result] | getDictValue('text')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="180" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="goDetail(scope.row)">收益明细</el-button>
            <el-button
              size="mini"
              v-if="scope.row.result == 0"
              :disabled="getPerms('lock:query:unlock')"
              class="red"
              type="text"
              @click="unLock(scope.row._id)"
            >解锁</el-button>
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

export default {
  name: "results",
  data() {
    return {
      resultList: [],
      currentPage: 1,
      totalItems: 0,
      loading: false,
      results: {
        0: { text: "进行中", type: "warning" },
        1: { text: "已完成", type: "success" }
      },
      formInline: {
        uid: ""
      }
    };
  },
  mounted() {},
  methods: {
    async getData() {
      if (!this.formInline.uid) return;
      this.loading = true;
      try {
        let result = await lockApi.lockUserQuery({
          uid: this.formInline.uid,
          p: this.currentPage
        });
        this.resultList = result.data;
        this.totalItems = result.count;
        this.loading = false;
      } catch (e) {}
    },
    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    goDetail(item) {
      this.$router.push({
        path: "/lock/query/detail",
        query: {
          ruleId: item.ruleId,
          uid: item.uid
        }
      });
    },
    async unLock(id) {
      if (!id) return;
      this.$confirm("你确定解锁吗?", "提示")
        .then(async () => {
          try {
            let result = await lockApi.lockExit({
              id
            });
            this.getData();
            this.$message.success("解锁成功");
          } catch (e) {}
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
</style>
