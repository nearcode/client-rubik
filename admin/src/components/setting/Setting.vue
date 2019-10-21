<template>
  <div class="info">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>基本设置</el-breadcrumb-item>
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
      <el-form ref="form" :model="form" label-width="180px">
          <!-- 网站标题 -->
        <el-form-item label="网站标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <!-- 平台币 -->
        <el-form-item label="平台币">
          <el-input v-model="form.coin"></el-input>
        </el-form-item>
        <!--网站logo和favicon图标-->
        <el-form-item :label="item.text" :key="item.index" v-for="item in iconList">
          <el-upload
            class="avatar-uploader"
            :action="urlAction"
            :show-file-list="false"
            :on-success="handleAvatarSuccess.bind(null, {'index':item.index,'type':'logo'})"
            :on-preview="handlePictureCardPreview"
            :on-error="uploadError"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form[item.index]" :src="form[item.index]" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-button v-if="form[item.index]" @click="showPhoto(form[item.index])">预览图片</el-button>
        </el-form-item>
          <!-- 社交软件 -->
        <el-form-item prop="contacts" label="社交">
          <el-select v-model="form.contacts" @change="contactsChange" value-key="name" multiple placeholder="请选择,可多选">
            <el-option :label="v.label" :value="v" v-for="(v,k) in contacts"  :key="k"></el-option>
          </el-select>
        </el-form-item>
        <!-- 社交账号 -->
        <el-form-item :label="v.label" v-for="(v,k) in form.contacts" :key="k">
          <el-input  v-if="v.type == 'text'" v-model="v.content" :placeholder="'请输入'+v.label"></el-input>

          <div v-if="v.type == 'image'">
            <el-upload
            class="avatar-uploader"
            :action="urlAction"
            :show-file-list="false"
            :on-success="handleAvatarSuccess.bind(null, {'index':v,'type':'img'})"
            :on-preview="handlePictureCardPreview"
            :on-error="uploadError"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="v.content" :src="v.content" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-button v-if="v.content" @click="showPhoto(v.content)">预览图片</el-button>
          </div>
        </el-form-item>
        <!-- 绑定域名 -->
        <el-form-item label="绑定域名">
          <el-input
            v-model="form.domains[i]"
            :placeholder="'域名'+(i+1)"
            class="addDomains"
            :key="i"
            v-for="(v,i) in form.domains"
          >
            <el-button slot="append" icon="el-icon-delete" @click="delLine(form.domains[i])"></el-button>
          </el-input>
          <el-button @click="addDomain">添加</el-button>
        </el-form-item>
        <!-- 工单 -->
        <!-- <el-form-item label="Zendesk:">
          <el-form :inline="true">
            <el-form-item label="域名">
              <el-input placeholder="域名" v-model="form.zendesk.domain"></el-input>
            </el-form-item>
            <el-form-item label="密钥">
              <el-input placeholder="密钥" v-model="form.zendesk.secretKey"></el-input>
            </el-form-item>
          </el-form>
        </el-form-item> -->
        <!-- 登录验证 -->
         <el-form-item label="登录验证">
          <el-switch v-model="form.loginVerify"></el-switch>
        </el-form-item>
        <!-- 邀请码 -->
         <el-form-item label="邀请码">
          <el-switch v-model="form.inviteCode"></el-switch>
        </el-form-item>
        <!-- 开启注册 -->
        <el-form-item label="开启注册">
          <el-switch v-model="form.openSignup"></el-switch>
        </el-form-item>
        <!-- 开启网站 -->
        <el-form-item label="开启网站">
          <el-switch v-model="form.openSite"></el-switch>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
            :disabled="getPerms('sysSettings:setting:edit')"
          >保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <showPhoto ref="previewsfz" :photo="dialogImageUrl"></showPhoto>
  </div>
</template>

<script>
import showPhoto from "src/components/common/PreviewPicture";
import adminApi from "@/api/admin";
import config from "@/config";

