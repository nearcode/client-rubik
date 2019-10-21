<template>
  <div class="info">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>任务管理</el-breadcrumb-item>
        <el-breadcrumb-item>任务列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group class="pull-right" style="margin-top: -21px">
        <el-tooltip class="item" effect="dark" content="导出表格" placement="top">
          <el-button icon="el-icon-download">导出</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
          <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
        </el-tooltip>
      </el-button-group>
    </div>
    <div class="container">
      <!--操作与搜索-->
      <div class="plugins-tips">
        <div style="margin-top: 15px;">
          <el-button
            type="primary"
            :disabled="multipleSelection.length==0"
            icon="delete"
            @click="delAll"
          >批量删除</el-button>

          <el-button type="danger" icon="delete" class="handle-del mr10" @click="addTaks">添加任务</el-button>
        </div>
      </div>

      <el-table
        :data="resultList"
        border
        class="table"
        v-loading="loading"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="任务简介" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row | getDictValue('content')}}</span>
          </template>
        </el-table-column>

        <el-table-column label="网址" align="center">
          <template slot-scope="scope">
            <span>{{scope.row | getDictValue('url')}}</span>
          </template>
        </el-table-column>

        <el-table-column label="类型" width="100" align="center">
          <template slot-scope="scope">
            <el-tag>{{scope.row | getDictValue('method')}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="定时规则" align="center">
          <template slot-scope="scope">
            <span>{{scope.row | getDictValue('rule')}}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="v.type"
              v-for="(v,k) in statusList"
              :key="k"
              v-if="scope.row.result==v.index"
            >{{v.text}}</el-tag>
            <!--<el-tag>{{statusList[scope.row.status]}}</el-tag>-->
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="180" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.create | toTimeStr}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="text" class="red" @click="setTask(scope.row._id,'stop')">停止
                        </el-button>
                        <el-button type="text" @click="setTask(scope.row._id,'open')">启动
            </el-button>-->

            <!-- <el-button type="text" class="red" @click="setTask(scope.row._id,'close')">禁用
            </el-button>-->
            <el-button type="text" @click="handleEdit(scope.row)">修改</el-button>

            <el-tooltip :content="'是否运行：'+ scope.row.isRun" placement="top">
                 <!-- :active-value="1" -->
                <!-- :inactive-value="0" -->
              <el-switch
                :disabled="getPerms('robot:exchange:state')"
                @change="setTask($event,scope.row)"
                v-model="scope.row.isRun"
              ></el-switch>
            </el-tooltip>
            <!--<el-button type="text" icon="el-icon-delete" class="red"-->
            <!--@click="delAdmin(scope.row._id)">删除-->
            <!--</el-button>-->
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

    <el-dialog
      :title="(form.modalType=='edit'?'修改':'添加')+'任务'"
      @close="resetForm('form')"
      :close-on-click-modal="false"
      :visible.sync="editVisible"
      width="600px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="content" label="任务简介">
          <el-input v-model="form.content" placeholder="请输入任务简介"></el-input>
        </el-form-item>
        <el-form-item prop="method" label="类型">
          <el-select v-model="form.method" filterable clearableplaceholder="请选择">
            <el-option :label="v" v-for="(v,k) in methodList" :key="k" :value="v"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="url" label="网址">
          <el-input v-model="form.url" placeholder="请输入网址"></el-input>
        </el-form-item>

        <el-form-item prop="runTimes" label="执行时间">
          <el-row :gutter="20">
            <el-col :span="4" v-for="(v,k) in runTimes" :key="k" :title="v.text">
              <el-input v-model="runTimes[k].index" :placeholder="v.text"></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item prop="parameter" label="参数">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4}"
            v-model="form.parameter"
            placeholder="请输入参数"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')" :loading="editBtnLoad">确 定</el-button>
        <el-button @click="editVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import taskApi from "@/api/task";
