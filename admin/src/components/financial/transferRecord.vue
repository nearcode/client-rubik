<template>
    <div class="PaymentRecords">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>财务管理</el-breadcrumb-item>
                <el-breadcrumb-item>转账记录</el-breadcrumb-item>
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
                        <el-input placeholder="可搜索从/到/币种">

                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="resultList" border class="table"
                      v-loading="loading" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column prop="date" label="时间">
                    <template slot-scope="scope">
                        {{scope.row.date | toTimeStr}}
                    </template>
                </el-table-column>

                <el-table-column label="从" prop="price" align="center">
                    <template slot-scope="scope">
                        <span>
                            {{scope.row['uid.username'] | noData}}
                           ({{scope.row.uid}})
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="到" prop="amount" align="center">
                    <template slot-scope="scope">
                        <span>
                            {{scope.row['toUid.username'] | noData}}
                           ({{scope.row.toUid}})
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="币种" align="center">
                    <template slot-scope="scope">
                        {{scope.row.coin}}
                    </template>
                </el-table-column>
                <el-table-column label="数量" align="center">
                    <template slot-scope="scope">
                        {{scope.row.amount}}
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
    import adminApi from "@/api/admin"

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
                data: {
                    deposit: {},
                    withdraw: {}
                },

            }
        },
        mounted() {
            this.getData();
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
                let p=this.currentPage;
                try {
                    let result= await adminApi.transferHistory(p);
                    this.resultList = result.data;
                    this.totalItems = result.count;
                    this.loading = false;
                }catch(e){

                }
                // this.$axios({
                //     method: 'get',
                //     url: '/transfer/history',
                //     params: {
                //         startDate: this.form.startTime,
                //         endDate: this.form.endTime,
                //         merchant: this.form.merchant,
                //         p: this.currentPage,
                //     }
                // }).then(result => {
                //     this.resultList = result.data.data;
                //     this.totalItems = result.data.count;
                //     this.loading = false;
                // }).catch(error => {
                //     this.$message.error(this.$t(error.data.message));
                // })
            },

        }
    }
</script>

<style scoped>

</style>
