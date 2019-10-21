<template>
  <div class="link">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>锁仓管理</el-breadcrumb-item>
        <el-breadcrumb-item>锁仓规则</el-breadcrumb-item>
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
        <el-button @click="addUnlock" :disabled="getPerms('lock:rules:add')">新增规则</el-button>
      </div>
      <!--列表-->
      <el-table
        @cell-click="viewDetails"
        :data="resultList"
        border
        :cell-style="cellStyle"
        v-loading="loading"
        class="table"
      >
        <el-table-column prop="create" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.create | toTimeStr}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="coin" label="币种"></el-table-column>
        <el-table-column prop="isEnable" label="模式">
          <template slot-scope="scope">
            <el-tag v-for="(v,k) in scope.row.pattern" :key="k">
              <span>{{patterns[v]}}</span>
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="unlock(scope.row)"
              :disabled="getPerms('lock:rules:unlock')"
            >解锁</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="edit(scope.row)"
              :disabled="getPerms('lock:rules:edit')"
            >修改</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              :disabled="getPerms('lock:rules:del')"
              @click="lockRuleDel(scope.row._id)"
            >删除</el-button>
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
    <!--弹框-->
    <v-upData ref="dateDialog" v-on:upData="setData"></v-upData>
    <!-- 解锁弹框 -->
    <v-unlock ref="unlockDialog" :unlockLoad="unlockLoad" v-on:upData="unlockSubmit"></v-unlock>
  </div>
</template>

<script>
import _ from "lodash";
import lockApi from "@/api/lock";
import vUpData from "./upData";
import vUnlock from "./unlock";

export default {
  name: "share",
  data() {
    return {
      currentPage: 1,
      resultList: [],
      unlockLoad: false,
      form: {},
      totalItems: 0,
      loading: false,
      datas: {},
      type: "",
      rules: {
        coin: [{ required: true, message: "请选择币种", trigger: "blur" }]
      },
      patterns: {
        unlock: "解锁",
        referrer: "推荐"
      }
    };
  },
  components: {
    vUpData,
    vUnlock
  },
  mounted() {
    this.getData();
  },
  methods: {
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === "名称") {
        return "font-weight:bold;cursor: pointer;";
      } else {
        return "";
      }
    },
    viewDetails(row, column, cell, event) {
      if (column.property == "name") {
        this.$router.push(`/lock/rules/${row._id}`);
        console.log(row, column, cell, event);
      }
    },
    setData(item) {
      item = _.cloneDeep(item);
      // 替换成服务器所需要的格式
      let data = [];
      for (let i of item.inviteModes) {
        data.push(i.rate);
      }
      this.datas = item;

      this.datas["inviteModes"] = data;
      // 处理描述换行问题
      if (this.datas["memo"]) {
        this.datas["memo"] = this.datas["memo"].replace(/\n/g, "<br/>");
      }
    },
    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    async unlockSubmit(item) {
      if (!item.price) return;
      this.unlockLoad = true;
      try {
        let result = await lockApi.unlock({
          price: item.price,
          id: item._id
        });
        this.$message.success("解锁成功");
        this.$refs.unlockDialog.cancel();
        this.unlockLoad = false;
      } catch (e) {
        this.unlockLoad = false;
      }
    },
    unlock(item) {
      let layer = this.$refs.unlockDialog;
      layer.show({
        form: item
      });
    },
    // 关闭弹窗重置表单
    closeDialog(formName) {
      if (formName) {
        this.resetForm(this, formName);
      }
    },
    // 获取数据
    async getData() {
      try {
        let result = await lockApi.lockRuleList({
          p: this.currentPage
        });
        let data = result.data || [];
        for (let item of data) {
          item.pattern = [];
          if (
            item.inviteModes &&
            typeof item.inviteModes == "object" &&
            item.inviteModes.length > 0
          ) {
            item.pattern.push("referrer");
          }
          if (
            item.lockModes &&
            typeof item.lockModes == "object" &&
            item.lockModes.length > 0
          ) {
            item.pattern.push("unlock");
          }
        }
        this.resultList = data;
        this.totalItems = result.count;
      } catch (e) {}
    },
    // 确定操作
    async addSubmit() {
      console.log(this.datas);
      try {
        let result = await lockApi.lockRuleAdd({
          name: this.datas.name,
          coin: this.datas.coin,
          type: this.datas.type,
          market: this.datas.market,
          enabled: this.datas.enabled,
          lockModes: this.datas.lockModes,
          inviteModes: this.datas.inviteModes,
          referrals: this.datas.referrals,
          moneyLimit: this.datas.moneyLimit,
          unitPeople: this.datas.unitPeople,
          isLockPlay: this.datas.isLockPlay,
          memo: this.datas.memo
        });
        this.getData();
        this.$message.success("添加成功");
        this.$refs.dateDialog.cancel();
      } catch (e) {}
    },
    // 修改确定
    async editSubmit() {
      try {
        let result = await lockApi.lockRuleEdit({
          name: this.datas.name,
          coin: this.datas.coin,
          type: this.datas.type,
          market: this.datas.market,
          enabled: this.datas.enabled,
          lockModes: this.datas.lockModes,
          id: this.datas._id,
          inviteModes: this.datas.inviteModes,
          referrals: this.datas.referrals,
          moneyLimit: this.datas.moneyLimit,
          unitPeople: this.datas.unitPeople,
          isLockPlay: this.datas.isLockPlay,
          memo: this.datas.memo
        });
        this.getData();
        this.$message.success("修改成功");
        this.$refs.dateDialog.cancel();
      } catch (e) {}
    },
    addUnlock() {
      let layer = this.$refs.dateDialog;
      layer.show({
        dialogType: "add",
        callback: this.addSubmit
      });
    },
    //删除锁仓规则
    lockRuleDel(id) {
      if (!id) return;
      this.$confirm("你确定删除吗?", "提示")
        .then(async () => {
          try {
            let result = await lockApi.lockRuleDel({ id });
            this.getData();
            this.$message.success("删除成功");
          } catch (e) {}
        })
        .catch(() => {});
    },
    edit(item) {
      this.form = _.clone(item);
      // 替换成web所需要的格式
      let data = [];
      for (let i in this.form.inviteModes) {
        data.push({
          level: Number(i) + 1,
          rate: this.form.inviteModes[i]
        });
      }
      this.form["inviteModes"] = data;

      if (this.form["memo"]) {
        var reg = new RegExp("<br/>", "g");

        this.form["memo"] = this.form["memo"].replace(reg, "\n");
      }

      let layer = this.$refs.dateDialog;
      layer.show({
        dialogType: "edit",
        form: this.form,
        callback: this.editSubmit
      });
    }
  }
};
</script>

<style scoped>
</style>
