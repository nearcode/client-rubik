<template>
  <div>
    <v-head></v-head>
    <!-- <transition name="move" mode="out-in"> -->
      <keep-alive :include="tagsList" :exclude="excludes">
          <router-view></router-view>
      </keep-alive>
    <!-- </transition> -->
    <v-footer></v-footer>
  </div>
</template>

<script>
  // 局部注册组件
  import vHead from "./Header";
  import vFooter from "./Footer";

  export default {
    name: 'App',
    data(){
      return{
        tagsList:['news'],
        excludes:[]
      }
    },
    components:{
      vHead, vFooter
    },
      mounted(){
          this.$store.state.isLogin();
      },
  }
</script>

