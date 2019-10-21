<template>
    <div class="link">
        <el-dialog :title="'设置解锁规则 '+(form.coin?form.coin:'')" @close="closeDialog('form')"
                   :close-on-click-modal="false"
                   :visible.sync="editVisible"
                   width="600px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item prop="coin" label="选择币种">
                    <el-select v-model="form.coin" filterable clearable :disabled="type=='edit'">
                        <el-option :label="k" v-for="(v,k) in $store.state.coins" :value="k" :key="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="startTime" label="解锁时间">
                    <el-date-picker
                        v-model="form.startTime"
                        type="datetime"
                        value-format="timestamp"
                        placeholder="解锁时间" style="width: 100%;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="interval" label="释放间隔">
                    <el-input v-model="form.interval"></el-input>
                </el-form-item>
                <el-form-item prop="times" label="解锁次数">
                    <el-input v-model="form.times"></el-input>
                </el-form-item>
                <el-form-item prop="isEnable" label="启用规则">
                    <el-switch v-model="form.isEnable"></el-switch>
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
                <el-breadcrumb-item>解锁规则</el-breadcrumb-item>
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
                <el-button @click="addUnlock" :disabled="getPerms('lock:unlock:add')">新增</el-button>
            </div>
            <!--列表-->
            <el-table :data="resultList" border v-loading="loading" class="table">
                <el-table-column prop="coin" label="币种" sortable>
                </el-table-column>
                <el-table-column prop="startTime" label="解锁时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.startTime | toTimeStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="interval" label="释放间隔">
                </el-table-column>
                <el-table-column prop="isEnable" label="是否启用规则">
                    <template slot-scope="scope">
                        <span>{{scope.row.isEnable==1?'是':'否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="times" label="解锁次数">
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="edit(scope.row)">修改
                        </el-button>
                        <!--<el-button type="text" icon="el-icon-delete" class="red" @click="distribution(scope.row.name)">分配-->
                        <!--</el-button>-->
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
                loading: false,
                selectCoin: '',
                datas: {},
                type: '',
                editBtnLoad: false,
                editVisible: false,
                rules: {
                    coin: [
                        {required: true, message: '请选择币种', trigger: 'blur'},
                    ],
                    startTime: [
                        {required: true, message: '请选择解锁时间', trigger: 'blur'},
                    ],
                    interval: [
                        {required: true, message: '参数不能为空', trigger: 'blur'},
                    ],
                    times: [
                        {required: true, message: '参数不能为空', trigger: 'blur'},
                    ]
                }
            }
        }, mounted() {
            this.getData();
        },
        methods: {
            // 关闭弹窗重置表单
            closeDialog(formName) {
                if (formName) {
                    this.resetForm(this, formName);
                }
            },
            // 获取数据
            getData() {
                this.$axios({
                    method: 'get',
                    url: '/admin/coinLockRule/list'
                }).then(result => {
                    this.resultList = result.data.resultList;
                }).catch(error => {
                    if (error && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                })
            },
            // 确定操作
            onSubmit() {
                this.$axios({
                        method: 'post',
                        url: '/admin/coinLockRule/add',
                        data: this.form
                    }
                ).then(result => {
                    this.$message.success('设置成功');
                    this.getData();
                    this.editVisible = false;
                }).catch(error => {
                    if (error && error.data.message)
                        this.$message.error(this.$t(error.data.message));
                })
            },
            addUnlock() {
                this.form={};
                this.type = 'add';
                this.editVisible = true;
            },
            edit(item) {
                this.type = 'edit';
                this.form = _.clone(item);
                if (this.form.isEnable == 1) {
                    this.$set(this.form, 'isEnable', true)
                } else {
                    this.$set(this.form, 'isEnable', false)
                }
                this.editVisible = true;
            }
        }
    }
</script>

<style scoped>

</style>
