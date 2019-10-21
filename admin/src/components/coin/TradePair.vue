<template>
  <div class="info">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>币种管理</el-breadcrumb-item>
        <el-breadcrumb-item>交易对列表</el-breadcrumb-item>
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
      <!--操作与搜索-->
      <div class="plugins-tips">
        <el-button
          type="primary"
          @click="addPair"
          :disabled="getPerms('exchange:tradePair:addAndEdit')"
        >新增</el-button>
      </div>
      <el-dialog
        :title="(type=='edit'?'修改':'添加')+'交易对'"
        @close="closeDialog('form')"
        :visible.sync="dialogTableVisible"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="选择币种" prop="coin">
            <el-select
              v-model="form.coin"
              filterable
              clearable
              :disabled="type=='edit'"
              placeholder="请选择"
            >
              <el-option :label="k" v-for="(v,k) in coins" :key="k" :value="k"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择市场" prop="base">
            <el-select v-model="form.base" filterable clearable placeholder="请选择">
              <el-option
                :label="k"
                v-for="(v,k) in coins"
                :key="k"
                :value="k"
                v-if="form.coin!=k"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="交易手续费" prop="fee">
            <el-input placeholder="请输入" v-model="form.fee"></el-input>
          </el-form-item> -->
            <el-form-item label="吃单手续费" prop="takerFee">
            <el-input placeholder="请输入" v-model="form.takerFee"></el-input>
          </el-form-item>
          
            <el-form-item label="挂单手续费" prop="makerFee">
            <el-input placeholder="请输入" v-model="form.makerFee"></el-input>
          </el-form-item>

          <el-form-item label="波动率" prop="changeRate">
            <el-input placeholder="请输入" v-model="form.changeRate"></el-input>
          </el-form-item>
          <el-form-item label="小数点位数" prop="amountPre" v-if="form.isTrade">
            <el-input placeholder="请输入" v-model="form.amountPre"></el-input>
          </el-form-item>

           <el-form-item label="分类" prop="changeRate">
             <el-select v-model="form.type" filterable placeholder="请选择">
              <el-option
                :label="v.name"
                v-for="(v,k) in [{index:0,name:'主板'},{index:1,name:'创业板'}]"
                :key="k"
                :value="v.index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="状态：">
            <el-form :inline="true">
              <el-form-item prop="isTrade">
                交易
                <el-switch v-model="form.isTrade"></el-switch>
              </el-form-item>
              <el-form-item prop="suspendTrade">
                暂停交易
                <el-switch v-model="form.suspendTrade"></el-switch>
              </el-form-item>
              <!-- <el-form-item prop="futures">
                                期货
                                <el-switch v-model="form.futures"></el-switch>
                            </el-form-item>
                            <el-form-item prop="stock">
                                股票
                                <el-switch v-model="form.stock"></el-switch>
                            </el-form-item>
                            <el-form-item prop="observer">
                                观察区
                                <el-switch v-model="form.observer"></el-switch>
              </el-form-item>-->
            </el-form>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit('form')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-table :data="resultList" v-loading="loading" border style="width: 100%" class="table">
        <el-table-column label="币种名称">
          <template slot-scope="scope">
            {{scope.row.coin}}
            <small
              v-if="$store.state.coins[scope.row.coin]"
            >({{$store.state.coins[scope.row.coin].chineseName}})</small>
          </template>
        </el-table-column>
        <el-table-column prop="coin" label="市场">
          <template slot-scope="scope">
            <div>{{scope.row.base}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="coin" label="是否可以交易" align="center">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.stopTrade">暂停</el-tag>
            <el-tag v-else-if="scope.row.isTrade">是</el-tag>
            <el-tag type="danger" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="takerFee" label="吃单手续费">
          <template slot-scope="scope">{{scope.row | getDictValue('takerFee')}}</template>
        </el-table-column>
          <el-table-column prop="makerFee" label="挂单手续费">
          <template slot-scope="scope">{{scope.row | getDictValue('makerFee')}}</template>
        </el-table-column>
        <el-table-column prop="edit" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              :disabled="getPerms('exchange:tradePair:addAndEdit')"
              @click="edit(scope.row)"
            >修改</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              :disabled="getPerms('exchange:tradePair:del')"
              class="red"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import exchangeApi from "@/api/ex";
import { mapState } from "vuex";

export default {
  name: "TradePair",
  data() {
    return {
      resultList: [],
      dialogTableVisible: false,
      type: "", //用来区分修改删除
      loading: true,
      form: {
        type:0
      },
      rules: {
        coin: [{ required: true, message: "参数不能为空", trigger: "blur" }],
        base: [{ required: true, message: "参数不能为空", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState(["coins"])
  },
  mounted() {
    this.$store.state.getLevel();
    this.getData(); //获取选中的币种
  },
  methods: {
    // 关闭弹窗重置表单
    closeDialog(formName) {
      if (formName) {
        this.resetForm(this, formName);
      }
    },
    // 新增交易对
    addPair() {
      this.type = "add";
      this.dialogTableVisible = true;
    },
    edit(item) {
      if (!item) return;
      this.type = "edit";
      this.form = _.clone(item);
      this.dialogTableVisible = true;
    },
    async getData() {
      //获取选中的币种
      this.loading = true;
      try {
        let result = await exchangeApi.getMarkets();
        this.loading = false;
        this.resultList = result;
      } catch (e) {}
    },
    // 更新数据
    submit(formName) {
      if (!this.form) return;
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            let result = await exchangeApi.editPair({
              amountPre:this.form.amountPre,
              base:this.form.base,
              coin:this.form.coin,
              isTrade:this.form.isTrade,
              minPrice:"",
              pricePre:"",
              takerFee:this.form.takerFee,
              makerFee:this.form.makerFee,
              changeRate:this.form.changeRate,
              suspendTrade:this.form.suspendTrade,
              type:this.form.type
            });
            this.$message.success("更新成功");
            this.getData();
            this.dialogTableVisible = false;
          } catch (e) {}
        } else {
          return false;
        }
      });
    },
    // 移除币种
    handleDelete(item) {
      this.$confirm("你确定删除“" + item.coin + "”吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            let result = await exchangeApi.delPair(item.base, item.coin);
            this.$message.success("删除成功!");
            this.getData();
          } catch (e) {}
        })
        .catch(() => {});
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
