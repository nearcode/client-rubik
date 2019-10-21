<template>
    <!--:before-close="handleClose"-->
    <div class="Administrator">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>C2C交易</el-breadcrumb-item>
                <el-breadcrumb-item>审核列表</el-breadcrumb-item>
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
            <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable">
                <el-table-column label="时间">
                    <template slot-scope="scope">
                        <span>
                            {{scope.row.create |toTimeStr}}
                           </span>
                    </template>
                </el-table-column>

                <el-table-column label="用户">
                    <template slot-scope="scope">
                        <span>{{scope.row |getDictValue('uid')}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="服务商">
                    <template slot-scope="scope">
                        <span>{{scope.row.merchants | getDictValue('uid')}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="币种">
                    <template slot-scope="scope">
                        <span>{{scope.row | getDictValue('coin')}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="数量">
                    <template slot-scope="scope">
                        <span>{{scope.row | getDictValue('amount')}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" :disabled="getPerms('c2c:verify:audit')" @click="pass(scope.row._id)">通过
                        </el-button>
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
    import c2cApi from '@/api/c2c'

    export default {
        name: "ServiceProviders",
        data() {
            return {
                resultList: [],
                loading: false,
                currentPage: 1,
                totalItems: 0,
            }
        }, mounted() {
            this.getData();
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            async getData() {
                let data = {
                    p: this.currentPage,
                    amount: 1000,
                    result: -1
                };
                try {
                    let result = await c2cApi.getC2cHistory(data);
                    this.resultList = result.data;
                    this.totalItems = result.count;
                    this.loading = false;
                } catch (e) {

                }
            },
            pass(id) {
                if(!id) return;
                this.$confirm('你确定通过吗', '提示', {}).then(async () => {
                    let data = {
                        result: 0,
                        id
                    };
                    try {
                        let result = await c2cApi.setHistoryResult(data);
                        this.$message.success('已通过');
                        this.getData();
                    } catch (e) {

                    }
                })
            }

        },

    }
</script>

<style scoped>

</style>
