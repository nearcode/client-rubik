<template>
 <div>
      <el-dialog title="投注信息" :visible.sync="dialogVisible" width="600px">
    <div>
      <div class="header">
        <div class="left ">
          <p>投注ID 6b5541 <span style="font-size:16px;"><i class="icon-verified"><em class="path1"><em class="path2"></em></em></i>已验证</span> 
          <!-- <span>待验证 <i class="icon-doubt"></i></span> -->
          </p>
          <span>2019-10-15 16:23:00</span>
        </div>
        <span class="icon"><img src="@static/assets/games/win.png" /></span>
      </div>
      <div class="top">
        <el-row :gutter="10">
          <el-col :span="6">
            <!-- 投注 -->
            <el-card class="card-box">
              <h1>投注</h1>
              <p>100</p>
            </el-card>
          </el-col>
          <!-- 范围 -->
          <el-col :span="6">
            <el-card class="card-box">
              <h1>范围</h1>
              <p>1-50</p>
            </el-card>
          </el-col>
          <!-- 倍数 -->
          <el-col :span="6">
            <el-card class="card-box">
              <h1>倍数</h1>
              <p>2.02X</p>
            </el-card>
          </el-col>
          <!-- 盈利 -->
          <el-col :span="6">
            <el-card class="card-box">
              <h1>盈利</h1>
              <p>10</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="main">
        <el-form :model="form">
          <el-form-item label="服务器种子">
            <el-input disabled v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="服务器种子(散列)">
            <el-input disabled v-model="form.region"></el-input>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="客户种子">
                <el-input disabled v-model="form.clientSeed"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="随机数">
                <el-input disabled v-model="form.nonce"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
 </div>
</template>
<script>
export default {
  data() {
    return {
      form: {},
      dialogVisible: false
    };
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.card-box {
  /deep/ .el-card__body {
    padding:10px !important;
  }
  h1{
      margin-bottom: 5px;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  .left{
      flex: auto;
      display: flex;
      padding: 5px 0;
      flex-direction: column;
      justify-content: space-between;
      p{
          font-size: 18px;
      }
      span{
          font-size: 12px;
      }
  }
  .icon{
      flex: none;
      width: 64px;
      height: 64px;
      display: block;
  }
}
.top {
  margin: 20px 0;
}
</style>