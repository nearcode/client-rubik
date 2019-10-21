<template>
    <div class="link">
        <el-dialog :title="'分配'" @close="closeDialog('form')" :close-on-click-modal="false" :visible.sync="editVisible"
                   width="600px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item prop="userAccount" label="对方账户">
                    <el-input v-model="form.userAccount" @input="getInfo(form.userAccount)"></el-input>
                    <div class="el-form-item__error" v-if="toUserInfo.account">
                        {{toUserInfo.account}}
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmit('form')"  @keyup.enter.native="onSubmit('form')" :loading="editBtnLoad">确 定</el-button>
                <el-button @click="editVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>项目管理</el-breadcrumb-item>
                <el-breadcrumb-item>分红</el-breadcrumb-item>
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
            <el-table :data="resultList" border v-loading="loading" class="table">
                <el-table-column prop="name" label="名称" sortable>
                </el-table-column>
                <el-table-column prop="dividends" label="已分红">
                    <template slot-scope="scope">
                        <el-popover
                            placement="top-start"
                            width="200"
                            trigger="hover">
                            <span v-for="(v,k) in scope.row.dividends">
                                <el-col :span="8">{{k}}:</el-col>
                                <el-col :span="16">{{v | autoNumber}}</el-col>
                            </span>
                            <div slot="reference">{{scope.row.dividends | toCNY}}</div>
                        </el-popover>

                    </template>
                </el-table-column>
                <el-table-column prop="nextDividends" label="未分红">
                    <template slot-scope="scope">
                        <el-popover
                            placement="top-start"
                            width="200"
                            trigger="hover">
                            <span v-for="(v,k) in scope.row.nextDividends">
                                <el-col :span="8">{{k}}:</el-col>
                                <el-col :span="16">{{v | autoNumber}}</el-col>
                            </span>
                            <span  slot="reference">{{scope.row.nextDividends | toCNY}}</span>
                        </el-popover>

                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="share(scope.row.name)">分红
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"  @click="distribution(scope.row.name)">分配
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>
    import _ from "lodash"

    export default {
        name: "share",
        data() {
            return {
                currentPage: 1,
                resultList: [],
                form: {
                    _id: ''
                },
                totalItems: 0,
                loading: true,
                selectCoin: '',
                datas: {},
                editBtnLoad: false,
                editVisible: false,
                toUserInfo:{},
                rules: {
                    userAccount: [
                        {required: true, message: '账户不能为空', trigger:  ['blur','change']},
                    ],
                }

            }
        }, mounted() {
            this.getData();
        },
        methods: {
            // 弹窗关闭事件
            closeDialog(formName) {
                if(formName)
                    this.resetForm(this,formName);
            },
            // 获取数据
            getData() {
                this.loading=true;
                this.$axios({
                    method: 'get',
                    url: '/stock/list'
                }).then(result => {
                    this.loading=false;
                    this.resultList = result.data;
                    // this.totalItems=result.data.totalItems;
                }).catch(error => {
                    if (error && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                })
            },
            // 清除用户信息
            clearUSerInfo() {
                this.$set(this.toUserInfo, 'account', '');
                this.toUserInfo = {};
            },
            // 获取用户_id
            getInfo(account) {
                this.clearUSerInfo();
                if (!account) return;


                this.getUserInfo(this, account, (item) => {
                    this.toUserInfo = item;
                    this.$set(this.toUserInfo, 'account', item.mobile || item.email);
                })
            },
            //验证通过就执行
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if ( !this.toUserInfo._id) return;
                        this.$axios({
                                method: 'post',
                                url: '/admin/shareToOneUser',
                                data: {
                                    name: this.form.name,
                                    uid: this.toUserInfo._id
                                }
                            }
                        ).then(result => {
                            this.$message.success('保存成功');
                            this.editVisible = false;
                        }).catch(error => {
                            if (error && error.data.message)
                                this.$message.error(this.$t(error.data.message));
                        })
                    } else {
                        return false;
                    }
                });
            },
            distribution(name) {
                this.form.name = name;
                // this.form = _.clone(item);
                this.editVisible = true;
                this.clearUSerInfo();
            },
            share(name) {
                this.$confirm('你确定要分红吗?', '提示', {}).then(() => {
                    this.$axios({
                        method: 'post',
                        url: '/admin/share',
                        data: {
                            name: name
                        }
                    }).then(result => {
                        this.$message.success('分红成功')
                    }).catch(error => {
                        this.$message.error(this.$t(error.data.message));
                    })
                }).catch(() => {

                })
            }
        }
    }
</script>

<style scoped>

</style>
