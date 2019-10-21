<template>
    <div class="Administrator">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
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
                <!--<div class="handle-box">-->
                <el-form :inline="true" :model="data" class="demo-form-inline">
                    <!--<el-form-item label="筛选网站">-->
                        <!--<el-select v-model="data.region" placeholder="请选择网站">-->
                            <!--<el-option label="区域一" value="shanghai"></el-option>-->
                            <!--<el-option label="区域二" value="beijing"></el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="搜索">-->
                        <!--<el-input v-model="input" placeholder="请输入内容"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item>-->
                        <!--<el-button type="primary" @click="onSubmit">查询</el-button>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item style="float: right;">-->
                    <el-form-item>
                        <el-button type="primary" @click="addAdmin">新增</el-button>
                    </el-form-item>


                </el-form>

                <!--</div>-->
            </div>
            <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column
                    label="昵称"
                    width="180">
                    <template slot-scope="scope">
                        <span>{{scope.row.uid["username"]}} ({{scope.row.uid["id"]}})</span>
                    </template>
                </el-table-column>

                <el-table-column prop="uid" label="手机号">
                    <template slot-scope="scope" v-if="scope.row.uid">
                        <span v-if="!scope.row.uid">--</span>
                        <span v-if="scope.row.uid">{{scope.row.uid["mobile"]?scope.row.uid["mobile"]:scope.row.uid["email"]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="uid" label="上次登录时间">
                    <template slot-scope="scope" v-if="scope.row.uid">
                        <span v-if="!scope.row.uid">--</span>
                        <span v-if="scope.row.uid">{{scope.row.uid["mobile"]?scope.row.uid["mobile"]:scope.row.uid["email"]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="uid" label="上次登录ip">
                    <template slot-scope="scope" v-if="scope.row.uid">
                        <span v-if="!scope.row.uid">--</span>
                        <span v-if="scope.row.uid">{{scope.row.uid["mobile"]?scope.row.uid["mobile"]:scope.row.uid["email"]}}</span>
                    </template>
                </el-table-column>

                <!--<el-table-column prop="level" label="级别">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-tag v-if="scope.row.level==0">用户</el-tag>-->
                        <!--<el-tag v-if="scope.row.level==1">管理</el-tag>-->
                        <!--<el-tag v-if="scope.row.level==2">超级管理</el-tag>-->
                        <!--<el-tag v-if="scope.row.level==3">客服</el-tag>-->
                    <!--</template>-->
                <!--</el-table-column>-->

                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="delAdmin(scope.row._id)">删除
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

        <!-- 编辑弹出框 -->
        <el-dialog :title="'添加管理'" :visible.sync="editVisible" :close-on-click-modal="false" width="30%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="昵称">
                    <el-input v-model="form.account"></el-input>
                </el-form-item>
                <el-form-item label="登录密码">
                    <el-input v-model="form.pas"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.tel"></el-input>
                </el-form-item>
                    <!--<el-form-item label="设置级别">-->
                        <!--<el-select v-model="form.level">-->
                            <!--<el-option :key="k" :label="v" v-for="(v,k) in levelList" :value="k"></el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Administrator",
        data() {
            return {
                resultList: [],
                totalItems: 0,
                loading: true,
                data: {
                    user: '',
                    region: ''
                },
                form: {},
                selectWeb: '',
                editVisible: false,
                levelList: {1: '管理', 2: '超级管理', 3: '客服'}
            }
        }, mounted() {
            this.getSiteInfoList()
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

            getSiteInfoList() {
                this.$axios({
                    method: 'get',
                    url: '/admin/siteInfoList'
                }).then(result => {
                    this.stWebList = result.data.resultList;
                    this.selectWeb = this.stWebList[0]._id;
                    this.getData();
                }).catch(error => {
                    this.$message.error(error.data.message);
                })
            },
            // 获取数据
            getData() {
                this.$axios({
                    method: 'get',
                    url: '/admin/administrators?siteId=' + this.selectWeb
                }).then(result => {
                    // this.resultList = result.data;
                    let data = {};
                    let list = [];
                    result.data.forEach(function (v, k) {
                        data = v;
                        for (let i in v) {
                            if (!v[i] && !0) {
                                data[i] = v[i] = '--';
                            }
                        }
                        list.push(data)
                    });
                    this.resultList = list;
                    this.totalItems = result.data.totalItems;
                    this.loading = false;
                }).catch(error => {
                    this.$message.error(error.data.message);
                })
            },
            // 新增
            addAdmin() {
                this.editVisible = true;
            },
            // 修改
            handleEdit(){
                this.editVisible = true;
            },
            onSubmit() {
                if(!this.form.account || !this.form.level) return this.$message.error('信息不能为空');
                this.$axios({
                    method: 'post',
                    url: '/admin/addAdmin',
                    data: {
                        account: this.form.account,
                        siteId: this.selectWeb,
                        level: this.form.level
                    }
                }).then(result => {
                    this.getData();
                    this.$message.success('添加成功');
                    this.form = {};
                    this.editVisible = false;
                }).catch(error => {
                    if(error.data.message) this.$message.error(error.data.message);
                });
            },
            // 删除管理员
            delAdmin(id) {
                if(!id) return;
                this.$confirm('你确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        method: 'post',
                        url: '/admin/delAdmin',
                        data: {
                            id:id
                        }
                    }).then(result => {
                        this.getData();
                        this.$message.success('删除成功');
                    }).catch(error => {
                        this.$message.error(error.data.message);
                    });
                }).catch(() => {
                });
            }
        }

    }
</script>

<style scoped>

</style>
