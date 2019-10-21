<template>
  <footer class="footer">
    <div id="line_status_tip" v-if="false">
      <el-alert title="网络连接失败,请检查您的网络" type="error" center show-icon></el-alert>
    </div>
    <!-- container-fluid -->
    <div class="container">
      <div class="footer_top">
        <div>
          <span class="pull-left Ticket" @click="goZendesk">提交工单</span>
          <p class="icon pull-left">
            <a
              :href="v.type=='text'?v.content:'javascript:;'"
              target="_blank"
              :title="v.name"
              v-for="(v,k) in setContacts"
              :key="k"
            >
              <el-tooltip :disabled="v.type=='text'" placement="top" effect="light">
                <div slot="content">
                  <img style="width: 100px;" :src="v.content" :alt="v.name">
                </div>
                <i class="iconfont" :class="'icon-'+v.name"></i>
              </el-tooltip>
            </a>

            <!-- <a  href="javascript:;">
                        <i class="iconfont icon-weibo"></i>
                    </a>
                      
                    <a  href="javascript:;">
                        <i class="fa fa-weixin"></i>
                    </a>
                     
                    <a  href="javascript:;">
                        <i class="fa fa-facebook-square"></i>
                    </a>
                      
                    <a  href="javascript:;">
                        <i class="fa fa-qq"></i>
                    </a>
                      
                    <a  href="javascript:;">
                        <i class="fa fa-envelope"></i>
            </a>-->
          </p>
          <!-- <ul class="links clearfix pull-left"> -->
          <!--推特-->
          <!-- <li class="ico_twitter"><a href="javascript:;"></a></li> -->
          <!--telegram-->
          <!-- <li class="ico_telegram"><a href="javascript:;"></a></li> -->
          <!--脸书-->
          <!-- <li class="ico_facebook"><a href="javascript:;"></a></li> -->
          <!--beechat-->
          <!-- <li class="ico_beechat"><a href="javascript:;"></a></li> -->
          <!--qq-->
          <!-- <li class="ico_qq">
                            <el-tooltip class="item" effect="light" content="" placement="bottom"><a
                                    href="javascript:;"></a>
                            </el-tooltip>
          </li>-->
          <!--email-->
          <!-- <li class="ico_email">
                            <el-tooltip class="item" effect="light" content="" placement="bottom">
                                <a href="javascript:;"></a>
                            </el-tooltip>
          </li>-->
          <!-- </ul> -->
        </div>

        <!--api-->
        <!--<router-link to="" class="pull-right Ticket">API</router-link>-->
        <div class="footer-right" v-if="false">
          <!-- app下载 -->
          <div class="footer-right-item" v-for="(v,k) in download" :key="k">
            <el-popover placement="top-end" :title="v.title" width="150" trigger="click">
              <div class="popover-content" v-for="(val,key) in v.sys" :key="key">
                <!-- 切换按钮 -->
                <span class="btn-group">
                  <el-button
                    size="small"
                    :type="info[v.index]==key?'primary':''"
                    @click="selectDownload(v.index,key)"
                  >{{val}} {{info[v.index]}} {{key}}</el-button>
                </span>
                <!-- 二维码 -->
                <el-image
                  class="img"
                  v-if="key == info[v.index]"
                  :src="urlAction+'?text='+val"
                  :title="v.index+'-'+info[v.index]"
                  alt="app"
                ></el-image>
              </div>
              <el-button type="text" slot="reference">{{v.title}}</el-button>
            </el-popover>
          </div>
        </div>
      </div>
      <div class="footer_bottom">
        <dl class="cooperation_list">
          <dt>合作伙伴</dt>
          <dd v-for="(v,k) in links" :key="k">
            <a :href="v.url" target="_blank">{{v.title}}</a>
          </dd>
        </dl>
        <div class="clearfix">
          <p class="copyRight pull-left">Copyright © 2019 {{webTitle}}</p>
          <el-dropdown class="pull-right copyRight">
            <span class="el-dropdown-link">
              中文简体
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" style="white-space: nowrap;">
              <el-dropdown-item>中文简体</el-dropdown-item>
              <el-dropdown-item>English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapState } from "vuex";
import config from "@/config";

