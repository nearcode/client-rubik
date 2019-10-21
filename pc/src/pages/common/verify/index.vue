<template>
    <!-- 身份验证框 -->
    <el-dialog :title="'身份验证'" :close-on-click-modal="false" :visible.sync="showDialog" width="600px">
        <el-form ref="form" :model="form" :label-position="'top'" :size="'medium'" @submit.native.prevent label-width="90px">
            <!--谷歌验证码-->
            <el-form-item label="谷歌验证码" v-if="authType==='otp'">
                <el-input v-model="param" size="large" autofocus placeholder="请输入谷歌验证码"></el-input>
            </el-form-item>
            <!--短信验证码-->
            <el-form-item label="短信验证码" v-else-if="authType==='mobile'">
                <el-input placeholder="请输入短信验证码" size="large" v-model="param">
                    <template slot="append">
                        <el-button @click="getCode" autofocus v-if="!codeTime">获取验证码</el-button>
                        <span v-if="codeTime">{{codeTime}}秒后重新发送</span>
                    </template>
                </el-input>
            </el-form-item>
            <!--邮箱验证码-->
            <el-form-item label="邮箱验证码" v-else-if="authType==='email'">
                <el-input placeholder="请输入邮箱验证码" size="large" v-model="param">
                    <template slot="append">
                        <el-button @click="getCode" autofocus v-if="!codeTime">获取验证码</el-button>
                        <span v-if="codeTime">{{codeTime}}秒后重新发送</span>
                    </template>
                </el-input>
            </el-form-item>
            <!--密码-->
            <el-form-item label="密码" v-else-if="authType==='password'">
                <el-input v-model="param" type="password" autofocus size="large" placeholder="请输入密码"></el-input>
            </el-form-item>
            <!--通用验证码-->
            <el-form-item label="验证码" v-else>
                <p>{{authType}}</p>
                <el-input placeholder="请输入验证码" size="large" v-model="param">
                    <template slot="append">
                        <el-button @click="getCode" autofocus v-if="!codeTime">获取验证码</el-button>
                        <span v-if="codeTime">{{codeTime}}秒后重新发送</span>
                    </template>
                </el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="disabled" :disabled="!param" @click="sure">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </span>
    </el-dialog>

</template>

<script>
    import baseApi from "@/api/base"

    export default {
        props: ['code'],
        data() {
            return {
                password: "",
                otp: '',
                codeTime: 0,
                callback: '',
                cancelCall: '',
                showDialog: false,
                param: '',
                disabled: false,
                parent: null,
                authType: {},
                form: {},
                data: {},
                typeName:''
            }
        },
        mounted() {

        },
        methods: {
            init(parent) {
                this.disabled = false;
                this.param = '';
                this.parent = parent;
            },
            show(datas) {
                this.$nextTick(() => {
                    this.authType = datas.authType;
                    this.showDialog = true;
                });
                this.callback = datas.callback;
                this.data = datas.data;
                this.typeName = datas.typeName;
                this.cancelCall = datas.cancel;
            },
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
            async getCode() {
                this.endTime();
                try {
                    let result = await baseApi.getAccountCode(); 
                    this.$message.success(this.$t('CODE_HAS_SEND'))
                }catch (e) {

                }
            },
            sure() {
                if (this.param) {
                    this.disabled = true;
                    this.$emit('code', this.param);

                    if(this.typeName){
                        this.callback && this.callback(this.typeName);
                    } else if (this.data) {
                        this.callback && this.callback(this.data);
                    } else {
                        this.callback && this.callback(this.param);
                    }


                    this.showDialog = false;
                }
            },
            cancel() {
                this.showDialog = false;
                this.cancelCall && this.cancelCall();
            }
        },
    }
</script>

<style scoped>

</style>
