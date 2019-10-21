<template>
    <div class="WithdrawalRequest">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>BIPAY管理</el-breadcrumb-item>
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
                  <el-table-column label="真实姓名" width="200">
                    <template slot-scope="scope">
                        <span>{{scope.row | getDictValue('truename')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="cardNumber" label="银行卡" width="300">
                </el-table-column>
                  <el-table-column label="状态" align="center">
                            <template slot-scope="scope">
                        <span v-for="item in results" :key="item.index">
                            <el-tag :type="item.type" v-if="item.index===scope.row.result">{{item.text}}</el-tag>
                        </span>
                            </template>
                        </el-table-column>
                <el-table-column prop="date" label="时间"  width="200">
                    <template slot-scope="scope">
                        <span>{{scope.row.create | toTimeStr}}</span>
                    </template>
                </el-table-column>
               <el-table-column label="操作" align="center" min-width="120">
                            <template slot-scope="scope">
                                <!--<el-button size="mini" @click="openAudit(scope.row)">审核</el-button>-->
                                  <el-button size="mini" v-if="scope.row.result == 2" :disabled="getPerms('bipay:request:confirm')" @click="bankConfirm(scope.row._id,'confirm')" type="primary">
                                      确认
                                    </el-button>
                                <div v-if="scope.row.type==-1 && scope.row.result==0">
                                    
                                    <el-button size="mini" :disabled="getPerms('bipay:request:pass')" @click="pass(scope.row._id,'pass')" type="primary">通过
                                    </el-button>
                                    <el-button size="mini" :disabled="getPerms('bipay:request:cancel')" @click="cancel(scope.row._id,'cancel')" type="danger">取消
                                    </el-button>
                                </div>
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
import bipayApi from '@/api/bipay'

    export default {
        name: "WithdrawalRequest",
        data() {
            return {
                resultList: [],
                totalItems:0,
                currentPage: 1,
                loading: false,
                 results: [
                    {text: '待审核', index: 0, type: 'warning'},
                    {text: '银行完成', index: 1, type: 'success'},
                    {text: '处理中', index: 2, type: 'warning'},
                    {text: '银行进行中', index: 3, type: 'warning'},
                    {text: '银行失败', index: 4, type: 'danger'},
                    {text: '取消', index: 5, type: 'danger'},
                ]
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            // 导出
            excel() {
                // this.export({
                //     url: '/admin/request',
                //     title: '提现请求',
                //     data: {
                //         p: this.currentPage
                //     }
                // })
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
                    
                    let result =await bipayApi.withdrawRequest({
                        p:this.currentPage
                    });
                    this.loading = false;
                    this.resultList = result.data;
                    this.totalItems = result.data.count;
                   
                }catch(e){

                }
          
            },
            async bankConfirm(id){
                if(!id) return;
                 this.$confirm('是否确认？', '提示', {}).then(async () => {
                        try {
                            let result = await bipayApi.bankConfirm({id});
                             this.getData();
                             this.$notify.success(this.$t('确认成功'));
                        } catch (e) {

                        }
                    })
            },
            cancel(id) {
                if(!id) return;
                this.$confirm('你确定'+text+'吗', '提示', {}).then(async () => {
                        try {
                            let result = await bipayApi.bankHistoryCancel({id});
                             this.getData();
                             this.$notify.success(this.$t('取消成功'));
                        } catch (e) {

                        }
                    })
            },
            pass(id) {
                if(!id) return;
                  this.$confirm('你确定审核通过吗', '提示', {}).then(async () => {
                        try {
                            let result = await bipayApi.bankHistoryPass({id});
                           
                             this.getData();
                             this.$notify.success(this.$t('通过成功'));
                        } catch (e) {

                        }
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
