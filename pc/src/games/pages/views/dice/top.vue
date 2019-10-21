<template>
  <div class="game-header">
    <div class="realMarketHeader">
      <el-table :data="money" style="width: 100%">
        <el-table-column prop="type" width="80" align="center" label>
          <template slot-scope="scope">
            <span style="font-size:16px;">{{scope.row['type']}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bets" align="center" label="投注">
          <template slot-scope="scope">
            <span>{{scope.row | getDictValue('bets')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="profits" align="center" label="利润">
          <template slot-scope="scope">
            <span>{{scope.row | getDictValue('profits')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="losses" align="center" label="输">
          <template slot-scope="scope">
            <span>{{scope.row | getDictValue('losses')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="wins" align="center" label="赢">
          <template slot-scope="scope">
            <span>{{scope.row | getDictValue('wins')}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="game-explain">
      <ul class="game-nav">
        <li  @click="goBanker">
          <i class="el-icon-user-solid"></i>
          <p>做庄</p>
          <!-- <el-button type="text" size="medium" icon="el-icon-user-solid" @click="goBanker">做庄</el-button> -->
        </li>
        <li @click="goRules">
          <i class="el-icon-warning"></i>
          <p>规则</p>
          <!-- <el-button type="text" size="medium" icon="el-icon-warning" @click="goRules">规则</el-button> -->
        </li>
        <li>
          <i class="el-icon-connection"></i>
          <p>公平</p>
          <!-- <el-button type="text" size="medium" icon="el-icon-connection">公平</el-button> -->
        </li>
      </ul>
    </div>
    <!-- 规则弹窗 -->
    <v-rules ref="rulesDialog"></v-rules>
  </div>
</template>
<script>
import vRules from "./rules";

export default {
  props: ["money"],
  data() {
    return {};
  },
   components: {
    vRules
  },
  methods: {
    // 查看规则
    goRules() {
      this.$refs.rulesDialog.dialogVisible = true;
    },
    // 做庄
    goBanker() {
      this.$router.push("/dice/banker");
    }
  }
};
</script>
<style lang="scss" scoped>
$bg-color: transparent;
$primary-color: #ffbc06; //主要颜色
// 头部数据
.game-header {
  box-shadow: -8px 8px 50px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
  display: flex;
  padding: 10px;
  justify-content: space-between;
  .realMarketHeader {
    flex: none;
    width: 70%;
    /deep/ .el-table--small th,
    /deep/ .el-table--small td {
      padding: 3px 0 !important;
    }
  }
  .game-explain {
    flex: auto;
    // width: 340px;
    position: relative;
    padding-left: 10px;
    .game-nav {
      display: flex;
      height: 100%;
      color: #fff;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      color: $primary-color;
      cursor: pointer;
      i{
          font-size: 26px;
      }
    }
    .game-nav::after {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(0, -50%);
      width: 1px;
      height: 80%;
      background-color: rgba(255, 255, 255, 0.2);
      right: 0;
      content: "";
    }
  }
}
</style>