<template>
  <div class="users">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group class="pull-right" style="margin-top: -21px">
        <el-tooltip class="item" effect="dark" content="导出表格" placement="top">
          <el-button icon="el-icon-download" @click="excel">导出</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
          <el-button :icon="refreshClass?'el-icon-loading':'el-icon-refresh' " @click="refresh">刷新</el-button>
        </el-tooltip>
      </el-button-group>
    </div>
    <div class="container">
      <!--统计用户-->
      <el-row :gutter="20" class="mgb20">
        <el-col :md="4" :sm="8" :xs="12">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-1">
              <i class="el-icon-lx-people grid-con-icon"></i>
              <div class="grid-cont-right">
                <div class="grid-num">{{userResult.all||0}}</div>
                <div>用户总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :md="4" :sm="8" :xs="12">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-2">
              <i class="el-icon-lx-notice grid-con-icon"></i>
              <div class="grid-cont-right">
                <div class="grid-num">{{userResult.authLevel||0}}</div>
                <div>实名认证</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!--操作与搜索-->
      <div class="plugins-tips">
        <el-form
          :inline="true"
          :model="formInline"
          @keyup.enter.native="search"
          class="demo-form-inline"
        >
          <el-form-item label="注册时间">
            <el-col :span="11">
              <el-date-picker
                v-model.number="formInline.startTime"
                type="datetime"
                value-format="timestamp"
                placeholder="选择开始时间"
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker
                v-model.number="formInline.endTime"
                type="datetime"
                value-format="timestamp"
                placeholder="选择结束时间"
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="可搜索邮箱/ID/手机号或真实姓名"
              type="text"
              clearable
              v-model="formInline.findText"
            >
              <!--<el-button slot="append" icon="el-icon-search" @click="search"></el-button>-->
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>

      <!--用户列表highlight-current-row-->
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        class="table"
        v-loading="loading"
        ref="multipleTable"
      >
        <el-table-column label="用户名">
          <template slot-scope="scope">
            <el-tooltip placement="top">
              <div slot="content" class="name-wrapper">
                <p>真实姓名: {{ scope.row.truename | noData }}</p>
              </div>

              <span>{{scope.row.username | noData}} ({{scope.row.id}})</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="账户">
          <template slot-scope="scope">
            <span>{{scope.row | toAccount}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column prop="vip" label="等级" :formatter="formatter">-->
        <!--</el-table-column>-->
        <el-table-column label="实名认证" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="v.type"
              v-for="(v,k) in statusList"
              :key="k"
              v-if="scope.row.certification==v.value"
            >{{v.text}}</el-tag>
            <!--<el-tag type="info" v-if="scope.row.certification==0">未实名</el-tag>-->
            <!--<el-tag type="success" v-if="scope.row.certification==1">已通过</el-tag>-->
            <!--<el-tag type="danger" v-if="scope.row.certification==-1">未通过</el-tag>-->
            <!--<router-link to="/cdd">-->
            <!--<el-tag type="warning" v-if="scope.row.certification==2">待审核</el-tag>-->
            <!--</router-link>-->
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="200">
          <template slot-scope="scope">{{scope.row.create | toTimeStr}}</template>
        </el-table-column>
        <el-table-column prop="country" label="IP" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.country | noData}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="红色为禁止,蓝色为启用" placement="top">
              <div v-if="scope.row.disable">
                <el-tag :type="scope.row.disable.login?'danger':''">登录</el-tag>
                <el-tag :type="scope.row.disable.withdraw?'danger':''">提现</el-tag>
                <el-tag :type="scope.row.disable.trade?'danger':''">交易</el-tag>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              round
              icon="el-icon-edit"
              :disabled="getPerms('sys:user:edit')"
              @click="handleEdit(scope.row.id,scope.row._id)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="pagination" v-if="totalItems>1">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :page-size="20"
          layout="prev, pager, next"
          :total="totalItems"
        ></el-pagination>
      </div>
    </div>

    <!--验证弹框组件-->
    <verify ref="verifyDialog" v-on:code="setCode"></verify>
    <!-- 编辑弹出框 -->
    <el-dialog
      :title="form | toName('信息')"
      @close="closeDialog('form')"
      :close-on-click-modal="false"
      :visible.sync="editVisible"
      width="600px"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item prop="truename" label="真实姓名">
          <el-input v-model="form.truename" disabled placeholder="--"></el-input>
        </el-form-item>
        <el-form-item prop="idcard" label="身份证号">
          <el-input v-model="form.idcard" disabled placeholder="--"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="form.mobile" placeholder="--"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="form.email" placeholder="--"></el-input>
        </el-form-item>
        <el-form-item prop="money" label="资金">
          <el-button
            @click="toAccountHistory(form.id)"
            :disabled="getPerms('sys:user:finance')"
          >查看资金详细</el-button>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-button v-if="!form.password" @click="resetLoginPassWord(form)">重置密码</el-button>
          <el-input v-if="form.password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item prop="otp" label="谷歌验证">
          <el-button @click="disable('otp',form)">取消谷歌验证</el-button>
        </el-form-item>
        <el-form-item prop="selectCoin" label="充币地址">
          <el-input
            placeholder="选择币种查看充币地址"
            :value="form.coins && form.coins[form.selectCoin] && form.coins[form.selectCoin].address?form.coins[form.selectCoin].address:'暂无地址'"
            class="input-with-select"
          >
            <el-select
              v-model="form.selectCoin"
              filterable
              clearable
              slot="prepend"
              placeholder="请选择"
            >
              <el-option v-for="(v,k) in form.coins" :key="k" :label="k" :value="k"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item prop="selected" label="验证方式">
          <el-radio-group v-model="form.selected">
            <el-radio :label="'otc'" name="authType">谷歌验证</el-radio>
            <el-radio :label="'email'" name="authType">邮箱验证</el-radio>
            <el-radio :label="'mobile'" name="authType">短信验证</el-radio>
            <el-radio :label="'password'" name="authType">密码验证</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="disable" label="状态">
          <el-col :span="6">
            <el-form-item label="登录">
              <el-switch v-model="form.disable.login"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="提现">
              <el-switch v-model="form.disable.withdraw"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="交易">
              <el-switch v-model="form.disable.trade"></el-switch>
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- <el-form-item prop="certification" label="证件">
                    <el-row :gutter="20" style="margin-bottom: 0">
                        <el-col :span="6">
                            <div class="certification-img">
                                <div class="pre-img">
                                    <img :src="form.certification.imgA"
                                         v-if="form.certification && form.certification.imgA"
                                         @click="showSfz(form.certification.imgA)" alt="身份证正面">
                                </div>
                                <p>身份证正面</p>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="certification-img">
                                <div class="pre-img">
                                    <img :src="form.certification.imgB"
                                         v-if="form.certification && form.certification.imgB"
                                         @click="showSfz(form.certification.imgB)" alt="身份证反面">
                                </div>
                                <p>身份证反面</p>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="certification-img">
                                <div class="pre-img">
                                    <img :src="form.certification.imgC"
                                         v-if="form.certification && form.certification.imgC"
                                         @click="showSfz(form.certification.imgC)" alt="手持签证照">
                                </div>
                                <p>手持签证照</p>
                            </div>
                        </el-col>
                    </el-row>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="saveEdit"
          :loading="editBtnLoad"
          :disabled="getPerms('sys:user:edit')"
        >确 定</el-button>
        <el-button @click="editVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--图片预览组件-->
    <showPhoto ref="previewsfz" :photo="photo"></showPhoto>
  </div>
