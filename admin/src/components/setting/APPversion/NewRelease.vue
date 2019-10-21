<template>
  <div class="info">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>APP版本更新</el-breadcrumb-item>
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
        <el-button type="primary" @click="addApp" :disabled="getPerms('games:invest:update')">新增</el-button>
      </div>
      <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable">
        <el-table-column prop="name" label="名称">
          <template slot-scope="scope">
            <span>{{scope.row | getDictValue('name')}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="client" label="客户端">
          <template slot-scope="scope">
            <el-tag v-for="(v,k) in scope.row.client" :key="k">{{v.replace('UpUrl','')}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="build" label="build">
          <template slot-scope="scope">{{scope.row | getDictValue('build')}}</template>
        </el-table-column>

        <el-table-column prop="force" label="是否强制升级" align="center">
          <template slot-scope="scope">{{scope.row['force']?'是':'否'}}</template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              :disabled="getPerms('games:invest:update')"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              :disabled="getPerms('games:invest:del')"
              class="red"
              @click="delApp(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        :title="(form.dialogType=='add'?'添加':'修改')+'版本'"
        @close="closeDialog('form')"
        :visible.sync="editVisible"
        :close-on-click-modal="false"
        width="600px"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
          <!-- 系统名称 -->
          <el-form-item label="系统名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <!-- 客户端 -->
          <el-form-item prop="client" label="客户端">
            <el-select v-model="form.client" multiple placeholder="请选择,可多选">
              <el-option :label="v.title" :value="v.index" v-for="(v,k) in system" :key="k"></el-option>
            </el-select>
          </el-form-item>
          <!-- build -->
          <el-form-item prop="build" label="Build">
            <el-col :span="12">
              <el-input v-model="form.build"></el-input>
            </el-col>
            <br />
            <p class="prompt">发布前请与相关人员确认Build值，需与客户端一致</p>
          </el-form-item>

          <el-form-item prop="downUrl" label="下载页面">
            <el-col :span="12">
              <el-input v-model="form.downUrl"></el-input>
            </el-col>
            <br />
          </el-form-item>

          <el-form-item prop="h5Url" label="H5地址">
            <el-col :span="12">
              <el-input v-model="form.h5Url"></el-input>
            </el-col>
            <br />
          </el-form-item>

          <!-- 下载链接 -->
          <div :key="key" v-for="(val,key) in form.client">
            <el-form-item
              :prop="v.index+'UpUrl'"
              :label="v.title+'更新地址'"
              v-if="val==v.index"
              :key="k"
              v-for="(v,k) in system"
            >
              <el-col :span="12">
                <el-input v-model="form[v.index+'UpUrl']" :placeholder="v.title+'更新地址'"></el-input>
              </el-col>
              <br />
              <!-- <p class="prompt" >升级跳转的页面地址，可在系统设置配置管理下茶轴标题为“app下载页配置”、key为“app_page_url”的值，把对应的地址复制到此处即可。前提是APP下载配置已发布生效</p> -->
            </el-form-item>

            <el-form-item
              :prop="v.index+'Url'"
              :label="v.title+'下载地址'"
              v-if="val==v.index"
              :key="k+'Url'"
              v-for="(v,k) in system"
            >
              <el-col :span="12">
                <el-input v-model="form[v.index+'Url']" :placeholder="v.title+'下载地址'"></el-input>
              </el-col>
              <br />
            </el-form-item>
          </div>
          <!-- 是否强制升级 -->
          <el-form-item prop="force" label="是否强制升级">
            <el-switch v-model="form.force"></el-switch>
          </el-form-item>
          <!-- 标题 -->
          <el-form-item prop="title" label="标题">
            <el-input type="text" v-model="form.title"></el-input>
          </el-form-item>
          <!-- 升级内容 -->
          <el-form-item prop="content" label="升级内容">
            <el-input type="textarea" v-model="form.content"></el-input>
          </el-form-item>
          <!-- 立即发布 -->
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">立即发布</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import baseApi from "@/api/admin";
import _ from "lodash";

export default {
  name: "NewRelease",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value) {
        for (let item of this.system) {
            if(value.indexOf(item.index) ==-1){
                this.$set(this.form, item.index+'UpUrl', "");
                this.$set(this.form, item.index+'Url', "");
            }
        }
      }
      if (!value || value.length == 0) {
        callback(new Error("请选择客户端"));
      } else {
        callback();
      }
    };
    return {
      form: {
        client: []
      },
      resultList: [],
      loading: false,
      editVisible: false,
      system: [
        { title: "android", index: "android" },
        { title: "ios", index: "ios" }
      ],
      rules: {
        name: [
          {
            required: true,
            message: "参数不能为空",
            trigger: ["change", "blur"]
          }
        ],
        build: [
          {
            required: true,
            message: "参数不能为空",
            trigger: ["change", "blur"]
          }
        ],
        androidUrl: [
          {
            required: true,
            message: "参数不能为空",
            trigger: ["change", "blur"]
          }
        ],
        iosUrl: [
          {
            required: true,
            message: "参数不能为空",
            trigger: ["change", "blur"]
          }
        ],
        downUrl: [
          {
            required: true,
            message: "参数不能为空",
            trigger: ["change", "blur"]
          }
        ],
        h5Url: [
          {
            required: true,
            message: "参数不能为空",
            trigger: ["change", "blur"]
          }
        ],
        client: [{ validator: validatePass, trigger: ["change", "blur"] }]
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    addApp() {
      this.form["dialogType"] = "add";
      this.editVisible = true;
    },
    // 关闭弹窗重置表单
    closeDialog(formName) {
      if (formName) {
        this.resetForm(this, formName);
      }
    },
    // 修改
    handleEdit(item) {
      this.editVisible = true;
      this.form = _.cloneDeep(item);
      this.form["dialogType"] = "edit";
    },
    // 删除
    delApp(row) {
      if (!row) return;
      this.$confirm(`你确定删除${row.name}吗?`, "提示", {})
        .then(async () => {
          try {
            let result = await baseApi.appDel({ name: row.name });
            this.getData();
            this.$message.success("删除成功");
          } catch (e) {}
        })
        .catch(() => {});
    },
    async getData() {
      this.loading = true;
      try {
        let result = await baseApi.appList();
        this.resultList = result.data;

        // 客户端
        for (let item of this.resultList) {
          item.client = [];
          for (let i in item) {
            for (let k of this.system) {
              if (i.indexOf(k.title) != -1) {
                if (item.client.indexOf(k.title) == -1) {
                  item.client.push(k.title);
                }
              }
            }
          }
        }
        this.loading = false;
      } catch (e) {}
    },
    onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            let result = await baseApi.appUpdate({
              name: this.form.name, //名称
              build: this.form.build, //版本号
              force: this.form.force, //是否强制更新
              title: this.form.title, //标题,
              content: this.form.content, //内容
              downUrl: this.form.downUrl, //下载地址
              h5Url: this.form.h5Url, //h5地址
              androidUpUrl: this.form.androidUpUrl, //安卓下载地址
              iosUpUrl: this.form.iosUpUrl, //苹果下载地址
              androidUrl: this.form.androidUrl,
              iosUrl: this.form.iosUrl
            });
            this.getData();
            this.editVisible = false;
            this.$message.success("设置成功");
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
.prompt {
  color: #909399;
  font-size: 12px;
}
</style>
