<template>
  <el-header :class="setHeader+' header'">
    <div class="container">
      <div>
        <section class="pull-left">
          <router-link to="/" class="pull-left" style="height:40px;padding: 10px 0;">
            <img
              :src="diceLogo"
              style="vertical-align: middle;display: inline-block;max-width:234px;height:100%;"
              alt
            />
            <i style="display: inline-block;vertical-align: middle;height: 100%"></i>
          </router-link>
        </section>
        <el-menu
          :default-active="onRoutes"
          ref="headerMenu"
          :active-text-color="onRoutes?'#ffbc06':''"
          class="el-menu-demo pull-left"
          mode="horizontal"
          @select="handleSelect"
          router
        >
          <template v-for="item in items">
            <!--如果有子元素显示子元素-->
            <template v-if="item.subs">
              <el-submenu :index="item.index" :key="item.index">
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
                      :index="threeItem.index"
                    >{{ threeItem.title }}</el-menu-item>
                  </el-submenu>
                  <el-menu-item
                    v-else
                    :index="subItem.index"
                    :key="subItem.index"
                  >{{ subItem.title }}</el-menu-item>
                </template>
              </el-submenu>
            </template>
            <!--列表-->
            <template v-else>
              <el-menu-item :index="item.index" :key="item.index">
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
          router
        >
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
        </el-menu>
      </div>
    </div>
  </el-header>
</template>

<script>
import { mapState } from "vuex";
// import {changeLanguage} from '@/common/language'
// import ThemePicker from "@/pages/common/themePicker"

export default {
  data() {
    return {
      activeIndexs: "1",
      selected: window.localStorage.getItem("lang") || "zh",
      diceLogo: "/static/assets/games/tx.png",
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

      items: [
        {
          icon: "",
          index: "/games",
          title: "首页"
        }
      ]
    };
  },
  components: {
    // ThemePicker,
  },
  computed: {
    ...mapState(["username", "uid", "themeColor"]),
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
    setHeader() {
      //   if (this.$route.name == "home") {
      //     return "header-home";
      //   } else {
      //     return "header-content";
      //   }
      return "header-home";
    }
  },
  mounted() {
    console.log(this.$route.name);
  },
  methods: {
    // 切换主题
    onThemeChange(themeColor) {
      this.$store.commit("setThemeColor", themeColor);
    },
    handleSelect(key, keyPath) {
      // console.log(key,keyPath)
    },
    handleSelect2(key, keyPath) {},
    // 切换语言
    selectlanguage(command) {
      this.selected = command;
      // this.$i18n.locale=this.selected;
      // changeLanguage(this.selected);
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

<style scoped>
.header-home .el-menu--horizontal > .el-menu-item {
  margin-left: 70px;
}
.el-menu.el-menu--horizontal {
  border: none !important;
}
/* 当菜单选中的时候去掉背景 */
.header .el-menu-item.is-active {
  background-color: transparent !important;
}
/* 首页头部样式 */
.header-home {
  background-color: rgba(0, 0, 0, 0.1) !important;
  /* margin-bottom: -60px !important; */
  position: relative;
  z-index: 100;
}
.header-home .el-menu {
  background-color: transparent !important;
}
.header-home .el-menu--horizontal > .el-menu-item {
  color: #fff;
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
  background-color: #fff;
  margin-bottom: 20px;
}
.header {
  /* height: 100px; */
  overflow: hidden;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
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
