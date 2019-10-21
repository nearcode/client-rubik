<template>
    <div class="link">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>社区掌柜</el-breadcrumb-item>
                <el-breadcrumb-item>掌柜列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--&lt;!&ndash;操作与搜索&ndash;&gt;-->
            <!--<div class="plugins-tips">-->
            <!--<el-button  type="primary" @click="addLink()">新增</el-button>-->
            <!--</div>-->
            <el-table :data="$store.state.links" border v-loading="loading" class="table">
                <el-table-column prop="title" label="用户" sortable>
                    <template slot-scope="scope">
                        {{scope.row.formUser.truename}} ({{scope.row.formUser.id}})
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="申请时间">

                </el-table-column>
                <el-table-column prop="url" label="是否公布真实姓名">
                </el-table-column>
                <el-table-column prop="url" label="所在城市">
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
    import _ from "lodash"

    export default {
        name: "shopkeeper",
        data() {
            return {
                resultList: [],
                totalItems: 0,
                loading: false,
                currentPage: 1
            }
        }, mounted() {
            this.getData()
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            // 重置表单
            resetForm(formName) {
                if (this.$refs[formName])
                    this.$nextTick(() => {
                        this.$refs[formName].resetFields();
                    })
            },
            getData() {
                this.$axios({
                    method: 'get',
                    url: '/admin/shopKeeperList',
                    params: {
                        p: this.currentPage
                    }
                }).then(result => {
                    this.resultList = result.data.resultList;
                    this.totalItems = result.data.totalItems;
                }).catch(error => {
                    if (error && error.data.message) {
                        this.$message.error(this.$t(error.data.message));
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
