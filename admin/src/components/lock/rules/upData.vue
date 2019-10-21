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
      <!--添加地址-->
      <el-dialog
        :close-on-click-modal="false"
        width="600px"
        :title="'更新'"
        @close="closeDialog('addressForm')"
        :visible.sync="showAppendDialog"
        append-to-body
      >
        <!--新增模式-->
        <el-form ref="addressForm" :rules="upDataInfoRules" :model="upDataInfo">
          <el-form-item prop="amount" label="金额" v-if="upDataInfo.dialogType == 'unlock'">
            <el-input v-model="upDataInfo.amount"></el-input>
          </el-form-item>

          <el-form-item prop="interval" label="天数" v-if="upDataInfo.dialogType == 'unlock'">
            <el-input v-model="upDataInfo.interval"></el-input>
          </el-form-item>

          <el-form-item prop="rate" label="比例" v-if="upDataInfo.dialogType == 'unlock'">
            <el-input v-model="upDataInfo.rate"></el-input>
          </el-form-item>

          <!-- 推荐 -->
          <!-- <el-form-item
            prop="player"
            :label="'参与人数 '+ cuLevel()"
            v-if="upDataInfo.dialogType == 'referrer'"
          >
            <el-input v-model="upDataInfo.player"></el-input>
          </el-form-item>-->

          <el-form-item
            prop="rate"
            :label="'比例 '+ cuLevel()"
            v-if="upDataInfo.dialogType == 'referrer'"
          >
            <el-input v-model="upDataInfo.rate"></el-input>
          </el-form-item>
        </el-form>
        <!--操作-->
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAppendDialog=false">取消</el-button>
          <el-button
            type="primary"
            @click="addInfoSubmit('addressForm',upDataInfo.dialogType,upDataInfo.upDataType)"
          >确定</el-button>
        </div>
      </el-dialog>

      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="name" label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item prop="coin" label="币种">
          <el-select v-model="form.coin" filterable clearable>
            <el-option :label="k" v-for="(v,k) in coins" :value="k" :key="k"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="market" label="交易对">
          <el-select v-model="form.market" filterable clearable>
            <el-option
              :label="v.coin+'/'+v.base"
              v-for="(v,k) in markets"
              :value="v.coin+'_'+v.base"
              :key="k"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="pattern" label="模式">
          <el-select v-model="form.pattern" placeholder="可多选" multiple filterable clearable>
            <el-option :label="v.name" v-for="(v,k) in patterns" :value="v.index" :key="k"></el-option>
          </el-select>
        </el-form-item>

        <!-- 解锁模式 -->
        <el-form-item prop="type" label="类型">
          <el-select :disabled="form.dialogType=='edit'" v-model="form.type" filterable clearable>
            <el-option :label="v.name" v-for="(v,k) in types" :value="v.index" :key="k"></el-option>
          </el-select>
        </el-form-item>

        <!-- end -->
        <el-form-item prop="unlock" label="解锁" v-if="form.pattern.indexOf('unlock') !=-1">
          <el-button
            type="primary"
            style="margin-bottom:10px;"
            icon="el-icon-plus"
            @click="childDialog('unlock')"
          >添加</el-button>
          <el-table :data="form.lockModes" border>
            <el-table-column prop="amount" label="金额"></el-table-column>
            <!-- <el-table-column prop="type" label="类型">
              <template slot-scope="scope">
                <el-tag v-for="(v,k) in types" v-if="v.index == scope.row.type" :key="k">{{v.name}}</el-tag>
              </template>
            </el-table-column>-->
            <el-table-column prop="rate" label="比例"></el-table-column>
            <el-table-column prop="interval" label="天数"></el-table-column>
            <el-table-column prop="rate" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click.native.prevent="childDialog('unlock', scope.row,scope.$index)"
                >修改</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click.native.prevent="deleteRow(scope.$index, form.lockModes)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <!-- 推荐模式 -->
        <el-form-item prop="interval" label="推荐" v-if="form.pattern.indexOf('referrer') !=-1">
          <el-button
            type="primary"
            style="margin-bottom:10px;"
            icon="el-icon-plus"
            @click="childDialog('referrer')"
          >添加</el-button>
          <el-button @click="setPush('referrer')">设置</el-button>
          <el-table :data="form.inviteModes" border>
            <el-table-column prop="level" label="级别">
              <template slot-scope="scope">{{scope.row.level}} 级</template>
            </el-table-column>
            <!-- <el-table-column prop="player" label="参与人数"></el-table-column> -->
            <!-- <el-table-column prop="isLockPlay" label="是否为锁仓用户" align="center">
              <template slot-scope="scope">
                <el-tag>{{scope.row.isLockPlay?'是':'否'}}</el-tag>
              </template>
            </el-table-column>-->
            <el-table-column prop="rate" label="比例"></el-table-column>
            <el-table-column prop="rate" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click.native.prevent="childDialog('referrer',scope.row,scope.$index)"
                >修改</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click.native.prevent="deleteRow(scope.$index, form.inviteModes,'inviteModes')"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- 描述 -->
        <el-form-item prop="enabled" label="描述">
          <el-input type="textarea" placeholder="请输入内容" autosize :rows="4" v-model="form.memo" ></el-input>
        </el-form-item>
        <!-- 启用 -->
        <el-form-item prop="enabled" label="启用">
          <el-switch v-model="form.enabled"></el-switch>
        </el-form-item>
        <!-- end -->
      </el-form>
      <!--底部-->
      <span slot="footer" class="dialog-footer">
        <!--取消-->
        <el-button @click="showDialog = false">取 消</el-button>
        <!--确定-->
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </span>
    </el-dialog>
    <set-push ref="pushDialog" v-on:upData="setData"></set-push>
  </div>
