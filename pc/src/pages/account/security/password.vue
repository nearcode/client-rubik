<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-width="80px"
                 @keyup.enter.native="submitForm('ruleForm')" class="ms-content login-container">
            <!--密码-->
            <el-form-item prop="oldPassword" label="旧密码"  :error="errorMsg">
                <el-input type="password" tabindex="2" placeholder="旧密码" prefix-icon="icon-lock" autocomplete="off" v-model="ruleForm.oldPassword">

                </el-input>
            </el-form-item>

            <!--密码-->
            <el-form-item prop="password" label="新密码">
                <el-input type="password" tabindex="2" placeholder="新密码"  prefix-icon="icon-lock" autocomplete="off" v-model="ruleForm.password">

                </el-input>
            </el-form-item>
            <!--确认密码-->
            <el-form-item prop="checkPass" label="确认密码">
                <el-input type="password" tabindex="3" placeholder="确认密码"  prefix-icon="icon-lock" autocomplete="off" v-model="ruleForm.checkPass">

                </el-input>
            </el-form-item>
            <!--&lt;!&ndash;验证码&ndash;&gt;-->
            <!--<el-form-item prop="code">-->
                <!--<el-input v-model="ruleForm.code" tabindex="3"-->
                          <!--:placeholder="'请输入验证码'">-->
                    <!--<el-button slot="append" v-if="!codeTime " @click="getCode">获取验证码</el-button>-->
                    <!--<el-button slot="append" v-else>{{codeTime}}秒后可重发</el-button>-->
                <!--</el-input>-->
            <!--</el-form-item>-->
            <!--确认按钮-->
            <el-form-item>
                <el-button type="primary" class="btn-block" @click="submitForm('ruleForm')" :loading="ruleForm.loading">修改密码
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import baseApi from "@/api/base"
    import {countrys} from '@/common/country';

    export default {
        name: 'login',
        data() {
            // 验证密码
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    loading: false,
                },
                errorMsg:'',
                codeTime: '',
                rules: {
                    // oldPassword: [
                    //     {required: true, message: '请输入你的旧密码', trigger: ['blur']}
                    // ],
                    password: [
                        {required: true, message: '请输入新密码', trigger: ['change', 'blur']},
                        {min: 8, max: 20, message: '长度在 8 到 20 个字符'},
                        {validator: validatePass,trigger: ['change', 'blur']}
                    ],
                    checkPass:[{required: true, message: '请重复输入新密码', trigger: ['change', 'blur']},{validator: validatePass2,trigger: ['change', 'blur']}],
                    code: [
                        {required: true, message: '验证码不能为空', trigger: 'blur'}
                    ]
                }
            }
        },

        mounted() {

        },
        methods: {
            // // 验证码定时器
            // endTime() {
            //     this.codeTime = 59;
            //     this.timers = setInterval(() => {
            //         if (this.codeTime > 0 && this.codeTime < 60) {
            //             this.codeTime--;
            //         } else {
            //             clearInterval(this.timers);
            //         }
            //     }, 1000);
            // },
            // //获取验证码
            // async getCode() {
            //     let account = this.isMobile ? this.ruleForm.select + this.ruleForm.account : this.ruleForm.account;
            //     try {
            //         let result = await baseApi.resetPasswordCode(account);
            //         this.$notify.success(this.$t('CODE_HAS_SEND'));
            //         this.endTime();
            //     } catch (e) {
            //     }
            // },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => { //验证通过就执行登录
                    if (valid) {
                        this.forgetPass()
                    } else {
                        return false;
                    }
                });
            },
            async forgetPass() {
                this.ruleForm.loading = true;
                // let code = this.ruleForm.code;
                let oldPassword = this.ruleForm.oldPassword;
                let newPassword = this.ruleForm.password;
                try {
                    let result = await baseApi.changePassword(newPassword, oldPassword);
                    this.ruleForm.loading = false;
                    this.$notify.success(this.$t('密码修改成功'));
                } catch (e) {
                    this.ruleForm.loading = false;
                    if(e && e.error){
                        this.errorMsg=$t(e.error);
                        // this.$refs.ruleForm.fields[0].error=e.error
                    }


                }
            },
        }
    }
</script>

<style scoped>

</style>