<template>
    <div class="At_the_bottom">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item to="/account/cdd">实名认证</el-breadcrumb-item>
                    <el-breadcrumb-item>身份认证</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="text item" style="max-width: 500px;margin: auto;" v-loading="!stepActive">
                <el-steps :space="200" :active="stepActive" align-center finish-status="success"
                          style="margin-bottom: 20px;">
                    <el-step title="填写信息" name="step1"></el-step>
                    <el-step title="审核中" name="step2"></el-step>
                    <el-step title="认证结果" name="step3"></el-step>
                </el-steps>
                <div v-if="stepActive===1">
                    <el-form :model="ruleForm" :rules="rule" status-icon ref="ruleForm" label-width="80px"
                             @keyup.enter.native="submit('ruleForm')" class="ms-content login-container">
                        <!--证件类型-->
                        <el-form-item prop="cardType" label="证件类型">
                            <el-select placeholder="请选择证件类型" v-model="ruleForm.cardType">
                                <el-option v-for="(v,k) in cardType" :label="v.text" :value="v.type" :key="k"></el-option>
                            </el-select>
                        </el-form-item>
                        <!--名字-->
                        <el-form-item prop="truename" label="真实姓名">
                            <el-input type="text" tabindex="1" placeholder="真实姓名" autocomplete="off"
                                      v-model="ruleForm.truename"></el-input>
                        </el-form-item>
                        <!--手机号-->
                        <el-form-item prop="mobile" label="手机号码">
                            <el-input type="text" v-if="mobile" :disabled="Boolean(mobile)" placeholder="手机号"
                                      v-model="ruleForm.mobile"></el-input>
                            <el-input type="text" v-if="!mobile" placeholder="手机号" v-model="ruleForm.mobile">
                                <el-select slot="prepend" filterable v-model="ruleForm.select"
                                           @change="areaCode(ruleForm.select)"
                                           placeholder="选择区号">
                                    <el-option v-for="(item, index) in country" :value="item.value"
                                               :label="'['+item.name+'] / ' + item.value " :key="index">
                                    </el-option>
                                </el-select>
                            </el-input>
                        </el-form-item>
                        <!--身份证号-->
                        <el-form-item prop="cardNumber" label="证件号码">
                            <el-input type="text" tabindex="2" placeholder="证件号码" autocomplete="off"
                                      v-model="ruleForm.cardNumber">
                            </el-input>
                        </el-form-item>
                        <!--验证码-->
                        <el-form-item prop="code" label="验证码">
                            <el-input v-model="ruleForm.code" tabindex="3"
                                      :placeholder="'请输入短信验证码'">
                                <el-button slot="append" v-if="!codeTime" @click="getCode">获取验证码</el-button>
                                <el-button slot="append" v-else>{{codeTime}}秒后可重发</el-button>
                            </el-input>
                        </el-form-item>
                        <!--确认按钮-->
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')" :loading="ruleForm.loading">确定
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-if="stepActive===2">
                    <div class="step_audit" v-if="resuleStatus.result==1">
                        <!--等待审核-->
                        <span class="review status_img"></span>
                        <h1>您的资料已提交审核，预计将在三个工作日内完成审核</h1>
                        <p>我们会保护您的个人信息安全,请您耐心等待！</p>
                    </div>
                    <!--审核未通过-->
                    <div class="step_audit" v-if="resuleStatus.result==2">
                        <span class="failure status_img"></span>
                        <h1>您提交的身份认证请求未通过审核，原因是：<span class="font_red">{{resuleStatus.reply}}</span></h1>
                        <el-button @click="stepActive=1" type="primary" plain>重新认证</el-button>
                    </div>
                </div>
                <div v-if="stepActive===3" class="steps">
                    <span class="fa fa-5x fa-check-circle font_green"></span>
                    <h1 class="font_green">认证成功</h1>
                    <p>恭喜你，完成了实名认证</p>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {countrys} from '@/common/country';
    import baseApi from "@/api/base"

    export default {
        name: "real",
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
                stepActive: null,
                ruleForm: {
                    select: '+86',//默认区号
                },
                rules: {},
                country: [],
                codeTime: null,
                cardType: [{type: 1, text: '身份证'}],
                rule: {
                    cardType: [
                        {required: true, message: '请选择证件类型', trigger: ['change', 'blur']},
                    ],
                    truename: [
                        {required: true, message: '请输入真实姓名', trigger: ['change', 'blur']},
                    ],
                    cardNumber: [
                        {required: true, message: '请输入证件号', trigger: ['change', 'blur']},
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: ['change', 'blur']},
                        {validator: validatePass}
                    ],
                    code: [
                        {required: true, message: '请输入验证码', trigger: ['change', 'blur']},
                    ],
                },

                resuleStatus: null
            };
        },
        computed: {
            ...mapState(['mobile', 'truename', 'authLevel']),
        },
        mounted() {
            this.country = countrys;

            // this.authLevel > 0 ? this.stepActive = 3 : this.stepActive = 1;

            if (this.mobile) {
                this.$set(this.ruleForm, 'mobile', this.mobile);
            }
            this.getStatus();
        },
        methods: {
            async getStatus() {
                try {
                    let result = await baseApi.getCertificateStatus({type:1});
                    this.resuleStatus = result;
                    switch (result.result) {
                        case 0:
                            this.stepActive = 1;
                            break;
                        case 1:
                        case 2:
                            this.stepActive = 2;
                            break;
                        case 3:
                            this.stepActive = 3;
                            break;
                    }
                } catch (e) {

                }
            },
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
                let account = this.mobile ? this.mobile : this.ruleForm.select + this.ruleForm.mobile;
                try {
                    let result = null;
                    if (this.mobile) {
                        result = await baseApi.getAccountCode(account);

                    } else {
                        result = await baseApi.getBindEmailOrMobileCode(account);

                    }
                    this.$notify.success(this.$t('CODE_HAS_SEND'));
                    this.endTime();
                } catch (e) {
                    console.log(e)
                }
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
                    let mobile = this.mobile ? this.mobile : this.ruleForm.select + this.ruleForm.mobile;
                    let data = {
                        type:1,
                        mobile: mobile,
                        code: this.ruleForm.code,
                        truename: this.ruleForm.truename,
                        cardNumber: this.ruleForm.cardNumber,
                        cardType: this.ruleForm.cardType
                    };

                    let result = await baseApi.realnameRequest(data);
                    this.getStatus();
                    // this.$store.commit("getInfo");
                    // this.stepActive = 3;
                    this.$notify.success(this.$t('操作成功'));
                } catch (e) {
                }
            },
        }
    }
</script>

<style lang="less" scoped>

    .step_audit {
        text-align: center;
        padding: 15px 0;
        span.status_img {
            display: block;
            width: 60px;
            height: 60px;
            margin: auto;
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;

        }
        span.review {
            background-image: url("/static/assets/ico/review.svg");
        }
        span.failure {
            background-image: url("/static/assets/ico/AuditFailure.svg");
        }
        h1 {
            color: #303133;
            padding: 15px;
            font-size: 16px;
            font-weight: bold
        }
        p {
            color: #909399;
            font-size: 12px;
        }
    }

    .steps {
        text-align: center;
        padding: 20px 0;
        h1 {
            font-size: 18px;
            font-weight: 500;
            padding: 10px;
        }
        p {
            color: #606266;
        }
    }
</style>

