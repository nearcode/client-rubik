<template>
  <div>
    <el-card class="box-card commentlist" v-loading="loading" shadow="never">
      <div slot="header">
        <el-button @click="getReplyList(replyRow,'refresh')" :loading="loading" size="mini">刷新</el-button>
        <!-- <div class="plugins-tips">
        <p>
          <span class="label">问题标题：</span>{{replyRow.subject}}
        </p>
         <p style="padding:5px 0 0 0;">
          <span class="label">问题内容：</span>{{replyRow.content}}
        </p>
        <p>
          <span class="label">附件：</span>
           <span class="accessory" @click="showSfz(v)" v-for="(v,k) in replyRow.attachments" :key="k">
                  <img :src="v" style="width:100%;height:100%" alt="">
            </span>
        </p>
      </div> -->
      </div>

    <el-main class="main" id="commentlist">
      <div style="text-align:center;">
        <el-button class="load-more" v-if="!noMore" @click="handleCurrentChange" type="text" :loading="loading">点击加载更多</el-button>
      <p class="no-more" v-if="noMore">没有更多了~</p>
      </div>
      <div class="comment_info" :style="{'background-color':(isService(v.uid)?'#F2F6FC':'#fff')}"  v-for="(v,k) in replyList" :key="k">
        <span class="avatar" :style="{'background-color':(isService(v.uid)?'#409EFF':'#909399')}" >
          <i class="icon-user"></i>
        </span>
        <div style="display:inline-block;vertical-align:top;margin-left:5px;">
          <div>
            <span style="color:#909399"> {{v.username}} ({{v.uid}}) <span v-if="isService(v.uid)">(客服)</span></span>
            <!-- <el-button size="mini" icon="fa fa-paperclip" type="text">附件</el-button> -->
            <!-- <span @click="preview(val)" style="cursor:zoom-in;overflow: hidden;width:20px;height:20px;margin:0 5px;border-radius:3px;border: 1px solid #eee;;display:inline-block" v-for="(val,key) in v.attachments" :key="key">
                <img :src="val" style="width:100%;height:100%" alt="">
              </span> -->

          </div>
          <div class="comment_content">
            <p v-html="v.content"></p>
            <span style="margin:5px;cursor:zoom-in;display:inline-block;" @click="preview(val)"  v-for="(val,key) in v.attachments" :key="key">
              <el-avatar shape="square" size="small" :src="val"></el-avatar>
            </span>
            
          </div>
           <small class="time">{{v.create |toTimeStr}}</small>
        </div>
      </div>
      </el-main>

      <!-- 回复区 -->
      <div class="reply clearfix"  v-if="replyRow.result != 3">
        <div>
          <el-input
            clear="btn-block"
            type="textarea"
            v-model="reply.content"
            placeholder="在此输入回复"
            :rows="3"
          ></el-input>
        </div>
        <el-upload
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
          :file-list="reply.attachments"
        >
          <el-button type="text" icon="icon-paper-clip">上传附件</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png/bmp/gif文件</div> -->
        </el-upload>
        <el-button
          type="primary"
          class="pull-right"
          :disabled="!reply.content"
          :loading="reply.loading"
          @click="workorderReply(replyRow)"
        >回复</el-button>
      </div>
    </el-card>

     <!--图片预览组件-->
        <showPhoto ref="showPhoto" :photo="photo"></showPhoto>
  </div>
</template>

<script>
import baseApi from "@/api/base";
import config from "@/config";
import { mapState } from "vuex";
import showPhoto from "@/pages/common/previewPicture";
import { setTimeout } from 'timers';

export default {
  name: "bank",
  props: ["replyRow"],
  data() {
    return {
      loading: false,
      photo: '',
      reply: {},
      expands: null, //当前回复
      replyList: [],
      totalItems: 0,
      currentPage: 1,
      urlAction: config.baseUrl + "/account/upload"
    };
  },
   components: {
        showPhoto
  },
  computed: {
    ...mapState(["webTitle", "uid"]),
   
    noMore(){
       if( this.totalItems ==  this.replyList.length){
          return true;
        }
    }
  },
  mounted() {
    this.getReplyList();
    this.setScroll();
  },
  methods: {
     isService(uid){
      if(!uid) return;
      if(uid!=this.uid){
        return true;
      }else{
        return false;
      }
    },
    setScroll(){
        this.$nextTick(() => {
                setTimeout(()=>{
                    var div = document.getElementById('commentlist');
                    div.scrollTop = div.scrollHeight
                },100)
            })
    },
     // 预览图片
     preview(url) {
          if (!url) return;
          this.photo = url;
          this.$refs.showPhoto.show()
      },
    // 获取回复列表
    async getReplyList(callback,type) {
      if(type) this.currentPage=1;
      let row = this.replyRow;
      this.loading = true;

      var div = document.getElementById('commentlist');
      let height = div.clientHeight,
          scrollHeight = div.scrollHeight,
          Top = div.scrollTop;

      try {
        let result = await baseApi.workorderReplyList({ id: row.id ,p:this.currentPage});
        this.loading = false;
        if(type) this.replyList=[];
        for(let item of result.data){
          this.replyList.unshift(item)
        }
      
        this.totalItems = result.count;
       
      
         
        if(type){
          this.setScroll();
        }else{
           this.$nextTick(() => {
              if (Math.abs(scrollHeight - height - Top) <= 1) {
              
                  div.scrollTop = div.scrollHeight
              } else {
                 
              }
         })
        }

        callback && callback();
      } catch (e) {}

      this.currentPage +=1;
    },
    // 回复
    async workorderReply(row) {
      if (!this.reply.content) return;
      this.$set(this.reply, "loading", true);
      try {

            let attachments=[];
           for(let item of this.$refs.upload.uploadFiles){
                  if(item.response.data){
                    attachments.push(item.response.data)
                  }
              }

        let result = await baseApi.workorderReply({
          id: row.id,
          content: this.reply.content,
          attachments
        });
        this.$set(this.reply, "loading", false);
        this.$set(this.reply, "content", "");
        this.getReplyList(row,'reply');
        this.$message.success("回复成功");
      } catch (e) {
        this.$set(this.reply, "loading", false);
      }
    },
    // 分页导航
    handleCurrentChange(val) {
     
      this.getReplyList();
       
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
.box-card{
  /deep/ .el-card__body{
      padding: 10px;
  }
}
.accessory{
    cursor:zoom-in;width:20px;overflow: hidden;height:20px;margin:0 5px;border-radius:3px;border: 1px solid #eee;;display:inline-block
}
.accessory>img{
  width:100%;height: 100%;
}
.load-more{
  text-align:center;padding:15px 0;cursor: pointer;
}
.no-more{
  text-align:center;padding:15px 0;color:#C0C4CC;
}
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
      // position: absolute;
      // left: 0;
      // top: 0;
    }
    .time {
      color: #C0C4CC;
      font-size: 12px;
      padding-left: 5px;
    }
    .main{
       height: 500px;
      overflow-y: auto;
    }
    .comment_info {
      position: relative;
      padding: 10px;
     
      border-bottom: 1px dashed #DCDFE6;
      // margin-bottom: 10px;
    }
    .comment_content:before {
      content: "";
      position: absolute;
      right: 100%;
      top: 10px;
      width: 0;
      height: 0;
      // border-width: 10px;
      // border-style: solid;
      // border-color: transparent;
      // border-right-color: currentColor;
      // color: #f2f3f8;
    }
    .comment_content {
      position: relative;
      // margin-top: 10px;
      padding: 10px;
      // background-color: #f2f3f8;
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