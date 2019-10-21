<template>
  <div class="info">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务管理</el-breadcrumb-item>
        <el-breadcrumb-item>手续费账户</el-breadcrumb-item>
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
        <el-table-column label="类别" prop="total">
          <template slot-scope="scope">手续费</template>
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
        <el-table-column label="总收益" prop="total"></el-table-column>
        <el-table-column label="操作" prop="desc">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="freeTransfer()">划转</el-button>
            <el-button size="mini" @click="goHistory(scope.row._id)">划转详细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import baseApi from "@/api/admin";

export default {
  data() {
    return {
      loading:true,
      resultList: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      try {
        let result = await baseApi.freeAccount({ uid: "-1" });
        let data = [];
        data.push(result["data"]);
        this.loading = false;
        this.resultList = data;
      } catch (e) {}
    },
    async freeTransfer() {
      this.$prompt("请输入用户ID", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: value => {
          if (!value) return false;
        },
        inputErrorMessage: "参数不能为空"
      })
        .then(async ({ value }) => {
          try {
            let result = await baseApi.freeTransfer({
              to: value
            });
            this.$message.success("划转成功");
          } catch (e) {}
        })
        .catch(() => {});
    },
    goHistory(id) {
      this.$router.push(`/finance/fee/transfer`);
    }
  }
};
</script>
<style scoped>
</style>
