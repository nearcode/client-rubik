<template>
  <div>
    <!-- <v-head></v-head> -->
    <transition name="move" mode="out-in">
      <keep-alive>
        <div class="page_games" style="padding:20px 0;">
          <router-view></router-view>
        </div>
      </keep-alive>
    </transition>
    <!-- <v-footer></v-footer> -->
  </div>
</template>

<script>
// 局部注册组件
import vHead from "./header";
import vFooter from "./footer";

export default {
  name: "App",
  data() {
    return {
      tagsList: ["home"],
      excludes: []
    };
  },
  components: {
    vHead,
    vFooter
  },
  mounted() {
  },
  methods: {}
};
</script>
<style lang="scss">
    @import "@static/css/theme/games/index.scss"
</style>


