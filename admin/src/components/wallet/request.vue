<template>
    <div class="WithdrawalRequest">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>财务管理</el-breadcrumb-item>
                <el-breadcrumb-item>提现请求</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <el-tooltip class="item" effect="dark" content="导出表格" placement="top">
                <el-button icon="el-icon-download" @click="excel">导出</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <!--用户列表highlight-current-row-->
            <el-table :data="resultList"  border class="table"
                      v-loading="loading">
                <!-- <el-table-column prop="id" label="订单号" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.id | noData}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column label="账户">
                    <template slot-scope="scope">
                        {{scope.row.uid}}
                        <!-- <span>{{scope.row.fromUser | toAccount}} ({{scope.row.fromUser.id}})</span> -->
                    </template>
                </el-table-column>
                <el-table-column prop="coin" label="币种">
                </el-table-column>
                <el-table-column label="数量" width="200">
                    <template slot-scope="scope">
                        <span>{{scope.row.amount | autoFixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="提现地址" width="300">
                </el-table-column>
                <el-table-column prop="date" label="时间"  width="200">
                    <template slot-scope="scope">
                        <span>{{scope.row.create | toTimeStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="right">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" :disabled="getPerms('wallet:request:cancel')"  v-if="scope.row.result ==-1" @click="cancel(scope.row._id)">取消
                        </el-button>
                        <el-button type="success" size="mini" :disabled="getPerms('wallet:request:pass')" v-if="scope.row.result==-1" @click="pass(scope.row._id)">通过
                        </el-button>
                        <!-- <el-button type="primary" size="mini" v-if="scope.row.result!=1" @click="handle(scope.row._id)">手工
                        </el-button> -->
                        <!-- <router-link :to="{path:'accountHistory',query:{id:scope.row.fromUser._id}}">
                        <el-button size="mini">账户记录</el-button>
                        </router-link> -->
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
import walletApi from '@/api/wallet'

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
        methods: {
            // 导出
            excel() {
                this.export({
                    url: '/admin/request',
                    title: '提现请求',
                    data: {
                        p: this.currentPage
                    }
                })
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();

            },
            // 获取数据
            async getData() {
                this.loading=true;
                try{
                    let data={
                        p:this.currentPage
                    }
                    let result =await walletApi.getRequest(data);
                    console.log(result)
                    this.resultList = result.data;
                    this.totalItems = result.data.count;
                    this.loading = false;
                }catch(e){

                }
          
            },
            cancel(id) {
                this.$prompt('你确定取消吗？请输入取消理由', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then( async ({value}) => {

                    try{
                        let data= {
                            id: id,
                            remark: value
                        }

                        let reuslt =await walletApi.walletCancel(data);
                         this.getData();
                        this.$message.success('取消成功')
                    }catch(e){

                    }
                }).catch(() => {

                })
            },
            pass(id) {
                this.$confirm('确定审核通过吗?', '提示', {}).then(async () => {
                    let data={
                        id
                    }
                    try{
                        let result =await walletApi.walletPass(data);
                        this.getData();
                        this.$message.success('审核通过');
                    }catch(e){

                    }
                }).catch(() => {

                })
            },
            handle(id) {
                // this.$confirm('你确定手工吗?', '提示', {}).then(() => {
                //     this.$axios({
                //         method: 'post',
                //         url: '/admin/withdraw',
                //         data: {
                //             type: 'handle',
                //             id: id
                //         }
                //     }).then(result => {
                //         if (result.data.result) {
                //             this.getData();
                //             this.$message.success('提现成功')
                //         } else {
                //             this.$message.success('数据异常')
                //         }
                //     }).catch(error => {
                //         this.$message.error(this.$t(error.data.message));
                //     })
                // }).catch(() => {

                // })
            }
        }
    }
</script>

<style scoped>
    tr, td {
        white-space: nowrap;
    }
</style>
