<template>
  <div class="forgetpass">
    <el-form
      :model="ruleForm"
      :rules="rules"
      status-icon
      ref="ruleForm"
      label-width="0px"
      @keyup.enter.native="submitForm('ruleForm')"
      class="ms-content login-container"
    >
      <!--LOGO-->
      <div class="signup_title clearfix">
        <router-link to="/" class="signup_logo">
          <img :src="logo" alt="logo">
        </router-link>
        <i class="line"></i>
        <h1 style="line-height: 40px;display: inline-block">重置登录密码</h1>
      </div>
      <!--账号-->
      <el-form-item prop="account">
        <el-input
          v-model="ruleForm.account"
          @input="changeAcc()"
          tabindex="1"
          placeholder="请输入手机号或邮箱"
        >
          <el-button v-if="!isMobile" title="账户" slot="prepend" icon="icon-user"></el-button>
          <el-select
            v-else
            slot="prepend"
            filterable
            v-model="ruleForm.select"
            @change="areaCode(ruleForm.select)"
            placeholder="选择区号"
          >
            <el-option
              v-for="(item, index) in country"
              :value="item.value"
              :label="'['+item.name+'] / ' + item.value "
              :key="index"
            ></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <!--密码-->
      <el-form-item prop="password">
        <el-input
          type="password"
          tabindex="2"
          placeholder="新密码"
          autocomplete="off"
          v-model="ruleForm.password"
        >
          <el-button slot="prepend" title="新密码" icon="icon-lock"></el-button>
        </el-input>
      </el-form-item>
      <!--确认密码-->
      <el-form-item prop="checkPass">
        <el-input
          type="password"
          tabindex="3"
          placeholder="确认密码"
          autocomplete="off"
          v-model="ruleForm.checkPass"
        >
          <el-button slot="prepend" title="新密码" icon="icon-lock"></el-button>
        </el-input>
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
          >
        </el-col>
      </el-form-item>
      <!--验证码-->
      <el-form-item prop="code" v-if="authType">
        <el-input v-model="ruleForm.code" tabindex="3" :placeholder="'请输入验证码'">
          <el-button
            slot="append"
            v-if="!codeTime"
            :disabled="!ruleForm.account"
            @click="getCode"
          >获取验证码</el-button>
          <el-button slot="append" v-else>{{codeTime}}秒后可重发</el-button>
        </el-input>
      </el-form-item>
      <!--导航-->
      <div class="remember">
        <router-link to="/login">登录</router-link>
        <span class="pull-right">
          还没有账号？
          <router-link to="/signup">注册</router-link>
        </span>
      </div>
      <!--确认按钮-->
      <el-form-item>
        <el-button
          type="primary"
          class="btn-block"
          @click="submitForm('ruleForm')"
          :loading="ruleForm.loading"
        >重设密码</el-button>
      </el-form-item>
    </el-form>
    <!--腾讯滑块验证-->
    <!-- <tencent ref="valiDialog"></tencent> -->
  </div>
</template>

<script>
import baseApi from "@/api/base";
import { countrys } from "@/common/country";
import { mapState } from "vuex";
// import tencent from '@/common/validate/tencent';

export default {
  name: "login",
  data() {
    // 表单正则
    const email = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
    const mobile = /^1[3456789]\d{9}$/;

    let validateAcc = (rule, value, callback) => {
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

    // 验证密码
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      logining: false,
      countriesCodes: [],
      isMobile: false,
      ruleForm: {
        account: "",
        password: "",
        code: "",
        loading: false,
        select: "+86" //默认区号
      },
      codeTime: "",
      authType: "", //判断验证类型
      authCode: false,
      rules: {
        account: [
          {
            required: true,
            message: "请输入手机号或邮箱",
            trigger: ["change", "blur"]
          },
          { validator: validateAcc }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["change", "blur"]
          },
          { min: 8, max: 20, message: "长度在 8 到 20 个字符" },
          { validator: validatePass, trigger: ["change", "blur"] }
        ],
        checkPass: [{ validator: validatePass2, trigger: ["change", "blur"] }],
        code: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
        captcha: [{ validator: validCaptcha, trigger: ["change"] }]
      }
    };
  },
  components: {
    // tencent,
    // aliyun,
    // imgCode
  },
  computed: {
    ...mapState(["logo"])
  },
  mounted() {
    this.country = countrys;
    this.refreshCaptcha();
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
    // 当账号改变的时候清除token
    changeAcc() {
      localStorage.removeItem("token");
      this.authType = "";
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
      // let layer = this.$refs.valiDialog;//获取腾讯滑块dom节点
      // layer.vaptch(async (tokens) => {
      // if (tokens && tokens.ret == 0) { //0通过验证 2用户主动关闭
      let account = this.isMobile
        ? this.ruleForm.select + this.ruleForm.account
        : this.ruleForm.account;

      let data = {
        account,
        auType: "captcha",
        captchaId: this.ruleForm.captchaId,
        captcha: this.ruleForm.captcha
      };
       this.endTime();
      try {
        let result = await baseApi.forgetPassCode(data);
        this.$notify.success(this.$t("CODE_HAS_SEND"));
       
      } catch (e) {}
      // }
      // });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        //验证通过就执行登录
        if (valid) {
          this.forgetPass();
        } else {
          return false;
        }
      });
    },
    async forgetPass() {
      this.ruleForm.loading = true;

      let account = this.isMobile
        ? this.ruleForm.select + this.ruleForm.account
        : this.ruleForm.account;
      let code = this.ruleForm.code;
      let password = this.ruleForm.password;

      let data = {
        account,
        code,
        password,
        auType: "captcha",
        captchaId: this.ruleForm.captchaId,
        captcha: this.ruleForm.captcha
      };

      try {
        let result = await baseApi.resetPassword(data);
        this.ruleForm.loading = false;
        this.$notify.success(this.$t("密码重置成功"));
        this.$router.push("/login");
      } catch (e) {
        this.ruleForm.loading = false;
        if (e && e.verify) {
          localStorage.token = e.token;
          this.authType = e.verify;
        }
      }
    }
  }
};
</script>
<style scoped>
.forgetpass {
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
  background-color: #e6eaf0;
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
  max-width: 350px;
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

.signup_lang li {
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
  color: #aaa;
  font-size: 13px;
}

.signup_lang li:last-child {
  margin-right: 0px;
}

.signup_lang li img {
  width: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
}
</style>
