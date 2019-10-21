<template>
  <!-- 虚拟币添加修改 -->
  <el-dialog
    :title="dialogType+'虚拟币'"
    :close-on-click-modal="false"
    :visible.sync="showDialog"
    @close="closeDialog('info')"
    width="900px"
  >
    <el-form
      ref="info"
      :model="info"
      :rules="rules"
      :label-position="'right'"
      :size="'medium'"
      label-width="100px"
    >
      <!--排序-->
      <el-form-item label="排序" prop="index">
        <el-input v-model.number="info.index" size="large" type="number" placeholder="排序"></el-input>
      </el-form-item>
      <!--币种英文名-->
      <el-form-item label="币种英文名" prop="englishName">
        <el-input placeholder="请输入币种英文名" size="large" v-model="info.englishName"></el-input>
      </el-form-item>

      <!--币种中文名-->
      <el-form-item label="币种中文名" prop="chineseName">
        <el-input v-model="info.chineseName" size="large" placeholder="请输入币种中文名"></el-input>
      </el-form-item>
      <!--币种简写-->
      <el-form-item label="币种简写" prop="alias">
        <el-input v-model="info.alias" size="large" placeholder="请输入币种简写"></el-input>
      </el-form-item>
      <!--币种标签-->
      <el-form-item label="币种标签" prop="tags">
        <el-select
          v-model="info.tags"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择或自定义币种标签"
        >
          <el-option v-for="(v,k) in coinsTags" :key="k" :label="v" :value="v"></el-option>
        </el-select>
      </el-form-item>
      <!--币种LOGO-->
      <el-form-item label="币种LOGO">
        <el-upload
          class="avatar-uploader"
          :action="urlAction"
          :show-file-list="false"
          :on-success="handleAvatarSuccess.bind(null, {'index':'logo'})"
          :on-preview="handlePictureCardPreview"
          :on-error="uploadError"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="info.logo" :src="info.logo" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <!--<el-button v-if="info.logo" @click="showPhoto(form[item.index])">预览图片</el-button>-->
      </el-form-item>

      <el-form-item label prop="type">
        <!--&lt;!&ndash;<el-checkbox-group v-model="info.type">&ndash;&gt;-->
        <!--<el-checkbox label="启用" v-model="info.state" v-if="!info.baseMoney" name="type"></el-checkbox>-->
        <!--<el-checkbox label="以太系" v-model="info.isEth" name="type"></el-checkbox>-->
        <!--<el-checkbox label="充值" v-model="info.deposit" name="type"></el-checkbox>-->
        <!--<el-checkbox label="提现" v-model="info.withdraw" name="type"></el-checkbox>-->
        <!--<el-checkbox label="转账" v-model="info.transfer" v-if="!info.baseMoney" name="type"></el-checkbox>-->
        <!--<el-checkbox label="全网" v-model="info.all" v-if="!info.baseMoney" name="type"></el-checkbox>-->
        <el-form :inline="true">
          <el-form-item label="启用:" prop="disable" v-if="!info.baseMoney">
            <el-switch v-model="info.disable"></el-switch>
          </el-form-item>
          <el-form-item label="以太系:" prop="isEth">
            <el-switch v-model="info.isEth"></el-switch>
          </el-form-item>
          <el-form-item label="充值:" prop="deposit">
            <el-switch v-model="info.deposit"></el-switch>
          </el-form-item>
          <el-form-item label="提现:" prop="withdraw">
            <el-switch v-model="info.withdraw"></el-switch>
          </el-form-item>
          <el-form-item label="转账:" prop="transfer" v-if="!info.baseMoney">
            <el-switch v-model="info.transfer"></el-switch>
          </el-form-item>
          <el-form-item label="全网:" prop="all" v-if="!info.baseMoney">
            <el-switch v-model="info.all"></el-switch>
          </el-form-item>
          <el-form-item label="支付:" prop="pay">
            <el-switch v-model="info.pay"></el-switch>
          </el-form-item>
          <!--<el-form-item label="计价币种:" prop="all" v-if="!info.baseMoney">-->
          <!--<el-switch v-model="info.base"></el-switch>-->
          <!--</el-form-item>-->
        </el-form>
        <!--</el-checkbox-group>-->
      </el-form-item>
      <!--显示位数-->
      <el-form-item label="显示位数" prop="length">
        <el-input v-model="info.length" size="large" placeholder="请输入位数"></el-input>
      </el-form-item>
      <!--最小提现-->
      <el-form-item label="最小提现" v-if="info.withdraw" prop="withdrawalLimit">
        <el-input v-model="info.withdrawalLimit" size="large" placeholder="请输入最小提现"></el-input>
      </el-form-item>
      <!--最小充值-->
      <el-form-item label="最小充值" v-if="info.withdraw" prop="depositLimit">
        <el-input v-model="info.depositLimit" size="large" placeholder="请输入最小充值"></el-input>
      </el-form-item>
      <!--提现手续费-->
      <el-form-item label="提现手续费" v-if="info.withdraw" prop="withdrawalFee">
        <el-input placeholder="请输入提现手续费" size="large" v-model="info.withdrawalFee">
          <template slot="append" v-if="info.isEth">
            <el-select v-model="info.feeCoin" width="90px" placeholder="请选择">
              <el-option value="ETH">ETH</el-option>
            </el-select>
          </template>
        </el-input>
      </el-form-item>
      <!--介绍-->
      <el-form-item label="币种介绍" prop="content">
        <el-input
          type="textarea"
          v-model="info.content"
          :rows="3"
          size="large"
          placeholder="请输入币种介绍"
        ></el-input>
      </el-form-item>
      <!--总量-->
      <el-form-item label="总量" prop="total">
        <el-input v-model="info.total" size="large" placeholder="请输入总量"></el-input>
      </el-form-item>
      <!--流通-->
      <el-form-item label="流通" prop="quantity">
        <el-input v-model="info.quantity" size="large" placeholder="请输入流通"></el-input>
      </el-form-item>
      <!--链接-->
      <el-form-item label="链接" prop="links">
        <el-input
          type="textarea"
          v-model="info.links"
          :rows="3"
          size="large"
          placeholder="名称1|网址1,名称2|网址2……"
        ></el-input>
        <el-tag>说明:名称1|网址1,名称2|网址2……</el-tag>
      </el-form-item>
      <!--研发者-->
      <el-form-item label="研发者" prop="developer">
        <el-input v-model="info.developer" size="large" placeholder="请输入研发者"></el-input>
      </el-form-item>
      <!--核心算法-->
      <el-form-item label="核心算法" prop="algorithm">
        <el-input v-model="info.algorithm" size="large" placeholder="请输入核心算法"></el-input>
      </el-form-item>
      <!--发布日期-->
      <el-form-item label="发布日期" prop="date">
        <el-input v-model="info.date" size="large" placeholder="请输入发布日期"></el-input>
      </el-form-item>
      <!--发行总量-->
      <el-form-item label="发行总量" prop="quantum">
        <el-input v-model="info.quantum" size="large" placeholder="请输入发行总量"></el-input>
      </el-form-item>
      <!--存量-->
      <el-form-item label="存量" prop="have">
        <el-input v-model="info.have" size="large" placeholder="请输入存量"></el-input>
      </el-form-item>
      <!--区块时间-->
      <el-form-item label="区块时间" prop="blockTime">
        <el-input v-model="info.blockTime" size="large" placeholder="请输入区块时间"></el-input>
      </el-form-item>
      <!--合约地址-->
      <el-form-item label="合约地址" prop="contract" v-if="info.isEth">
        <el-input v-model="info.contract" size="large" placeholder="请输入合约地址"></el-input>
      </el-form-item>
      <!--区块浏览器-->
      <el-form-item label="区块浏览器" prop="explorerUrl">
        <el-input v-model="info.explorerUrl" size="large" placeholder="请输入区块浏览器"></el-input>
      </el-form-item>
      <!--证明方式-->
      <el-form-item label="证明方式" prop="mode">
        <el-input v-model="info.mode" size="large" placeholder="请输入证明方式"></el-input>
      </el-form-item>
      <!--未来产量-->
      <el-form-item label="未来产量" prop="output">
        <el-input v-model="info.output" size="large" placeholder="请输入未来产量"></el-input>
      </el-form-item>
      <!--分发情况-->
      <el-form-item label="分发情况" prop="allocation">
        <el-input v-model="info.allocation" size="large" placeholder="请输入分发情况"></el-input>
      </el-form-item>
      <!--应用-->
      <el-form-item label="应用" prop="application">
        <el-input v-model="info.application" size="large" placeholder="请输入应用"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('info')">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import _ from "lodash";
