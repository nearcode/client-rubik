<template>
  <div>
    <div class="dealHistory">
      <h2 class="title">最新成交</h2>
      <el-table
        :data="dealHistory"
        cell-class-name="last-order-col"
        header-cell-class-name="last-order-th"
      >
      <template slot="empty">
                  <i class="icon-no-data"></i>
                 <p>暂无数据</p>
                  </template>
        <!--<el-table-column prop="type" label="类型">-->
        <!--<template slot-scope="scope">-->
        <!--<span class="font_green" v-if="scope.row && scope.row.type===1">买入</span>-->
        <!--<span class="font_red" v-else>卖出</span>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column prop="price" label="价格">
           
          <template slot-scope="scope">
            <span :class="scope.row.type===1?'font_green':'font_red'">{{scope.row.price}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="amount" label="成交数量">
          <template slot-scope="scope">
            <span>{{scope.row.amount | autoNumber}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="create" label="时间" align="right">
          <template slot-scope="scope">
            <span class="font-gray">{{scope.row.create|timer}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="成交量">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.price * scope.row.amount|autoNumber}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  props: ["dealHistory"]
};
</script>
<style lang="less" scoped>
.dealHistory {
  .title {
    // font-weight: bold;
    height: 45px;
    // background-color: @light-blue;
    // border-bottom: 1px solid #ebeef5;
    line-height: 45px;
    text-align: center;
  }
  /deep/ .last-order-col,
  /deep/ .last-order-th {
    font-size: 12px;
    border: none;
    padding: 0;
    font-family: Roboto, sans-serif;
  }
  /deep/ .last-order-col .cell {
    padding: 0 5px;
  }
  /deep/ .last-order-th {
    padding: 10px 0 0px;
  }
}
.dealHistory {
  /*margin-top: 15px;*/
  /*background-color: #f2f6fa;*/
  /*line-height: 2.85rem;*/
  width: 100%;
  text-align: left;
}
</style>