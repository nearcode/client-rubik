<template>
  <div class="At_the_bottom tickets">
    <!-- 编辑弹出框 -->
    <!-- @close="closeDialog('form')" -->
    <el-dialog title="创建工单" :visible.sync="editVisible" :close-on-click-modal="false" width="600px">
      <el-form ref="form" :rules="rules" :model="form" label-width="90px">
        <el-form-item prop="tid" label="工单类型">
          <el-select v-model="form.tid">
            <el-option v-for="(v,k) in types" :key="k" :value="v.id" :label="v.text"></el-option>
          </el-select>
        </el-form-item>

        <!-- 评论表单 -->
        <el-form-item prop="subject" label="标题">
          <el-input v-model="form.subject" placeholder="请输入标题"></el-input>
        </el-form-item>

        <el-form-item prop="content" label="内容">
          <el-input
            type="textarea"
            v-model="form.content"
            placeholder="请具体并准确的描述您的问题,这有助于我们更高效的帮助您!"
            :rows="5"
          ></el-input>

          <el-upload
            class="upload-demo"
            ref="upload"
            :action="urlAction"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="handleAvatarSuccess"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="form.attachments"
          >
            <el-button type="text" icon="icon-paper-clip">上传附件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/bmp/gif文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="workorderAdd('form')">确 定</el-button>
      </span>
    </el-dialog>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>工单管理</span>
        <el-button
          type="text"
          icon="el-icon-edit-outline"
          class="pull-right"
          @click="addWorkorder"
        >创建工单</el-button>
      </div>

      <div class="text item">
        <el-table :data="resultList" @expand-change="expandSelect" ref="table" style="width: 100%">
           <template slot="empty">
                  <i class="icon-no-data"></i>
                 <p>暂无数据</p>
                  </template>
          <el-table-column type="expand" width="1">
            <template slot-scope="scope">
              <v-reply :replyRow="scope.row"></v-reply>
            </template>
          </el-table-column>
          <!-- 标题 -->
          <el-table-column label="问题标题" prop="subject"></el-table-column>
          <el-table-column label="类型" prop="type"></el-table-column>
          <!-- 创建时间 -->
          <el-table-column label="创建时间" prop="date">
            <template slot-scope="scope">{{scope.row.create |toTimeStr}}</template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column label="状态" prop="name">
            <template slot-scope="scope">
              <el-tag
                :type="v.type"
                v-for="(v,k) in results"
                :key="k"
                v-if="scope.row.result==v.id"
              >{{v.text}}</el-tag>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" prop="desc" width="160">
            <template slot-scope="scope">
              <el-button @click="show(scope.row)" size="mini">查看</el-button>
              <el-button type="danger" @click="workorderClose(scope.row)" size="mini" v-if="scope.row.result != 3">关闭</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
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
    </el-card>
  </div>
</template>

<script>
import baseApi from "@/api/base";
import config from "@/config";
import { mapState } from "vuex";
import vReply from "./reply.vue";

