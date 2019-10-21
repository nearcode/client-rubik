<template>
  <div class="info">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>币值管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目方</el-breadcrumb-item>
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
      <div class="plugins-tips">
        <el-button
          type="primary"
           :disabled="getPerms('mvm:issuer:upDate')"
          @click="addExchange"
        >新增</el-button>
      </div>
      <!-- 列表 -->

      <el-table :data="resultList" v-loading="loading" border style="width: 100%" class="table">
        <el-table-column label="账户">
          <template slot-scope="scope">{{scope.row | getDictValue('uid')}}</template>
        </el-table-column>

        <el-table-column prop="coin" label="币种">
          <template slot-scope="scope">
              <el-tag v-for="(v,k) in scope.row.coins" :key="k">{{v}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="edit" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              :disabled="getPerms('mvm:issuer:upDate')"
              @click="edit(scope.row)"
            >修改</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              :disabled="getPerms('mvm:issuer:del')"
              class="red"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <up-date ref="upDateDialog" v-on:upData="setData"></up-date>
  </div>
</template>

<script>
import _ from "lodash";
import mvmApi from "@/api/mvm";
import { mapState } from "vuex";
import upDate from "./upDate";

export default {
  name: "TradePair",
  data() {
    return {
      resultList: [],
      loading: true,
      datas:{},
    };
  },
  components: {
    upDate
  },
  computed: {
    ...mapState(["coins"])
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 把数据赋值过来
    setData(data) {
      this.datas = data;
    },
    // 新增
    addExchange() {

     let layer = this.$refs.upDateDialog;
      layer.init(this);

      layer.show({
        dialogType:'添加',
        callback: this.addSubmit
      });
    },
    // 修改
    edit(item) {
      if (!item) return;

      let layer = this.$refs.upDateDialog;
      layer.init(this);

      layer.show({
        dialogType:'修改',
        form:_.cloneDeep(item),
        callback: this.addSubmit
      });
    },
    // 获取数据
    async getData() {
      this.loading = true;
      try {
        let result = await mvmApi.issuerList();
        this.loading = false;
        this.resultList = result.data;
      } catch (e) {}
    },
    // // 修改
    // async editSubmit(){
    //    try {
    //     let result = await mvmApi.exchangeEdit({
    //         uid:this.datas.uid,
    //         coins:this.datas.coins
    //     });
    //     this.$message.success("修改成功");
    //     this.getData();
    //     this.$refs.upDateDialog.cancel();
    //   } catch (e) {}
    // },
    // 新增
    async addSubmit() {
      try {
        let result = await mvmApi.issuerAdd({
            uid:this.datas.uid,
            coins:this.datas.coins
        });
        this.$message.success("设置成功");
        this.getData();
        this.$refs.upDateDialog.cancel();
      } catch (e) {}
    },
    // 删除
    handleDelete(item) {
      this.$confirm("你确定删除“" + item.uid + "”吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            let result = await mvmApi.issuerDel({
              uid: item.uid
            });
            this.$message.success("删除成功!");
            this.getData();
          } catch (e) {}
        })
        .catch(() => {});
    }
  }
};
</script>

<style>
.pairMarket span:after {
  content: ",";
  display: inline-block;
  vertical-align: middle;
}

.pairMarket span:last-child:after {
  content: "" !important;
}
</style>
