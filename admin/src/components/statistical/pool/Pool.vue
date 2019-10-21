<template>
    <div class="link">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>财务管理</el-breadcrumb-item>
                <el-breadcrumb-item>资金池</el-breadcrumb-item>
                <el-breadcrumb-item>查看资金</el-breadcrumb-item>
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
                <el-button type="primary" @click="add()">新增</el-button>
            </div>

            <el-table :data="resultList" border v-loading="loading" class="table">
                <el-table-column prop="coin" label="币种" sortable>
                </el-table-column>
                <el-table-column prop="amount" label="数量">
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row,-1)">释放
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
        <el-dialog :title="selectType==1?'补充':selectType==-1?'释放':'新增'" @close="closeDialog('form')"
                   :close-on-click-modal="false" :visible.sync="editVisible"
                   width="600px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item prop="coin" label="币种">
                    <el-select :disabled="selectType==1 || selectType==-1" filterable clearable v-model="form.coin" placeholder="请选择币种">
                        <el-option :label="k" v-for="(v,k) in $store.state.coins" :key="k" :value="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="amount" label="数量">
                    <el-input v-model="form.amount"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmit('form')" :loading="editBtnLoad">确 定</el-button>
                <el-button @click="editVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import _ from "lodash"

    export default {
        name: "linkSettings",
        data() {
            return {
                form: {},
                selectType: '',
                resultList: [],
                totalItems: 0,
                loading: true,
                selectCoin: '',
                currentPage: 1,
                datas: {},
                editBtnLoad: false,
                editVisible: false,
                rules: {
                    coin: [
                        {required: true, message: '请选择币种', trigger:  'blur'},
                    ],
                    amount: [
                        {required: true, message: '数量不能为空', trigger:  'blur'}
                    ]
                }
            }
        }, mounted() {
            this.getData()
        },
        methods: {
            // 弹窗关闭事件
            closeDialog(formName) {
                if(formName)
                this.resetForm(this,formName);
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },

            // 新增
            add() {
                this.selectType = '';
                this.editVisible = true;
            },
            // 获取数据
            getData() {
                this.loading=true;
                // this.$axios({
                //         method: 'get',
                //         url: '/admin/bonusPoolList',
                //         params: {
                //             p: this.currentPage
                //         }
                //     }
                // ).then(result => {
                //     this.loading=false;
                //     this.resultList = result.data.resultList;
                //     this.totalItems = result.data.totalItems;
                // }).catch(error => {
                //     if (error && error.data.message)
                //         this.$message.error(this.$t(error.data.message));
                // })
            },
            //验证通过就执行
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.selectType) {
                            if (!this.form.coin || !this.form.amount) return this.$message.error('参数不能为空');
                            // this.$axios({
                            //         method: 'post',
                            //         url: '/admin/setBonusPool',
                            //         data: {
                            //             amount: this.selectType * this.form.amount,
                            //             coin: this.form.coin
                            //         }
                            //     }
                            // ).then(result => {
                            //     this.getData();
                            //     this.$message.success(this.selectType == -1 ? '释放成功' : '补充成功');
                            //     this.editVisible = false;
                            // }).catch(error => {
                            //     if (error && error.data.message)
                            //         this.$message.error(this.$t(error.data.message));
                            // })
                        } else {
                            this.addSubmit()
                        }
                    } else {
                        return false;
                    }
                });
            },

            // 新增
            addSubmit() {
                if (!this.form.coin || !this.form.amount) return this.$message.error('参数不能为空');
                // this.$axios({
                //         method: 'post',
                //         url: '/admin/setBonusPool',
                //         data: {
                //             action: 'add',
                //             amount: this.form.amount,
                //             coin: this.form.coin
                //         }
                //     }
                // ).then(result => {
                //     this.getData();
                //     this.$message.success('添加成功');
                //     this.editVisible = false;
                // }).catch(error => {
                //     if (error && error.data.message)
                //         this.$message.error(this.$t(error.data.message));
                // })
            },
            handleEdit(item, type) {
                this.form = _.cloneDeep(item);
                this.selectType = type;
                this.editVisible = true;
            }
        }
    }
</script>

<style scoped>

</style>
