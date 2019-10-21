<template>
    <div class="PaymentRecords">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>支付记录</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <el-tooltip class="item" effect="dark" content="导出表格" placement="top">
                    <el-button icon="el-icon-download">导出</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <!--操作与搜索-->
            <div class="plugins-tips">
                <el-form :inline="true" :model="form" class="demo-form-inline">
                    <el-form-item label="选择币种">
                        <el-select v-model="form.selectCoin" filterable clearable placeholder="请选择">
                            <el-option :label="k" v-for="(v,k) in $store.state.coins" :key="k" :value="k"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="起始时间">
                        <el-date-picker
                            v-model="form.start_time"
                            type="datetime"
                            placeholder="选择起始日期时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="结束时间">
                        <el-date-picker
                            v-model="form.end_time"
                            type="datetime"
                            placeholder="选择结束日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>

            </div>
            <!--用户列表highlight-current-row-->
            <el-table :data="resultList" border class="table"
                      v-loading="loading" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column prop="coin" label="币种">
                </el-table-column>
                <el-table-column label="时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.date | toTimeStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="支出用户">
                    <template slot-scope="scope">
                        <span v-if="scope.row.fromUser">
                            {{scope.row.fromUser["username"]}}
                           ({{scope.row.fromUser["id"]}})
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="收入用户">
                    <template slot-scope="scope">
                        <span>
                            {{scope.row.toUser["username"]}}
                           ({{scope.row.toUser["id"]}})
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="数量" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.amount | autoFixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" prop="balance" align="center">
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
    export default {
        name: "PaymentRecords",
        data() {
            return {
                resultList: [],
                currentPage: 1,
                multipleSelection: [],
                totalItems: 0,
                delVisible: false,
                loading: true,
                form: {
                    selectCoin: '',
                    start_time: '',
                    end_time:''
                }
            }
        },
        mounted() {
            this.getData();
        },

        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();

            }, handleSelectionChange(val) {
                this.multipleSelection = val;
                // this.$refs.multipleTable.toggleRowSelection(row);
                console.log(JSON.stringify(this.multipleSelection))

            },
            // 获取数据
            getData() {
                this.$axios({
                    method: 'get',
                    url: '/pay/admin/history?p=' + this.currentPage
                }).then(result => {
                    this.resultList = result.data.resultList;
                    this.totalItems = result.data.totalItems;
                    this.loading = false;
                }).catch(error => {
                    this.$message.error(this.$t(error.data.message));
                })
            },
            onSubmit() {
                this.getData();
            }
        }
    }
</script>

<style scoped>

</style>
