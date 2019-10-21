<template>
    <div class=" At_the_bottom">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>释放记录</span>
            </div>
            <div class="text item">
                <!--操作-->
                <el-table :data="resultList" v-loading="loading" ref="table" style="width: 100%">
                     <template slot="empty">
                  <i class="icon-no-data"></i>
                 <p>暂无数据</p>
                  </template>
                       <el-table-column label="时间" align="center">
                        <template slot-scope="scope">
                             <i class="el-icon-time"></i>
                            {{scope.row.create | toTimeStr}}
                        </template>
                    </el-table-column>

                    <el-table-column label="锁仓名称">
                        <template slot-scope="scope">
                            {{scope.row | getDictValue('ruleName')}}
                        </template>
                    </el-table-column>

                    <el-table-column label="币种">
                        <template slot-scope="scope">
                            {{scope.row | getDictValue('coin') }}
                        </template>
                    </el-table-column>

                    <el-table-column label="数量">
                        <template slot-scope="scope">
                            {{scope.row | getDictValue('amount') | autoNumber}}
                            <el-tag v-if="scope.row.memo"> {{scope.row | getDictValue('memo') }}</el-tag>
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
    import lockApi from "@/api/lock"
    import {mapState} from "vuex"

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
                    let result = await lockApi.unlockHistory({
                          p: this.currentPage
                    });

                    this.loading = false;
                    this.resultList = result.data;
                    this.totalItems = result.count;
                } catch (e) {
                  
                }
            },
            // 取消挂单
            cancelOrder(id) {
                // this.$confirm('你确定取消吗？').then(async () => {
                //     try {
                //         let result = await lockApi.marketCancel(id);
                //         this.getData();
                //         this.$notify.success('取消成功');
                //     } catch (e) {
                //         console.log(e)
                //     }
                // }).catch(() => {

                // })
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
