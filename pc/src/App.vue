<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <!--<app-header></app-header>-->
    <!--<router-view/>-->
    <!--<app-footer></app-footer>-->
    <router-view></router-view>
  </div>
</template>

<script>
import "babel-polyfill";
// 局部注册组件
import vLoading from "./pages/loading/loading";
import { mapState } from "vuex";
import { logMessage } from "./common/tradingview/datafeeds/udf/src/helpers";
const fs = require('fs');
export default {
  name: "App",
  components: {
    vLoading
  },
  computed: {
    ...mapState(["theme"])
  },
  created() {},
  mounted() {
    let theme = localStorage.getItem('theme') || this.theme;
    this.$store.commit("setThemeColor", theme);
    this.$store.state.favicon = localStorage.getItem("favicon") || "";
    this.$store.state.lastUrl = this.$route.path;
    this.$router.push({
      path: "/loading/",
      query: {
        redirect: location.pathname
      }
    });
  },
  methods: {
    
  }
};
</script>

<style lang="scss">
  @import "../static/css/base.scss"
</style>

<style lang="less">
// @import "../static/css/public.less";
@import "../static/icomoon/style.css";

#nprogress .bar {
  background: #409eff !important; //自定义颜色
}
#nprogress .spinner-icon {
  border-left-color: #409eff;
  border-top-color: #409eff;
}
.el-main {
  padding: 0 !important;
}

/*设置分页*/
.pagination {
  margin: 20px 0;
  text-align: center;
}
.plugins-tips {
  padding: 20px 0;
  margin-bottom: 20px;
}

/*设置收藏图标颜色*/
// .icon-star_empty{
//   color: #b4c4d3;
// }
.icon-star {
  color: #ff7f00;
}

.el-button--mini {
  padding: 5px 10px !important;
}

@media (max-width: 766px) {
  .el-dialog {
    width: auto !important;
    margin: 10px;
  }

  .content-collapse {
    left: 0 !important;
  }
}

a {
  color: #409eff;
}

.el-select .el-input {
  min-width: 100px;
}

.clearfix {
  *zoom: 1;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
  line-height: 0;
}

.clearfix:after {
  clear: both;
}

.pull-right {
  float: right !important;
}

.pull-left {
  float: left !important;
}

.btn-block {
  display: block;
  width: 100%;
}

.el-header {
  padding: 0 !important;
}

.el-main {
  padding: 0;
}

body {
  padding: 0 !important;
  margin: 0 !important;
}

.el-menu--horizontal > .el-menu-item {
  font-weight: bold;
  color: #666;
}

.el-card__header {
  /*box-shadow: 0 3px 6px rgba(0, 0, 0, .05) !important;*/
  font-weight: 700 !important;
}
</style>
