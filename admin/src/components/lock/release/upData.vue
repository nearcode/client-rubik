<template>
  <div class="dialogForm">
    <el-dialog
      :title="dialogTitle"
      v-if="showDialog"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      @close="closeDialog('form')"
      width="800px"
    >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item prop="coin" label="名称">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item prop="startTime" label="模式">
                     <el-select v-model="form.coin" filterable clearable >
                        <el-option :label="k" v-for="(v,k) in coins" :value="k" :key="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="interval" label="币种">
                    <el-select v-model="form.coin" filterable clearable >
                        <el-option :label="k" v-for="(v,k) in coins" :value="k" :key="k"></el-option>
                    </el-select>
                </el-form-item>
                
            </el-form>
      <!--底部-->
      <span slot="footer" class="dialog-footer">
        <!--取消-->
        <el-button @click="showDialog = false">取 消</el-button>
        <!--确定-->
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import baseApi from "@/api/base";
import walletApi from "@/api/wallet";
import { mapState } from "vuex";
import _ from "lodash";

export default {
  name: "UpDateCoin",
  props: [], //用来接收父组件传给子组件的数据
  data() {
    let validatePass = (rule, value, callback) => {
    };

    return {
      showDialog: false, //提现弹框
      callback: "", //回调函数
      cancelCall: "",
      dialogType: "", //弹框类型
      form: {
        selectLoading: false
      },
      rules: {
        address: [
          {
            required: true,
            message: "提币地址不能为空",
            trigger: ["change", "blur"]
          }
        ],
        // amount: [
        //   {
        //     required: true,
        //     message: "数量不能为空",
        //     trigger: ["change", "blur"]
        //   },
        //   { validator: validatePass, trigger: ["change", "blur"] }
        // ]
      }
    };
  },
  computed: {
    ...mapState(["coins", "markets"]),
    dialogTitle() {
      let title = "添加锁仓";

      return title;
    }
  },
  methods: {
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
      // if(formName) this.resetForm(this,formName);
    },
    //验证通过就执行
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("upData", this.form);
          this.callback && this.callback();
        } else {
          return false;
        }
      });
    },
    // 显示
    show(datas) {
      this.form = {};
      this.$nextTick(() => {
        this.dialogType = datas.dialogType;
        if (datas.form) this.form = datas.form;
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
.address /deep/ .el-select-dropdown__item {
  padding: 0 5px !important;
}

.address {
  .address_table {
    border-collapse: collapse;
  }
}
</style>
