<template>
    <div class="users">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>第三方平台</el-breadcrumb-item>
                <el-breadcrumb-item>充提记录</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button-group class="pull-right" style="margin-top: -21px">
                <el-tooltip class="item" effect="dark" content="导出表格" placement="top">
                    <el-button icon="el-icon-download">导出</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
                    <el-button :icon="'el-icon-refresh'" @click="getData">刷新
                    </el-button>
                </el-tooltip>
            </el-button-group>
        </div>
        <div class="container">
            <!--操作与搜索-->
            <div class="plugins-tips">
                    <el-input placeholder="可搜索邮箱/手机号/ID/真实姓名" @keyup.enter.native="onSearch" clearable style="width: 400px" v-model="search.findText"
                              class="input-with-select">
                        <el-select v-model="search.coin" slot="prepend" filterable clearable placeholder="请选择">
                            <el-option :label="k" v-for="(v,k) in $store.state.coins" :key="k" :value="k"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
                    </el-input>
            </div>
            <!--充提切换-->
            <el-tabs v-model="action" type="card" @tab-click="handleClick">
                <el-tab-pane :label="`充值`" name="deposit">
                    <el-table :data="resultList" border class="table"
                              v-loading="loading" ref="multipleTable">
                        <el-table-column label="时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.date | toTimeStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="用户">
                            <template slot-scope="scope">
                                <span v-if="scope.row.toUser">{{scope.row.toUser.mobile?scope.row.toUser.mobile:scope.row.toUser.email}}（{{scope.row.toUser.id}}）</span>
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
                                <span>{{scope.row.date | toTimeStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="账户">
                            <template slot-scope="scope">
                                <span v-if="scope.row.fromUser">
                                    {{scope.row.fromUser.mobile?scope.row.fromUser.mobile:scope.row.fromUser.email}} ({{scope.row.fromUser["id"]}})
                                </span>
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
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini"
                                           v-if="scope.row.result==1||scope.row.result==3"
                                           type="text"
                                           icon="el-icon-edit"
                                           @click="reSendWithdrawal(scope.row)">重发
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-tab-pane>
                <!--分页-->
                <div class="pagination">
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
                data: {},//搜索出来的用户信息
                search: {},//搜索数据
                code: '', //验证码
                _id: '',

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

            getData() {
                this.$axios({
                    method: 'get',
                    url: '/admin/3rd/history/' + this.action,
                    params: {
                        text: this.search.findText,
                        coin: this.search.coin,
                        p: this.currentPage
                    }
                }).then(result => {
                    this.resultList = result.data.resultList;
                    this.totalItems = result.data.totalItems;
                    this.loading = false;
                }).catch(error => {
                    this.$message.error(this.$t(error.data.message));
                })
            },
            // 搜索数据
            onSearch() {
                if (!this.search.coin && !this.search.findText) return;
                this.getData();
            },

            // 把验证码赋值过来
            setCode(code) {
                this.code = code;
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
