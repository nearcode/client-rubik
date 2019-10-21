<template>
  <div class="Administrator">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>锁仓管理</el-breadcrumb-item>
        <el-breadcrumb-item>业绩</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group class="pull-right" style="margin-top: -21px">
        <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
          <el-button icon="el-icon-refresh" @click="onSubmit">刷新</el-button>
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
          @keyup.enter.native="onSubmit"
          class="demo-form-inline"
        >
          <el-form-item label="锁仓规则">
            <el-select v-model="formInline.ruleId" filterable clearable placeholder="请选择锁仓规则">
              <el-option :label="v.name" v-for="(v,k) in ruleList" :key="k" :value="v._id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label>
            <el-input placeholder="请输入账户ID" v-model="formInline.uid"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="!formInline.ruleId || !formInline.uid">查看</el-button>
          </el-form-item>
        </el-form>
        <!--</div>-->
      </div>
      <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable">
        <el-table-column label="旗下人数" width="180" prop="people"></el-table-column>

        <el-table-column prop="totalCoin" label="参与币数"></el-table-column>

        <el-table-column prop="totalMoney" label="总收益">
          <!-- <template slot-scope="scope">
            <span>{{scope.row.balance | autoFixed}}</span>
          </template>-->
        </el-table-column>
      </el-table>
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
      ruleList: [],
      loading: false,
      formInline: {
        uid: "",
        ruleId: ""
      }
    };
  },
  mounted() {
    this.getLockRule();
  },
  methods: {
    async getLockRule() {
      try {
        let result = await lockApi.lockRuleList();
        this.ruleList = result.data;
      } catch (e) {}
    },
    async onSubmit() {
      if (!this.formInline.uid || !this.formInline.ruleId) return;
      
      this.loading = true;

      try {
        let result = await lockApi.lockRule({
          uid: this.formInline.uid,
          ruleId: this.formInline.ruleId
        });
        this.loading = false;

        let data = [];
        data.push(result.data);
        this.resultList = data;
      } catch (e) {}
    }
  }
};
</script>

<style scoped>
</style>
