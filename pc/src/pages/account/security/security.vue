<template>
    <div class="At_the_bottom security">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>安全中心</span>
            </div>
            <div class="text item">
                <el-collapse v-model="activeName">
                    <!--邮箱-->
                    <el-collapse-item name="email">
                        <template slot="title">
                            <i class="fa fa-fw" :class="isThere(email)"></i>邮箱 ：{{getEmail}}
                        </template>
                        <div class="mainBox">
                            <set-email></set-email>
                        </div>
                    </el-collapse-item>
                    <!--手机号码-->
                    <el-collapse-item name="mobile">
                        <template slot="title">
                            <i class="fa fa-fw" :class="isThere(mobile)"></i>手机号码 ：{{getMobile}}
                        </template>
                        <div class="mainBox">
                            <set-mobile></set-mobile>
                        </div>
                    </el-collapse-item>
                    <!--谷歌认证-->
                    <!--<el-collapse-item name="otp">-->
                        <!--<template slot="title">-->
                            <!--<i class="fa fa-fw" :class="isThere(uid)"></i>谷歌认证 ：务必绑定谷歌验证，用户保护资金和账户安全-->
                        <!--</template>-->
                        <!--<div>-->
                            <!--<set-otp></set-otp>-->
                        <!--</div>-->
                    <!--</el-collapse-item>-->
                    <!--登录密码-->
                    <el-collapse-item name="password">
                        <template slot="title">
                            <i class="fa fa-fw" :class="isThere(uid)"></i>登录密码 ：登录时使用
                        </template>
                        <div class="mainBox">
                            <set-password></set-password>
                        </div>
                    </el-collapse-item>
                    <!--验证方式-->
                    <!--<el-collapse-item name="Verify">-->
                        <!--<template slot="title">-->
                            <!--<i class="fa fa-fw" :class="isThere(uid)"></i>验证方式-->
                        <!--</template>-->
                        <!--<div>-->
                            <!--<el-form ref="form" :model="form" label-width="80px">-->
                                <!--<el-col :span="6">-->
                                    <!--<el-form-item label="密码验证">-->
                                        <!--<el-switch v-model="form.password"></el-switch>-->
                                    <!--</el-form-item>-->
                                <!--</el-col>-->
                                <!--<el-col :span="6">-->
                                    <!--<el-form-item label="谷歌验证">-->
                                        <!--<el-switch v-model="form.otp"></el-switch>-->
                                    <!--</el-form-item>-->
                                <!--</el-col>-->
                                <!--<el-col :span="6">-->
                                    <!--<el-form-item label="邮箱验证">-->
                                        <!--<el-switch v-model="form.email"></el-switch>-->
                                    <!--</el-form-item>-->
                                <!--</el-col>-->
                                <!--<el-col :span="6">-->
                                    <!--<el-form-item label="短信验证">-->
                                        <!--<el-switch v-model="form.mobile"></el-switch>-->
                                    <!--</el-form-item>-->
                                <!--</el-col>-->
                            <!--</el-form>-->
                        <!--</div>-->
                    <!--</el-collapse-item>-->
                </el-collapse>
            </div>
        </el-card>

        <!--验证弹框组件-->
        <verify ref="verifyDialog" v-on:code="setCode"></verify>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import setEmail from './email'
    import setMobile from './mobile'
    import setOtp from './otp'
    import setPassword from './password'

    export default {
        name: "security",
        components:{
            setEmail,setMobile,setOtp,setPassword
        },
        data() {
            return {
                form: {},
                code:'',
                activeName: []
            }
        },
        computed: {
            ...mapState(['username', 'uid', 'mobile', 'email','uid']),
            getMobile(){
                let text;
               if(this.mobile){
                   text='您绑定的手机号码为'+this.mobile
               }else {
                   text='您未绑定手机号码'
               }
               return text;
            },
             getEmail(){
                let text;
               if(this.email){
                   text='您绑定的邮箱为'+this.email
               }else {
                   text='您未绑定邮箱'
               }
               return text;
            },

        },
        mounted(){
            this.routeType();

        },
        methods:{
            // 把验证码赋值过来
            setCode(code) {
                this.code = code;
            },
            routeType(){
                if(this.$route.query.type){
                    this.activeName.push(this.$route.query.type)
                }
            },
            isThere(type){
                if(type){
                    return 'font_green fa-check-circle'
                }else {
                    return 'font_red fa-exclamation-circle'
                }
            },
        },
        watch: {
            $route(to, from) {
                this.routeType();
            },
            // id() {
            //     if (this.id) this.getData();
            // },
        },

    }
</script>

<style lang="less" scoped>
    .security /deep/ .el-collapse-item__content{
        /*background-color:#F2F6FC;*/
        overflow: hidden;
        .mainBox{
            max-width: 500px;
            margin: auto;
            padding-top:25px;
        }
    }

</style>