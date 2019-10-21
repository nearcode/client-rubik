<template>
  <div class="info">
    <el-dialog
      :title="form.dialogType+'发行方'"
      @close="closeDialog('form')"
      :visible.sync="showDialog"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="账户ID" prop="uid">
          <el-input placeholder="请输入账户ID" :disabled="form.dialogType=='修改'" v-model="form.uid"></el-input>
          <!-- <span style v-if="form.userAccount">{{form.userAccount}}</span> -->
        </el-form-item>

        <el-form-item label="币种" prop="coins">
          <el-select v-model="form.coins" multiple filterable placeholder="请选择币种,可多选">
            <el-option v-for="(v,k) in coins" :key="k" :label="k" :value="k"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import robotApi from "@/api/robot";
import { mapState } from "vuex";

export default {
  name: "TradePair",
  data() {
    return {
      showDialog: false,
      type: "", //用来区分修改删除
      loading: true,
      form: {
        coin: []
      },
      rules: {
        uid: [{ required: true, message: "参数不能为空", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState(["coins"])
  },
  mounted() {},
  methods: {
    init(parent) {
      this.form = {};
      this.parent = parent;
    },
    show(datas) {
      this.form = {};
      this.$nextTick(() => {
        if (datas.form) {
          this.form = _.cloneDeep(datas.form);
        }
        this.$set(this.form, "dialogType", datas.dialogType);
        this.showDialog = true;
      });
      this.callback = datas.callback;
      this.cancelCall = datas.cancel;
    },
    // 关闭弹窗重置表单
    closeDialog(formName) {
      if (formName) {
        this.resetForm(this, formName);
      }
    },
    cancel() {
      this.showDialog = false;
    },
    submit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(this.form);
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

<style>
.pairMarket span:after {
  content: ",";
  display: inline-block;
  vertical-align: middle;
}

.pairMarket span:last-child:after {
  content: "" !important;
}
</style>
