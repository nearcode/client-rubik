<template>
    <div class="WithdrawalRequest">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>第三方平台</el-breadcrumb-item>
                <el-breadcrumb-item>提现请求</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <el-tooltip class="item" effect="dark" content="导出表格" placement="top">
                    <el-button icon="el-icon-download">导出</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button :icon="'el-icon-refresh'" @click="getData">刷新
                    </el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <!--用户列表highlight-current-row-->
            <el-table :data="resultList"  border class="table"
                      v-loading="loading">
                <el-table-column prop="id" label="订单号" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.id | noData}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="账户" width="200">
                    <template slot-scope="scope">
                        <span>{{scope.row.fromUser | toAccount}} ({{scope.row.fromUser.id}})</span>
                    </template>
                </el-table-column>
                <el-table-column prop="coin" label="币种">
                </el-table-column>
                <el-table-column label="数量" width="200">
                    <template slot-scope="scope">
                        <span>{{scope.row.amount | autoFixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="提现地址">
                </el-table-column>
                <el-table-column prop="date" label="时间"  width="200">
                    <template slot-scope="scope">
                        <span>{{scope.row.date | toTimeStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" @click="cancel(scope.row._id)">取消
                        </el-button>
                        <el-button type="success" size="mini" v-if="scope.row.result==-1" @click="pass(scope.row._id)">通过
                        </el-button>
                        <el-button type="primary" size="mini" v-if="scope.row.result!=1" @click="handle(scope.row._id)">手工
                        </el-button>
                        <router-link :to="{path:'accountHistory',query:{id:scope.row.fromUser._id}}">
                            <el-button size="mini">账户记录</el-button>
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="pagination" v-if="totalItems>1">
                <el-pagination background @current-change="handleCurrentChange" :page-size="20"
                               layout="prev, pager, next"
                               :total="totalItems">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "WithdrawalRequest",
        data() {
            return {
                resultList: [],
                totalItems:0,
                currentPage: 1,
                loading: true
            }
        },
        mounted() {
            this.getData();
        },
    //     router.get('/3rd/withdraw/request', openapi.withdrawRequest); //申请提现
    // router.get('/admin/3rd/withdraw/request/list', auth.level3, openapi.withdrawRequestList); // 提现申请列表
    // router.get('/admin/3rd/withdraw/processing', auth.level3, openapi.withdrawProcessing); //提现账目审查操作处理
    // router.get('/admin/3rd/history/:action', auth.level3, openapi.withdrawAndDepositHistory); //充值提现历史记录
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();

            },
            // 获取数据
            getData() {
                this.loading=true;
                this.$axios({
                    method: 'get',
                    url: '/admin/3rd/withdraw/request/list?p=' + this.currentPage
                }).then(result => {
                    this.resultList = result.data.resultList;
                    this.totalItems = result.data.totalItems;
                    this.loading = false;
                }).catch(error => {
                    if (error && error.data.message) {
                        this.$message.error(this.$t(error.data.message));
                    }
                })
            },
            cancel(id) {
                this.$prompt('你确定取消吗？请输入取消理由', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({value}) => {
                    this.$axios({
                        method: 'post',
                        url: '/admin/3rd/withdraw/processing',
                        data: {
                            type: 'cancel',
                            id: id,
                            remark: value
                        }
                    }).then(result => {
                        this.getData();
                        this.$message.success('取消成功')
                    }).catch(error => {
                        if(error && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                    })
                }).catch(() => {

                })
            },
            pass(id) {
                this.$confirm('确定审核通过吗?', '提示', {}).then(() => {
                    this.$axios({
                        method: 'post',
                        url: '/admin/3rd/withdraw/processing',
                        data: {
                            type: 'send',
                            id: id
                        }
                    }).then(result => {
                        this.getData();
                        this.$message.success('审核通过')
                    }).catch(error => {
                        if(error && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                    })
                }).catch(() => {

                })
            },
            handle(id) {
                this.$confirm('你确定手工吗?', '提示', {}).then(() => {
                    this.$axios({
                        method: 'post',
                        url: '/admin/3rd/withdraw/processing',
                        data: {
                            type: 'handle',
                            id: id
                        }
                    }).then(result => {
                        if (result.data.result) {
                            this.getData();
                            this.$message.success('提现成功')
                        } else {
                            this.$message.success('数据异常')
                        }
                    }).catch(error => {
                        if(error && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                    })
                }).catch(() => {

                })
            }
        }
    }
</script>

<style scoped>
    tr, td {
        white-space: nowrap;
    }
</style>
