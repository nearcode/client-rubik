<template>
  <div class="dialogForm">
    <el-dialog
      :title="dialogTitle"
      v-if="showDialog"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      @close="closeDialog('info')"
      width="800px"
    >
      <!--表单-->
      <el-form ref="info" :model="info" :rules="rules" label-width="80px">
        <el-form-item prop="interval" label="选择锁仓" v-if="dialogType == 'add'">
          <el-select v-model="info" value-key="id" filterable clearable>
            <el-option :label="v.name" v-for="(v,k) in resultList" :value="v" :key="k"></el-option>
          </el-select>
        </el-form-item>
        <!--提币地址-->
        <el-form-item v-if="info && info['modes']" label="锁仓规则" prop="address">
          <!-- <div>
            <label for="w">
              <input type="radio" name="amount" id="w" >
              <i></i>
            </label>
          </div> -->
          <el-row>
            <el-col
              :style="{cursor:(v.cuAmount && v.lockModes['amount'] <= v.cuAmount?'no-drop':'pointer')}"
              :span="12"
              @click.native="selectRules(k,v.lockModes['amount'],v.cuAmount)"
              v-for="(v,k) in info.modes"
              :key="k"
            >
              <el-card class="box-card" :class="{'active':info.active == k,'is_disabled':v.cuAmount && v.lockModes['amount'] <= v.cuAmount}" style="margin:10px;">
                <div class="text item">
                  <p>{{defineText(v)}}</p>
                  <p>日收益：{{v.lockModes['rate']}}</p>
                  <p v-html="v.memo"></p>
                  <!-- <p>{{v.memo.}}</p> -->
                  <!-- <p
                    v-for="(val,key) in v.inviteModes"
                    :key="key"
                  >推荐{{val.level}}级可得{{val.rate}}奖励 ({{val.player}}个锁仓用户)</p>
                  <br /> -->
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>
        <!--数量-->
        <!-- <el-form-item label="提现数量" prop="amount">
                    <el-input type="number" v-model="info.amount"></el-input>
        </el-form-item>-->
      </el-form>
      <!--底部-->
      <span slot="footer" class="dialog-footer">
        <!--取消-->
        <el-button @click="showDialog = false">取 消</el-button>
        <!--确定-->
        <el-button type="primary" @click="submitForm('info')" :disabled="!info['active'] && info['active']!=0" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import lockApi from "@/api/lock";
import { mapState } from "vuex";
import _ from "lodash";

export default {
  name: "UpDateCoin",
  props: ['loading'], //用来接收父组件传给子组件的数据
  data() {
    let validatePass = (rule, value, callback) => {};
    return {
      radio1:[],
      showDialog: false, //提现弹框
      showAppendDialog: false, //添加新地址弹框
      callback: "", //回调函数
      cancelCall: "",
      dialogType: "", //弹框类型
      info: {}, //提现表单
      resultList: [],
      rules: {
        // address: [
        //   {
        //     required: true,
        //     message: "提币地址不能为空",
        //     trigger: ["change", "blur"]
        //   }
        // ],
      }
    };
  },
  computed: {
    ...mapState(["coins", "markets"]),
    dialogTitle() {
      let title = "";
      if (this.dialogType == "add") {
        title = "添加锁仓";
      } else {
        title = "升级锁仓";
      }
      return title;
    }
  },
  methods: {
    
    // 定义文字
    defineText(item) {
      if (!item) return;
      let text = "";
      if (this.info.type == 0) {
        text = `锁仓数量为 ${item.lockModes["amount"]} 的${item["coin"]}币`;
      } else if (this.info.type == 1) {
        text = `锁仓价值为 ${item.lockModes["amount"]} 元的${item["coin"]}币`;
      }
      return text;
    },
    // 选择锁仓规则
    selectRules(index, amount,cuAmount) {
      if(cuAmount && amount <= cuAmount) return;
      this.$set(this.info, "active", index);
      this.$set(this.info, "amount", amount);
    },
    // 获取锁仓规则列表
    async getLockRuleList() {
      try {
        let result = await lockApi.lockRuleList();
        let data = result.data;
        for (let item of data) {
          for (let i of item.modes) {
            i["coin"] = item.coin;
            i["memo"] = item.memo;
          }
        }
        this.resultList = data;
      } catch (e) {}
    },
    // 获取当前选中的规则
    async lockRule(row) {
      if (!row.ruleId) return;
      try {
        let result = await lockApi.lockRule({ id:row.ruleId });
        let data = result.data;
        let list = [];

        for (let item of data.modes) {
          item["coin"] = data.coin;
          item["cuAmount"] = row.balance;
        }
        list.push(data);
        this.info = data;
        this.resultList = list;
      } catch (e) {}
    },
    // 关闭弹窗重置表单
    closeDialog(formName) {
      if (formName) {
        this.$nextTick(() => {
          if (this.$refs[formName]) {
            this.$refs[formName].resetFields(); //重置表单
            this.$refs[formName].clearValidate(); //重置验证信息
          }
        });
      }
    },
    //验证通过就执行
    submitForm(formName) {
      if (!this.info || !this.info.amount || !this.info._id)
        return this.$notify.warning("请选择锁仓规则");
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("upData", this.info);
          this.callback && this.callback();
        } else {
          return false;
        }
      });
    },
    // 显示
    show(datas) {
      this.info = {};
      this.$nextTick(() => {
        this.dialogType = datas.dialogType;
        if (datas.info) {
          this.lockRule(datas["info"]);
        } else {
          this.getLockRuleList();
        }

        this.showDialog = true;
      });
      this.callback = datas.callback;
      this.cancelCall = datas.cancel;
    },
    // 取消
    cancel() {
      this.showDialog = false;
    }
  }
};
</script>

<style lang="less" scoped>
label{
 display: block;
            margin-bottom: 10px;
}
input[type='radio']{
  display: none;
  // opacity: 0;
}
i{
  display: inline-block;
  width: 50px;
  height: 50px;
  background: #409eff;
}
input[type='radio']:checked+i{
  background: red;
}
.is_disabled{
  background-color:#f5f7fa!important; 
  color:#C0C4CC!important;
}
.box-card.is_disabled:hover.el-card{
  background-color: #f5f7fa;
  color: #C0C4CC;
}
.active {
  background-color: #409eff!important;
  color: #fff!important;
}
.box-card:hover.el-card{
  background-color: #409eff;
  color: #fff;
}
</style>
