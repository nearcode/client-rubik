<template>
    <div class="info">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>项目管理</el-breadcrumb-item>
                <el-breadcrumb-item>参与记录</el-breadcrumb-item>
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
                <el-form :inline="true" ref="form" :model="formInline" @submit.native.prevent  class="demo-form-inline">
                    <!--<el-form-item>-->
                        <!--<el-input placeholder="" clearable v-model="findText"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item>-->
                        <!--<el-button type="submit" icon="el-icon-search" @click="getData"></el-button>-->
                    <!--</el-form-item>-->
                    <el-form-item>
                    <el-input placeholder="请输入内容" clearable v-model="findText">
                        <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
                    </el-input>
                    </el-form-item>
                    <el-form-item>
                            <el-tag  size="small" type="primary">参与数量 {{totalItems | noData}}</el-tag>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column
                    label="时间"
                    width="400"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                    <span>{{scope.row.date | toTimeStr}}</span>
                </template>
                </el-table-column>

                <el-table-column label="项目" width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag>{{scope.row.pId.title}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="username" label="用户账号" width="150">
                    <template slot-scope="scope">
                        <el-tooltip placement="top">
                            <div slot="content" class="name-wrapper">
                                <p>真实姓名: {{ scope.row.uid.truename | noData }}</p>
                            </div>

                            <span>{{scope.row.uid.username}} ({{scope.row.uid.id}})</span>
                        </el-tooltip>
                    </template>
                </el-table-column>

                <el-table-column label="投资金额" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.amount}}{{scope.row.pId.coin}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="150" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.pId.status==2">进行中</span>
                        <span v-if="scope.row.pId.status==3">成功</span>
                        <span v-if="scope.row.pId.status==5">已退款</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="disable(scope.row)">退款
                        </el-button>
                        <!--<el-button type="text" icon="el-icon-delete" class="red"-->
                        <!--@click="delAdmin(scope.row._id)">删除-->
                        <!--</el-button>-->
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
        name: "Article",
        data() {
            return {
                formInline: {},
                loading: true,
                currentPage: 1,
                resultList: [],
                totalItems: 0,
                findText:''
            }
        }, mounted() {
            this.getData();
        },
        methods: {
            // 获取数据
            getData() {
                this.loading=true;
                this.$axios({
                    method: 'get',
                    url: '/admin/project/getSupporters/all',
                    params:{
                        keyword:this.findText,
                        p:this.currentPage
                    }
                }).then(result => {
                    this.resultList = result.data.resultList;
                    this.totalItems = result.data.totalItems;
                    this.loading = false;
                }).catch(error => {
                    if(error && error.data.message){
                        this.$message.error(this.$t(error.data.message));
                    }
                })
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            // 删除
            disable(item){
                this.$confirm('你确定要给ID为“'+item.uid.id+'”账号的项目（'+item.pId.title+'）退款？','提示', {}).then(() => {
                        this.$axios({
                            method: 'post',
                            url: '/admin/project/unsubscribe',
                            data: {
                                id: item._id
                            }
                        }).then(result => {
                            this.getData();
                            this.$message.success('退款成功');
                        }).catch(error => {
                            if (error && error.data.message) {
                                this.$message.error(this.$t(error.data.message));
                            }
                        })
                }).catch(error =>{

                })
            }
        }

    }
</script>

<style scoped>

</style>
