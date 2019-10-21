<template>
  <div>
    <el-dialog title="解锁" :visible.sync="showDialog" @close="closeDialog('form')" width="600px">
      <el-form ref="form" :rules="rules" :model="form">
        <el-form-item prop="price" label="价格">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" :loading="unlockLoad">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ["unlockLoad"],
  data() {
    return {
      showDialog: false,
      cancelCall: null,
      form: {},
      rules: {
        price: [
          {
            required: true,
            message: "价格不能为空",
            trigger: ["change", "blur"]
          }
        ]
      }
    };
  },
  methods: {
    // 显示
    show(datas) {
      this.form = {};
      this.$nextTick(() => {
        if (datas.form) {
          this.form = datas.form;
        }
        this.showDialog = true;
      });

      this.callback = datas.callback;
      this.cancelCall = datas.cancel;
    },
    // 取消
    cancel() {
      this.showDialog = false;
    },
    // 关闭弹窗重置表单
    closeDialog(formName) {
      if (formName) {
        this.resetForm(this, formName);
      }
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
    }
  }
};
</script>
<style lang="less" scoped>
</style>