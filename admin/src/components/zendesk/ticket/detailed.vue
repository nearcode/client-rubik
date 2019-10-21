<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>工单管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path:'/zendesk/ticket'}">工单列表</el-breadcrumb-item>
        <el-breadcrumb-item>工单详细</el-breadcrumb-item>
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
    <div class="container" style="padding:10px;">
      <!--操作与搜索-->
      <div class="plugins-tips">
        <p>
          <span class="label">问题标题：</span>
          {{resultList.subject}}
        </p>
        <p style="padding:5px 0 0 0;">
          <span class="label">问题内容：</span>
          <span style="color:red">{{resultList.content}}</span>
        </p>
        <p>
          <span class="label">附件：</span>
          <span
            @click="showSfz(v)"
            style="vertical-align: middle;cursor:zoom-in;width:20px;overflow: hidden;height:20px;margin:0 5px;border-radius:3px;border: 1px solid #eee;;display:inline-block"
            v-for="(v,k) in resultList.attachments"
            :key="k"
          >
            <img :src="v" style="width:100%;height:100%" alt>
          </span>
        </p>
        <ul class="detailed">
          <li>
            <span class="label">提交账号：</span>
            {{resultList | toAccount}}
          </li>
          <li>
            <span class="label">工单类型：</span>
            {{resultList.tid}}
          </li>
          <li>
            <span class="label">提交时间：</span>
            {{resultList.create | toTimeStr}}
          </li>
          <li>
            <span class="label">状态：</span>
            <el-tag :type="v.type" v-for="(v,k) in results" :key="k" v-if="v.id==resultList.result">{{v.text}}</el-tag>
          </li>
          <li v-if="resultList.result !=3">
            <el-button size="mini" type="danger"  @click="workorderClose(resultList)">设为关闭</el-button>
          </li>
        </ul>
      </div>

      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold;">沟通记录</span>
        </div>
        <el-main class="commentlist" id="commentlist">
          <div style="text-align:center;">
            <el-button
              class="load-more"
              v-if="!noMore"
              @click="handleCurrentChange"
              type="text"
              :loading="loading"
            >点击加载更多</el-button>
            <p class="no-more" v-if="noMore">没有更多了~</p>
          </div>
          <div class="comment_info"  :style="{'background-color':(isService(v.uid)?'#F2F6FC':'#fff')}" v-for="(v,k) in replyList" :key="k">
            <span class="avatar" :style="{'background-color':(isService(v.uid)?'#409EFF':'#909399')}">
              <i class="el-icon-s-custom"></i>
            </span>
            <div style="display:inline-block;vertical-align:top;margin-left:5px;">
              <div>
                <span style="color:#909399">{{v.username}} ({{v.uid}})  <i v-if="isService(v.uid)">(客服)</i></span>
                <!-- <el-button size="mini" icon="fa fa-paperclip" type="text">附件</el-button> -->
                <!-- <span @click="preview(val)" style="cursor:zoom-in;overflow: hidden;width:20px;height:20px;margin:0 5px;border-radius:3px;border: 1px solid #eee;;display:inline-block" v-for="(val,key) in v.attachments" :key="key">
                <img :src="val" style="width:100%;height:100%" alt="">
                </span>-->
              </div>
              <div class="comment_content">
                <p v-html="v.content"></p>
                <span
                  style="margin:5px;cursor:zoom-in;display:inline-block"
                  @click="showSfz(val)"
                  v-for="(val,key) in v.attachments"
                  :key="key"
                >
                  <el-avatar :key="key" shape="square" size="small" :src="val"></el-avatar>
                </span>
              </div>
              <small class="time">{{v.create |toTimeStr}}</small>
            </div>
          </div>
        </el-main>
        <!-- 回复区 -->
        <div class="reply" v-if="resultList.result !=3">
          <div>
            <el-input
              clear="btn-block"
              type="textarea"
              v-model="form.content"
              placeholder="在此输入回复"
              :rows="3"
            ></el-input>
          </div>
        
          <el-dropdown
            style="margin-top: 10px;"
            class="pull-left"
            :disabled="!form.content"
            placement="top"
            split-button
            type="primary"
            @click="sumbit"
            @command="sumTypeCkeck"
          >
            回复
            <el-dropdown-menu slot="dropdown" :disabled="!form.content">
              <el-dropdown-item v-for="(v,k) in quick" :command="v" :key="k">{{v}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

            <el-upload
             style="margin: 10px 0 0 10px;"
            class="upload-demo pull-left"
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
            <el-button type="text" icon="fa fa-paperclip">上传附件</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png/bmp/gif文件</div> -->
          </el-upload>
        </div>
      </el-card>
    </div>
    <!--图片预览组件-->
    <show-photo ref="previewsfz" :photo="photo"></show-photo>
  </div>
</template>

<script>
import adminApi from "@/api/admin";
import config from "@/config";
import _ from "lodash";
import showPhoto from "@/components/common/PreviewPicture";
import { mapState } from "vuex";

export default {
  name: "accountHistory",
  data() {
    return {
      id: this.$route.params.id,
      resultList: [],
      replyList: [],
      photo: "",
      quick: ["您好，我们已经收到您提交的问题，正在为您查看，稍等"],
      loading: false,
      currentPage: 1,
      totalItems: 0,
      form: {},
      urlAction: config.baseUrl + "/account/upload",
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
    };
  },
  components: {
    showPhoto
  },
 
  computed: {
    ...mapState(["webTitle", "uid"]),

    noMore() {
      if (this.totalItems == this.replyList.length) {
        return true;
      }
    }
  },
  mounted() {
    this.getData();
    this.setScroll();
  },
  methods: {
    isService(uid){
      if(!uid) return;
      if(uid!=this.resultList.uid){
        return true;
      }else{
        return false;
      }
    },
    setScroll() {
      this.$nextTick(() => {
        setTimeout(() => {
          var div = document.getElementById("commentlist");
          div.scrollTop = div.scrollHeight;
        }, 100);
      });
    },
    // 预览图片
    showSfz(url) {
      if (!url) return;
      this.photo = url;
      this.$refs.previewsfz.show();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.workorderReplyList();
    },
    // 下拉快捷回复列表
    sumTypeCkeck(type) {
      this.$set(this.form, "content", type);
    },
    workorderClose(row){
                if(!row) return;
                  this.$confirm(`你确定关闭吗?`, '提示', {

                  }).then(async () => {
                     try{
                        let result = await adminApi.workorderClose({id:row.id});
                        this.getData();
                        this.$message.success('设置成功')
                        }catch(e){

                        }
                }).catch(() => {});
    },
    //   回复
    async sumbit() {
      if (!this.form.content) return;
      try {
        let attachments = [];
        for (let item of this.$refs.upload.uploadFiles) {
          if (item.response.data) {
            attachments.push(item.response.data);
          }
        }

        let result = await adminApi.workorderReply({
          id: this.resultList.id,
          content: this.form.content,
          attachments
        });
        this.getData();
        this.setScroll();
        this.$set(this.form, "content", "");
        this.$message.success("回复成功");
      } catch (e) {}
    },
    async workorderReplyList(type) {
      if (!this.id) return;
      if(type) this.currentPage=1;
      this.loading = true;
      let div,height,scrollHeight,Top
       this.$nextTick(() => {
         try{
             div = document.getElementById("commentlist");
            height = div.clientHeight,
            scrollHeight = div.scrollHeight,
            Top = div.scrollTop;
         }catch(e){

         }
       })

      try {
       


        let result = await adminApi.workorderReplyList({
          id: this.id,
          p: this.currentPage
        });
        this.loading = false;
        if(type) this.replyList=[];

        for (let item of result.data) {
          this.replyList.unshift(item);
        }

        this.totalItems = result.count;

        if (type) {
          this.setScroll();
        } else {
          this.$nextTick(() => {
            if (Math.abs(scrollHeight - height - Top) <= 1) {
              div.scrollTop = div.scrollHeight;
            } else {
            }
          });
        }
      } catch (e) {}

      this.currentPage += 1;
    },
    async getData() {
      if (!this.id) return;
      this.workorderReplyList('reply');
      try {
        let result = await adminApi.workorderDetail({ id: this.id });
        this.resultList = result.data[0];
      } catch (e) {}
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
  },
  watch: {
    $route() {
      this.id = this.$route.params.id;
      // console.log(this.id);
        console.log('123')
    },
    id() {
      if (this.id){
        this.replyList=[];
         this.totalItems=0;
        this.getData();
        console.log('213')
      } 
    }
  }
};
</script>

<style scoped>
.box-card /deep/ .el-card__header{
  padding: 10px 20px;
}
.box-card /deep/ .el-card__body{
      padding: 0;
 
}
.load-more {
  text-align: center;
  padding-bottom: 15px;
  cursor: pointer;
}
.no-more {
  text-align: center;
  padding-bottom: 15px;
  color: #c0c4cc;
}
.upload-demo /deep/ .el-upload--text {
  width: auto !important;
  height: auto !important;
  border: none !important;
}
.commentlist {
  height: 500px;
  overflow-y: scroll;
  padding: 10px;
}
.reply {
  padding: 15px;
}
.detailed {
  display: flex;
  align-items: center;
  justify-content: space-between;
  list-style-type: none;
}
.label {
  color: #a5adb8;
}

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
  /* position: absolute;
  left: 0;
  top: 0; */
}
.time {
  color: #999;
  font-size: 12px;
  padding-left: 5px;
}
.comment_info {
  position: relative;
  padding:10px;
  border-bottom: 1px dashed #DCDFE6;
}
.comment_content:before {
  content: "";
  position: absolute;
  right: 100%;
  top: 10px;
  width: 0;
  height: 0;
  /* border-width: 10px;
  border-style: solid;
  border-color: transparent;
  border-right-color: currentColor;
  color: #f2f3f8; */
}
.comment_content {
  position: relative;
  /* margin-top: 10px; */
  padding: 10px;
  max-width:500px;
  /* background-color: #f2f3f8; */
  border-radius: 5px;
  word-wrap: break-word;
  word-break: break-all;
  text-align: justify;
  white-space: normal;
}
.comment_children {
  margin-left: 40px;
}
</style>
