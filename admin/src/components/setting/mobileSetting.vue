<template>
    <div class="info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>短信设置</el-breadcrumb-item>
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
            <el-row>
                <el-col :span="2">APPID：</el-col>
                <el-col :span="22">
                    <div><el-input placeholder="Please input" v-model="appid"></el-input></div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">密钥：</el-col>
                <el-col :span="22">
                    <div><el-input placeholder="Please input" v-model="appsecret"></el-input></div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2"></el-col>
                <el-col :span="1">
                    <div>
                        <el-button type="primary" @click="mobileSubmit()" :disabled="getPerms('sysSettings:mobileSetting:edit')">保存</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: "mobileSetting",
        data() {
            return {
                value1: true,
                value2: true,
                smsServer:[],
                data:[],
                appid:'',
                appsecret:'',
            }
        },
        mounted() {
          this.getData();
        },
        methods:{
            getData(){
                this.$store.commit('getInfo');
                this.getMobileSetting()
            },
            getMobileSetting(){
                this.$axios({
                        method: 'get',
                        url: '/admin/smsSettings'
                    }
                ).then(result => {
                    this.data = result.data;
                    this.smsServer = this.data.smsServer;
                    this.appid = this.smsServer.appid;
                    this.appsecret = this.smsServer.signature;
                }).catch(error => {
                    if (error.data && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                })
            },
            mobileSubmit(){
                if(!this.appid || !this.appsecret) return this.$message.error('信息不能为空');
                this.$axios({
                    method: 'post',
                    url: '/admin/smsSettings',
                    data: {
                        appid: this.appid,
                        signature: this.appsecret,
                    }
                }).then(result => {
                    this.getMobileSetting();
                    this.$message.success('保存成功');
                }).catch(error => {
                    if(error.message) this.$message.error(error.message);
                });
            }

        }
    }
</script>

<style scoped>
    .container{
        text-align: center;
    }
    .container div{
        vertical-align: middle;
        height: 2rem;
        line-height: 2rem;
    }
    .el-row{
        margin-top: 10px;
    }
</style>
