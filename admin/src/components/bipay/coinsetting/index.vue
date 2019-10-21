<template>
  <div class="info">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>BIPAY管理</el-breadcrumb-item>
        <el-breadcrumb-item>币种设置</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group class="pull-right" style="margin-top: -21px">
        <!--<el-tooltip class="item" effect="dark" content="导出表格" placement="top">-->
        <!--<el-button icon="el-icon-download">导出</el-button>-->
        <!--</el-tooltip>-->
        <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
          <el-button icon="el-icon-refresh" @click="getCoinsList">刷新</el-button>
        </el-tooltip>
      </el-button-group>
    </div>
    <div class="container">
      <!--操作与搜索-->
      <div class="plugins-tips">
        <el-button type="primary" @click="showDialog" :disabled="getPerms('bipay:coinsetting:update')">选择</el-button>
        <!-- <span style="color: #5e6d82;font-size: 14px">请选择网站需要显示的币种</span> -->
      </div>
      <el-dialog :title="'选择币种'" :visible.sync="dialogTableVisible">
        <el-form ref="form" :model="form" label-width="0">
          <el-form-item prop="coins">
            <!-- <el-row> -->
              <!-- <el-col :md="4" :sm="6" :xs="8" v-for="(value, key) in selectCoins " :key="key"> -->
                  <el-checkbox-group v-model="form.selectCoins">
                        <el-checkbox v-for="(value, key) in coins" :label="value.coin" name="type" :key="key">
                            {{value.coin}}
                            <small>({{value.chineseName}})</small>
                        </el-checkbox>
                 </el-checkbox-group>
              <!-- </el-col> -->
            <!-- </el-row> -->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit()">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-table :data="resultList" v-loading="loading" border style="width: 100%" class="table">
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span>{{scope.row.englishName}} ({{scope.row.chineseName}})</span>
          </template>
        </el-table-column>
        <el-table-column prop="coin" label="简称">
          <template slot-scope="scope">{{scope.row.coin}}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import bipayApi from "@/api/bipay";
import { mapState } from "vuex";
 import _ from "lodash"

export default {
  name: "bipaycoins",
  data() {
    return {
      resultList: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      coinsList: [],
      form: {
          selectCoins:[]
      },
      loading: false
    };
  },
  computed: {
    ...mapState(["coins"]),
  },
  mounted() {
    this.getCoinsList(); //获取选中的币种
  },
  methods: {
    showDialog() {
      this.dialogTableVisible = true;
    },
    async getCoinsList() {
      //获取选中的币种
      this.loading = true;
      try {
        let result = await bipayApi.getCoins();
        this.loading = false;
        let data = [];
        let coinsList = result.data;
        let selectCoins=[];

        for (let k in coinsList) {
          coinsList[k].coin = k;
          selectCoins.push(k)
          data.push(coinsList[k]);
        }
        
        this.resultList = data;
        // 设置默认选中
        this.$set(this.form,'selectCoins',selectCoins);

      } catch (e) {}
    },
    // 选择需要的币种
    async submit() {
      try {
        let result = await bipayApi.coinsUpdate({ coins: this.form.selectCoins });
        this.getCoinsList();
        this.$message.success('更新成功');
        this.dialogTableVisible = false;
      } catch (e) {}
    },
  }
};
</script>

<style>
.container-fluid {
  background-color: #eef1f6;
  padding: 15px 15px 5px;
}

.text.item p {
  margin-bottom: 5px;
}

.el-row {
  margin-bottom: 20px !important;
}

.el-row:last-child {
  margin-bottom: 0 !important;
}
</style>
