<template>
    <div class="Administrator">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <el-tooltip class="item" effect="dark" content="导出表格" placement="top">
                    <el-button icon="el-icon-download">导出</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <!--操作与搜索-->
            <div class="plugins-tips">
                <!--<div class="handle-box">-->
                <el-form :inline="true" :model="data" class="demo-form-inline">
                    <el-form-item label="筛选网站" v-if="false">
                        <el-select v-model="data.selectWeb" @change="getData" placeholder="请选择网站">
                            <el-option v-for="item in stWebList" :label="item.title" :key="k" :value="item._id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="筛选等级">
                        <el-select v-model="data.level" clearable placeholder="请选择等级">
                            <el-option v-for="(v,k) in $store.state.adminRoleList" :key="k" :label="v.name" :value="v.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <!--<el-form-item>-->
                    <!--<el-button type="primary" @click="search">查询</el-button>-->
                    <!--</el-form-item>-->
                    <el-form-item style="float: right;">
                        <el-button type="primary" @click="addAdmin" :disabled="getPerms('sys:admin:add')">新增</el-button>
                    </el-form-item>

                </el-form>
                <!--</div>-->
            </div>
            <el-table :data="resultList.filter(item => !data.level || item.level==data.level)" border class="table"
                      v-loading="loading" ref="multipleTable">
                <el-table-column
                    label="用户名"
                    width="180">
                    <template slot-scope="scope">
                        <el-tooltip placement="top">
                            <div slot="content" class="name-wrapper">
                                <p>真实姓名: {{ scope.row.truename | noData }}</p>
                            </div>
                            <span>{{scope.row.username}} ({{scope.row.uid}})</span>
                        </el-tooltip>
                    </template>
                </el-table-column>

                <el-table-column prop="uid" label="账户">
                    <template slot-scope="scope" v-if="scope.row">
                        <span>{{scope.row | toAccount}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="level" label="级别">
                    <template slot-scope="scope">
                        <el-tag v-for="(v,k) in $store.state.adminRoleList" :key="k" v-if="v.id==scope.row.roleId">{{v.name}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)" :disabled="getPerms('sys:admin:edit')">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="delAdmin(scope.row._id)" :disabled="getPerms('sys:admin:del')">删除
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
        <!--编辑弹框-->
        <UpDateDialog ref="dateDialog" v-on:upData="setData"></UpDateDialog>
    </div>
</template>

<script>
    import UpDateDialog from "./AdminDialog";
    import adminApi from "@/api/admin"
    import _ from "lodash"

    export default {
        name: "Administrator",
        components: {
            UpDateDialog
        },
        data() {
            return {
                resultList: [],
                totalItems: 0,
                currentPage:1,
                loading: true,
                data: {
                    selectWeb: ''
                },
                form: {},
                stWebList: [],
            }
        }, mounted() {
            this.getSiteInfoList();

        },
        methods: {
            // 把弹框数据赋值过来
            setData(data) {
                this.form = _.cloneDeep(data)
            },

            // 搜索
            search() {
                this.getData();
            },
            // 获取网站
            getSiteInfoList() {
                // this.$axios({
                //     method: 'get',
                //     url: '/siteInfoList'
                // }).then(result => {
                //     this.stWebList = result.data.data;
                //     this.data.selectWeb = this.stWebList[0].siteId;
                this.getData();
                // }).catch(error => {
                //
                // })
            },
            // 获取数据
            async getData() {
                this.loading = true;
                try {
                    // siteId: this.data.selectWeb
                    let result = await adminApi.adminList();
                    this.resultList = result.data;
                    this.totalItems = result.count;
                    this.loading = false;
                } catch (e) {

                }
            },
            // 新增
            addAdmin() {
                let layer = this.$refs.dateDialog;
                layer.init(this);
                layer.show({
                    dialogType: 'add',
                    info: '',
                    callback: this.addSubmit
                })
            },
            // 修改
            handleEdit(item) {
                let layer = this.$refs.dateDialog;
                layer.init(this);
                item.level = item.roleId.toString();
                layer.show({
                    dialogType: 'edit',
                    info: _.cloneDeep(item),
                    callback: this.editSubmit
                })
            },
            // 添加确认
            async addSubmit() {
                if (!this.form.level || !this.form.toUser) return this.$message.error('信息不能为空');
                let account = this.form.toUser;
                let level = this.form.level;
                // siteId: this.data.selectWeb,

                try {
                    let result = await adminApi.addAdmin(account, level);
                    this.getData();
                    this.$message.success('添加成功');
                    this.$refs.dateDialog.cancel();
                } catch (e) {

                }
            },
            async editSubmit() {
                if (!this.form.level || !this.form.uid) return this.$message.error('信息不能为空');
                let id = this.form.uid, level = this.form.level;
                try {
                    let result = await adminApi.editAdmin(id, level);
                    this.getData();
                    this.$message.success('修改成功');
                    this.$refs.dateDialog.cancel();
                } catch (e) {

                }
            },
            // 删除管理员
            delAdmin(id) {
                if (!id) return;
                this.$confirm('你确定删除吗?', '提示', {
                    closeOnClickModal: false,
                    type: 'warning'
                }).then(async () => {
                    try {
                        let result = await adminApi.delAdmin(id);
                        this.getData();
                        this.$message.success('删除成功');
                    } catch (e) {

                    }
                }).catch(() => {
                });
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
        }

    }
</script>

<style scoped>

</style>
