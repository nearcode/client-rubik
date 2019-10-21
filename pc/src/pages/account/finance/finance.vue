<template>
    <div class=" At_the_bottom">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>财务记录</span>
            </div>
            <div class="text item">

                <!--操作-->
                <div class="plugins-tips">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item label="选择类别">
                            <el-select v-model="formInline.method" filterable clearable style="width: 120px;"
                                       placeholder="选择类别">
                                <el-option v-for="(v,k) in typeList" :key="k" :label="v.title"
                                           :value="v.val"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择币种">
                            <el-select v-model="formInline.coin" filterable clearable style="width: 150px;"
                                       placeholder="选择币种">
                                <el-option v-for="(v,k) in coins" :key="k" :label="k" :value="k"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-date-picker
                                    v-model="formInline.date"
                                    type="datetimerange"
                                    :picker-options="pickerOptions"
                                    value-format="timestamp"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    align="right">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">查询</el-button>
                        </el-form-item>
                    </el-form>

                </div>

                <el-table :data="resultList" v-loading="loading" border ref="table" style="width: 100%">
                     <template slot="empty">
                  <i class="icon-no-data"></i>
                 <p>暂无数据</p>
                  </template>
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            暂无数据
                        </template>
                    </el-table-column>

                    <el-table-column label="币种">
                        <template slot-scope="scope">
                            {{scope.row.coin}}
                        </template>
                    </el-table-column>

                    <el-table-column label="时间" align="center" width="180">
                        <template slot-scope="scope">
                            {{scope.row.create | toTimeStr}}
                        </template>
                    </el-table-column>

                    <el-table-column label="类型" align="center">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.type==1?'success':'danger'">
                                {{typeStatus(scope.row.method,scope.row.type)}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    =
                    <el-table-column label="数量">
                        <template slot-scope="scope">
                            {{scope.row.amount | autoNumber}}
                        </template>
                    </el-table-column>

                    <el-table-column label="类别" align="center">
                        <template slot-scope="scope">
                            <span v-for="(v,k) in typeList" v-if="scope.row.method==v.val">
                                {{v.title}}
                            </span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column label="实际到账">-->
                    <!--<template slot-scope="scope">-->
                    <!--{{(scope.row.price*scope.row.amount) |autoNumber}}-->
                    <!--</template>-->
                    <!--</el-table-column>-->

                    <!--<el-table-column label="操作">-->
                    <!--<template slot-scope="scope">-->
                    <!--&lt;!&ndash;{{scope.row.amount}}&ndash;&gt;-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                </el-table>
                <!--分页-->
                <div class="pagination" v-if="totalItems>1">
                    <el-pagination background @current-change="handleCurrentChange" :page-size="20"
                                   layout="prev, pager, next"
                                   :total="totalItems">
                    </el-pagination>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import exchangeApi from "@/api/exchange"
    import baseApi from "@/api/base"
    import {mapState} from 'vuex'

    export default {
        name: "Account",
        data() {
            return {
                resultList: [],
                formInline: {
                    date: []
                },
                loading: false,
                currentPage: 1,
                totalItems: 0,
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                typeList: [
                    {val: 1, title: '转账', result: {1: '转入', '-1': '转出'}},
                    {val: 2, title: '钱包', result: {1: '充值', '-1': '提现'}},
                    {val: 4, title: 'C2C', result: {1: '买入', '-1': '卖出'}},
                    {val: 11, title: '交易', result: {1: '买入', '-1': '卖出'}},
                    {val: 5, title: '糖果', result: {1: '糖果'}},
                    {val:7, title: '赠送', result: {1: '赠送'}}
                ]

            }
        },
        computed: {
            ...mapState(['coins']),
        },
        mounted() {
            this.getData();
        },
        methods: {
            // 判断状态
            typeStatus(method, type) {
                if (!method || !type) return;
                for (let item of this.typeList) {
                    if (item.val == method) return item.result[type];
                }
            },
            async getData() {
                this.loading = true;
                let date = this.formInline.date;
                try {
                    let data = {
                        p: this.currentPage,
                        coin: this.formInline.coin,
                        method: this.formInline.method,
                        startTime: date && date[0],
                        endTime: date && date[1],
                    };
                    let result = await baseApi.getMoneyHistory(data);
                    this.loading = false;
                    this.resultList = result.data;
                    this.totalItems = result.count;
                } catch (e) {

                }
            },
            onSubmit() {
                this.getData();
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            handleCheck(row) {
                const $table = this.$refs.table;
                $table.toggleRowExpansion(row);
                $table.toggleRowSelection(row);
            },
        }
    }

</script>

<style>

</style>
