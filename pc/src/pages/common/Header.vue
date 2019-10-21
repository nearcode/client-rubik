<template>
  <el-header :class="setHeader+' header'">
    <div class="container-fluid">
      <div>
        <section>
          <router-link to="/" class="pull-left" style="height:40px;padding: 10px 0;">
            <img :src="logo" style="vertical-align: middle;display: inline-block;height: 100%" alt />
            <i style="display: inline-block;vertical-align: middle;height: 100%"></i>
          </router-link>
        </section>
        <el-menu
          :default-active="onRoutes"
          ref="headerMenu"
          :active-text-color="activeColor"
          class="el-menu-demo pull-left"
          mode="horizontal"
          @select="handleSelect"
          router
        >
          <template v-for="item in items">
            <!--如果有子元素显示子元素-->
            <template v-if="item.subs">
              <el-submenu v-if="item.show" :index="item.index" :key="item.index">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span slot="title">{{ item.title }}</span>
                </template>
                <template v-for="subItem in item.subs">
                  <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                    <template slot="title">{{ subItem.title }}</template>
                    <el-menu-item
                      v-for="(threeItem,i) in subItem.subs"
                      :key="i"
                      :data-hot="item.isHot"
                      :index="threeItem.index"
                    >{{ threeItem.title }}</el-menu-item>
                  </el-submenu>
                  <el-menu-item
                    v-else
                    :index="subItem.index"
                    :data-hot="item.isHot"
                    :key="subItem.index"
                  >{{ subItem.title }}</el-menu-item>
                </template>
              </el-submenu>
            </template>
            <!--列表-->
            <template v-else>
              <el-menu-item v-if="item.show" :data-hot="item.isHot" :index="item.index" :key="item.index">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.title }}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>

        <el-menu
          :default-active="activeIndexs"
          class="el-menu-demo pull-right nav_right"
          mode="horizontal"
          @select="handleSelect2"
        >
          <!-- active-color="#13ce66"
          inactive-color="#ff4949"-->
          <el-menu-item class="nav_login">
            <!-- <el-switch v-model="theme" @change="onThemeChange" active-value="white"
            inactive-value="black" active-text="白" inactive-text="黑"></el-switch>-->
            <el-tooltip :content="getTheme.content" placement="bottom">
              <el-button
                type="text"
                style="font-size:25px;vertical-align: middle;"
                @click="onThemeChange(theme)"
                :icon="getTheme.icon"
              ></el-button>
            </el-tooltip>
          </el-menu-item>

          <!--登录/注册-->
          <el-menu-item index="login" class="nav_login" v-if="!isLogin()">
            <el-button type="text" @click="handleCommand('/login')">登录</el-button>
          </el-menu-item>
          <el-menu-item index="signup" class="nav_signup" v-if="!isLogin()">
            <el-button type="primary" @click="handleCommand('/signup')" size="mini">注册</el-button>
          </el-menu-item>
          <!--用户中心菜单-->
          <template v-if="isLogin()">
            <!--下拉菜单-->
            <el-dropdown
              class="user-name el-menu-item"
              trigger="hover"
              :show-timeout="0"
              @command="handleCommand"
            >
              <span class="el-dropdown-link">
                {{username | noData}} ({{uid | noData}})
                <i class="el-icon-caret-bottom"></i>
              </span>

              <el-dropdown-menu slot="dropdown" style="white-space: nowrap">
                <el-dropdown-item
                  :command="v.index"
                  :key="k"
                  v-for="(v,k) in dropdownList"
                >{{v.title}}</el-dropdown-item>
                <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <!--语言切换-->
          <el-dropdown class="user-name el-menu-item" @command="selectlanguage" :show-timeout="0">
            <span class="el-dropdown-link">
              <img style="width: 30px;" :src="'/static/assets/language/'+selected+'.png'" alt />
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(v,k) in language" :command="v.index" :key="k">
                <img style="width: 30px;vertical-align: middle" :src="v.url" alt />
                {{v.title}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <template>
                        <theme-picker class="theme-picker" :default="themeColor" @onThemeChange="onThemeChange"></theme-picker>
          </template>-->
        </el-menu>
      </div>
    </div>
  </el-header>
</template>

<script>
import { mapState } from "vuex";
import _ from "lodash";
import config from "@/config";
import { changeLanguage } from "@/common/language";
// import ThemePicker from "@/pages/common/themePicker";

export default {
  data() {
    return {
      activeIndexs: "1",
      selected: window.localStorage.getItem("lang") || "zh",
      language: [
        {
          title: "中文简体",
          index: "zh",
          url: "/static/assets/language/zh.png"
        },
        {
          title: "English",
          index: "en",
          url: "/static/assets/language/en.png"
        }
      ],
      dropdownList: [
        {
          title: "我的资金",
          index: "/money"
        },
        // {
        //     title: '谷歌认证',
        //     index: '/account/security?type=otp'
        // },
        {
          title: "实名认证",
          index: "/account/cdd"
        }
      ],
      items: [
        {
          icon: "",
          index: "/",
          title: "首页",
          show:true
        },
        {
          icon: "",
          index: "/exchange",
          title: "交易",
          show:true
        },
        {
          icon: "",
          index: "/OtcTrade",
          title: "法币交易",
          show:true
        },
        {
          icon: "",
          index: "/news",
          title: "公告",
          show:true
        },
        // {
        //   icon: "",
        //   isHot: true,
        //   index: "/games/dice",
        //   title: "游戏",
        //   show:false
        // }
        // {
        //   icon: '',
        //   index: '/1',
        //   title: '利息'
        // },
        // {
        //   icon: '',
        //   index: '/2',
        //   title: '幸运大转盘'
        // },
      ]
    };
  },
  components: {
    // ThemePicker
  },
  computed: {
    ...mapState(["username", "uid", "logo", "isLogin", "theme"]),
    onRoutes() {
      let path = this.$route.path.replace("", "");

      for (let i of this.items) {
        if (path == "/") {
          return path;
        } else if (i.index !== "/" && path.indexOf(i.index) != -1) {
          return i.index;
        }
      }
    },
    activeColor() {
      let color = "";
      if (this.onRoutes) {
        color = this.onRoutes.indexOf("/dice") != -1 ? "#ffbc06" : "#409eff";
      } else {
        color = "";
      }
      return color;
    },
    getTheme() {
      let result = {};
      if (this.theme == "white") {
        result = { icon: "icon-light", content: "白色主题" };
      } else if (this.theme == "black") {
        result = { icon: "icon-dark", content: "深色主题" };
      }
      return result;
    },
    setHeader() {
      if (this.$route.name == "home") {
        return "header-home";
      } else if (this.$route.path.indexOf("dice") != -1) {
        return "games";
      } else {
        return "header-content";
      }
    },
    themeColor() {}
  },
  mounted() {
    this.$nextTick(() => {
      this.$store.commit("setThemeColor", this.theme);
    });
  },
  methods: {
    // 切换主题
    onThemeChange(state) {
      let theme = "";
      if (state == "black") {
        theme = "white";
      } else if (state == "white") {
        theme = "black";
      }
      this.$nextTick(() => {
        this.$store.commit("setThemeColor", theme);
      });
    },
    handleSelect(key, keyPath) {
      // console.log(key,keyPath)
    },
    handleSelect2(key, keyPath) {},
    // 切换语言
    selectlanguage(command) {
      this.selected = command;
      // this.$i18n.locale=this.selected;
      changeLanguage(this.selected);
    },

    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        window.localStorage.removeItem("token");
        // localStorage.removeItem('info');
        this.$router.push("/login");
      } else {
        this.$router.push(command);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-menu.el-menu--horizontal {
  border: none !important;
}
.header .el-menu-item {
  position: relative;
}
// 热门导航
.header .el-menu-item[data-hot="true"]::after {
  content: "";
  position: absolute;
  right: -10px;
  top: 15px;
  width: 25px;
  height: 14px;
  color: red;
  background: url("/static/assets/ico/hot.png") no-repeat center center;
  background-size: 100% 100%;
}

/* 当菜单选中的时候去掉背景 */
.header .el-menu-item.is-active {
  background-color: transparent !important;
}
/* 首页头部样式 */
.header-home {
  background-color: rgba(0, 0, 0, 0.1) !important;
  margin-bottom: -60px !important;
  position: relative;
  z-index: 100;
}
.header .el-menu {
  background-color: transparent !important;
}
.header-home .el-menu--horizontal > .el-menu-item {
  color: #fff;
}

/* 游戏头部样式 */
.games {
  background-image: linear-gradient(90deg, #20b2aa 0%, #506ab4 100%) !important;
  // 导航颜色
  .el-menu li {
    color: #fff;
    background-color: transparent;
  }
  // 右侧导航
  .el-menu--horizontal > .el-menu-item {
    color: #fff;
  }
  // 导航图标
  .el-menu-item i{
    color: #839fbe;
  }
}

.header-home .el-menu li {
  color: #fff;
  background-color: transparent;
}
/* 经过菜单 */
.header .el-menu li:hover,
.header .el-menu-item:hover {
  background-color: transparent !important;
  color: #409eff;
}
/* 其他头部颜色 */
.header-content {
  /* background-color: #fff; */
  margin-bottom: 20px;
}
.header {
  overflow: hidden;
  box-shadow: 0 11px 42px 0 rgba(9, 30, 55, 0.06);
}

.nav {
  float: right;
  height: 100%;
  line-height: 80px;
  background: transparent;
  padding: 0;
  margin: 0;
}

.nav_right .el-menu-item {
  padding: 0 10px;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 2px solid transparent;
}
</style>
