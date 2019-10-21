<template>
    <div class="info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>邮件设置</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <!--<el-tooltip class="item" effect="dark" content="导出表格" placement="top">-->
                <!--<el-button icon="el-icon-download">导出</el-button>-->
                <!--</el-tooltip>-->
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <el-form ref="form" :model="form" label-width="180px">
                <el-form-item label="邮件服务器地址">
                    <el-input placeholder="Please input" v-model="form.host"></el-input>
                </el-form-item>
                <el-form-item label="邮件服务器端口">
                    <el-input placeholder="Please input" v-model="form.port"></el-input>
                </el-form-item>
                <el-form-item label="邮件服务器账户">
                    <el-input placeholder="Please input" v-model="form.account"></el-input>
                </el-form-item>
                <el-form-item label="邮件服务器密码">
                    <el-input placeholder="Please input" v-model="form.passWord"></el-input>
                </el-form-item>
                <el-form-item label="是否加密">
                    <el-switch
                        v-model="form.isEncrypt"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" @click="mailSubmit" :disabled="getPerms('sysSettings:email:edit')">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "email",
        data() {
            return {
                form:{
                    host:'',
                    port:'',
                    account:'',
                    passWord:'',
                    isEncrypt:'',
                },

                datas:[],
                mailServer:[]
            }
        },
        mounted() {
          this.getData();
        },
        methods:{
            getData(){
                this.getMailSetting()
            },
            getMailSetting() {
                this.$axios({
                        method: 'get',
                        url: '/admin/mailSettings'
                    }
                ).then(result => {
                    this.datas = result.data;
                    this.mailServer = this.datas.mailServer;
                    this.form.account=this.mailServer.mailServer.account
                    this.form.host=this.mailServer.mailServer.host
                    this.form.passWord=this.mailServer.mailServer.passWord
                    this.form.port=this.mailServer.mailServer.port
                    this.form.isEncrypt=this.mailServer.mailServer.isEncrypt

                }).catch(error => {
                    if (error.data && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                })
            },
            mailSubmit() {
                if(!this.form.account || !this.form.port||!this.form.host||!this.form.passWord) return this.$message.error('信息不能为空');
                this.$axios({
                    method: 'post',
                    url: '/admin/mailSettings',
                    data: {
                        host: this.form.host,
                        port: this.form.port,
                        account: this.form.account,
                        passWord:this.form.passWord,
                        isEncrypt:this.form.isEncrypt,
                    }
                }).then(result => {
                    this.getData();
                    this.$message.success('保存成功');
                }).catch(error => {
                    if(error.data.message) this.$message.error(this.$t(error.data.message));
                });
            },
        },
    }
</script>

<style scoped>
.container div{
    vertical-align: middle;
    height: 2rem;
    line-height: 2rem;
}
.el-row{
    margin-top: 10px;
}
</style>
