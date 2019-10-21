<template>
  <div class="info">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>机器人管理</el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group class="pull-right" style="margin-top: -21px">
        <!--<el-tooltip class="item" effect="dark" content="导出表格" placement="top">-->
        <!--<el-button icon="el-icon-download">导出</el-button>-->
        <!--</el-tooltip>-->
        <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
          <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
        </el-tooltip>
      </el-button-group>
    </div>
    <div class="container">
      <el-dialog :title="'机器人设置'" @close="closeDialog('form')" :visible.sync="dialogTableVisible">
        <el-form ref="form" :model="form" :rules="rules" label-width="180px">
          <el-form-item prop="cnyCoin" label="人民币对应币种">
            <el-select v-model="form.cnyCoin" filterable clearable placeholder="请选择币种">
              <el-option :label="k" v-for="(v,k) in coins" :key="k" :value="k"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单波动率">
            <el-input v-model="form.orderFee"></el-input>
          </el-form-item>
          <el-form-item label="线下兑换率">
            <el-input v-model="form.changeFee"></el-input>
          </el-form-item>
          <el-form-item label="更新订单频率">
            <el-input v-model="form.tradeRate"></el-input>
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
                <template slot-scope="scope">
                    {{scope.row | getCoin}}
                </template>
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
            <el-button
              type="primary"
              @click="onSubmit('form')"
              :disabled="getPerms('sysSettings:setting:edit')"
            >保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-table :data="resultList" v-loading="loading" border class="table">
        <el-table-column label="订单波动率">
          <template slot-scope="scope">{{scope.row | getDictValue('orderFee')}}</template>
        </el-table-column>

        <el-table-column label="线下兑换率">
          <template slot-scope="scope">{{scope.row | getDictValue('changeFee')}}</template>
        </el-table-column>

        <el-table-column label="更新订单频率">
          <template slot-scope="scope">{{scope.row | getDictValue('tradeRate')}}</template>
        </el-table-column>

        <el-table-column prop="markets" label="支持交易对">
          <template slot-scope="scope">
            <span v-for="(v,k) in scope.row.markets" :key="k">
              <el-tag>{{v | toString}}</el-tag>
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="isRun" align="center" label="是否运行">
          <template slot-scope="scope">{{scope.row.isRun?'运行':'停止'}}</template>
        </el-table-column>

        <el-table-column prop="edit" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              :disabled="getPerms('robot:setting:update')"
              @click="edit(scope.row)"
            >修改</el-button>
            <el-tooltip :content="'是否运行：'+ scope.row.isRun" placement="top">
              <el-switch :disabled="getPerms('robot:setting:state')" @change="changeSwitch($event,scope.row)" v-model="scope.row.isRun"></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import robotApi from "@/api/robot";
import config from "@/config";
import { mapState } from "vuex";
import _ from "lodash";

export default {
  name: "email",
  components: {},
  data() {
    return {
      dialogTableVisible: false,
      resultList: [],
      loading: true,
      form: {
        markets: []
      },
      rules: {
        cnyCoin: [{ required: true, message: "参数不能为空", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState(["coins"])
  },
  mounted() {
    this.getData();
  },
  methods: {
    async changeSwitch(state, item) {
      if (!item) return;
      try {
        let result = await robotApi.robotState({
          name: item.name,
          state: state ? "start" : "stop"
        });
        this.$message.success("状态更新成功");
      } catch (e) {
        item.isRun = !item.isRun;
      }
    },
    // 新增交易对
    addPair(coin, base) {
      if (!coin || !base) return;

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
    // 获取数据
    async getData() {
      this.loading = true;
      try {
        let result = await robotApi.getRobot();
        this.loading = false;
        let data = [];
        data.push(result.data);
        this.resultList = data;
      } catch (e) {}
    },
    // 关闭弹窗重置表单
    closeDialog(formName) {
      if (formName) {
        this.resetForm(this, formName);
      }
    },
    edit(item) {
      if (!item) return;
      this.type = "edit";
      this.form = _.cloneDeep(item);

      this.$set(this.form, "baseCoin", item.base);
      this.$set(this.form, "select", this.form.coin);
      this.dialogTableVisible = true;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            let result = await robotApi.robotUpdate({
              cnyCoin: this.form.cnyCoin,
              orderFee: this.form.orderFee,
              changeFee: this.form.changeFee,
              markets: this.form.markets,
              tradeRate: this.form.tradeRate
            });
            this.getData();
            this.dialogTableVisible=false;
            this.$message.success("保存成功");
          } catch (e) {}
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.addDomains {
  margin-bottom: 5px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 100%;
  height: 178px;
  display: block;
}
</style>
