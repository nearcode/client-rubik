<template>
  <div class="At_the_bottom">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>锁仓记录</span>
        <el-button type="primary" class="pull-right" @click="addLock">锁仓</el-button>
      </div>
      <div class="text item">
        <!--操作-->
        <!-- <div class="plugins-tips">
          <el-button type="primary" @click="addLock">锁仓</el-button>
        </div>-->
        <el-table :data="resultList" v-loading="loading" ref="table" style="width: 100%">
          <template slot="empty">
            <i class="icon-no-data"></i>
            <p>暂无数据</p>
          </template>
          <el-table-column label="时间" width="180" align="center">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              {{scope.row.create | toTimeStr}}
            </template>
          </el-table-column>

          <el-table-column label="锁仓名称">
            <template slot-scope="scope">{{scope.row | getDictValue('ruleName')}}</template>
          </el-table-column>

          <el-table-column label="币种">
            <template slot-scope="scope">{{scope.row | getDictValue('coin')}}</template>
          </el-table-column>

          <el-table-column label="锁仓数量">
            <template slot-scope="scope">{{scope.row | getDictValue('amount')}}</template>
          </el-table-column>

          <el-table-column label="锁仓价值">
            <template slot-scope="scope">{{scope.row | getDictValue('balance')}}</template>
          </el-table-column>

          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag
                :type="statusList[scope.row.result].type"
              >{{statusList[scope.row.result].name}}</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="address" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="editLock(scope.row)">升级</el-button>
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
    </el-card>

    <!--弹框-->
    <v-upData ref="dateDialog" :loading="dialogLoading" v-on:upData="setData"></v-upData>
  </div>
</template>

<script>
import lockApi from "@/api/lock";
import vUpData from "./upData";
import { mapState } from "vuex";

export default {
  name: "Account",
  data() {
    return {
      resultList: [],
      dialogLoading: false,
      currentPage: 1,
      totalItems: 0,
      loading: false,
      datas: {},
      statusList: {
        0: {
          type: "warning",
          name: "进行中"
        },
        1: {
          type: "danger",
          name: "已完成"
        }
      },
      formInline: {
        date: []
      }
    };
  },
  computed: {
    ...mapState(["coins", "markets"])
  },
  components: {
    vUpData
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 添加锁仓
    addLock() {
      let layer = this.$refs.dateDialog;
      layer.show({
        dialogType: "add",
        callback: this.addSubmit
      });
    },
    // 升级锁仓
    editLock(item) {
      let info = _.cloneDeep(item);
      let layer = this.$refs.dateDialog;
      layer.show({
        dialogType: "edit",
        info: info,
        callback: this.editSubmit
      });
    },
    // 升级锁仓
    async editSubmit() {
      if (!this.datas._id || !this.datas.amount) return;
      this.dialogLoading = true;
      try {
        let result = await lockApi.lockUserupdate({
          ruleId: this.datas._id,
          amount: this.datas.amount
        });
        this.$notify.success("升级成功");
        this.getData();
        this.$refs.dateDialog.cancel();
        this.dialogLoading = false;
      } catch (e) {
        this.dialogLoading = false;
      }
    },
    // 添加锁仓
    async addSubmit() {
      if (this.dialogLoading || !this.datas._id || !this.datas.amount) return;
      this.dialogLoading = true;
      try {
        let result = await lockApi.lockUserCreate({
          ruleId: this.datas._id,
          amount: this.datas.amount
        });
        this.$notify.success("添加成功");
        this.getData();
        this.dialogLoading = false;
        this.$refs.dateDialog.cancel();
      } catch (e) {
        this.dialogLoading = false;
      }
    },
    // 接收弹框组件的数据
    setData(item) {
      this.datas = item;
    },
    // 获取数据
    async getData() {
      this.loading = true;
      //   let date = this.formInline.date;
      try {
        let data = {
          // market: this.formInline.pair,
          // startTime: date && date[0],
          // endTime: date && date[1],
          p: this.currentPage
        };
        let result = await lockApi.lockUserList(data);
        this.loading = false;
        this.resultList = result.data;
        this.totalItems = result.count;
      } catch (e) {}
    },
    // // 取消挂单
    // cancelOrder(id) {
    //   this.$confirm("你确定取消吗？")
    //     .then(async () => {
    //       try {
    //         let result = await exchangeApi.marketCancel(id);
    //         this.getData();
    //         this.$notify.success("取消成功");
    //       } catch (e) {
    //         console.log(e);
    //       }
    //     })
    //     .catch(() => {});
    // },

    handleCheck(row) {
      const $table = this.$refs.table;
      $table.toggleRowExpansion(row);
      $table.toggleRowSelection(row);
    },
    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    }
  }
};
</script>

<style>
.el-table__expand-column .cell {
  display: none;
}
</style>
