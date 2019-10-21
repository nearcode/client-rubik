<template>
  <div class="info">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>机器人管理</el-breadcrumb-item>
        <el-breadcrumb-item>交易所</el-breadcrumb-item>
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
          @click="addExchange"
          :disabled="getPerms('robot:exchange:add')"
        >新增</el-button>
      </div>
      <!-- 列表 -->

      <el-table :data="resultList" v-loading="loading" border style="width: 100%" class="table">
        <el-table-column label="名称">
          <template slot-scope="scope">{{scope.row | getDictValue('name')}}</template>
        </el-table-column>

        <el-table-column prop="markets" label="支持交易对">
          <template slot-scope="scope">
            <span v-for="(v,k) in scope.row.markets" :key="k">
              <el-tag>{{v | toString}}</el-tag>
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="isRun" align="center" label="是否运行">
          <template slot-scope="scope">{{scope.row.isRun?'运行':'停止'}}</template>
        </el-table-column>

        <el-table-column prop="fee" label="手续费">
          <template slot-scope="scope">{{scope.row | getDictValue('fee') }}</template>
        </el-table-column>

        <el-table-column prop="edit" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              :disabled="getPerms('robot:exchange:edit')"
              @click="edit(scope.row)"
            >修改</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              :disabled="getPerms('robot:exchange:del')"
              class="red"
              @click="handleDelete(scope.row)"
            >删除</el-button>
            <el-tooltip :content="'是否运行：'+ scope.row.isRun" placement="top">
              <el-switch :disabled="getPerms('robot:exchange:state')"  @change="changeSwitch($event,scope.row)" v-model="scope.row.isRun"></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <up-date ref="upDateDialog" v-on:upData="setData"></up-date>
  </div>
</template>

<script>
import _ from "lodash";
import robotApi from "@/api/robot";
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
    // 更新状态
    async changeSwitch(state, item) {
      if (!item) return;
      try {
        let result = await robotApi.exchangeState({
          name: item.name,
          state: state ? "start" : "stop"
        });
        this.$message.success("状态更新成功");
      } catch (e) {
          item.isRun = !item.isRun;
      }
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
        callback: this.editSubmit
      });
    },
    // 获取数据
    async getData() {
      this.loading = false;
      try {
        let result = await robotApi.exchangeList();
        this.loading = false;
        this.resultList = result.data;
      } catch (e) {}
    },
    // 修改
    async editSubmit(){
       try {
        let result = await robotApi.exchangeEdit({
          name: this.datas.name,
          key: this.datas.key,
          secret: this.datas.secret,
          markets: this.datas.markets,
          fee: this.datas.fee,
          id:this.datas._id,
          data:this.datas.data
        });
        this.$message.success("修改成功");
        this.getData();
        this.$refs.upDateDialog.cancel();
      } catch (e) {}
    },
    // 新增
    async addSubmit() {
      try {
        let result = await robotApi.exchangeAdd({
          name: this.datas.name,
          key: this.datas.key,
          secret: this.datas.secret,
          markets: this.datas.markets,
          fee: this.datas.fee,
          data:this.datas.data
        });
        this.$refs.upDateDialog.cancel();
        this.$message.success("添加成功");
        this.getData();
      } catch (e) {}
    },
    // 删除
    handleDelete(item) {
      this.$confirm("你确定删除“" + item.name + "”吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            let result = await robotApi.exchangeDel({
              name: item.name
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