export default {
  name: "email",
  components: {
    showPhoto
  },
  data() {
    return {
      urlAction: config.baseUrl + "/account/upload",
      form: {
        zendesk: {
          domain: "",
          secretKey: ""
        },
        loginVerify:true,
        inviteCode:true,
        contacts:[],
        domains: []
      },
      dialogImageUrl: null,
      iconList: [
        { text: "网站LOGO", index: "logo" },
        { text: "favicon图标", index: "favicon" },
        { text: "AppLogo", index: "appLogo" }
      ],
      contacts: [
        {
          type: "image",
          content: "",
          icon: "",
          name: "qq",
          label: "官方QQ"
        },
        {
          type: "image",
          content: "",
          icon: "",
          name: "weixin",
          label: "官方微信"
        },
        {
          type: "text",
          content: "",
          icon: "",
          name: "weibo",
          label: "官方微博"
        },
        {
          type: "image",
          content: "",
          icon: "",
          name: "qqgroup",
          label: "官方QQ群"
        },
        {
          type: "text",
          content: "",
          icon: "",
          name: "email",
          label: "官方邮箱"
        },
        {
          type: "text",
          content: "",
          icon: "",
          name: "telegram",
          label: "官方电报群"
        },
        {
          type: "text",
          content: "",
          icon: "",
          name: "facebook",
          label: "官方脸书"
        },
        {
          type: "text",
          content: "",
          icon: "",
          name: "twitter",
          label: "官方推特"
        }
      ]
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //   当切换或者关闭当前标签的时候清除数据
      contactsChange(val){
        //  this.$set(this.form,'contacts',val)
        //   console.log(val)
        // let data= [];
        // for(let item of val){
        //     data.push(item.name);
        // }
        // for(let item of this.contacts){
        //     if(data.indexOf(item.name) ==-1){
        //     for(let key in this.form.contacts){
        //           console.log(this.form.contacts[key].name)
        //         // if(this.form.contacts[key].name==item.name){
                  
        //         //     this.$set(this.form['contacts'][key],'content','')
        //         // }
        //     }
              
        //     }
        // }
      },    
    // 删除域名
    delLine(item) {
      let inx = this.form.domains.indexOf(item);
      this.form.domains.splice(inx, 1);
    },
    // 添加域名
    addDomain() {
      this.form.domains.push("");
    },
    // 预览图片
    showPhoto(url) {
      if (!url) return;
      this.dialogImageUrl = url;
      this.$refs.previewsfz.show();
    },
    // 获取数据
    async getData() {
      try {
        let result = await adminApi.siteInfo();
        if (!result.data.zendesk) {
          result.data.zendesk = {};
        }
        this.form = result.data;
        if (!this.form.domains) {
          this.$set(this.form, "domains", []);
        }
        if (!this.form.contacts) {
          this.$set(this.form, "contacts", []);
        }
      } catch (e) {}
    },
    async onSubmit() {
      let domainsArray = [];
      let domain = this.form.domains;
      for (let i in domain) {
        domainsArray.push(domain[i]);
      }
      let data = {
        title: this.form.title,
        coin: this.form.coin,
        domains: domainsArray,
        openSignup: this.form.openSignup,
        logo: this.form.logo,
        contacts:this.form.contacts,
        loginVerify:this.form.loginVerify,
        inviteCode:this.form.inviteCode,
        // email: this.form.email,
        // qq: this.form.qq,
        // telegram: this.form.telegram,
        // twitter: this.form.twitter,
        // facebook: this.form.facebook,
        favicon: this.form.favicon,
        appLogo: this.form.appLogo,
        // zendesk: {
        //   domain: this.form.zendesk.domain,
        //   secretKey: this.form.zendesk.secretKey
        // },
        openSite: this.form.openSite
      };
      try {
        let result = await adminApi.changeSiteInfo(data);
        this.getData();
        this.$message.success("保存成功");
      } catch (e) {}
    },
    handleAvatarSuccess(obj, res) {
      console.log(obj,res);
      
      if( obj.index &&  obj.type=='img'){
        obj.index['content'] = res.data;
      }else{
        this.$set(this.form, obj.index, res.data);
        // this.$set(obj.index, "content", res.data);
      }
      
      // this.$set(this.form, 'imageUrl', res.data);
      
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