import { mapState } from "vuex";
// _.cloneDeep
export default {
  name: "Article",
  data() {
    let validatePass = (rule, value, callback) => {
      let valid = () => {
        let slef = false;
        for (let item of this.runTimes) {
          if (item.index) {
            slef = true;
          }
        }
        return slef;
      };
      if (valid()) {
        callback();
      } else {
        callback(new Error("请至少填写一项"));
      }
    };
    return {
      form: {},
      editVisible: false,
      loading: true,
      editBtnLoad: false,
      currentPage: 1,
      resultList: [],
      totalItems: 0,
      methodList: ["GET", "POST"],
      runTimes: [
        { index: "", text: "分" },
        { index: "", text: "时" },
        { index: "", text: "天" },
        { index: "", text: "周" },
        { index: "", text: "年" }
      ],
      statusList: [
        { text: "禁用", index: "-1", type: "danger" },
        { text: "停止", index: "0", type: "info" },
        { text: "运行", index: "1", type: "success" }
      ],
      rules: {
        content: [
          {
            required: true,
            message: "请输入任务简介",
            trigger: ["change", "blur"]
          }
        ],
        method: [
          { required: true, message: "请选择", trigger: ["change", "blur"] }
        ],
        url: [{ required: true, message: "网址不能为空", trigger: "blur" }],
        runTimes: [{ validator: validatePass }]
      },
      multipleSelection: []
    };
  },
  computed: {
    ...mapState(["ArticleType"])
  },
  mounted() {
    this.getData();
  },

  methods: {
    // 获取数据
    async getData() {
      let p = this.currentPage;
      try {
        let result = await taskApi.taskList(p);
        let data = result.data;
        for(let item of data){
            if(item.result == 1){
                item.isRun = true;
            }else if(item.result == 0){
                item.isRun = false;
            }
        }
        console.log(data)
        this.resultList = data;
        this.totalItems = result.count;
        this.loading = false;
      } catch (e) {}
    },
    // 打开添加任务弹框
    addTaks() {
      this.editVisible = true;
      this.form = {
        parameter: "{}"
      };
      this.$set(this.form, "modalType", "add");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.onSubmit();
        } else {
          return false;
        }
      });
    },
    async onSubmit() {
      let resList = [];

      for (let i in this.runTimes) {
        if (!this.runTimes[i].index) {
          this.runTimes[i].index = "*";
        }
        resList.push(this.runTimes[i].index);
      }

      let runTime = resList.join(" ");

      let data = {
        content: this.form.content,
        url: this.form.url,
        method: this.form.method,
        parameter: JSON.parse(this.form.parameter),
        rule: runTime
      };
      if (this.form.modalType == "edit") {
        data.id = this.form._id;
        try {
          let result = await taskApi.editTask(data);
          this.getData();
          this.$message.success("修改成功");
        } catch (e) {}
      } else {
        try {
          let result = await taskApi.addTask(data);
          this.getData();
          this.$message.success("添加成功");
        } catch (e) {}
      }
      this.editVisible = false;
    },
    async setTask(state, row) {
      console.log(state);
      let tips = "",
        item = "";
      switch (state) {
        //禁用
        case "close":
          tips = "禁用";
          item = "taskClose";
          break;
        //停止
        case false:
          tips = "停止";
          item = "taskStop";
          break;
        //启动
        case true:
          tips = "启动";
          item = "taskOpen";
          break;
      }

      try {
        let result = await taskApi[item]({
            id:row._id
        });
        this.getData();
        this.$message.success("已" + tips);
      } catch (e) {
        row.isRun = !row.isRun;
      }
    },

    // 重置表单
    resetForm(formName) {
      if (this.$refs[formName])
        this.$nextTick(() => {
          this.$refs[formName].resetFields();
        });
    },
    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    // 删除
    delAll() {
      let data = this.multipleSelection;
      if (data.length == 0) return this.$message.error("请勾选内容");
      this.$confirm("你确定删除选中的任务吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning",
        dangerouslyUseHTMLString: true
      })
        .then(async () => {
          for (let i = 0; i < data.length; i++) {
            try {
              let result = await taskApi.taskDel(data[i]._id);
              this.getData();
              this.$message.success("删除成功");
            } catch (e) {}
          }
          this.multipleSelection = [];
        })
        .catch(error => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
      // this.$refs.multipleTable.toggleRowSelection(row);
      console.log(JSON.stringify(this.multipleSelection));
    },
    handleEdit(item) {
      this.editVisible = true;
      this.form = _.cloneDeep(item);
      this.$set(this.form, "modalType", "edit");

      if (item.parameter) {
        this.$set(this.form, "parameter", JSON.stringify(item.parameter));
      }
      if (item.rule) {
        let arr = item.rule.split(" ");
        for (let i in arr) {
          this.runTimes[i].index = arr[i];
        }
      } else {
        for (let i = 0; i < 5; i++) {
          this.runTimes[i].index = "";
        }
      }
    }
  }
};
</script>

<style scoped>
</style>
