<template>
    <div class="Administrator">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>特权账户</el-breadcrumb-item>
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
                    <el-form-item label="筛选网站">
                        <el-select v-model="data.selectWeb" placeholder="请选择网站">
                            <el-option v-for="item in stWebList" :label="item.title" :key="item._id" :value="item._id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                    <el-form-item style="float: right;">
                        <el-button type="primary" @click="addAdmin">新增</el-button>
                    </el-form-item>

                </el-form>
                <!--</div>-->
            </div>
            <el-table :data="resultList" border class="table" v-loading="loading" ref="multipleTable">
                <el-table-column
                    label="用户名"
                    width="180">
                    <template slot-scope="scope">
                        <span>{{scope.row.username}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="uid" label="真实姓名">
                    <template slot-scope="scope">
                        <span>{{scope.row.truename | noData}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="level" label="优惠">
                    <template slot-scope="scope">
                        <el-tag>交易手续费:{{scope.row.fees.trade}}</el-tag>

                    </template>
                </el-table-column>

                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="del(scope.row._id)">删除
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
        <el-dialog :title="(dialogType=='add'?'添加特权账户':'修改 - '+form.username)" @close="closeDialog('form')"
                   :visible.sync="editVisible"
                   :close-on-click-modal="false" width="30%">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="对方账户" v-if="dialogType!='edit'" prop="userAccount">
                    <el-input v-model="form.userAccount" placeholder="可输入UID/手机号/邮箱"
                              @input="getInfo(form.userAccount)"></el-input>
                    <div class="el-form-item__error" v-if="toUserInfo.account">
                        {{toUserInfo.account}}
                    </div>
                </el-form-item>
                <el-form-item label="交易手续费" prop="fees.trade">
                    <el-input v-model="form.fees.trade" placeholder="0.1%写成0.001"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form',dialogType)">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import _ from "lodash"

    export default {
        name: "Administrator",
        data() {
            return {
                resultList: [],
                totalItems: 0,
                loading: true,
                data: {
                    selectWeb: ''
                },
                form: {
                    fees: {}
                },
                toUserInfo: {},
                dialogType: '',
                currentPage: 1,
                stWebList: [],
                editVisible: false,
                rules: {
                    userAccount: [
                        {required: true, message: '账号不能为空', trigger: 'blur'},
                    ],
                    // trade: [
                    //     {required: true, message: '信息不能为空', trigger: ['change', 'blur']},
                    // ]
                }
            }
        }, mounted() {
            this.getSiteInfoList()
        },
        methods: {
            // 关闭弹窗重置表单
            closeDialog(formName) {
                this.clearUSerInfo();
                if (formName)
                    this.resetForm(this, formName);
            },
            clearUSerInfo() {
                this.$set(this.toUserInfo, 'account', '');
                this.toUserInfo = {};
            },
            // 获取单个用户信息
            getInfo(account) {
                this.clearUSerInfo();
                if (!account) return;

                this.getUserInfo(this, account, (item) => {
                    this.toUserInfo = item;
                    this.$set(this.toUserInfo, 'account', item.mobile || item.email);
                });
            },
            // 搜索
            search() {
                this.getData();
            },
            // 获取网站
            getSiteInfoList() {
                this.$axios({
                    method: 'get',
                    url: '/admin/siteInfoList'
                }).then(result => {
                    this.stWebList = result.data.resultList;
                    this.data.selectWeb = this.stWebList[0]._id;
                    this.getData();
                }).catch(error => {
                    if (error && error.data.message) {
                        this.$message.error(this.$t(error.data.message));
                    }
                })
            },
            // 获取数据
            getData() {
                this.loading = true;
                this.$axios({
                    method: 'get',
                    url: '/admin/privilegedUser/list',
                    params: {
                        siteId: this.data.selectWeb,
                        p: this.currentPage
                    }
                }).then(result => {
                    this.resultList = result.data.resultList;
                    this.totalItems = result.data.totalItems;
                    this.loading = false;
                }).catch(error => {
                    if (error && error.message) {
                        this.$message.error(this.$t(error.data.message));
                    }
                })
            },
            // 新增
            addAdmin() {
                this.form={fees: {}};
                this.dialogType = 'add';
                this.editVisible = true;
            },
            // 修改
            handleEdit(item) {
                this.dialogType = 'edit';
                this.editVisible = true;
                this.form = _.cloneDeep(item);
            },
            //验证通过就执行
            submitForm(formName, type) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (type == 'add') {
                            this.addSubmit()
                        } else {
                            this.editSubmit();
                        }
                    } else {
                        return false;
                    }
                });
            },
            addSubmit() {
                if(!this.toUserInfo._id) return;
                this.$axios({
                    method: 'post',
                    url: '/admin/privilegedUser/add',
                    data: {
                        uid: this.toUserInfo._id,
                        trade: this.form.fees.trade
                    }
                }).then(result => {
                    this.getData();
                    this.$message.success('添加成功');
                    this.editVisible = false;
                }).catch(error => {
                    if (error.data.message) this.$message.error(this.$t(error.data.message));
                });
            },
            editSubmit() {
                if (!this.form._id) return;
                this.$axios({
                    method: 'post',
                    url: '/admin/privilegedUser/add',
                    data: {
                        id: this.form._id,
                        trade: this.form.fees.trade
                    }
                }).then(result => {
                    this.getData();
                    this.$message.success('添加成功');
                    this.editVisible = false;
                }).catch(error => {
                    if (error.data.message) this.$message.error(this.$t(error.data.message));
                });
            },
            // 删除特权用户
            del(id) {
                if (!id) return;
                this.$confirm('你确定删除吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        method: 'post',
                        url: '/admin/privilegedUser/del',
                        data: {
                            id: id
                        }
                    }).then(result => {
                        this.getData();
                        this.$message.success('删除成功');
                    }).catch(error => {
                        this.$message.error(this.$t(error.data.message));
                    });
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
