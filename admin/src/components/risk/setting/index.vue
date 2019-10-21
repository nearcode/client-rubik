<template>
  <div class="info">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>风控管理</el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
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
      <el-form ref="form" :model="form" label-width="180px">
        <el-form-item label>
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label>
          <el-input v-model="form.coin"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
            :disabled="getPerms('risk:setting:edit')"
          >保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import adminApi from "@/api/admin";
import config from "@/config";

export default {
  name: "email",
  data() {
    return {
      urlAction: config.baseUrl + "/account/upload",
      form: {}
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 获取数据
    async getData() {
      try {
        let result = await adminApi.siteInfo();
        if (!result.data.zendesk) {
          result.data.zendesk = {};
        }
        this.form = result.data;
        if (!this.form.domains) {
          this.$set(this.form, "domains", []);
        }
      } catch (e) {}
    },
    async onSubmit() {
      try {
        let result = await adminApi.changeSiteInfo();
        this.getData();
        this.$message.success("保存成功");
      } catch (e) {}
    }
  }
};
</script>

<style scoped>
</style>