</template>

<script>
import baseApi from "@/api/base";
import walletApi from "@/api/wallet";
import { mapState } from "vuex";
import _ from "lodash";
import setPush from "./setpush";

export default {
  name: "UpDateCoin",
  props: [], //用来接收父组件传给子组件的数据
  components: {
    setPush
  },
  data() {
    let validatePass = (rule, value, callback) => {};
    return {
      showDialog: false, //弹框
      showAppendDialog: false,
      callback: "", //回调函数
      cancelCall: "",
      dialogType: "", //弹框类型
      upDataInfo: {},
      selectEd: {},
      form: {
        loading: false,
        inviteModes: [], //推荐
        lockModes: [], //解锁
        pattern: [] //选择的模式
      },

      types: [
        {
          index: 0,
          name: "币数量"
        },
        {
          index: 1,
          name: "法币价值"
        }
      ],
      patterns: [
        {
          index: "unlock",
          name: "解锁"
        },
        {
          index: "referrer",
          name: "推荐"
        }
      ],
      upDataInfoRules: {
        type: [
          {
            required: true,
            message: "参数不能为空",
            trigger: ["change", "blur"]
          }
        ],
        amount: [
          {
            required: true,
            message: "参数不能为空",
            trigger: ["change", "blur"]
          }
        ],
        interval: [
          {
            required: true,
            message: "参数不能为空",
            trigger: ["change", "blur"]
          }
        ],
        rate: [
          {
            required: true,
            message: "参数不能为空",
            trigger: ["change", "blur"]
          }
        ]
        // player: [
        //   {
        //     required: true,
        //     message: "参数不能为空",
        //     trigger: ["change", "blur"]
        //   }
        // ]
      },
      //  { validator: validatePass, trigger: ["change", "blur"] }
      rules: {
        name: [
          {
            required: true,
            message: "参数不能为空",
            trigger: ["change", "blur"]
          }
        ],
        coin: [
          {
            required: true,
            message: "参数不能为空",
            trigger: ["change", "blur"]
          }
        ],
        pattern: [
          {
            required: true,
            message: "参数不能为空",
            trigger: ["change", "blur"]
          }
        ]
      }
    };
  },
  computed: {
    ...mapState(["coins", "markets"]),

    dialogTitle() {
      let type = this.dialogType == "add" ? "添加" : "修改";
      let title = type + "锁仓";
      return title;
    }
  },
  mounted() {
    this.$store.commit("getMarkets");
  },
  methods: {
    // 设置
    setData(item) {
      let form = _.assign(this.form, _.cloneDeep(item));
      this.form = form;

      this.$refs.pushDialog.cancel();
    },
    // 设置
    setPush() {
      let layer = this.$refs.pushDialog;
      layer.show({
        form: _.cloneDeep(this.form)
        // callback: this.pushSubmit()
      });
    },

    cuLevel() {
      let text = "";
      if (this.upDataInfo["level"]) {
        text = "(第" + this.upDataInfo["level"] + "级)";
      } else {
        text = "(第" + (this.form.inviteModes.length + 1) + "级)";
      }
      return text;
    },
    // 打开嵌套弹框
    childDialog(type, item, index) {
      this.upDataInfo = {};
      if (item) {
        this.selectEd = index;
        this.upDataInfo = _.cloneDeep(item);
        this.$set(this.upDataInfo, "upDataType", "edit");
      } else {
        this.$set(this.upDataInfo, "upDataType", "add");
      }

      this.$set(this.upDataInfo, "dialogType", type);
      this.showAppendDialog = true;
    },
    addInfoSubmit(formName, dialogType, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          delete this.upDataInfo["dialogType"];
          delete this.upDataInfo["upDataType"];
          if (type == "add") {
            if (dialogType == "unlock") {
              this.form.lockModes.push(_.cloneDeep(this.upDataInfo));
            } else {
              this.form.inviteModes.push(_.cloneDeep(this.upDataInfo));
              for (let i = 0; i < this.form.inviteModes.length; i++) {
                let level = Number(i) + 1;
                this.$set(this.form.inviteModes[i], "level", level);
              }
            }
          } else {
            if (dialogType == "unlock") {
              this.$set(this.form.lockModes, this.selectEd, this.upDataInfo);
            } else {
              this.$set(this.form.inviteModes, this.selectEd, this.upDataInfo);
            }
          }

          this.showAppendDialog = false;
        } else {
          return false;
        }
      });
    },
    // 删除
    deleteRow(index, rows, type) {
      rows.splice(index, 1);
      // 删除之后更新等级
      if (type == "inviteModes") {
        for (let i = 0; i < this.form.inviteModes.length; i++) {
          let level = Number(i) + 1;
          this.$set(this.form.inviteModes[i], "level", level);
        }
      }
    },
    // 关闭弹窗重置表单
    closeDialog(formName) {
      //  this.$nextTick(()=>{
      //   this.$refs['formName'].resetFields()
      //     //  if (formName) this.resetForm(this, formName);
      //    })
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
        loading: false,
        inviteModes: [], //推荐
        lockModes: [], //解锁
        pattern: [] //选择的模式
      };
      this.$nextTick(() => {
        this.dialogType = datas.dialogType;
        if (datas.form) {
          this.form = datas.form;
          this.$set(this.form, "dialogType", this.dialogType);
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
.addDomains {
  margin-bottom: 5px;
}
</style>
