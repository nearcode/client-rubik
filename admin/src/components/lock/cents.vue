<template>
    <div class="link">
        <el-dialog :title="'分币'" @close="resetForm('form')" :close-on-click-modal="false"
                   :visible.sync="editVisible"
                   width="600px">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item prop="coin" label="选择币种">
                    <el-select v-model="form.coin" filterable clearable placeholder="请选择">
                        <el-option :label="k" v-for="(v,k) in $store.state.coins" :value="k" :key="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="toUser" label="对方账户">
                    <el-input v-model="form.toUser" @input="getInfo()"></el-input>
                    <div class="el-form-item__error" v-if="toUserInfo.account">
                        {{toUserInfo.account}}
                    </div>
                </el-form-item>
                <el-form-item prop="amount" label="数量">
                    <el-input v-model="form.amount"></el-input>
                </el-form-item>
                <el-form-item prop="remark" label="备注">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmit" @keyup.enter.native="onSubmit"
                           :loading="editBtnLoad">确 定</el-button>
                <el-button @click="editVisible = false">取 消</el-button>
            </span>
        </el-dialog>


        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>锁仓管理</el-breadcrumb-item>
                <el-breadcrumb-item>分币记录</el-breadcrumb-item>
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
                <el-button @click="addCoinToLocked" :disabled="getPerms('lock:cents:cents')">分币</el-button>
            </div>
            <!--列表-->
            <el-table :data="resultList" border v-loading="loading" class="table">
                <el-table-column prop="coin" label="币种" sortable>
                </el-table-column>
                <el-table-column prop="account" label="账户">
                    <template slot-scope="scope">
                        <span>{{scope.row.toUser | toAccount}} ({{scope.row.toUser.id}})</span>
                    </template>
                </el-table-column>
                <el-table-column prop="amount" label="数量">
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.result}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="times" label="时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.date | toTimeStr}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--验证弹框组件-->
        <verify ref="verifyDialog" v-on:code="setCode"></verify>
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
                toUserInfo:{},
                totalItems: 0,
                loading: false,
                selectCoin: '',
                editBtnLoad: false,
                editVisible: false,
                code:'',
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            // 把验证码赋值过来
            setCode(code) {
                this.code = code;
            },
            // 获取数据
            getData() {
                this.$axios({
                    method: 'get',
                    url: '/admin/lockCoinsList'
                }).then(result => {
                    this.resultList = result.data.resultList;
                    // this.totalItems=result.data.totalItems;
                }).catch(error => {
                    if (error && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                })
            },
            // 重置表单
            resetForm(formName) {
                if (this.$refs[formName])
                    this.$nextTick(() => {
                        this.$refs[formName].resetFields();
                    })
            },
            getInfo() {
                if (!this.form.toUser) return;
                this.$set(this.toUserInfo,'account','');
                this.getUserInfo(this,this.form.toUser,(item)=>{
                    this.toUserInfo= item;
                    this.$set(this.toUserInfo,'account',item.mobile || item.email);
                })
            },
            // 确定操作
            onSubmit() {
                if (!this.form.coin || !this.form.amount || !this.toUserInfo._id) return this.$message.error('参数不能为空');
                this.$axios({
                        method: 'post',
                        url: '/admin/addLockCoinToUser',
                        data: {
                            coin: this.form.coin,
                            amount: this.form.amount,
                            toUser: this.toUserInfo._id,
                            remark: this.form.remark,
                            authCode: this.code
                        }
                    }
                ).then(result => {
                    this.getData();
                    this.$message.success('分币成功');
                    this.editVisible = false;
                    resetForm('form');
                }).catch(error => {
                    this.code='';

                    let layer = this.$refs.verifyDialog;

                    layer.init(this);
                    if (error.data.authType) {
                        layer.show({
                            authType: error.data.authType,
                            callback: this.onSubmit
                        });
                    }
                    if (error && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                })
            },
            // 分币
            addCoinToLocked() {
                this.editVisible = true;
            },
        }
    }
</script>

<style scoped>

</style>