export default {
  name: "bank",
  data() {
    return {
      loading: false,
      editVisible: false,
      ass: [],
      form: {
        attachments: []
      },
      expands: null, //当前回复
      resultList: [],
      types: [],
      rules: {
        tid: [
          {
            required: true,
            message: "请选择类型",
            trigger: ["change", , "blur"]
          }
        ],
        subject: [
          {
            required: true,
            message: "标题不能为空",
            trigger: ["change", , "blur"]
          }
        ],
        content: [
          {
            required: true,
            message: "内容不能为空",
            trigger: ["change", , "blur"]
          }
        ]
      },
      results: [
        {
          id: 1,
          type: "warning",
          text: "待处理"
        },
        {
          id: 2,
          type: "danger",
          text: "处理中"
        },
        {
          id: 3,
          type: "success",
          text: "处理完成"
        }
      ],
      totalItems: 0,
      currentPage: 1,
      urlAction: config.baseUrl + "/account/upload"
    };
  },
  components: {
    vReply
  },
  computed: {
    ...mapState(["webTitle", "uid"])
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 查看回复
    async show(row) {
      if (!row) return;
      const $table = this.$refs.table;
      this.$nextTick(() => {
          this.resultList.map(item => {
            if (item.id != row.id) {
              $table.toggleRowExpansion(item, false);
            }
          });
          $table.toggleRowExpansion(row);
        });
    },
    workorderClose(row) {
      if (!row) return;
      this.$confirm(`你确定关闭吗?`, "提示", {}).then(async () => {
        try {
          let result = await baseApi.workorderClose({ id: row.id });
          this.getData();
          this.$message.success("设置成功");
        } catch (e) {}
      }).catch(() => {});;
    },
    // 获取列表
    async getData() {
      try {
        let data = {
          p: this.currentPage
        };
        let result = await baseApi.workorderList(data);
        this.resultList = result.data;
        this.totalItems = result.count;
      } catch (e) {}
    },
    // 创建工单
    addWorkorder() {
      this.editVisible = true;
      this.getTypes();
    },
    // 获取工单类型
    async getTypes() {
      try {
        let result = await baseApi.workorderTypes();
        this.types = result.data;
      } catch (e) {}
    },
    // 工单提交
    workorderAdd(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let attachments = [];
          for (let item of this.$refs.upload.uploadFiles) {
            if (item.response.data) {
              attachments.push(item.response.data);
            }
          }

          try {
            let data = {
              subject: this.form.subject,
              content: this.form.content,
              tid: this.form.tid,
              attachments
            };
            let result = await baseApi.workorderAdd(data);
            this.editVisible = false;
            this.$message.success("提交成功");
            this.getData();
          } catch (e) {}
        } else {
          return false;
        }
      });
    },
    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    expandSelect(row, expandedRows) {
      // if (expandedRows.length >1) {
      //     expandedRows.shift();
      // }
    },
    // 上传

    handleRemove(file, fileList) {
      // this.form.attachments.splice(file.data,1)
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleAvatarSuccess(res, files) {
      // this.form.attachments.push(res.data);
      console.log("成功", files);
    }
  }
};
</script>

<style lang="less" scoped>
.reply {
  padding-top: 15px;
  button {
    margin-top: 10px;
  }
  // border-top:1px solid #ddd;
}

.tickets {
  /deep/ .el-table__expanded-cell {
    padding: 8px 0;
  }
  /deep/ .el-table__expand-column .cell {
    display: none;
  }
  .commentlist {
    // background-color: #F2F3F8;
    .avatar {
      display: inline-block;
      box-sizing: border-box;
      text-align: center;
      overflow: hidden;
      color: #fff;
      background: #c0c4cc;
      width: 40px;
      height: 40px;
      border-radius: 100%;
      line-height: 40px;
      font-size: 14px;
      position: absolute;
      left: 0;
      top: 0;
    }
    .time {
      color: #999;
      font-size: 12px;
      padding-left: 5px;
    }
    .comment_info {
      position: relative;
      padding: 0 0 10px 55px;
      border-bottom: 1px dashed #ebeef5;
      margin-bottom: 10px;
    }
    .comment_content:before {
      content: "";
      position: absolute;
      right: 100%;
      top: 10px;
      width: 0;
      height: 0;
      border-width: 10px;
      border-style: solid;
      border-color: transparent;
      border-right-color: currentColor;
      color: #f2f3f8;
    }
    .comment_content {
      position: relative;
      margin-top: 10px;
      padding: 15px;
      background-color: #f2f3f8;
      border-radius: 5px;
      max-width: 500px;
      p {
        word-wrap: break-word;
        word-break: break-all;
        text-align: justify;
        text-justify: newspaper;
        white-space: normal;
      }
    }
    .comment_children {
      margin-left: 40px;
    }
  }
}
</style>