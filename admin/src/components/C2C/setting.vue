<template>
  <div class="info">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>C2C管理</el-breadcrumb-item>
        <el-breadcrumb-item>C2C设置</el-breadcrumb-item>
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
        <el-form-item label="买币价格">
          <el-input v-model="form.buyPrice"></el-input>
        </el-form-item>
        <el-form-item label="卖币价格">
          <el-input v-model="form.sellPrice"></el-input>
        </el-form-item>
        <el-form-item label="币种">
          <el-select v-model="form.coin" filterable clearable placeholder="请选择">
            <el-option :label="k" v-for="(v,k) in coins" :key="k" :value="k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最大交易数量">
          <el-input v-model="form.max"></el-input>
        </el-form-item>
        <el-form-item label="最小交易数量">
          <el-input v-model="form.min"></el-input>
        </el-form-item>
        <el-form-item label="未处理数量">
          <el-input v-model="form.untreated"></el-input>
        </el-form-item>
        <el-form-item label="手续费分成">
          <el-input v-model="form.fee"></el-input>
        </el-form-item>
        <el-form-item label="是否暂停">
          <el-switch v-model="form.pause"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :disabled="getPerms('c2c:setting:edit')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import c2cApi from "@/api/c2c";
import { mapState } from "vuex";

export default {
  name: "email",
  data() {
    return {
      form: {}
    };
  },
  mounted() {
    console.error("setting", this.$route);
    this.getData();
  },
  computed: {
    ...mapState(["coins"])
  },
  methods: {
    async getData() {
      try {
        let result = await c2cApi.getC2C();
        this.form = result.data;
      } catch (e) {}
    },
    async onSubmit() {
      let data = {
        buyPrice: this.form.buyPrice,
        coin: this.form.coin,
        max: this.form.max,
        min: this.form.min,
        pause: this.form.pause,
        sellPrice: this.form.sellPrice,
        untreated: this.form.untreated,
        fee: this.form.fee
      };
      try {
        let result = await c2cApi.setC2C(data);
        this.getData();
        this.$message.success("保存成功");
      } catch (e) {}
      //
      // this.$axios({
      //         method: 'post',
      //         url: '/admin/c2c/set',
      //         data: {
      //             "buyPrice": this.form.buyPrice,
      //             "coin": this.form.coin,
      //             "max": this.form.max,
      //             "min": this.form.min,
      //             "pause": this.form.pause,
      //             "sellPrice": this.form.sellPrice,
      //             "untreated": this.form.untreated
      //         }
      //     }
      // ).then(result => {
      //     this.getData();
      //     this.$message.success('保存成功');
      // }).catch(error => {
      //     if (error && error.data.message)
      //         this.$message.error(this.$t(error.data.message));
      // })
    }
  }
};
</script>

<style scoped>
.container div {
  vertical-align: middle;
  height: 2rem;
  line-height: 2rem;
}

.el-row {
  margin-top: 10px;
}
</style>
