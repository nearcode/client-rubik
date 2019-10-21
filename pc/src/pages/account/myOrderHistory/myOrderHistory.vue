<template>
    <div class=" At_the_bottom">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>成交记录</span>
            </div>
            <div class="text item">
                <!--操作-->
                <div class="plugins-tips">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item label="选择交易对">
                            <el-select v-model="formInline.pair" filterable clearable style="width: 150px;"
                                       placeholder="选择交易对">
                                <el-option v-for="(v,k) in markets" :key="k" :label="v.coin+'/'+v.base"
                                           :value="v.coin+'_'+v.base">
                                    {{v.coin+'/'+v.base}}
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-date-picker
                                    v-model="formInline.date"
                                    type="datetimerange"
                                    :picker-options="pickerOptions"
                                    range-separator="至"
                                    value-format="timestamp"
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

                <el-table :data="resultList" v-loading="loading" ref="table" style="width: 100%"
                          :default-sort="{prop: 'date', order: 'descending'}">
                           <template slot="empty">
                  <i class="icon-no-data"></i>
                 <p>暂无数据</p>
                  </template>
                    <el-table-column label="币种">
                        <template slot-scope="scope">
                            {{scope.row.market | toString}}
                        </template>
                    </el-table-column>

                    <el-table-column label="时间" align="center" width="180">
                        <template slot-scope="scope">
                            {{scope.row.create | toTimeStr}}
                        </template>
                    </el-table-column>

                    <el-table-column label="类型">
                        <template slot-scope="scope" v-if="scope.row">
                            <span v-if="scope.row.type===0">买入/卖出</span>
                            <span class="font_green" v-if="scope.row.type===1">买入</span>
                            <span class="font_red"  v-if="scope.row.type===-1">卖出</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="价格">
                        <template slot-scope="scope">
                            {{scope.row.price | autoNumber}}
                        </template>
                    </el-table-column>

                    <el-table-column label="数量">
                        <template slot-scope="scope">
                            {{scope.row.amount |autoNumber}}
                        </template>
                    </el-table-column>

                    <el-table-column label="成交额">
                        <template slot-scope="scope">
                            {{(scope.row.price*scope.row.amount) |autoNumber}}
                        </template>
                    </el-table-column>

                    <el-table-column label="手续费">
                        <template slot-scope="scope">
                            {{scope.row | getDictValue('fee')}}  {{scope.row | getDictValue('feeCoin')}} 
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
        </el-card>
    </div>
</template>

<script>
    import exchangeApi from "@/api/exchange"
    import {mapState} from 'vuex';

    export default {
        name: "Account",
        data() {
            return {
                resultList: [],
                currentPage: 1,
                totalItems: 0,
                loading: false,
                formInline: {
                    date: []
                },
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
            }
        },
        computed: {
            ...mapState(['coins', 'markets']),
        },
        mounted() {
            this.getData();
        },
        methods: {
            async getData() {
                this.loading = true;

                let date = this.formInline.date;
                try {
                    let data = {
                        market: this.formInline.pair,
                        startTime: date && date[0],
                        endTime: date && date[1],
                        p: this.currentPage
                    };
                    let result = await exchangeApi.myOrderHistory(data);
                    this.loading = false;
                    this.resultList = result.data;
                    this.totalItems = result.count;
                } catch (e) {

                }
            },
            onSubmit() {
                this.getData();
            },
            handleCheck(row) {
                const $table = this.$refs.table;
                $table.toggleRowExpansion(row);
                $table.toggleRowSelection(row);
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
        }
    }

</script>

<style>
    .el-table__expand-column .cell {
        display: none;
    }
</style>
