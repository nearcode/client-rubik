<template>
  <div class="app">
    <div class="logo">
        <img :src="appLogo" alt="logo">
    </div>
    <h1 class="title">{{webTitle | noData}}</h1>
    <p class="content">快速、便捷、安全的交易平台</p>
    <div class="btn">
      <el-button
        class="btn-block"
        @click="goDownload('ios')"
        :disabled="!config.appIosDownloadUrl"
        icon="fa fa-fw fa-apple"
      >IOS企业版下载</el-button>
      <el-button
        class="btn-block"
        @click="goDownload('android')"
        :disabled="!config.appAndroidDownloadUrl"
        type="primary"
        icon="fa fa-fw fa-android"
      >Android版下载</el-button>
    </div>
  </div>
</template>

<script>
import config from "@/config";
import { mapState } from "vuex";

export default {
  name: "referrer",
  data() {
    return {
      config
    };
  },
  computed: {
    ...mapState(["webTitle", "appLogo"])
  },
  mounted() {},
  methods: {
    goDownload(type) {
      if (type === "ios") {
        window.location.href = config.appIosDownloadUrl;
      } else {
        window.location.href = config.appAndroidDownloadUrl;
      }
    }
  }
};
</script>

<style scoped lang="less">
.app {
  position: fixed;
  width: 100%;
  height: 100%;

  text-align: center;
  .logo {
    padding: 20px;
    margin: 100px auto 0;
    background:#0268fd linear-gradient(180deg, #02aff1, #0268fd);
    width: 90px;
    height: 90px;
    border-radius: 10px;
    img::after{
        background-color: transparent;
    }
  }
  .title {
    margin: 10px 0;
    font-weight: bold;
    font-size: 27px;
  }
  .content {
    margin: 10px 0;
    // text-align: justify;
  }
  .btn {
    margin-top: 80px;
    button {
      margin: 10px auto;
      font-size: 16px;
      max-width: 300px;
      height: 45px;
    }
  }
}
</style>