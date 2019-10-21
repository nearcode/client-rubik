<template>
    <div>
        <el-form :model="ruleForm" :rules="rule" status-icon ref="ruleForm" label-width="0px"
                 @keyup.enter.native="submitForm('ruleForm')" class="ms-content login-container">
            <!--手机号-->
            <el-form-item prop="mobile">
                <el-input type="text" tabindex="2" placeholder="手机号" v-model="ruleForm.mobile">
                    <el-select slot="prepend" filterable v-model="ruleForm.select" @change="areaCode(ruleForm.select)"
                               placeholder="选择区号">
                        <el-option v-for="(item, index) in country" :value="item.value"
                                   :label="'['+item.name+'] / ' + item.value " :key="index">
                        </el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <!--验证码-->
            <el-form-item prop="code">
                <el-input v-model="ruleForm.code" tabindex="3"
                          :placeholder="'请输入短信验证码'">
                    <el-button slot="append" v-if="!codeTime" @click="getCode">获取验证码</el-button>
                    <el-button slot="append" v-else>{{codeTime}}秒后可重发</el-button>
                </el-input>
            </el-form-item>
            <!--确认按钮-->
            <el-form-item>
                <el-button type="primary" class="btn-block" @click="submitForm('ruleForm')" :disabled="!ruleForm.mobile"
                           :loading="ruleForm.loading">
                    {{(mobile?'更换':'绑定')+'手机号'}}
                </el-button>
            </el-form-item>
        </el-form>
        <!--验证弹框组件-->
        <verify ref="verifyDialog" v-on:code="setCode"></verify>
    </div>
</template>

<script>
    import {countrys} from '@/common/country';
    import baseApi from "@/api/base"
    import {mapState} from 'vuex'

    export default {
        name: "mobile",
        data() {
            const mobile = /^(\+?0?86\-?)?1[345789]\d{9}$/;

            let validatePass = (rule, value, callback) => {
                if (mobile.test(value)) {
                    callback();
                } else {
                    callback(new Error("请输入正确的手机号"));
                }
            };
            return {
                country: [],
                ruleForm: {
                    select: '+86',//默认区号
                },
                codeTime: null,
                rule: {
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: ['change', 'blur']},
                        {validator: validatePass}
                    ],
                    code: [
                        {required: true, message: '请输入验证码', trigger: ['change', 'blur']},
                    ],
                },
                authCode: '',
            }
        },
        computed: {
            ...mapState(['mobile']),
        },
        mounted() {
            this.country = countrys;
        },
        methods: {
            // 提取区号
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
                if (!this.ruleForm.mobile) return;
                let account = this.ruleForm.select + this.ruleForm.mobile;
                try {
                    let result = await baseApi.getBindEmailOrMobileCode(account);
                    this.$notify.success(this.$t('CODE_HAS_SEND'));
                    this.endTime();
                } catch (e) {
                }
            },
            // 把验证码赋值过来
            setCode(code) {
                this.authCode = code;
            },
            //验证通过就执行
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.submit();
                    } else {
                        return false;
                    }
                });
            },
            async submit() {
                try {
                    let mobile = this.ruleForm.select + this.ruleForm.mobile, code = this.ruleForm.code,
                        authCode = this.authCode;
                    let result = await baseApi.accBindMobile(authCode, code, mobile);
                    this.$store.commit("getInfo");
                    this.$notify.success(this.$t('操作成功'));
                } catch (e) {
                    this.authCode = '';
                    let layer = this.$refs.verifyDialog;
                    layer.init(this);
                    if (e && e.verify) {
                        layer.show({
                            authType: e.verify,
                            callback: this.submit
                        });
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>