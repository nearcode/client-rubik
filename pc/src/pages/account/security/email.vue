<template>
    <div>
        <el-form :model="ruleForm" :rules="rule" status-icon ref="ruleForm" label-width="0px"
                 @keyup.enter.native="submitForm('ruleForm')" class="ms-content login-container">
            <!--邮箱-->
            <el-form-item prop="email">
                <el-input type="text" tabindex="1" placeholder="邮箱" prefix-icon="icon-email" v-model="ruleForm.email"></el-input>
            </el-form-item>
            <!--验证码-->
            <el-form-item prop="code">
                <el-input v-model="ruleForm.code" tabindex="2"
                          :placeholder="'请输入邮箱验证码'">
                    <el-button slot="append" v-if="!codeTime" @click="getCode">获取验证码</el-button>
                    <el-button slot="append" v-else>{{codeTime}}秒后可重发</el-button>
                </el-input>
            </el-form-item>
            <!--确认按钮-->
            <el-form-item>
                <el-button type="primary" class="btn-block" @click="submitForm('ruleForm')" :disabled="!ruleForm.email" :loading="ruleForm.loading">
                    {{(email?'更换':'绑定')+'邮箱'}}
                </el-button>
            </el-form-item>
        </el-form>
        <!--验证弹框组件-->
        <verify ref="verifyDialog" v-on:code="setCode"></verify>
    </div>
</template>

<script>
    import baseApi from "@/api/base"
    import {mapState} from 'vuex'

    export default {
        name: "email",
        data(){
            // 表单正则
            const email = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
            let validatePass = (rule, value, callback) => {
                if (email.test(value)) {
                    this.isMobile = false;
                    callback();
                } else {
                    this.isMobile = false;
                    callback(new Error("请输入正确的邮箱"));
                }
            };
            return{
                ruleForm:{

                },
                codeTime:null,
                rule:{
                    email: [
                        {required: true, message: '请输入邮箱', trigger: ['change', 'blur']},
                        {validator: validatePass}
                    ],
                    code: [
                        {required: true, message: '请输入验证码', trigger: ['change', 'blur']},
                    ],
                },
                authCode:''
            }
        },
        computed: {
            ...mapState(['email']),
        },
        mounted(){

        },
        methods:{
            // 把验证码赋值过来
            setCode(code) {
                this.authCode = code;
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
                let account=this.ruleForm.email;
                if(!account) return;
                try {
                    let result = await baseApi.getBindEmailOrMobileCode(account);
                    this.$notify.success(this.$t('CODE_HAS_SEND'));
                    this.endTime();
                } catch (e) {}
            },
            submitForm(formName) {
                this.$refs[formName].validate(async (valid) => { //验证通过就执行登录
                    if (valid) {
                        this.setSubmit();
                    } else {
                        return false;
                    }
                });
            },
            async setSubmit(){
                try {
                    let data={
                        email:this.ruleForm.email,
                        code:this.ruleForm.code,
                        authCode:this.authCode
                    };
                    let result =await baseApi.accSetEamil(data);
                    this.$store.commit("getInfo");
                    this.$notify.success(this.$t('操作成功'));

                }catch (e) {
                    this.authCode='';
                    let layer = this.$refs.verifyDialog;
                    layer.init(this);
                    if (e && e.verify) {
                        layer.show({
                            authType: e.verify,
                            data:'ruleForm',
                            callback: this.submitForm
                        });
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>