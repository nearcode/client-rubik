<template>
  <div class="signup">
    <el-form
      :model="ruleForm"
      :rules="rules"
      status-icon
      ref="ruleForm"
      @keyup.enter.native="submitForm('ruleForm')"
      label-position="left"
      label-width="0px"
      class="demo-ruleForm login-container"
    >
      <!--LOGO-->
      <div class="signup_title clearfix">
        <router-link to="/" class="signup_logo">
          <img :src="logo" alt="logo" />
        </router-link>
        <i class="line"></i>
        <h1 style="line-height: 40px;display: inline-block">注册</h1>
      </div>
      <!--用户名-->
      <el-form-item prop="username">
        <el-input
          type="text"
          v-model="ruleForm.username"
          tabindex="1"
          auto-complete="off"
          prefix-icon="icon-user"
          placeholder="请设置用户名，3-20位字符"
        ></el-input>
      </el-form-item>
      <!--账户-->
      <el-form-item prop="account">
        <el-input
          v-model="ruleForm.account"
          tabindex="2"
          prefix-icon="icon-email"
          placeholder="请输入手机号或邮箱"
        >
          <el-select
            v-if="isMobile"
            slot="prepend"
            filterable
            v-model="ruleForm.select"
            @change="areaCode(ruleForm.select)"
            placeholder="选择区号"
          >
            <el-option
              v-for="item in country"
              :value="item.value"
              :label="'['+item.name+'] / ' + item.value "
              :key="item"
            ></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <!--密码-->
      <el-form-item prop="password">
        <el-input
          type="password"
          prefix-icon="icon-lock"
          tabindex="3"
          v-model="ruleForm.password"
          auto-complete="off"
          placeholder="请设置密码，8-20位字符，支持字母、数字或组合"
        ></el-input>
      </el-form-item>
      <!--推荐人-->
      <el-form-item prop="referrerId">
        <el-input
          type="text"
          v-model="ruleForm.referrerId"
          tabindex="4"
          auto-complete="off"
          prefix-icon="icon-group"
          placeholder="推荐人ID"
        ></el-input>
      </el-form-item>
      <!--图形验证码-->
      <el-form-item prop="captcha">
        <el-col :span="15">
          <el-input v-model="ruleForm.captcha" clearable tabindex="4" :placeholder="'验证码'"></el-input>
        </el-col>

        <el-col class="line" :span="1">&nbsp;</el-col>
        <el-col :span="8" class="captcha">
          <img
            style="width: 100%;cursor: pointer;height:32px;"
            title="看不清?换一张"
            :src="ruleForm.src"
            @click="refreshCaptcha"
          />
        </el-col>
      </el-form-item>
      <!--验证码-->
      <el-form-item prop="code" v-if="authType">
        <el-input
          v-model="ruleForm.code"
          tabindex="5"
          prefix-icon="el-icon-mobile-phone"
          :placeholder="'请输入验证码'"
        >
          <el-button
            slot="append"
            v-if="!codeTime"
            :disabled="!ruleForm.account"
            @click="getCode"
          >获取验证码</el-button>
          <el-button slot="append" v-else>{{codeTime}}秒后可重发</el-button>
        </el-input>
      </el-form-item>
      <!--服务条例-->
      <div class="remember">
        <el-checkbox checked>我已阅读并同意服务条款</el-checkbox>
        <span class="pull-right">
          已有账户？
          <router-link to="/login">登录</router-link>
        </span>
      </div>
      <!--注册按钮-->
      <el-form-item>
        <el-button
          type="primary"
          class="btn-block"
          @click="submitForm('ruleForm')"
          :loading="ruleForm.loading"
        >注册</el-button>
      </el-form-item>
    </el-form>
    <!-- 腾讯验证码 -->
    <!-- <tencent ref="valiDialog"></tencent> -->
  </div>
</template>

<script>
import baseApi from "@/api/base";
import { countrys } from "@/common/country";
import { mapState } from "vuex";
// import tencent from '@/common/validate/tencent';

