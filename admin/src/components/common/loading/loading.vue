<template>
    <transition name="move" mode="out-in">
        <div class="page page-connecting">
          
       <div id="ajaxloader3">
        <div class="outer"></div>
        <div class="inner"></div>
       </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "loading",

        mounted() {
          
            this.$store.commit("getInfo", (res) => {
                // this.$store.commit('getRoleMenu',res.roleId)
                let url=this.$route.query.redirect;

                 if (url.indexOf("/loading") != -1) {
                    this.$router.push('/');
                } else {
                    this.$router.push(url);
                }
               
               

            });

            // this.$router.push('/');
            this.$store.commit('getAdminRoleList');
           
          
        },
    }

</script>

<style scoped>
    .page-connecting {
        height: 100%;
        width: 100%;
        position: fixed;
        background-color: #101929;
        color: #fff;
    }
 #ajaxloader3 {
   position: absolute;
  top: 50%;
  left: 50%;
  width: 7.33333em;
  height: 7.33333em;
  margin-left: -3.66667em;
  margin-top: -3.66667em;
}
#ajaxloader3 .outer {
  border: 5px solid rgba(0, 229, 183, 0.9);
  opacity: .9;
  border-right-color: transparent;
  border-left-color: transparent;
  width: 50px;
  height: 50px;
  margin: 0 auto;
  border-radius: 50%;
  -webkit-box-shadow: 0 0 35px rgba(0, 76, 61, 0.9);
  -moz-box-shadow: 0 0 35px rgba(0, 76, 61, 0.9);
  box-shadow: 0 0 35px rgba(0, 76, 61, 0.9);
  -webkit-animation: spin-pulse 1s linear infinite normal;
  -moz-animation: spin-pulse 1s linear infinite normal;
  -ms-animation: spin-pulse 1s linear infinite normal;
  animation: spin-pulse 1s linear infinite normal;
  -webkit-animation-delay: 0;
  -moz-animation-delay: 0;
  -o-animation-delay: 0;
  animation-delay: 0;
}
#ajaxloader3 .inner {
  border: 5px solid rgba(0, 229, 183, 0.9);
  opacity: .9;
  border-left-color: transparent;
  border-right-color: transparent;
  border-radius: 50%;
  -webkit-box-shadow: 0 0 15px rgba(0, 76, 61, 0.9);
  -moz-box-shadow: 0 0 15px rgba(0, 76, 61, 0.9);
  box-shadow: 0 0 15px rgba(0, 76, 61, 0.9);
  width: 30px;
  height: 30px;
  position: relative;
  top: -50px;
  margin: 0 auto;
  -webkit-animation: spin-right 1s linear infinite normal;
  -moz-animation: spin-right 1s linear infinite normal;
  -ms-animation: spin-right 1s linear infinite normal;
  animation: spin-right 1s linear infinite normal;
  -webkit-animation-delay: 0;
  -moz-animation-delay: 0;
  -o-animation-delay: 0;
  animation-delay: 0;
}
@keyframes spin-pulse {
  from {
    transform: rotate(160deg);
    opacity: 0;
    box-shadow: 0 0 1px rgba(0, 61, 76, 0.9);
  }
  50% {
    transform: rotate(145deg);
    opacity: 1;
  }
  to {
    transform: rotate(-320deg);
    opacity: 0;
  }
}
@-moz-keyframes spin-pulse {
  from {
    -moz-transform: rotate(160deg);
    opacity: 0;
    box-shadow: 0 0 1px rgba(0, 61, 76, 0.9);
  }
  50% {
    -moz-transform: rotate(145deg);
    opacity: 1;
  }
  to {
    -moz-transform: rotate(-320deg);
    opacity: 0;
  }
}
@-webkit-keyframes spin-pulse {
  from {
    -webkit-transform: rotate(160deg);
    opacity: 0;
    box-shadow: 0 0 1px rgba(0, 61, 76, 0.9);
  }
  50% {
    -webkit-transform: rotate(145deg);
    opacity: 1;
  }
  to {
    -webkit-transform: rotate(-320deg);
    opacity: 0;
  }
}
@keyframes spin-right {
  from {
    transform: rotate(0deg);
    opacity: 0.2;
  }
  50% {
    transform: rotate(180deg);
    opacity: 1.0;
  }
  to {
    transform: rotate(360deg);
    opacity: 0.2;
  }
}
@-moz-keyframes spin-right {
  from {
    -moz-transform: rotate(0deg);
    opacity: 0.2;
  }
  50% {
    -moz-transform: rotate(180deg);
    opacity: 1.0;
  }
  to {
    -moz-transform: rotate(360deg);
    opacity: 0.2;
  }
}
@-webkit-keyframes spin-right {
  from {
    -webkit-transform: rotate(0deg);
    opacity: 0.2;
  }
  50% {
    -webkit-transform: rotate(180deg);
    opacity: 1.0;
  }
  to {
    -webkit-transform: rotate(360deg);
    opacity: 0.2;
  }
}
</style>
