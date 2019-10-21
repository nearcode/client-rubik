<template>
    <div class="users">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-home"></i>首页</el-breadcrumb-item>
                <el-breadcrumb-item>钱包管理</el-breadcrumb-item>
                <el-breadcrumb-item>历史记录</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <el-tooltip class="item" effect="dark" content="导出表格" placement="top">
                    <el-button icon="el-icon-download" @click="excel">导出</el-button>
                </el-tooltip>
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
            </div>
            <!--充提切换-->
            <el-tabs v-model="action" type="card" @tab-click="handleClick">
                <el-tab-pane :label="`充值`" name="deposit">
                    <el-table :data="resultList" border class="table"
                              v-loading="loading" ref="multipleTable">
                        <el-table-column label="时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.create | toTimeStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="uid" label="用户">
                            <template slot-scope="scope">
                                {{scope.row.uid}}
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

                </el-tab-pane>
                <el-tab-pane :label="`提现`" name="withdrawal">
                    <!--用户列表highlight-current-row-->
                    <el-table :data="resultList" border class="table"
                              v-loading="loading" ref="multipleTable">
                        <el-table-column label="时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.create | toTimeStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="账户">
                            <template slot-scope="scope">
                                {{scope.row.uid}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="coin" label="币种">
                        </el-table-column>
                        <el-table-column label="数量">
                            <template slot-scope="scope">
                                <span>{{scope.row.amount | autoFixed}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="地址">
                            <template slot-scope="scope">
                                <p>{{scope.row.address}}</p>
                                <p class="red">{{scope.row.tx_hash}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" align="center">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.result==-1">待处理
                                </el-tag>
                                <el-tag type="warning" v-if="scope.row.result==0">处理中
                                </el-tag>
                                <el-tag type="success" v-if="scope.row.result==1">成功
                                </el-tag>
                                <el-tag type="danger" v-if="scope.row.result==2">取消
                                </el-tag>
                            </template>
                        </el-table-column>
                        <!--<el-table-column label="操作" align="center">-->
                            <!--<template slot-scope="scope">-->
                                <!--<el-button size="mini"-->
                                           <!--v-if="scope.row.result==1||scope.row.result==3"-->
                                           <!--type="text"-->
                                           <!--icon="el-icon-edit"-->
                                           <!--@click="reSendWithdrawal(scope.row)">重发-->
                                <!--</el-button>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                    </el-table>

                </el-tab-pane>
                <!--分页-->
                <div class="pagination" v-if="totalItems>1">
                    <el-pagination background @current-change="handleCurrentChange" :key="action" :page-size="20"
                                   layout="prev, pager, next"
                                   :total="totalItems">
                    </el-pagination>
                </div>
            </el-tabs>
        </div>

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
    import walletApi from "@/api/wallet";

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
        mounted() {
            this.loading = true;
            this.getData();
        },
        beforeDestroy() {
            // clearTimeout(this._inter)
        },
        methods: {
              // 把验证码赋值过来
            setCode(code) {
                this.code = code;
            },
            // 导出
            excel() {
                // this.export({
                //     url: '/wallet/history/' + this.action,
                //     title: this.action == 'deposit' ? '充值记录' : '提现记录',
                //     data: {
                //         text: this.search.findText,
                //         coin: this.search.coin,
                //         p: this.currentPage
                //     }
                // })
            },
            // 切换tabs
            handleClick(tab, event) {
                this.action = tab.name;
                this.resultList= [];
                this.getData();
            },
            // 分页导航
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            // 获取初始数据
            async getData() {
                let params = {
                    type:this.action==='deposit'?1:-1,
                    text: this.search.findText,
                    coin: this.search.coin,
                    p: this.currentPage
                };

                try {
                    let result = await walletApi.walletHistory(params);
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
            // 重发
            reSendWithdrawal(item) {
                let account = '';
                if (item && item.fromUser) {
                    account = item.fromUser.mobile ? item.fromUser.mobile : item.fromUser.email;
                }
                this.$confirm('您确定要帮用户"' + account + '"重发吗？', {}).then(result => {
                    this.$axios({
                        method: 'post',
                        url: '/admin/reSendWithdrawal',
                        data: {
                            id: item._id,
                            authCode: this.code
                        }
                    }).then(result => {
                        this.getData();
                        this.$message.success('重发成功');
                    }).catch(error => {
                        this.code = '';
                        let layer = this.$refs.verifyDialog;
                        layer.init(this);
                        if (error.data.authType) {
                            layer.show({
                                authType: error.data.authType,
                                callback: this.reSendWithdrawal,
                                data: item
                            });
                        }
                        if (error && error.data.message) {
                            this.$message.error(this.$t(error.data.message));
                        }
                    })
                }).catch(error => {

                })
            }
        }
    }
</script>

<style scoped>

</style>
