<template>
    <div>
        <el-tabs tab-position="left" style="min-height: 150px">
            <el-tab-pane label="第一步">
                <h1>下载谷歌验证器</h1>
                <div>
                    <span style="display: inline-block;padding-right: 10px;border-right: 1px solid #E4E7ED;float: left;">
                        <img src="/static/assets/ico/android_btn.png" alt="">
                        <img style="display:block;margin-top: 10px;" src="/static/assets/ico/apple_btn.png" alt="">
                    </span>
                    <span style="padding-left: 10px;">
                        <img width="80" src="/static/assets/ico/down_android.png" alt="">
                        <img width="80" src="/static/assets/ico/down_ios.png" alt="">
                    </span>
                </div>
            </el-tab-pane>
            <el-tab-pane label="第二步">
                <h1>使用谷歌验证器扫描二维码或输入以下密钥
                    <small style="color: #909399;">(部分安卓手机不支持扫描二维码,请选择输入密钥方式)</small>
                </h1>
                <div>
                    <div style="width: 90px;padding-right: 10px;border-right: 1px solid #E4E7ED;float: left;">
                        <img src="/static/assets/ico/down_android.png" alt="">
                    </div>
                    <div style="display: inline-block;padding-left: 10px;">
                        <h2 style="padding-top: 10px;">密钥:</h2>
                        <span>IFAWKUKRLURXO3ZIGVFSQYTEJU4S4VDH</span>
                        <el-button size="mini">复制</el-button>
                        <p class="font_red">注意：此二维码以及密钥是获取谷歌验证码唯一标识，请勿泄漏。</p>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="第三步">
                <h1>填写下方信息开启谷歌认证</h1>
                <div style="max-width: 200px;">
                    <el-form :model="ruleForm" :rules="rule" status-icon ref="ruleForm" label-width="0px"
                             @keyup.enter.native="submitForm('ruleForm')" class="ms-content login-container">
                        <!--谷歌验证-->
                        <el-form-item prop="password">
                            <el-input type="text" tabindex="2" placeholder="谷歌验证码" v-model="ruleForm.email">
                            </el-input>
                        </el-form-item>
                        <!--确认按钮-->
                        <el-form-item>
                            <el-button type="primary" class="btn-block" @click="submitForm('ruleForm')"
                                       :loading="ruleForm.loading">开启双重认证
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "otp",
        data() {
            return {
                ruleForm: {},
                rule: {}
            }
        }, methods: {
            submitForm() {

            }
        }
    }
</script>

<style scoped>
    h1 {
        margin-bottom: 10px;
        color: #606266;
    }
</style>