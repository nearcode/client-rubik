<template>
  <div class="info">
    <el-dialog
      :title="form.dialogType+'交易所'"
      @close="closeDialog('form')"
      :visible.sync="showDialog"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input placeholder="请输入名称" v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="key" prop="key">
          <el-input placeholder="请输入" v-model="form.key"></el-input>
        </el-form-item>

        <el-form-item label="secret" prop="secret">
          <el-input placeholder="请输入" v-model="form.secret"></el-input>
        </el-form-item>

         <el-form-item label="附加数据" prop="data">
          <el-input placeholder="请输入" v-model="form.data"></el-input>
        </el-form-item>

        <el-form-item label="手续费" prop="fee">
          <el-input type="number" placeholder="请输入手续费" v-model="form.fee"></el-input>
        </el-form-item>

        <el-form-item label="支持交易对" prop="markets">
          <el-row :gutter="10" style="margin-bottom:10px;">
            <el-col :span="9">
              <div>币种：</div>
              <el-select v-model="form.coin" filterable clearable placeholder="请选择币种">
                <el-option :label="k" v-for="(v,k) in coins" :key="k" :value="k"></el-option>
              </el-select>
            </el-col>
            <el-col :span="9">
              <div>市场：</div>
              <el-select
                v-model="form.base"
                filterable
                allow-create
                clearable
                placeholder="请选择或自定义市场"
              >
                <el-option
                  :label="k"
                  v-for="(v,k) in coins"
                  :key="k"
                  :value="k"
                  v-if="form.coin!=k"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <div>{{(form.coin || '---')+' / '+(form.base || '---')}}</div>
              <el-button type="primary" icon="el-icon-bottom-left" @click="addPair(form.coin,form.base)">添加</el-button>
            </el-col>
          </el-row>

          <el-table :data="form.markets" border>
            <el-table-column prop="coin" label="币种">
              <template slot-scope="scope">{{scope.row | getCoin}}</template>
            </el-table-column>
            <el-table-column prop="base" label="市场">
              <template slot-scope="scope">{{scope.row | getBaseCoin}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click.native.prevent="deleteRow(scope.$index, form.markets)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
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
        markets: []
      },
      rules: {
        name: [{ required: true, message: "参数不能为空", trigger: "blur" }]
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
          this.$set(this.form,'dialogType',datas.dialogType);
        this.showDialog = true;
      });
      this.callback = datas.callback;
      this.cancelCall = datas.cancel;
    },
    // 新增交易对
    addPair(coin, base) {
      if (!coin || !base || !base.length) return;

      let markets = this.form["markets"] || [];
      let pair = `${coin}_${base}`;

      for (let item of markets) {
        if (item == pair) {
          return this.$message.error("该交易对已经存在，请勿重复添加");
        }
      }
      markets.push(pair);

      this.$set(this.form, "markets", markets);
    },
    // 删除交易对
    deleteRow(index, rows) {
      rows.splice(index, 1);
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