import config from "@/config";
import baseApi from "@/api/admin";

export default {
  name: "UpDateCoin",
  props: [], //用来接收父组件传给子组件的数据
  data() {
    return {
      urlAction: config.baseUrl + "/account/upload",
      showDialog: false,
      callback: "",
      cancelCall: "",
      dialogType: "",
      coinsTags: [],
      info: {},
      rules: {
        englishName: [
          { required: true, message: "参数不能为空", trigger: "blur" }
        ],
        chineseName: [
          { required: true, message: "参数不能为空", trigger: "blur" }
        ],
        alias: [{ required: true, message: "参数不能为空", trigger: "blur" }],
        withdraw: [
          { required: true, message: "参数不能为空", trigger: "blur" }
        ],
        withdrawalLimit: [
          { required: true, message: "参数不能为空", trigger: "blur" }
        ],
        withdrawalFee: [
          { required: true, message: "参数不能为空", trigger: "blur" }
        ],
        feeCoin: [{ required: true, message: "参数不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 获取币种标签
    async getCoinsTags() {
      try {
        let result = await baseApi.coinsTags();
        this.coinsTags = result.data;
      } catch (e) {}
    },
    // 关闭弹窗重置表单
    closeDialog(formName) {
      if (formName) {
        this.resetForm(this, formName);
      }
    },
    init(parent) {
      this.info = {};
      this.parent = parent;
    },
    show(datas) {
      this.info = {};
      this.$nextTick(() => {
        this.getCoinsTags();
        this.dialogType = datas.dialogType;
        if (datas.info) {
          this.info = _.cloneDeep(datas.info);
          this.info["disable"] = !this.info["disable"];
        }
        this.showDialog = true;
      });
      this.callback = datas.callback;
      this.cancelCall = datas.cancel;
    },
    //验证通过就执行
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.sure();
        } else {
          return false;
        }
      });
    },
    sure() {
      this.info["disable"] = !this.info["disable"];
      this.$emit("upData", this.info);
      this.callback && this.callback();
    },
    cancel() {
      this.showDialog = false;
    },
    handleAvatarSuccess(obj, res) {
      console.log(obj, res);
      // this.$set(this.form, 'imageUrl', res.data);
      this.$set(this.info, obj.index, res.data);
    },
    beforeAvatarUpload(file) {},
    // 上传出错
    uploadError(err, file, fileList) {
      this.$message.error("上传出错");
    },
    // 图片预览
    handlePictureCardPreview(file) {
      console.log(file);
      // this.dialogImageUrl = file.url;
      // this.imgVisible = true;
    }
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader /deep/ .el-upload--text {
  width: 178px !important;
  height: 178px;
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
