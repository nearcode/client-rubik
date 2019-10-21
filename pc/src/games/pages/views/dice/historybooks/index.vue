<template>
  <div class="banker dice At_the_bottom">
    <div class="container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-page-header @back="goBack" content="投注记录"></el-page-header>
        </div>
        <div>
          <el-tabs v-model="tabOrderAct" @tab-click="tabOrders">
            <!--我的挂单-->
            <el-tab-pane label="所有投注" name="recordList"></el-tab-pane>
            <!--我的成交-->
            <el-tab-pane label="我的投注" name="myRecordList"></el-tab-pane>
          </el-tabs>

          <el-table :data="getResultList" height="550" v-loading="ordersLoading">
            <template slot="empty">
              <i class="icon-no-data"></i>
              <p>暂无数据</p>
            </template>
            <!-- 用户ID -->
            <el-table-column v-if="tabOrderAct == 'recordList'" prop="create" label="用户">
              <template slot-scope="scope">
                <span>{{scope.row | getDictValue('uid')}}</span>
              </template>
            </el-table-column>
            <!-- 投注ID -->
            <el-table-column v-if="tabOrderAct == 'myRecordList'" prop="create" label="投注ID">
              <template slot-scope="scope">
                <span class="det_id" @click="betUp(scope.row)">{{setLimit(scope.row._id)}}</span>
              </template>
            </el-table-column>
            <!-- 投注 -->
            <el-table-column label="投注">
              <template slot-scope="scope">
                <el-tag>{{scope.row | getDictValue('bet')}}</el-tag>
              </template>
            </el-table-column>
            <!-- 倍数 -->
            <el-table-column label="倍数">
              <template slot-scope="scope">
                <span>{{scope.row | getDictValue('payout')}}X</span>
              </template>
            </el-table-column>
            <!-- 范围 -->
            <el-table-column label="范围">
              <template slot-scope="scope">
                <span>{{scope.row | getDictValue('min')}}-{{scope.row | getDictValue('max')}}</span>
              </template>
            </el-table-column>
            <!-- 幸运数 -->
            <el-table-column label="幸运数">
              <template slot-scope="scope">
                <span :class="getColor(scope.row.isWin)">{{scope.row.lucky}}</span>
              </template>
            </el-table-column>
            <!-- 奖励 -->
            <el-table-column prop="price" label="奖励">
              <template slot-scope="scope">
                <span
                  :class="getColor(scope.row.isWin)"
                >{{scope.row | getDictValue('profit',0)}} {{scope.row | getDictValue('coin')}}</span>
              </template>
            </el-table-column>
            <!-- 时间 -->
            <el-table-column width="180" prop="create" label="时间">
              <template slot-scope="scope">
                <span>{{scope.row.create | toTimeStr}}</span>
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
    </div>
    <v-bet ref="betup"></v-bet>
  </div>
</template>
<script>
import diceApi from "@/api/dice";
import vBet from "./bet";

export default {
  data() {
    return {
      ordersLoading: false,
      resultList: [],
      currentPage: 1,
      totalItems: 0,
      tabOrderAct: "recordList",
      recordList: [], //所有投注记录
      myRecordList: [] //我的投注记录
    };
  },
  mounted() {
    this.rollHistory();
  },
  components: {
    vBet
  },
  computed: {
    getResultList() {
      let data = [];
      // 我的投注
      if (this.tabOrderAct == "myRecordList") {
        data = this.myRecordList;
      }
      // 所有投注
      if (this.tabOrderAct == "recordList") {
        data = this.recordList;
      }
      return data;
    }
  },
  methods: {
    betUp(){
      this.$refs.betup.dialogVisible=true;
    },
    // 截取字符
    setLimit(str) {
      if (str && str.length > 6)
        return str.substring(str.length - 6, str.length);
    },
    // 返回
    goBack() {
      this.$router.push("/games/dice");
    },
    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val;
      // 我的投注
      if (this.tabOrderAct == "myRecordList") {
        this.rollPlayerHistory();
      }
      // 所有投注
      if (this.tabOrderAct == "recordList") {
        this.rollHistory();
      }
    },
    // 获取所有投注记录
    async rollHistory() {
      this.ordersLoading = true;
      try {
        let result = await diceApi.rollHistory({
          p: this.currentPage
        });
        this.recordList = result.data;
        this.totalItems = result.count;
        this.ordersLoading = false;
      } catch (e) {}
    },
    // 我的投注
    async rollPlayerHistory() {
      this.ordersLoading = true;
      try {
        let result = await diceApi.rollPlayerHistory({
          p: this.currentPage
        });
        this.ordersLoading = false;
        this.myRecordList = result.data;
        this.totalItems = result.count;
      } catch (e) {}
    },
    // 设置文字颜色
    getColor(state) {
      if (state) {
        return "font_green";
      } else {
        return "font_red";
      }
    },
    tabOrders(tab, event) {
      this.currentPage = 1;
      this.totalItems = 0;

      if (tab.name == "myRecordList") {
        this.rollPlayerHistory();
      }
      if (tab.name == "recordList") {
        this.rollHistory(); //用户挂单
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.det_id {
  cursor: pointer;
  text-decoration: underline;
}
.det_id:hover {
  color: #ffbc06;
}
</style>