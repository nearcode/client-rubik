<template>
    <div class="users">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>财务管理</el-breadcrumb-item>
                <el-breadcrumb-item>赠送记录</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <!--<el-tooltip class="item" effect="dark" content="导出表格" placement="top">-->
                    <!--<el-button icon="el-icon-download" @click="excel">导出</el-button>-->
                <!--</el-tooltip>-->
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button icon="el-icon-refresh" @click="getData">刷新</el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <!--操作与搜索-->
            <div class="plugins-tips">
                <div style="margin-right: 15px;max-width: 400px;display: inline-block">
                    <el-input placeholder="可搜索邮箱/手机号/ID/真实姓名" @keyup.enter.native="onSearch" clearable
                              v-model="search.findText"
                              class="input-with-select">
                        <el-select v-model="search.coin" filterable slot="prepend" clearable placeholder="请选择">
                            <el-option :label="k" v-for="(v,k) in $store.state.coins" :key="k" :value="k"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
                    </el-input>
                </div>
                <el-button type="primary" icon="delete" class="handle-del mr10"
                           @click="openSelect('deposit')"  :disabled="getPerms('finance:give:give')">赠送
                </el-button>
                <el-button type="danger" icon="delete" :disabled="getPerms('finance:give:move')" class="handle-del mr10"
                           @click="openSelect('withdraw')">移动
                </el-button>
            </div>
            <!--充提切换-->
                    <el-table :data="resultList" border class="table"
                              v-loading="loading" ref="multipleTable">
                        <el-table-column label="时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.date | toTimeStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="用户">
                            <template slot-scope="scope">
                                <span>{{scope.row.uid}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="coin" label="币种">
                        </el-table-column>
                        <el-table-column label="数量">
                            <template slot-scope="scope">
                                <span>{{scope.row.amount | autoFixed}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" prop="disable.all" align="center">
                            <template slot-scope="scope">
                                <el-tag type="warning" v-if="scope.row.result==5">超时
                                </el-tag>
                                <el-tag type="danger" v-if="scope.row.result==0">未支付
                                </el-tag>
                                <el-tag type="success" v-if="scope.row.result==1">成功
                                </el-tag>
                                <el-tag type="warning" v-if="scope.row.result==2">确认中
                                </el-tag>
                            </template>
                        </el-table-column>
                        <!--<el-table-column prop="" label="类型">-->
                        <!--</el-table-column>-->
                    </el-table>

                <!--分页-->
                <div class="pagination" v-if="totalItems>1">
                    <el-pagination background @current-change="handleCurrentChange" :key="action" :page-size="20"
                                   layout="prev, pager, next"
                                   :total="totalItems">
                    </el-pagination>
                </div>
        </div>

        <!--&lt;!&ndash; 编辑弹出框 &ndash;&gt;-->
        <el-dialog :title="'添加'+(form.type=='deposit'?'赠送':'移动')" @close="closeDialog('form')"
                   :visible.sync="editVisible"
                   :close-on-click-modal="false" width="600px">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="币种" prop="coin">
                    <el-select v-model="form.coin" filterable clearable>
                        <el-option :label="k" v-for="(v,k) in $store.state.coins" :key="k" :value="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对方账户" prop="toUser">
                    <el-input v-model="form.toUser" @input="getInfo(form.toUser)"
                              placeholder="可输入用户ID手机号或邮箱"></el-input>
                    <div class="el-form-item__error" v-if="data.account">
                        {{data.account}}
                    </div>
                </el-form-item>
                <el-form-item prop="address" label="提现地址" v-if="form.type=='withdraw'">
                    <el-input v-model="form.address" placeholder="提现地址"></el-input>
                </el-form-item>
                <el-form-item prop="amount" label="转币数量">
                    <el-input v-model="form.amount" placeholder="请输入数量"></el-input>
                </el-form-item>
                <el-form-item prop="remark" label="备注" v-if="form.type=='deposit'">
                    <el-input v-model="form.remark" placeholder="备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('form')" :loading="editBtnLoad">确 定</el-button>
                <el-button @click="editVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" v-if="false" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
        <!--验证弹框组件-->
        <verify ref="verifyDialog" v-on:code="setCode"></verify>
    </div>
</template>

<script>
    import Verify from "src/components/common/verify";
    import adminApi from "@/api/admin";
    import {mapState} from 'vuex';

    export default {
        name: "ChargedHistory",
        components: {
            Verify
        },
        data() {
            return {
                resultList: [],
                currentPage: 1,
                is_search: false,
                editVisible: false,
                totalItems: 0,
                delVisible: false,
                loading: true,
                editBtnLoad: false,
                action: 'deposit', //默认充值
                form: {},//表单
                data: {},//搜索出来的用户信息
                search: {},//搜索数据
                code: '', //验证码
                _id: '',
                rules: {
                    coin: [
                        {required: true, message: '请选择币种', trigger: ['change', 'blur']},
                    ],
                    toUser: [
                        {required: true, message: '对方账户不能为空', trigger: ['change', 'blur']}
                    ],
                    address: [
                        {required: true, message: '地址不能为空', trigger: ['change', 'blur']}
                    ],
                    amount: [
                        {required: true, message: '数量不能为空', trigger: ['change', 'blur']}
                    ]
                }
            }
        },
        computed: {
            ...mapState(['level']),
        },
        mounted() {

            this.getData();
        },
        beforeDestroy() {
            // clearTimeout(this._inter)
        },
        methods: {
            // // 导出
            // excel() {
            //     this.export({
            //         url: '/wallet/history/' + this.action,
            //         title: this.action == 'deposit' ? '充值记录' : '提现记录',
            //         data: {
            //             text: this.search.findText,
            //             coin: this.search.coin,
            //             p: this.currentPage
            //         }
            //     })
            // },
            // 弹窗关闭事件
            closeDialog(formName) {
                this.data = {};
                this.resetForm(this, formName)
            },
            // 获取单个用户信息
            getInfo(account) {
                if (!account) return;
                this.$set(this.data, 'account', '');
                this.data = {};
                this.getUserInfo(this, account, (item) => {
                    this.data = item;
                    this.$set(this.data, 'account', item.mobile || item.email);
                })
            },
            // 切换tabs
            handleClick(tab, event) {
                this.action = tab.name;
                this.getData();
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            // 获取初始数据
            async getData() {
                this.loading = true;
                let params = {
                    text: this.search.findText,
                    coin: this.search.coin,
                    p: this.currentPage
                };
                try {
                    let result = await adminApi.giveHistory(params);
                    this.resultList = result.data;
                    this.totalItems = result.count;
                    this.loading = false;
                } catch (e) {

                }
            },
            // 搜索数据
            onSearch() {
                if (!this.search.coin && !this.search.findText) return;
                this.getData();
            },
            // 打开弹框
            openSelect(type) {
                this.form.type = type;
                this.editVisible = true;
            },
            // 把验证码赋值过来
            setCode(code) {
                this.code = code;
            },
            //验证通过就执行
            submitForm(formName) {
                if (formName)
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.pay()
                        } else {
                            return false;
                        }
                    });
            },
            // 数据提交
            pay() {
                if (this.form.amount < 0.00000001 && this.form.type == 'deposit') return this.$message.error('充值数量不能小于0.00000001' + this.form.coin);
                // if (!this.data.id) return this.$message.error('用户不存在');

                if (this.data.account) {
                    this.editBtnLoad = true;
                    let Tips='';
                    if(this.form.type == 'deposit'){
                        Tips='赠送';
                    }else {
                        Tips='移动';
                    }
                    this.$confirm('你确定要'+Tips+'"' + this.data.account + '" ' + this.form.amount + this.form.coin + '?', {}).then(async () => {
                        let data = {
                            coin: this.form.coin,
                            amount: this.form.amount,
                            touid: this.data.id,
                            remark: this.form.remark,
                            authCode: this.code
                        };
                        try {
                            let result = await adminApi.balanceAdd(data);
                            this.editBtnLoad = false;
                            this.getData();
                            this.editVisible = false;
                            this.$message.success(Tips+'成功');
                        } catch (e) {
                            this.editBtnLoad = false;
                            this.code = '';
                            let layer = this.$refs.verifyDialog;
                            layer.init(this);
                            if (e.verify) {
                                layer.show({
                                    authType: e.verify,
                                    callback: this.submitForm,
                                    typeName: 'form'
                                });
                            }
                        }
                    }).catch(() => {
                        this.editBtnLoad = false;
                    })

                }
            },
        }
    }
</script>

<style scoped>

</style>