</template>

<script>
// import Schart from 'vue-schart';
// import bus from '../common/bus';
import Verify from "src/components/common/verify";
import showPhoto from "src/components/common/PreviewPicture";
import adminApi from "@/api/admin";
import { mapState } from "vuex";
import _ from "lodash";

export default {
  name: "dashboard",
  components: {
    Verify,
    showPhoto
  },
  // props:['permissions'],
  data() {
    return {
      photo: "",
      tableData: [],
      cur_page: 1,
      userResult: "",
      is_search: false,
      editVisible: false,
      totalItems: 0,
      loading: true,
      editBtnLoad: false,
      refreshClass: "", //刷新动画
      form: {
        certification: {},
        disable: {
          login: true,
          withdraw: true,
          trade: true
        },
        coins: {}
      },
      formInline: {},
      code: "",
      idx: "",
      statusList: [
        { text: "已认证", value: 1, type: "" },
        { text: "未认证", value: 0, type: "info" },
        { text: "认证未通过", value: -1, type: "danger" },
        { text: "待审核", value: 2, type: "warning" }
      ]
    };
  },
  computed: {},
  mounted() {
    this.getData();
    this.getUserStatis();
  },
  methods: {
    toAccountHistory(id) {
      if (id) {
        this.editVisible = false;
        this.$router.push(`/accountHistory/${id}`);
      }
    },
    // 导出
    excel() {
      this.export({
        url: "/getUsers",
        title: "会员列表",
        data: {
          p: this.cur_page
        }
      });
    },
    // 刷新数据
    refresh() {
      this.getData();
    },
    // 预览图片
    showSfz(url) {
      if (!url) return;
      this.photo = url;
      this.$refs.previewsfz.show();
    },
    // 把验证码赋值过来
    setCode(code) {
      this.code = code;
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    // 获取用户列表数据
    async getData() {
      this.loading = true;
      this.refreshClass = true;
      let data = {
        startTime: (this.formInline.startTime || 0) / 1000,
        endTime: (this.formInline.endTime || 0) / 1000,
        text: this.formInline.findText,
        p: this.cur_page
      };
      try {
        let result = await adminApi.getUserList(data);

        let dataList = result.data;
        this.totalItems = result.count;
        for (let i in dataList) {
          if (!dataList[i].disable) {
            dataList[i].disable = {};
          }
        }
        this.tableData = dataList;
        this.loading = false;
        this.refreshClass = false;
      } catch (e) {}
    },
    // 获取实名认证人数
    async getUserStatis() {
      try {
        let result = await adminApi.getUserStatis();
        this.userResult = result.data;
      } catch (e) {}
    },
    //搜索用户
    search() {
      if (
        !this.formInline.findText &&
        !this.formInline.endTime &&
        !this.formInline.startTime
      )
        return;
      this.cur_page = 1;
      this.getData();
      // adminApi.searchUser({
      //     startTime: (this.formInline.startTime||0) / 1000,
      //     endTime: (this.formInline.endTime||0) / 1000,
      //     text: this.formInline.findText
      // }).then(result => {
      //     this.totalItems = result.count;
      //     this.tableData = result.data;
      // })
    },
    //获取用户弹框内容
    async handleEdit(id, _id) {
      if (!id) return;
      console.log(id);
      this.idx = id;
      try {
        let result = await adminApi.getUserInfo(id);
        let form = {};
        form = result.data;

        let disable = {
          login: false,
          withdraw: false,
          trade: false
        };
        
        if (typeof result.data.disable != "undefined") {
          form.disable = _.assign(disable, result.data.disable);
        } else {
          form.disable = disable;
        }

        this.form = form;

        for (let i in form.disable) {
          this.$set(this.form.disable, i, !form.disable[i]);
        }

        if (this.form.authType) {
          let _authType = this.form.authType;
          for (let i in _authType) {
            if (_authType[i]) {
              this.$set(this.form, "selected", i);
            }
          }
        }
      } catch (e) {}
      this.editVisible = true;
    },
    // 关闭弹窗
    closeDialog(formName) {
      this.resetForm(this, formName);
    },
    // 取消谷歌验证
    disable(type, item) {
      if (!item) return this.$message("请选择用户");
      let content =
        '您确定要取消帐号"' +
        '<el-tag type="danger" class="red">' +
        item.username +
        "</el-tag>" +
        '"的Google验证?';

      this.$confirm(content, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          this.$axios({
            method: "post",
            url: "/admin/disable/" + type,
            data: {
              id: item._id
            }
          }).then(result => {
            this.$message.success("取消Google验证成功!");
          });
        })
        .catch(() => {});
    },
    // 重置登录密码
    resetLoginPassWord(item) {
      if (!item) return this.$message("请选择用户");
      this.$confirm(
        "您确定要重设账号“" +
          '<el-tag class="red">' +
          item.username +
          "</el-tag>" +
          "”的登陆密码?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning",
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          adminApi
            .resetLoginPassWord({
              id: item._id,
              authCode: this.code
            })
            .then(result => {
              this.$set(this.form, "password", result.data);
              this.$message({
                type: "success",
                message: "重设登陆密码成功!"
              });
              // this.form = Object.assign({}, row);
            })
            .catch(error => {
              this.code = "";
              let layer = this.$refs.verifyDialog;
              layer.init(this);
              if (error.data.authType) {
                layer.show({
                  authType: error.data.authType,
                  callback: this.resetLoginPassWord
                });
              }
            });
        })
        .catch(() => {});
    },
    // 保存编辑
    async saveEdit() {
      let disable = {};
      for (let i in this.form.disable) {
        if (i) disable[i] = !this.form.disable[i];
      }
      this.editBtnLoad = true;
      try {
        let result = await adminApi.changeUserInfo({
          id: this.idx,
          truename: this.form.truename,
          email: this.form.email,
          mobile: this.form.mobile,
          idcard: this.form.idcard,
          authType: this.form.selected,
          disable: disable,
          authCode: this.code
        });
        this.getData();
        this.$message.success("用户信息修改成功");
        this.editVisible = false;
        this.editBtnLoad = false;
      } catch (e) {
        this.code = "";
        this.editBtnLoad = false;
        let layer = this.$refs.verifyDialog;
        layer.init(this);
        if (e && e.data && e.data.authType) {
          layer.show({
            authType: e.data.authType,
            callback: this.saveEdit
          });
        }
      }
    }
  }
};
</script>


<style scoped>
/*刷新动画*/
/*.rotate {*/
/*animation: rotate 2s infinite linear!important;*/

/*}*/

/*@keyframes rotate {*/
/*from {*/
/*transform: rotate(0deg)*/
/*}*/
/*to {*/
/*transform: rotate(360deg)*/
/*}*/
/*}*/

.pre-img {
  width: 80px;
  height: 80px;
  overflow: hidden;
  display: inline-block;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 5px;
}

.pre-img img {
  width: 100%;
  height: 100%;
}

.certification-img {
  text-align: center;
}

.certification-img .pre-img img {
  cursor: zoom-in;
}

.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
  background-color: #f2f2f2;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 40%;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}

.handle-box {
  margin-bottom: 20px;
}
</style>
