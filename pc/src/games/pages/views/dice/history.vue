<template>
  <div class="history_main">
    <el-tabs v-model="tabOrderAct" @tab-click="tabOrders" header-row-class-name="abcd">
      <!--我的挂单-->
      <el-tab-pane label="所有投注" name="recordList">
        <div class="myOrders">
          <el-table :data="recordList" height="550" v-loading="ordersLoading">
             <template slot="empty">
                  <i class="icon-no-data"></i>
                 <p>暂无数据</p>
                  </template>
            <el-table-column prop="create" width="90" label="用户">
              <template slot-scope="scope">
                <span>{{scope.row.uid}}</span>
              </template>
            </el-table-column>
            <el-table-column label="幸运数" width="90">
              <template slot-scope="scope">
                <span :class="getColor(scope.row.isWin)">{{scope.row.lucky}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="奖励">
              <template slot-scope="scope">
                <span :class="getColor(scope.row.isWin)">{{scope.row.profit}} {{scope.row.coin}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <!--我的成交-->
      <el-tab-pane label="我的投注" name="myRecordList">
        <div class="myOrderHistory">
          <el-table :data="myRecordList" height="550" v-loading="ordersLoading">
             <template slot="empty">
                  <i class="icon-no-data"></i>
                 <p>暂无数据</p>
                  </template>
            <el-table-column prop="create" width="90" label="用户">
              <template slot-scope="scope">
                <span>{{scope.row.uid}}</span>
              </template>
            </el-table-column>
            <el-table-column label="幸运数" width="90">
              <template slot-scope="scope">
                <span :class="getColor(scope.row.isWin)">{{scope.row.lucky}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="奖励">
              <template slot-scope="scope">
                <span :class="getColor(scope.row.isWin)">{{scope.row.profit}} {{scope.row.coin}}</span>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <!-- <div class="pagination" v-if="totalItems>1">
            <el-pagination
              background
              small
              @current-change="handleCurrentChange"
              :page-size="20"
              layout="prev, pager, next"
              :total="totalItems"
            ></el-pagination>
          </div> -->
        </div>
      </el-tab-pane>
    </el-tabs>
  <el-button type="text" @click="goHistorybooks" class="view-more pull-right">查看更多></el-button>
  </div>
</template>
<script>
import diceApi from "@/api/dice";

export default {
  data() {
    return {
      ordersLoading: false,
      resultList: [],
      currentPage: 1,
      totalItems: 0,
      tabOrderAct: "recordList",
      // recordList: [], //所有投注记录
      myRecordList: [] //我的投注记录
    };
  },
  props: ["recordList", "myRecord"],
  mounted() {
    // this.rollHistory();
    // this.rollPlayerHistory();
  },
  computed: {

  },
  watch: {
    myRecord(newVal, oldVal) {
      let list = this.myRecordList;
      let upData = this.myRecord;
      if (upData && upData["uid"]) {
        list.unshift(upData);
      }
      this.myRecordList = list;
    }
  },
  methods: {
    goHistorybooks(){
        this.$router.push('/dice/historybooks');
    },
    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val;
      this.rollPlayerHistory();
    },
    // 获取投注记录
    async rollHistory() {
      try {
        let result = await diceApi.rollHistory();
        // this.recordList = result.data;
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
      if (tab.name == "myRecordList") {
        this.myRecordList = [];
        this.rollPlayerHistory();
      }
      // if (tab.name == 'myOrders') {
      //     this.marketMyOrders();//用户挂单
      // } else {
      //     this.getmyOrderHistory();//获取用户交易历史
      // }
    }
  }
};
</script>
<style lang="scss" scoped>
.view-more{
  color: #ffbc06!important;
}
</style>