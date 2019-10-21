<template>
    <div class="login-wrap">
        <div class="login-bg"></div>
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px"
                     @keyup.enter.native="submitForm('ruleForm')" class="ms-content">
                <!--账号-->
                <el-form-item prop="account">
                    <el-input v-model="ruleForm.account" tabindex="1" placeholder="请输入手机号或邮箱">
                        <el-button v-if="!isMobile" title="账户" slot="prepend" icon="el-icon-lx-people"></el-button>
                        <el-select v-else slot="prepend" v-model="ruleForm.select" @change="areaCode(ruleForm.select)"
                                   placeholder="选择区号">
                            <el-option v-for="item in country" :value="item.value" :key="item.value"
                                       :label="'['+item.name+'] / ' + item.value ">
                            </el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="password">
                    <el-input type="password" tabindex="2" placeholder="密码" v-model="ruleForm.password">
                        <el-button slot="prepend" title="密码" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <!--验证码-->
                <el-form-item v-if="authType" prop="code">
                    <el-input v-model="ruleForm.gauth" tabindex="3"
                              :placeholder="'请输入'+(authType.mobile?'手机':authType.otp?'谷歌':'邮箱')+'验证码'">
                        <el-button slot="append" v-if="!codeTime && !authType.otp" @click="getCode">获取验证码</el-button>
                        <el-button slot="append" v-else>{{codeTime}}秒后可重发</el-button>
                    </el-input>
                </el-form-item>
                <!--登录按钮-->
                <el-form-item class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')" :loading="ruleForm.loading">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {countrys} from '@/common/js/country';
    import adminApi from "@/api/admin"

    export default {
        data() {
            // 表单正则
            const email = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
            const mobile = /^(\+?0?86\-?)?1[345789]\d{9}$/;
            let dats = []
            let validatePass = (rule, value, callback) => {

                for (let k in this.countriesCodes) {
                    dats[k] = {
                        code: this.countriesCodes[k][0],
                        regular: '/' + this.countriesCodes[k][1] + '/'
                    }

                }

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
            return {
                country: [],
                countriesCodes: [],
                isMobile: false,
                ruleForm: {
                    account: '',
                    password: '',
                    gauth: '',
                    loading: false,
                    select: '+86',//默认区号
                },
                codeTime: '',
                authType: '',//判断验证类型
                rules: {
                    account: [
                        {required: true, message: '请输入手机号或邮箱', trigger: ['change', 'blur']},
                        {validator: validatePass}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: ['change', 'blur']},
                        {min: 8, max: 20, message: '长度在 8 到 20 个字符'}
                    ],
                    gauth: [
                        {required: true, message: '验证码不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {

            this.country = countrys;
        },
        methods: {
            //提取区号
            areaCode(item) {
                const p = /\(([^()]+)\)/g;
                for (let i = 0; i < countrys.length; i++) {
                    let countryItem = countrys[i];
                    if (item === countryItem['value']) {
                        this.ruleForm.select = p.exec(countryItem['value'])[1]
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
                let account = this.isMobile ? this.ruleForm.select + this.ruleForm.account : this.ruleForm.account;
                let password = this.ruleForm.password;
                try {
                    let result = await adminApi.getLoginCode(account,password);
                    this.$notify.success(this.$t('CODE_HAS_SEND'));
                    this.endTime();
                } catch (e) {
                }
            },
            //验证通过就执行
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.login()
                    } else {
                        return false;
                    }
                });
            },
            // 登录
            async login() {
                this.ruleForm.loading = true;

                let account = this.isMobile ? this.ruleForm.select + this.ruleForm.account : this.ruleForm.account;
                let code = this.ruleForm.gauth;
                let password = this.ruleForm.password;

                try {
                    let result = await adminApi.login(account, code, password);
                    this.ruleForm.loading = false;
                    localStorage.token = result.token;
                    localStorage.tokenExp = new Date().getTime();
                    this.$store.commit("getInfo",()=>{
                        this.$router.push('/');
                    });

                    this.$nextTick(() => {
                        this.$message({
                            showClose: true,
                            iconClass: 'el-icon-bell el-message__icon',
                            message: '欢迎使用,' + this.$store.state.username
                        });
                    });
                } catch (e) {
                    this.ruleForm.loading = false;
                    if (e && e.authType) {
                        localStorage.token = e.token;
                        this.authType = e.authType;
                    }
                }
            },

        }
    }
</script>

<style scoped>
    .login-wrap {
        /*position: relative;*/
    }

    .login-bg {
        position: fixed;
        width: 100%;
        height: 100%;
        background-image: url(../../assets/login-bg.jpg);
        top: 0;
        left: 0;
        bottom: 0;
        background-size: cover;
        -webkit-background-size: cover;
        -o-background-size: cover;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #73879C;
        border-bottom: 1px solid #f7f7f7;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }

    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }
</style>