export default {
  name: "Signup",
  data() {
    // 表单正则
    const email = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
    const mobile =  /^1[3456789]\d{9}$/;

    let validatePass = (rule, value, callback) => {
      if (email.test(value)) {
        this.isMobile = false;
        callback();
      } else if (mobile.test(value)) {
        this.isMobile = true;
        callback();
      } else {
        this.isMobile = false;
        callback(new Error("请输入正确的手机号或邮箱"));
      }
    };

    // 推荐人是否必填
    let inviteCode = (rule, value, callback) => {
      if (this.inviteCode) {
        if (!value) {
          return callback(new Error("推荐人不能为空"));
        }else{
          callback();
        }
      } else {
        callback();
      }
    };

    let timer = null;
    // 验证图形验证码是否正确
    let validCaptcha = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("验证码不能为空"));
      }
      clearTimeout(timer);

      timer = setTimeout(async () => {
        try {
          let data = {
            type: "captcha",
            id: this.ruleForm.captchaId,
            value: this.ruleForm.captcha
          };

          let result = await baseApi.auTypeVerify(data);
          if (!result.data) {
            callback(new Error("验证码输入错误"));
          } else {
            callback();
          }
        } catch (e) {}
        // console.error(1)
      }, 1000);
    };

    return {
      logining: false,
      countriesCodes: [],
      isMobile: false,
      ruleForm: {
        loading: false,
        select: "+86" //默认区号
      },
      tokens: null,
      codeTime: "",
      authType: false,
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: ["change", "blur"]
          },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        account: [
          {
            required: true,
            message: "请输入手机号或邮箱",
            trigger: ["change", "blur"]
          },
          { validator: validatePass }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["change", "blur"]
          },
          { min: 8, max: 20, message: "长度在 8 到 20 个字符" }
        ],
        code: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
        captcha: [{ validator: validCaptcha, trigger: ["change"] }],
        referrerId: [{ validator: inviteCode, trigger: ["blur"] }]
      }
    };
  },
  components: {
    // tencent,
  },
  computed: {
    ...mapState(["logo","inviteCode"])
  },
  mounted() {
    this.$set(this.ruleForm, "referrerId", sessionStorage.referrer || "");
    this.refreshCaptcha();
    this.country = countrys;
  },
  methods: {
    //获取图形验证码
    async refreshCaptcha() {
      try {
        let data = {
          type: "captcha",
          captchaType: "digit",
          height: 50,
          width: 116
        };

        let result = await baseApi.getcaptcha(data);

        this.$set(this.ruleForm, "src", result.data);
        this.$set(this.ruleForm, "captchaId", result.captchaId);
      } catch (e) {}
    },
    //提取区号
    areaCode(item) {
      const p = /\(([^()]+)\)/g;
      for (let i = 0; i < countrys.length; i++) {
        let countryItem = countrys[i];
        if (item === countryItem["value"]) {
          this.ruleForm.select = p.exec(countryItem["value"])[1];
        }
      }
    },
    // 验证码定时器
    endTime() {
      this.codeTime = 59;
      this.timers = setInterval(() => {
        if (this.codeTime > 0 && this.codeTime < 60) {
          this.codeTime--;
        } else {
          clearInterval(this.timers);
        }
      }, 1000);
    },
    //获取验证码
    async getCode() {
      this.endTime();
      let account = this.isMobile
        ? this.ruleForm.select + this.ruleForm.account
        : this.ruleForm.account;

      // let layer = this.$refs.valiDialog;//获取腾讯滑块dom节点
      // layer.vaptch(async (tokens) => {
      // console.log(tokens)
      // this.disabled = false;
      // this.tokens = tokens;
      // if(tokens && tokens.ret==0) { //0通过验证 2用户主动关闭
      let data = {
        account,
        // tokens,
        auType: "captcha",
        captchaId: this.ruleForm.captchaId,
        captcha: this.ruleForm.captcha
      };

      try {
        let result = await baseApi.signupCode(data);

        this.$notify.success(this.$t("CODE_HAS_SEND"));
      } catch (e) {}
      // }
      // });
    },
    //验证通过就执行
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.signup();
        } else {
          return false;
        }
      });
    },
    // 注册
    async signup() {
      this.ruleForm.loading = true;
      let username = this.ruleForm.username;
      let account = this.isMobile
        ? this.ruleForm.select + this.ruleForm.account
        : this.ruleForm.account;
      let code = this.ruleForm.code;
      let password = this.ruleForm.password;
      let referrerId = this.ruleForm.referrerId;
      let token = this.tokens;

      let data = {
        username,
        account,
        password,
        referrerId,
        code,
        token,
        auType: "captcha",
        captchaId: this.ruleForm.captchaId,
        captcha: this.ruleForm.captcha
      };
      try {
        let result = await baseApi.signup(data);

        this.ruleForm.loading = false;
        localStorage.token = result.token;
        localStorage.tokenExp = new Date().getTime();
        this.$store.commit("getInfo", () => {
          this.$router.push("/");
        });
      } catch (e) {
        if (e && e.verify) {
          this.authType = true;
        }
        this.ruleForm.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/*body,html,.At_the_bottom{*/
/*background: rgb(7, 15, 21);*/
/*background-image: linear-gradient(rgb(17, 23, 37), rgb(8, 30, 58));*/
/*}*/
.signup {
  min-height: 100vh;
  overflow: hidden;
}

.signup_title {
  padding: 0 0 30px 0;
}

.signup_title .signup_logo {
  height: 40px;
  display: inline-block;
  vertical-align: middle;
}

.signup_title .signup_logo img {
  height: 40px;
  overflow: hidden;
  display: inline-block;
}

.signup_title .line {
  /* background-color: #e6eaf0; */
  margin: 0 16px;
  display: inline-block;
  vertical-align: middle;
  width: 1px;
  height: 1.4em;
}

.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  /* box-shadow: 0 0 25px #cac6c6; */
}

/*.title {*/
/*margin: 0px auto 40px auto;*/
/*text-align: center;*/
/*color: #505458;*/
/*}*/
.remember {
  margin: 0px 0px 20px 0px;
}
</style>
