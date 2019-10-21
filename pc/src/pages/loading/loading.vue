<template>
  <transition name="move" mode="out-in">
    <div class="page">
      <svg viewBox="0 0 600 300">
        <!-- Symbol-->
        <symbol id="s-text">
          <text text-anchor="middle" x="50%" y="50%" dy=".35em">{{getDomintext}}</text>
        </symbol>
        <!-- Duplicate symbols-->
        <use class="text" xlink:href="#s-text" />
        <use class="text" xlink:href="#s-text" />
        <use class="text" xlink:href="#s-text" />
        <use class="text" xlink:href="#s-text" />
        <use class="text" xlink:href="#s-text" />
      </svg>
    </div>
  </transition>
</template>

<script>
import config from "@/config"

export default {
  name: "loading",
  computed: {
    getDomintext(){
      let text =  config.getMainHost();
      console.log(text)
      if(text){
        if (!config.mainSite) {
          text = text.split('.')[0];
        }
      }else{
        text = "loading"
      }
      return text
    }
  },
  mounted() {
    this.$store.commit("getInfo", res => {
      let url = this.$route.query.redirect;
      // console.error(url);
      if (url) {
        if (url.indexOf("/loading") != -1) {
          this.$router.push('/');
        } else {
          this.$router.push(url);
        }
      }
    });
    this.$store.commit("getMarkets");
  }
};
</script>

<style scoped>
.page {
  height: 100%;
  width: 100%;
  position: fixed;
  background-color: #101929;
  color: #fff;
  font: 5em/1 Open Sans, Impact !important;
  text-transform: uppercase;
}
/* Main styles */
@import url(https://fonts.googleapis.com/css?family=Open+Sans:800);
.text {
  fill: none;
  stroke-width: 3;
  stroke-linejoin: round;
  stroke-dasharray: 70 330;
  stroke-dashoffset: 0;
  -webkit-animation: stroke 6s infinite linear;
  animation: stroke 6s infinite linear;
}
.text:nth-child(5n + 1) {
  stroke: #f2385a;
  -webkit-animation-delay: -1.2s;
  animation-delay: -1.2s;
}
.text:nth-child(5n + 2) {
  stroke: #f5a503;
  -webkit-animation-delay: -2.4s;
  animation-delay: -2.4s;
}
.text:nth-child(5n + 3) {
  stroke: #e9f1df;
  -webkit-animation-delay: -3.6s;
  animation-delay: -3.6s;
}
.text:nth-child(5n + 4) {
  stroke: #56d9cd;
  -webkit-animation-delay: -4.8s;
  animation-delay: -4.8s;
}
.text:nth-child(5n + 5) {
  stroke: #3aa1bf;
  -webkit-animation-delay: -6s;
  animation-delay: -6s;
}

@-webkit-keyframes stroke {
  100% {
    stroke-dashoffset: -400;
  }
}
@keyframes stroke {
  100% {
    stroke-dashoffset: -400;
  }
}

svg {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
