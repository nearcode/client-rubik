<template>
    <div class="Administrator">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>财务管理</el-breadcrumb-item>
                <el-breadcrumb-item>资金分布</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <el-tooltip class="item" effect="dark" content="导出表格" placement="top">
                    <el-button icon="el-icon-download" @click="excel">导出</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh" @click="onSubmit">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <!--操作与搜索-->
            <div class="plugins-tips">
                <!--<div class="handle-box">-->
                <el-form :inline="true" :model="formInline" @keyup.enter.native="onSubmit" class="demo-form-inline">
                    <el-form-item label="币种">
                        <el-select v-model="formInline.coin" filterable clearable placeholder="请选择币种">
                            <el-option :label="k" v-for="(v,k) in $store.state.coins" :key="k" :value="k"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数量>=">
                        <el-input placeholder="请输入内容" v-model="formInline.amount"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
                <!--</div>-->
            </div>
            <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable"
            >
                <el-table-column
                    label="用户ID"
                    width="180"
                    prop="uid">
                </el-table-column>

                <el-table-column prop="coin" label="币种"></el-table-column>

                <el-table-column prop="balance" label="数量">
                    <template slot-scope="scope">
                        <span>{{scope.row.balance | autoFixed}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>
    import adminApi from "@/api/admin"

    export default {
        name: "UserPosition",
        data() {
            return {
                resultList: [],
                loading: false,
                formInline: {
                    coin: '',
                    amount: 1
                }
            }
        }, mounted() {
        },
        methods: {
            // 导出
            excel() {
                this.export({
                    url: '/downExcel',
                    title: '资金分布',
                    data:{
                        action:'getPosition',
                        coin: this.formInline.coin,
                        amount: this.formInline.amount
                    }
                })
            },
            async onSubmit() {
                this.loading = true;
                let data={
                    coin: this.formInline.coin,
                    amount: this.formInline.amount
                };
                try {
                    let result =await adminApi.balancePosition(data);
                    this.loading = false;
                    this.resultList = result;
                }catch (e) {

                }
                // this.$axios({
                //     method: 'post',
                //     url: '/admin/getPosition',
                //     data: {
                //         coin: this.formInline.coin,
                //         amount: this.formInline.amount
                //     }
                // }).then(result => {
                //     this.loading = false;
                //     this.resultList = result.data;
                // }).catch(error => {
                //     this.$message.error(this.$t(error.data.message));
                // })
            }
        }

    }
</script>

<style scoped>

</style>
