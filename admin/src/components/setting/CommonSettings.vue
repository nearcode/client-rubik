<template>
    <div class="info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>公共设置</el-breadcrumb-item>
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
                <!--<el-form-item label="服务商手续费">-->
                    <!--<el-input v-model="form.merchantFee"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="未处理订单数量">-->
                    <!--<el-input v-model="form.unprocessedOrders"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="自动审核C2C数量">-->
                    <!--<el-input v-model="form.autoWithdrawalBalance"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="开启注册">
                    <el-switch
                        v-model="form.isEncrypt">
                    </el-switch>
                </el-form-item>
                <el-form-item label="关闭网站">
                    <el-switch v-model="form.w">
                    </el-switch>
                </el-form-item>
                <!--active-color="#13ce66"-->
                <!--inactive-color="#ff4949"-->
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" :disabled="getPerms('sysSettings:commonSettings:edit')">保存</el-button>
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
                form: {
                    // merchantFee: this.$store.state.merchantFee,
                    // unprocessedOrders: this.$store.state.unprocessedOrders,
                    // autoWithdrawalBalance: this.$store.state.autoWithdrawalBalance,
                    // isEncrypt: false,
                },
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                this.$store.commit('getInfo');
                let loop = () => {
                    if (this.$store.state) {
                        this.form = {
                            merchantFee: this.$store.state.merchantFee,
                            unprocessedOrders: this.$store.state.unprocessedOrders,
                            autoWithdrawalBalance: this.$store.state.autoWithdrawalBalance,
                            isEncrypt: false,
                        };
                        return
                    }
                    setTimeout(loop, 500)
                };
                setTimeout(loop, 500);
            },
            onSubmit() {
                this.$axios({
                        method: 'post',
                        url: '/config/set',
                        data: {
                            merchantFee: this.form.merchantFee,
                            unprocessedOrders: this.form.unprocessedOrders,
                            autoWithdrawalBalance: this.form.autoWithdrawalBalance
                        }
                    }
                ).then(result => {
                    this.getData();
                    this.$message.success('保存成功');
                }).catch(error => {
                    if (error && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                })
            },
        },
    }
</script>

<style scoped>
    .container div {
        vertical-align: middle;
        height: 2rem;
        line-height: 2rem;
    }

    .el-row {
        margin-top: 10px;
    }
</style>
