<template>
  <!--添加地址-->
  <el-dialog
    :close-on-click-modal="false"
    width="600px"
    :title="'设置'"
    @close="closeDialog('setPushForm')"
    :visible.sync="setPushDialog"
    append-to-body
  >
    <!--新增模式-->
    <el-form ref="setPushForm" :rules="rules" :model="form">
      <!-- <el-form-item prop="referrals" label="横推人数">
        <el-input type="number" v-model="form.referrals"></el-input>
      </el-form-item> -->

      <el-form-item prop="moneyLimit" label="金额限制">
        <el-input type="number" v-model="form.moneyLimit"></el-input>
      </el-form-item>

      <el-form-item prop="unitPeople" label="人数单位">
        <el-input type="number" v-model="form.unitPeople"></el-input>
      </el-form-item>

      <el-form-item  prop="isLockPlay" :label="'是否为锁仓用户'" >
            <br />
            <el-switch v-model="form.isLockPlay"></el-switch>
          </el-form-item>
    </el-form>
    <!--操作-->
    <div slot="footer" class="dialog-footer">
      <el-button @click="setPushDialog=false">取消</el-button>
      <el-button :loading="form.loading" type="primary" @click="submitForm('setPushForm')">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: [],
  data() {
    let validatePass = (rule, value, callback) => {
      if(!value){
         callback(new Error("参数不能为空"));
      }
      if(value<=0){
         callback(new Error("不能小于1"));
      }else{
        callback();
      }
    };
    return {
      setPushDialog: false,
      form: {},
      rules: {
         referrals: [
          {
            required: true,
            message: "参数不能为空",
            trigger: ["change", "blur"]
          }
        ],
        unitPeople:[{ validator: validatePass, trigger: ["change", "blur"] }]
      },
      callback: ""
    };
  },
  methods: {
    // 弹窗关闭事件
    closeDialog(formName) {
      if (formName) this.resetForm(this, formName);
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
      this.form = {
        loading: false
      };
      this.$nextTick(() => {
        if (datas.form) {
          this.form = datas.form;
        }
        this.setPushDialog = true;
      });

      this.callback = datas.callback;
      this.cancelCall = datas.cancel;
    },
    // 取消
    cancel() {
      this.setPushDialog = false;
    }
  }
};
</script>
<style lang="less" scoped>
</style>