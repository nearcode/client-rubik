<template>
  <div class="loading_main">
    <div class="loading"></div>
    <div class="showNum">{{showNum}}</div>
  </div>
</template>

<script>
export default {
  name: "loading",
  props: ["showNum"]
};
</script>

<style scoped>
.loading_main {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1006;
  background-color: rgba(0, 0, 0, 0.1) !important;
}
.showNum {
  width: 150px;
  height: 150px;
  line-height: 150px;
  border-radius: 50%;
  box-sizing: border-box;
  position: absolute;
  top: 40%;
  left: 50%;
  z-index: 1002;
  text-align: center;
  transform: translate(-50%, -50%);
  color: white;
  background: #ffbc06;
  font-size: 60px;
}
.loading {
  width: 160px;
  height: 160px;
  z-index: 1006;
  border-radius: 150px;
  border: 15px solid #fff;
  border-top-color: rgba(0, 0, 0, 0.3);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: absolute;
  top: 40%;
  left: 50%;
  margin-top: -80px;
  margin-left: -80px;
  animation: loading-data-v-f3b0ea90 1.2s linear infinite;
  -webkit-animation: loading-data-v-f3b0ea90 1.2s linear infinite;
}
@keyframes loading-data-v-f3b0ea90 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn);
  }
}
@-webkit-keyframes loading-data-v-f3b0ea90 {
  0% {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(1turn);
  }
}
</style>
