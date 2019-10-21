<template>
  <div>
    <el-dialog title="规则介绍" :visible.sync="dialogVisible" width="600">
      <div>
        <h3>玩法介绍</h3>
        <ul class="rules">
          <li>1. 选择需要投注货币</li>
          <li>2. 设置需要投注量</li>
          <li>3. 调整滑条上的滑块位置，投注股子号码范围，改变胜出机率</li>
          <li>4. 按下"投注"按钮进行投注，如果摇到股子号码在投注股子号码范围，立即中奖</li>
        </ul>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.rules {
  margin-top: 20px;
  li {
    line-height: 2;
  }
}
</style>