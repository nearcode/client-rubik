<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>财务管理</el-breadcrumb-item>
                <el-breadcrumb-item>资金池</el-breadcrumb-item>
                <el-breadcrumb-item>补充记录</el-breadcrumb-item>
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
            <!--&lt;!&ndash;操作与搜索&ndash;&gt;-->
            <!--<div class="plugins-tips">-->
            <!--<el-button type="primary" @click="add()">新增</el-button>-->
            <!--</div>-->

            <el-table :data="resultList" border v-loading="loading" class="table">
                <el-table-column prop="amount" label="用户">
                    <template slot-scope="scope">
                        <span>
                         <el-tooltip placement="top">
                            <div slot="content" class="name-wrapper">
                                <p>真实姓名: {{ scope.row.users.truename | noData }}</p>
                            </div>

                            <span>{{scope.row.users.username}} ({{scope.row.users.id}})</span>
                        </el-tooltip>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="coin" label="币种" sortable>
                </el-table-column>
                <el-table-column prop="amount" label="数量">
                </el-table-column>

                <el-table-column prop="type" label="状态">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.type == 1">释放</el-tag>
                        <el-tag v-if="scope.row.type == -1">补充</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="时间" sortable>
                    <template slot-scope="scope">
                        <span>{{scope.row.date | toTimeStr}}</span>
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
        name: "AddRecords",
        data() {
            return {
                loading: true,
                totalItems: 0,
                resultList: [],
                currentPage: 1
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },

            // 获取数据
            getData() {
                this.loading = true;
                // this.$axios({
                //         method: 'get',
                //         url: '/admin/bonusPoolHistoryList',
                //         params: {
                //             p: this.currentPage
                //         }
                //     }
                // ).then(result => {
                //     this.loading = false;
                //     this.resultList = result.data.resultList;
                //     this.totalItems = result.data.totalItems;
                // }).catch(error => {
                //     if (error && error.data.message)
                //         this.$message.error(this.$t(error.data.message));
                // })
            },
        }
    }
</script>

<style scoped>

</style>
