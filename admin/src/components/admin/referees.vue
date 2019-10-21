<template>
  <div class="PaymentRecords">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>推荐人关系</el-breadcrumb-item>
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
      <div class="plugins-tips clearfix">
        <div style="width:300px;">
          <el-input v-model="search" placeholder="请输入账户ID">
            <el-button slot="append" :disabled="!search" @click="getData" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <el-tree :data="resultList" node-key="id" default-expand-all @node-click="handleNodeClick">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>第{{node.level}}级 ({{ node.label }})</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>


<script>
import baseApi from "@/api/admin";

export default {
  name: "PaymentRecords",
  data() {
    return {
      resultList: [],
      currentPage: 1,
      search: "",
      totalItems: 0,
      loading: true,
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  mounted() {
  },

  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    // 获取数据
    async getData() {
      if (!this.search) return;
      try {
        let result = await baseApi.referrerTree({
          uid: this.search
        });
        let data = result.data;

        this.resultList = result.data;
      } catch (e) {}
    }
  }
};
</script>

<style scoped>
</style>