export default {
  name: "Footer",
  data() {
    return {
      zendeskUrl: "/zendesk",
      urlAction: config.baseUrl + "/qrcode",
      info: {},
      download: [
        //     {
        //     url:'',
        //     index:'exchange',
        //     children:[{
        //             url:config.appIosDownloadUrl,
        //             index:'IOS'
        //     },{
        //             url:config.appAndroidDownloadUrl,
        //             index:'Android'
        //     }],
        //     title:'APP下载'
        // },{
        //     url:'',
        //     index:'bipay',
        //     children:[{
        //             url:config.walletDownloadUrl['ios'],
        //             index:'IOS',
        //     },{
        //             url:config.walletDownloadUrl['android'],
        //             index:'Android',
        //     }],
        //     title:'钱包下载'
        // }
      ]
    };
  },
  mounted() {
    // this.getAppList();
  },
  methods: {
    getAppList(type) {
      this.$store.commit("getAppList", res => {
        for (let item in res) {
          let data = {
            title: item,
            index: item,
            sys: {
              IOS: res[item].iosUrl,
              Android: res[item].androidUrl
            },
            children: [res[item]]
          };

          this.download.push(data);
          this.info[item] = "Android";
          console.log(this.download);
        }
      });
    },
    goZendesk() {
      // if(!this.email) return this.$message.error('请先绑定邮箱');
      this.$router.push("/account/tickets");
    },
    selectDownload(download, type) {
      this.$set(this.info, download, type);
      // console.log(download,type)
    }
  },
  computed: {
    ...mapState(["links", "webTitle", "email", "appVersion", "contacts"]),
    setContacts() {
      // mailto:
      let data = this.contacts || [];
      for (let item of data) {
        if (item.name == "email") {
          item["content"] = "mailto:" + item.content;
        }
      }
      return data;
    }
  }
};
</script>

<style lang="less" scoped>
.el-button + .el-button {
  margin: 0;
}
.popover-content {
  display: flex;
  justify-content: space-between;
  .btn-group {
    margin-right: 10px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  .img {
    width: 70px;
    height: 70px;
    flex: none;
    border: 1px solid #ddd;
  }
}
.icon {
  display: flex;
  justify-content: space-between;
  margin: 0 10px;
  // background-color: #ddd;
  a {
    width: 30px;
    height: 30px;
    margin: 0 5px;
    border-radius: 50%;
    display: inline-block;
    line-height: 30px;
    text-align: center;
    background-color: #242f42;
    color: #a8b7c8;
    text-decoration: none;

    vertical-align: middle;
    transition: all 0.3s;
    .iconfont {
      width: 100%;
      height: 100%;
      line-height: 30px;
      font-size: 18px;
    }
  }
}
.icon a:hover {
  background-color: #409eff;
  color: #fff;
}
#line_status_tip {
  position: fixed;
  bottom: 0;
  width: 100%;

  text-align: center;
  z-index: 99999;
}
.footer {
  min-height: 150px;
  background-color: #101929;
  color: #727b85;
  .footer_top {
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #05070b;
    .footer-right {
      display: flex;
      .footer-right-item:not(:last-child) {
        padding-right: 10px;
      }
    }
  }

  .footer_bottom {
    padding: 20px 0;
    border-top: 1px solid #1c2943;

    .cooperation_list {
      dt {
        display: inline-block;
        margin-right: 10px;
        font-weight: bold;
        vertical-align: middle;
      }

      dd {
        display: inline-block;
        vertical-align: middle;
        padding-right: 10px;

        a {
          color: #909399;
          transition: all 0.3s;
        }
      }
      dd:hover a {
        color: #c0c4cc;
      }
    }
  }
}

.Ticket {
  font-weight: bold;
  line-height: 30px;
  cursor: pointer;
  color: #727b85;
}

.copyRight {
  padding: 15px 0;
}

.footer .links {
  margin-left: 15px;
}

.footer .links li {
  height: 30px;
  line-height: 30px;
  width: 30px;
  float: left;
  margin-right: 10px;
  border-radius: 50%;
}

.footer .links li a {
  display: block;
  width: 100%;
}

.footer .links li a:before {
  display: block;
  width: 30px;
  height: 30px;
  top: 0;
  background-image: url(/static/assets/ico/ico.png);
  background-repeat: no-repeat;
  content: "";
}

.footer .links .ico_twitter a::before {
  background-position: 0 -34px;
}

.footer .links .ico_twitter a:hover::before {
  background-position: -32px -33px;
}

.footer .links .ico_telegram a::before {
  background-position: -1px -166px;
}

.footer .links .ico_telegram a:hover::before {
  background-position: -32px -166px;
}

.footer .links .ico_facebook a::before {
  background-position: 0 -67px;
}

.footer .links .ico_facebook a:hover::before {
  background-position: -32px -66px;
}

.footer .links .ico_beechat a::before {
  background-position: -1px -228px;
}

.footer .links .ico_beechat a:hover::before {
  background-position: -32px -229px;
}

.footer .links .ico_qq a::before {
  background-position: -1px -198px;
}

.footer .links .ico_qq a:hover::before {
  background-position: -32px -198px;
}

.footer .links .ico_email a::before {
  background-position: 0 -1px;
}

.footer .links .ico_email a:hover::before {
  background-position: -32px 0;
}

.footer .links li a {
  width: 100%;
  height: 100%;
}
</style>
