<template>
    <div class="PaymentRecords">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>C2C交易</el-breadcrumb-item>
                <el-breadcrumb-item>C2C交易记录</el-breadcrumb-item>
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
            <!--操作与搜索-->
            <div class="plugins-tips">
                <el-form :inline="true" :model="form" class="demo-form-inline">
                    <el-form-item label="选择代理商">
                        <el-select v-model="form.merchant" placeholder="选择代理商">
                            <el-option :label="v.username" v-for="(v,k) in merchantList" :key="k" :value="v._id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="起始时间">
                        <el-date-picker
                            v-model="form.startTime"
                            type="datetime"
                            value-format="timestamp"
                            placeholder="选择起始日期时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="结束时间">
                        <el-date-picker
                            v-model="form.endTime"
                            type="datetime"
                            value-format="timestamp"
                            placeholder="选择结束日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-row :gutter="15" style="margin-top: 15px">
                    <el-col :md="6" :sm="12" :xs="24">
                        <el-card class="box-card" shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>充值金额</span>
                            </div>
                            <div class="text item">
                                <p>
                                    <el-tag>{{sumData.buy | noData}}</el-tag>
                                </p>
                            </div>
                        </el-card>

                    </el-col>
                    <el-col :md="6" :sm="12" :xs="24">
                        <el-card class="box-card" shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>提现金额</span>
                            </div>
                            <div class="text item">
                                <p>
                                    <el-tag>{{sumData.sell | noData}}</el-tag>
                                </p>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :md="4" :sm="8" :xs="24">
                        <el-card class="box-card" shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>代理商待确认</span>
                            </div>
                            <div class="text item">
                                <p>
                                    <el-tag>{{sumData.merchantConfirm | noData}}</el-tag>
                                </p>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :md="4" :sm="8" :xs="24">
                        <el-card class="box-card" shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>用户待确认</span>
                            </div>
                            <div class="text item">
                                <p>
                                    <el-tag>{{sumData.userConfirm | noData}}</el-tag>
                                </p>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :md="4" :sm="8" :xs="24">
                        <el-card class="box-card" shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>待审核</span>
                            </div>
                            <div class="text item">
                                <p>
                                    <el-tag>{{sumData.padding | noData}}</el-tag>
                                </p>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="resultList" border class="table"
                      v-loading="loading" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column prop="id" label="订单号">
                </el-table-column>
                <el-table-column prop="date" label="时间">
                    <template slot-scope="scope">
                        {{scope.row.create | toTimeStr}}
                    </template>
                </el-table-column>
                <el-table-column label="用户">
                    <template slot-scope="scope">
                        {{scope.row | getDictValue('uid')}}
                    </template>
                </el-table-column>
                <el-table-column label="类型" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.type==1">充值</el-tag>
                        <el-tag v-if="scope.row.type==-1" type="danger">提现</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="价格" prop="price" align="center">
                </el-table-column>
                <el-table-column label="数量" prop="amount" align="center">
                </el-table-column>
                <el-table-column label="商家" align="center">
                    <template slot-scope="scope">
                           {{scope.row.merchants | getDictValue('truename')}}
                        ({{scope.row.merchants | getDictValue('uid')}})
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :page-size="20"
                               layout="prev, pager, next"
                               :total="totalItems">
                </el-pagination>
            </div>
        </div>
    </div>
</template>


<script>
    import c2cApi from "@/api/c2c";

    export default {
        name: "records",
        data() {
            return {
                resultList: [],
                currentPage: 1,
                multipleSelection: [],
                merchantList: [],
                totalItems: 0,
                delVisible: false,
                loading: true,
                form: {
                    startTime:new Date(new Date(new Date().toLocaleDateString()).getTime()),
                    endTime:new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)
                },
                sumData: {
                    
                },

            }
        },
        mounted() {
            this.getData();
           
            // this.getMerchant();
        },
        methods: {
            // 搜索
            search() {
                this.getData();
                
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                // this.$refs.multipleTable.toggleRowSelection(row);
                console.log(JSON.stringify(this.multipleSelection))
            },
            // 获取数据
            async getData() {
                this.loading = true;
                try{
                    let result = await c2cApi.getC2cHistory({
                        startDate: this.form.startTime,
                        endDate: this.form.endTime,
                        merchant: this.form.merchant,
                        p: this.currentPage,
                    });
                        this.resultList = result.data;
                        this.sumData=result.sum;
                        this.totalItems = result.count;
                        this.loading = false;
                }catch(e){

                }
            },
            // 获取代理商列表
            getMerchant() {
                this.$axios({
                    method: 'get',
                    url: '/admin/c2c/merchantList'
                }).then(result => {
                    this.merchantList = result.data.list;
                }).catch(error => {
                    this.$message.error(this.$t(error.data.message));
                })
            },
           
        }
    }
</script>

<style scoped>

</style>
