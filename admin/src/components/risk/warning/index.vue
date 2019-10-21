<template>
  <div class="coins">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>风控管理</el-breadcrumb-item>
        <el-breadcrumb-item>风险警告</el-breadcrumb-item>
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
      <el-table v-loading="loading" :data="resultList" border class="table">
        <el-table-column prop="chineseName" label="时间">
          <template slot-scope="scope">{{scope.row.create | toTimeStr}}</template>
        </el-table-column>
        <el-table-column prop="alias" label="类型" align="center">
          <template slot-scope="scope">{{types[scope.row.type]['name']}}</template>
        </el-table-column>
        <el-table-column prop="alias" label="描述" width="300">
          <template slot-scope="scope">{{scope.row | getDictValue('content')}}</template>
        </el-table-column>
        <el-table-column label="风险等级" align="center">
          <template slot-scope="scope">
            <el-tag
              type="danger"
              v-for="(v,k) in levels"
              :key="k"
              v-if="scope.row.level == v.level"
            >{{v.text}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="账户" align="center">
          <template slot-scope="scope">{{scope.row | getDictValue('uid')}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.result==0"
              @click="confirm(scope.row._id)"
              type="primary"
              size="mini"
            >确认</el-button>
            <el-tag v-if="scope.row.result==1" type="info">已确认</el-tag>
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
import riskApi from "@/api/risk";

export default {
  name: "history",
  data() {
    return {
      resultList: [],
      totalItems: 0,
      currentPage: 1,
      loading: true,
      types: {
        1: {
          name: "对账"
        }
      },
      levels: [
        { type: "info", level: 1, text: "低" },
        { type: "warning", level: 2, text: "中" },
        { type: "danger", level: 3, text: "高" }
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
      this.getData();
    },
    // 获取数据
    async getData() {
      this.loading = true;
      try {
        let result = await riskApi.riskLog({
          p: this.currentPage
        });
        this.loading = false;
        this.resultList = result.data;
        this.totalItems = result.count;
      } catch (e) {}
    },
    // 确认
    confirm(id) {
      this.$confirm("是否确认", "提示", {
        type: "warning"
      })
        .then(async () => {
          try {
            let result = await riskApi.riskConfirm({
              id
            });
            this.getData();
            this.$message.success("确认成功!");
          } catch (e) {}
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.font_blue {
  color: #409eff !important;
}
</style>
